"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, BriefcaseBusiness, CheckCircle2, Landmark, MapPin } from "lucide-react";
import Header from "@/component/Header";
import Footer from "@/component/Footer";
import InteractiveSection from "@/component/InteractiveSection";

const locations = ["Kaduna", "Kano", "Niger", "Lagos", "Abuja", "Jos", "Ebonyi"];

const services = [
  { icon: BookOpen, eyebrow: "Module 01", title: "Mentorship", description: "Personalized coaching, exam strategies and structured study plans tailored to learner goals.", bullets: ["One-on-one diagnostic sessions", "Tailored revision timetable", "Career-focused support"] },
  { icon: BriefcaseBusiness, eyebrow: "Module 02", title: "Professionalism", description: "Soft-skills development, CV clinics and workplace readiness for early-career professionals.", bullets: ["ATS resume re-engineering", "Executive communication mastery", "Corporate workplace readiness"] },
  { icon: Landmark, eyebrow: "Module 03", title: "Consulting", description: "Curriculum support, assessment design and institutional training programs.", bullets: ["Accreditation support", "Custom CBT exam architecture", "Organizational training"] },
];

const partners = [
  { name: "University of Ibadan", detail: "Consulting Unit", image: "/ibadanlog.png", color: "text-[#214397]" },
  { name: "Software and Management Professional Institute of Nigeria", detail: "Strategic Management Institute", image: "/HeroImages/smpin.png", color: "text-[#087eaf]" },
  { name: "National Youth Service Corps", detail: "NYSC", image: "/nysc.png", color: "text-emerald-600" },
];

