import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="flex items-center px-0 py-3">
        
        <img src="/zetelog.png" alt="Zeteo logo" className="h-16 w-16 object-contain" />
        <h1 className="text-2xl font-extrabold flex-1 text-blue-700">ZETEO CITADEL CONSULT</h1>
        
        <nav className="flex-1 space-x-10 font-bold text-gray-800">
          <Link href="/" className="hover:text-[#4a03fc] transition">Home</Link>
          <Link href="/about" className="hover:text-[#4a03fc] transition">About</Link>
          <Link href="/contact" className="hover:text-[#4a03fc] transition">Contact</Link>
          <Link href="/verify-certificate" className="hover:text-[#4a03fc] transition">Verify Certificate</Link>
        </nav>

        <div className="hidden md:flex items-center">
          <Link href="/login" className="border-2 border-indigo-600 text-blue-700 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-indigo-100 transition mr-5">Sign In</Link>
        </div>

        <div className="md:hidden">
          <button className="text-gray-700 text-2xl">☰</button>
        </div>
      </div>
    </header>
  );
}
