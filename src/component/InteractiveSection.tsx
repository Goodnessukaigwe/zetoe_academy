"use client";
import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2, Star } from "lucide-react";

const StatsCounters: React.FC = () => {
  const stats = [
    { label: "Learners Trained", value: +1000 },
    { label: "Pass Rate %", value: 92 },
    { label: "Partner Institutions", value: 5 },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      {stats.map((s) => (
        <div key={s.label} className="rounded-lg border border-slate-100 bg-white p-5 shadow-sm">
          <div className="text-3xl font-black text-[#214397]">{s.value}{s.label === "Pass Rate %" ? "%" : "+"}</div>
          <div className="mt-2 text-xs font-semibold text-slate-500">{s.label}</div>
        </div>
      ))}
    </div>
  );
};

const TestimonialsCarousel: React.FC = () => {
  const items = [
    { name: "Aisha Musa", role: "Student - JAMB Prep", quote: "The mentorship transformed how I prepared for exams — I passed with 280 points, my best score yet." },
    { name: "John Okafor", role: "Corps Member", quote: "Practical coaching and workplace skills helped me secure a placement immediately after service." },
    { name: "Dr. Bassey", role: "Institutional Partner", quote: "Zeteo's assessment design raised our exam standards considerably and student outcomes improved by 35%." },
    { name: "Zainab Ahmed", role: "Professional Development", quote: "The soft-skills training gave me confidence for my interviews. I landed my dream job at a top firm." },
    { name: "Chisom Obi", role: "University Student", quote: "The exam strategies taught here are game-changing. My GPA improved from 3.2 to 3.8 in one semester." },
    { name: "Ikechukwu Nwosu", role: "Corp Member", quote: "We partnered with Zeteo for curriculum review. The impact on student performance was immediate and significant." },
    { name: "Fatima Hassan", role: "Graduate Student", quote: "The mentoring sessions were personalized and focused. I completed my thesis on time with excellent marks." },
    { name: "Daniel Mensah", role: "Corp Member", quote: "From mentorship to professional skills training, Zeteo prepared me for life beyond service. Highly recommended." },
    { name: "Florence Ekpenyong", role: "Educator", quote: "I attended their professionalism workshops. My teaching methods have transformed and student engagement doubled." },
    { name: "Ahmed Usman", role: "Business Executive", quote: "We engaged Zeteo for staff assessment design. The insights helped us identify and develop top talent in our organization." },
  ];

  const [index, setIndex] = useState(0);

  return (
    <div className="relative flex flex-col rounded-lg border border-[#dbe6f6] bg-[#e8f1ff] p-6 shadow-sm">
      <div className="flex flex-1 items-start gap-4">
        <Star className="shrink-0 fill-amber-400 text-amber-400" size={20} />
        <div className="flex-1 min-h-[100px]">
          <p className="text-sm italic leading-7 text-slate-700">&quot;{items[index].quote}&quot;</p>
        </div>
      </div>
      <div className="mt-6 flex items-center justify-between gap-4">
          <div className="text-xs">
          <div className="font-bold text-slate-900">{items[index].name}</div>
          <div className="font-semibold text-[#214397]">{items[index].role}</div>
        </div>
        <div className="flex gap-2">
          <button aria-label="Previous testimonial" onClick={() => setIndex((i) => (i - 1 + items.length) % items.length)} className="rounded-full bg-white p-2 text-[#214397] shadow-sm"><ArrowLeft size={14} /></button>
          <button aria-label="Next testimonial" onClick={() => setIndex((i) => (i + 1) % items.length)} className="rounded-full bg-[#214397] p-2 text-white shadow-sm"><ArrowRight size={14} /></button>
        </div>
      </div>
      <div className="mt-4 flex gap-2 justify-center">
        {items.map((_, i) => (
          <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === index ? 'w-6 bg-[#214397]' : 'w-1.5 bg-slate-300'}`}></div>
        ))}
      </div>
    </div>
  );
};

const QuizPreview: React.FC = () => {
  const questions = [
    { q: "What is the recommended study duration per day?", opts: ["30 mins","1-2 hours","5 hours"], a: 1 },
    { q: "Which technique helps long-term recall?", opts: ["Cramming","Spaced repetition","Re-reading only"], a: 1 },
    { q: "Good exam readiness includes:", opts: ["Practice tests","No revision","Only lectures"], a: 0 },
  ];

  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const submit = (choice: number) => {
    if (choice === questions[step].a) setScore((s) => s + 1);
    if (step + 1 < questions.length) setStep((s) => s + 1);
    else setFinished(true);
  };

  return (
    <div className="rounded-lg border border-slate-100 bg-white p-6 shadow-sm">
      <h4 className="mb-4 text-lg font-bold text-slate-900">Quick Exam Readiness Quiz</h4>
      {!finished ? (
        <div>
          <div className="mb-3 text-xs font-semibold text-[#214397]">Question {step + 1} of {questions.length}</div>
          <div className="mb-4 h-1.5 w-full rounded-full bg-slate-200">
            <div className="h-1.5 rounded-full bg-[#214397] transition-all" style={{width: `${((step + 1) / questions.length) * 100}%`}}></div>
          </div>
          <div className="mb-4 font-semibold text-slate-900">{questions[step].q}</div>
          <div className="grid gap-3">
            {questions[step].opts.map((o, i) => (
              <button key={o} onClick={() => submit(i)} className="rounded-md bg-[#f1f5ff] px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-[#e5edff] hover:text-[#214397]"><CheckCircle2 size={14} className="mr-2 inline" />{o}</button>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center">
          <div className="mb-4 text-4xl font-black text-[#214397]">{score}/{questions.length}</div>
          <div className="mt-4 text-gray-700 leading-relaxed">Great work! This preview shows how our coaching guides study practice and exam readiness.</div>
          <div className="mt-6">
            <Link href="/register" className="inline-block rounded-md bg-[#214397] px-6 py-3 font-bold text-white shadow-lg hover:bg-[#173777]">Join a Programme</Link>
          </div>
        </div>
      )}
    </div>
  );
};

const InteractiveSection: React.FC = () => {
  return (
    <section id="success" className="bg-[#f8faff] px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10"><span className="rounded-full bg-[#fff4ce] px-3 py-1 text-[9px] font-bold uppercase tracking-[0.14em] text-amber-700">Proven outcomes</span><h3 className="mt-3 text-3xl font-black text-slate-900">Student Success Stories</h3><p className="mt-2 text-sm text-slate-500">Real results from learners, corps members, and institutions we&apos;ve partnered with.</p></div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.5fr_0.8fr]">
          <div className="space-y-6">
            <StatsCounters />
            <TestimonialsCarousel />
          </div>

          <aside className="h-fit rounded-lg border border-slate-100 bg-white p-6 shadow-sm">
            <h4 className="mb-4 text-2xl font-black text-slate-900">Why Choose Zeteo</h4>
            <ul className="space-y-4 text-sm text-slate-600">
              <li className="flex gap-3">
                <CheckCircle2 className="shrink-0 text-emerald-500" size={16} />
                <span className="font-semibold">Personalized exam-focused mentoring with proven strategies</span>
              </li>
              <li className="flex gap-3">
                <CheckCircle2 className="shrink-0 text-emerald-500" size={16} />
                <span className="font-semibold">Professional development preparing you for workplace success</span>
              </li>
              <li className="flex gap-3">
                <CheckCircle2 className="shrink-0 text-emerald-500" size={16} />
                <span className="font-semibold">Institutional partnerships ensuring quality and standards</span>
              </li>
              <li className="flex gap-3">
                <CheckCircle2 className="shrink-0 text-emerald-500" size={16} />
                <span className="font-semibold">Career readiness and placement support included</span>
              </li>
            </ul>
            <div className="mt-6 pt-6 border-t border-gray-200">
              <Link href="/register" className="block w-full rounded-md bg-[#214397] py-3 text-center font-bold text-white hover:bg-[#173777]">Start Now</Link>
            </div>
          </aside>
        </div>

        <div className="mt-10 rounded-lg border border-[#dbe6f6] bg-[#eef4ff] p-5">
          <h4 className="mb-2 text-xl font-black text-slate-900">Test Your Readiness</h4>
          <p className="mb-5 text-sm text-slate-600">Take our quick quiz to see how exam-ready you are:</p>
          <QuizPreview />
        </div>
      </div>
    </section>
  );
};

export default InteractiveSection;
