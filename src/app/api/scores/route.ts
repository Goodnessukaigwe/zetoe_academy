/**
 * API Route: Scores
 * GET /api/scores - Get scores (filtered by role)
 */

import { createClient } from '@/lib/supabase/server'
import { getUserRole, isAdmin } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger'
import { withCache, generateCacheKey, CACHE_TTL } from '@/lib/cache'

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
    const page = parseInt(searchParams.get('page') || '1')
    const limit = 50

    // Generate cache key based on parameters
    const cacheKey = generateCacheKey('scores', {
      userId: user.id,
      role,
      studentId: studentId || undefined,
      examId: examId || undefined,
      page,
    })

    // Cache scores for 5 minutes (they rarely change after submission)
    const result = await withCache(
      cacheKey,
      CACHE_TTL.FIVE_MINUTES,
      async () => {
        // Optimized: Select only needed columns
        let query = supabase.from('scores').select(`
          id,
          score,
          total_questions,
          percentage,
          status,
          time_taken_minutes,
          submitted_at,
          student:students(id, name, email),
          exam:exams(id, title, passing_score)
        `, { count: 'exact' })

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

        // Add ordering and pagination
        const from = (page - 1) * limit
        const to = from + limit - 1
        query = query
          .order('submitted_at', { ascending: false })
          .range(from, to)

        const { data, error, count } = await query

        if (error) {
          throw new Error(error.message)
        }

        logger.info('Scores retrieved', { context: { count: data?.length || 0, role } })

        return {
          scores: data || [],
          total: count,
          page,
          totalPages: Math.ceil((count || 0) / limit)
        }
      }
    )

    return NextResponse.json(result, { status: 200 })
  } catch (error: any) {
    logger.error('Get scores error', { error })
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
