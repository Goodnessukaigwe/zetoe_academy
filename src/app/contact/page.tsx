"use client";
import React, { useState } from "react";
import Link from "next/link";
import Header from "@/component/Header";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Add your form submission logic here
    setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
  };

  const contactInfo = [
    {
      name: "John  Daniel",
      title: "Chief Admin",
      phone: "09012345678",
      whatsapp: "09012345678",
      email: "chiefadmin@gmail.com",
      icon: "👤",
    },
    {
      name: "Mary Johnson",
      title: "Admin",
      phone: "09012345678",
      whatsapp: "09012345678",
      email: "admin@gmail.com",
      icon: "👤",
    },
    {
      name: "Kelechi Obi",
      title: "CRO (Client Relations)",
      phone: "09012345678",
      whatsapp: "09012345678",
      email: "cro@gmail.com",
      icon: "👤",
    },
  ];

  const offices = [
    {
      zone: "North West Zone",
      address: "No 6 Sabr Plaza Station, Block B, Room 17, Kachia Road",
    },
  ];

  return (
    <div className="bg-white">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-blue-800 text-white py-12 sm:py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4">
            Get In Touch
          </h1>
          <p className="text-lg sm:text-xl text-indigo-100 max-w-2xl mx-auto">
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Contact Information */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">
              Contact Information
            </h2>

            {/* Office Location */}
            <div className="mb-10 p-6 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg border border-indigo-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <span className="text-2xl">📍</span> Our Office
              </h3>
              {offices.map((office, idx) => (
                <div key={idx}>
                  <p className="text-sm text-indigo-600 font-semibold uppercase tracking-wide mb-2">
                    {office.zone}
                  </p>
                  <p className="text-gray-700 leading-relaxed">{office.address}</p>
                </div>
              ))}
            </div>

            {/* General Contact */}
            <div className="mb-10">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                General Inquiries
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">📧</span>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Email</p>
                    <a
                      href="mailto:info@zeteoconsult.ng"
                      className="text-indigo-600 hover:text-indigo-700 font-medium"
                    >
                      info@zeteoconsult.ng
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">📱</span>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Phone</p>
                    <a
                      href="tel:+234800000000"
                      className="text-indigo-600 hover:text-indigo-700 font-medium"
                    >
                      +234 800 000 0000
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Team Members */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Team Contacts
              </h3>
              <div className="space-y-4">
                {contactInfo.map((contact, idx) => (
                  <div
                    key={idx}
                    className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{contact.icon}</span>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900">
                          {contact.name}
                        </h4>
                        <p className="text-sm text-indigo-600 font-medium mb-2">
                          {contact.title}
                        </p>
                        <div className="space-y-1 text-sm">
                          <p>
                            <span className="text-gray-600">Phone: </span>
                            <a
                              href={`tel:${contact.phone}`}
                              className="text-indigo-600 hover:underline"
                            >
                              {contact.phone}
                            </a>
                          </p>
                          <p>
                            <span className="text-gray-600">WhatsApp: </span>
                            <a
                              href={`https://wa.me/${contact.whatsapp.replace(/\D/g, '')}`}
                              className="text-indigo-600 hover:underline"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {contact.whatsapp}
                            </a>
                          </p>
                          <p>
                            <span className="text-gray-600">Email: </span>
                            <a
                              href={`mailto:${contact.email}`}
                              className="text-indigo-600 hover:underline break-all"
                            >
                              {contact.email}
                            </a>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">
              Send us a Message
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-gray-900 placeholder-gray-500"
                  placeholder="John Doe"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-gray-900 placeholder-gray-500"
                  placeholder="john@example.com"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-gray-900 placeholder-gray-500"
                  placeholder="+234 800 000 0000"
                />
              </div>

              {/* Subject */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Subject <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-gray-900 placeholder-gray-500"
                  placeholder="What is this about?"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-gray-900 placeholder-gray-500 resize-none"
                  placeholder="Tell us more about your inquiry..."
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold py-3 rounded-lg hover:from-indigo-700 hover:to-blue-700 transition duration-300 shadow-md hover:shadow-lg"
              >
                Send Message
              </button>

              <p className="text-sm text-gray-500 text-center">
                We typically respond within 24 hours.
              </p>
            </form>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-gradient-to-r from-gray-50 to-indigo-50 rounded-lg p-8 md:p-12 border border-gray-200">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                How long does it take to get a response?
              </h3>
              <p className="text-gray-700">
                We typically respond to all inquiries within 24 hours during business days.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Do you offer free consultations?
              </h3>
              <p className="text-gray-700">
                Yes, we offer initial consultations for institutional partnerships and major programs.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                What are your business hours?
              </h3>
              <p className="text-gray-700">
                Monday to Friday, 9:00 AM - 5:00 PM. We also respond to WhatsApp messages.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Can I schedule a call with the team?
              </h3>
              <p className="text-gray-700">
                Absolutely! Mention your preferred time in the contact form or call us directly.
              </p>
            </div>
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
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm">
               <li><Link href="/" className="hover:text-white transition">Home</Link></li>
           \ <li><Link href="/About" className="hover:text-white transition">About</Link></li>
         
            
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