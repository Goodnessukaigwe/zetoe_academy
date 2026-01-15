/**
 * API Route: Sign In
 * POST /api/auth/signin
 */

import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { validateEmail } from '@/lib/validation'
import { rateLimit, RateLimitPresets, createRateLimitResponse } from '@/lib/rate-limit'
import { logger } from '@/lib/logger'

export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting
    const rateLimitResult = rateLimit(request, RateLimitPresets.AUTH)
    
    if (rateLimitResult.limited) {
      logger.warn('Rate limit exceeded for signin attempt', {
        context: {
          retryAfter: rateLimitResult.retryAfter,
        },
      })
      return createRateLimitResponse(rateLimitResult)
    }

    const { email, password } = await request.json()

    // Validate email format
    const emailValidation = validateEmail(email)
    if (!emailValidation.valid) {
      return NextResponse.json(
        { error: emailValidation.error },
        { status: 400 }
      )
    }

    // Validate password exists
    if (!password) {
      return NextResponse.json(
        { error: 'Password is required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Sign in with Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      logger.error('Signin failed', error, {
        context: {
          email,
          errorCode: error.code,
        },
      })
      
      return NextResponse.json({ error: error.message }, { status: 401 })
    }

    // Check if email is verified
    if (!data.user.email_confirmed_at) {
      logger.warn('Login attempt with unverified email', {
        context: {
          userId: data.user.id,
          email: data.user.email,
        },
      })

      // Sign out the user immediately
      await supabase.auth.signOut()

      return NextResponse.json(
        {
          error: 'Please verify your email address before logging in.',
          requiresVerification: true,
          email: data.user.email,
        },
        { status: 403 }
      )
    }

    logger.info('User signed in successfully', {
      context: {
        userId: data.user?.id,
        email: data.user?.email,
      },
    })

    return NextResponse.json(
      {
        message: 'Signed in successfully',
        user: data.user,
        session: data.session,
      },
      { status: 200 }
    )
  } catch (error: any) {
    logger.error('Signin error', error, {
      context: {
        endpoint: '/api/auth/signin',
      },
    })
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
