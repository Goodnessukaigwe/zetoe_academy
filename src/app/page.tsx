"use client";
import React from "react";
import Link from "next/link";
import { HeroSlider, InteractiveSection } from "@/component";

const Page = () => {
  return (
    <div className="antialiased">

      {/* Header / Navigation */}
      <header className="sticky top-0 z-50 bg-white  shadow-sm">
          <div className="flex items-center px-0 py-3">
            
              <img src="/zetelog.png" alt="Zeteo logo" className="h-16 w-16 object-contain" />
              <h1 className="text-2xl font-extrabold flex-1 text-blue-700">ZETEO CITADEL CONSULT</h1>
            

           
          <nav className="flex-1 space-x-10 font-bold text-gray-800">
            <Link href="/" className="hover:text-[#4a03fc] transition">Home</Link>
            <Link href="/about" className="hover:text-[#4a03fc] transition">About</Link>
            <Link href="/contact" className="hover:text-[#4a03fc] transition">Contact</Link>
          </nav>

          <div className="hidden md:flex space-x-4 mt-15">
            <Link href="/register" className="bg-indigo-600 text-white px-5 py-2 
            rounded-lg font-semibold shadow-md hover:bg-[#1d0555] transition">Get Started</Link>
            <Link href="/login" className="border-1 border-indigo-600 text-blue-700 px-2 py-2 rounded-md
         hover:bg-indigo-100 transition mr-4">Sign In</Link>
          </div>
        

         <div className="md:hidden">
              <button className="text-gray-700 text-2xl">☰</button>
            </div>
          </div>

      </header>

      {/* Hero */}
      <section className="bg-gradient-to-br from-indigo-50 via-white to-blue-50">
        <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-2
         gap-12 items-center">
          <div>
            <h2 className="lg:text-5xl font-black
               text-emerald-600 leading-tight">Elevate Exam Readiness. Accelerate Careers.</h2>
            <p className="mt-6 text-lg text-gray-700 max-w-2xl leading-relaxed">
              We provide personalized mentorship, professional development and
               institutional consulting tailored for learners, corps members and
                organizations preparing for exams and assessments.</p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link href="/register" className="inline-block bg-gradient-to-r
               from-yellow-600 to-indigo-700 text-white px-8 py-4 rounded-lg 
               font-bold shadow-lg hover:shadow-2xl hover:scale-105 transition duration-300">
                Get Started Now</Link>
              <Link href="/about" className="inline-block border-2 border-indigo-600
               text-indigo-600 px-8 py-4 rounded-lg font-bold hover:bg-indigo-50 
               transition duration-300">Learn More</Link>
            </div>

            <div className="mt-8 text-sm text-gray-600">✓ Trusted by: University of Ibadan(Consulting Unit), SMPIN, NYSC</div>
          </div>

          <div className="order-first lg:order-last">
            <div className="rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl
             transition-shadow duration-300">
              <HeroSlider />
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-20 bg-gradient-to-b from-white to-gray-200">
        <div className="max-w-5xl mx-auto px-3 text-center">
          <h3 className="text-3xl md:text-4xl font-bold text-black mb-10 
  relative inline-block">
          Our Services
          <p className="text-gray-600 mt-4 mb-12 text-sm">
            Bite-sized programs and institutional support that focus on measurable results.</p>
            </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <article className=" p-8  bg-gradient-to-br from-indigo-200 to-blue-50
             rounded-2xl shadow-lg hover:shadow-1xl 
            transform hover:-translate-y-2 transition-all duration-300 border border-gray-100">
              <div className="text-5xl mb-4 group-hover:scale-110 transition duration-300">🤝</div>
              <h4 className="text-2xl font-bold text-gray-900">Mentorship</h4>
              <p className="mt-5 text-gray-800 leading-relaxed">
                Personalized coaching, exam strategies and structured study plans tailored 
                to learner goals.</p>
              {/* <button className="mt-6 text-indigo-600 font-semibold hover:text-indigo-700 
              transition">Learn more →</button> */}
            </article>

            <article className=" p-8 bg-gradient-to-br from-indigo-200 to-blue-50 
            rounded-2xl shadow-lg hover:shadow-1xl transform hover:-translate-y-2
             transition-all duration-300 border border-gray-100">
              <div className="text-5xl mb-4 group-hover:scale-110 transition duration-300">🎯</div>
              <h4 className="text-2xl font-bold text-gray-900">Professionalism</h4>
              <p className="mt-5 text-gray-800 leading-relaxed">Soft-skills development,
                 CV clinics and workplace readiness for early-career professionals.</p>
              {/* <button className="mt-6 text-indigo-600 font-semibold hover:text-indigo-700
               transition">Learn more →</button> */}
            </article>

            <article className=" p-8 bg-gradient-to-br from-indigo-200 to-blue-50
            rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2
             transition-all duration-300 border border-gray-100">
              <div className="text-5xl mb-4 group-hover:scale-110 transition duration-300">💼</div>
              <h4 className="text-2xl font-bold text-gray-900">Consulting</h4>
              <p className="mt-5 text-gray-800 leading-relaxed">Curriculum support,
                 assessment design and institutional training programs.</p>
              {/* <button className="mt-6 text-indigo-600 font-semibold hover:text-indigo-700 
              transition">Learn more →</button> */}
            </article>
          </div>
        </div>
      </section>

      {/* Locations */}
      <section id="locations" className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-2 text-center">
          <h3 className="text-3xl md:text-4xl font-bold text-black mb-10 
  relative inline-block">
          Our Locations
          <p className="text-gray-600 mt-4 mb-12 text-sm">We serve learners and 
            institutions across key Nigerian centres:</p></h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {['Kaduna','Kano','Niger','Lagos','Abuja','Jos','Ebonyi'].map((l) => (
              <div key={1} className=" px-2 py-2 bg-gradient-to-br from-indigo-200 to-blue-50
               rounded-2xl shadow-md hover:shadow-xl transform hover:scale-110 transition-all 
               duration-300 border border-indigo-400 cursor-pointer">
                <span className="text-gray-900 font-bold text-lg group-hover:text-indigo-600 
                transition">{l}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners */}
      <section id="partners" className="py-20 bg-gradient-to-b from-gray-200 to-white">
        <div className="max-w-5xl mx-auto px-3 text-center">
           <h3 className="text-3xl md:text-4xl font-bold text-black mb-10 
  relative inline-block">
 Trusted by Top Institutions
          <p className="text-gray-600 mt-4 mb-12 text-sm">We collaborate with leading academic and professional bodies to maintain quality standards.</p>
</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
            <div className=" p-8 bg-gradient-to-br from-indigo-200 to-blue-50
             rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 
             transition-all duration-300 border
             border-gray-200 cursor-pointer">
              <div className="text-4xl mb-4 group-hover:scale-110 transition duration-300">🏛️</div>
              <h4 className="text-2xl font-bold text-gray-900">University of Ibadan(Consulting Unit)</h4>
              <p className="mt-5 text-gray-800">Academic collaboration for curriculum design and
                 assessment quality assurance.</p>
            </div>

            <div className=" p-8 bg-gradient-to-br from-indigo-200 to-blue-50
             rounded-2xl shadow-lg hover:shadow-2xl
             transform hover:-translate-y-2 transition-all duration-300 border
              border-gray-200 cursor-pointer">
              <div className="text-4xl mb-4 group-hover:scale-110 transition duration-300">📊</div>
              <h4 className="text-2xl font-bold text-gray-900">SMPIN</h4>
              <p className="mt-5 text-gray-800">Professional network support,
                 industry partnerships and placement services.</p>
            </div>

            <div className=" p-8 bg-gradient-to-br from-indigo-200 to-blue-50
             rounded-2xl shadow-lg hover:shadow-2xl 
            transform hover:-translate-y-2 transition-all duration-300 border
             border-gray-200 cursor-pointer">
              <div className="text-4xl mb-4 group-hover:scale-110 transition duration-300">🎖️</div>
              <h4 className="text-2xl font-bold text-gray-900">NYSC</h4>
              <p className="mt-5 text-gray-800">Supporting corps members with training, 
                mentorship and certification pathways.</p>
            </div>
          </div>
        </div>
              </section>

      {/* Interactive Section (stats, testimonials, quiz preview) */}
      <InteractiveSection />

      {/* CTA */}
      <section className="bg-gradient-to-r from-amber-400 to-blue-800 text-white py-16">
        <div className="max-w-6xl mx-auto px-3 text-center">
          <h4 className="text-4xl font-black">Ready to Transform Results?</h4>
          <p className="text-indigo-100 mt-4 mb-8 text-lg">Start a program, request institutional support, or connect with our team today.</p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link href="/register" className="bg-white text-indigo-700 px-8 py-4 rounded-lg font-bold shadow-lg hover:shadow-xl hover:scale-105 transition duration-300">Create Account</Link>
            <Link href="/contact" className="border-2 border-white text-white px-8 py-3 rounded-lg hover:bg-white hover:text-indigo-700 transition">Contact Sales</Link>
          </div>
        </div>
      </section>

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
      {/* Footer */}
      <footer className="bg-gradient-to-b from-gray-900 to-gray-950 text-gray-300 pt-16">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div>
            <h5 className="text-white text-lg font-bold">ZETEO CITADEL CONSULT</h5>
            <p className="mt-3 text-sm leading-relaxed">Partnering with institutions and learners to deliver high-quality training and assessment support across Nigeria.</p>
            
             <p className="text-sm leading-6">
            Partner with us to tackle your unique challenges and unlock your organization’s full potential.
          </p>
            <p className="mt-3 text-sm">North West Zone: No 6 Sabr Plaza Station, Kachia Road</p>
            <p className="mt-1 text-sm">Email: info@zeteoconsult.ng 
              <br></br>• Phone: +234 800 000 0000</p>
          </div>

          <div>
            <h6 className="text-white font-semibold">Quick Links</h6>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link href="/" className="hover:text-white transition">Home</Link></li>
              <li><Link href="/about" className="hover:text-white transition">About</Link></li>
              <li><Link href="/contact" className="hover:text-white transition">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h6 className="text-white font-semibold">Resources</h6>
            <ul className="mt-3 space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition">Blog</a></li>
              <li><a href="#" className="hover:text-white transition">FAQs</a></li>
              <li><a href="#" className="hover:text-white transition">Privacy</a></li>
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
        <div className="border-t border-gray-800 mt-12 py-8 text-center">
          <p className="text-sm text-gray-500">© {new Date().getFullYear()} ZETEO CITADEL CONSULT. All rights reserved.</p>
          <div className="mt-3 flex justify-center gap-4 text-xs text-gray-400">
            <a href="/privacy-policy" className="hover:text-white transition">Privacy Policy</a>
            <span>•</span>
            <a href="/terms-of-service" className="hover:text-white transition">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Page;