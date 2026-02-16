"use client";
import React from "react";
import Link from "next/link";
import { Users, BookOpen, FileText, Home, Award } from "lucide-react";

type Props = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
};

const menuItems = [
  {
    name: "Dashboard",
    href: "/admin-dashboard",
    icon: Home,
    iconColor: "text-sky-400",
  },
  {
    name: "Students",
    href: "/student-management",
    icon: Users,
    iconColor: "text-emerald-400",
  },
  {
    name: "Courses",
    href: "/admin-dashboard/courses",
    icon: BookOpen,
    iconColor: "text-violet-400",
  },
  {
    name: "Exams",
    href: "/admin-dashboard/exams",
    icon: FileText,
    iconColor: "text-rose-400",
  },
  {
    name: "Certificates",
    href: "/admin-dashboard/certificates",
    icon: Award,
    iconColor: "text-amber-400",
  },
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
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-black p-5 transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0 md:static md:inset-auto`}
      >
        <nav className="flex flex-col mt-16 md:mt-4 gap-10">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-600/80 text-white font-medium transition-colors"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-md bg-white/5">
                  <Icon size={20} className={item.iconColor} />
                </span>
                <span className="leading-tight">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
