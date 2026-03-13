/**
 * API Route: Payments
 * GET /api/payments - Get payments (filtered by role)
 * POST /api/payments - Create payment record (admin only)
 */

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { isAdmin, getUserRole } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger'

const VALID_PAYMENT_METHODS = ['cash', 'bank_transfer', 'card', 'other'] as const

// GET payments
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Check authentication
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const role = await getUserRole(user.id)
    const { searchParams } = new URL(request.url)
    const studentId = searchParams.get('student_id')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = 50

    // Optimized: Select only needed columns
    let query = supabase.from('payments').select(`
      id,
      amount,
      payment_method,
      reference,
      notes,
      paid_at,
      student:students(id, name, email),
      course:courses(id, name),
      admin:admins!recorded_by(name, email)
    `, { count: 'exact' })

    // Filter based on role
    if (role === 'student') {
      // Students can only see their own payments
      const { data: studentData } = await supabase
        .from('students')
        .select('id')
        .eq('user_id', user.id)
        .single()

      if (studentData) {
        query = query.eq('student_id', studentData.id)
      }
    } else if (studentId) {
      // Admins can filter by student_id
      query = query.eq('student_id', studentId)
    }

    // Add ordering and pagination
    const from = (page - 1) * limit
    const to = from + limit - 1
    query = query
      .order('paid_at', { ascending: false })
      .range(from, to)

    const { data, error, count } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ 
      payments: data || [],
      total: count,
      page,
      totalPages: Math.ceil((count || 0) / limit)
    }, { status: 200 })
  } catch (error: any) {
    logger.error('Get payments error', { error })
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST create payment (admin only)
export async function POST(request: NextRequest) {
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

    // Check if user is admin
    const { isAdmin: userIsAdmin } = await isAdmin(user.id)

    if (!userIsAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Get admin profile to get admin id
    const { data: adminData } = await supabase
      .from('admins')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (!adminData) {
      return NextResponse.json(
        { error: 'Admin profile not found' },
        { status: 404 }
      )
    }

    const { student_id, course_id, amount, payment_method, reference, notes } =
      await request.json()

    // Validate input
    if (!student_id || !amount) {
      return NextResponse.json(
        { error: 'Student ID and amount are required' },
        { status: 400 }
      )
    }

    if (!course_id) {
      return NextResponse.json(
        { error: 'Course ID is required for payment' },
        { status: 400 }
      )
    }

    const normalizedAmount = Number(amount)
    if (!Number.isFinite(normalizedAmount) || normalizedAmount <= 0) {
      return NextResponse.json(
        { error: 'Amount must be a positive number' },
        { status: 400 }
      )
    }

    const normalizedPaymentMethod = payment_method || 'cash'
    if (!VALID_PAYMENT_METHODS.includes(normalizedPaymentMethod)) {
      return NextResponse.json(
        { error: 'Invalid payment method' },
        { status: 400 }
      )
    }

    // Verify enrollment exists
    const { data: enrollment, error: enrollmentError } = await adminClient
      .from('student_courses')
      .select('id, payment_status')
      .eq('student_id', student_id)
      .eq('course_id', course_id)
      .single()

    if (enrollmentError || !enrollment) {
      return NextResponse.json(
        { error: 'Student is not enrolled in this course' },
        { status: 404 }
      )
    }

    // Create payment record with course linkage
    // Use the admin client for the write so the route behavior does not depend on
    // frontend session RLS state after admin authorization has already been verified.
    const { data: paymentData, error: paymentError } = await adminClient
      .from('payments')
      .insert({
        student_id,
        course_id,
        amount: normalizedAmount,
        payment_method: normalizedPaymentMethod,
        reference,
        notes,
        recorded_by: adminData.id,
        paid_at: new Date().toISOString(),
      })
      .select(`
        *,
        student:students(id, name, email),
        course:courses(id, name),
        admin:admins!recorded_by(name, email)
      `)
      .single()

    if (paymentError) {
      return NextResponse.json(
        { error: paymentError.message },
        { status: 400 }
      )
    }

    // Update enrollment payment status to 'paid'
    const { error: updateError } = await adminClient
      .from('student_courses')
      .update({ 
        payment_status: 'paid',
        updated_at: new Date().toISOString()
      })
      .eq('student_id', student_id)
      .eq('course_id', course_id)

    if (updateError) {
      logger.error('Error updating enrollment payment status', { error: updateError })
      // Don't fail the request if payment was recorded
    }

    return NextResponse.json(
      {
        message: 'Payment recorded successfully',
        payment: paymentData,
      },
      { status: 201 }
    )
  } catch (error: any) {
    logger.error('Create payment error', { error })
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
