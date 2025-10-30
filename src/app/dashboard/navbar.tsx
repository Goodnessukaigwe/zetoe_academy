import React from 'react';
import Image from 'next/image'; // For logo image

const Navbar = () => {
  return (
    <nav className="bg-[#3a0ca3] p-4 flex justify-between items-center shadow-sm font-[Open_Sans]">
      <div className="flex items-center space-x-3">
      
        <Image
          src="/images/zeteo(1).jpg"
          alt="Zetoe Academy Logo"
          width={40}
          height={40}
          className="rounded-full"
        />
        <h1 className="text-2xl font-extrabold text-white">Zetoe Citadel Consult</h1>
      </div>


      <button
        className="relative font-[Times_New_Roman] text-white px-4 py-2 rounded-md">
        <span className="relative z-10 font-bold ">Logout</span>
        <span className="absolute inset-0  text-white bg-[#6ee7b7] hover:bg-[#2855d2] transition duration-300 rounded-md"  ></span>
      
      </button>
    </nav>
  );
};

export default Navbar;
