import Link from "next/link";
import Image from "next/image";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo & Brand */}
        <div className="flex items-center gap-3">
          <Image src="/zetelog.png" alt="Logo" width={48} height={48} className="object-contain" />
          <h1 className="text-lg md:text-2xl font-extrabold text-blue-700">ZETEO CITADEL CONSULT</h1>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-6 font-semibold text-gray-800">
          <Link href="/">Home</Link>
          <Link href="/courses/id">Courses</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
        </nav>

        {/* Desktop Register / Sign In */}
        <div className="hidden md:flex items-center space-x-4">
          <Link href="/register" className="text-white bg-[#3a0ca3] px-3 py-2 rounded-md">Register</Link>
          <Link href="/login" className="border border-blue-700 text-blue-700 px-3 py-2 rounded-md">Sign In</Link>
        </div>

        {/* Mobile menu (no JS) */}
        <details className="md:hidden">
          <summary className="list-none cursor-pointer p-2">
            <span className="sr-only">Open menu</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </summary>
          <div className="mt-2 p-3 space-y-2 bg-white border rounded-md shadow-sm">
            <Link href="/" className="block hover:text-[#4a03fc]">Home</Link>
            <Link href="/courses/id" className="block hover:text-[#4a03fc]">Courses</Link>
            <Link href="/about" className="block hover:text-[#4a03fc]">About</Link>
            <Link href="/contact" className="block hover:text-[#4a03fc]">Contact</Link>
            <div className="pt-2 border-t">
              <Link href="/register" className="block text-white bg-[#3a0ca3] text-center mt-2 px-3 py-2 rounded-md">Register</Link>
              <Link href="/login" className="block border border-blue-700 text-blue-700 text-center mt-2 px-3 py-2 rounded-md">Sign In</Link>
            </div>
          </div>
        </details>
      </div>
    </header>
  );
}
