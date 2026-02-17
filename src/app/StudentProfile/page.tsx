'use client'

import React, { useState } from "react"
import Link from "next/link"

const Toast = ({ message, onClose }: any) => (
  <div className="fixed top-20 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-slide-in z-50">
    {message}
    <button onClick={onClose} className="ml-3 font-bold">×</button>
  </div>
)

interface StudentProfile {
  name: string
  email: string
  phone: string
  course: string
  enrollmentDate: string
  status: string
}

export default function StudentProfilePage() {
  const [showEditModal, setShowEditModal] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [toast, setToast] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  })
  const [passwordData, setPasswordData] = useState({
    current: "",
    new: "",
    confirm: "",
  })

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(""), 2500)
  }

  const handleEditSave = () => {
    setShowEditModal(false)
    showToast("✓ Profile updated successfully!")
  }

  const handlePasswordUpdate = () => {
    if (passwordData.new !== passwordData.confirm) {
      showToast("✗ Passwords do not match!")
      return
    }
    setShowPasswordModal(false)
    showToast("✓ Password updated successfully!")
    setPasswordData({ current: "", new: "", confirm: "" })
  }

  // Mock student data
  const student: StudentProfile = {
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+234 800 123 4567",
    course: "Professional Development Program",
    enrollmentDate: "January 15, 2025",
    status: "Active",
  }

  const examHistory = [
    {
      id: 1,
      exam: "Professional Readiness Assessment",
      date: "12 Jan 2025",
      score: "85%",
      status: "Passed",
    },
    {
      id: 2,
      exam: "Management Fundamentals",
      date: "10 Feb 2025",
      score: "92%",
      status: "Passed",
    },
    {
      id: 3,
      exam: "Advanced Certification",
      date: "Scheduled",
      score: "—",
      status: "Pending",
    },
  ]

  const certificates = [
    { id: 1, name: "Professional Development Certificate", issuedDate: "12 Jan 2025" },
  ]

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      {toast && <Toast message={toast} onClose={() => setToast("")} />}

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">My Profile</h1>
              <p className="text-gray-600 mt-2">Manage your account information and view your progress</p>
            </div>
            <Link
              href="/student-dashboard"
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition font-medium"
            >
              ← Back
            </Link>
          </div>
        </div>

        {/* Profile Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          {/* Personal Information Card */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-8 border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">📋 Personal Information</h2>
                <button
                  onClick={() => setShowEditModal(true)}
                  className="text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  Edit
                </button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-500 font-medium mb-1">Full Name</p>
                    <p className="text-lg font-semibold text-gray-900">{student.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium mb-1">Email Address</p>
                    <p className="text-lg font-semibold text-gray-900">{student.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium mb-1">Phone Number</p>
                    <p className="text-lg font-semibold text-gray-900">{student.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium mb-1">Status</p>
                    <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                      {student.status}
                    </span>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <p className="text-sm text-gray-500 font-medium mb-2">Current Course</p>
                  <p className="text-lg font-semibold text-gray-900 mb-2">{student.course}</p>
                  <p className="text-sm text-gray-600">Enrolled: {student.enrollmentDate}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Security Card */}
          <div>
            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg shadow-md p-6 border border-indigo-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">🔒 Security</h3>
              <p className="text-gray-700 text-sm mb-6">Keep your account secure by updating your password regularly.</p>
              <button
                onClick={() => setShowPasswordModal(true)}
                className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition font-semibold"
              >
                Change Password
              </button>
            </div>
          </div>
        </div>

        {/* Exam History and Certificates */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Exam History */}
          <div className="bg-white rounded-lg shadow-md p-8 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">📝 Exam History</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-gray-600 font-semibold">Exam</th>
                    <th className="text-left py-3 px-4 text-gray-600 font-semibold">Date</th>
                    <th className="text-left py-3 px-4 text-gray-600 font-semibold">Score</th>
                    <th className="text-left py-3 px-4 text-gray-600 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {examHistory.map((exam) => (
                    <tr key={exam.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-gray-800">{exam.exam}</td>
                      <td className="py-3 px-4 text-gray-700">{exam.date}</td>
                      <td className="py-3 px-4 font-semibold text-gray-900">{exam.score}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                            exam.status === "Passed"
                              ? "bg-green-100 text-green-800"
                              : exam.status === "Pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {exam.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Certificates */}
          <div className="bg-white rounded-lg shadow-md p-8 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">🎓 Certificates</h2>
            {certificates.length > 0 ? (
              <div className="space-y-4">
                {certificates.map((cert) => (
                  <div key={cert.id} className="border border-gray-200 rounded-lg p-4 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900">{cert.name}</p>
                      <p className="text-sm text-gray-600">Issued: {cert.issuedDate}</p>
                    </div>
                    <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition font-medium text-sm">
                      Download
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600 mb-4">No certificates yet</p>
                <p className="text-sm text-gray-500">Complete courses to earn certificates</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center px-4 z-50 animate-pop">
          <div className="bg-white w-full max-w-md p-8 rounded-xl shadow-lg border border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Edit Profile</h3>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  defaultValue={student.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900"
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                <input
                  type="email"
                  defaultValue={student.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900"
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  defaultValue={student.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900"
                  placeholder="Enter your phone number"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowEditModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSave}
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center px-4 z-50 animate-pop">
          <div className="bg-white w-full max-w-md p-8 rounded-xl shadow-lg border border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Change Password</h3>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Current Password</label>
                <input
                  type="password"
                  value={passwordData.current}
                  onChange={(e) => setPasswordData({ ...passwordData, current: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900"
                  placeholder="Enter current password"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">New Password</label>
                <input
                  type="password"
                  value={passwordData.new}
                  onChange={(e) => setPasswordData({ ...passwordData, new: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900"
                  placeholder="Enter new password"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm Password</label>
                <input
                  type="password"
                  value={passwordData.confirm}
                  onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900"
                  placeholder="Confirm new password"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowPasswordModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handlePasswordUpdate}
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition"
              >
                Update Password
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .animate-pop { animation: popIn 0.25s ease-in-out; }
        .animate-slide-in { animation: slideIn 0.35s ease-out; }

        @keyframes popIn {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }

        @keyframes slideIn {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  )
}
