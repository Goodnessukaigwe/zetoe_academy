'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams, useParams } from 'next/navigation'
import { CheckCircle, XCircle, Trophy, TrendingUp, Clock } from 'lucide-react'
import { logger } from '@/lib/logger'

interface Score {
  id: string
  score: number
  total_questions: number
  percentage: number
  status: 'passed' | 'failed'
  time_taken_minutes: number
  submitted_at: string
  exam: {
    title: string
    passing_score: number
  }
}

export default function ExamResultsPage() {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const examId = params.id as string
  const scoreId = searchParams.get('score')

  const [result, setResult] = useState<Score | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchResults()
  }, [scoreId, examId])

  const fetchResults = async () => {
    try {
      setLoading(true)
      
      // If we have a scoreId, fetch that specific score
      if (scoreId) {
        const res = await fetch(`/api/scores?scoreId=${scoreId}`)
        
        if (!res.ok) {
          setError('Failed to load results')
          return
        }

        const data = await res.json()
        setResult(data.scores[0])
      } else {
        // Otherwise, fetch all scores and find the one for this exam
        const res = await fetch('/api/scores')
        
        if (!res.ok) {
          setError('Failed to load results')
          return
        }

        const data = await res.json()
        // Find the score for this specific exam
        const examScore = data.scores?.find((s: any) => s.exam_id === examId)
        
        if (examScore) {
          setResult(examScore)
        } else {
          setError('No results found for this exam')
        }
      }
    } catch (err) {
      logger.error('Error fetching results', err)
      setError('Failed to load exam results')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3a0ca3] mx-auto mb-4"></div>
          <p className="text-gray-700">Loading results...</p>
        </div>
      </div>
    )
  }

  if (error || !result) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600 mb-6">{error || 'Results not found'}</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="bg-[#3a0ca3] text-white px-6 py-2 rounded-md hover:bg-[#2a0785] transition"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  const isPassed = result.status === 'passed'

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 ${
            isPassed ? 'bg-green-100' : 'bg-red-100'
          }`}>
            {isPassed ? (
              <Trophy className="w-10 h-10 text-green-600" />
            ) : (
              <XCircle className="w-10 h-10 text-red-600" />
            )}
          </div>
          
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {isPassed ? 'Congratulations! 🎉' : 'Exam Completed'}
          </h1>
          
          <p className="text-gray-600">
            {isPassed 
              ? 'You have successfully passed the exam!' 
              : 'Keep practicing and try again!'}
          </p>
        </div>

        {/* Main Results Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          {/* Exam Title */}
          <div className="text-center mb-6 pb-6 border-b">
            <h2 className="text-2xl font-bold text-gray-800">{result.exam.title}</h2>
            <p className="text-sm text-gray-500 mt-1">
              Submitted on {new Date(result.submitted_at).toLocaleString()}
            </p>
          </div>

          {/* Score Display */}
          <div className="text-center mb-8">
            <div className="relative inline-flex items-center justify-center">
              <svg className="w-48 h-48 transform -rotate-90">
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke="#e5e7eb"
                  strokeWidth="12"
                  fill="none"
                />
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke={isPassed ? '#10b981' : '#ef4444'}
                  strokeWidth="12"
                  fill="none"
                  strokeDasharray={`${(result.percentage / 100) * 553} 553`}
                  className="transition-all duration-1000"
                />
              </svg>
              
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-5xl font-bold text-gray-800">
                  {result.percentage}%
                </span>
                <span className="text-sm text-gray-500 mt-1">
                  {result.score} / {result.total_questions}
                </span>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                <span className="text-sm font-semibold text-gray-600">Correct</span>
              </div>
              <p className="text-2xl font-bold text-gray-800">{result.score}</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <XCircle className="w-5 h-5 text-red-600 mr-2" />
                <span className="text-sm font-semibold text-gray-600">Incorrect</span>
              </div>
              <p className="text-2xl font-bold text-gray-800">
                {result.total_questions - result.score}
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Clock className="w-5 h-5 text-blue-600 mr-2" />
                <span className="text-sm font-semibold text-gray-600">Time Taken</span>
              </div>
              <p className="text-2xl font-bold text-gray-800">
                {result.time_taken_minutes} min
              </p>
            </div>
          </div>

          {/* Pass/Fail Status */}
          <div className={`rounded-lg p-4 ${
            isPassed ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {isPassed ? (
                  <CheckCircle className="w-6 h-6 text-green-600 mr-3" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-600 mr-3" />
                )}
                <div>
                  <p className={`font-semibold ${isPassed ? 'text-green-800' : 'text-red-800'}`}>
                    {isPassed ? 'Passed' : 'Failed'}
                  </p>
                  <p className={`text-sm ${isPassed ? 'text-green-600' : 'text-red-600'}`}>
                    Passing score: {result.exam.passing_score}%
                  </p>
                </div>
              </div>

              <div className={`text-right ${isPassed ? 'text-green-600' : 'text-red-600'}`}>
                <TrendingUp className="w-8 h-8" />
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => router.push('/dashboard')}
            className="px-6 py-3 bg-[#3a0ca3] text-white font-semibold rounded-lg hover:bg-[#2a0785] transition shadow-md"
          >
            Back to Dashboard
          </button>

          {!isPassed && (
            <button
              onClick={() => router.push('/exam-access')}
              className="px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition shadow-md"
            >
              Try Another Exam
            </button>
          )}
        </div>

        {/* Tips Section */}
        {!isPassed && (
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-semibold text-blue-900 mb-2 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              Tips for Next Time
            </h3>
            <ul className="text-sm text-blue-800 space-y-1 ml-7">
              <li>• Review the course materials thoroughly</li>
              <li>• Take practice tests to familiarize yourself with the format</li>
              <li>• Manage your time wisely during the exam</li>
              <li>• Read each question carefully before answering</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
