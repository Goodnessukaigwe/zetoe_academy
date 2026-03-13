/**
 * API Route: Student Course Enrollments
 * Manages many-to-many relationship between students and courses
 * 
 * POST /api/enrollments - Create new enrollment
 * GET /api/enrollments - List enrollments (with filters)
 * DELETE /api/enrollments/[id] - Remove enrollment
 * PUT /api/enrollments/[id] - Update enrollment (payment status)
 */

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger'
import { isAdmin } from '@/lib/auth'

const VALID_PAYMENT_STATUSES = ['paid', 'unpaid', 'partial'] as const

/**
 * GET /api/enrollments
 * List enrollments with optional filters
 */
export async function GET(request: NextRequest) {
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

    // Get query parameters
    const searchParams = request.nextUrl.searchParams
    const studentId = searchParams.get('student_id')
    const courseId = searchParams.get('course_id')
    const paymentStatus = searchParams.get('payment_status')

    // Check if user is admin
    const { isAdmin: userIsAdmin } = await isAdmin(user.id)

    let query = adminClient
      .from('student_courses')
      .select(`
        id,
        student_id,
        course_id,
        payment_status,
        enrolled_at,
        updated_at,
        student:students(id, name, email, phone),
        course:courses(id, name, description)
      `)
      .order('enrolled_at', { ascending: false })

    // Apply filters based on user role
    if (!userIsAdmin) {
      // Students can only see their own enrollments
      const { data: studentProfile } = await adminClient
        .from('students')
        .select('id')
        .eq('user_id', user.id)
        .single()

      if (!studentProfile) {
        return NextResponse.json(
          { error: 'Student profile not found' },
          { status: 404 }
        )
      }

      query = query.eq('student_id', studentProfile.id)
    } else {
      // Admins can filter by student_id if provided
      if (studentId) {
        query = query.eq('student_id', studentId)
      }
    }

    // Apply optional filters
    if (courseId) {
      query = query.eq('course_id', courseId)
    }

    if (paymentStatus) {
      query = query.eq('payment_status', paymentStatus)
    }

    const { data: enrollments, error } = await query

    if (error) {
      logger.error('Error fetching enrollments', { error })
      return NextResponse.json(
        { error: 'Failed to fetch enrollments' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        enrollments: enrollments || [],
        total: enrollments?.length || 0,
      },
      { status: 200 }
    )
  } catch (error: any) {
    logger.error('Get enrollments error', { error })
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/enrollments
 * Create new enrollment (enroll student in course)
 */
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

    const body = await request.json()
    const { student_id, course_id, payment_status = 'unpaid' } = body

    // Validation
    if (!student_id || !course_id) {
      return NextResponse.json(
        { error: 'student_id and course_id are required' },
        { status: 400 }
      )
    }

    if (!VALID_PAYMENT_STATUSES.includes(payment_status)) {
      return NextResponse.json(
        { error: 'Invalid payment_status. Must be: paid, unpaid, or partial' },
        { status: 400 }
      )
    }

    // Security note:
    // Course assignment is now admin-managed to avoid bypassing payment and approval flows.
    const { isAdmin: userIsAdmin } = await isAdmin(user.id)
    
    if (!userIsAdmin) {
      return NextResponse.json(
        { error: 'Only admins can assign courses to students' },
        { status: 403 }
      )
    }

    // Verify student exists
    const { data: student, error: studentError } = await adminClient
      .from('students')
      .select('id, name, email')
      .eq('id', student_id)
      .single()

    if (studentError || !student) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      )
    }

    // Verify course exists
    const { data: course, error: courseError } = await adminClient
      .from('courses')
      .select('id, name')
      .eq('id', course_id)
      .single()

    if (courseError || !course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    }

    // Check if enrollment already exists
    const { data: existing } = await adminClient
      .from('student_courses')
      .select('id')
      .eq('student_id', student_id)
      .eq('course_id', course_id)
      .single()

    if (existing) {
      return NextResponse.json(
        { error: 'Student is already enrolled in this course' },
        { status: 409 }
      )
    }

    // Create enrollment
    const { data: enrollment, error: insertError } = await adminClient
      .from('student_courses')
      .insert({
        student_id,
        course_id,
        payment_status,
      })
      .select(`
        id,
        student_id,
        course_id,
        payment_status,
        enrolled_at,
        updated_at,
        course:courses(id, name, description)
      `)
      .single()

    if (insertError) {
      logger.error('Error creating enrollment', { error: insertError })
      return NextResponse.json(
        { error: 'Failed to create enrollment' },
        { status: 500 }
      )
    }

    logger.info(`Enrollment created: ${student.name} enrolled in ${course.name}`)

    return NextResponse.json(
      {
        success: true,
        enrollment,
        message: `${student.name} enrolled in ${course.name}`,
      },
      { status: 201 }
    )
  } catch (error: any) {
    logger.error('Create enrollment error', { error })
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
