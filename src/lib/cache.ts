/**
 * Simple in-memory cache for API responses
 * For production, consider Redis or Vercel KV
 */

interface CacheEntry<T> {
  data: T
  timestamp: number
  ttl: number // Time to live in milliseconds
}

class MemoryCache {
  private cache: Map<string, CacheEntry<any>>
  private cleanupInterval: NodeJS.Timeout | null = null

  constructor() {
    this.cache = new Map()
    // Clean up expired entries every minute
    this.cleanupInterval = setInterval(() => {
      this.cleanup()
    }, 60000)
  }

  /**
   * Get cached data if it exists and hasn't expired
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key)
    
    if (!entry) {
      return null
    }

    const now = Date.now()
    const age = now - entry.timestamp

    // Check if cache has expired
    if (age > entry.ttl) {
      this.cache.delete(key)
      return null
    }

    return entry.data as T
  }

  /**
   * Set data in cache with TTL
   * @param key Cache key
   * @param data Data to cache
   * @param ttl Time to live in milliseconds (default: 1 minute)
   */
  set<T>(key: string, data: T, ttl: number = 60000): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    })
  }

  /**
   * Invalidate (delete) a specific cache entry
   */
  invalidate(key: string): void {
    this.cache.delete(key)
  }

  /**
   * Invalidate all cache entries matching a pattern
   */
  invalidatePattern(pattern: string): void {
    const regex = new RegExp(pattern)
    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.cache.delete(key)
      }
    }
  }

  /**
   * Clear all cache
   */
  clear(): void {
    this.cache.clear()
  }

  /**
   * Remove expired entries
   */
  private cleanup(): void {
    const now = Date.now()
    for (const [key, entry] of this.cache.entries()) {
      const age = now - entry.timestamp
      if (age > entry.ttl) {
        this.cache.delete(key)
      }
    }
  }

  /**
   * Get cache statistics
   */
  getStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    }
  }

  /**
   * Stop cleanup interval (for testing)
   */
  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval)
      this.cleanupInterval = null
    }
  }
}

// Singleton instance
export const cache = new MemoryCache()

/**
 * Cache TTL constants (in milliseconds)
 */
export const CACHE_TTL = {
  ONE_MINUTE: 60 * 1000,
  FIVE_MINUTES: 5 * 60 * 1000,
  TEN_MINUTES: 10 * 60 * 1000,
  THIRTY_MINUTES: 30 * 60 * 1000,
  ONE_HOUR: 60 * 60 * 1000,
  ONE_DAY: 24 * 60 * 60 * 1000,
} as const

/**
 * Helper function to generate cache keys
 */
export function generateCacheKey(
  endpoint: string,
  params?: Record<string, string | number | boolean | null | undefined>
): string {
  if (!params) {
    return endpoint
  }

  const sortedParams = Object.keys(params)
    .filter((key) => params[key] !== undefined && params[key] !== null)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join('&')

  return sortedParams ? `${endpoint}?${sortedParams}` : endpoint
}

/**
 * Wrapper function for caching API responses
 */
export async function withCache<T>(
  key: string,
  ttl: number,
  fetcher: () => Promise<T>
): Promise<T> {
  // Try to get from cache first
  const cached = cache.get<T>(key)
  if (cached !== null) {
    return cached
  }

  // Fetch fresh data
  const data = await fetcher()

  // Store in cache
  cache.set(key, data, ttl)

  return data
}
