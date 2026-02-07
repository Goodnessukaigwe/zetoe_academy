'use client';

import { useState, useEffect } from 'react';

interface Feature {
  title: string;
  description: string;
  icon: string;
}

interface SlidingFeaturesSectionProps {
  features: Feature[];
}

export default function SlidingFeaturesSection({ features }: SlidingFeaturesSectionProps) {
  const [visibleCards, setVisibleCards] = useState<boolean[]>([]);

  useEffect(() => {
    setVisibleCards(new Array(features.length).fill(false));
    const timers = features.map((_, index) =>
      setTimeout(() => {
        setVisibleCards((prev) => {
          const newCards = [...prev];
          newCards[index] = true;
          return newCards;
        });
      }, index * 150)
    );
    return () => timers.forEach((timer) => clearTimeout(timer));
  }, [features]);

  const colors = [
    { bg: 'from-blue-500 to-cyan-500', light: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200' },
    { bg: 'from-purple-500 to-pink-500', light: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-200' },
    { bg: 'from-orange-500 to-red-500', light: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-200' },
  ];

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-6xl mx-auto">
        {/* Section heading */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-black mb-4">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Why Choose Us?
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover what sets us apart in professional development and consulting
          </p>
          <div className="flex justify-center gap-2 mt-6">
            {features.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all duration-300 ${
                  visibleCards[index] ? 'w-8 bg-gradient-to-r from-purple-500 to-pink-500' : 'w-2 bg-gray-300'
                }`}
              ></div>
            ))}
          </div>
        </div>

        {/* Features grid with slide-in animation */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const color = colors[index % colors.length];
            return (
              <div
                key={feature.title}
                className={`transform transition-all duration-700 ${
                  visibleCards[index]
                    ? 'translate-x-0 opacity-100'
                    : index % 2 === 0
                    ? '-translate-x-20 opacity-0'
                    : 'translate-x-20 opacity-0'
                }`}
              >
                {/* Gradient border wrapper */}
                <div className="relative group h-full">
                  <div className={`absolute -inset-1 bg-gradient-to-r ${color.bg} rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-1000 group-hover:blur-xl`}></div>
                  
                  {/* Card content */}
                  <div className={`relative h-full ${color.light} rounded-2xl p-8 border ${color.border} backdrop-blur-sm group-hover:scale-105 transition duration-300`}>
                    {/* Icon circle */}
                    <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${color.bg} flex items-center justify-center text-4xl mb-6 group-hover:scale-110 transition duration-300 shadow-lg`}>
                      {feature.icon}
                    </div>

                    {/* Title */}
                    <h3 className={`text-2xl font-bold ${color.text} mb-3`}>
                      {feature.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-700 mb-6 leading-relaxed">
                      {feature.description}
                    </p>

                    {/* Bottom accent */}
                    <div className={`h-1 w-12 bg-gradient-to-r ${color.bg} rounded-full group-hover:w-full transition-all duration-300`}></div>

                    {/* Hover text */}
                    <div className="mt-4 overflow-hidden max-h-0 group-hover:max-h-20 transition-all duration-300">
                      <p className={`${color.text} font-semibold text-sm`}>
                        Learn how we can help you succeed →
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom visualization */}
        <div className="mt-16 flex justify-center">
          <div className="flex gap-4 flex-wrap justify-center">
            {['Excellence', 'Innovation', 'Integrity'].map((tag, index) => (
              <div
                key={tag}
                className={`px-6 py-3 rounded-full font-semibold border-2 transition-all duration-500 ${
                  visibleCards[index]
                    ? 'border-purple-500 bg-purple-50 text-purple-600 scale-100'
                    : 'border-gray-300 bg-white text-gray-600 scale-75'
                }`}
              >
                {tag}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
