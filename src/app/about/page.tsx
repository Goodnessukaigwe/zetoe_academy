import Link from "next/link";
import Image from "next/image";

// Example data
const features = [
  { title: "Mentorship", description: "Personalized guidance to help you achieve professional growth.", icon: "🎓" },
  { title: "Professionalism", description: "We emphasize ethics, discipline, and effective communication.", icon: "💼" },
  { title: "Consultancy", description: "Strategic solutions for organisations and individuals looking to excel.", icon: "📊" },
];

const team = [
  { id: 1, name: "MR LAW", role: "Lead Mentor", image: "/about/teams/mr joseph.jpg" },
  { id: 2, name: "MR FAVOUR", role: "Consultant", image: "/about/teams/mr favour.jpg" },
  { id: 3, name: "Miss Peace", role: "Chief Admin", image: "/about/teams/miss peace.jpg" },
  { id: 4, name: "MR JOHN", role: "Consultant", image: "/about/teams/mr john.jpg" },
];

const statistics = [
  { title: "Students Trained", value: "200+" },
  { title: "Courses Offered", value: "20" },
  { title: "Mentors", value: "5" },
  { title: "Projects Completed", value: "60+" },
];

const testimonials = [
  { name: "Jane Doe", role: "Student", text: "Zeteo Citadel Consult helped me gain real-world skills and confidence!" },
  { name: "John Smith", role: "Corporate Executive", text: "Their mentorship program is top-notch. Highly recommended." },
];

const partners = [
  { name: "University of Ibadan (Consulting Unit)", logo: "/about/partners/uni ibadan.png" },
  { name: "Software and Management Professional Institute of Nigeria(SMPIN)",
     logo: "/HeroImages/smpin.jpg" },
  { name: "National Youth Service Corps", logo: "/about/partners/nysc.png" },
];

const activities = [
  { id: 1, image: "/about/activities/1.jpg", description: "Workshop at XYZ venue" },
  { id: 2, image: "/about/activities/2.jpg", description: "Training session for students" },
  { id: 3, image: "/about/activities/3.jpg", description: "Leadership mentorship program" },
];

