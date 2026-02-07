'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface Partner {
  name: string;
  logo: string;
}

interface PartnersCarouselProps {
  partners: Partner[];
}

export default function PartnersCarousel({ partners }: PartnersCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

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
    <section className="py-20 px-4 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Section heading */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-black mb-4">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Our Partners
            </span>
          </h2>
          <p className="text-xl text-gray-600">
            Trusted by leading organizations worldwide
          </p>
        </div>

        {/* Carousel */}
        <div className="relative">
          {/* Main carousel container */}
          <div className="overflow-hidden rounded-3xl">
            <div className="flex gap-8 transition-all duration-700">
              {partners.map((partner, index) => (
                <div
                  key={partner.name}
                  className={`flex-shrink-0 w-full md:w-1/3 transform transition-all duration-700 ${
                    index >= currentIndex * itemsPerView &&
                    index < currentIndex * itemsPerView + itemsPerView
                      ? 'scale-100 opacity-100'
                      : 'scale-90 opacity-0 absolute'
                  }`}
                >
                  <div className="group relative h-48 bg-gradient-to-br from-slate-800 via-purple-900 to-slate-900 rounded-3xl p-1 overflow-hidden">
                    {/* Animated gradient border */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition duration-1000 blur-lg group-hover:blur-xl rounded-3xl"></div>

                    {/* Card content */}
                    <div className="relative h-full bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 flex items-center justify-center backdrop-blur-sm group-hover:scale-105 transition duration-300">
                      <div className="text-center">
                        {/* Logo wrapper */}
                        <div className="mb-4 h-24 flex items-center justify-center">
                          {partner.logo ? (
                            <Image
                              src={partner.logo}
                              alt={partner.name}
                              width={200}
                              height={100}
                              className="max-h-24 w-auto object-contain filter group-hover:brightness-150 transition duration-300"
                            />
                          ) : (
                            <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                              {partner.name.split(' ')[0][0]}
                            </div>
                          )}
                        </div>

                        {/* Partner name */}
                        <h3 className="text-white font-bold text-lg text-center line-clamp-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 group-hover:bg-clip-text transition duration-300">
                          {partner.name}
                        </h3>
                      </div>

                      {/* Corner decorations */}
                      <div className="absolute top-4 right-4 w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full opacity-0 group-hover:opacity-20 transition duration-300"></div>
                      <div className="absolute bottom-4 left-4 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-0 group-hover:opacity-20 transition duration-300"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-16 md:-translate-x-20 w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full flex items-center justify-center hover:shadow-lg hover:scale-110 transition duration-300 z-10 font-bold text-xl"
          >
            ←
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-16 md:translate-x-20 w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full flex items-center justify-center hover:shadow-lg hover:scale-110 transition duration-300 z-10 font-bold text-xl"
          >
            →
          </button>
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
                    ? 'w-8 bg-gradient-to-r from-purple-500 to-pink-500'
                    : 'w-3 bg-gray-300 hover:bg-gray-400'
                }`}
              ></button>
            )
          )}
        </div>

        {/* Auto-play info */}
        <div className="text-center mt-8">
          <p className="text-gray-600 text-sm">
            {isAutoPlay ? '⏯️' : '⏸️'} {Math.ceil(partners.length / itemsPerView)} partners,{' '}
            <button
              onClick={() => setIsAutoPlay(!isAutoPlay)}
              className="text-purple-600 font-semibold hover:text-purple-700 underline"
            >
              {isAutoPlay ? 'pause auto-play' : 'resume auto-play'}
            </button>
          </p>
        </div>
      </div>
    </section>
  );
}
