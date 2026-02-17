'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { BookOpen, Trophy, Clock, User, LogOut, TrendingUp, Calendar } from 'lucide-react'
import { logger } from '@/lib/logger'

interface StudentProfile {
  id: string
  name: string
  username?: string
  email: string
  payment_status: 'paid' | 'unpaid' | 'partial'
  profile_picture_url?: string | null
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
  const [focusSeconds, setFocusSeconds] = useState(25 * 60)
  const [focusRunning, setFocusRunning] = useState(false)
  const [checklist, setChecklist] = useState([
    { id: 'goal-1', label: 'Review lesson notes', done: false },
    { id: 'goal-2', label: 'Complete 1 practice exam', done: false },
    { id: 'goal-3', label: 'Summarize key concepts', done: false },
  ])
  const [streakCount, setStreakCount] = useState(0)
  const [checkedInToday, setCheckedInToday] = useState(false)
  const [flashcardIndex, setFlashcardIndex] = useState(0)
  const [flashcardFlipped, setFlashcardFlipped] = useState(false)
  const [tipIndex, setTipIndex] = useState(0)
  const router = useRouter()

  useEffect(() => {
    fetchStudentData()
  }, [])

  useEffect(() => {
    if (!focusRunning) return
    if (focusSeconds === 0) {
      setFocusRunning(false)
      return
    }

    const timer = window.setInterval(() => {
      setFocusSeconds((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)

    return () => window.clearInterval(timer)
  }, [focusRunning, focusSeconds])

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

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const setFocusPreset = (minutes: number) => {
    setFocusRunning(false)
    setFocusSeconds(minutes * 60)
  }

  const toggleChecklist = (id: string) => {
    setChecklist((items) =>
      items.map((item) => (item.id === id ? { ...item, done: !item.done } : item))
    )
  }

  const handleCheckIn = () => {
    if (checkedInToday) return
    setCheckedInToday(true)
    setStreakCount((prev) => prev + 1)
  }

  const resetStreak = () => {
    setCheckedInToday(false)
    setStreakCount(0)
  }

  const flashcards = [
    {
      question: 'Define active recall.',
      answer: 'A study method where you try to retrieve information from memory without cues.',
    },
    {
      question: 'What improves long-term retention most?',
      answer: 'Spaced repetition across multiple sessions over time.',
    },
    {
      question: 'When is a good time to review notes?',
      answer: 'Within 24 hours after learning to reinforce memory.',
    },
  ]

  const studyTips = [
    'Start with a 25 minute focus session to build momentum.',
    'Teach a concept aloud to uncover gaps in understanding.',
    'Mix topics instead of studying one topic for too long.',
    'End each session by planning the next step.',
  ]

  const handleNextFlashcard = () => {
    setFlashcardFlipped(false)
    setFlashcardIndex((prev) => (prev + 1) % flashcards.length)
  }

  const handlePrevFlashcard = () => {
    setFlashcardFlipped(false)
    setFlashcardIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length)
  }

  const handleNextTip = () => {
    setTipIndex((prev) => (prev + 1) % studyTips.length)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f4ef] flex items-center justify-center">
        <div className="text-center bg-white/80 backdrop-blur rounded-3xl px-10 py-8 shadow-xl ring-1 ring-slate-200">
          <div className="animate-spin rounded-full h-14 w-14 border-[3px] border-slate-900 border-t-transparent mx-auto mb-4"></div>
          <p className="text-slate-700 font-semibold tracking-tight">Preparing your learning space...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#f7f4ef] px-6 py-10">
        <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-xl p-8 ring-1 ring-slate-200">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">We hit a bump</h2>
            <p className="text-slate-600 mb-6">{error}</p>
            <button 
              onClick={() => fetchStudentData()} 
              className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-xl font-semibold transition"
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
      <div className="min-h-screen bg-[#f7f4ef] px-6 py-10">
        <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-xl p-8 text-center ring-1 ring-slate-200">
          <p className="text-slate-700 text-lg">No student profile found. Please contact support.</p>
        </div>
      </div>
    )
  }

  
  const progress = calculateProgress()

