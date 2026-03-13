/**
 * TypeScript Type Definitions for Multi-Course Enrollment System
 * 
 * These types support the many-to-many relationship between students and courses
 * with per-course payment tracking.
 */

/**
 * Payment status for course enrollments
 */
export type PaymentStatus = 'paid' | 'unpaid' | 'partial'

/**
 * Course information
 */
export interface Course {
  id: string
  name: string
  description: string
  created_at?: string
  updated_at?: string
}

/**
 * Student enrollment in a course with payment tracking
 */
export interface StudentEnrollment {
  id: string
  student_id: string
  course_id: string
  payment_status: PaymentStatus
  enrolled_at: string
  updated_at: string
  course: Course
}

/**
 * Enrollment without full course details (for list views)
 */
export interface EnrollmentSummary {
  id: string
  course_id: string
  course_name: string
  payment_status: PaymentStatus
  enrolled_at: string
}

/**
 * Student profile with multiple course enrollments
 */
export interface StudentProfile {
  id: string
  user_id: string
  name: string
  username?: string
  email: string
  phone?: string
  profile_picture_url?: string | null
  created_at: string
  updated_at: string
  enrollments?: StudentEnrollment[]
}

/**
 * Student profile response from API
 */
export interface StudentProfileResponse {
  user: {
    id: string
    email: string
  }
  role: 'student'
  profile: StudentProfile
}

/**
 * Data for creating a new enrollment
 */
export interface CreateEnrollmentData {
  student_id: string
  course_id: string
  payment_status?: PaymentStatus
}

/**
 * Data for updating an enrollment
 */
export interface UpdateEnrollmentData {
  payment_status?: PaymentStatus
}

/**
 * Course with enrollment status for student view
 */
export interface CourseWithEnrollment extends Course {
  enrollment?: {
    id: string
    payment_status: PaymentStatus
    enrolled_at: string
  }
  is_enrolled: boolean
  can_access_exams: boolean
}

/**
 * Dashboard course card data
 */
export interface DashboardCourse {
  id: string
  name: string
  description: string
  enrollment_id: string
  payment_status: PaymentStatus
  enrolled_at: string
  exam_count?: number
  completed_exams?: number
  progress?: number
}

/**
 * Payment record with course linkage
 */
export interface Payment {
  id: string
  student_id: string
  course_id?: string | null
  amount: number
  payment_method: string
  reference?: string
  notes?: string
  recorded_by?: string
  paid_at: string
  created_at: string
}

/**
 * Payment with related course and student info
 */
export interface PaymentWithDetails extends Payment {
  student?: {
    id: string
    name: string
    email: string
  }
  course?: {
    id: string
    name: string
  }
}

/**
 * Request body for creating payment
 */
export interface CreatePaymentRequest {
  student_id: string
  course_id: string
  amount: number
  payment_method: string
  reference?: string
  notes?: string
}

/**
 * Enrollment statistics
 */
export interface EnrollmentStats {
  total_enrollments: number
  paid_enrollments: number
  unpaid_enrollments: number
  partial_enrollments: number
  total_revenue: number
}

/**
 * Course enrollment stats (for admin dashboard)
 */
export interface CourseEnrollmentStats {
  course_id: string
  course_name: string
  total_students: number
  paid_students: number
  unpaid_students: number
  partial_students: number
  revenue: number
}

/**
 * Exam access validation result
 */
export interface ExamAccessResult {
  has_access: boolean
  reason?: string
  enrollment?: {
    id: string
    payment_status: PaymentStatus
  }
}

/**
 * Bulk enrollment operation
 */
export interface BulkEnrollmentData {
  student_ids: string[]
  course_id: string
  payment_status?: PaymentStatus
}

/**
 * Enrollment filter options
 */
export interface EnrollmentFilters {
  student_id?: string
  course_id?: string
  payment_status?: PaymentStatus
  enrolled_after?: string
  enrolled_before?: string
}

/**
 * API response for enrollment operations
 */
export interface EnrollmentResponse {
  success: boolean
  enrollment?: StudentEnrollment
  error?: string
}

/**
 * API response for multiple enrollments
 */
export interface EnrollmentsResponse {
  success: boolean
  enrollments: StudentEnrollment[]
  total?: number
  error?: string
}
