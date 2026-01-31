'use client';

import { useState } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';

interface TeamMember {
  id: number;
  name: string;
  role: string;
  image: string;
  bio: string;
  expertise: string[];
}

interface TeamMemberModalProps {
  member: TeamMember | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function TeamMemberModal({
  member,
  isOpen,
  onClose,
}: TeamMemberModalProps) {
  if (!member || !isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative h-80 bg-gradient-to-b from-blue-500 to-blue-400">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 text-white rounded-full p-2 transition-colors z-10"
            aria-label="Close modal"
          >
            <X size={24} />
          </button>

          {/* Member Image */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Image
              src={member.image}
              alt={member.name}
              width={300}
              height={300}
              className="w-64 h-64 object-cover rounded-full border-4 border-white shadow-lg"
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-8 space-y-6">
          {/* Name and Role */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">{member.name}</h2>
            <p className="text-lg text-blue-600 font-semibold">{member.role}</p>
          </div>

          {/* Bio */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">About</h3>
            <p className="text-gray-700 leading-relaxed">{member.bio}</p>
          </div>

          {/* Expertise */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">Areas of Expertise</h3>
            <div className="flex flex-wrap gap-2">
              {member.expertise.map((skill, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Close Button */}
          <div className="pt-4">
            <button
              onClick={onClose}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
