/**
 * API Route: Forgot Password
 * POST /api/auth/forgot-password - Send password reset email
 */

import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { validateEmail } from '@/lib/validation'
import { rateLimit, RateLimitPresets, createRateLimitResponse } from '@/lib/rate-limit'
import { logger } from '@/lib/logger'

export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting (3 attempts per 5 minutes for password reset)
    const rateLimitResult = rateLimit(request, RateLimitPresets.SENSITIVE)
    
    if (rateLimitResult.limited) {
      logger.warn('Rate limit exceeded for forgot password attempt', {
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

    // Send password reset email
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/reset-password`,
    })

    if (error) {
      logger.error('Password reset email error', { error, context: { email } })
      // Don't reveal if email exists or not (security best practice)
      return NextResponse.json(
        { message: 'If an account with that email exists, a reset link has been sent.' },
        { status: 200 }
      )
    }

    logger.info('Password reset email sent', { context: { email } })

    return NextResponse.json(
      { message: 'Password reset email sent successfully' },
      { status: 200 }
    )
  } catch (error: any) {
    logger.error('Forgot password error', { error })
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
