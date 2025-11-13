"use client";

import { useState, useEffect } from "react";
import Image from "next/image";


const images = [
  "/zeto2.jpg",
  "/zeto3.jpg",
  "/zetelog.png",
  "/video.jpg",
];

export default function ImageSlider() {
  const [current, setCurrent] = useState(0);
  const length = images.length;

  // Auto slide every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % length);
    }, 3000);
    return () => clearInterval(interval);
  }, [length]);

  const nextSlide = () => setCurrent((current + 1) % length);
  const prevSlide = () => setCurrent((current - 1 + length) % length);

  return (
    <div className="relative w-full max-w-4xl mt-10 mx-auto overflow-hidden rounded-2xl shadow-lg">
      {images.map((src, index) => (
        <div
          key={index}
          className={` w-full h-30  transition-opacity duration-700 ease-in-out ${
            index === current ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={src}
             size={28}
            
            fill
            className="object-cover"
          />
        </div>
      ))}

      {/* Left Arrow */}
      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black/40 text-white p-2 rounded-full hover:bg-black/70"
      >
        {/* <ChevronLeft size={28} /> */}
      </button>

      {/* Right Arrow */}
      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black/40 text-white p-2 rounded-full hover:bg-black/70"
      >
        {/* <ChevronRight size={28} /> */}
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 w-full flex justify-center gap-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-3 h-3 rounded-full ${
              index === current ? "bg-white" : "bg-white/50"
            }`}
          ></button>
        ))}
      </div>
    </div>
  );
}
