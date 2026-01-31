'use client';

import { useState } from 'react';
import Image from 'next/image';
import TeamMemberModal from './TeamMemberModal';

interface TeamMember {
  id: number;
  name: string;
  role: string;
  image: string;
  bio: string;
  expertise: string[];
}

interface TeamSectionProps {
  team: TeamMember[];
}

export default function TeamSection({ team }: TeamSectionProps) {
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleReadMore = (member: TeamMember) => {
    setSelectedMember(member);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMember(null);
  };

  return (
    <>
      <section>
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-8">Our Team</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((m) => (
            <div
              key={m.id}
              className="bg-white rounded-2xl shadow hover:shadow-lg transition-shadow duration-300 overflow-hidden"
            >
              {/* Image */}
              <Image
                src={m.image}
                alt={m.name}
                width={300}
                height={250}
                className="h-56 w-full object-cover"
              />

              {/* Content */}
              <div className="p-4 space-y-3">
                <div>
                  <h3 className="font-bold text-lg text-gray-900">{m.name}</h3>
                  <p className="text-sm text-blue-600 font-semibold">{m.role}</p>
                </div>

                {/* Read More Button */}
                <button
                  onClick={() => handleReadMore(m)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-3 rounded-lg transition-colors duration-200"
                >
                  Read More
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Modal */}
      <TeamMemberModal
        member={selectedMember}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
}
