'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { Eye, EyeOff } from 'lucide-react'
import { logger } from '@/lib/logger'
import { LoadingButton } from '@/components/ui/LoadingButton'

const RegisterPage = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match!')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name, 
          email, 
          password,
        }),
      })

      const data = await res.json()
      if (res.ok) {
        setSuccess(true)
      } else {
        setError(data.error || 'Registration failed!')
      }
    } catch (err) {
      logger.error('Registration error', err)
      setError('Something went wrong!')
    } finally {
      setLoading(false)
    }
  }

  // Success view - show email verification message
  if (success) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#f2f2f2]">
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md text-center">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-green-100 p-4">
              <svg
                className="h-12 w-12 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-cyan-950 mb-4">
            Check Your Email
          </h2>
          
          <p className="text-gray-700 mb-2">
            Registration successful!
          </p>
          
          <p className="text-gray-600 text-sm mb-4">
            We've sent a verification link to <strong>{email}</strong>
          </p>
          
          <p className="text-gray-600 text-sm mb-6">
            Please check your email and click the verification link to activate your account before logging in.
          </p>

          <a
            href="/login"
            className="inline-block w-full py-3 rounded-md font-semibold text-white bg-[#6ee7b7] hover:bg-[#1e3a8a] transition duration-300"
          >
            Go to Login
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#f2f2f2]">
      <div className="bg-[#ffff] rounded-2xl shadow-lg p-8 w-full max-w-md text-center">
        <div className="flex justify-center mb-4">
          <Image
            src="/images/zeteo.jpg"
            alt="Zetoe logo"
            width={60}
            height={60}
            className="rounded-full"
          />
        </div>

        <h2 className="text-2xl font-[Roboto Condensed] text-cyan-950 font-stretch-50% mb-6">
          Create Your Account
        </h2>
        <p className="text-gray-600 text-sm mb-6">
          Join Zetoe Citidal Consult and start learning today
        </p>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          {/* Name Input */}
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md 
             text-black placeholder-gray-500 bg-white
             focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />

          {/* Email Input */}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md 
             text-black placeholder-gray-500 bg-white
             focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />

          {/* Password Input */}
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md 
               text-black placeholder-gray-500 bg-white
               focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            {/* 👁️ Eye toggle */}
                    
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

          {/* Confirm Password Input */}
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md 
               text-black placeholder-gray-500 bg-white
               focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            {/* 👁️ Eye toggle */}
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-3 text-gray-600"
            >
              {showConfirmPassword ?  (
                <Eye className='h-5 w-5 text-black'/>
              ):  (
                 <EyeOff className='h-5 w-5 text-black'/>
              )}
            </button>
          </div>

          <LoadingButton
            type="submit"
            loading={loading}
            loadingText="Creating Account..."
            variant="success"
            size="lg"
            fullWidth
            className="bg-[#6ee7b7] hover:bg-[#1e3a8a] border-[#6ee7b7]"
          >
            Register
          </LoadingButton>
        </form>

        <p className="mt-4 text-black text-sm">
          Already have an account?{' '}
          <a href="/login" className="text-blue-600 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  )
}

export default RegisterPage
