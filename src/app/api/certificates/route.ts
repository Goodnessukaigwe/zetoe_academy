import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getUserRole } from '@/lib/auth'
import { adminClient } from '@/lib/supabase/admin'
import { logger } from '@/lib/logger'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Check authentication
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    // Check if user is admin
    const role = await getUserRole(user.id)
    if (role !== 'admin' && role !== 'super_admin') {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const studentId = searchParams.get('studentId')

    let query = adminClient
      .from('certificates')
      .select(`
        *,
        student:students(name, email),
        course:courses(name),
        issued_by_admin:admins!certificates_issued_by_fkey(name)
      `)
      .order('created_at', { ascending: false })

    if (studentId) {
      query = query.eq('student_id', studentId)
    }

    const { data: certificates, error } = await query

    if (error) {
      logger.error('Failed to fetch certificates', error)
      return NextResponse.json(
        { error: 'Failed to fetch certificates' },
        { status: 500 }
      )
    }

    return NextResponse.json({ certificates })

  } catch (error) {
    logger.error('Certificates list error', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
