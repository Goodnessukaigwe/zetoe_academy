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
        username,
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

    const body = await request.json()
    const email = String(body.email || '').trim().toLowerCase()
    const password = String(body.password || '')
    const name = String(body.name || '').trim()
    const phone = body.phone ? String(body.phone).trim() : null

    // Validate input
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Email, password, and name are required' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      )
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailPattern.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }

    // Generate unique username using database function
    const { data: usernameData, error: usernameError } = await adminClient
      .rpc('generate_student_username')

    if (usernameError || !usernameData) {
      logger.error('Username generation error', usernameError)
      return NextResponse.json(
        { error: 'Failed to generate username' },
        { status: 500 }
      )
    }

    const generatedUsername = usernameData

    // 1. Create auth user
    const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email (not used for login anymore)
      user_metadata: { name, username: generatedUsername },
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

    // 2. Create student profile with username
    const { data: studentData, error: studentError } = await adminClient
      .from('students')
      .insert({
        user_id: authData.user.id,
        username: generatedUsername,
        name,
        email,
        phone,
        // Keep the student profile free of direct course/payment assignment.
        // Enrollments are created separately through /api/enrollments.
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
