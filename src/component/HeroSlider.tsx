import { useEffect, useState } from "react";
import { imageTexts, randomTexts, HeroText } from "../data/hero-image";

const heroImages: string[] = [
  "/HeroImages/toyota suv.jpg",
  "/HeroImages/mm.jpg",
  "/HeroImages/smpin.jpg",
    "/HeroImages/pd.jpg",
     "/HeroImages/tcm.jpg",
      "/HeroImages/wd.jpg",
       "/HeroImages/wed d.jpg",
        "/HeroImages/zeteo(1).jpg",
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

    const interval = setInterval(() => {
      setFade(false);

      setTimeout(() => {
        setIndex(prev => {
          const next = (prev + 1) % heroImages.length;
          setText(chooseTextForImage(heroImages[next]));
          setFade(true);
          return next;
        });
      }, 1500); // fade transition
    }, 8000); // slide duration

    return () => clearInterval(interval);
  }, []);

  const positionClass =
    text.position === "center"
      ? "text-center left-1/2 -translate-x-1/2"
      : text.position === "right"
      ? "right-8 text-right"
      : "left-8 text-left";

  return (
    <div className="relative w-full h-[100px] md:h-[450px] overflow-hidden mt-3
     border-t border-8 border-gray-200">
      {/* IMAGE */}
      <img
        src={heroImages[index]}
        className={`absolute inset-0 w-300 h-full object-cover 
          object-center transition-opacity duration-[2350ms] ${
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
