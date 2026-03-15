'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface Partner {
  name: string;
  logo: string;
  description?: string;
}

interface PartnersCarouselProps {
  partners: Partner[];
}

export default function PartnersCarousel({ partners }: PartnersCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);

  const itemsPerView = 3;
  const autoPlayDelay = 5000;

  useEffect(() => {
    if (!isAutoPlay) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % Math.ceil(partners.length / itemsPerView));
    }, autoPlayDelay);

    return () => clearInterval(timer);
  }, [isAutoPlay, partners.length]);

  const nextSlide = () => {
    setIsAutoPlay(false);
    setCurrentIndex((prev) => (prev + 1) % Math.ceil(partners.length / itemsPerView));
  };

  const prevSlide = () => {
    setIsAutoPlay(false);
    setCurrentIndex((prev) => (prev - 1 + Math.ceil(partners.length / itemsPerView)) % Math.ceil(partners.length / itemsPerView));
  };

  const goToSlide = (index: number) => {
    setIsAutoPlay(false);
    setCurrentIndex(index);
  };

  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Section heading */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Our Partners
          </h2>
          <p className="text-lg text-gray-600">
            Trusted by leading organizations worldwide
          </p>
        </div>

        {/* Carousel */}
        
        <div className="relative">
          {/* Main carousel container */}
          <div className="overflow-hidden rounded-lg">
            <div className="flex gap-8 transition-all duration-700">
              {partners.map((partner, index) => (
                <div
                  key={partner.name}
                  className={`shrink-0 w-full md:w-1/3 transform transition-all duration-700 ${
                    index >= currentIndex * itemsPerView &&
                    index < currentIndex * itemsPerView + itemsPerView
                      ? 'scale-100 opacity-100'
                      : 'scale-95 opacity-0 absolute'
                  }`}
                >
                  <div className="group relative h-64 bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300">
                    {/* Card content */}
                    <div className="relative h-full p-8 flex flex-col items-center justify-center">
                      <div className="text-center">
                        {/* Logo wrapper */}
                        <div className="mb-6 h-20 flex items-center justify-center">
                          {partner.logo ? (
                            <Image
                              src={partner.logo}
                              alt={partner.name}
                              width={150}
                              height={80}
                              className="max-h-20 w-auto object-contain"
                            />
                          ) : (
                            <div className="w-20 h-20 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 text-2xl font-bold">
                              {partner.name.split(' ')[0][0]}
                            </div>
                          )}
                        </div>

                        {/* Partner name */}
                        <h3 className="text-gray-900 font-semibold text-lg text-center mb-4">
                          {partner.name}
                        </h3>

                        {/* Read more button */}
                        {partner.description && (
                          <button
                            onClick={() => setSelectedPartner(partner)}
                            className="text-blue-600 hover:text-blue-800 font-medium text-sm underline"
                          >
                            Read More
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation buttons */}

          {/* <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-8 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition duration-300 z-10 font-bold"
          >
            ←
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-8 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition duration-300 z-10 font-bold"
          >
            →
          </button> */}
        </div>

        {/* Carousel indicators */}
        <div className="flex justify-center gap-3 mt-12">
          {Array.from({ length: Math.ceil(partners.length / itemsPerView) }).map(
            (_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'w-8 bg-blue-600'
                    : 'w-3 bg-gray-300 hover:bg-gray-400'
                }`}
              ></button>
            )
          )}
        </div>
      </div>

      {/* Partner Details Modal */}
      {selectedPartner && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  {selectedPartner.logo && (
                    <Image
                      src={selectedPartner.logo}
                      alt={selectedPartner.name}
                      width={60}
                      height={60}
                      className="object-contain"
                    />
                  )}
                  <h3 className="text-2xl font-bold text-gray-900">{selectedPartner.name}</h3>
                </div>
                <button
                  onClick={() => setSelectedPartner(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>
              <p className="text-gray-700 leading-relaxed">
                {selectedPartner.description || "No additional information available."}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
