'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Award, Search, Plus, Calendar, Download, Eye, AlertCircle } from 'lucide-react'
import { logger } from '@/lib/logger'

interface Certificate {
  id: string
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
  created_at: string
}

export default function CertificatesPage() {
  const router = useRouter()
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [filteredCerts, setFilteredCerts] = useState<Certificate[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchCertificates()
  }, [])

  useEffect(() => {
    // Filter certificates based on search
    if (searchTerm) {
      const filtered = certificates.filter(cert =>
        cert.certificate_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cert.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cert.student_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cert.course_name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredCerts(filtered)
    } else {
      setFilteredCerts(certificates)
    }
  }, [searchTerm, certificates])

  const fetchCertificates = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/certificates')
      if (res.ok) {
        const data = await res.json()
        setCertificates(data.certificates || [])
        setFilteredCerts(data.certificates || [])
      }
    } catch (err) {
      logger.error('Failed to fetch certificates', err)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (cert: Certificate) => {
    if (!cert.is_active) {
      return <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-semibold">Inactive</span>
    }
    
    if (cert.expiry_date && new Date(cert.expiry_date) < new Date()) {
      return <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-semibold">Expired</span>
    }
    
    return <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">Active</span>
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-700 font-medium">Loading certificates...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Award className="text-blue-600" size={32} />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Certificates Management</h1>
              <p className="text-gray-600">Manage and track all issued certificates</p>
            </div>
          </div>
          <button
            onClick={() => router.push('/admin-dashboard/certificates/upload')}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition shadow-lg"
          >
            <Plus size={20} />
            Upload Certificate
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-6 bg-white rounded-xl shadow-md p-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by code, student name, email, or course..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Certificates</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{certificates.length}</p>
              </div>
              <Award className="text-blue-500" size={40} />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Active</p>
                <p className="text-3xl font-bold text-green-600 mt-1">
                  {certificates.filter(c => c.is_active && (!c.expiry_date || new Date(c.expiry_date) >= new Date())).length}
                </p>
              </div>
              <div className="text-green-500 text-4xl">✓</div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">This Month</p>
                <p className="text-3xl font-bold text-blue-600 mt-1">
                  {certificates.filter(c => {
                    const issueDate = new Date(c.issue_date)
                    const now = new Date()
                    return issueDate.getMonth() === now.getMonth() && issueDate.getFullYear() === now.getFullYear()
                  }).length}
                </p>
              </div>
              <Calendar className="text-blue-500" size={40} />
            </div>
          </div>
        </div>

        {/* Certificates Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {filteredCerts.length === 0 ? (
            <div className="p-12 text-center">
              <Award className="mx-auto text-gray-400 mb-4" size={64} />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                {searchTerm ? 'No certificates found' : 'No certificates yet'}
              </h3>
              <p className="text-gray-500 mb-6">
                {searchTerm ? 'Try adjusting your search terms' : 'Upload your first certificate to get started'}
              </p>
              {!searchTerm && (
                <button
                  onClick={() => router.push('/admin-dashboard/certificates/upload')}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  Upload Certificate
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Certificate Code
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Course
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Grade
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Issue Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredCerts.map((cert) => (
                    <tr key={cert.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Award className="text-blue-500" size={18} />
                          <div>
                            <p className="font-semibold text-gray-900">{cert.certificate_code}</p>
                            {cert.certificate_number && (
                              <p className="text-xs text-gray-500">{cert.certificate_number}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">{cert.student_name}</p>
                          <p className="text-sm text-gray-500">{cert.student_email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-gray-900">{cert.course_name}</p>
                        {cert.exam_title && (
                          <p className="text-xs text-gray-500">{cert.exam_title}</p>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {cert.grade && (
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            cert.grade === 'Distinction' ? 'bg-purple-100 text-purple-800' :
                            cert.grade === 'Merit' ? 'bg-blue-100 text-blue-800' :
                            cert.grade === 'Pass' ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {cert.grade}
                          </span>
                        )}
                        {cert.final_score && (
                          <p className="text-xs text-gray-500 mt-1">{cert.final_score}%</p>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {new Date(cert.issue_date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(cert)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => window.open(cert.file_url, '_blank')}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                            title="View Certificate"
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            onClick={() => window.open(cert.file_url, '_blank')}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                            title="Download Certificate"
                          >
                            <Download size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
