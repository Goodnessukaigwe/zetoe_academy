import React from "react";
import Link from "next/link";
import Header from "@/component/Header";
export default function ContactPage() {
  return (


    
    <div>
      <Header />



    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-20">

      
      <h1 className="text-2xl sm:text-3xl font-bold mb-8 text-blue-700
       text-center sm:text-left">
        Contact Us
      </h1>

      {/* ====== CONTACT LIST SECTION ====== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-14">

        {/* CONTACT CARD */}
        <div className="bg-white shadow-md p-5 rounded-xl">
          <h2 className="text-lg sm:text-xl font-semibold text-black">John Daniel</h2>
          <p className="text-xs sm:text-sm text-lime-500 mb-3">Chief Admin</p>

          <p className=" text-blue-800 text-sm"><strong
          className=" text-black text-sm">Phone:</strong> 09012345678</p>
          <p className=" text-blue-800 text-sm"><strong
         className=" text-black text-sm" >WhatsApp:</strong> 09012345678</p>
          <p className=" text-blue-800 text-sm"><strong
         className=" text-black text-sm" >Email:</strong> chiefadmin@gmail.com</p>
        </div>

        <div className="bg-white shadow-md p-5 rounded-xl">
          <h2 className="text-lg sm:text-xl font-semibold text-black">Mary Johnson</h2>
          <p className="text-xs sm:text-sm text-lime-500 mb-3">Admin</p>

           <p className=" text-blue-800 text-sm"><strong
          className=" text-black text-sm">Phone:</strong> 09012345678</p>
          <p className=" text-blue-800 text-sm"><strong
         className=" text-black text-sm" >WhatsApp:</strong> 09012345678</p>
          <p className=" text-blue-800 text-sm"><strong
         className=" text-black text-sm" >Email:</strong> admin@gmail.com</p>

        </div>

        <div className="bg-white shadow-md p-5 rounded-xl">
          <h2 className="text-lg sm:text-xl font-semibold text-black">Kelechi Obi</h2>
          <p className="text-xs sm:text-sm text-lime-500 mb-3">CRO (Client Relations)</p>

          <p className=" text-blue-800 text-sm"><strong
          className=" text-black text-sm">Phone:</strong> 09012345678</p>
          <p className=" text-blue-800 text-sm"><strong
         className=" text-black text-sm" >WhatsApp:</strong> 09012345678</p>
          <p className=" text-blue-800 text-sm"><strong
         className=" text-black text-sm" >Email:</strong> cro@gmail.com</p>
        </div>
      </div>

      {/* ====== CONTACT FORM SECTION ====== */}
      <div className="bg-white shadow-lg p-6 sm:p-8 rounded-xl max-w-3xl mx-auto">

        <h2 className="text-xl sm:text-2xl font-semibold text-blue-700
         mb-6 text-center sm:text-left">
          Send Us a Message
        </h2>

        <form className="grid gap-4">

          {/* NAME */}
          <div>
            <label className="block font-medium mb-1 text-black text-sm">Name</label>
            <input
              type="text"
              className="w-full border  text-black rounded-lg px-3 py-2 sm:px-4 sm:py-2 
              focus:outline-none focus:ring"
              placeholder="Enter your name"
            />
          </div>

          {/* EMAIL */}
          <div>
            <label className="block font-medium mb-1  text-black text-sm">Email</label>
            <input
              type="email"
              className="w-full border rounded-lg px-3 py-2 sm:px-4 sm:py-2
                text-black focus:outline-none focus:ring"
              placeholder="Enter your email"
            />
          </div>

          {/* PHONE */}
          <div>
            <label className="block font-medium mb-1 text-black text-sm">Phone Number</label>
            <input
              type="text"
              className="w-full border rounded-lg px-3 py-2 sm:px-4 sm:py-2
               text-black focus:outline-none focus:ring"
              placeholder="Enter your phone number"
            />
          </div>

          {/* MESSAGE */}
          <div>
            <label className="block font-medium mb-1  text-black text-sm">Message</label>
            <textarea
              className="w-full border rounded-lg px-3 py-2 sm:px-4 sm:py-2 h-28 
               text-black sm:h-32 resize-none focus:outline-none focus:ring"
              placeholder="Type your message..."
            ></textarea>
          </div>

          {/* SUBMIT */}
          <button className=" py-3 rounded-lg font-semibold text-center text-white
           bg-[#3a0ca3] hover:bg-[#1d0555] transition duration-300 px-2 ">
            Submit
          </button>

        </form>
      </div>
</div>








      {/* footer working */}
      <footer
        id="contact"
        className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-gray-300 py-10 mt-16"
      >
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">
        
        {/* Brand */}
        <div>
          <h2 className="text-25 font-bold text-white mb-3">ZETEO CITADEL CONSULT</h2>
          <p className="text-sm leading-6">
            Partner with us to tackle your unique challenges and unlock your organization’s full potential.
          </p>
          <br />
          <p>
            <span className='text-23 text-white font-bold'>North west zone address:</span> No 6 Sabr Plaza Station, Block B, Room 17 , Kachia Road
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm">
               <li><Link href="/" className="hover:text-white transition">Home</Link></li>
            <li><Link href="/courses/id" className="hover:text-white transition">Course</Link></li>
            <li><Link href="/About" className="hover:text-white transition">About</Link></li>
         
            
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Resources</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-white transition">Blog</a></li>
            <li><a href="#" className="hover:text-white transition">FAQs</a></li>
            <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
          </ul>
        </div>

        {/* Social Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Connect With Us</h3>
          <div className="  space-x-8">
            
            <a href="#" className="  flex gap-3 hover:text-white transition">
               <img src="/twister.png" className=' w-7 ' alt="logo" />twitter
            </a>
            <br />
            <a href="#" className="  flex gap-3 hover:text-white transition">
             <img src="/instag.png" className=' w-7 ' alt="logo" /> instagram
            </a>
            <br />
            <a href="#" className=" flex gap-3 hover:text-white transition">
              <img src="/facebook.png" className=' w-7 ' alt="logo" />facebook
            </a>
            <br />
            <a href="#" className=" flex gap-3 hover:text-white transition">
             <img src="/whatsapp.png" className=' w-7 ' alt="logo" />whatsapp
            </a>
          </div>
        </div>

      </div>

      {/* Bottom Section */}
      <div className="mt-10 border-t border-gray-700 pt-6 text-center text-sm text-gray-400">
        <p>
          © {new Date().getFullYear()} <span className="text-white font-semibold">ZETEO CITADEL CONSULT</span>. 
          All rights reserved.
        </p>
      </div>
      </footer>

    </div>
  );
}