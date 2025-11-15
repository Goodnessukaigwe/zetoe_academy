"use client"
import React, { useState } from "react";
import Navbar from "./navbar";
import Sidebar from "./sidebar";

export default function SuperAdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100 font-sans">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      <div className="flex flex-col flex-1">
        {/* Navbar */}
        <Navbar setSidebarOpen={setSidebarOpen} />

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}
