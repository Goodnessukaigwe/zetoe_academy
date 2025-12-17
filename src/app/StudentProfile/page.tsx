'use client'

import React, { useState } from "react"

const Toast = ({ message, onClose }: any) => (
  <div className="fixed top-5 right-5 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg animate-slide-in">
    {message}
    <button onClick={onClose} className="ml-3 font-bold">×</button>
  </div>
)

export default function StudentProfilePage() {
  const [showEditModal, setShowEditModal] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [toast, setToast] = useState("")

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(""), 2500)
  }

  return (
    <div className="min-h-screen bg-[#f2f2f2] font-['Roboto_Condensed'] px-4 py-8">


      {toast && <Toast message={toast} onClose={() => setToast("")} />}

      
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-[#3a0ca3]">Your Profile</h2>
        <p className="text-gray-700 mt-2">Manage your personal information and credentials.</p>

         <button
         
          className="mt-4 inline-block bg-gray-800 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-900 transition"
        >
          ← Back to Dashboard
        </button>
      </div>
  


      <div className="flex flex-col md:flex-row md:space-x-4 gap-6">

        <div className="flex-1 bg-white p-6 rounded-2xl shadow">
          <h3 className="font-semibold mb-4 text-xl text-[#3a0ca3] text-center">Personal Information</h3>

          <div className="space-y-3 text-gray-800">
            <p><span className="font-bold">Name:</span> --- dddddddddddddddddd</p>
            <p><span className="font-bold">Email:</span> --- ssssssssss</p>
            <p><span className="font-bold">Phone:</span> ---ssssssssssssssssa</p>
            <p><span className="font-bold">Course:</span> --- dfghy6tfgju765t </p>
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

                <tbody className="  bg-yellow-100">
                  <tr className="  hover:bg-green-100">
                    <td className=" px-4 py-2">Mid-Semester Test</td>
                    <td className=" px-4 py-2">12 Jan 2025</td>
                    <td className=" px-4 py-2">85%</td>
                    <td className=" px-4 py-2">Passed</td>
                  </tr>

                  <tr className="hover:bg-green-100">
                    <td className=" px-4 py-2">Final Exam</td>
                    <td className=" px-4 py-2">10 May 2025</td>
                    <td className=" px-4 py-2">Pending</td>
                    <td className=" px-4 py-2">Not Released</td>
                  </tr>
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

            <input type="text" placeholder="Full Name" className="w-full p-3 border rounded-lg mb-3"/>
            <input type="email" placeholder="Email" className="w-full p-3 border rounded-lg mb-3"/>
            <input type="text" placeholder="Phone Number" className="w-full p-3 border rounded-lg mb-3"/>

            <div className="flex gap-3 mt-4">
              <button
                className="flex-1 bg-gray-300 text-black py-2 rounded-lg"
                onClick={() => setShowEditModal(false)}
              >
                Cancel
              </button>
              <button
                className="flex-1 bg-[#3a0ca3] text-white py-2 rounded-lg"
                onClick={() => {
                  setShowEditModal(false)
                  showToast("Profile updated successfully!")
                }}
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

            <input type="password" placeholder="Current Password" className="w-full
             p-3 border rounded-lg mb-3"/>
            <input type="password" placeholder="New Password" className="w-full p-3
             border rounded-lg mb-3"/>
            <input type="password" placeholder="Confirm New Password" className="w-full
             p-3 border rounded-lg mb-3"/>

            <div className="flex gap-3 mt-4">
              <button
                className="flex-1 bg-gray-300 text-black py-2 rounded-lg"
                onClick={() => setShowPasswordModal(false)}
              >
                Cancel
              </button>
              <button
                className="flex-1 bg-[#3a0ca3] text-white py-2 rounded-lg"
                onClick={() => {
                  setShowPasswordModal(false)
                  showToast("Password updated successfully!")
                }}
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
