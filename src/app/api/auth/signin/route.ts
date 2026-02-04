/**
 * API Route: Sign In
 * POST /api/auth/signin
 * Authenticates users with username and password
 */

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextRequest, NextResponse } from 'next/server'
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

    const { username, password } = await request.json()

    // Validate username/email
    if (!username || username.trim().length === 0) {
      return NextResponse.json(
        { error: 'Username or email is required' },
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
    const adminClient = createAdminClient()
    let emailToUse = username

    // Check if input looks like an email (for admin login)
    const isEmail = username.includes('@')

    if (!isEmail) {
      // Look up student by username to get their email (use admin client to bypass RLS)
      const { data: student, error: studentError } = await adminClient
        .from('students')
        .select('email, user_id')
        .eq('username', username)
        .single()

      if (studentError || !student) {
        logger.error('Student lookup failed', studentError, {
          context: { username },
        })
        return NextResponse.json(
          { error: 'Invalid username or password' },
          { status: 401 }
        )
      }

      emailToUse = student.email
    }

    // Sign in with Supabase using the email
    const { data, error } = await supabase.auth.signInWithPassword({
      email: emailToUse,
      password,
    })

    if (error) {
      logger.error('Signin failed', error, {
        context: {
          username,
          errorCode: error.code,
        },
      })
      
      return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 })
    }

    logger.info('User signed in successfully', {
      context: {
        userId: data.user?.id,
        username,
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
