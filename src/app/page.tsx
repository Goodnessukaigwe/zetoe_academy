"use client";

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
        logger.error("Failed to fetch courses", { error });
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  return (
    <div className="overflow-x-hidden">
      <Header />

      {/* ================= HERO ================= */}
      <HeroSlider />

      {/* ================= COURSES ================= */}
      <section className="py-16 bg-gray-50 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold mb-2">Our Courses</h2>
        <p className="text-gray-600 mb-10 text-sm sm:text-base">
          Professional training and certification programs
        </p>

        {loading ? (
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
                </Link>
              </div>
            ))}
          </div>
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
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
          <div>
            <h3 className="font-bold text-white mb-3">ZETEO CITADEL CONSULT</h3>
            <p className="text-sm">
              No 6 Sabr Plaza Station, Kachia Road
            </p>
          </div>

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
}
