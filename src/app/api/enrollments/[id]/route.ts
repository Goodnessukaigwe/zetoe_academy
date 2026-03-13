/**
 * API Route: Single Enrollment Operations
 * PUT /api/enrollments/[id] - Update enrollment (payment status)
 * DELETE /api/enrollments/[id] - Delete enrollment
 */

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger'
import { isAdmin } from '@/lib/auth'

const VALID_PAYMENT_STATUSES = ['paid', 'unpaid', 'partial'] as const

/**
 * PUT /api/enrollments/[id]
 * Update enrollment (primarily for payment status)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id: enrollmentId } = await params
    const body = await request.json()
    const { payment_status } = body

    // Validation
    if (!payment_status) {
      return NextResponse.json(
        { error: 'payment_status is required' },
        { status: 400 }
      )
    }

    if (!VALID_PAYMENT_STATUSES.includes(payment_status)) {
      return NextResponse.json(
        { error: 'Invalid payment_status. Must be: paid, unpaid, or partial' },
        { status: 400 }
      )
    }

    // Only admins can update payment status
    const { isAdmin: userIsAdmin } = await isAdmin(user.id)

    if (!userIsAdmin) {
      return NextResponse.json(
        { error: 'Only admins can update payment status' },
        { status: 403 }
      )
    }

    // Get existing enrollment
    const { data: existing, error: fetchError } = await adminClient
      .from('student_courses')
      .select(`
        id,
        student_id,
        course_id,
        payment_status
      `)
      .eq('id', enrollmentId)
      .single()

    if (fetchError || !existing) {
      return NextResponse.json(
        { error: 'Enrollment not found' },
        { status: 404 }
      )
    }

    // Update enrollment
    const { data: updated, error: updateError } = await adminClient
      .from('student_courses')
      .update({
        payment_status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', enrollmentId)
      .select(`
        id,
        student_id,
        course_id,
        payment_status,
        enrolled_at,
        updated_at,
        student:students(id, name, email),
        course:courses(id, name, description)
      `)
      .single()

    if (updateError) {
      logger.error('Error updating enrollment', { error: updateError })
      return NextResponse.json(
        { error: 'Failed to update enrollment' },
        { status: 500 }
      )
    }

    logger.info(`Enrollment ${enrollmentId} updated: payment status ${existing.payment_status} → ${payment_status}`)

    return NextResponse.json(
      {
        success: true,
        enrollment: updated,
        message: `Payment status updated to ${payment_status}`,
      },
      { status: 200 }
    )
  } catch (error: any) {
    logger.error('Update enrollment error', { error })
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/enrollments/[id]
 * Remove enrollment
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id: enrollmentId } = await params

    // Check if user is admin
    const { isAdmin: userIsAdmin } = await isAdmin(user.id)

    // Get enrollment details before deletion
    const { data: enrollment, error: fetchError } = await adminClient
      .from('student_courses')
      .select(`
        id,
        student_id,
        course_id,
        payment_status
      `)
      .eq('id', enrollmentId)
      .single()

    if (fetchError || !enrollment) {
      return NextResponse.json(
        { error: 'Enrollment not found' },
        { status: 404 }
      )
    }

    // Students can only delete their own enrollments
    if (!userIsAdmin) {
      // Verify the enrollment belongs to the current student
      const { data: studentProfile } = await adminClient
        .from('students')
        .select('id')
        .eq('user_id', user.id)
        .single()
      
      if (!studentProfile || enrollment.student_id !== studentProfile.id) {
        return NextResponse.json(
          { error: 'You can only delete your own enrollments' },
          { status: 403 }
        )
      }
    }

    // Keep historical score data consistent by preventing course removal when
    // the student already has exam attempts tied to exams in this course.
    const { data: courseExams, error: examsError } = await adminClient
      .from('exams')
      .select('id')
      .eq('course_id', enrollment.course_id)

    if (examsError) {
      logger.error('Error checking enrollment exams', { error: examsError })
      return NextResponse.json(
        { error: 'Failed to verify enrollment dependencies' },
        { status: 500 }
      )
    }

    const examIds = (courseExams || []).map((exam) => exam.id)

    let hasScores = false
    if (examIds.length > 0) {
      const { data: scores, error: scoresError } = await adminClient
        .from('scores')
        .select('id')
        .eq('student_id', enrollment.student_id)
        .in('exam_id', examIds)
        .limit(1)

      if (scoresError) {
        logger.error('Error checking enrollment scores', { error: scoresError })
        return NextResponse.json(
          { error: 'Failed to verify enrollment dependencies' },
          { status: 500 }
        )
      }

      hasScores = !!scores && scores.length > 0
    }

    // For safety, prevent deletion if paid (admins should unpay first)
    if (enrollment.payment_status === 'paid' && !userIsAdmin) {
      return NextResponse.json(
        {
          error: 'Cannot delete paid enrollment. Contact admin for assistance.',
        },
        { status: 400 }
      )
    }

    if (hasScores) {
      return NextResponse.json(
        {
          error: 'Cannot remove enrollment after exam attempts exist for this course.',
        },
        { status: 400 }
      )
    }

    // Delete enrollment
    const { error: deleteError } = await adminClient
      .from('student_courses')
      .delete()
      .eq('id', enrollmentId)

    if (deleteError) {
      logger.error('Error deleting enrollment', { error: deleteError })
      return NextResponse.json(
        { error: 'Failed to delete enrollment' },
        { status: 500 }
      )
    }

    logger.info(`Enrollment ${enrollmentId} deleted`)

    return NextResponse.json(
      {
        success: true,
        message: `Enrollment removed successfully`,
      },
      { status: 200 }
    )
  } catch (error: any) {
    logger.error('Delete enrollment error', { error })
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
