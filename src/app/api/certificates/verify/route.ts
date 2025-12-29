import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { logger } from '@/lib/logger'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')

    if (!code) {
      return NextResponse.json(
        { error: 'Certificate code is required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Search for certificate
    const { data: certificate, error } = await supabase
      .from('certificates')
      .select(`
        certificate_code,
        certificate_number,
        student_name,
        student_email,
        course_name,
        exam_title,
        final_score,
        grade,
        file_url,
        issue_date,
        expiry_date,
        is_active,
        is_verified,
        created_at
      `)
      .eq('certificate_code', code.toUpperCase())
      .eq('is_active', true)
      .single()

    if (error || !certificate) {
      logger.warn('Certificate not found', { context: { code } })
      return NextResponse.json(
        { error: 'Certificate not found', found: false },
        { status: 404 }
      )
    }

    // Check if expired
    const isExpired = certificate.expiry_date && 
      new Date(certificate.expiry_date) < new Date()

    logger.log('Certificate verified', { context: { code } })

    return NextResponse.json({
      found: true,
      certificate: {
        ...certificate,
        is_expired: isExpired,
        is_valid: certificate.is_verified && !isExpired
      }
    })

  } catch (error) {
    logger.error('Certificate verification error', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
