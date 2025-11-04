import React from 'react'
import Image from 'next/image'

const Navbar = () => {
  return (
    <nav className="bg-[#3a0ca3] p-4 flex justify-between items-center shadow-md font-['Open_Sans']">
  
      <div className="flex items-center space-x-3">
        <Image
          src="/images/zeteo(1).jpg"
          alt="Zeteo Academy Logo"
          width={40}
          height={40}
          className="rounded-full"/>
        <h1 className="text-2xl font-extrabold text-white">
          Zeteo Citadel Consult
        </h1>
      </div>
    
      <button
        className="relative font-['Times_New_Roman'] text-white px-5 py-2 rounded-md
         bg-[#3a0ca3] border border-white hover:bg-white hover:text-[#3a0ca3] transition duration-300 font-bold shadow-sm"
      >
        Logout
      </button>
    </nav>
  )
}

export default Navbar