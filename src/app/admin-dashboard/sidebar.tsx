"use client";
import React from "react";

type Props = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
};

const menuItems = [
  "Register Student",
  "Upload Exam",
  "Edit Student Info",
  "View Scores",
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
          {menuItems.map((item) => (
            <button
              key={item}
              className="text-left w-full px-4 py-2 rounded hover:bg-blue-600 text-white font-medium transition"
              onClick={() => setIsOpen(false)}
            >
              {item}
            </button>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
