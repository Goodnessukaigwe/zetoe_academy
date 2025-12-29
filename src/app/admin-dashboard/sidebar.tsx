"use client";
import React from "react";
import Link from "next/link";
import { Users, BookOpen, FileText, Home, Award } from "lucide-react";

type Props = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
};

const menuItems = [
  { name: "Dashboard", href: "/admin-dashboard", icon: Home },
  { name: "Students", href: "/student-management", icon: Users },
  { name: "Courses", href: "/admin-dashboard/courses", icon: BookOpen },
  { name: "Exams", href: "/admin-dashboard/exams", icon: FileText },
  { name: "Certificates", href: "/admin-dashboard/certificates", icon: Award },
];

const Sidebar = ({ isOpen, setIsOpen }: Props) => {
  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-black p-4 transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0 md:static md:inset-auto`}
      >
        <nav className="flex flex-col mt-16 md:mt-0 gap-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-2 rounded hover:bg-blue-600 text-white font-medium transition"
              >
                <Icon size={20} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
