/**
 * Authentication Utilities
 * Helper functions for user authentication and authorization
 */

import { createClient } from '@/lib/supabase/client'
import { createClient as createServerClient } from '@/lib/supabase/server'

// ============================================
// CLIENT-SIDE AUTH FUNCTIONS
// ============================================

/**
 * Sign up a new user
 */
export async function signUp(email: string, password: string, metadata?: any) {
  const supabase = createClient()
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata,
    },
  })

  return { data, error }
}

/**
 * Sign in with email and password
 */
export async function signIn(email: string, password: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  return { data, error }
}

/**
 * Sign out the current user
 */
export async function signOut() {
  const supabase = createClient()
  const { error } = await supabase.auth.signOut()
  return { error }
}

/**
 * Get the current user
 */
export async function getCurrentUser() {
  const supabase = createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  return { user, error }
}

/**
 * Reset password
 */
export async function resetPassword(email: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password`,
  })

  return { data, error }
}

/**
 * Update password
 */
export async function updatePassword(newPassword: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase.auth.updateUser({
    password: newPassword,
  })

  return { data, error }
}

// ============================================
// SERVER-SIDE AUTH FUNCTIONS
// ============================================

/**
 * Get current user on server side
 */
export async function getServerUser() {
  const supabase = await createServerClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  return { user, error }
}

/**
 * Check if user is a student
 */
export async function isStudent(userId: string) {
  const supabase = await createServerClient()
  
  const { data, error } = await supabase
    .from('students')
    .select('id')
    .eq('user_id', userId)
    .single()

  return { isStudent: !!data && !error, data, error }
}

/**
 * Check if user is an admin
 */
export async function isAdmin(userId: string) {
  const supabase = await createServerClient()
  
  const { data, error } = await supabase
    .from('admins')
    .select('role')
    .eq('user_id', userId)
    .single()

  return { 
    isAdmin: !!data && !error, 
    isSuperAdmin: data?.role === 'super_admin',
    data, 
    error 
  }
}

/**
 * Get user role (student, admin, super_admin)
 */
export async function getUserRole(userId: string) {
  const supabase = await createServerClient()
  
  // Check if admin first
  const { data: adminData } = await supabase
    .from('admins')
    .select('role')
    .eq('user_id', userId)
    .single()

  if (adminData) {
    return adminData.role // 'admin' or 'super_admin'
  }

  // Check if student
  const { data: studentData } = await supabase
    .from('students')
    .select('id')
    .eq('user_id', userId)
    .single()

  if (studentData) {
    return 'student'
  }

  return null // No role found
}

/**
 * Get student profile
 */
export async function getStudentProfile(userId: string) {
  const supabase = await createServerClient()
  
  const { data, error } = await supabase
    .from('students')
    .select(`
      *,
      course:courses(*)
    `)
    .eq('user_id', userId)
    .single()

  return { data, error }
}

/**
 * Get admin profile
 */
export async function getAdminProfile(userId: string) {
  const supabase = await createServerClient()
  
  const { data, error } = await supabase
    .from('admins')
    .select('*')
    .eq('user_id', userId)
    .single()

  return { data, error }
}
