'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Award, Upload, Calendar, User, BookOpen, Hash, FileText, AlertCircle } from 'lucide-react'
import { logger } from '@/lib/logger'

interface Student {
  id: string
  name: string
  email: string
  course_id: string
  course: {
    id: string
    name: string
  } | null
}

interface Score {
  id: string
  exam: {
    id: string
    title: string
  }
  percentage: number
}

export default function UploadCertificatePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [students, setStudents] = useState<Student[]>([])
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [scores, setScores] = useState<Score[]>([])
  const [file, setFile] = useState<File | null>(null)
  const [generatedCode, setGeneratedCode] = useState('')
  
  const [formData, setFormData] = useState({
    certificateCode: '',
    certificateNumber: '',
    grade: 'Pass',
    issueDate: new Date().toISOString().split('T')[0],
    expiryDate: '',
    notes: ''
  })

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    fetchStudents()
    generateCode()
  }, [])

  const fetchStudents = async () => {
    try {
      const res = await fetch('/api/students')
      if (res.ok) {
        const data = await res.json()
        setStudents(data.students || [])
      }
    } catch (err) {
      logger.error('Failed to fetch students', err)
    }
  }

  const generateCode = async () => {
    try {
      const res = await fetch('/api/certificates/generate-code')
      if (res.ok) {
        const data = await res.json()
        setGeneratedCode(data.code)
        setFormData(prev => ({ ...prev, certificateCode: data.code }))
      }
    } catch (err) {
      logger.error('Failed to generate code', err)
    }
  }

  const fetchStudentScores = async (studentId: string) => {
    try {
      const res = await fetch(`/api/scores?student_id=${studentId}`)
      if (res.ok) {
        const data = await res.json()
        setScores(data.scores || [])
      }
    } catch (err) {
      logger.error('Failed to fetch scores', err)
    }
  }

  const handleStudentChange = (studentId: string) => {
    const student = students.find(s => s.id === studentId)
    setSelectedStudent(student || null)
    if (student) {
      fetchStudentScores(studentId)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      // Validate file type
      const validTypes = ['application/pdf', 'image/png', 'image/jpeg']
      if (!validTypes.includes(selectedFile.type)) {
        setError('Please upload a PDF or image file (PNG, JPEG)')
        return
      }
      
      // Validate file size (max 5MB)
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB')
        return
      }

      setFile(selectedFile)
      setError('')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedStudent) {
      setError('Please select a student')
      return
    }

    if (!file) {
      setError('Please upload a certificate file')
      return
    }

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const formDataToSend = new FormData()
      formDataToSend.append('file', file)
      formDataToSend.append('certificateCode', formData.certificateCode)
      formDataToSend.append('certificateNumber', formData.certificateNumber)
      formDataToSend.append('studentId', selectedStudent.id)
      formDataToSend.append('studentName', selectedStudent.name)
      formDataToSend.append('studentEmail', selectedStudent.email)
      formDataToSend.append('courseId', selectedStudent.course?.id || '')
      formDataToSend.append('courseName', selectedStudent.course?.name || '')
      formDataToSend.append('grade', formData.grade)
      formDataToSend.append('issueDate', formData.issueDate)
      
      if (formData.expiryDate) {
        formDataToSend.append('expiryDate', formData.expiryDate)
      }
      
      if (formData.notes) {
        formDataToSend.append('notes', formData.notes)
      }

      const res = await fetch('/api/certificates/upload', {
        method: 'POST',
        body: formDataToSend
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Upload failed')
      }

      setSuccess('Certificate uploaded successfully!')
      logger.log('Certificate uploaded', { context: { code: formData.certificateCode } })
      
      // Reset form
      setTimeout(() => {
        router.push('/admin-dashboard/certificates')
      }, 2000)

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload certificate')
      logger.error('Certificate upload error', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="text-blue-600 hover:text-blue-800 mb-4 flex items-center gap-2"
          >
            ← Back
          </button>
          <div className="flex items-center gap-3">
            <Award className="text-blue-600" size={32} />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Upload Certificate</h1>
              <p className="text-gray-600">Upload and register a new certificate</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex items-center gap-2">
            <AlertCircle size={20} />
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
            {success}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
          
          {/* Certificate Code */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <Hash size={18} />
              Certificate Code *
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={formData.certificateCode}
                onChange={(e) => setFormData({ ...formData, certificateCode: e.target.value.toUpperCase() })}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="CERT-2025-001"
                required
              />
              <button
                type="button"
                onClick={generateCode}
                className="px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition"
              >
                Generate
              </button>
            </div>
            <p className="mt-1 text-sm text-gray-500">Unique verification code for this certificate</p>
          </div>

          {/* Certificate Number (Optional) */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Certificate Display Number (Optional)
            </label>
            <input
              type="text"
              value={formData.certificateNumber}
              onChange={(e) => setFormData({ ...formData, certificateNumber: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="ZA/HTML/2025/001"
            />
            <p className="mt-1 text-sm text-gray-500">Display number shown on certificate (e.g., ZA/HTML/2025/001)</p>
          </div>

          {/* Student Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <User size={18} />
              Select Student *
            </label>
            <select
              onChange={(e) => handleStudentChange(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Choose a student...</option>
              {students.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.name} ({student.email}) - {student.course?.name || 'No Course'}
                </option>
              ))}
            </select>
          </div>

          {/* Student Info Display */}
          {selectedStudent && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">Student Information</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Name:</span>
                  <p className="font-medium">{selectedStudent.name}</p>
                </div>
                <div>
                  <span className="text-gray-600">Email:</span>
                  <p className="font-medium">{selectedStudent.email}</p>
                </div>
                <div>
                  <span className="text-gray-600">Course:</span>
                  <p className="font-medium">{selectedStudent.course?.name || 'N/A'}</p>
                </div>
                {scores.length > 0 && (
                  <div>
                    <span className="text-gray-600">Latest Score:</span>
                    <p className="font-medium">{scores[0].percentage}% - {scores[0].exam.title}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Grade */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Grade
            </label>
            <select
              value={formData.grade}
              onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Distinction">Distinction (90%+)</option>
              <option value="Merit">Merit (80-89%)</option>
              <option value="Pass">Pass (70-79%)</option>
              <option value="Credit">Credit (60-69%)</option>
            </select>
          </div>

          {/* Issue Date */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <Calendar size={18} />
              Issue Date *
            </label>
            <input
              type="date"
              value={formData.issueDate}
              onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Expiry Date (Optional) */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Expiry Date (Optional)
            </label>
            <input
              type="date"
              value={formData.expiryDate}
              onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="mt-1 text-sm text-gray-500">Leave blank for non-expiring certificates</p>
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <Upload size={18} />
              Upload Certificate File *
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition">
              <input
                type="file"
                onChange={handleFileChange}
                accept=".pdf,.png,.jpg,.jpeg"
                className="hidden"
                id="certificate-file"
                required
              />
              <label htmlFor="certificate-file" className="cursor-pointer">
                <FileText className="mx-auto text-gray-400 mb-2" size={40} />
                <p className="text-gray-700 font-medium">
                  {file ? file.name : 'Click to upload certificate'}
                </p>
                <p className="text-sm text-gray-500 mt-1">PDF, PNG, or JPEG (Max 5MB)</p>
              </label>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Admin Notes (Optional)
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Any additional notes or remarks..."
            />
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-400"
            >
              {loading ? 'Uploading...' : 'Upload Certificate'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
