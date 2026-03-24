/**
 * API Route: Self-Registration (Student)
 * POST /api/auth/register
 *
 * This route allows students to self-register.
 * Creates a student account with auto-generated username and email verification.
 */

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextRequest, NextResponse } from 'next/server'
import { validateEmail, validatePassword, sanitizeString } from '@/lib/validation'
import { rateLimit, RateLimitPresets, createRateLimitResponse } from '@/lib/rate-limit'
import { logger } from '@/lib/logger'

export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting
    const rateLimitResult = rateLimit(request, RateLimitPresets.AUTH)

    if (rateLimitResult.limited) {
      logger.warn('Rate limit exceeded for register attempt', {
        context: {
          retryAfter: rateLimitResult.retryAfter,
        },
      })
      return createRateLimitResponse(rateLimitResult)
    }

    const { name, email, password } = await request.json()

    // Validate email
    const emailValidation = validateEmail(email)
    if (!emailValidation.valid) {
      return NextResponse.json(
        { error: emailValidation.error },
        { status: 400 }
      )
    }

    // Validate password strength
    const passwordValidation = validatePassword(password)
    if (!passwordValidation.valid) {
      return NextResponse.json(
        { error: passwordValidation.error },
        { status: 400 }
      )
    }

    // Validate and sanitize name
    if (!name || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      )
    }

    if (name.length > 100) {
      return NextResponse.json(
        { error: 'Name must be less than 100 characters' },
        { status: 400 }
      )
    }

    const sanitizedName = sanitizeString(name, 100)

    const supabase = await createClient()
    const adminClient = createAdminClient()

    // Check if email already exists
    const { data: existingUser } = await adminClient
      .from('students')
      .select('email')
      .eq('email', email)
      .single()

    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 400 }
      )
    }

    // Generate unique username
    const { data: usernameResult, error: usernameError } = await adminClient
      .rpc('generate_student_username')

    if (usernameError || !usernameResult) {
      logger.error('Username generation failed', usernameError)
      return NextResponse.json(
        { error: 'Failed to generate username' },
        { status: 500 }
      )
    }

    const username = usernameResult

    // 1. Create auth user with admin client (auto-confirms email for now)
    const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm for now (can be changed to false for email verification)
      user_metadata: {
        name: sanitizedName,
        username: username,
      },
    })

    if (authError) {
      logger.error('Auth user creation failed', authError, {
        context: { email },
      })
      return NextResponse.json({ error: authError.message }, { status: 400 })
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: 'Failed to create user' },
        { status: 500 }
      )
    }

    // 2. Create student profile
    const { error: profileError } = await adminClient
      .from('students')
      .insert({
        user_id: authData.user.id,
        name: sanitizedName,
        email: email,
        username: username,
      })

    if (profileError) {
      logger.error('Student profile creation failed', profileError, {
        context: { userId: authData.user.id, email },
      })

      // Clean up the auth user if profile creation fails
      await adminClient.auth.admin.deleteUser(authData.user.id)

      return NextResponse.json(
        { error: 'Failed to create student profile' },
        { status: 500 }
      )
    }

    logger.log('Student registration successful', {
      context: {
        userId: authData.user.id,
        email,
        username,
      },
    })

    return NextResponse.json({
      message: 'Registration successful',
      username: username,
    })

  } catch (error) {
    logger.error('Registration error', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}