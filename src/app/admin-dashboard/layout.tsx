import React from 'react';
import Navbar from './navbar';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#f2f2f2] font-['Open_Sans']">
    
      <Navbar />

      <main className="flex-1 ">{children}</main>

    </div>
  );
};

export default DashboardLayout;