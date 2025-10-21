/**
 * API Route: Exams
 * GET /api/exams - Get exams (filtered by course or role)
 * POST /api/exams - Create exam (admin only)
 */

import { createClient } from '@/lib/supabase/server'
import { isAdmin, getUserRole } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'

// GET exams
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

    const { searchParams } = new URL(request.url)
    const courseId = searchParams.get('course_id')
    const includeQuestions = searchParams.get('include_questions') === 'true'

    let query = supabase.from('exams').select(`
      id,
      course_id,
      title,
      description,
      code,
      ${includeQuestions ? 'questions,' : ''}
      duration_minutes,
      passing_score,
      created_at,
      course:courses(name)
    `)

    if (courseId) {
      query = query.eq('course_id', courseId)
    }

    query = query.order('created_at', { ascending: false })

    const { data, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ exams: data }, { status: 200 })
  } catch (error: any) {
    console.error('Get exams error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST create exam (admin only)
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

    // Get admin profile
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

    const {
      course_id,
      title,
      description,
      code,
      questions,
      duration_minutes,
      passing_score,
    } = await request.json()

    // Validate input
    if (!course_id || !title || !code || !questions || questions.length === 0) {
      return NextResponse.json(
        { error: 'Course, title, code, and questions are required' },
        { status: 400 }
      )
    }

    // Check if code is unique
    const { data: existingExam } = await supabase
      .from('exams')
      .select('id')
      .eq('code', code)
      .single()

    if (existingExam) {
      return NextResponse.json(
        { error: 'Exam code already exists' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('exams')
      .insert({
        course_id,
        title,
        description,
        code: code.toUpperCase(),
        questions,
        duration_minutes: duration_minutes || 60,
        passing_score: passing_score || 70,
        created_by: adminData.id,
      })
      .select(`
        *,
        course:courses(*)
      `)
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(
      {
        message: 'Exam created successfully',
        exam: data,
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Create exam error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
