'use client'

import React, { useState } from 'react'
import { Search, Award, CheckCircle, XCircle, Calendar, User, BookOpen, Download, Shield, AlertCircle } from 'lucide-react'
import { logger } from '@/lib/logger'

interface Certificate {
  certificate_code: string
  certificate_number: string | null
  student_name: string
  student_email: string
  course_name: string
  exam_title: string | null
  final_score: number | null
  grade: string | null
  file_url: string
  issue_date: string
  expiry_date: string | null
  is_active: boolean
  is_verified: boolean
  is_expired?: boolean
  is_valid?: boolean
  created_at: string
}

export default function VerifyCertificatePage() {
  const [searchCode, setSearchCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [certificate, setCertificate] = useState<Certificate | null>(null)
  const [error, setError] = useState('')

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!searchCode.trim()) {
      setError('Please enter a certificate code')
      return
    }

    setLoading(true)
    setError('')
    setSearched(true)
    setCertificate(null)

    try {
      const res = await fetch(`/api/certificates/verify?code=${encodeURIComponent(searchCode.trim())}`)
      const data = await res.json()

      if (res.ok && data.found) {
        setCertificate(data.certificate)
        logger.log('Certificate verified successfully', { context: { code: searchCode } })
      } else {
        setError('Certificate not found. Please check the code and try again.')
        logger.warn('Certificate not found', { context: { code: searchCode } })
      }
    } catch (err) {
      setError('Failed to verify certificate. Please try again.')
      logger.error('Certificate verification error', err)
    } finally {
      setLoading(false)
    }
  }

  const getValidityStatus = () => {
    if (!certificate) return null

    if (!certificate.is_active) {
      return {
        color: 'red',
        icon: <XCircle size={48} />,
        title: 'Invalid Certificate',
        message: 'This certificate has been deactivated'
      }
    }

    if (certificate.is_expired) {
      return {
        color: 'orange',
        icon: <AlertCircle size={48} />,
        title: 'Expired Certificate',
        message: `This certificate expired on ${new Date(certificate.expiry_date!).toLocaleDateString()}`
      }
    }

    return {
      color: 'green',
      icon: <CheckCircle size={48} />,
      title: 'Valid Certificate',
      message: 'This certificate is authentic and currently valid'
    }
  }

  const status = certificate ? getValidityStatus() : null

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <Shield className="text-blue-600" size={36} />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Certificate Verification</h1>
              <p className="text-gray-600">Verify the authenticity of Zetoe Academy certificates</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Search Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <Award className="text-blue-600" size={32} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Verify Certificate</h2>
            <p className="text-gray-600">Enter the certificate code to verify its authenticity</p>
          </div>

          <form onSubmit={handleSearch} className="space-y-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={22} />
              <input
                type="text"
                value={searchCode}
                onChange={(e) => setSearchCode(e.target.value.toUpperCase())}
                placeholder="Enter certificate code (e.g., CERT-2025-001)"
                className="w-full pl-14 pr-4 py-4 text-lg border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed shadow-lg"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  Verifying...
                </span>
              ) : (
                'Verify Certificate'
              )}
            </button>
          </form>

          {/* Error Message */}
          {error && (
            <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <XCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <p className="font-semibold text-red-900">Certificate Not Found</p>
                <p className="text-red-700 text-sm mt-1">{error}</p>
              </div>
            </div>
          )}
        </div>

        {/* Certificate Details */}
        {certificate && status && (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Status Banner */}
            <div className={`bg-${status.color}-500 text-white p-6 text-center`}>
              <div className="flex items-center justify-center mb-3">
                {status.icon}
              </div>
              <h3 className="text-2xl font-bold mb-1">{status.title}</h3>
              <p className="text-white/90">{status.message}</p>
            </div>

            {/* Certificate Information */}
            <div className="p-8 space-y-6">
              {/* Certificate Code */}
              <div className="text-center pb-6 border-b">
                <p className="text-sm text-gray-600 mb-1">Certificate Code</p>
                <p className="text-3xl font-bold text-gray-900">{certificate.certificate_code}</p>
                {certificate.certificate_number && (
                  <p className="text-gray-500 mt-2">Certificate No: {certificate.certificate_number}</p>
                )}
              </div>

              {/* Student Information */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <User className="text-blue-600" size={20} />
                    <h4 className="font-semibold text-gray-900">Student Information</h4>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs text-gray-600">Full Name</p>
                      <p className="font-medium text-gray-900">{certificate.student_name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Email</p>
                      <p className="font-medium text-gray-900">{certificate.student_email}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <BookOpen className="text-purple-600" size={20} />
                    <h4 className="font-semibold text-gray-900">Course Information</h4>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs text-gray-600">Course Name</p>
                      <p className="font-medium text-gray-900">{certificate.course_name}</p>
                    </div>
                    {certificate.exam_title && (
                      <div>
                        <p className="text-xs text-gray-600">Exam</p>
                        <p className="font-medium text-gray-900">{certificate.exam_title}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Achievement */}
              {(certificate.grade || certificate.final_score) && (
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-200">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Award className="text-yellow-600" size={20} />
                    Achievement
                  </h4>
                  <div className="flex items-center gap-6">
                    {certificate.grade && (
                      <div>
                        <p className="text-xs text-gray-600">Grade</p>
                        <p className="text-2xl font-bold text-gray-900">{certificate.grade}</p>
                      </div>
                    )}
                    {certificate.final_score && (
                      <div>
                        <p className="text-xs text-gray-600">Score</p>
                        <p className="text-2xl font-bold text-gray-900">{certificate.final_score}%</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Dates */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 bg-blue-50 rounded-lg p-4">
                  <Calendar className="text-blue-600" size={20} />
                  <div>
                    <p className="text-xs text-gray-600">Issue Date</p>
                    <p className="font-medium text-gray-900">
                      {new Date(certificate.issue_date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>

                {certificate.expiry_date && (
                  <div className="flex items-center gap-3 bg-orange-50 rounded-lg p-4">
                    <Calendar className="text-orange-600" size={20} />
                    <div>
                      <p className="text-xs text-gray-600">Expiry Date</p>
                      <p className="font-medium text-gray-900">
                        {new Date(certificate.expiry_date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* View Certificate Button */}
              <button
                onClick={() => window.open(certificate.file_url, '_blank')}
                className="w-full py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition flex items-center justify-center gap-2 shadow-lg"
              >
                <Download size={20} />
                View/Download Certificate
              </button>

              {/* Verification Notice */}
              <div className="bg-gray-50 rounded-lg p-4 text-center border border-gray-200">
                <p className="text-sm text-gray-600">
                  <Shield className="inline mr-1" size={16} />
                  This certificate has been verified through Zetoe Academy's secure verification system
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Verified on {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* How to Use Guide */}
        {!searched && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mt-8">
            <h3 className="font-semibold text-blue-900 mb-3">How to Verify a Certificate</h3>
            <ol className="space-y-2 text-sm text-blue-800">
              <li className="flex items-start gap-2">
                <span className="font-bold">1.</span>
                <span>Locate the certificate code on your certificate (e.g., CERT-2025-001)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold">2.</span>
                <span>Enter the code in the search box above</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold">3.</span>
                <span>Click "Verify Certificate" to check authenticity</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold">4.</span>
                <span>View the certificate details and download if needed</span>
              </li>
            </ol>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-white border-t mt-12 py-6">
        <div className="max-w-6xl mx-auto px-4 text-center text-gray-600">
          <p className="text-sm">
            © {new Date().getFullYear()} Zetoe Academy. All rights reserved.
          </p>
          <p className="text-xs mt-1 text-gray-500">
            Certificate Verification System - Secure and Reliable
          </p>
        </div>
      </footer>
    </div>
  )
}
