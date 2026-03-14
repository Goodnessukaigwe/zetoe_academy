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

  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        {/* Section heading */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Why Choose Us?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover what sets us apart in professional development and consulting
          </p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className={`transform transition-all duration-700 ${
                visibleCards[index]
                  ? 'translate-y-0 opacity-100'
                  : 'translate-y-10 opacity-0'
              }`}
            >
              <div className="bg-white rounded-lg p-8 shadow-md hover:shadow-lg transition duration-300 h-full">
                {/* Icon */}
                <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center text-3xl mb-6 text-blue-600">
                  {feature.icon}
                </div>

                {/* Title */}
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-gray-700 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
