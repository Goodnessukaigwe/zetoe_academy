/**
 * API Route: Courses
 * GET /api/courses - Get all courses
 * POST /api/courses - Create a course (admin only)
 */

import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import { isAdmin } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger'

// GET all courses (public)
export async function GET() {
  try {
    const adminClient = createAdminClient()

    const { data, error } = await adminClient
      .from('courses')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ courses: data }, { status: 200 })
  } catch (error: any) {
    logger.error('Get courses error', { error })
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST create course (admin only)
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

    const { name, description, price, duration } = await request.json()

    // Validate input
    if (!name || !price) {
      return NextResponse.json(
        { error: 'Name and price are required' },
        { status: 400 }
      )
    }

    const { data, error } = await adminClient
      .from('courses')
      .insert({
        name,
        description,
        price,
        duration,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(
      {
        message: 'Course created successfully',
        course: data,
      },
      { status: 201 }
    )
  } catch (error: any) {
    logger.error('Create course error', { error })
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
