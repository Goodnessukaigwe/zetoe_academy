"use client";

interface NavbarProps {
  toggleSidebar: () => void;
  isOpen: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ toggleSidebar, isOpen }) => {
  return (
    <nav className="bg-[#3a0ca3] p-4 flex items-center justify-center relative text-white shadow-md">

      {/* Toggle button - visible only on desktop for shifting */}
      <button
        onClick={toggleSidebar}
        className="absolute left-4 text-white text-3xl md:text-2xl md:block hidden"
      >
        {isOpen ? "✖" : "☰"} {/* or use lucide-react icons */}
      </button>

      {/* Navbar title */}
      <h1 className="text-2xl font-bold">Zeteo Citadel Consult</h1>

      {/* Logout button - optional, positioned top-right */}
      <button className="absolute right-4 px-5 py-2 border rounded-md hidden md:block">
        Logout
      </button>
    </nav>
  );
};

export default Navbar;
