/**
 * API Route: Single Student
 * GET /api/students/[id] - Get a student
 * PUT /api/students/[id] - Update a student (admin only)
 * DELETE /api/students/[id] - Delete a student (super admin only)
 */

import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import { isAdmin } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger'

const studentSelect = `
  id,
  user_id,
  username,
  name,
  email,
  phone,
  profile_picture_url,
  created_at,
  updated_at,
  course_id,
  payment_status,
  course:courses(*),
  enrollments:student_courses(
    id,
    student_id,
    course_id,
    payment_status,
    enrolled_at,
    updated_at,
    course:courses(
      id,
      name,
      description,
      price,
      duration,
      created_at,
      updated_at
    )
  )
`

// GET single student
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const adminClient = createAdminClient()
    const supabase = await createClient()
    const { id } = await params

    // Check authentication
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { data, error } = await adminClient
      .from('students')
      .select(studentSelect)
      .eq('id', id)
      .single()

    if (error) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 })
    }

    // Check if user is viewing their own profile or is admin
    const { isAdmin: userIsAdmin } = await isAdmin(user.id)
    
    if (data.user_id !== user.id && !userIsAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    return NextResponse.json({ student: data }, { status: 200 })
  } catch (error: any) {
    logger.error('Get student error', { error })
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT update student (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const adminClient = createAdminClient()
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

    const updateData: Record<string, string | null> = {}

    if (typeof body.name === 'string') {
      updateData.name = body.name.trim()
    }

    if (typeof body.email === 'string') {
      updateData.email = body.email.trim()
    }

    if (Object.prototype.hasOwnProperty.call(body, 'phone')) {
      updateData.phone = body.phone ? String(body.phone).trim() : null
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: 'No valid fields provided for update' },
        { status: 400 }
      )
    }

    const { data, error } = await adminClient
      .from('students')
      .update(updateData)
      .eq('id', id)
      .select(studentSelect)
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(
      {
        message: 'Student updated successfully',
        student: data,
      },
      { status: 200 }
    )
  } catch (error: any) {
    logger.error('Update student error', { error })
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE student (super admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const adminClient = createAdminClient()
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
        { error: 'Only super admins can delete students' },
        { status: 403 }
      )
    }

    // Get student to find user_id
    const { data: student } = await adminClient
      .from('students')
      .select('user_id')
      .eq('id', id)
      .single()

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 })
    }

    // Delete student profile (will cascade)
    const { error } = await adminClient.from('students').delete().eq('id', id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // Delete auth user
    await adminClient.auth.admin.deleteUser(student.user_id)

    return NextResponse.json(
      { message: 'Student deleted successfully' },
      { status: 200 }
    )
  } catch (error: any) {
    logger.error('Delete student error', { error })
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
