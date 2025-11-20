/**
 * API Route: Sign Up
 * POST /api/auth/signup
 */

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { email, password, name, role } = await request.json()

    // Validate input
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Email, password, and name are required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()
    const adminClient = createAdminClient()

    // 1. Create auth user with admin client (auto-confirms email)
    const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email
      user_metadata: {
        name,
      },
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

    // 2. Create profile based on role (default to student)
    const userRole = role || 'student'

    if (userRole === 'student') {
      // Use admin client to bypass RLS when creating initial profile
      const { error: profileError } = await adminClient
        .from('students')
        .insert({
          user_id: authData.user.id,
          name,
          email,
          payment_status: 'unpaid',
        })

      if (profileError) {
        console.error('Student profile creation error:', profileError)
        // Try to delete the auth user if profile creation fails
        await adminClient.auth.admin.deleteUser(authData.user.id).catch(() => {})
        return NextResponse.json(
          { 
            error: 'Failed to create student profile',
            details: profileError.message 
          },
          { status: 500 }
        )
      }
    }

    return NextResponse.json(
      {
        message: 'User created successfully',
        user: authData.user,
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
