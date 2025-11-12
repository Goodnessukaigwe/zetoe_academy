import React from 'react'
import Image from 'next/image'
const navbar = () => {
  return (
    <nav className="bg-[#3a0ca3] p-4 flex justify-between items-center shadow-md font-['Open_Sans']">
        <h1 className="text-2xl font-semibold text-white">Super Admin Dashboard</h1>
    
         <button
           className="relative font-['Times_New_Roman'] text-white px-5 py-2 rounded-md
            bg-[#3a0ca3] border border-white hover:bg-white hover:text-[#3a0ca3] transition duration-300 
            font-bold shadow-sm">
           Logout
         </button>
       </nav>
  )
}  

export default navbar
