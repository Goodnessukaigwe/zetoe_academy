'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { logger } from '@/lib/logger'

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: ('student' | 'admin' | 'super_admin')[]
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/auth/me')
      
      if (!res.ok) {
        router.push('/login')
        return
      }

      const data = await res.json()
      setIsAuthenticated(true)

      // Check if user has required role
      if (allowedRoles && !allowedRoles.includes(data.role)) {
        // Redirect to appropriate dashboard based on user's actual role
        if (data.role === 'super_admin') {
          router.push('/super-admin-dashboard')
        } else if (data.role === 'admin') {
          router.push('/admin-dashboard')
        } else {
          router.push('/dashboard')
        }
        return
      }

      setIsAuthorized(true)
    } catch (error) {
      logger.error('Auth check failed', { error })
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3a0ca3] mx-auto mb-4"></div>
          <p className="text-gray-700">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !isAuthorized) {
    return null
  }

  return <>{children}</>
}
