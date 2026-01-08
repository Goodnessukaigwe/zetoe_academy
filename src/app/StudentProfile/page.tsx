'use client'

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

const Toast = ({ message, onClose }: any) => (
  <div className="fixed top-5 right-5 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg animate-slide-in">
    {message}
    <button onClick={onClose} className="ml-3 font-bold">×</button>
  </div>
)

interface Profile {
  id: string
  name: string
  email: string
  phone: string | null
  course: {
    id: string
    name: string
    price: number
  } | null
}

interface Score {
  id: string
  exam: {
    title: string
  }
  submitted_at: string
  percentage: number
  status: string
}

export default function StudentProfilePage() {
  const router = useRouter()
  const [showEditModal, setShowEditModal] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [toast, setToast] = useState("")
  const [profile, setProfile] = useState<Profile | null>(null)
  const [scores, setScores] = useState<Score[]>([])
  const [loading, setLoading] = useState(true)
  const [editForm, setEditForm] = useState({ name: "", phone: "" })
  const [passwordForm, setPasswordForm] = useState({ 
    currentPassword: "", 
    newPassword: "", 
    confirmPassword: "" 
  })

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(""), 2500)
  }

  // Fetch profile data on mount
  useEffect(() => {
    fetchProfile()
    fetchScores()
  }, [])

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/profile')
      if (response.ok) {
        const data = await response.json()
        setProfile(data.profile)
        setEditForm({
          name: data.profile.name,
          phone: data.profile.phone || ""
        })
      } else {
        showToast("Failed to load profile")
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
      showToast("Error loading profile")
    } finally {
      setLoading(false)
    }
  }

  const fetchScores = async () => {
    try {
      const response = await fetch('/api/scores')
      if (response.ok) {
        const data = await response.json()
        setScores(data.scores || [])
      }
    } catch (error) {
      console.error('Error fetching scores:', error)
    }
  }

  const handleUpdateProfile = async () => {
    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm)
      })

      if (response.ok) {
        const data = await response.json()
        setProfile(data.profile)
        setShowEditModal(false)
        showToast("Profile updated successfully!")
      } else {
        const errorData = await response.json()
        showToast(errorData.error || "Failed to update profile")
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      showToast("Error updating profile")
    }
  }

  const handleUpdatePassword = async () => {
    if (!passwordForm.currentPassword) {
      showToast("Current password is required")
      return
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showToast("Passwords don't match!")
      return
    }

    // Validate password strength (matching server-side rules)
    if (passwordForm.newPassword.length < 8) {
      showToast("Password must be at least 8 characters")
      return
    }

    const hasUpperCase = /[A-Z]/.test(passwordForm.newPassword)
    const hasLowerCase = /[a-z]/.test(passwordForm.newPassword)
    const hasNumber = /[0-9]/.test(passwordForm.newPassword)

    if (!hasUpperCase || !hasLowerCase || !hasNumber) {
      showToast("Password must contain uppercase, lowercase, and numbers")
      return
    }

    try {
      const response = await fetch('/api/auth/update-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword 
        })
      })

      if (response.ok) {
        setShowPasswordModal(false)
        setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" })
        showToast("Password updated successfully!")
      } else {
        const errorData = await response.json()
        showToast(errorData.error || "Failed to update password")
      }
    } catch (error) {
      console.error('Error updating password:', error)
      showToast("Error updating password")
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f2f2f2] flex items-center justify-center">
        <div className="text-xl text-[#3a0ca3]">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f2f2f2] font-['Roboto_Condensed'] px-4 py-8">


      {toast && <Toast message={toast} onClose={() => setToast("")} />}

      
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-[#3a0ca3]">Your Profile</h2>
        <p className="text-gray-700 mt-2">Manage your personal information and credentials.</p>

         <button
          onClick={() => router.push('/dashboard')}
          className="mt-4 inline-block bg-gray-800 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-900 transition"
        >
          ← Back to Dashboard
        </button>
      </div>
  


      <div className="flex flex-col md:flex-row md:space-x-4 gap-6">

        <div className="flex-1 bg-white p-6 rounded-2xl shadow">
          <h3 className="font-semibold mb-4 text-xl text-[#3a0ca3] text-center">Personal Information</h3>

          <div className="space-y-3 text-gray-800">
            <p><span className="font-bold">Name:</span> {profile?.name || 'N/A'}</p>
            <p><span className="font-bold">Email:</span> {profile?.email || 'N/A'}</p>
            <p><span className="font-bold">Phone:</span> {profile?.phone || 'Not provided'}</p>
            <p><span className="font-bold">Course:</span> {profile?.course?.name || 'No course assigned'}</p>
          </div>

          <button
            onClick={() => setShowEditModal(true)}
            className="mt-5 w-full bg-[#3a0ca3] text-white py-2 rounded-lg hover:bg-[#4b18d0]"
          >
            Edit Personal Info
          </button>
        </div>

        {/* CHANGE PASSWORD */}
        <div className="flex-1 bg-white p-8 rounded-2xl shadow">
          <h3 className="font-semibold mb-4 text-xl text-[#3a0ca3] text-center">Change Password</h3>
          <p className="text-center text-gray-500 mb-4 text-sm">Update your login password.</p>

          <button
            onClick={() => setShowPasswordModal(true)}
            className="w-full bg-[#3a0ca3] text-white py-2 rounded-lg
             hover:bg-[#4b18d0]"
          >
            Update Password
          </button>
        </div>
      </div>

  
      <div className="flex flex-col md:flex-row md:space-x-6 gap-6 mt-6">

        {/* EXAM HISTORY */}
        <div className="flex-1 bg-white p-6 rounded-2xl shadow text-center">
          <h3 className="font-semibold text-xl text-[#3a0ca3]">Exam History</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full  text-sm text-black">
                <thead className="bg-green-700 text-white">
                  <tr>
                    <th className="border px-4 py-2 text-left">Exam</th>
                    <th className="border px-4 py-2 text-left">Date</th>
                    <th className="border px-4 py-2 text-left">Score</th>
                    <th className="border px-4 py-2 text-left">Status</th>
                  </tr>
                </thead>

                <tbody className="bg-yellow-100">
                  {scores.length > 0 ? (
                    scores.map((score) => (
                      <tr key={score.id} className="hover:bg-green-100">
                        <td className="px-4 py-2">{score.exam?.title || 'N/A'}</td>
                        <td className="px-4 py-2">{formatDate(score.submitted_at)}</td>
                        <td className="px-4 py-2">{score.percentage?.toFixed(0)}%</td>
                        <td className="px-4 py-2">{score.status || 'Completed'}</td>
                      </tr>
                    ))
                  ) : (
                    <tr className="hover:bg-green-100">
                      <td colSpan={4} className="px-4 py-2 text-center text-gray-500">
                        No exam history yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
          </div>
          </div>
         
         
         

        {/* CERTIFICATES */}
        <div className="flex-1 bg-white p-6 rounded-2xl shadow text-center">
          <h3 className="font-semibold text-xl text-[#3a0ca3]">Certificates</h3>
          <p className="text-gray-600  italic text-sm mt-2">
            Your certificates will appear here after completing a course.</p>
        <button className=" bg-[#3a0ca3] text-white 
         rounded-lg hover:bg-[#4b18d0] shadow-md mt-8 px-5 py-2 font-semibold ">
              Download Exam Certificate
            </button>
             {/* <button className="bg-[#3a0ca3] hover:bg-[#26056a] 
            transition-all duration-300 shadow-md px-5 py-2 text-white 
            font-semibold rounded-lg">
              Download Exam Certificate
            </button> */}
        </div>
      </div>

    
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center px-4">
          <div className="bg-white w-full text-black max-w-md p-6 rounded-xl shadow-lg animate-pop">
            <h3 className="text-lg font-bold text-[#3a0ca3] mb-4 text-center">Edit Personal Information</h3>

            <input 
              type="text" 
              placeholder="Full Name" 
              value={editForm.name}
              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              className="w-full p-3 border rounded-lg mb-3"
            />
            <input 
              type="text" 
              placeholder="Phone Number" 
              value={editForm.phone}
              onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
              className="w-full p-3 border rounded-lg mb-3"
            />

            <div className="flex gap-3 mt-4">
              <button
                className="flex-1 bg-gray-300 text-black py-2 rounded-lg"
                onClick={() => setShowEditModal(false)}
              >
                Cancel
              </button>
              <button
                className="flex-1 bg-[#3a0ca3] text-white py-2 rounded-lg"
                onClick={handleUpdateProfile}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center px-4">
          <div className="bg-white w-full max-w-md p-6  text-black
          rounded-xl shadow-lg animate-pop">
            <h3 className="text-lg font-bold text-[#3a0ca3] mb-4 text-center">Change Password</h3>

            <input 
              type="password" 
              placeholder="Current Password" 
              value={passwordForm.currentPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
              className="w-full p-3 border rounded-lg mb-3"
            />
            <input 
              type="password" 
              placeholder="New Password" 
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
              className="w-full p-3 border rounded-lg mb-3"
            />
            <input 
              type="password" 
              placeholder="Confirm New Password" 
              value={passwordForm.confirmPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
              className="w-full p-3 border rounded-lg mb-3"
            />

            <div className="flex gap-3 mt-4">
              <button
                className="flex-1 bg-gray-300 text-black py-2 rounded-lg"
                onClick={() => setShowPasswordModal(false)}
              >
                Cancel
              </button>
              <button
                className="flex-1 bg-[#3a0ca3] text-white py-2 rounded-lg"
                onClick={handleUpdatePassword}
              >
                Update
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
