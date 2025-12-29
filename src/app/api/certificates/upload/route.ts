import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getUserRole } from '@/lib/auth'
import { adminClient } from '@/lib/supabase/admin'
import { logger } from '@/lib/logger'

export async function POST(request: NextRequest) {
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

    const formData = await request.formData()
    const file = formData.get('file') as File
    const certificateCode = formData.get('certificateCode') as string
    const certificateNumber = formData.get('certificateNumber') as string | null
    const studentId = formData.get('studentId') as string
    const studentName = formData.get('studentName') as string
    const studentEmail = formData.get('studentEmail') as string
    const courseId = formData.get('courseId') as string
    const courseName = formData.get('courseName') as string
    const examId = formData.get('examId') as string | null
    const examTitle = formData.get('examTitle') as string | null
    const scoreId = formData.get('scoreId') as string | null
    const finalScore = formData.get('finalScore') as string | null
    const grade = formData.get('grade') as string | null
    const issueDate = formData.get('issueDate') as string
    const expiryDate = formData.get('expiryDate') as string | null
    const notes = formData.get('notes') as string | null

    if (!file || !certificateCode || !studentId || !studentName || !courseId || !courseName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Upload file to Supabase Storage
    const fileExt = file.name.split('.').pop()
    const fileName = `${certificateCode}-${Date.now()}.${fileExt}`
    const filePath = `${fileName}`

    const fileBuffer = await file.arrayBuffer()
    const { data: uploadData, error: uploadError } = await adminClient.storage
      .from('certificates')
      .upload(filePath, fileBuffer, {
        contentType: file.type,
        upsert: false
      })

    if (uploadError) {
      logger.error('Certificate upload failed', uploadError)
      return NextResponse.json(
        { error: 'Failed to upload certificate file' },
        { status: 500 }
      )
    }

    // Get public URL
    const { data: { publicUrl } } = adminClient.storage
      .from('certificates')
      .getPublicUrl(filePath)

    // Get admin ID
    const { data: adminData } = await adminClient
      .from('admins')
      .select('id')
      .eq('user_id', user.id)
      .single()

    // Insert certificate record
    const { data: certificate, error: insertError } = await adminClient
      .from('certificates')
      .insert({
        certificate_code: certificateCode,
        certificate_number: certificateNumber,
        student_id: studentId,
        student_name: studentName,
        student_email: studentEmail,
        course_id: courseId,
        course_name: courseName,
        exam_id: examId,
        exam_title: examTitle,
        score_id: scoreId,
        final_score: finalScore ? parseFloat(finalScore) : null,
        grade: grade,
        file_url: publicUrl,
        file_name: file.name,
        file_type: file.type,
        issue_date: issueDate,
        expiry_date: expiryDate,
        issued_by: adminData?.id || null,
        notes: notes,
        is_verified: true,
        is_active: true
      })
      .select()
      .single()

    if (insertError) {
      logger.error('Certificate insert failed', insertError)
      // Clean up uploaded file
      await adminClient.storage.from('certificates').remove([filePath])
      return NextResponse.json(
        { error: 'Failed to create certificate record' },
        { status: 500 }
      )
    }

    logger.log('Certificate created successfully', { context: { certificateCode } })

    return NextResponse.json({
      message: 'Certificate uploaded successfully',
      certificate
    })

  } catch (error) {
    logger.error('Certificate upload error', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
