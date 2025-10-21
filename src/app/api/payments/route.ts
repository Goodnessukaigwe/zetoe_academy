/**
 * API Route: Payments
 * GET /api/payments - Get payments (filtered by role)
 * POST /api/payments - Create payment record (admin only)
 */

import { createClient } from '@/lib/supabase/server'
import { isAdmin, getUserRole } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'

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

    let query = supabase.from('payments').select(`
      *,
      student:students(*),
      admin:admins!recorded_by(name, email)
    `)

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

    query = query.order('paid_at', { ascending: false })

    const { data, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ payments: data }, { status: 200 })
  } catch (error: any) {
    console.error('Get payments error:', error)
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

    const { student_id, amount, payment_method, reference, notes } =
      await request.json()

    // Validate input
    if (!student_id || !amount) {
      return NextResponse.json(
        { error: 'Student ID and amount are required' },
        { status: 400 }
      )
    }

    // Create payment record
    const { data: paymentData, error: paymentError } = await supabase
      .from('payments')
      .insert({
        student_id,
        amount,
        payment_method: payment_method || 'cash',
        reference,
        notes,
        recorded_by: adminData.id,
        paid_at: new Date().toISOString(),
      })
      .select(`
        *,
        student:students(*),
        admin:admins!recorded_by(name, email)
      `)
      .single()

    if (paymentError) {
      return NextResponse.json(
        { error: paymentError.message },
        { status: 400 }
      )
    }

    // Update student payment status to 'paid'
    await supabase
      .from('students')
      .update({ payment_status: 'paid' })
      .eq('id', student_id)

    return NextResponse.json(
      {
        message: 'Payment recorded successfully',
        payment: paymentData,
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Create payment error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
