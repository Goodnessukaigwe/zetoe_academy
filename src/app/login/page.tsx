'use client'

import React, { useState } from 'react'
import Image from 'next/image'

const page = () => { const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)}

  //   try {
  //     const res = await fetch('/api/auth/signin', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({ email, password }),
  //     })

  //     const data = await res.json()
  //     if (res.ok) {
  //       alert('Login successful!')
  //       window.location.href = '/dashboard'
  //     } else {
  //       alert(data.error || 'Login failed!')
  //     }
  //   } catch (err) {
  //     console.error('Login error:', err)
  //     alert('Something went wrong!')
  //   } finally {
  //     setLoading(false)
  //   }
  


  return (
      <div className="flex justify-center items-center min-h-screen bg-[#f2f2f2]"> 
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md text-center">
        <div className="flex justify-center mb-4">
          <Image
            src="/images/zeteo.jpg"
            alt="Zetoe logo"
            width={60}
            height={60}
            className="rounded-full"/>
        </div>

        {/* <h2 className="text-2xl font-[Roboto Condensed] text-cyan-950
        font-stretch-50% mb-6">Welcome to Zetoe Citidal Consult</h2> */}
      <h2 className='text-2xl font-[Roboto Condensed] font-stretch-extra-expanded 
      text-center mb-2.5 text-[#3a0ca3]'>
        Welcome back 👋 
      </h2>
      <p className='text-center text-cyan-950 mb-6 font-stretch-ultra-condensed'>
         Login to your account to continue/access dashboard
      </p>
        <form onSubmit={handleLogin}
         className="space-y-4  ">
          <input 
            type="email "
            placeholder="Email "
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)}
            className="w-full p-3 mb-4 border border-gray-300 rounded-md 
             text-black placeholder-gray-500 bg-white
             focus:outline-none focus:ring-2 focus:ring-blue-400" />
             
             <div className='relative'>
          <input 
            type={showPassword ?
              'text' : "password"}
            placeholder="Password "
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)}
            className="w-full p-3 mb-4 border border-gray-300 rounded-md 
             text-black placeholder-gray-500 
             focus:outline-none focus:ring-2 focus:ring-blue-400"
             minLength={8}
             maxLength={12}
             pattern='(?=.*\d)(?=.*[a-z])(?=.*[A-Z]). (?=.*[@$!%*?&]) {8,} '
             title='password must be 8-12 characters,include uppercase,
             lowercase, and a number.'
             required/>
            {/* 👁️ Eye toggle */}
          <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-600">
              {showPassword ? '👁️' : '🙈'}
              </button>
                </div>
           <div>
            <label className='
            block text-gray-700 font-semibold mb-2'></label>
            <select
            
            className=' w-full p-3 mb-4 border border-gray-300 rounded-md
             text-black focus:outline-none focus:ring-2 focus:ring-blue-400'>
              <option value="student"> Student</option>
              <option value="admin">Admin</option>
               <option value="super_admin">Super Admin</option>
            </select>
          </div>



          <button
            type="submit" 
            disabled={loading}
            className="relative w-full py-3 rounded-md font-semibold
             text-white bg-[#3a0ca3] hover:bg-[#1d0555] transition duration-300">
           {loading ? 'Logging in...' : ' Login'} 
          </button>
        </form>

        <p className="mt-4 text-black text-sm">
          Don’t have an account?{' '} <a href="#" className="text-blue-600 
          hover:underline">Register</a>
        </p>
      </div>
      </div>
  )
}




export default page
