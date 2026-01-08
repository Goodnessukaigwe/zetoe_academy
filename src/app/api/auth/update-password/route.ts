/**
 * API Route: Update Password
 * POST /api/auth/update-password - Update current user's password
 */

import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger'
import { validatePassword } from '@/lib/validation'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Check authentication
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { currentPassword, newPassword } = await request.json()

    // Validate current password is provided
    if (!currentPassword) {
      return NextResponse.json(
        { error: 'Current password is required' },
        { status: 400 }
      )
    }

    // Verify current password by attempting sign in
    // Note: Supabase doesn't provide a dedicated password verification API
    // This will create a new session, but it's the recommended approach
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email!,
      password: currentPassword,
    })

    if (signInError) {
      return NextResponse.json(
        { error: 'Current password is incorrect' },
        { status: 401 }
      )
    }

    // Validate new password using the validation utility
    const validation = validatePassword(newPassword)
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      )
    }

    // Update password using Supabase
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    })

    if (error) {
      logger.error('Update password error', { error, context: { userId: user.id } })
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    logger.info('Password updated successfully', { context: { userId: user.id } })
    return NextResponse.json(
      { message: 'Password updated successfully' },
      { status: 200 }
    )
  } catch (error: any) {
    logger.error('Update password error', { error })
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
