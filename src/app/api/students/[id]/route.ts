/**
 * API Route: Single Student
 * GET /api/students/[id] - Get a student
 * PUT /api/students/[id] - Update a student (admin only)
 * DELETE /api/students/[id] - Delete a student (super admin only)
 */

import { createClient } from '@/lib/supabase/server'
import { isAdmin } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'

// GET single student
export async function GET(
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

    const { data, error } = await supabase
      .from('students')
      .select(`
        *,
        course:courses(*)
      `)
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
    console.error('Get student error:', error)
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

    // Remove fields that shouldn't be updated directly
    delete body.id
    delete body.user_id
    delete body.created_at

    const { data, error } = await supabase
      .from('students')
      .update(body)
      .eq('id', id)
      .select(`
        *,
        course:courses(*)
      `)
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
    console.error('Update student error:', error)
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
    const { data: student } = await supabase
      .from('students')
      .select('user_id')
      .eq('id', id)
      .single()

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 })
    }

    // Delete student profile (will cascade)
    const { error } = await supabase.from('students').delete().eq('id', id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // Delete auth user
    await supabase.auth.admin.deleteUser(student.user_id)

    return NextResponse.json(
      { message: 'Student deleted successfully' },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Delete student error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
