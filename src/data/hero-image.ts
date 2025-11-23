export interface HeroText {
  title: string;
  subtitle?: string;
  position?: "left" | "center" | "right";
}

// ★★★ IMPORTANT ★★★
// You must manually list the images you want to use.
export const heroImages: string[] = [
  "/HeroImages/toyota suv.jpg",
  "/HeroImages/mm.jpg",
  "/HeroImages/smpin.jpg",
    "/HeroImages/pd.jpg",
     "/HeroImages/tcm.jpg",
      "/HeroImages/wd.jpg",
       "/HeroImages/wed d.jpg",
        "/HeroImages/zeteo(1).jpg",
  // Add more images manually here
];

// Fixed text for some images
export const imageTexts: Record<string, HeroText> = {
  "wd.jpg": {
    title: "Welcome to Zeteo Citadel Consult",
    subtitle: "Professional training and certification",
  },
  "pd.jpg": {
    title: "Expert Mentorship",
    subtitle: "Enhancing skills for corporate success",
  },
  "wed d.jpg": {
    title: "In collaboration with University of Ibadan (Consultancy Unit)",
    subtitle: "Learn and Grow",
  },

  "smpin.jpg": {
    title: "Software and Management professional institute Of Nigeria",
    subtitle: "hhhgui",
  },

};

// Random texts for images without fixed text
export const randomTexts: HeroText[] = [
  { title: "", subtitle: "" },
  { title: "SMPIN", subtitle: "Join our programs today" },
  { title: "Boost Your Skills", subtitle: "Courses designed for growth" },
  { title: "Learn Anywhere", subtitle: "" },
  { title: "Join Our Community", subtitle: "Enhance your knowledge today" },
  { title: "Expert Coaching", subtitle: "Learn from seasoned professionals" },
];
