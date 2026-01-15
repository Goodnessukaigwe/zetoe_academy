/**
 * API Route: Resend Verification Email
 * POST /api/auth/resend-verification
 * Resends the verification email for unverified accounts
 */

import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { validateEmail } from '@/lib/validation'
import { rateLimit, RateLimitPresets, createRateLimitResponse } from '@/lib/rate-limit'
import { logger } from '@/lib/logger'

export async function POST(request: NextRequest) {
  try {
    // Apply strict rate limiting for email operations
    const rateLimitResult = rateLimit(request, RateLimitPresets.SENSITIVE)
    
    if (rateLimitResult.limited) {
      logger.warn('Rate limit exceeded for resend verification attempt', {
        context: {
          retryAfter: rateLimitResult.retryAfter,
        },
      })
      return createRateLimitResponse(rateLimitResult)
    }

    const { email } = await request.json()

    // Validate email
    const emailValidation = validateEmail(email)
    if (!emailValidation.valid) {
      return NextResponse.json(
        { error: emailValidation.error },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Resend verification email
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/verify`,
      },
    })

    if (error) {
      logger.error('Resend verification error', error, {
        context: { email },
      })
      
      // Don't reveal whether email exists or not
      return NextResponse.json(
        { 
          message: 'If an unverified account exists with this email, a verification link will be sent.',
        },
        { status: 200 }
      )
    }

    logger.info('Verification email resent', {
      context: { email },
    })

    return NextResponse.json(
      {
        message: 'Verification email sent! Please check your inbox.',
      },
      { status: 200 }
    )
  } catch (error: any) {
    logger.error('Resend verification error', error, {
      context: {
        endpoint: '/api/auth/resend-verification',
      },
    })
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
