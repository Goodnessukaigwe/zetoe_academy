/**
 * TypeScript type definitions for database tables
 */

export type PaymentStatus = 'paid' | 'unpaid' | 'partial'
export type ExamStatus = 'passed' | 'failed'
export type AdminRole = 'admin' | 'super_admin'
export type PaymentMethod = 'cash' | 'bank_transfer' | 'card' | 'other'

export interface Course {
  id: string
  name: string
  description: string | null
  price: number
  duration: string | null
  created_at: string
  updated_at: string
}

export interface Student {
  id: string
  user_id: string
  name: string
  email: string
  phone: string | null
  course_id: string | null
  payment_status: PaymentStatus
  profile_picture_url: string | null
  created_at: string
  updated_at: string
  course?: Course
}

export interface Admin {
  id: string
  user_id: string
  name: string
  email: string
  role: AdminRole
  created_at: string
  updated_at: string
}

export interface Question {
  id: string
  question: string
  options: string[]
  correct_answer: number // index of correct option
  points?: number
}

export interface Exam {
  id: string
  course_id: string
  title: string
  description: string | null
  code: string
  questions: Question[]
  duration_minutes: number
  passing_score: number
  created_by: string | null
  created_at: string
  updated_at: string
  course?: Course
}

export interface StudentAnswer {
  question_id: string
  selected_answer: number
  is_correct: boolean
}

export interface Score {
  id: string
  student_id: string
  exam_id: string
  score: number
  total_questions: number
  percentage: number
  status: ExamStatus
  answers: StudentAnswer[] | null
  time_taken_minutes: number | null
  submitted_at: string
  student?: Student
  exam?: Exam
}

export interface Payment {
  id: string
  student_id: string
  amount: number
  payment_method: string // 'cash' | 'bank_transfer' | 'card' | 'other'
  reference: string | null // Optional manual reference
  notes: string | null // Admin notes
  recorded_by: string | null // Admin who recorded payment
  paid_at: string
  created_at: string
  student?: Student
  admin?: Admin // Who recorded the payment
}

// API Response types
export interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  count: number
  page: number
  pageSize: number
  totalPages: number
}
