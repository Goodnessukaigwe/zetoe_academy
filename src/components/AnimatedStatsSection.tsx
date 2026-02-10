'use client';

import { useState } from 'react';

interface Stat {
  title: string;
  value: number;
  suffix: string;
}

interface AnimatedStatsSectionProps {
  statistics: Stat[];
}

export default function AnimatedStatsSection({ statistics }: AnimatedStatsSectionProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const colors = [
    { gradient: 'from-blue-500 to-cyan-500', text: 'text-blue-400' },
    { gradient: 'from-purple-500 to-pink-500', text: 'text-purple-400' },
    { gradient: 'from-orange-500 to-red-500', text: 'text-orange-400' },
    { gradient: 'from-green-500 to-teal-500', text: 'text-green-400' },
  ];

  return (
    <section className="py-20 px-4 bg-transparent">
      <div className="max-w-7xl mx-auto">
        {/* Stats grid - minimal and clean */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {statistics.map((stat, index) => {
            const color = colors[index % colors.length];
            const isHovered = hoveredIndex === index;

            return (
              <div
                key={stat.title}
                className="text-center cursor-pointer transition-all duration-300"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Number display */}
                <div className={`text-7xl md:text-8xl font-black font-mono mb-3 transition-all duration-300 ${color.text} ${isHovered ? 'scale-110' : 'scale-100'}`}>
                  {stat.value}
                  <span className="text-4xl md:text-5xl font-bold ml-2">{stat.suffix}</span>
                </div>

                {/* Title */}
                <h3 className={`text-gray-600 font-semibold text-sm md:text-base transition-all duration-300 ${isHovered ? 'text-gray-900' : ''}`}>
                  {stat.title}
                </h3>

                {/* Subtle underline on hover */}
                {isHovered && (
                  <div className={`h-1 w-12 bg-gradient-to-r ${color.gradient} rounded-full mx-auto mt-3 animate-pulse`}></div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