export default function AboutPage() {
  return (

<div>

{/* REFINED HEADER / NAVIGATION */}

  <div className=" sticky top-0 z-50 bg-white shadow-md flex items-center px-0 py-3 ">
    {/* Logo & Brand */}
      <img src="/zetelog.png" alt="logo" className="h-18 w-18 object-cover" />
      <h1 className="text-2xl font-extrabold flex-1 text-blue-700">
          ZETEO CITADEL CONSULT
      </h1>
    

    {/* Navigation Links */}
    <nav className="flex-1 space-x-9 font-semibold text-gray-800">
      <Link href="/" className="hover:text-[#4a03fc] transition">Home</Link>
      <Link href="/courses/id" className="hover:text-[#4a03fc] transition">Courses</Link>
      <Link href="/about" className="hover:text-[#4a03fc] transition">About</Link>
      <Link href="/contact" className="hover:text-[#4a03fc] transition">Contact</Link>
    </nav>

     {/* Register / Sign In */}
    <div className="hidden md:flex space-x-4">
      <Link
        href="/register"
        className=" text-white bg-[#3a0ca3] hover:bg-[#1d0555] transition 
        duration-300 px-2 py-2 rounded-md " >
        Register
      </Link>
      <Link
        href="/login"
        className="border border-blue-700 text-blue-700 px-2 py-2 rounded-md
         hover:bg-blue-700 hover:text-white transition mr-4"
      >
        Sign In
      </Link>
    </div>

</div>

     <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-20
     mx-auto  space-y-16">

      {/* HEADER */}
      <div>
     <h2 className=" md:text-3xl font-bold text-center text-blue-600 mb-12">ABOUT US</h2>
        <p className="text-black text-justify  max-w-4xl mx-auto leading-relaxed">
          At Zeteo Citadel Consult, professionalism and expertise are at the heart of what we do.
          We provide cutting-edge training, mentorship, and consultancy for students, corps members,
          corporate executives, and organisations seeking skill enhancement and knowledge growth in
          Management and Software Applications.
        </p>
      </div>

      {/* FEATURES */}
      <div className="grid grid-cols-1 mb-20 md:grid-cols-3 gap-8">
        {features.map((feature) => (
          <div key={feature.title} className="bg-white rounded-3xl shadow p-6 text-center">
            <div className="text-6xl mb-4">{feature.icon}</div>
            <h3 className="font-bold text-xl text-black">{feature.title}</h3>
            <p className="text-gray-600 text-sm">{feature.description}</p>
          </div>
        ))}
      </div>

      {/* TEAM SLIDER */}
      <div>
        <h2 className="text-3xl font-bold  text-blue-600 text-center mb-12">Our Team</h2>

        <div className="flex overflow-x-auto gap-6 py-4 
        scrollbar-hide snap-x ">
          {team.map((member) => (
            <div
              key={member.id}
              className="min-w-[260px] snap-start bg-white rounded-br-3xl shadow-lg"
            >
              <Image
                src={member.image}
                width={400}
                height={300}
                alt={member.name}
                className="rounded-tl-3xl object-cover h-60 w-full"
              />
              <div className="p-4">
                <h3 className="font-bold text-1x1 text-black">{member.name}</h3>
                <p className="text-gray-600">{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* STATISTICS */}
      <div>
        <h2 className="text-3xl font-bold text-blue-600 text-center mb-16">Statistics</h2>
        <div className="grid grid-cols-2 mb-20 md:grid-cols-4 gap-8 text-center">
          {statistics.map((stat) => (
            <div key={stat.title} className="bg-blue-50 rounded-3xl p-6 shadow">
              <h3 className="text-4xl font-bold text-blue-400">{stat.value}</h3>
              <p className="text-gray-600 text-sm">{stat.title}</p>
            </div>
          ))}
        </div>
      </div>

      {/* TESTIMONIALS */}
      <div>
        <h2 className="text-3xl font-bold text-blue-600 text-center mb-16">Testimonials</h2>

        <div className="flex overflow-x-auto gap-6 py-4 
        scrollbar-hide snap-x snap-mandatory">
          {testimonials.map((test, i) => (
            <div
              key={i}
              className="min-w-[320px] bg-gray-100 p-6 rounded-3xl shadow snap-start"
            >
              <p className="italic text-gray-700">“{test.text}”</p>
              <div className="mt-4">
                <h3 className="font-bold">{test.name}</h3>
                <p className="text-gray-500 text-sm">{test.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PARTNERS */}
      <div>
        <h2 className="text-3xl font-bold text-blue-600 text-center mb-16">Our Partners</h2>

        <div className=" grid grid-cols-1 md:grid-cols-3 gap-6">
          {partners.map((p, i) => (
            <div key={i} className="bg-white shadow rounded-2xl p-11 
            flex flex-col items-center">
              <Image
                src={p.logo}
                alt={p.name}
                width={100}
                height={50}
                className="object-contain"
              />
              <p className="text-center text-sm mt-2 text-gray-700">{p.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ACTIVITIES SLIDER */}
      <div>
        <h2 className="text-3xl font-bold text-blue-600 text-center mb-16">Activities & Events</h2>

        <div className="flex overflow-x-auto gap-6 py-4 
        scrollbar-hide snap-x snap-mandatory">
          {activities.map((act) => (
            <div
              key={act.id}
              className="min-w-[280px] snap-start bg-white rounded-3xl shadow"
            >
              <Image
                src={act.image}
                width={400}
                height={250}
                alt={act.description}
                className="h-48 w-full object-cover rounded-t-3xl"
              />
              <div className="p-4">
                <p className="text-gray-700 text-sm">{act.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

      {/* footer working */}
      <footer
        id="contact"
        className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-gray-300 py-10 mt-16"
      >
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">
        
        {/* Brand */}
        <div>
          <h2 className="text-25 font-bold text-white mb-3">ZETEO CITADEL CONSULT</h2>
          <p className="text-sm leading-6">
            Partner with us to tackle your unique challenges and unlock your organization’s full potential.
          </p>
          <br />
          <p>
            <span className='text-23 text-white font-bold'>North west zone address:</span> No 6 Sabr Plaza Station, Block B, Room 17 , Kachia Road
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/" className="hover:text-white transition">Home</Link></li>
            <li><Link href="/courses/id" className="hover:text-white transition">Courses</Link></li>
            <li><Link href="/contact" className="hover:text-white transition">Contact</Link></li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Resources</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-white transition">Blog</a></li>
            <li><a href="#" className="hover:text-white transition">FAQs</a></li>
            <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
          </ul>
        </div>

        {/* Social Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Connect With Us</h3>
          <div className="  space-x-8">
            
            <a href="#" className="  flex gap-3 hover:text-white transition">
               <img src="/twister.png" className=' w-7 ' alt="logo" />twitter
            </a>
            <br />
            <a href="#" className="  flex gap-3 hover:text-white transition">
             <img src="/instag.png" className=' w-7 ' alt="logo" /> instagram
            </a>
            <br />
            <a href="#" className=" flex gap-3 hover:text-white transition">
              <img src="/facebook.png" className=' w-7 ' alt="logo" />facebook
            </a>
            <br />
            <a href="#" className=" flex gap-3 hover:text-white transition">
             <img src="/whatsapp.png" className=' w-7 ' alt="logo" />whatsapp
            </a>
          </div>
        </div>

      </div>

      {/* Bottom Section */}
      <div className="mt-10 border-t border-gray-700 pt-6 text-center text-sm text-gray-400">
        <p>
          © {new Date().getFullYear()} <span className="text-white font-semibold">ZETEO CITADEL CONSULT</span>. 
          All rights reserved.
        </p>
      </div>
      </footer>
    
    </div>
  );
}