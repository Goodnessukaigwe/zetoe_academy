/**
 * API Route: Self-Registration (with email verification)
 * POST /api/auth/register
 * For students self-registering (requires email verification)
 */

import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { validateEmail, validatePassword, sanitizeString } from '@/lib/validation'
import { rateLimit, RateLimitPresets, createRateLimitResponse } from '@/lib/rate-limit'
import { logger } from '@/lib/logger'

export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting
    const rateLimitResult = rateLimit(request, RateLimitPresets.AUTH)
    
    if (rateLimitResult.limited) {
      logger.warn('Rate limit exceeded for registration attempt', {
        context: {
          retryAfter: rateLimitResult.retryAfter,
        },
      })
      return createRateLimitResponse(rateLimitResult)
    }

    const { email, password, name } = await request.json()

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

    // Sign up user (email verification required)
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: sanitizedName,
        },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/verify`,
      },
    })

    if (authError) {
      logger.error('Self-registration auth error', authError, {
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

    logger.info('Self-registration successful - verification email sent', {
      context: {
        userId: authData.user.id,
        email: authData.user.email,
      },
    })

    return NextResponse.json(
      {
        message: 'Registration successful! Please check your email to verify your account.',
        requiresVerification: true,
        user: {
          id: authData.user.id,
          email: authData.user.email,
        },
      },
      { status: 201 }
    )
  } catch (error: any) {
    logger.error('Self-registration error', error, {
      context: {
        endpoint: '/api/auth/register',
      },
    })
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
