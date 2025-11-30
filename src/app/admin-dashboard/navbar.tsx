"use client";
import React from "react";
import { Menu } from "lucide-react";
import { useRouter } from "next/navigation";
import { logger } from '@/lib/logger';

type Props = {
  setSidebarOpen: (open: boolean) => void;
};

const Navbar = ({ setSidebarOpen }: Props) => {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/signout', { method: 'POST' })
      router.push('/login')
    } catch (error) {
      logger.error('Logout failed', { error })
    }
  }

  return (
    <header className="flex items-center justify-between bg-[#3a0ca3] p-4 shadow-md text-white sticky top-0 z-40">
      <h1 className="text-xl md:text-2xl font-semibold">Admin Dashboard</h1>

      {/* Mobile Hamburger */}
      <button
        className="md:hidden p-2 rounded hover:bg-[#2a0685] transition"
        onClick={() => setSidebarOpen(true)}
      >
        <Menu size={24} />
      </button>

      {/* Logout Button - visible on md+ */}
      <button 
        onClick={handleLogout}
        className="hidden md:block px-5 py-2 border border-white rounded-md font-bold hover:bg-white hover:text-[#3a0ca3] transition">
        Logout
      </button>
    </header>
  );
};

export default Navbar;
