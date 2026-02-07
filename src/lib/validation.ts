/**
 * Input Validation Utilities
 * Centralized validation functions for security
 */

/**
 * Validate email format
 */
export function validateEmail(email: string): { valid: boolean; error?: string } {
  if (!email) {
    return { valid: false, error: 'Email is required' }
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return { valid: false, error: 'Invalid email format' }
  }

  // Additional check for common typos
  const domain = email.split('@')[1]
  if (!domain || domain.length < 3) {
    return { valid: false, error: 'Invalid email domain' }
  }

  return { valid: true }
}

/**
 * Validate password (simplified - no complexity requirements)
 */
export function validatePassword(password: string): { valid: boolean; error?: string } {
  if (!password) {
    return { valid: false, error: 'Password is required' }
  }

  // Minimum length only
  if (password.length < 6) {
    return { valid: false, error: 'Password must be at least 6 characters long' }
  }

  // Maximum length (prevent DOS attacks)
  if (password.length > 128) {
    return { valid: false, error: 'Password must be less than 128 characters' }
  }

  return { valid: true }
}

/**
 * Sanitize string input (trim and escape)
 */
export function sanitizeString(input: string, maxLength = 1000): string {
  if (!input) return ''
  
  // Trim whitespace
  let sanitized = input.trim()
  
  // Limit length
  if (sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength)
  }
  
  // Escape HTML to prevent XSS
  sanitized = sanitized
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
  
  return sanitized
}

/**
 * Validate numeric input
 */
export function validateNumber(
  value: any,
  min?: number,
  max?: number
): { valid: boolean; error?: string; value?: number } {
  const num = Number(value)

  if (isNaN(num)) {
    return { valid: false, error: 'Invalid number' }
  }

  if (min !== undefined && num < min) {
    return { valid: false, error: `Value must be at least ${min}` }
  }

  if (max !== undefined && num > max) {
    return { valid: false, error: `Value must be at most ${max}` }
  }

  return { valid: true, value: num }
}

/**
 * Validate access code format
 */
export function validateAccessCode(code: string): { valid: boolean; error?: string } {
  if (!code) {
    return { valid: false, error: 'Access code is required' }
  }

  // Trim and convert to uppercase
  const cleanCode = code.trim().toUpperCase()

  // Must be 4-20 characters
  if (cleanCode.length < 4 || cleanCode.length > 20) {
    return { valid: false, error: 'Access code must be 4-20 characters' }
  }

  // Allow only alphanumeric characters
  if (!/^[A-Z0-9]+$/.test(cleanCode)) {
    return { valid: false, error: 'Access code can only contain letters and numbers' }
  }

  return { valid: true }
}

/**
 * Validate phone number (basic international format)
 */
export function validatePhone(phone: string): { valid: boolean; error?: string } {
  if (!phone) {
    return { valid: true } // Phone is optional in many cases
  }

  // Remove common formatting characters
  const cleanPhone = phone.replace(/[\s\-\(\)\.]/g, '')

  // Check if it contains only numbers and optional + at start
  if (!/^\+?[0-9]{10,15}$/.test(cleanPhone)) {
    return { valid: false, error: 'Invalid phone number format' }
  }

  return { valid: true }
}

/**
 * Validate URL format
 */
export function validateURL(url: string): { valid: boolean; error?: string } {
  if (!url) {
    return { valid: false, error: 'URL is required' }
  }

  try {
    const parsed = new URL(url)
    // Only allow http and https protocols
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return { valid: false, error: 'URL must use http or https protocol' }
    }
    return { valid: true }
  } catch {
    return { valid: false, error: 'Invalid URL format' }
  }
}
