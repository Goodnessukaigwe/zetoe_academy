'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface StudentProfile {
  id: string
  name: string
  email: string
  payment_status: 'paid' | 'unpaid' | 'partial'
  course: {
    id: string
    name: string
    description: string
  } | null
}

interface Exam {
  id: string
  title: string
  code: string
  description: string
  duration_minutes: number
  passing_score: number
}

interface Score {
  id: string
  exam: {
    title: string
  }
  score: number
  percentage: number
  status: 'passed' | 'failed'
  submitted_at: string
}

const Page = () => {
  const [student, setStudent] = useState<StudentProfile | null>(null)
  const [exams, setExams] = useState<Exam[]>([])
  const [scores, setScores] = useState<Score[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    fetchStudentData()
  }, [])

  const fetchStudentData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch current user profile
      const meRes = await fetch('/api/auth/me')
      const meData = await meRes.json()
      console.log('Me endpoint response:', meData)

      if (!meRes.ok) {
        console.error('Auth check failed:', meData)
        router.push('/login')
        return
      }

      if (meData.role !== 'student') {
        // Redirect non-students to appropriate dashboard
        if (meData.role === 'super_admin') {
          router.push('/super-admin-dashboard')
        } else if (meData.role === 'admin') {
          router.push('/admin-dashboard')
        }
        return
      }

      setStudent(meData.profile)

      // Fetch available exams if student has a course
      if (meData.profile?.course?.id) {
        const examsRes = await fetch(`/api/exams?courseId=${meData.profile.course.id}`)
        if (examsRes.ok) {
          const examsData = await examsRes.json()
          setExams(examsData.exams || [])
        }
      }

      // Fetch student scores
      const scoresRes = await fetch('/api/scores')
      if (scoresRes.ok) {
        const scoresData = await scoresRes.json()
        setScores(scoresData.scores || [])
      }
    } catch (err) {
      console.error('Error fetching data:', err)
      setError('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-600'
      case 'partial':
        return 'bg-yellow-500'
      case 'unpaid':
        return 'bg-red-600'
      default:
        return 'bg-gray-500'
    }
  }

  const getPaymentStatusText = (status: string) => {
    switch (status) {
      case 'paid':
        return 'Paid ✓'
      case 'partial':
        return 'Partial Payment'
      case 'unpaid':
        return 'Unpaid'
      default:
        return 'Unknown'
    }
  }

  const handleLogout = async () => {
    await fetch('/api/auth/signout', { method: 'POST' })
    router.push('/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f2f2f2] px-6 py-10 font-['Roboto_Condensed'] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3a0ca3] mx-auto mb-4"></div>
          <p className="text-gray-700">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#f2f2f2] px-6 py-10 font-['Roboto_Condensed']">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p className="font-bold">Error</p>
          <p>{error}</p>
          <button onClick={() => fetchStudentData()} className="mt-2 text-sm underline">Retry</button>
        </div>
      </div>
    )
  }

  if (!student) {
    return (
      <div className="min-h-screen bg-[#f2f2f2] px-6 py-10 font-['Roboto_Condensed']">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          <p>No student profile found. Please contact support.</p>
        </div>
      </div>
    )
  }

return (
<div className="min-h-screen bg-[#f2f2f2] px-6 py-10 font-['Roboto_Condensed']">
  <div className="mb-8">
    <h2 className="text-3xl font-bold mb-2 text-[#3a0ca3]">  
      Welcome back, {student.name.split(' ')[0]}! 👋  
    </h2>  
    <p className="text-gray-700">  
      Here you can view your profile, payment status, courses, and available exams.  
    </p>
  </div>

  <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">  
    <div className=" bg-white p-6 rounded-2xl shadow hover:shadow-lg transition duration-300 text-white">  
      <h3 className="font-semibold mb-4 text-xl text-[#3a0ca3]  text-center">Profile Info</h3>  
      <div className="space-y-2  text-gray-800">  
        <p className="text-lg font-bold">{student.name}</p>  
        <p className="text-sm">{student.email}</p>  
        {student.course ? (
          <p className="text-sm italic text-[#3a0ca3]">{student.course.name}</p>
        ) : (
          <p className="text-sm italic text-gray-400">No course enrolled</p>
        )}
      </div>  
    </div>  

      
    <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition duration-300">  
      <h3 className="font-semibold mb-3 text-[#3a0ca3] text-lg">Payment Status</h3>  
      <span className={`${getPaymentStatusColor(student.payment_status)} text-white px-4 py-2 rounded-full text-sm font-bold inline-block`}>  
        {getPaymentStatusText(student.payment_status)}
      </span>
      {student.payment_status !== 'paid' && (
        <p className="text-xs text-gray-600 mt-3">
          Complete your payment to access all exams
        </p>
      )}
    </div>  

    
    <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition duration-300">  
      <h3 className="font-semibold mb-3 text-[#3a0ca3] text-lg">Available Exams</h3>  
      {student.payment_status !== 'paid' ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800 font-semibold">
            🔒 Pay to Access Exams
          </p>
          <p className="text-xs text-yellow-700 mt-1">
            Complete your payment to unlock all available exams
          </p>
        </div>
      ) : exams.length > 0 ? (
        <ul className="space-y-2">  
          {exams.map((exam) => (
            <li key={exam.id} className="bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition cursor-pointer">
              <p className="font-semibold text-gray-800">{exam.title}</p>
              <p className="text-xs text-gray-600">Code: {exam.code}</p>
              <p className="text-xs text-gray-500">
                Duration: {exam.duration_minutes} mins | Pass: {exam.passing_score}%
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-gray-500">No exams available for your course yet</p>
      )}
    </div>  

    
    <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition duration-300">  
      <h3 className="font-semibold mb-3 text-[#3a0ca3] text-lg">Your Scores</h3>  
      {scores.length > 0 ? (
        <ul className="space-y-2">
          {scores.map((score) => (
            <li key={score.id} className="border-b pb-2">
              <p className="font-semibold text-gray-800">{score.exam.title}</p>
              <div className="flex justify-between items-center mt-1">
                <span className="text-sm text-gray-600">{score.percentage}%</span>
                <span className={`text-xs px-2 py-1 rounded ${
                  score.status === 'passed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {score.status.toUpperCase()}
                </span>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-gray-500">No exam results yet</p>
      )}
    </div>  
  </div> 
</div>
);
};

export default Page;