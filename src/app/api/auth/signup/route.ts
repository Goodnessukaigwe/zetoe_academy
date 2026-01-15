/**
 * API Route: Sign Up (Admin-Created Users)
 * POST /api/auth/signup
 * 
 * This route is for admin-created student accounts.
 * Users created through this route are automatically verified (email_confirm: true).
 * 
 * For self-registration with email verification, use /api/auth/register instead.
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
      logger.warn('Rate limit exceeded for signup attempt', {
        context: {
          retryAfter: rateLimitResult.retryAfter,
        },
      })
      return createRateLimitResponse(rateLimitResult)
    }

    const { email, password, name, role } = await request.json()

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

    // 1. Create auth user with admin client (auto-confirms email)
    const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email
      user_metadata: {
        name: sanitizedName,
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

    // 2. Create profile based on role (default to student)
    const userRole = role || 'student'

    if (userRole === 'student') {
      // Use admin client to bypass RLS when creating initial profile
      const { error: profileError } = await adminClient
        .from('students')
        .insert({
          user_id: authData.user.id,
          name: sanitizedName,
          email,
          payment_status: 'unpaid',
        })

      if (profileError) {
        logger.error('Student profile creation error', profileError, {
          context: { userId: authData.user.id },
        })
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

    logger.info('User created successfully', {
      context: {
        userId: authData.user.id,
        email: authData.user.email,
        role: userRole,
      },
    })

    return NextResponse.json(
      {
        message: 'User created successfully',
        user: authData.user,
      },
      { status: 201 }
    )
  } catch (error: any) {
    logger.error('Signup error', error, {
      context: {
        endpoint: '/api/auth/signup',
      },
    })
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
