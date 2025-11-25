/**
 * Logger Utility
 * Prevents console output in production and provides structured logging
 */

type LogLevel = 'log' | 'info' | 'warn' | 'error' | 'debug'

interface LogOptions {
  /** Additional context data to include in the log */
  context?: Record<string, any>
  /** Log level */
  level?: LogLevel
}

class Logger {
  private isDevelopment = process.env.NODE_ENV !== 'production'

  /**
   * Log general information (only in development)
   */
  log(message: string, options?: LogOptions): void {
    if (this.isDevelopment) {
      console.log(this.formatMessage(message, options))
    }
  }

  /**
   * Log informational messages
   */
  info(message: string, options?: LogOptions): void {
    if (this.isDevelopment) {
      console.info(this.formatMessage(message, { ...options, level: 'info' }))
    }
  }

  /**
   * Log warnings (shown in production)
   */
  warn(message: string, options?: LogOptions): void {
    console.warn(this.formatMessage(message, { ...options, level: 'warn' }))
    
    // In production, you might want to send this to a logging service
    if (!this.isDevelopment) {
      this.sendToMonitoring('warn', message, options?.context)
    }
  }

  /**
   * Log errors (always shown, sent to monitoring in production)
   */
  error(message: string, error?: Error | unknown, options?: LogOptions): void {
    const errorInfo = error instanceof Error ? {
      name: error.name,
      message: error.message,
      stack: error.stack,
    } : error ? { error: String(error) } : {}

    console.error(this.formatMessage(message, { ...options, level: 'error' }), errorInfo)
    
    // In production, send to error monitoring service
    if (!this.isDevelopment) {
      this.sendToMonitoring('error', message, { ...options?.context, error: errorInfo })
    }
  }

  /**
   * Debug logs (only in development)
   */
  debug(message: string, data?: any): void {
    if (this.isDevelopment) {
      console.debug(`[DEBUG] ${message}`, data)
    }
  }

  /**
   * Format log message with timestamp and context
   */
  private formatMessage(message: string, options?: LogOptions): string {
    const timestamp = new Date().toISOString()
    const level = options?.level?.toUpperCase() || 'LOG'
    let formatted = `[${timestamp}] [${level}] ${message}`
    
    if (options?.context) {
      formatted += ` ${JSON.stringify(options.context)}`
    }
    
    return formatted
  }

  /**
   * Send logs to monitoring service (placeholder)
   * In production, integrate with services like:
   * - Sentry
   * - LogRocket
   * - Datadog
   * - CloudWatch
   */
  private sendToMonitoring(level: string, message: string, context?: Record<string, any>): void {
    // TODO: Implement actual monitoring service integration
    // Example for Sentry:
    // if (typeof window !== 'undefined' && window.Sentry) {
    //   window.Sentry.captureMessage(message, {
    //     level: level as any,
    //     extra: context,
    //   })
    // }
  }

  /**
   * Log API request (useful for debugging)
   */
  apiRequest(method: string, url: string, options?: { body?: any; params?: any }): void {
    if (this.isDevelopment) {
      this.log(`API Request: ${method} ${url}`, {
        context: {
          method,
          url,
          body: options?.body,
          params: options?.params,
        },
      })
    }
  }

  /**
   * Log API response (useful for debugging)
   */
  apiResponse(method: string, url: string, status: number, duration?: number): void {
    if (this.isDevelopment) {
      this.log(`API Response: ${method} ${url} - ${status}`, {
        context: {
          method,
          url,
          status,
          duration: duration ? `${duration}ms` : undefined,
        },
      })
    }
  }

  /**
   * Log database query (useful for debugging)
   */
  dbQuery(table: string, operation: string, options?: { filters?: any }): void {
    if (this.isDevelopment) {
      this.debug(`DB Query: ${operation} on ${table}`, options)
    }
  }
}

// Export singleton instance
export const logger = new Logger()

/**
 * Usage Examples:
 * 
 * // General logging (dev only)
 * logger.log('User logged in', { context: { userId: '123' } })
 * 
 * // Warnings (shown in production)
 * logger.warn('Deprecated API used', { context: { endpoint: '/old-api' } })
 * 
 * // Errors (always logged, sent to monitoring in prod)
 * logger.error('Failed to fetch data', error, { context: { endpoint: '/api/data' } })
 * 
 * // Debug (dev only)
 * logger.debug('State updated', { newState })
 * 
 * // API logging
 * logger.apiRequest('POST', '/api/auth/signin', { body: { email } })
 * logger.apiResponse('POST', '/api/auth/signin', 200, 145)
 * 
 * // Database logging
 * logger.dbQuery('students', 'SELECT', { filters: { course_id: 1 } })
 */
