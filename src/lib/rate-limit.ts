/**
 * Rate Limiting Utility
 * Simple in-memory rate limiter for API routes
 * For production, consider using Redis or Upstash
 */

import { NextRequest, NextResponse } from 'next/server'

interface RateLimitInfo {
  count: number
  resetTime: number
}

// In-memory storage (use Redis in production for distributed systems)
const rateLimitMap = new Map<string, RateLimitInfo>()

// Cleanup old entries every hour
setInterval(() => {
  const now = Date.now()
  for (const [key, value] of rateLimitMap.entries()) {
    if (now > value.resetTime) {
      rateLimitMap.delete(key)
    }
  }
}, 3600000) // 1 hour

export interface RateLimitConfig {
  /** Maximum number of requests allowed in the window */
  limit: number
  /** Time window in milliseconds */
  windowMs: number
  /** Custom identifier (defaults to IP address) */
  identifier?: string
}

export interface RateLimitResult {
  /** Whether the request should be rate limited */
  limited: boolean
  /** Seconds until the rate limit resets */
  retryAfter?: number
  /** Current request count */
  count: number
  /** Maximum allowed requests */
  limit: number
  /** Timestamp when limit resets */
  resetTime: number
}

/**
 * Check if a request should be rate limited
 * 
 * @example
 * // In an API route
 * const { limited, retryAfter } = rateLimit(request, { limit: 5, windowMs: 60000 })
 * if (limited) {
 *   return NextResponse.json(
 *     { error: `Too many requests. Retry after ${retryAfter} seconds` },
 *     { status: 429 }
 *   )
 * }
 */
export function rateLimit(
  request: NextRequest,
  config: RateLimitConfig
): RateLimitResult {
  const { limit, windowMs, identifier } = config

  // Get identifier (IP address or custom identifier)
  const key =
    identifier ||
    request.headers.get('x-forwarded-for') ||
    request.headers.get('x-real-ip') ||
    'unknown'

  const now = Date.now()
  const userLimit = rateLimitMap.get(key)

  // No previous requests or window expired
  if (!userLimit || now > userLimit.resetTime) {
    const resetTime = now + windowMs
    rateLimitMap.set(key, { count: 1, resetTime })
    
    return {
      limited: false,
      count: 1,
      limit,
      resetTime,
    }
  }

  // Check if limit exceeded
  if (userLimit.count >= limit) {
    const retryAfter = Math.ceil((userLimit.resetTime - now) / 1000)
    
    return {
      limited: true,
      retryAfter,
      count: userLimit.count,
      limit,
      resetTime: userLimit.resetTime,
    }
  }

  // Increment count
  userLimit.count++
  
  return {
    limited: false,
    count: userLimit.count,
    limit,
    resetTime: userLimit.resetTime,
  }
}

/**
 * Create a rate limit response with appropriate headers
 */
export function createRateLimitResponse(result: RateLimitResult): NextResponse {
  const response = NextResponse.json(
    {
      error: 'Too many requests',
      message: `Rate limit exceeded. Please try again in ${result.retryAfter} seconds.`,
    },
    { status: 429 }
  )

  // Add rate limit headers
  response.headers.set('X-RateLimit-Limit', result.limit.toString())
  response.headers.set('X-RateLimit-Remaining', Math.max(0, result.limit - result.count).toString())
  response.headers.set('X-RateLimit-Reset', new Date(result.resetTime).toISOString())
  
  if (result.retryAfter) {
    response.headers.set('Retry-After', result.retryAfter.toString())
  }

  return response
}

/**
 * Preset rate limit configurations
 */
export const RateLimitPresets = {
  /** Strict limit for authentication endpoints (5 requests per minute) */
  AUTH: { limit: 5, windowMs: 60000 },
  
  /** Standard limit for API endpoints (100 requests per minute) */
  API: { limit: 100, windowMs: 60000 },
  
  /** Generous limit for public endpoints (1000 requests per minute) */
  PUBLIC: { limit: 1000, windowMs: 60000 },
  
  /** Very strict limit for sensitive operations (3 requests per 5 minutes) */
  SENSITIVE: { limit: 3, windowMs: 300000 },
  
  /** Moderate limit for exam-related endpoints (20 requests per minute) */
  EXAM: { limit: 20, windowMs: 60000 },
}

/**
 * Example usage in an API route:
 * 
 * ```typescript
 * import { rateLimit, RateLimitPresets, createRateLimitResponse } from '@/lib/rate-limit'
 * 
 * export async function POST(request: NextRequest) {
 *   // Apply rate limiting
 *   const rateLimitResult = rateLimit(request, RateLimitPresets.AUTH)
 *   
 *   if (rateLimitResult.limited) {
 *     return createRateLimitResponse(rateLimitResult)
 *   }
 *   
 *   // Continue with normal request handling...
 * }
 * ```
 */
