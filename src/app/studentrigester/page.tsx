"use client";
import React, { useState } from "react";




export default function StudentRegistrationForm() {
   
    


  return (
   <div>
                      {/* top navigation */}
        <div className=" sticky top-0 flex  justify-end font-opensans font-bold p-4  text-black text-30 space-x-10 bg-white ">
                    {/* logo */}
          <div className=' flex justify-center  items-center m-auto text-blue-700   '>
          <img src="/zetelog.png"  alt="logo" className='  h-30 w-20  '/>
          <h1 className=' text-center font-extrabold  '>ZETEO CITADEL CONSULT<br /> in collaboration with university of ibadan <br />(consultancy unit)</h1>
          <img src="/ibadanlog.png"  alt="logo" className='  h-17 w-20  '/>
          <a href="#" className="text-black ml-300 absolute cursor-pointer">➜]logout</a>
          </div>

      
        </div>

             {/* navigation */}
        <div className=' sticky top-28 flex justify-between font-opensans font-bold p-3 text-white-700 space-x-10  bg-blue-800 '>
                       
             
                        {/* menus */}
          <div  className='space-x-15 text-center justify-center m-auto text-white-800  ' > <a className=' hover:text-white hover:border hover:rounded-4xl hover:p-1' href="#">home</a> <a href="#" className='hover:text-white hover:border hover:rounded-4xl hover:p-1' >Academic</a> <a className='hover:text-white hover:border hover:rounded-4xl hover:p-1' href="#">Mail</a> <a href="#" className='hover:text-white hover:border hover:rounded-4xl hover:p-1'>Calender</a> <a href="#" className='hover:text-white hover:border hover:rounded-4xl hover:p-1'>News & Blog</a>
          </div>

        </div >

     <div className="min-h-screen  flex items-center justify-center bg-gray-100 px-4">
     
      <form
        
        className="bg-white p-6 rounded-4xl   shadow-md w-full max-w-sm"
      >
        <h2 className="text-4xl font-extrabold text-blue-700 mb-4 text-center">
          Register New Student
        </h2>

        {/* Name */}
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            type="text"
            name="name"
            placeholder="Enter name"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-200"
          />
        </div>

        {/* Email */}
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            name="email"
      
            placeholder="Enter email"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-200"
          />
        </div>

        {/* Course */}
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Course
          </label>
          <input
            type="text"
            name="course"
            placeholder="Enter course"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-200"
          />
        </div>

        {/* Payment Status */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb- hover:text-black">
            Payment Status
          </label>
          <select
            name="paymentStatus"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring focus:ring-blue-200"
          >
            <option value="">Select status</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
            <option value="Unpaid">Unpaid</option>
          </select>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md text-sm hover:bg-blue-700 transition"
          onClick={() => alert("you have submitted the form")}
        >
          Submit
        </button>
      </form>
    </div>





                     {/* footer working */}
    <footer className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-gray-300 py-10 mt-16">
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
            <li><a href="#" className="hover:text-white transition">Home</a></li>
            <li><a href="#" className="hover:text-white transition">About</a></li>
            <li><a href="#" className="hover:text-white transition">Services</a></li>
            <li><a href="#" className="hover:text-white transition">Contact</a></li>
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
