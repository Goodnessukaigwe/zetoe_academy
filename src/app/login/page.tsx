'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import Link from 'next/link' 
import { Eye, EyeOff } from "lucide-react"
import { logger } from '@/lib/logger'
import { LoadingButton } from '@/components/ui/LoadingButton'

const LoginPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [requiresVerification, setRequiresVerification] = useState(false)
  const [resendingEmail, setResendingEmail] = useState(false)
  const [resendSuccess, setResendSuccess] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setRequiresVerification(false)

    try {
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()
      logger.log('Login response', { context: { success: res.ok } })
      
      if (res.ok) {
        router.push('/dashboard')  // Redirect after login
      } else {
        setError(data.error || 'Login failed!')
        if (data.requiresVerification) {
          setRequiresVerification(true)
        }
      }
    } catch (err) {
      logger.error('Login error', err)
      setError('Something went wrong! Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleResendVerification = async () => {
    setResendingEmail(true)
    setResendSuccess(false)
    setError('')

    try {
      const res = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()
      
      if (res.ok) {
        setResendSuccess(true)
      } else {
        setError(data.error || 'Failed to resend email')
      }
    } catch (err) {
      logger.error('Resend verification error', err)
      setError('Something went wrong! Please try again.')
    } finally {
      setResendingEmail(false)
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#f2f2f2]">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md text-center">

        <div className="flex justify-center mb-4">
          <Image
            src="/images/zeteo.jpg"
            alt="Zetoe logo"
            width={60}
            height={60}
            className="rounded-full"
          />
        </div>

        <h2 className="text-2xl font-[Roboto Condensed] font-stretch-extra-expanded 
        text-center mb-2.5 text-[#3a0ca3]">
          Welcome back 👋 
        </h2>

        <p className="text-center text-cyan-950 mb-6 font-stretch-ultra-condensed">
          Login to your account to continue/access dashboard
        </p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {resendSuccess && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            Verification email sent! Please check your inbox.
          </div>
        )}

        {requiresVerification && (
          <div className="bg-yellow-50 border border-yellow-400 text-yellow-800 px-4 py-3 rounded mb-4">
            <p className="font-semibold mb-2">Email Verification Required</p>
            <p className="text-sm mb-3">
              Please verify your email address before logging in. Check your inbox for the verification link.
            </p>
            <LoadingButton
              type="button"
              onClick={handleResendVerification}
              loading={resendingEmail}
              loadingText="Sending..."
              variant="outline"
              size="sm"
              className="text-blue-600 hover:text-blue-800 border-blue-300 hover:bg-blue-50"
            >
              Resend verification email
            </LoadingButton>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">

          <input 
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 mb-4 border border-gray-300 rounded-md 
             text-black placeholder-gray-500 bg-white
             focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <div className="relative">
            <input 
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 mb-4 border border-gray-300 rounded-md 
               text-black placeholder-gray-500 
               focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />

        
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-600"
            >
              {showPassword ? (
                <Eye className='h-5 w-5 text-black'/>
              ) : (
                 <EyeOff className='h-5 w-5 text-black'/>
              )
            }
            </button>
          </div>

          <div className="text-right mb-4">
            <Link href="/forgot-password" className="text-sm text-blue-600 hover:underline">
              Forgot password?
            </Link>
          </div>

          <LoadingButton
            type="submit"
            loading={loading}
            loadingText="Logging in..."
            variant="primary"
            size="lg"
            fullWidth
            className="bg-[#3a0ca3] hover:bg-[#1d0555] border-[#3a0ca3]"
          >
            Login
          </LoadingButton>
        </form>

        <p className="mt-4 text-black text-sm">
          Don’t have an account?{' '}
          <a href="register" className="text-blue-600 hover:underline">
            Register
          </a>
        </p>

        <p className="mt-3 text-blue-600 hover:underline cursor-pointer text-sm">
          <Link href="/">Back to Homepage</Link>
        </p>

      </div>
    </div>
  )
}

export default LoginPage