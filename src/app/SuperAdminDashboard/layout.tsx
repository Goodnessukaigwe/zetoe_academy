"use client";

import React, { useState } from "react";
import Navbar from "./navbar";
import Sidebar from "./sidebar";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // DEFAULT OPEN ON DESKTOP

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  return (
    <div className="min-h-screen flex flex-col bg-[#f2f2f2]">
      {/* Navbar */}
      <Navbar toggleSidebar={toggleSidebar} isOpen={isSidebarOpen} />

      <div className="flex flex-1 relative">
        {/* Sidebar */}
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

        {/* Content shifts on desktop only */}
        <main
          className={`
    flex-1 p-6 transition-all duration-300
    md:${isSidebarOpen ? "ml-64" : "ml-0"}  // Only desktop shifts
  `}
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
