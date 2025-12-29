/**
 * API Route: Submit Exam
 * POST /api/exams/submit - Submit exam answers and calculate score
 */

import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger'
import { cache } from '@/lib/cache'

export async function POST(request: NextRequest) {
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

    const { exam_id, answers, time_taken_minutes } = await request.json()

    if (!exam_id || !answers) {
      return NextResponse.json(
        { error: 'Exam ID and answers are required' },
        { status: 400 }
      )
    }

    // Get student profile using admin client
    const { data: student } = await adminClient
      .from('students')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (!student) {
      return NextResponse.json(
        { error: 'Student profile not found' },
        { status: 404 }
      )
    }

    // Check if already submitted
    const { data: existingScore } = await adminClient
      .from('scores')
      .select('id')
      .eq('student_id', student.id)
      .eq('exam_id', exam_id)
      .single()

    if (existingScore) {
      return NextResponse.json(
        { error: 'Exam already submitted' },
        { status: 400 }
      )
    }

    // Get exam with correct answers
    const { data: exam, error: examError } = await adminClient
      .from('exams')
      .select('questions, passing_score')
      .eq('id', exam_id)
      .single()

    if (examError || !exam) {
      return NextResponse.json({ error: 'Exam not found' }, { status: 404 })
    }

    // Calculate score
    let correctAnswers = 0
    const totalQuestions = exam.questions.length
    const studentAnswers = []

    for (let i = 0; i < exam.questions.length; i++) {
      const question = exam.questions[i]
      const studentAnswer = answers[question.id] // answers is now an object

      if (studentAnswer !== undefined && studentAnswer !== -1) {
        const isCorrect = studentAnswer === question.correct_answer
        if (isCorrect) correctAnswers++

        studentAnswers.push({
          question_id: question.id,
          selected_answer: studentAnswer,
          is_correct: isCorrect,
        })
      }
    }

    const score = correctAnswers
    const percentage = (correctAnswers / totalQuestions) * 100
    const status = percentage >= exam.passing_score ? 'passed' : 'failed'

    // Save score using admin client
    const { data: scoreData, error: scoreError } = await adminClient
      .from('scores')
      .insert({
        student_id: student.id,
        exam_id,
        score,
        total_questions: totalQuestions,
        percentage: parseFloat(percentage.toFixed(2)),
        status,
        answers: studentAnswers,
        time_taken_minutes,
      })
      .select(`
        *,
        exam:exams(title, passing_score),
        student:students(name)
      `)
      .single()

    if (scoreError) {
      return NextResponse.json({ error: scoreError.message }, { status: 400 })
    }

    // Invalidate scores cache for this student
    cache.invalidatePattern(`scores.*userId=${user.id}`)
    cache.invalidatePattern(`scores.*studentId=${student.id}`)

    return NextResponse.json(
      {
        message: 'Exam submitted successfully',
        result: {
          score,
          total_questions: totalQuestions,
          percentage,
          status,
          passing_score: exam.passing_score,
        },
        data: scoreData,
      },
      { status: 201 }
    )
  } catch (error: any) {
    logger.error('Submit exam error', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
