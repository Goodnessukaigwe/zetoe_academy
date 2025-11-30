"use client";
<<<<<<< Updated upstream
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Course } from "@/types/database";
import HeroSlider from "@/component/HeroSlider";
import { logger } from '@/lib/logger';

const Page = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch("/api/courses");
        const data = await res.json();
        if (res.ok) setCourses(data.courses || []);
      } catch (error) {
        logger.error('Failed to fetch courses', { error });
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  return (
<<<<<<< Updated upstream
    <div>
      
    {/* REFINED HEADER / NAVIGATION */}
 <header className="sticky top-0 z-50 bg-white shadow-md">
  <div className="flex items-center px-0 py-3 ">
    {/* Logo & Brand */}
      <img src="/zetelog.png" alt="logo" className="h-18 w-18 object-cover" />
      <h1 className="text-2xl font-extrabold flex-1 text-blue-700">
          ZETEO CITADEL CONSULT
      </h1>
    

    {/* Navigation Links */}
    <nav className="flex-1 space-x-9 font-semibold text-gray-800">
      <Link href="/" className="hover:text-[#4a03fc] transition">Home</Link>
      <Link href="/courses/id" className="hover:text-[#4a03fc] transition">Courses</Link>
      <Link href="/about" className="hover:text-[#4a03fc] transition">About</Link>
      <Link href="/contact" className="hover:text-[#4a03fc] transition">Contact</Link>
    </nav>

    {/* Register / Sign In */}
    <div className="hidden md:flex space-x-4">
      <Link
        href="/register"
        className=" text-white bg-[#3a0ca3] hover:bg-[#1d0555] transition 
        duration-300 px-2 py-2 rounded-md " >
        Register
      </Link>
      <Link
        href="/login"
        className="border border-blue-700 text-blue-700 px-2 py-2 rounded-md
         hover:bg-blue-700 hover:text-white transition mr-4"
      >
        Sign In
      </Link>
    </div>

    {/* Mobile Hamburger Menu */}
    <div className="md:hidden">
      <button className="text-gray-800 focus:outline-none">☰</button>
    </div>
  </div>
</header>

    
     
      {/* HERO SITE */}
    
 < HeroSlider />
    
       
 {/* COURSES PREVIEW SECTION */}
 <div id="courses" className="justify-center text-center py-14 bg-gray-50">
  <h1 className="text-black font-bold text-3xl mb-3">Our Courses</h1>
  <p className="text-gray-600 mb-10">
    Professional training and certification programs
  </p>

  {loading ? (
    // LOADER
    <div className="flex justify-center items-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
    </div>
  ) : courses.length > 0 ? (
    <>
      {/* SHOW ONLY FEW COURSES (E.g., 6) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
        {courses.slice(0, 6).map((course) => (
          <div
            key={course.id}
            className="rounded-3xl text-center bg-white w-full h-auto p-6 shadow-md hover:shadow-xl transition-shadow"
          >
            <h1 className="text-6xl m-4">🎓</h1>

            <h3 className="font-semibold text-xl mb-2 text-black">
              {course.name}
            </h3>

            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
              {course.description || "Professional certification program"}
            </p>

            <p className="text-blue-700 font-bold text-2xl mb-3">
              ₦{course.price.toLocaleString()}
            </p>

            <p className="text-gray-500 text-sm mb-4">
              {course.duration || "Duration varies"}
            </p>

            <hr className="my-4" />

            <Link
              href={`/courses/${course.id}`}
              className="inline-block text-white rounded-md bg-blue-700 px-6 py-2 hover:bg-red-700 hover:text-white transition"
            >
              LEARN MORE
            </Link>
          </div>
        ))}
      </div>
    </>
  ) : (
    <p className="text-gray-500">No courses available at the moment.</p>
  )}
</div>

<hr className="my-10" />

     {/* ABOUT */}
<div id="about" className="max-w-6xl mx-auto px-6 py-16">
  {/* Section Heading */}
  <h1 className="text-4xl md:text-4xl font-extrabold text-black mb-10 
  relative inline-block">
    ABOUT US
    <span className="absolute left-0 -bottom-2 w-17 h-1
     bg-blue-700 rounded-full"></span>
  </h1>

  <div className="flex flex-col md:flex-row items-center gap-10">
    
    <div className="w-full md:w-1/3">
      <img
        src="/mrlaw.jpg"
        alt="About us"
        className="w-full h-80 md:h-[28rem] rounded-3xl object-cover shadow-2xl 
        transition-transform duration-500 hover:scale-105"
      />
    </div>

    
    <div className="flex-1 text-black text-justify space-y-4 leading-relaxed">
      <p>
        The role of professionalism is key for effective and efficient work
        delivery. As a 21st-century organisation, we understand the dynamics
        of the time and the ever-changing world.
      </p>
      <p>
        Our organisation is a cutting-edge solution for organisations, students,
        corps members, and corporate executives who want to enhance their
        knowledge in Management and software applications.
      </p>
      <p>
        We have seasoned professionals and experts who are passionate about
        knowledge delivery alongside coaching, mentorship, and consultancy.
      </p>

      {/* Optional Highlights */}
      <div className="mt-6 flex flex-wrap gap-4">
        <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full 
        text-sm font-semibold">Mentorship</span>
        <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full 
        text-sm font-semibold">Professionalism</span>
        <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full 
        text-sm font-semibold">Consultancy</span>
      </div>
      <Link
        href="/about"
        className="bg-amber-300 text-blue-700 px-2 py-2 rounded-full text-sm
         font-bold mt-4 inline-block transition-transform duration-500 hover:scale-105"
      >
        Read More
      </Link>

    </div>
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
=======
        )}
      </section>

      {/* ================= ABOUT ================= */}
      <section className="py-16 max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-extrabold mb-10">About Us</h2>

        <div className="flex flex-col md:flex-row gap-10 items-center">
          <div className="w-full md:w-1/3">
            <Image
              src="/mrlaw.jpg"
              alt="About us"
              width={500}
              height={600}
              className="rounded-3xl object-cover"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </div>

          <div className="flex-1 space-y-4 text-sm sm:text-base">
            <p>
              We are a 21st-century organization delivering professional excellence
              through training, mentorship, and consultancy.
            </p>
            <p>
              Our experts support students, corps members, and executives to grow
              management and software skills.
            </p>

            <Link href="/about" className="inline-block bg-amber-300 text-blue-700 px-6 py-2 rounded-full font-bold">
              Read More
            </Link>
          </div>
>>>>>>> Stashed changes
        </div>
      </section>

<<<<<<< Updated upstream
        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-white transition">Home</a></li>
            <li><a href="#" className="hover:text-white transition">About</a></li>
            <li><a href="#" className="hover:text-white transition">Courses</a></li>
            <li><a href="#" className="hover:text-white transition">Contact</a></li>
          </ul>
        </div>
=======
      {/* ================= FOOTER ================= */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
          <div>
            <h3 className="font-bold text-white mb-3">ZETEO CITADEL CONSULT</h3>
            <p className="text-sm">
              No 6 Sabr Plaza Station, Kachia Road
            </p>
          </div>
>>>>>>> Stashed changes

          <div>
            <h4 className="text-white font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/">Home</Link></li>
              <li><Link href="/about">About</Link></li>
              <li><Link href="/courses">Courses</Link></li>
              <li><Link href="/contact">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li>Blog</li>
              <li>FAQs</li>
              <li>Privacy Policy</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3">Social</h4>
            <div className="space-y-3">
              {["twister", "instag", "facebook", "whatsapp"].map((icon) => (
                <Image
                  key={icon}
                  src={`/${icon}.png`}
                  alt={icon}
                  width={24}
                  height={24}
                />
              ))}
            </div>
          </div>
        </div>

        <p className="text-center text-sm mt-10 text-gray-400">
          © {new Date().getFullYear()} ZETEO CITADEL CONSULT
        </p>
      </footer>

      </div>
    
  );
};

export default Page;