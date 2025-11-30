import Link from "next/link";
import Image from "next/image";
import Header from "@/component/Header";

/* ================= DATA ================= */

const features = [
  { title: "Mentorship", description: "Personalized guidance to help you grow.", icon: "🎓" },
  { title: "Professionalism", description: "Ethics, discipline & excellence.", icon: "💼" },
  { title: "Consultancy", description: "Strategic solutions for individuals & organisations.", icon: "📊" },
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
  { name: "Jane Doe", role: "Student", text: "Zeteo Citadel Consult helped me gain confidence!" },
  { name: "John Smith", role: "Corporate Executive", text: "Outstanding mentorship program." },
];

const partners = [
  { name: "University of Ibadan (Consulting Unit)", logo: "/about/partners/uni ibadan.png" },
  { name: "SMPIN", logo: "/HeroImages/smpin.png" },
  { name: "NYSC", logo: "/about/partners/nysc.png" },
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
        {/* ABOUT TEXT */}
        <section className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-blue-600">About Us</h2>
          <p className="text-sm sm:text-base leading-relaxed">
            We deliver professional training, mentorship, and consultancy for
            students, NYSC members, executives, and organisations.
          </p>
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
        <section>
          <h2 className="text-2xl font-bold text-center text-blue-600 mb-8">Our Team</h2>
          <div className="flex gap-6 overflow-x-auto snap-x">
            {team.map((m) => (
              <div key={m.id} className="min-w-[240px] snap-start bg-white rounded-2xl shadow">
                <Image src={m.image} alt={m.name} width={400} height={300} className="h-56 w-full object-cover rounded-t-2xl" />
                <div className="p-4">
                  <h3 className="font-bold">{m.name}</h3>
                  <p className="text-sm text-gray-600">{m.role}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* STATISTICS */}
        <section className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {statistics.map((s) => (
            <div key={s.title} className="bg-blue-50 p-6 rounded-2xl text-center">
              <h3 className="text-3xl font-bold text-blue-600">{s.value}</h3>
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
      </main>
    </div>
  );
}
