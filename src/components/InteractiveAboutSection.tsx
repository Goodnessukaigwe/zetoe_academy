'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function InteractiveAboutSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setIsVisible(true);

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-20 px-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        <div className="absolute -bottom-8 right-20 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-6000"></div>
      </div>

      {/* Glowing cursor effect */}
      <div
        className="fixed pointer-events-none w-96 h-96 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mix-blend-screen filter blur-3xl opacity-10"
        style={{
          left: `${mousePosition.x}px`,
          top: `${mousePosition.y}px`,
          transform: 'translate(-50%, -50%)',
          transition: 'left 0.1s ease-out, top 0.1s ease-out',
        }}
      ></div>

      <div className="relative max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Image with glass morphism */}
          <div
            className={`transform transition duration-1000 ${
              isVisible ? 'translate-x-0 opacity-100' : '-translate-x-20 opacity-0'
            }`}
          >
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:blur-xl"></div>
              <div className="relative bg-white from-white-800 to-slate-900 rounded-3xl p-1 backdrop-blur-sm">
                <Image
                  src="/zetelog.png"
                  alt="Zetoe Citadel Consult"
                  width={450}
                  height={450}
                  className="w-full h-auto rounded-3xl object-cover"
                />
              </div>
              
              {/* Floating cards */}
              <div className="absolute -bottom-6 -left-6 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-4 backdrop-blur-md transform hover:scale-110 transition duration-300 shadow-2xl max-w-xs">
                <p className="text-white font-bold text-sm">🎓 Empowering Excellence</p>
                <p className="text-white text-xs mt-1 opacity-90">Training & Mentorship</p>
              </div>
              
              <div className="absolute -top-6 -right-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-4 backdrop-blur-md transform hover:scale-110 transition duration-300 shadow-2xl max-w-xs">
                <p className="text-white font-bold text-sm">💼 Strategic Growth</p>
                <p className="text-white text-xs mt-1 opacity-90">Consulting Services</p>
              </div>
            </div>
          </div>

          {/* Right side - Text content */}
          <div
            className={`transform transition duration-1000 delay-300 ${
              isVisible ? 'translate-x-0 opacity-100' : 'translate-x-20 opacity-0'
            }`}
          >
            <div className="space-y-8">
              {/* Animated heading */}
              <div>
                <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent mb-4 leading-tight">
                  About <span className="block">Zetoe Citadel</span>
                </h1>
                <div className="h-1 w-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
              </div>

              {/* Description text */}
              <div className="space-y-4 text-gray-300 leading-relaxed">
                <p className="text-lg">
                  Zetoe Citadel Consult is a <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 font-bold">leading educational and consulting organization</span> dedicated to empowering individuals and institutions through world-class training, mentorship, and strategic consultancy services.
                </p>
                <p className="text-lg">
                  We deliver professional training, mentorship, and consultancy for students, NYSC members, executives, and organisations. Our team of experienced mentors and consultants is committed to fostering excellence, professionalism, and continuous growth in every engagement.
                </p>
              </div>

              {/* Features list with animation */}
              <div className="space-y-3 pt-4">
                {[
                  { icon: '✨', text: 'World-class training programs' },
                  { icon: '🚀', text: 'Strategic mentorship and guidance' },
                  { icon: '🌟', text: 'Innovative consulting solutions' },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-xl p-4 backdrop-blur-md border border-purple-500/20 hover:border-purple-500/60 transition duration-300 transform hover:translate-x-2"
                  >
                    <span className="text-2xl">{item.icon}</span>
                    <span className="text-gray-200 font-semibold">{item.text}</span>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <div className="pt-6">
                <button className="relative px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl hover:from-purple-700 hover:to-pink-700 transition duration-300 transform hover:scale-105 shadow-2xl group overflow-hidden">
                  <span className="relative z-10">Explore More</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-400 opacity-0 group-hover:opacity-20 transition duration-300"></div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -50px) scale(1.1); }
          50% { transform: translate(-20px, 20px) scale(0.9); }
          75% { transform: translate(50px, 50px) scale(1.05); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .animation-delay-6000 {
          animation-delay: 6s;
        }
      `}</style>
    </section>
  );
}
