import { useEffect, useState } from "react";
import { imageTexts, randomTexts, HeroText } from "../data/hero-image";

const heroImages: string[] = [
 "/HeroImages/12.png",
  "/HeroImages/6.png",
  "/HeroImages/4.png",
    "/HeroImages/3.png",
     "/HeroImages/5.png",
      "/HeroImages/7.png",
       "/HeroImages/6.png",
      "/HeroImages/8.png",
      "/HeroImages/9.png",  
    "/HeroImages/12.png",  
     "/HeroImages/13.png",  
    "/HeroImages/14.png", 
    "/HeroImages/zeto3.png", 
       "/HeroImages/10.png",
        
];

const positions: HeroText["position"][] = ["left", "center", "right"];

export default function HeroSlider() {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState<HeroText>({ title: "", position: "left" });
  const [fade, setFade] = useState(true);
  const [unusedRandomTexts, setUnusedRandomTexts] = useState([...randomTexts]);

  function chooseTextForImage(imageUrl: string): HeroText {
    const fileName = imageUrl.split("/").pop() || "";

    // Use fixed text if exists
    if (imageTexts[fileName]) {
      const fixedText = imageTexts[fileName];
      return {
        ...fixedText,
        position: positions[Math.floor(Math.random() * positions.length)],
      };
    }

    // Random text without repetition
    if (unusedRandomTexts.length > 0) {
      const randomIndex = Math.floor(Math.random() * unusedRandomTexts.length);
      const choice = unusedRandomTexts[randomIndex];
      setUnusedRandomTexts(unusedRandomTexts.filter((_, i) => i !== randomIndex));
      return {
        ...choice,
        position: positions[Math.floor(Math.random() * positions.length)],
      };
    }

    // All used → allow repeats
    const choice = randomTexts[Math.floor(Math.random() * randomTexts.length)];
    return {
      ...choice,
      position: positions[Math.floor(Math.random() * positions.length)],
    };
  }

  useEffect(() => {
    // Initialize first image text
    setText(chooseTextForImage(heroImages[0]));

    // Lightweight auto-slide: advance image every 5s with a short fade
    const slideInterval = 5000;
    const fadeDuration = 500; // keep CSS transition durations in sync

    const iv = setInterval(() => {
      setFade(false);
      // after fade-out, switch image and fade back in
      const t = setTimeout(() => {
        setIndex((prev) => {
          const next = (prev + 1) % heroImages.length;
          setText(chooseTextForImage(heroImages[next]));
          return next;
        });
        setFade(true);
      }, fadeDuration);

      // clear the timeout if interval cleared early
      return () => clearTimeout(t);
    }, slideInterval);

    return () => clearInterval(iv);
  }, []);

  const positionClass =
    text.position === "center"
      ? "text-center left-1/2 -translate-x-1/2"
      : text.position === "right"
      ? "right-8 text-right"
      : "left-8 text-left";

  return (
    <div className="relative w-full md:h-[400px] overflow-hidden">
      {/* IMAGE */}
      <img
        src={heroImages[index]}
        className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-500 ease-in-out ${
          fade ? "opacity-100" : "opacity-0"
        }`}
        alt=""
      />

      {/* GRADIENT OVERLAY */}
      <div className="absolute inset-0 bg-gradient-to-t
       from-black/50 via-black/25 to-transparent" />

      {/* TEXT */}
      {text.title && (
        <div
          className={`absolute bottom-5 text-white p-2 sm:p-2 md:p-8 
            rounded max-w-[80%] sm:max-w-[30%] md:max-w-[130%] ${positionClass} 
            backdrop-blur-none`}
        >
          <h2 className="text-xl sm:text-3xl md:text-5xl 
          lg:text-3xl font-bold leading-snug md:leading-tight">
            {text.title}
          </h2>
          {text.subtitle && (
            <p className="text-sm sm:text-base md:text-lg lg:text-xl mt-2 sm:mt-3">
              {text.subtitle}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
