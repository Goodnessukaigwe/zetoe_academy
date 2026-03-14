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
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Section heading */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Meet Our Team
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Experienced professionals dedicated to your success
          </p>
        </div>

        {/* Team grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {team.map((member) => (
            <div key={member.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="aspect-4/5 relative">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover object-center"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-1">{member.name}</h3>
                <p className="text-blue-600 font-medium mb-3">{member.role}</p>
                <p className="text-gray-700 text-sm leading-relaxed mb-4">
                  {member.bio.length > 150 ? `${member.bio.substring(0, 150)}...` : member.bio}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {member.expertise.slice(0, 2).map((skill) => (
                    <span key={skill} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                      {skill}
                    </span>
                  ))}
                </div>
                <button
                  onClick={() => setSelectedMember(member)}
                  className="text-blue-600 hover:text-blue-800 font-medium text-sm underline"
                >
                  Read More
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Team Member Details Modal */}
      {selectedMember && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-6">
                  <div className="w-34 h-34 relative rounded-full overflow-hidden shrink-0">
                    <Image
                      src={selectedMember.image}
                      alt={selectedMember.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-gray-900 mb-2">{selectedMember.name}</h3>
                    <p className="text-blue-600 font-semibold text-lg">{selectedMember.role}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedMember(null)}
                  className="text-gray-400 hover:text-gray-600 text-3xl"
                >
                  ×
                </button>
              </div>

              <div className="mb-6">
                <h4 className="text-xl font-semibold text-gray-900 mb-3">About</h4>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {selectedMember.bio}
                </p>
              </div>

              <div>
                <h4 className="text-xl font-semibold text-gray-900 mb-3">Expertise</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedMember.expertise.map((skill) => (
                    <span key={skill} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
