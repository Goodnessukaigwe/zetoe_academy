'use client'

import React from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

const Navbar = () => {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/signout', { method: 'POST' })
      router.push('/login')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <nav className="bg-[#3a0ca3] p-4 flex justify-between items-center shadow-md font-['Roboto_Condensed']">
      {/* Logo + Name */}
      <div className="flex items-center space-x-3">
        <Image
          src="/images/zeteo(1).jpg"
          alt="ZyraTel Consult Logo"
          width={40}
          height={40}
          className="rounded-full"
        />
        <h1 className="text-2xl font-extrabold text-white">
          Zeteo Citadel Consult
        </h1>
      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className=" text-white px-4 py-2 rounded-lg 
        
        bg-[#3a0ca3] border border-white hover:bg-white hover:text-[#3a0ca3] 
        transition duration-300 font-bold shadow-sm"
      >
        Logout
      </button>
    </nav>
  )
}

export default Navbar
