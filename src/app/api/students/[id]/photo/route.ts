/**
 * API Route: Upload Student Photo
 * POST /api/students/[id]/photo
 * Allows super admin to upload student profile photos
 */

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: studentId } = await params
    const supabase = await createClient()
    const adminClient = createAdminClient()

    // Check authentication
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    // Check if user is admin
    const { data: admin } = await supabase
      .from('admins')
      .select('role')
      .eq('user_id', user.id)
      .single()

    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Get form data
    const formData = await request.formData()
    const file = formData.get('photo') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPG, PNG, and WebP are allowed' },
        { status: 400 }
      )
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size exceeds 5MB limit' },
        { status: 400 }
      )
    }

    // Check if student exists
    const { data: student, error: studentError } = await adminClient
      .from('students')
      .select('id, name, profile_picture_url')
      .eq('id', studentId)
      .single()

    if (studentError || !student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 })
    }

    // Delete old profile picture if exists
    if (student.profile_picture_url) {
      const oldFilePath = student.profile_picture_url.split('/').pop()
      if (oldFilePath) {
        await adminClient.storage
          .from('student-profiles')
          .remove([`${studentId}/${oldFilePath}`])
      }
    }

    // Generate unique filename
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}.${fileExt}`
    const filePath = `${studentId}/${fileName}`

    // Convert File to ArrayBuffer then to Buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await adminClient.storage
      .from('student-profiles')
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false,
      })

    if (uploadError) {
      logger.error('File upload error', uploadError)
      return NextResponse.json(
        { error: 'Failed to upload file' },
        { status: 500 }
      )
    }

    // Get public URL
    const { data: urlData } = adminClient.storage
      .from('student-profiles')
      .getPublicUrl(filePath)

    const publicUrl = urlData.publicUrl

    // Update student profile with new photo URL
    const { data: updatedStudent, error: updateError } = await adminClient
      .from('students')
      .update({ profile_picture_url: publicUrl })
      .eq('id', studentId)
      .select('id, name, profile_picture_url')
      .single()

    if (updateError) {
      logger.error('Failed to update student profile', updateError)
      // Cleanup uploaded file
      await adminClient.storage
        .from('student-profiles')
        .remove([filePath])

      return NextResponse.json(
        { error: 'Failed to update student profile' },
        { status: 500 }
      )
    }

    logger.info('Student photo uploaded successfully', {
      context: {
        studentId,
        uploadedBy: user.id,
      },
    })

    return NextResponse.json(
      {
        message: 'Photo uploaded successfully',
        student: updatedStudent,
      },
      { status: 200 }
    )
  } catch (error: any) {
    logger.error('Upload student photo error', { error })
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/students/[id]/photo - Remove student photo
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: studentId } = await params
    const supabase = await createClient()
    const adminClient = createAdminClient()

    // Check authentication
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    // Check if user is admin
    const { data: admin } = await supabase
      .from('admins')
      .select('role')
      .eq('user_id', user.id)
      .single()

    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Get student's current photo
    const { data: student, error: studentError } = await adminClient
      .from('students')
      .select('id, profile_picture_url')
      .eq('id', studentId)
      .single()

    if (studentError || !student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 })
    }

    if (!student.profile_picture_url) {
      return NextResponse.json(
        { error: 'No profile picture to delete' },
        { status: 400 }
      )
    }

    // Extract file path from URL
    const filePath = student.profile_picture_url.split('/').slice(-2).join('/')

    // Delete from storage
    const { error: deleteError } = await adminClient.storage
      .from('student-profiles')
      .remove([filePath])

    if (deleteError) {
      logger.error('Failed to delete photo from storage', deleteError)
    }

    // Update student profile to remove photo URL
    const { error: updateError } = await adminClient
      .from('students')
      .update({ profile_picture_url: null })
      .eq('id', studentId)

    if (updateError) {
      logger.error('Failed to update student profile', updateError)
      return NextResponse.json(
        { error: 'Failed to update student profile' },
        { status: 500 }
      )
    }

    logger.info('Student photo deleted successfully', {
      context: {
        studentId,
        deletedBy: user.id,
      },
    })

    return NextResponse.json(
      { message: 'Photo deleted successfully' },
      { status: 200 }
    )
  } catch (error: any) {
    logger.error('Delete student photo error', { error })
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
