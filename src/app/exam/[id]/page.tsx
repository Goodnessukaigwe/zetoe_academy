'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ChevronLeft, ChevronRight, Clock, AlertCircle } from 'lucide-react'

interface Question {
  id: string
  question: string
  options: string[]
  points?: number
}

interface ExamData {
  id: string
  title: string
  description: string
  duration_minutes: number
  passing_score: number
  questions: Question[]
}

interface Answer {
  questionId: string
  selectedOption: number
}

export default function ExamPage() {
  const params = useParams()
  const router = useRouter()
  const examId = params.id as string

  const [exam, setExam] = useState<ExamData | null>(null)
  const [answers, setAnswers] = useState<Answer[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchExamData()
  }, [examId])

  useEffect(() => {
    if (timeRemaining <= 0) return

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          handleSubmit(true) // Auto-submit when time expires
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [timeRemaining])

  const fetchExamData = async () => {
    try {
      setLoading(true)
      const res = await fetch(`/api/exams/${examId}`)
      
      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Failed to load exam')
        return
      }

      const data = await res.json()
      setExam(data.exam)
      setTimeRemaining(data.exam.duration_minutes * 60) // Convert to seconds
      
      // Initialize empty answers
      const initialAnswers = data.exam.questions.map((q: Question) => ({
        questionId: q.id,
        selectedOption: -1
      }))
      setAnswers(initialAnswers)
    } catch (err) {
      console.error('Error fetching exam:', err)
      setError('Failed to load exam')
    } finally {
      setLoading(false)
    }
  }

  const handleAnswerSelect = (optionIndex: number) => {
    const currentQuestion = exam?.questions[currentQuestionIndex]
    if (!currentQuestion) return

    setAnswers(prev => {
      const newAnswers = [...prev]
      const answerIndex = newAnswers.findIndex(a => a.questionId === currentQuestion.id)
      
      if (answerIndex >= 0) {
        newAnswers[answerIndex].selectedOption = optionIndex
      } else {
        newAnswers.push({
          questionId: currentQuestion.id,
          selectedOption: optionIndex
        })
      }
      
      return newAnswers
    })
  }

  const handleSubmit = async (autoSubmit = false) => {
    if (!exam) return

    // Check if all questions are answered
    const unanswered = answers.filter(a => a.selectedOption === -1).length
    
    if (!autoSubmit && unanswered > 0) {
      const confirmed = confirm(
        `You have ${unanswered} unanswered question(s). Do you want to submit anyway?`
      )
      if (!confirmed) return
    }

    setSubmitting(true)

    try {
      const res = await fetch('/api/exams/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          examId: exam.id,
          answers: answers.map(a => ({
            questionId: a.questionId,
            selectedOption: a.selectedOption
          }))
        })
      })

      const data = await res.json()

      if (res.ok) {
        // Redirect to results page
        router.push(`/exam/${exam.id}/results?score=${data.score.id}`)
      } else {
        setError(data.error || 'Failed to submit exam')
        setSubmitting(false)
      }
    } catch (err) {
      console.error('Error submitting exam:', err)
      setError('Failed to submit exam')
      setSubmitting(false)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getAnsweredCount = () => {
    return answers.filter(a => a.selectedOption !== -1).length
  }

  const getCurrentAnswer = () => {
    const currentQuestion = exam?.questions[currentQuestionIndex]
    if (!currentQuestion) return -1
    
    const answer = answers.find(a => a.questionId === currentQuestion.id)
    return answer?.selectedOption ?? -1
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3a0ca3] mx-auto mb-4"></div>
          <p className="text-gray-700">Loading exam...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
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

  if (!exam) {
    return null
  }

  const currentQuestion = exam.questions[currentQuestionIndex]
  const currentAnswer = getCurrentAnswer()
  const progress = ((currentQuestionIndex + 1) / exam.questions.length) * 100

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-md sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-[#3a0ca3]">{exam.title}</h1>
              <p className="text-sm text-gray-600">{exam.description}</p>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Timer */}
              <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                timeRemaining < 300 ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
              }`}>
                <Clock className="w-5 h-5" />
                <span className="font-mono text-lg font-bold">
                  {formatTime(timeRemaining)}
                </span>
              </div>

              {/* Progress */}
              <div className="text-sm text-gray-600">
                {getAnsweredCount()} / {exam.questions.length} answered
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-[#3a0ca3] h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Question Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Question Number */}
          <div className="mb-4">
            <span className="text-sm font-semibold text-gray-500">
              Question {currentQuestionIndex + 1} of {exam.questions.length}
            </span>
          </div>

          {/* Question Text */}
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            {currentQuestion.question}
          </h2>

          {/* Options */}
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                  currentAnswer === index
                    ? 'border-[#3a0ca3] bg-purple-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    currentAnswer === index
                      ? 'border-[#3a0ca3] bg-[#3a0ca3]'
                      : 'border-gray-300'
                  }`}>
                    {currentAnswer === index && (
                      <div className="w-3 h-3 bg-white rounded-full" />
                    )}
                  </div>
                  <span className="text-gray-700">{option}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t">
            <button
              onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
              disabled={currentQuestionIndex === 0}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <ChevronLeft className="w-5 h-5" />
              Previous
            </button>

            {currentQuestionIndex === exam.questions.length - 1 ? (
              <button
                onClick={() => handleSubmit(false)}
                disabled={submitting}
                className="px-6 py-3 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 disabled:opacity-50 transition"
              >
                {submitting ? 'Submitting...' : 'Submit Exam'}
              </button>
            ) : (
              <button
                onClick={() => setCurrentQuestionIndex(prev => Math.min(exam.questions.length - 1, prev + 1))}
                className="flex items-center gap-2 px-4 py-2 bg-[#3a0ca3] text-white rounded-md hover:bg-[#2a0785] transition"
              >
                Next
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Question Navigator */}
        <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-sm font-semibold text-gray-600 mb-4">Question Navigator</h3>
          <div className="grid grid-cols-10 gap-2">
            {exam.questions.map((_, index) => {
              const isAnswered = answers[index]?.selectedOption !== -1
              const isCurrent = index === currentQuestionIndex
              
              return (
                <button
                  key={index}
                  onClick={() => setCurrentQuestionIndex(index)}
                  className={`w-10 h-10 rounded-md font-semibold text-sm transition ${
                    isCurrent
                      ? 'bg-[#3a0ca3] text-white'
                      : isAnswered
                      ? 'bg-green-100 text-green-700 hover:bg-green-200'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {index + 1}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
