'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function InteractiveAboutSection() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="bg-white py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          {/* Image */}
          <div className={`transform transition duration-1000 ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-20 opacity-0'}`}>
            <div className="relative">
              <Image
                src="/zetelog.png"
                alt="Zetoe Citadel Consult"
                width={500}
                height={500}
                className="w-90 ml-30 h-auto rounded-lg shadow-lg"
              />
            </div>
          </div>

          {/* Text */}
          <div className={`transform transition duration-1000 delay-300 ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-20 opacity-0'}`}>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              About Zeteo Citadel Consult
            </h1>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              Zeteo Citadel Consult is a leading educational and consulting organization dedicated to empowering individuals and institutions through world-class training, mentorship, and strategic consultancy services.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              We deliver professional training, mentorship, and consultancy for students, NYSC members, executives, and organisations. Our team of experienced mentors and consultants is committed to fostering excellence, professionalism, and continuous growth in every engagement.
            </p>
          </div>
        </div>

        {/* Mission, Vision, Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6 bg-gray-50 rounded-lg">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">Our Mission</h3>
            <p className="text-gray-700">
              To empower individuals and organizations through innovative training, mentorship, and consulting solutions that drive professional excellence and sustainable growth.
            </p>
          </div>
          <div className="text-center p-6 bg-gray-50 rounded-lg">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">Our Vision</h3>
            <p className="text-gray-700">
              To be the premier destination for professional development and strategic consulting, recognized for transforming lives and businesses across Africa and beyond.
            </p>
          </div>
          <div className="text-center p-6 bg-gray-50 rounded-lg">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">Our Values</h3>
            <ul className="text-gray-700 text-left list-disc list-inside">
              <li>Excellence in service delivery</li>
              <li>Integrity and professionalism</li>
              <li>Innovation and continuous learning</li>
              <li>Commitment to client success</li>
            </ul>
          </div>
        </div>

        {/* Services */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 border border-gray-200 rounded-lg hover:shadow-lg transition duration-300">
              <h4 className="text-xl font-semibold text-gray-900 mb-4">World-class Training Programs</h4>
              <p className="text-gray-700">
                Comprehensive training programs designed to equip professionals with the skills needed for success in today's competitive environment.
              </p>
            </div>
            <div className="text-center p-6 border border-gray-200 rounded-lg hover:shadow-lg transition duration-300">
              <h4 className="text-xl font-semibold text-gray-900 mb-4">Strategic Mentorship</h4>
              <p className="text-gray-700">
                Personalized mentorship and guidance from experienced professionals to help individuals achieve their career goals.
              </p>
            </div>
            <div className="text-center p-6 border border-gray-200 rounded-lg hover:shadow-lg transition duration-300">
              <h4 className="text-xl font-semibold text-gray-900 mb-4">Innovative Consulting Solutions</h4>
              <p className="text-gray-700">
                Strategic consulting services tailored to meet the unique needs of organizations and individuals.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
