/**
 * API Route: Single Course
 * GET /api/courses/[id] - Get a single course
 * PUT /api/courses/[id] - Update a course (admin only)
 * DELETE /api/courses/[id] - Delete a course (super admin only)
 */

import { createClient } from '@/lib/supabase/server'
import { isAdmin } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger'

// GET single course
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient()
    const { id } = await params

    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    }

    return NextResponse.json({ course: data }, { status: 200 })
  } catch (error: any) {
    logger.error('Get course error', { error })
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT update course (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient()
    const { id } = await params

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

    const { data, error } = await supabase
      .from('courses')
      .update(body)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(
      {
        message: 'Course updated successfully',
        course: data,
      },
      { status: 200 }
    )
  } catch (error: any) {
    logger.error('Update course error', { error })
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE course (super admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient()
    const { id } = await params

    // Check authentication
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    // Check if user is super admin
    const { isSuperAdmin } = await isAdmin(user.id)

    if (!isSuperAdmin) {
      return NextResponse.json(
        { error: 'Only super admins can delete courses' },
        { status: 403 }
      )
    }

    const { error } = await supabase.from('courses').delete().eq('id', id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(
      { message: 'Course deleted successfully' },
      { status: 200 }
    )
  } catch (error: any) {
    logger.error('Delete course error', { error })
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
