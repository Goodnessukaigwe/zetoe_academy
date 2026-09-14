"use client";

import { useEffect, useState } from "react";

const heroImages = Array.from({ length: 14 }, (_, index) => `/HeroImages/${index + 1}.png`);
const transitionDuration = 1400;
const slideInterval = 5000;

export default function HeroSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isAnimating) return;

    const timeout = window.setTimeout(() => {
      setNextIndex((currentIndex + 1) % heroImages.length);
      setIsAnimating(true);
    }, slideInterval);

    return () => window.clearTimeout(timeout);
  }, [currentIndex, isAnimating]);

  useEffect(() => {
    if (!isAnimating) return;

    const timeout = window.setTimeout(() => {
      setCurrentIndex(nextIndex);
      setIsAnimating(false);
    }, transitionDuration);

    return () => window.clearTimeout(timeout);
  }, [isAnimating, nextIndex]);

  return (
    <div className="relative h-85 w-full overflow-hidden bg-slate-100 sm:h-105" aria-label="Zeteo training and graduation highlights">
      <div className={`flex h-full w-[200%] ${isAnimating ? "-translate-x-1/2 transition-transform duration-1400 ease-in-out" : "translate-x-0 transition-none"}`}>
        <img src={heroImages[currentIndex]} alt="Zeteo learners and graduates" className="h-full w-1/2 shrink-0 object-cover object-center" />
        <img src={heroImages[nextIndex]} alt="" aria-hidden="true" className="h-full w-1/2 shrink-0 object-cover object-center" />
      </div>
    </div>
  );
}