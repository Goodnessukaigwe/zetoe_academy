'use client';
import React, { useState } from 'react';
import Navbar from './navbar';
import Sidebar from './sidebar';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#f2f2f2] font-['Open_Sans']">
      {/* Navbar */}
      <Navbar toggleSidebar={toggleSidebar} />

      <div className="flex flex-1 relative">
        {/* Sidebar */}
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={closeSidebar} />

        {/* Main Content */}
        <main
          className={`flex-1 p-4 transition-all duration-300 ${
            isSidebarOpen ? 'md:ml-64' : 'md:ml-0'
          }`}
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
