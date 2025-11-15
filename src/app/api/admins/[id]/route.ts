/**
 * API Route: Single Admin
 * PUT /api/admins/[id] - Update admin (super admin only)
 * DELETE /api/admins/[id] - Delete admin (super admin only)
 */

import { createClient } from '@/lib/supabase/server'
import { isAdmin } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'

// PUT update admin (super admin only)
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

    // Check if user is super admin
    const { isSuperAdmin } = await isAdmin(user.id)

    if (!isSuperAdmin) {
      return NextResponse.json(
        { error: 'Only super admins can update admins' },
        { status: 403 }
      )
    }

    const body = await request.json()

    // Remove fields that shouldn't be updated directly
    delete body.id
    delete body.user_id
    delete body.created_at

    // Validate role if being updated
    if (body.role && !['admin', 'super_admin'].includes(body.role)) {
      return NextResponse.json(
        { error: 'Invalid role. Must be admin or super_admin' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('admins')
      .update(body)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(
      {
        message: 'Admin updated successfully',
        admin: data,
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Update admin error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE admin (super admin only)
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
        { error: 'Only super admins can delete admins' },
        { status: 403 }
      )
    }

    // Get admin to find user_id
    const { data: admin } = await supabase
      .from('admins')
      .select('user_id')
      .eq('id', id)
      .single()

    if (!admin) {
      return NextResponse.json({ error: 'Admin not found' }, { status: 404 })
    }

    // Prevent deleting yourself
    if (admin.user_id === user.id) {
      return NextResponse.json(
        { error: 'You cannot delete yourself' },
        { status: 400 }
      )
    }

    // Delete admin profile
    const { error } = await supabase.from('admins').delete().eq('id', id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // Delete auth user
    await supabase.auth.admin.deleteUser(admin.user_id)

    return NextResponse.json(
      { message: 'Admin deleted successfully' },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Delete admin error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
