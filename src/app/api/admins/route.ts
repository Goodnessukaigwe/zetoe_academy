/**
 * API Route: Admins
 * GET /api/admins - Get all admins (admin only)
 * POST /api/admins - Create admin invitation (super admin only)
 */

import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import { isAdmin } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'

// GET all admins
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

    const { data, error } = await adminClient
      .from('admins')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ admins: data }, { status: 200 })
  } catch (error: any) {
    console.error('Get admins error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST create admin invitation (super admin only)
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

    // Check if user is super admin
    const { isSuperAdmin } = await isAdmin(user.id)

    if (!isSuperAdmin) {
      return NextResponse.json(
        { error: 'Only super admins can create admins' },
        { status: 403 }
      )
    }

    const { email, name, role } = await request.json()

    // Validate input (NO password required - admin will set it themselves)
    if (!email || !name) {
      return NextResponse.json(
        { error: 'Email and name are required' },
        { status: 400 }
      )
    }

    // Validate role
    if (role && !['admin', 'super_admin'].includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role. Must be admin or super_admin' },
        { status: 400 }
      )
    }

    // Check if email already exists
    const { data: existingAdmin } = await adminClient
      .from('admins')
      .select('email')
      .eq('email', email)
      .single()

    if (existingAdmin) {
      return NextResponse.json(
        { error: 'Admin with this email already exists' },
        { status: 400 }
      )
    }

    // Create admin record WITHOUT user_id (will be set when admin completes setup)
    const { data: adminData, error: adminError } = await adminClient
      .from('admins')
      .insert({
        name,
        email,
        role: role || 'admin',
        user_id: null, // Will be filled when admin sets password via /admin-invite
      })
      .select()
      .single()

    if (adminError) {
      console.error('Admin creation error:', adminError)
      return NextResponse.json(
        { error: 'Failed to create admin invitation' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        message: 'Admin invitation created successfully',
        admin: adminData,
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Create admin error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
