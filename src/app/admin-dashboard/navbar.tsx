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
    <header className="sticky top-0 z-40 flex min-h-[72px] items-center justify-between bg-[#3a0ca3] px-6 py-5 shadow-md text-white">
      <h1 className="text-xl md:text-2xl font-semibold">Admin Dashboard</h1>

      {/* Mobile Hamburger */}
      <button
        className="md:hidden rounded-lg p-3 hover:bg-[#2a0685] transition"
        onClick={() => setSidebarOpen(true)}
      >
        <Menu size={24} />
      </button>

      {/* Logout Button - visible on md+ */}
      <button 
        onClick={handleLogout}
        className="hidden md:block rounded-md border border-white px-6 py-2.5 font-bold transition hover:bg-white hover:text-[#3a0ca3]">
        Logout
      </button>
    </header>
  );
};

export default Navbar;
