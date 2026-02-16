'use client';

import { useState } from 'react';
import Image from 'next/image';

interface TeamMember {
  id: number;
  name: string;
  role: string;
  image: string;
  bio: string;
  expertise: string[];
}

interface InteractiveTeamSectionProps {
  team: TeamMember[];
}

export default function InteractiveTeamSection({ team }: InteractiveTeamSectionProps) {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  const colors = [
    { gradient: 'from-blue-500 to-cyan-500', dark: 'from-blue-900 to-cyan-900' },
    { gradient: 'from-purple-500 to-pink-500', dark: 'from-purple-900 to-pink-900' },
    { gradient: 'from-orange-500 to-red-500', dark: 'from-orange-900 to-red-900' },
    { gradient: 'from-green-500 to-teal-500', dark: 'from-green-900 to-teal-900' },
    { gradient: 'from-indigo-500 to-purple-500', dark: 'from-indigo-900 to-purple-900' },
  ];

  const selectedMember = selectedId ? team.find((m) => m.id === selectedId) : null;

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        {/* Section heading */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-black mb-4">
            <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent">
              Meet Our Team
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Experienced professionals dedicated to your success
          </p>
        </div>

        {/* Team grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {team.map((member, index) => {
            const color = colors[index % colors.length];
            const isHovered = hoveredId === member.id;
            const isSelected = selectedId === member.id;

            return (
              <div
                key={member.id}
                className="h-full cursor-pointer"
                onMouseEnter={() => setHoveredId(member.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => setSelectedId(isSelected ? null : member.id)}
              >
                {/* Card container */}
                <div
                  className={`relative h-full rounded-2xl overflow-hidden transition-all duration-500 transform ${
                    isHovered || isSelected ? 'scale-105 shadow-2xl' : 'shadow-lg'
                  }`}
                >
                  {/* Animated border */}
                  <div
                    className={`absolute -inset-1 bg-gradient-to-r ${color.gradient} opacity-0 ${
                      isHovered || isSelected ? 'opacity-100' : ''
                    } transition duration-500 blur rounded-2xl`}
                  ></div>

                  {/* Card content */}
                  <div className="relative bg-white rounded-2xl overflow-hidden h-full flex flex-col">
                    {/* Image container */}
                    <div className={`relative h-64 overflow-hidden bg-gradient-to-br ${color.dark}`}>
                      {member.image && member.image !== '/about/teams/miss peace.jpg' ? (
                        <Image
                          src={member.image}
                          alt={member.name}
                          width={400}
                          height={400}
                          className={`w-full h-full object-cover transition-transform duration-500 ${
                            isHovered ? 'scale-110' : 'scale-100'
                          }`}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="text-6xl text-white opacity-30">👤</div>
                        </div>
                      )}

                      {/* Overlay on hover */}
                      {(isHovered || isSelected) && (
                        <div className={`absolute inset-0 bg-gradient-to-t ${color.dark} opacity-60 transition duration-300`}></div>
                      )}
                    </div>

                    {/* Info section */}
                    <div className="flex-1 p-4 flex flex-col">
                      <h3 className="font-bold text-lg text-gray-900 line-clamp-2">{member.name}</h3>
                      <p className={`text-sm font-semibold bg-gradient-to-r ${color.gradient} bg-clip-text text-transparent mb-3`}>
                        {member.role}
                      </p>

                      {/* Expertise badges */}
                      <div className="flex flex-wrap gap-2 mb-auto">
                        {member.expertise.slice(0, 2).map((skill) => (
                          <span
                            key={skill}
                            className={`text-xs px-2 py-1 rounded-full bg-gradient-to-r ${color.gradient} text-white font-semibold`}
                          >
                            {skill}
                          </span>
                        ))}
                      </div>

                      {/* CTA text */}
                      <p className="text-xs text-gray-500 mt-3 text-center italic">
                        {isSelected ? '✕ Click to close' : '✓ Click to learn more'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Expanded member view */}
        {selectedMember && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
            <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto transform transition scale-100 shadow-2xl">
              {/* Header with image */}
              <div className="relative h-64 bg-gradient-to-br from-purple-900 to-pink-900 overflow-hidden">
                {selectedMember.image && selectedMember.image !== '/about/teams/miss peace.jpg' ? (
                  <Image
                    src={selectedMember.image}
                    alt={selectedMember.name}
                    width={600}
                    height={400}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-9xl text-white opacity-30">👤</div>
                  </div>
                )}
                <button
                  onClick={() => setSelectedId(null)}
                  className="absolute top-4 right-4 bg-white/90 hover:bg-white text-gray-900 rounded-full w-10 h-10 flex items-center justify-center font-bold transition"
                >
                  ✕
                </button>
              </div>

              {/* Content */}
              <div className="p-8 space-y-6">
                {/* Name and role */}
                <div>
                  <h2 className="text-4xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                    {selectedMember.name}
                  </h2>
                  <p className="text-xl font-semibold text-gray-600">{selectedMember.role}</p>
                </div>

                {/* Bio */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">About</h3>
                  <p className="text-gray-700 leading-relaxed">{selectedMember.bio}</p>
                </div>

                {/* Expertise */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Expertise</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedMember.expertise.map((skill) => (
                      <span
                        key={skill}
                        className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-semibold text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Close button */}
                <button
                  onClick={() => setSelectedId(null)}
                  className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:from-purple-700 hover:to-pink-700 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-in;
        }
      `}</style>
    </section>
  );
}
