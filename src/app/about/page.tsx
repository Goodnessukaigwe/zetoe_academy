import Link from "next/link";
import Image from "next/image";
import Header from "@/component/Header";
import ImageModal from "@/components/ImageModal";
import TeamMemberModal from "@/components/TeamMemberModal";
import TeamSection from "@/components/TeamSection";
import CountUpStats from "@/components/CountUpStats";

/* ================= DATA ================= */

const features = [
  { title: "Mentorship", description: "Personalized guidance to help you grow.", icon: "🎓" },
  { title: "Professionalism", description: "Ethics, discipline & excellence.", icon: "💼" },
  { title: "Consultancy", description: "Strategic solutions for individuals & organisations.", icon: "📊" },
];

const team = [

{
  id: 1,
  name: "mr. Akor U. Lawrence",
  role: "Chief Executive Officer",
  image: "/mrlaw.jpg",
  bio: "Akor U. Lawrence, FMSMPIN, MNIM, CPM, CHRM, ACA, inview is the Chief Executive Officer of Zeteo Citadel Consult, an affiliate of the University of Ibadan's Consultancy Unit and one of Africa's leading consulting firms, specializing in professional courses in management training and information communication technology (ICT). He holds a Bachelor's degree in Accounting and is a post graduate student of the prestigious Nigerian Defence Academy in Kaduna State. He is also a part-time lecturer at Kaduna State University (KASU) and co-founder of the Software and Management Professional Institute of Nigeria.\n\nHe is also a key facilitator with the NYSC Skill Acquisition and Entrepreneurship Development in FCT and several States in Nigeria.\n\nAs a transformation catalyst, public speaker, project manager, and human development expert, he is driven by his passion to impact and influence the younger generation. He has mentored numerous youths, spoken to over a million Nigerian youths, and addressed corporate executives on various recognized platforms. Through his pioneering efforts, he has established capacity-building workshops, seminars, and boot camps designed to equip 21st-century graduates for the corporate world and the ever-evolving trends and innovations.\n\nAkor Lawrence is a renowned author, with several books to his credit, including the highly demanding \"Soaring in the Nigeria Economy\" – a must-read for job applicants, corps members and business owners seeking to thrive in the Nigerian market.\n\nAdditionally, as the founder of the Software and Management Professional Institute of Nigeria, he has assembled a team of seasoned professionals as co-founders, further solidifying his commitment to developing the next generation of leaders.\n\nAs a committed preacher of the gospel, Lawrence facilitates younger generations' growth through Bible study groups, empowering them towards purposeful living.\n\nA contact with Lawrence is life transforming, impactful and contagious. You can always count on him for strategic consulting services, professional training and development, inspirational speaking engagements, mentorship and coaching.",
  expertise: ["Client Relations", "Project Management", "Consulting", "Corporate Training"],
},

{
  id: 2,
  name: "mr. Adonis Ibira",
  role: "Executive Director: North West",
  image: "/mr.adonis.jpg",
  bio: "Adonis Ibira, MNSE, ASMPIN, is a multifaceted professional with a strong background in engineering, project management, and data analysis. He drives business growth and delivers strategic solutions to clients. With a deep understanding of technical principles and practices, he possesses a unique blend of technical and analytical skills. He effectively plans, executes, and delivers projects on time and within budget, leveraging his professional qualification in project management. As a skilled data analyst, he extracts valuable insights from complex data sets, approaching problems from multiple angles. His expertise spans project management, data analysis, and engineering, making him a versatile professional capable of driving success in various sectors. Notably, he has interacted with over 10,000 Corps members, serving as a key/resource person with the National Youth Service Corps (NYSC) scheme during job awareness creation lectures. As the Director of Zeteo Citadel Consult, Zaria, Kaduna, he leads high-performing teams and stays up-to-date with industry trends and best practices. With a strong passion for innovation and continuous learning, he delivers strategic solutions to clients and drives business growth.",
    expertise: ["Career Development", "Professional Training", "Leadership Coaching", "Student Mentorship"],
  },
  {
    id: 3,
    name: "mr. Audam Joseph Yaba A.C.A",
    role: "Co-founder",
    image: "/audam_joseph.jpg",
bio: "Mr. Audam Joseph Yaba ACA is a Chartered Accountant with practical experiences with reputable audit firms in northern Nigeria, he doubles as a management and financial consultant with years of experience in the industry. He's an auditor with the Kogi State government and is highly regarded for his expertise and strategic advice and guidance to both the government and businesses.\n\nMr. Audam Joseph Yaba ACA is currently the head of finance Ritchkliniks Development Centre an international consulting organization based in the United kingdom and also the head of finance and management Richard George Foundation in Abuja/Uk.\n\nMr. Audam Joseph Yaba ACA bagged Certificates in Management courses from the prestigious university of Ibadan.\n\nMr Audam Joseph Yaba ACA belongs to the following Professional Bodies:  \n1. Institute of Chartered Accountants of Nigeria ICAN\n2. Nigeria institute of Management NIM\n3. Chartered institute of taxation of Nigeria CITN\n4. Professional institute of Human Resource managers.\n5. Professional institute of project managers.\n6. Software and Management Professional Institute of Nigeria.\nApart from his consultancy services, Joseph is also an active public speaker, personal development advocate, trainer with Zeteo Citadel Consult, SAED department of the NYSC and educator.",
    expertise: ["Strategic Consulting", "Business Development", "Organizational Strategy", "Process Optimization"],
  },
  {
    id: 4,
    name: "Miss Peace",
    role: "Chief Admin",
    image: "/about/teams/miss peace.jpg",
    bio: "As Chief Administrator, Miss Peace ensures smooth operations across all departments. Her meticulous attention to detail and excellent organizational skills have been instrumental in maintaining the high standards of service delivery at Zetoe Citadel Consult.",
    expertise: ["Administrative Management", "Operations", "Stakeholder Relations", "Program Coordination"],
  },
  {
    id: 5,
    name: "mr. Obademi Favour Oluwaseun",
    role: "Executive Director: North Central",
    image: "/mrfavour22.jpeg",
bio: "Obademi Favour Oluwaseun, CPM, CHRM, AMSMPIN is a purpose-driven individual with a strong background in capacity building as well as academic research. He believes in the capacity that a growing individual is a transforming individual. He is a graduate of the prestigious Federal University of Technology, Minna.\n\nHe is a project manager who has strong background knowledge in data analytical tools as well as problem-solving skills. He is also a trained HIV/AIDS Testing Counsellor with a few achievements to his name. Favour is a dynamic and results-driven trainer with experience in designing and delivering professional courses, workshops, and training programs. He has a proven track record of enhancing skills and knowledge of professionals across various industries. He is also a trainer with the National Youth Service Corps (NYSC). He has expertise in the following skills: Professional training and development, Human Resources Management, Project Management, Leadership development, Team building and collaboration, Communication and presentation skills, Data analytics skills and Inventory software installation and training. He is the Executive Director of Zeteo Citadel Consult, Minna, North Central Zone of Nigeria. As a seasoned consultant, he has spoken to about 6,000 Corps members over the years and he is still consistently doing that.",
    expertise: ["Client Relations", "Project Management", "Consulting", "Corporate Training"],
  },
  
];

