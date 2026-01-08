/**
 * API Route: Student Profile Management
 * GET /api/profile - Get current student's profile
 * PUT /api/profile - Update current student's profile (name, phone)
 */

import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger'
import { validatePhone } from '@/lib/validation'

// GET current student's profile
export async function GET() {
  try {
    const supabase = await createClient()
    const adminClient = createAdminClient()

    // Check authentication
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    // Get student profile with course info
    const { data, error } = await adminClient
      .from('students')
      .select(`
        id,
        name,
        email,
        phone,
        payment_status,
        created_at,
        course:courses(id, name, price)
      `)
      .eq('user_id', user.id)
      .single()

    if (error) {
      logger.error('Get profile error', { error, context: { userId: user.id } })
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    return NextResponse.json({ profile: data }, { status: 200 })
  } catch (error: any) {
    logger.error('Get profile error', { error })
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT update current student's profile
export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient()
    const adminClient = createAdminClient()

    // Check authentication
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const body = await request.json()
    const { name, phone } = body

    // Validate input
    if (!name || name.trim() === '') {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      )
    }

    // Validate phone number if provided
    if (phone && phone.trim() !== '') {
      const phoneValidation = validatePhone(phone)
      if (!phoneValidation.valid) {
        return NextResponse.json(
          { error: phoneValidation.error },
          { status: 400 }
        )
      }
    }

    // Get current student ID
    const { data: currentStudent } = await adminClient
      .from('students')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (!currentStudent) {
      return NextResponse.json({ error: 'Student profile not found' }, { status: 404 })
    }

    // Update student profile (only name and phone)
    const { data, error } = await adminClient
      .from('students')
      .update({
        name: name.trim(),
        phone: phone && phone.trim() !== '' ? phone.trim() : null,
      })
      .eq('user_id', user.id)
      .select(`
        id,
        name,
        email,
        phone,
        payment_status,
        created_at,
        course:courses(id, name, price)
      `)
      .single()

    if (error) {
      logger.error('Update profile error', { error, context: { userId: user.id } })
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    logger.info('Profile updated successfully', { context: { userId: user.id } })
    return NextResponse.json(
      {
        message: 'Profile updated successfully',
        profile: data,
      },
      { status: 200 }
    )
  } catch (error: any) {
    logger.error('Update profile error', { error })
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
