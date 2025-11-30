'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Shield } from 'lucide-react'
import { logger } from '@/lib/logger'

function AdminInviteContent() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Pre-fill email from URL if provided
    const emailParam = searchParams.get('email')
    if (emailParam) {
      setEmail(emailParam)
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match!')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/admin-invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (res.ok) {
        alert('Account setup successful! You can now login.')
        router.push('/login')
      } else {
        setError(data.error || 'Failed to complete setup')
      }
    } catch (err) {
      logger.error('Setup error', err)
      setError('Something went wrong! Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#f2f2f2]">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <div className="flex justify-center mb-4">
          <div className="bg-purple-100 rounded-full p-4">
            <Shield size={40} className="text-purple-600" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-center mb-2 text-gray-800">
          Complete Admin Setup
        </h2>
        <p className="text-center text-gray-600 mb-6 text-sm">
          Set your password to activate your admin account
        </p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md text-black bg-gray-50"
              required
              readOnly={!!searchParams.get('email')}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md text-black"
              required
              minLength={8}
            />
            <p className="text-xs text-gray-500 mt-1">
              Minimum 8 characters, include uppercase, lowercase, and numbers
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md text-black"
              required
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="showPassword"
              checked={showPassword}
              onChange={(e) => setShowPassword(e.target.checked)}
              className="w-4 h-4"
            />
            <label htmlFor="showPassword" className="text-sm text-gray-700">
              Show passwords
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-md font-semibold transition disabled:bg-gray-400"
          >
            {loading ? 'Setting up...' : 'Complete Setup'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default function AdminInvitePage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center min-h-screen bg-[#f2f2f2]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-700">Loading...</p>
        </div>
      </div>
    }>
      <AdminInviteContent />
    </Suspense>
  )
}
