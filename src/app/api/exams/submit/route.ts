/**
 * API Route: Submit Exam
 * POST /api/exams/submit - Submit exam answers and calculate score
 */

import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

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

    const { exam_id, answers, time_taken_minutes } = await request.json()

    if (!exam_id || !answers) {
      return NextResponse.json(
        { error: 'Exam ID and answers are required' },
        { status: 400 }
      )
    }

    // Get student profile
    const { data: student } = await supabase
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
    const { data: existingScore } = await supabase
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
    const { data: exam, error: examError } = await supabase
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
      const studentAnswer = answers.find((a: any) => a.question_id === question.id)

      if (studentAnswer) {
        const isCorrect = studentAnswer.selected_answer === question.correct_answer
        if (isCorrect) correctAnswers++

        studentAnswers.push({
          question_id: question.id,
          selected_answer: studentAnswer.selected_answer,
          is_correct: isCorrect,
        })
      }
    }

    const score = correctAnswers
    const percentage = (correctAnswers / totalQuestions) * 100
    const status = percentage >= exam.passing_score ? 'passed' : 'failed'

    // Save score
    const { data: scoreData, error: scoreError } = await supabase
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
    console.error('Submit exam error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
