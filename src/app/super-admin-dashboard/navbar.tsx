"use client";
import React, { useState } from "react";
import { Menu, LogOut, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { logger } from '@/lib/logger';

type Props = {
  setSidebarOpen: (open: boolean) => void;
};

const Navbar = ({ setSidebarOpen }: Props) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/signout', { method: 'POST' });
      router.push('/login');
    } catch (error) {
      logger.error('Logout error', { error });
    }
  };

  return (
    <header className="bg-white shadow-md z-20 sticky top-0">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Mobile menu button */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="md:hidden p-2 rounded hover:bg-gray-100"
        >
          <Menu size={24} />
        </button>

        <h1 className="text-xl md:text-2xl font-bold text-[#3a0ca3]">
          Super Admin Dashboard
        </h1>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 px-4 py-2 rounded text-black border-2 hover:bg-gray-300"
          >
            <User size={20} />
            <span className="hidden md:inline">Super Admin</span>
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 text-black bg-white rounded-md shadow-lg py-1 z-50">
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 w-full px-4 py-2 text-left hover:bg-gray-100"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
