'use client'

import React from 'react';
import { useRouter } from 'next/navigation';

interface NavbarProps {
  toggleSidebar: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ toggleSidebar }) => {
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
    <nav className="bg-[#3a0ca3] p-4 flex justify-between items-center text-left
     shadow-md font-['Open_Sans']">
    
      <button
        onClick={toggleSidebar}
        className="text-white text-2xl  focus:outline-none"
      >
        ☰
      </button>

    
      <h1 className="text-2xl font-extrabold text-white ">
      Zeteo Citadel Consult
      </h1>

      
      <button
        onClick={handleLogout}
        className="font-['Times_New_Roman'] text-white px-5 py-2 rounded-md
          bg-[#3a0ca3] border border-white hover:bg-white hover:text-[#3a0ca3]
          transition duration-300 font-bold shadow-sm"
      >
        Logout
      </button>
    </nav>
  );
};

export default Navbar;
