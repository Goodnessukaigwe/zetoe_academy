"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const navItems = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Verify Certificate", href: "/verify-certificate" },
  { label: "Contact", href: "/contact" },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2" onClick={() => setIsMenuOpen(false)}>
          <img src="/zetelog.png" alt="Zeteo Citadel Consult logo" className="h-10 w-10 object-contain" />
          <span className="leading-tight">
            <span className="block text-sm font-extrabold tracking-tight text-slate-900 sm:text-base">Zeteo Citadel Consult</span>
            <span className="block text-[9px] text-slate-500 sm:text-[10px]">Consulting & Professional Academy</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex" aria-label="Main navigation">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="text-xs font-semibold text-slate-700 transition hover:text-[#1d4698] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1d4698]">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
            <Link href="/login" className="text-sm font-bold text-[#1d4698] hover:underline">Sign In</Link>
        </div>

        <button type="button" aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"} aria-expanded={isMenuOpen} onClick={() => setIsMenuOpen((open) => !open)} className="rounded-md p-2 text-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#214397] lg:hidden">
          {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {isMenuOpen && (
        <nav className="border-t border-slate-100 bg-white px-4 py-4 lg:hidden" aria-label="Mobile navigation">
          <div className="mx-auto flex max-w-7xl flex-col gap-1">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setIsMenuOpen(false)} className="rounded-md px-3 py-3 text-sm font-semibold text-slate-700 hover:bg-[#eef4ff] hover:text-[#1d4698]">
                {item.label}
              </Link>
            ))}
            <div className="mt-2 flex items-center gap-4 border-t border-slate-100 pt-4">
                <Link href="/login" onClick={() => setIsMenuOpen(false)} className="text-base font-bold text-[#1d4698]">Sign In</Link>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
