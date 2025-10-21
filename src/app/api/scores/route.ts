/**
 * API Route: Scores
 * GET /api/scores - Get scores (filtered by role)
 */

import { createClient } from '@/lib/supabase/server'
import { getUserRole, isAdmin } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'

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
    const examId = searchParams.get('exam_id')

    let query = supabase.from('scores').select(`
      *,
      student:students(name, email),
      exam:exams(title, passing_score, course:courses(name))
    `)

    // Filter based on role
    if (role === 'student') {
      // Students can only see their own scores
      const { data: studentData } = await supabase
        .from('students')
        .select('id')
        .eq('user_id', user.id)
        .single()

      if (studentData) {
        query = query.eq('student_id', studentData.id)
      }
    } else {
      // Admins can filter
      if (studentId) {
        query = query.eq('student_id', studentId)
      }
      if (examId) {
        query = query.eq('exam_id', examId)
      }
    }

    query = query.order('submitted_at', { ascending: false })

    const { data, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ scores: data }, { status: 200 })
  } catch (error: any) {
    console.error('Get scores error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
