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
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/verify-certificate">Verify Certificate</Link>
        </nav>

        {/* Desktop Sign In */}
        <div className="hidden md:flex space-x-4">
          <Link href="/register" className="bg-indigo-600 text-white px-5 py-2 rounded-lg font-semibold shadow-md hover:bg-[#1d0555] transition">Get Started</Link>
          <Link href="/login" className="border border-indigo-600 text-blue-700 px-4 py-2 rounded-md hover:bg-indigo-100 transition">Sign In</Link>
        </div>

        {/* Mobile menu - Positioned as Popup */}
        <details className="md:hidden relative">
          <summary className="list-none cursor-pointer p-2">
            <span className="sr-only">Open menu</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </summary>
          {/* Dropdown Menu */}
          <div className="absolute top-full right-0 mt-2 p-3 space-y-2 bg-white border rounded-lg shadow-lg w-56 z-50">
            <Link href="/" className="block px-3 py-2 hover:text-[#4a03fc] hover:bg-gray-100 rounded transition">Home</Link>
            <Link href="/about" className="block px-3 py-2 hover:text-[#4a03fc] hover:bg-gray-100 rounded transition">About</Link>
            <Link href="/contact" className="block px-3 py-2 hover:text-[#4a03fc] hover:bg-gray-100 rounded transition">Contact</Link>
            <Link href="/verify-certificate" className="block px-3 py-2 hover:text-[#4a03fc] hover:bg-gray-100 rounded transition">Verify Certificate</Link>
            <div className="pt-2 border-t space-y-2">
              <Link href="/register" className="block bg-indigo-600 text-white text-center px-3 py-2 rounded-lg hover:bg-[#1d0555] transition">Get Started</Link>
              <Link href="/login" className="block border border-indigo-600 text-blue-700 text-center px-3 py-2 rounded-md hover:bg-indigo-100 transition">Sign In</Link>
            </div>
          </div>
        </details>
      </div>
    </header>
  );
}
