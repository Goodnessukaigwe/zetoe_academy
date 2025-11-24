/**
 * API Route: Access Exam with Code
 * POST /api/exams/access - Access exam using code
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

    const { code } = await request.json()

    if (!code) {
      return NextResponse.json(
        { error: 'Exam code is required' },
        { status: 400 }
      )
    }

    // Find exam by code
    const { data: exam, error: examError } = await supabase
      .from('exams')
      .select(`
        *,
        course:courses(*)
      `)
      .eq('code', code.toUpperCase())
      .single()

    if (examError || !exam) {
      return NextResponse.json(
        { error: 'Invalid exam code' },
        { status: 404 }
      )
    }

    // Get student profile
    const { data: student } = await supabase
      .from('students')
      .select('id, course_id, payment_status')
      .eq('user_id', user.id)
      .single()

    if (!student) {
      return NextResponse.json(
        { error: 'Student profile not found' },
        { status: 404 }
      )
    }

    // Check if student is enrolled in the course
    if (student.course_id !== exam.course_id) {
      return NextResponse.json(
        { error: 'You are not enrolled in this course' },
        { status: 403 }
      )
    }

    // Check payment status
    if (student.payment_status !== 'paid') {
      return NextResponse.json(
        { error: 'Please complete payment to access exams' },
        { status: 403 }
      )
    }

    // Check if student has already taken this exam
    const { data: existingScore } = await supabase
      .from('scores')
      .select('id')
      .eq('student_id', student.id)
      .eq('exam_id', exam.id)
      .single()

    if (existingScore) {
      return NextResponse.json(
        { error: 'You have already taken this exam' },
        { status: 400 }
      )
    }

    // Return exam (without showing correct answers)
    const examQuestions = exam.questions.map((q: any) => ({
      id: q.id,
      question: q.question,
      options: q.options,
      points: q.points || 1,
    }))

    return NextResponse.json(
      {
        exam: {
          id: exam.id,
          title: exam.title,
          description: exam.description,
          duration_minutes: exam.duration_minutes,
          passing_score: exam.passing_score,
          questions: examQuestions,
          course: exam.course,
        },
      },
      { status: 200 }
    )
  } catch (error: any) {
    logger.error('Access exam error', { error })
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
