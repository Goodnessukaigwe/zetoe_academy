'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { logger } from '@/lib/logger'

const RegisterPage = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate passwords match
    if (password !== confirmPassword) {
      alert('Passwords do not match!')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name, 
          email, 
          password,
          role: 'student' // Default role for registration
        }),
      })

      const data = await res.json()
      if (res.ok) {
        alert('Registration successful! Please login.')
        window.location.href = '/login'
      } else {
        alert(data.error || 'Registration failed!')
      }
    } catch (err) {
      logger.error('Registration error', err)
      alert('Something went wrong!')
    } finally {
      setLoading(false)
    }
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
              {showPassword ? '👁️' : '🙈'}
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
              {showConfirmPassword ? '👁️' : '🙈'}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="relative w-full py-3 rounded-md font-semibold
             text-white bg-[#6ee7b7] hover:bg-[#1e3a8a] transition duration-300"
          >
            {loading ? 'Creating Account...' : 'Register'}
          </button>
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