  return (
    <div className="min-h-screen bg-[#f7f4ef] text-slate-900 relative overflow-hidden">
      <div className="absolute -top-32 -right-24 h-72 w-72 rounded-full bg-amber-200/70 blur-3xl" />
      <div className="absolute top-1/3 -left-32 h-80 w-80 rounded-full bg-sky-200/70 blur-3xl" />

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Zetoe Academy</p>
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900">Student Dashboard</h1>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden md:block text-right">
                <p className="text-sm text-slate-600">{getCurrentDate()}</p>
              </div>
              {/* Sign out */}
              {/* <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
              >
                <LogOut size={16} />
                Sign out
              </button> */}
            </div>
          </div>
        </div>
      </header>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-[2fr_1fr] gap-8">
          
          {/* Left Column - Main Content */}
          <div className="space-y-6">
            
            {/* Hero Card */}
            <div className="relative overflow-hidden rounded-[32px] bg-slate-900 text-white shadow-2xl">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(251,191,36,0.25),_transparent_55%)]" />
              <div className="relative p-8 sm:p-10">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                  <div>
                    <p className="text-sm text-amber-200 font-semibold tracking-wide">{getGreeting()}, {student.name.split(' ')[0]}</p>
                    <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight mt-2">Your learning space is ready</h2>
                    <p className="text-slate-200 mt-3 max-w-xl">
                      You are <span className="text-amber-300 font-semibold">{progress}%</span> toward your weekly goal. Keep the momentum and aim for mastery.
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="bg-white/10 rounded-2xl px-5 py-4">
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-200">Average</p>
                      <p className="text-3xl font-semibold text-amber-300 mt-1">{progress}%</p>
                      <p className="text-xs text-slate-300">Progress score</p>
                    </div>
                    <div className="hidden sm:flex items-center justify-center bg-white/10 rounded-2xl p-4">
                      <Trophy className="w-12 h-12 text-amber-300" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
              <div className="bg-white rounded-2xl p-5 shadow-lg ring-1 ring-slate-200">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Course</p>
                <p className="text-lg font-semibold text-slate-900 mt-2 line-clamp-1">
                  {student.course?.name || 'Not enrolled'}
                </p>
                <div className="mt-4 h-2 rounded-full bg-slate-100">
                  <div className="h-2 rounded-full bg-amber-400" style={{ width: `${progress}%` }}></div>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-5 shadow-lg ring-1 ring-slate-200">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Available Exams</p>
                <p className="text-3xl font-semibold text-slate-900 mt-2">{exams.length}</p>
                <p className="text-sm text-slate-600 mt-1">Ready when you are</p>
              </div>
              <div className="bg-white rounded-2xl p-5 shadow-lg ring-1 ring-slate-200">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Results</p>
                <p className="text-3xl font-semibold text-slate-900 mt-2">{scores.length}</p>
                <p className="text-sm text-slate-600 mt-1">Recorded attempts</p>
              </div>
              <div className="bg-white rounded-2xl p-5 shadow-lg ring-1 ring-slate-200">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Payment</p>
                <div className="mt-2 inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                  {getPaymentStatusText(student.payment_status)}
                </div>
                <p className="text-sm text-slate-600 mt-3">Stay up to date</p>
              </div>
            </div>

            {/* Current Focus */}
            <div className="bg-white rounded-3xl p-6 shadow-lg ring-1 ring-slate-200">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Current Focus</h3>
                  <p className="text-sm text-slate-600">Track your active course performance</p>
                </div>
                <TrendingUp className="text-amber-500" size={22} />
              </div>

              <div className="space-y-4">
                {student.course ? (
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                    <div className="flex items-center gap-4">
                      <div className="bg-slate-900 text-white w-12 h-12 rounded-2xl flex items-center justify-center">
                        <BookOpen size={22} />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{student.course.name}</p>
                        <p className="text-sm text-slate-600">{student.course.description || 'Professional Course'}</p>
                      </div>
                    </div>
                    <div className="sm:text-right">
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Progress</p>
                      <div className="mt-2 flex items-center gap-3">
                        <div className="w-28 bg-slate-200 rounded-full h-2">
                          <div className="bg-amber-500 h-2 rounded-full transition-all" style={{ width: `${progress}%` }}></div>
                        </div>
                        <span className="text-slate-900 font-semibold text-sm">{progress}%</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                    <BookOpen className="mx-auto text-slate-400 mb-2" size={32} />
                    <p className="text-slate-500">No course enrolled yet</p>
                  </div>
                )}
              </div>
            </div>

            {/* Your Exams */}
            <div className="bg-white rounded-3xl p-6 shadow-lg ring-1 ring-slate-200">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Your Exams</h3>
                  <p className="text-sm text-slate-600">Jump back in when you are ready</p>
                </div>
                <Calendar className="text-slate-400" size={20} />
              </div>

              {student.payment_status !== 'paid' ? (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-center">
                  <div className="text-5xl mb-3">🔒</div>
                  <h4 className="font-semibold text-amber-900 mb-2">Payment Required</h4>
                  <p className="text-sm text-amber-800">Complete your payment to unlock all available exams</p>
                </div>
              ) : exams.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-4">
                  {exams.slice(0, 6).map((exam, index) => {
                    const colors = ['bg-emerald-500', 'bg-sky-500', 'bg-rose-500', 'bg-amber-500', 'bg-teal-500', 'bg-orange-500']
                    const bgColors = ['bg-emerald-50', 'bg-sky-50', 'bg-rose-50', 'bg-amber-50', 'bg-teal-50', 'bg-orange-50']
                    return (
                      <div 
                        key={exam.id} 
                        onClick={() => router.push(`/exam/${exam.id}`)}
                        className={`${bgColors[index % 6]} group rounded-2xl p-5 cursor-pointer border border-transparent hover:border-slate-200 hover:shadow-lg transition`}
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className={`${colors[index % 6]} text-white w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-semibold shadow-md`}>
                            {exam.code.substring(0, 2)}
                          </div>
                          <Clock className="text-slate-400" size={18} />
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-900 mb-1 group-hover:text-slate-950">{exam.title}</h4>
                          <p className="text-xs text-slate-600">{exam.code}</p>
                          <p className="text-xs text-slate-500 mt-2">
                            {exam.duration_minutes} mins • Pass: {exam.passing_score}%
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <Calendar className="mx-auto text-slate-400 mb-2" size={32} />
                  <p className="text-slate-500">No exams available for your course yet</p>
                </div>
              )}
            </div>

            {/* Learning Toolkit */}
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-3xl p-6 shadow-lg ring-1 ring-slate-200">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">Daily Checklist</h3>
                    <p className="text-sm text-slate-600">Keep your study plan on track</p>
                  </div>
                  <span className="text-xs uppercase tracking-[0.2em] text-slate-400">Today</span>
                </div>
                <div className="space-y-3">
                  {checklist.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => toggleChecklist(item.id)}
                      className={`w-full flex items-center justify-between rounded-2xl border px-4 py-3 text-left transition ${
                        item.done
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span className="text-sm font-medium">{item.label}</span>
                      <span className={`text-xs font-semibold ${item.done ? 'text-emerald-600' : 'text-slate-400'}`}>
                        {item.done ? 'Done' : 'Mark'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-3xl p-6 shadow-lg ring-1 ring-slate-200">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">Flashcards</h3>
                    <p className="text-sm text-slate-600">Quick recall practice</p>
                  </div>
                  <span className="text-xs uppercase tracking-[0.2em] text-slate-400">
                    {flashcardIndex + 1} / {flashcards.length}
                  </span>
                </div>
                <button
                  onClick={() => setFlashcardFlipped((prev) => !prev)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-8 text-left transition hover:bg-slate-100"
                >
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                    {flashcardFlipped ? 'Answer' : 'Question'}
                  </p>
                  <p className="mt-3 text-base font-semibold text-slate-900">
                    {flashcardFlipped ? flashcards[flashcardIndex].answer : flashcards[flashcardIndex].question}
                  </p>
                  <p className="mt-4 text-xs text-slate-500">Click to flip</p>
                </button>
                <div className="mt-4 flex items-center justify-between">
                  <button
                    onClick={handlePrevFlashcard}
                    className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100"
                  >
                    Previous
                  </button>
                  <button
                    onClick={handleNextFlashcard}
                    className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>

            {/* Recent Scores */}
            <div className="bg-white rounded-3xl p-6 shadow-lg ring-1 ring-slate-200">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Recent Scores</h3>
                  <p className="text-sm text-slate-600">Latest attempts and outcomes</p>
                </div>
                <Trophy className="text-amber-500" size={20} />
              </div>
              <div className="space-y-3">
                {scores.length > 0 ? (
                  scores.slice(0, 4).map((score) => (
                    <div key={score.id} className="flex items-center justify-between gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                      <div className="flex-1">
                        <p className="font-semibold text-slate-900 text-sm">{score.exam.title}</p>
                        <p className="text-xs text-slate-500 mt-1">
                          {new Date(score.submitted_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className={`text-lg font-semibold ${
                          score.status === 'passed' ? 'text-emerald-600' : 'text-rose-600'
                        }`}>
                          {score.percentage}%
                        </div>
                        <span className={`text-[11px] px-2 py-1 rounded-full font-semibold ${
                          score.status === 'passed' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {score.status.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    <Trophy className="mx-auto text-slate-400 mb-2" size={24} />
                    <p className="text-slate-500 text-sm">No exam results yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            
            {/* Profile Card */}
            <div className="bg-white rounded-3xl p-6 shadow-lg ring-1 ring-slate-200">
              <div className="flex items-center gap-4">
                {student.profile_picture_url ? (
                  <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-md border border-slate-200">
                    <img 
                      src={student.profile_picture_url} 
                      alt={student.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-20 h-20 bg-slate-900 rounded-2xl flex items-center justify-center text-white text-2xl font-semibold shadow-md">
                    {student.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <h3 className="font-semibold text-xl text-slate-900">{student.name}</h3>
                  <p className="text-slate-500 text-sm">Student</p>
                  <a href="/StudentProfile">
                  <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                    <User size={14} />
                    Active profile
                  </div>
                  </a>
                  
                </div>
              </div>
              <div className="mt-5 space-y-2 text-sm text-slate-600 bg-slate-50 rounded-2xl p-4">
                <div className="flex items-center gap-2">
                  <User size={16} className="text-slate-400" />
                  <span className="truncate">{student.email}</span>
                </div>
                {student.course && (
                  <div className="flex items-center gap-2">
                    <BookOpen size={16} className="text-slate-400" />
                    <span className="truncate">{student.course.name}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Focus Timer */}
            <div className="bg-white rounded-3xl p-6 shadow-lg ring-1 ring-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-slate-900">Focus Timer</h3>
                  <p className="text-sm text-slate-600">Short, intentional sessions</p>
                </div>
                <span className="text-xs uppercase tracking-[0.2em] text-slate-400">Timer</span>
              </div>
              <div className="mt-5 rounded-2xl bg-slate-50 border border-slate-200 px-4 py-6 text-center">
                <p className="text-3xl font-semibold text-slate-900 tracking-tight">{formatTime(focusSeconds)}</p>
                <p className="text-xs text-slate-500 mt-1">minutes : seconds</p>
              </div>
              <div className="mt-4 flex items-center justify-center gap-2">
                {[25, 45, 60].map((preset) => (
                  <button
                    key={preset}
                    onClick={() => setFocusPreset(preset)}
                    className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-100"
                  >
                    {preset}m
                  </button>
                ))}
              </div>
              <div className="mt-4 flex items-center gap-3">
                <button
                  onClick={() => setFocusRunning((prev) => !prev)}
                  className="flex-1 rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                >
                  {focusRunning ? 'Pause' : 'Start'}
                </button>
                <button
                  onClick={() => setFocusPreset(25)}
                  className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Reset
                </button>
              </div>
            </div>

            {/* Streak Tracker */}
            <div className="bg-white rounded-3xl p-6 shadow-lg ring-1 ring-slate-200">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-slate-900">Skill Streak</h3>
                  <p className="text-sm text-slate-600">Build daily consistency</p>
                </div>
                <span className="text-xs uppercase tracking-[0.2em] text-slate-400">Streak</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-slate-50 border border-slate-200 px-4 py-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Current</p>
                  <p className="text-3xl font-semibold text-slate-900 mt-1">{streakCount}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500">Check in today</p>
                  <p className="text-sm font-semibold text-slate-900">{checkedInToday ? 'Completed' : 'Not yet'}</p>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-3">
                <button
                  onClick={handleCheckIn}
                  className="flex-1 rounded-2xl bg-amber-500 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-amber-400"
                >
                  {checkedInToday ? 'Checked in' : 'Check in'}
                </button>
                <button
                  onClick={resetStreak}
                  className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Reset
                </button>
              </div>
            </div>

            {/* Study Tips */}
            <div className="bg-white rounded-3xl p-6 shadow-lg ring-1 ring-slate-200">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-slate-900">Study Tip</h3>
                  <p className="text-sm text-slate-600">Small changes, big wins</p>
                </div>
                <span className="text-xs uppercase tracking-[0.2em] text-slate-400">
                  {tipIndex + 1} / {studyTips.length}
                </span>
              </div>
              <div className="rounded-2xl bg-slate-50 border border-slate-200 px-4 py-5">
                <p className="text-sm text-slate-700">{studyTips[tipIndex]}</p>
              </div>
              <div className="mt-4 flex items-center justify-end">
                <button
                  onClick={handleNextTip}
                  className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Next tip
                </button>
              </div>
            </div>

            {/* Payment Status */}
            <div className="bg-white rounded-3xl p-6 shadow-lg ring-1 ring-slate-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-slate-900">Payment Status</h3>
                <span className="text-xs uppercase tracking-[0.2em] text-slate-400">Finance</span>
              </div>
              <div className={`${getPaymentStatusColor(student.payment_status)} text-white px-4 py-3 rounded-2xl text-center font-semibold shadow-md`}>
                {getPaymentStatusText(student.payment_status)}
              </div>
              <p className="text-xs text-slate-500 mt-3">Ensure your subscription remains active.</p>
            </div>

            {/* Upcoming Exams */}
            <div className="bg-white rounded-3xl p-6 shadow-lg ring-1 ring-slate-200">
              <h3 className="font-semibold text-slate-900 mb-4">Upcoming Exams</h3>
              <div className="space-y-3">
                {exams.slice(0, 3).map((exam, index) => (
                  <div key={exam.id} className="flex items-start gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200">
                    <div className="bg-slate-900 text-white px-3 py-1 rounded-lg text-[11px] font-semibold">
                      {index === 0 ? 'Today' : index === 1 ? 'Tomorrow' : 'Soon'}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-slate-900 text-sm">{exam.title}</p>
                      <p className="text-xs text-slate-600">{exam.duration_minutes} minutes</p>
                    </div>
                  </div>
                ))}
                {exams.length === 0 && (
                  <div className="text-center py-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    <Calendar className="mx-auto text-slate-400 mb-2" size={24} />
                    <p className="text-slate-500 text-sm">No upcoming exams</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
};

export default Page;