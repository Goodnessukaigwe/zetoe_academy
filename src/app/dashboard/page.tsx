'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { BookOpen, Trophy, Clock, User, LogOut, TrendingUp, Calendar } from 'lucide-react'
import { logger } from '@/lib/logger'

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
      logger.log('Me endpoint response', { context: { role: meData.role } })

      if (!meRes.ok) {
        logger.error('Auth check failed', new Error(meData.error))
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
        logger.log('Scores fetched', { context: { count: scoresData.scores?.length || 0, data: scoresData.scores } })
        setScores(scoresData.scores || [])
      } else {
        const errorText = await scoresRes.text()
        logger.error('Failed to fetch scores', new Error(errorText || `HTTP ${scoresRes.status}`))
      }
    } catch (err) {
      logger.error('Error fetching data', err)
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
    router.push('/')
  }

  const getCurrentDate = () => {
    const date = new Date()
    const options: Intl.DateTimeFormatOptions = { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric',
      weekday: 'long'
    }
    return date.toLocaleDateString('en-US', options)
  }

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good Morning'
    if (hour < 18) return 'Good Afternoon'
    return 'Good Evening'
  }

  const calculateProgress = () => {
    if (scores.length === 0) return 0
    const totalScore = scores.reduce((acc, score) => acc + score.percentage, 0)
    return Math.round(totalScore / scores.length)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-700 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 px-6 py-10">
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops! Something went wrong</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button 
              onClick={() => fetchStudentData()} 
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!student) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 px-6 py-10">
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-8 text-center">
          <p className="text-gray-700 text-lg">No student profile found. Please contact support.</p>
        </div>
      </div>
    )
  }

  const progress = calculateProgress()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Welcome To Your Dashboard</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right hidden md:block">
                <p className="text-sm text-gray-600">{getCurrentDate()}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Hero Card */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 text-white shadow-xl">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h2 className="text-3xl font-bold mb-2">{getGreeting()}</h2>
                  <p className="text-blue-100 mb-1">
                    You've learned <span className="text-yellow-300 font-bold">{progress}%</span> of your goal this week!
                  </p>
                  <p className="text-blue-200 text-sm">Keep it up and improve your results!</p>
                </div>
                <div className="hidden md:flex items-center justify-center">
                  <div className="bg-white/10 backdrop-blur-sm rounded-full p-6">
                    <Trophy className="w-20 h-20 text-yellow-300" />
                  </div>
                </div>
              </div>
            </div>

            {/* Latest Progress */}
            <div className="bg-white rounded-3xl p-6 shadow-lg">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-900">Latest Progress</h3>
                <TrendingUp className="text-blue-600" size={20} />
              </div>

              <div className="space-y-4">
                {student.course ? (
                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-600 text-white w-12 h-12 rounded-xl flex items-center justify-center font-bold">
                        <BookOpen size={24} />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{student.course.name}</p>
                        <p className="text-sm text-gray-600">{student.course.description || 'Professional Course'}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full transition-all" style={{ width: `${progress}%` }}></div>
                        </div>
                        <span className="text-blue-600 font-bold text-sm">{progress}%</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 bg-gray-50 rounded-xl">
                    <BookOpen className="mx-auto text-gray-400 mb-2" size={32} />
                    <p className="text-gray-500">No course enrolled yet</p>
                  </div>
                )}
              </div>
            </div>

            {/* Your Exams */}
            <div className="bg-white rounded-3xl p-6 shadow-lg">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-900">Your Exams</h3>
                <Calendar className="text-blue-600" size={20} />
              </div>

              {student.payment_status !== 'paid' ? (
                <div className="bg-yellow-50 border-2 border-yellow-300 rounded-2xl p-6 text-center">
                  <div className="text-5xl mb-3">🔒</div>
                  <h4 className="font-bold text-yellow-900 mb-2">Payment Required</h4>
                  <p className="text-sm text-yellow-800">Complete your payment to unlock all available exams</p>
                </div>
              ) : exams.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-4">
                  {exams.slice(0, 6).map((exam, index) => {
                    const colors = ['bg-green-500', 'bg-blue-500', 'bg-red-500', 'bg-purple-500', 'bg-orange-500', 'bg-pink-500']
                    const bgColors = ['bg-green-50', 'bg-blue-50', 'bg-red-50', 'bg-purple-50', 'bg-orange-50', 'bg-pink-50']
                    return (
                      <div 
                        key={exam.id} 
                        onClick={() => router.push(`/exam/${exam.id}`)}
                        className={`${bgColors[index % 6]} rounded-2xl p-5 cursor-pointer hover:shadow-md transition hover:scale-105`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className={`${colors[index % 6]} text-white w-16 h-16 rounded-xl flex items-center justify-center text-xl font-bold shadow-lg`}>
                            {exam.code.substring(0, 2)}
                          </div>
                          <Clock className="text-gray-400" size={18} />
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 mb-1">{exam.title}</h4>
                          <p className="text-xs text-gray-600">{exam.code}</p>
                          <p className="text-xs text-gray-500 mt-2">
                            {exam.duration_minutes} mins • Pass: {exam.passing_score}%
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-xl">
                  <Calendar className="mx-auto text-gray-400 mb-2" size={32} />
                  <p className="text-gray-500">No exams available for your course yet</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            
            {/* Profile Card */}
            <div className="bg-white rounded-3xl p-6 shadow-lg text-center">
              {student.profile_picture_url ? (
                <div className="w-24 h-24 rounded-full mx-auto mb-4 overflow-hidden shadow-lg border-4 border-blue-500">
                  <img 
                    src={student.profile_picture_url} 
                    alt={student.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                  {student.name.charAt(0).toUpperCase()}
                </div>
              )}
              <h3 className="font-bold text-xl text-gray-900 mb-1">{student.name}</h3>
              <p className="text-blue-600 text-sm font-semibold mb-4">Student</p>
              <div className="space-y-2 text-sm text-gray-600 text-left bg-gray-50 rounded-xl p-4">
                <div className="flex items-center gap-2">
                  <User size={16} className="text-gray-400" />
                  <span className="truncate">{student.email}</span>
                </div>
                {student.course && (
                  <div className="flex items-center gap-2">
                    <BookOpen size={16} className="text-gray-400" />
                    <span className="truncate">{student.course.name}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Payment Status */}
            <div className="bg-white rounded-3xl p-6 shadow-lg">
              <h3 className="font-semibold text-gray-900 mb-4">Payment Status</h3>
              <div className={`${getPaymentStatusColor(student.payment_status)} text-white px-4 py-3 rounded-xl text-center font-bold shadow-md`}>
                {getPaymentStatusText(student.payment_status)}
              </div>
            </div>

            {/* Reminders/Upcoming */}
            <div className="bg-white rounded-3xl p-6 shadow-lg">
              <h3 className="font-semibold text-gray-900 mb-4">Upcoming Exams</h3>
              <div className="space-y-3">
                {exams.slice(0, 3).map((exam, index) => (
                  <div key={exam.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
                    <div className="bg-blue-100 text-blue-600 px-3 py-1 rounded-lg text-xs font-bold">
                      {index === 0 ? 'Today' : index === 1 ? 'Tomorrow' : 'Soon'}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 text-sm">{exam.title}</p>
                      <p className="text-xs text-gray-600">{exam.duration_minutes} minutes</p>
                    </div>
                  </div>
                ))}
                {exams.length === 0 && (
                  <div className="text-center py-4">
                    <Calendar className="mx-auto text-gray-400 mb-2" size={24} />
                    <p className="text-gray-500 text-sm">No upcoming exams</p>
                  </div>
                )}
              </div>
            </div>

            {/* Your Scores */}
            <div className="bg-white rounded-3xl p-6 shadow-lg">
              <h3 className="font-semibold text-gray-900 mb-4">Recent Scores</h3>
              <div className="space-y-3">
                {scores.length > 0 ? (
                  scores.slice(0, 4).map((score) => (
                    <div key={score.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 text-sm">{score.exam.title}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(score.submitted_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className={`text-lg font-bold ${
                          score.status === 'passed' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {score.percentage}%
                        </div>
                        <span className={`text-xs px-2 py-1 rounded ${
                          score.status === 'passed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {score.status.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4">
                    <Trophy className="mx-auto text-gray-400 mb-2" size={24} />
                    <p className="text-gray-500 text-sm">No exam results yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;