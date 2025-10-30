import React from 'react';
import Navbar from './navbar';
// import Sidebar from './sidebar';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    // <div className="flex min-h-screen bg-[#e6e3e3]">
    //   <Sidebar />
      <div className="flex flex-col flex-1">
        <Navbar />
        <main className="p-6">{children}</main>
      </div>

  )
};

export default DashboardLayout;
