"use client";

interface NavbarProps {
  toggleSidebar: () => void;
  isOpen: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ toggleSidebar, isOpen }) => {
  return (
    <nav className="bg-[#3a0ca3] p-4 flex items-center justify-center relative text-white shadow-md">

      {/* Toggle button (visible on ALL screens) */}
      <button
        onClick={toggleSidebar}
        className="absolute left-4 text-white text-3xl md:text-2xl block"
      >
        {isOpen ? "✖" : "☰"}
      </button>

      {/* Title - hidden ONLY on mobile */}
      <h1 className="text-2xl font-bold hidden sm:block md:block">
        Zeteo Citadel Consult
      </h1>

      {/* Logout button — now visible on mobile */}
      <button className="absolute right-4 px-4 py-2 border rounded-md text-sm block">
        Logout
      </button>
    </nav>
  );
};

export default Navbar;
