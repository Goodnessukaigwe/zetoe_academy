/**
 * API Route: Get Single Exam
 * GET /api/exams/[id] - Get exam by ID (for taking exam)
 */

import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const adminClient = createAdminClient()
    const supabase = await createClient()

    // Check authentication
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { id: examId } = await params

    // Get exam
    const { data: exam, error: examError } = await adminClient
      .from('exams')
      .select(`
        id,
        title,
        description,
        duration_minutes,
        passing_score,
        questions,
        course_id
      `)
      .eq('id', examId)
      .single()

    if (examError || !exam) {
      return NextResponse.json({ error: 'Exam not found' }, { status: 404 })
    }

    // Get student profile
    const { data: student } = await adminClient
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
    const { data: existingScore } = await adminClient
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

    // Return exam without correct answers
    const examQuestions = exam.questions.map((q: any, index: number) => ({
      id: q.id || `q_${index}`,
      question: q.question,
      options: q.options,
      points: q.points || 1,
    }))

    return NextResponse.json({
      exam: {
        id: exam.id,
        title: exam.title,
        description: exam.description,
        duration_minutes: exam.duration_minutes,
        passing_score: exam.passing_score,
        questions: examQuestions,
      },
    })
  } catch (error: any) {
    console.error('Get exam error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
