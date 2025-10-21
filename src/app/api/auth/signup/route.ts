/**
 * API Route: Sign Up
 * POST /api/auth/signup
 */

import { createClient } from '@/lib/supabase/server'
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

    // 1. Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
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
      const { error: profileError } = await supabase.from('students').insert({
        user_id: authData.user.id,
        name,
        email,
        payment_status: 'unpaid',
      })

      if (profileError) {
        return NextResponse.json(
          { error: 'Failed to create student profile' },
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