const statistics = [
  { title: "Students Trained", value: 1100, suffix: "+" },
  { title: "Courses Offered", value: 120, suffix: "" },
  { title: "Mentors", value: 20, suffix: "" },
  { title: "Projects Completed", value: 160, suffix: "+" },
];

const testimonials = [
  { name: "Jane Doe", role: "Student", text: "Zeteo Citadel Consult helped me gain confidence!" },
  { name: "John Smith", role: "Corporate Executive", text: "Outstanding mentorship program." },
];

const partners = [
  { name: "University of Ibadan (Consulting Unit)", logo: "/about/partners/uni ibadan.png" },
  { name: "Software and Management Professional Institute of Nigeria", logo: "/HeroImages/smpin.png" },
  { name: " National Youth Service Corps", logo: "/about/partners/nysc.png" },
];

const activities = [
  { id: 1, image: "/about/activities/1.jpg", description: "Workshop session" },
  { id: 2, image: "/about/activities/2.jpg", description: "Student training" },
  { id: 3, image: "/about/activities/3.jpg", description: "Leadership program" },
];

/* ================= PAGE ================= */

export default function AboutPage() {
  return (
    <div className="overflow-x-hidden bg-gray-50">
      <Header />

      {/* ================= CONTENT ================= */}
      <main className="py-14 px-4 sm:px-6 lg:px-20 space-y-20">
        {/* ABOUT SECTION WITH IMAGE */}
        <section className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Image */}
            <div className="flex justify-center">
              <ImageModal
                src="/zetelog.png"
                alt="Zetoe Citadel Consult Team"
                width={400}
                height={400}
                className="w-full max-w-md h-auto"
              />
            </div>

            {/* About Text */}
            <div className="space-y-6">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-blue-600">About Us</h2>
              <p className="text-sm sm:text-base leading-relaxed text-gray-700">
                Zetoe Citadel Consult is a leading educational and consulting organization dedicated to 
                empowering individuals and institutions through world-class training, mentorship, and 
                strategic consultancy services.
              </p>
              <p className="text-sm sm:text-base leading-relaxed text-gray-700">
                We deliver professional training, mentorship, and consultancy for students, NYSC members, 
                executives, and organisations. Our team of experienced mentors and consultants is committed 
                to fostering excellence, professionalism, and continuous growth in every engagement.
              </p>
              <div className="pt-4">
                <p className="text-sm text-gray-600 italic">
                  💡 <span className="font-semibold">Tip:</span> Click on the image to enlarge and get a better view!
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {features.map((f) => (
            <div key={f.title} className="bg-white rounded-3xl shadow p-6 text-center">
              <div className="text-5xl mb-4">{f.icon}</div>
              <h3 className="font-bold text-lg">{f.title}</h3>
              <p className="text-sm text-gray-600">{f.description}</p>
            </div>
          ))}
        </section>

        {/* TEAM */}
        <TeamSection team={team} />

        {/* STATISTICS */}
        <section className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {statistics.map((s) => (
            <div key={s.title} className="bg-blue-50 p-6 rounded-2xl text-center">
              <h3 className="text-3xl font-bold text-blue-600">
                <CountUpStats targetValue={s.value} suffix={s.suffix} />
              </h3>
              <p className="text-sm">{s.title}</p>
            </div>
          ))}
        </section>

        {/* PARTNERS */}
        <section>
          <h2 className="text-2xl font-bold text-center text-blue-600 mb-8">Our Partners</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {partners.map((p) => (
              <div key={p.name} className="bg-white p-8 rounded-2xl shadow text-center">
                <Image src={p.logo} alt={p.name} width={120} height={60} className="mx-auto object-contain" />
                <p className="text-sm mt-3">{p.name}</p>
              </div>
            ))}
          </div>
    </section>

    {/* ================= FOOTER ================= */}
      {/* <footer className="bg-gray-900 text-gray-300 py-2">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
          <div>
            <h3 className="font-bold text-white mb-3">ZETEO CITADEL CONSULT</h3>
            <p className="text-sm">
              No 6 Sabr Plaza Station, Kachia Road
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/">Home</Link></li>
              <li><Link href="/about">About</Link></li>
              <li><Link href="/courses">Courses</Link></li>
              <li><Link href="/contact">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li>Blog</li>
              <li>FAQs</li>
              <li>Privacy Policy</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3">Social</h4>
            <div className="space-y-3">
              {["twister", "instag", "facebook", "whatsapp"].map((icon) => (
                <Image
                  key={icon}
                  src={`/${icon}.png`}
                  alt={icon}
                  width={24}
                  height={24}
                />
              ))}
            </div>
          </div>
        </div>

        <p className="text-center text-sm mt-10 text-gray-400">
          © {new Date().getFullYear()} ZETEO CITADEL CONSULT
        </p>
      </footer> */}
      </main>
    </div>
  );
}
