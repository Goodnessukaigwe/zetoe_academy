/**
 * API Route: Admin Invitation
 * POST /api/admin-invite
 * Allows invited admins to complete setup by setting password
 */

import { createAdminClient } from '@/lib/supabase/admin'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    const adminClient = createAdminClient()

    // 1. Check if email exists in admins table (without user_id)
    const { data: adminRecord, error: adminCheckError } = await adminClient
      .from('admins')
      .select('*')
      .eq('email', email)
      .single()

    if (adminCheckError || !adminRecord) {
      return NextResponse.json(
        { error: 'No admin invitation found for this email' },
        { status: 404 }
      )
    }

    // 2. Check if admin has already completed setup
    if (adminRecord.user_id) {
      return NextResponse.json(
        { error: 'This admin account is already set up. Please login instead.' },
        { status: 400 }
      )
    }

    // 3. Create auth user with admin client (auto-confirmed email)
    const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        name: adminRecord.name,
        role: adminRecord.role,
      },
    })

    if (authError || !authData.user) {
      console.error('Auth user creation error:', authError)
      return NextResponse.json(
        { error: authError?.message || 'Failed to create auth user' },
        { status: 500 }
      )
    }

    // 4. Update admin record with user_id
    const { error: updateError } = await adminClient
      .from('admins')
      .update({ user_id: authData.user.id })
      .eq('id', adminRecord.id)

    if (updateError) {
      console.error('Admin update error:', updateError)
      // Try to delete the auth user if update fails
      await adminClient.auth.admin.deleteUser(authData.user.id).catch(() => {})
      return NextResponse.json(
        { error: 'Failed to complete admin setup' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        message: 'Admin account setup completed successfully',
        user: authData.user,
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Admin invite error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