export default function Page() {
  return (
    <div className="min-h-screen bg-[#f8faff] text-slate-900">
      <Header />
      <main>
        <section className="overflow-hidden bg-gradient-to-br from-[#f2f6ff] via-white to-[#e6f3ff]">
          <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_0.9fr] lg:px-8 lg:py-16">
            <div>
              <span className="inline-flex rounded-full bg-[#e1ebff] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#214397]">Empowering education & professional development</span>
              <h1 className="mt-5 max-w-2xl text-4xl font-black leading-[1.05] tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">Elevate Exam Readiness. <span className="text-[#214397]">Accelerate Careers.</span></h1>
              <p className="mt-5 max-w-xl text-base leading-7 text-slate-600">We provide personalized mentorship, professional development and institutional consulting tailored for learners, corps members and organizations preparing for exams and assessments.</p>
              <div className="mt-10 border-t border-slate-200 pt-5"><p className="text-[9px] font-bold uppercase tracking-[0.14em] text-slate-500">Trusted by leading bodies across Nigeria</p><div className="mt-3 flex flex-wrap gap-4 text-xs font-semibold text-slate-600"><span>University of Ibadan</span><span>SMPIN Nigeria</span><span>NYSC SAED</span></div></div>
            </div>
            <div className="relative mx-auto w-full max-w-md lg:justify-self-end"><div className="absolute -inset-5 rounded-full bg-[#cfe7ff] opacity-60 blur-3xl" /><div className="relative overflow-hidden rounded-xl border-8 border-white bg-white shadow-2xl"><img src="/HeroImages/12.png" alt="Learners celebrating their completed training" className="h-[340px] w-full object-cover sm:h-[420px]" /><div className="absolute inset-x-4 bottom-4 flex items-center justify-between rounded-lg bg-white/95 p-3 shadow-lg backdrop-blur-sm"><div><p className="text-xl font-black text-[#214397]">1,000+</p><p className="text-[10px] text-slate-500">Learners Trained</p></div><div className="h-8 w-px bg-slate-200" /><div><p className="text-xl font-black text-emerald-600">92%</p><p className="text-[10px] text-slate-500">Pass Rate</p></div></div></div></div>
          </div>
        </section>

        <section className="border-y border-[#dbe6f6] bg-[#eef4ff]"><div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8"><div className="flex items-center gap-3"><MapPin size={17} className="text-[#214397]" /><div><p className="text-[9px] font-bold uppercase tracking-[0.14em] text-[#214397]">National footprint</p><p className="text-xs text-slate-600">Our locations</p></div></div><div className="flex flex-wrap gap-2">{locations.map((location) => <span key={location} className="rounded bg-white px-3 py-1 text-[10px] font-semibold text-slate-600 shadow-sm">{location}</span>)}</div></div></section>

        <section id="services" className="bg-[#f8faff] px-4 py-16 sm:px-6 lg:px-8"><div className="mx-auto max-w-7xl"><div className="mx-auto max-w-xl text-center"><span className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#214397]">Comprehensive pathways</span><h2 className="mt-2 text-3xl font-black tracking-tight text-slate-900">Our Services</h2><p className="mt-3 text-sm text-slate-500">Elite-sized programs and institutional support that focus on measurable results.</p></div><div className="mt-10 grid gap-5 md:grid-cols-3">{services.map(({ icon: Icon, eyebrow, title, description, bullets }) => <article key={title} className="rounded-lg border border-slate-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"><div className="flex h-10 w-10 items-center justify-center rounded-md bg-[#e5edff] text-[#214397]"><Icon size={19} /></div><p className="mt-5 text-[9px] font-bold uppercase tracking-[0.15em] text-[#214397]">{eyebrow}</p><h3 className="mt-1 text-lg font-bold">{title}</h3><p className="mt-3 text-sm leading-6 text-slate-600">{description}</p><ul className="mt-4 space-y-2 text-xs text-slate-500">{bullets.map((bullet) => <li key={bullet} className="flex gap-2"><CheckCircle2 size={13} className="mt-0.5 shrink-0 text-emerald-500" />{bullet}</li>)}</ul><Link href="/contact" className="mt-6 inline-flex items-center gap-1 text-[10px] font-bold text-[#214397]">Explore {title} <ArrowRight size={12} /></Link></article>)}</div></div></section>

        <section className="bg-white px-4 py-16 sm:px-6 lg:px-8"><div className="mx-auto max-w-7xl"><div className="text-center"><h2 className="text-2xl font-black">Trusted by Top Institutions</h2><p className="mt-2 text-xs text-slate-500">We collaborate with leading academic and professional bodies to maintain quality standards.</p></div><div className="mt-9 grid gap-5 md:grid-cols-3">{partners.map((partner) => <div key={partner.name} className="flex min-h-36 flex-col items-center justify-center rounded-lg bg-[#eef4ff] p-6 text-center"><div className="flex h-11 w-11 items-center justify-center rounded-lg bg-white p-2"><img src={partner.image} alt="" className="h-full w-full object-contain" /></div><h3 className={`mt-3 text-sm font-bold ${partner.color}`}>{partner.name}</h3><p className="mt-1 text-[10px] text-slate-500">{partner.detail}</p></div>)}</div></div></section>

        <InteractiveSection />

        <section id="readiness" className="bg-[#edf4ff] px-4 py-16 sm:px-6 lg:px-8"><div className="mx-auto max-w-2xl rounded-xl bg-white p-6 shadow-lg sm:p-8"><div className="text-center"><span className="text-[9px] font-bold uppercase tracking-[0.14em] text-[#087eaf]">Get assessment tool</span><h2 className="mt-2 text-2xl font-black">Test Your Readiness</h2><p className="mt-2 text-xs text-slate-500">Take our quick quiz to see how exam-ready you are.</p></div><div className="mt-6 rounded-lg bg-[#f1f5ff] p-5"><div className="flex items-center justify-between"><h3 className="text-sm font-bold">Quick Exam Readiness Quiz</h3><span className="rounded bg-white px-2 py-1 text-[9px] font-semibold text-slate-500">Real-time diagnostic</span></div><p className="mt-2 text-xs text-slate-500">Use the readiness check in the success stories section to begin.</p><Link href="#success" className="mt-4 inline-flex items-center gap-2 rounded-md bg-[#214397] px-4 py-2 text-xs font-bold text-white">Start quiz <ArrowRight size={13} /></Link></div></div></section>

        <section className="bg-[#f8faff] px-4 py-16 sm:px-6 lg:px-8"><div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[0.8fr_1.2fr]"><div className="overflow-hidden rounded-lg shadow-lg"><img src="/mrlaw.jpg" alt="Mr. Akor Lawrence speaking at an event" className="h-80 w-full object-cover sm:h-[390px]" /></div><div><span className="text-[9px] font-bold uppercase tracking-[0.14em] text-[#214397]">Corporate & institutional partner</span><h2 className="mt-2 text-3xl font-black">ABOUT US</h2><p className="mt-4 text-sm leading-7 text-slate-600">The role of professionalism is key for effective and efficient work delivery. As a 21st-century organisation, we understand the dynamics of the time and the ever-changing world.</p><p className="mt-3 text-sm leading-7 text-slate-600">We have seasoned professionals and experts who are passionate about knowledge delivery alongside coaching, mentorship, and consultancy.</p><div className="mt-5 flex flex-wrap gap-2"><span className="rounded bg-[#e5edff] px-3 py-1 text-[10px] font-bold text-[#214397]">Mentorship</span><span className="rounded bg-[#e5edff] px-3 py-1 text-[10px] font-bold text-[#214397]">Professionalism</span><span className="rounded bg-[#e5edff] px-3 py-1 text-[10px] font-bold text-[#214397]">Consultancy</span></div><Link href="/about" className="mt-6 inline-flex items-center gap-2 rounded-md bg-[#214397] px-4 py-2.5 text-xs font-bold text-white">Read More <ArrowRight size={13} /></Link></div></div></section>

        <section className="bg-gradient-to-r from-[#173777] to-[#087eaf] px-4 py-14 text-white sm:px-6 lg:px-8"><div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 md:flex-row md:items-center"><div><h2 className="text-3xl font-black">Ready to Transform Results?</h2><p className="mt-2 text-sm text-blue-100">Start a program, request institutional support, or connect with our team today.</p></div><Link href="/contact" className="inline-flex items-center gap-2 rounded-md bg-white px-5 py-3 text-xs font-bold text-[#214397]">Contact Sales <ArrowRight size={14} /></Link></div></section>
      </main>
      <Footer />
    </div>
  );
}