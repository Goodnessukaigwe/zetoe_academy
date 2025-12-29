/**
 * API Route: Students
 * GET /api/students - Get all students (admin only)
 * POST /api/students - Create/register a student (admin only)
 */

import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import { isAdmin } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger'

// GET all students (admin only)
export async function GET() {
  try {
    const adminClient = createAdminClient()
    const supabase = await createClient()

    // Check authentication
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    // Check if user is admin
    const { isAdmin: userIsAdmin } = await isAdmin(user.id)

    if (!userIsAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Optimized: Select only needed columns and add pagination
    const { data, error, count } = await adminClient
      .from('students')
      .select(`
        id,
        name,
        email,
        phone,
        payment_status,
        created_at,
        course:courses(id, name, price)
      `, { count: 'exact' })
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ 
      students: data,
      total: count 
    }, { status: 200 })
  } catch (error: any) {
    logger.error('Get students error', { error })
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST create student (admin only)
export async function POST(request: NextRequest) {
  try {
    const adminClient = createAdminClient()
    const supabase = await createClient()

    // Check authentication
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    // Check if user is admin
    const { isAdmin: userIsAdmin } = await isAdmin(user.id)

    if (!userIsAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { email, password, name, phone, course_id, payment_status } = await request.json()

    // Validate input
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Email, password, and name are required' },
        { status: 400 }
      )
    }

    // 1. Create auth user
    const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email
      user_metadata: { name },
    })

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 })
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: 'Failed to create user' },
        { status: 500 }
      )
    }

    // 2. Create student profile
    const { data: studentData, error: studentError } = await adminClient
      .from('students')
      .insert({
        user_id: authData.user.id,
        name,
        email,
        phone: phone || null,
        course_id: course_id || null,
        payment_status: payment_status || 'unpaid',
      })
      .select(`
        *,
        course:courses(*)
      `)
      .single()

    if (studentError) {
      logger.error('Student profile creation error', studentError)
      // Rollback: delete auth user if profile creation fails
      await adminClient.auth.admin.deleteUser(authData.user.id)
      return NextResponse.json(
        { 
          error: 'Failed to create student profile',
          details: studentError.message 
        },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        message: 'Student created successfully',
        student: studentData,
      },
      { status: 201 }
    )
  } catch (error: any) {
    logger.error('Create student error', { error })
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
