export interface HeroText {
  title: string;
  subtitle?: string;
  position?: "left" | "center" | "right";
}

// ★★★ IMPORTANT ★★★
// You must manually list the images you want to use.
export const heroImages: string[] = [
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
        
  // Add more images manually here
];

// Fixed text for some images

export const imageTexts: Record<string, HeroText> = {
  "zeto3.png": {
    title: "",
    subtitle: "",
  },
  "10.png": {
    title: "",
    subtitle: "",
  },
  "5.png": {
    title: "",
    subtitle: "",
  },

  "8.png": {
    title: "",
    subtitle: "",
  },

};

// Random texts for images without fixed text
export const randomTexts: HeroText[] = [
  { title: "", subtitle: "" },
  { title: "", subtitle: "" },
  { title: "", subtitle: "" },
  { title: "", subtitle: "" },
  { title: "", subtitle: "" },
  { title: "", subtitle: "" },
];
