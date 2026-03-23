'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { BookOpen, Trophy, Clock, User, TrendingUp, Calendar } from 'lucide-react'
import { logger } from '@/lib/logger'

interface StudentEnrollment {
  id: string
  course_id: string
  payment_status: 'paid' | 'unpaid' | 'partial'
  enrolled_at: string
  course: {
    id: string
    name: string
    description: string
  }
}

interface StudentProfile {
  id: string
  name: string
  username?: string
  email: string
  profile_picture_url?: string | null
  enrollments?: StudentEnrollment[]
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
  } | null
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

  const fetchStudentData = useCallback(async () => {
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

      // Fetch available exams for all enrolled courses
      if (meData.profile?.enrollments && meData.profile.enrollments.length > 0) {
        const uniqueCourseIds = Array.from(
          new Set(
            meData.profile.enrollments
              .map((enrollment: StudentEnrollment) => enrollment.course?.id)
              .filter(Boolean)
          )
        )

        const examResponses = await Promise.all(
          uniqueCourseIds.map((courseId) => fetch(`/api/exams?courseId=${courseId}`))
        )

        const allExams: Exam[] = []

        for (const examsRes of examResponses) {
          if (!examsRes.ok) continue

          const examsData = await examsRes.json()
          allExams.push(...(examsData.exams || []))
        }

        const uniqueExams = Array.from(
          new Map(allExams.map((exam) => [exam.id, exam])).values()
        )

        setExams(uniqueExams)
      } else {
        setExams([])
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
  }, [router])

  useEffect(() => {
    fetchStudentData()
  }, [fetchStudentData])

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

  // The dashboard still has a few legacy visual slots that expect a single course or
  // a single payment status. Derive those values from the new enrollments model so the
  // page stays stable while the rest of the UI migrates away from single-course fields.
  const primaryEnrollment = student?.enrollments?.[0] || null
  const currentCourseLabel = primaryEnrollment?.course?.name || 'Not enrolled'
  const overallPaymentStatus = student?.enrollments?.some((enrollment) => enrollment.payment_status === 'paid')
    ? 'paid'
    : student?.enrollments?.some((enrollment) => enrollment.payment_status === 'partial')
      ? 'partial'
      : 'unpaid'

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
  const passedCount = scores.filter((score) => score.status === 'passed').length
  const paidEnrollmentsCount = student.enrollments?.filter((enrollment) => enrollment.payment_status === 'paid').length || 0

  return (
    <div className="min-h-screen bg-[#f7f4ef] text-slate-900">
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Zetoe Academy</p>
              <h1 className="mt-1 text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900">Student Dashboard</h1>
              <p className="mt-2 text-sm text-slate-600">{getGreeting()}, {student.name.split(' ')[0]} • {getCurrentDate()}</p>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:w-[30rem]">
              <div className="rounded-2xl bg-slate-900 px-4 py-3 text-white">
                <p className="text-[11px] uppercase tracking-[0.2em] text-slate-300">Progress</p>
                <p className="mt-1 text-2xl font-semibold">{progress}%</p>
              </div>
              <div className="rounded-2xl bg-white px-4 py-3 ring-1 ring-slate-200">
                <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">Exams</p>
                <p className="mt-1 text-2xl font-semibold text-slate-900">{exams.length}</p>
              </div>
              <div className="rounded-2xl bg-white px-4 py-3 ring-1 ring-slate-200">
                <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">Results</p>
                <p className="mt-1 text-2xl font-semibold text-slate-900">{scores.length}</p>
              </div>
              <div className="rounded-2xl bg-white px-4 py-3 ring-1 ring-slate-200">
                <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">Passed</p>
                <p className="mt-1 text-2xl font-semibold text-emerald-600">{passedCount}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-6 xl:grid-cols-[2fr_1fr]">
          <section className="space-y-6">
            <div className="rounded-3xl bg-white p-6 shadow-lg ring-1 ring-slate-200 sm:p-8">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Learning Overview</h2>
                  <p className="mt-2 max-w-2xl text-sm text-slate-600">
                    You are currently in <span className="font-semibold text-slate-900">{currentCourseLabel}</span>. Keep your pace steady and continue improving your average score.
                  </p>
                  <div className="mt-4 h-2.5 w-full max-w-md rounded-full bg-slate-100">
                    <div className="h-2.5 rounded-full bg-amber-400" style={{ width: `${progress}%` }}></div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 sm:min-w-[17rem]">
                  <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Payment</p>
                    <p className="mt-2 text-sm font-semibold text-slate-900">{getPaymentStatusText(overallPaymentStatus)}</p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Paid Courses</p>
                    <p className="mt-2 text-xl font-semibold text-slate-900">{paidEnrollmentsCount}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-lg ring-1 ring-slate-200 sm:p-8">
              <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Courses and Progress</h3>
                  <p className="text-sm text-slate-600">Track each enrolled course and payment visibility at a glance</p>
                </div>
                <TrendingUp className="text-amber-500" size={22} />
              </div>

              <div className="space-y-4">
                {student.enrollments && student.enrollments.length > 0 ? (
                  student.enrollments.map((enrollment) => (
                    <div key={enrollment.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-start gap-3">
                          <div className="mt-1 flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-white">
                            <BookOpen size={18} />
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900">{enrollment.course.name}</p>
                            <p className="mt-1 text-sm text-slate-600">{enrollment.course.description || 'Professional Course'}</p>
                            <span className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold text-white ${getPaymentStatusColor(enrollment.payment_status)}`}>
                              {getPaymentStatusText(enrollment.payment_status)}
                            </span>
                          </div>
                        </div>
                        <div className="sm:min-w-[10rem] sm:text-right">
                          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Avg. Progress</p>
                          <p className="mt-1 text-xl font-semibold text-slate-900">{progress}%</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 py-10 text-center">
                    <BookOpen className="mx-auto mb-2 text-slate-400" size={32} />
                    <p className="text-slate-500">No courses enrolled yet</p>
                    <button
                      onClick={() => router.push('/courses')}
                      className="mt-4 rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
                    >
                      Browse Courses
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-lg ring-1 ring-slate-200 sm:p-8">
              <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Exam Center</h3>
                  <p className="text-sm text-slate-600">Access available exams and continue your assessments</p>
                </div>
                <Calendar className="text-slate-400" size={20} />
              </div>

              {!student.enrollments || student.enrollments.length === 0 ? (
                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-center">
                  <div className="mb-3 text-5xl">📚</div>
                  <h4 className="mb-2 font-semibold text-amber-900">No Courses Yet</h4>
                  <p className="text-sm text-amber-800">Enroll in courses to access exams</p>
                </div>
              ) : student.enrollments.every((e) => e.payment_status !== 'paid') ? (
                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-center">
                  <div className="mb-3 text-5xl">🔒</div>
                  <h4 className="mb-2 font-semibold text-amber-900">Payment Required</h4>
                  <p className="text-sm text-amber-800">Complete payment for at least one course to unlock exams</p>
                </div>
              ) : exams.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {exams.slice(0, 6).map((exam, index) => {
                    const colors = ['bg-emerald-500', 'bg-sky-500', 'bg-rose-500', 'bg-amber-500', 'bg-teal-500', 'bg-orange-500']
                    const bgColors = ['bg-emerald-50', 'bg-sky-50', 'bg-rose-50', 'bg-amber-50', 'bg-teal-50', 'bg-orange-50']

                    return (
                      <button
                        key={exam.id}
                        onClick={() => router.push(`/exam/${exam.id}`)}
                        className={`${bgColors[index % 6]} group rounded-2xl border border-transparent p-5 text-left transition hover:border-slate-200 hover:shadow-md`}
                      >
                        <div className="mb-4 flex items-center justify-between">
                          <div className={`${colors[index % 6]} flex h-11 w-11 items-center justify-center rounded-xl text-sm font-semibold text-white shadow-sm`}>
                            {exam.code.substring(0, 2)}
                          </div>
                          <Clock className="text-slate-400" size={18} />
                        </div>
                        <h4 className="font-semibold text-slate-900 group-hover:text-slate-950">{exam.title}</h4>
                        <p className="mt-1 text-xs text-slate-600">{exam.code}</p>
                        <p className="mt-2 text-xs text-slate-500">{exam.duration_minutes} mins • Pass: {exam.passing_score}%</p>
                      </button>
                    )
                  })}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 py-8 text-center">
                  <Calendar className="mx-auto mb-2 text-slate-400" size={32} />
                  <p className="text-slate-500">No exams available for your course yet</p>
                </div>
              )}
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-lg ring-1 ring-slate-200 sm:p-8">
              <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Performance History</h3>
                  <p className="text-sm text-slate-600">Latest attempts and outcomes</p>
                </div>
                <Trophy className="text-amber-500" size={20} />
              </div>

              <div className="space-y-3">
                {scores.length > 0 ? (
                  scores.slice(0, 4).map((score) => (
                    <div key={score.id} className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-slate-900">{score.exam?.title || 'Exam record unavailable'}</p>
                        <p className="mt-1 text-xs text-slate-500">{new Date(score.submitted_at).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <p className={`text-lg font-semibold ${score.status === 'passed' ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {score.percentage}%
                        </p>
                        <span className={`rounded-full px-2 py-1 text-[11px] font-semibold ${score.status === 'passed' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                          {score.status.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 py-6 text-center">
                    <Trophy className="mx-auto mb-2 text-slate-400" size={24} />
                    <p className="text-sm text-slate-500">No exam results yet</p>
                  </div>
                )}
              </div>
            </div>
          </section>

          <aside className="space-y-6">
            <div className="rounded-3xl bg-white p-6 shadow-lg ring-1 ring-slate-200">
              <div className="flex items-center gap-4">
                {student.profile_picture_url ? (
                  <div className="relative h-20 w-20 overflow-hidden rounded-2xl border border-slate-200 shadow-md">
                    <Image
                      src={student.profile_picture_url}
                      alt={student.name}
                      fill
                      sizes="80px"
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-slate-900 text-2xl font-semibold text-white shadow-md">
                    {student.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <h3 className="text-xl font-semibold text-slate-900">{student.name}</h3>
                  <p className="text-sm text-slate-500">Student</p>
                  <a href="/StudentProfile" className="mt-2 inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                    <User size={14} />
                    Active profile
                  </a>
                </div>
              </div>
              <div className="mt-5 space-y-2 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <User size={16} className="text-slate-400" />
                  <span className="truncate">{student.email}</span>
                </div>
                {primaryEnrollment?.course && (
                  <div className="flex items-center gap-2">
                    <BookOpen size={16} className="text-slate-400" />
                    <span className="truncate">{primaryEnrollment.course.name}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-lg ring-1 ring-slate-200">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-semibold text-slate-900">Payment Status</h3>
                <span className="text-xs uppercase tracking-[0.2em] text-slate-400">Finance</span>
              </div>
              <div className={`${getPaymentStatusColor(overallPaymentStatus)} rounded-2xl px-4 py-3 text-center font-semibold text-white shadow-md`}>
                {getPaymentStatusText(overallPaymentStatus)}
              </div>
              <p className="mt-3 text-xs text-slate-500">Ensure your subscription remains active.</p>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-lg ring-1 ring-slate-200">
              <h3 className="mb-4 font-semibold text-slate-900">Upcoming Exams</h3>
              <div className="space-y-3">
                {exams.slice(0, 3).map((exam, index) => (
                  <div key={exam.id} className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3">
                    <div className="rounded-lg bg-slate-900 px-3 py-1 text-[11px] font-semibold text-white">
                      {index === 0 ? 'Today' : index === 1 ? 'Tomorrow' : 'Soon'}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-900">{exam.title}</p>
                      <p className="text-xs text-slate-600">{exam.duration_minutes} minutes</p>
                    </div>
                  </div>
                ))}
                {exams.length === 0 && (
                  <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 py-4 text-center">
                    <Calendar className="mx-auto mb-2 text-slate-400" size={24} />
                    <p className="text-sm text-slate-500">No upcoming exams</p>
                  </div>
                )}
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  )
};

export default Page;