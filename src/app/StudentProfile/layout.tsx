import React from 'react';
import Navbar from './navbar';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-indigo-50">
      <Navbar />
      <main className="flex-1">{children}</main>
    </div>
  );
};

export default DashboardLayout;