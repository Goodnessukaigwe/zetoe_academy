/**
 * API Route: Update Password
 * POST /api/auth/update-password - Update current user's password
 */

import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger'

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

    const { newPassword } = await request.json()

    // Validate input
    if (!newPassword || newPassword.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      )
    }

    // Update password using Supabase
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    })

    if (error) {
      logger.error('Update password error', { error, userId: user.id })
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
