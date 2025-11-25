/**
 * API Route: Get Current User with Role
 * GET /api/auth/me
 */

import { createClient } from '@/lib/supabase/server'
import { getUserRole, getStudentProfile, getAdminProfile } from '@/lib/auth'
import { NextResponse } from 'next/server'
import { logger } from '@/lib/logger'

export async function GET() {
  try {
    const supabase = await createClient()

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    // Get user role
    const role = await getUserRole(user.id)

    if (!role) {
      return NextResponse.json(
        { error: 'User role not found' },
        { status: 404 }
      )
    }

    // Get profile based on role
    let profile = null

    if (role === 'student') {
      const { data } = await getStudentProfile(user.id)
      profile = data
    } else if (role === 'admin' || role === 'super_admin') {
      const { data } = await getAdminProfile(user.id)
      profile = data
    }

    return NextResponse.json(
      {
        user,
        role,
        profile,
      },
      { status: 200 }
    )
  } catch (error: any) {
    logger.error('Get user error', { error })
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
