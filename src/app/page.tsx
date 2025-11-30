"use client";
<<<<<<< Updated upstream
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Course } from "@/types/database";
=======
>>>>>>> Stashed changes

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Header from "@/component/Header";
import HeroSlider from "@/component/HeroSlider";
import { Course } from "@/types/database";
import { logger } from "@/lib/logger";

export default function Page() {
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
<<<<<<< Updated upstream
        console.error("Failed to fetch courses:", error);
=======
        logger.error("Failed to fetch courses", { error });
>>>>>>> Stashed changes
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  return (
<<<<<<< Updated upstream
    <div>
      {/* top navigation */}
      <div className="sticky top-0 flex justify-end font-opensans font-bold p-4 text-black text-20 space-x-10 bg-white z-50">
        {/* logo */}
        <div className="flex justify-center mr-180 items-center text-blue-700 w-100 h-10 space-x-0">
          <img src="/zetelog.png" alt="logo" className="h-30 w-25 ml-10" />
          <h1 className="text-center font-extrabold">
            ZETEO CITADEL CONSULT
          </h1>
        </div>

        <a className="hover:text-blue-700" href="#home">
          HOME
        </a>
        <a className="hover:text-blue-700" href="#courses">
          COURSES
        </a>
        <a className="hover:text-blue-700" href="#contact">
          CONTACT
        </a>
        <a href="#mail" className="hover:text-blue-700 mr-20">
          MAIL
        </a>
      </div>

      {/* navigation */}
      <div className="sticky top-18 flex justify-between font-opensans font-bold p-3 text-white-700 space-x-10 bg-blue-800 z-40">
        {/* menus */}
        <div className="space-x-15 ml-50 text-white-800">
          <a
            className="hover:text-white hover:border hover:rounded-4xl hover:p-1"
            href="#courses"
          >
            Courses
          </a>
          <a
            href="#about"
            className="hover:text-white hover:border hover:rounded-4xl hover:p-1"
          >
            About
          </a>
          <a
            className="hover:text-white hover:border hover:rounded-4xl hover:p-1"
            href="#contact"
          >
            Contact
          </a>
        </div>
        {/* reg and signin */}
        <div className="space-x-5 mr-20">
          <Link
            href="/register"
            className="text-white rounded-md bg-red-700 px-4 py-2 hover:bg-blue-700 hover:text-white"
          >
            REGISTER NOW
          </Link>
          <Link
            className="border-white p-1 text-white-700 hover:border hover:rounded-4xl hover:p-1"
            href="/login"
          >
            Sign in
          </Link>
        </div>
      </div>
                
      {/* HERO SITE */}
      <div
        id="home"
        className="bg-gradient-to-r from-gray-300 to-gray-600 w-full m-auto justify-center text-center mt-5 p-8 shadow-xl"
      >
        <img
          src="/zetelog.png"
          alt="heroimage"
          className="text-center m-auto w-32 h-32 object-cover"
        />
        <h1 className="text-white font-bold text-4xl mt-4">
          WELCOME TO ZETEO CITADEL CONSULT
        </h1>
        <p className="text-white text-lg mt-2">
          In collaboration with University of Ibadan (Consultancy Unit)
        </p>
      </div>
      <br />
      <hr className="shadow" />

      {/* COURSES */}
      <div id="courses" className="justify-center text-center text-2xl py-10">
        <h1 className="text-black font-bold m-10">Our Courses</h1>
        <p className="text-gray-600 mb-8">
=======
    <div className="overflow-x-hidden">
      <Header />

      {/* ================= HERO ================= */}
      <HeroSlider />

      {/* ================= COURSES ================= */}
      <section className="py-16 bg-gray-50 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold mb-2">Our Courses</h2>
        <p className="text-gray-600 mb-10 text-sm sm:text-base">
>>>>>>> Stashed changes
          Professional training and certification programs
        </p>

        {loading ? (
<<<<<<< Updated upstream
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
          </div>
        ) : courses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
            {courses.map((course) => (
              <div
                key={course.id}
                className="rounded-3xl text-center bg-white w-full h-auto p-6 shadow-lg hover:shadow-xl transition-shadow"
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
=======
          <div className="flex justify-center py-10">
            <div className="animate-spin w-12 h-12 border-b-2 border-indigo-700 rounded-full"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto px-4">
            {courses.slice(0, 6).map((course) => (
              <div key={course.id} className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
                <div className="text-5xl mb-3">🎓</div>
                <h3 className="font-semibold text-lg">{course.name}</h3>
                <p className="text-sm text-gray-600 line-clamp-2 mt-2">
                  {course.description}
                </p>
                <p className="font-bold text-indigo-700 text-xl mt-3">
                  ₦{course.price.toLocaleString()}
                </p>
                <Link
                  href={`/courses/${course.id}`}
                  className="mt-4 inline-block bg-indigo-700 text-white px-5 py-2 rounded-md"
                >
                  Learn More
>>>>>>> Stashed changes
                </Link>
              </div>
            ))}
          </div>
<<<<<<< Updated upstream
        ) : (
          <p className="text-gray-500">No courses available at the moment.</p>
        )}
      </div>
      <hr className="rounded-3xl shadow" />
      <br />

      {/* about us */}
      <div id="about" className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold text-black mb-6">ABOUT US</h1>
        <div className="flex flex-col md:flex-row gap-8 items-center">
          <img
            src="/mrlaw.jpg"
            alt="About us"
            className="w-full md:w-1/3 h-80 rounded-3xl object-cover shadow-lg"
          />
          <p className="text-black text-justify flex-1 leading-relaxed">
            The role of professionalism is key for effective and efficient work
            delivery. As a 21st century organisation, we understand the dynamics
            of the time and the ever changing world. Our organisation is a
            cutting-edge solution for any organisation, person, students, corps
            members and corporate executives who want to enhance their knowledge
            in Management and software applications. We have seasoned
            professionals and experts who are passionate towards knowledge
            delivery alongside coaching, mentorship and consultancy.
          </p>
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
            <li><a href="#" className="hover:text-white transition">Services</a></li>
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
<<<<<<< Updated upstream

      
      <div/>
      
      
      </div>
      
      
      
  )
}

export default Page



=======
    </div>
  );
}
>>>>>>> Stashed changes
