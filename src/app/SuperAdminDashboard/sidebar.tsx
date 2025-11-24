"use client";

import React from "react";
import { Menu, X } from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  return (
    <>
      {/* MOBILE BACKDROP */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-20 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 bg-gray-900 text-white z-30 shadow-lg
          w-64 transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:${isOpen ? "translate-x-0" : "-translate-x-64"}
        `}
      >
        {/* SIDEBAR HEADER WITH TOGGLE */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="font-bold text-lg">Menu</h2>
          <button
            onClick={toggleSidebar}
            className="text-white p-1 text-2xl md:text-xl"
          >
            <X size={20} />
          </button>
        </div>

        {/* MENU ITEMS */}
        <ul className="p-4 space-y-2 text-white">
          <li className="hover:bg-[#3a0ca3] p-2 rounded cursor-pointer">🏠 Dashboard</li>
          <li className="hover:bg-[#3a0ca3] p-2 rounded cursor-pointer">👥 Manage Admins</li>
          <li className="hover:bg-[#3a0ca3] p-2 rounded cursor-pointer">🎓 Manage Students</li>
          <li className="hover:bg-[#3a0ca3] p-2 rounded cursor-pointer">💳 Payment Info</li>
          <li className="hover:bg-[#3a0ca3] p-2 rounded cursor-pointer">📊 System Overview</li>
        </ul>
      </aside>
    </>
  );
};

export default Sidebar;
