"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";

const StatsCounters: React.FC = () => {
  const stats = [
    { label: "Learners Trained", value: +1000 },
    { label: "Pass Rate %", value: 92 },
    { label: "Partner Institutions", value: 5 },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      {stats.map((s, i) => (
        <div key={s.label} className=" bg-white p-8 rounded-3xl shadow-lg
         hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300
          border border-gray-100 text-center">
          <div className="text-4xl font-black text-indigo-600 group-hover:scale-110 
          transition duration-300">{s.value}{s.label==="Pass Rate %"?"%":""}</div>
          <div className="text-sm text-gray-600 mt-3 font-semibold">{s.label}</div>
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
    <div className="relative bg-gradient-to-br from-emerald-200 to-white p-8 rounded-3xl 
    shadow-lg border border-indigo-100 flex flex-col">
      <div className="flex items-start gap-4 flex-1">
        <div className="text-5xl">⭐</div>
        <div className="flex-1 min-h-[100px]">
          <p className="text-gray-800 italic text-lg leading-relaxed">"{items[index].quote}"</p>
        </div>
      </div>
      <div className="mt-6 flex items-center justify-between gap-4">
        <div className="text-sm">
          <div className="font-bold text-gray-900">{items[index].name}</div>
          <div className="text-indigo-600 font-semibold">{items[index].role}</div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setIndex((i) => (i - 1 + items.length) % items.length)} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-bold">←</button>
          <button onClick={() => setIndex((i) => (i + 1) % items.length)} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-bold">→</button>
        </div>
      </div>
      <div className="mt-4 flex gap-2 justify-center">
        {items.map((_, i) => (
          <div key={i} className={`h-2 rounded-full transition-all duration-300 ${i === index ? 'bg-indigo-600 w-8' : 'bg-gray-300 w-2'}`}></div>
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
    <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
      <h4 className="text-xl font-bold text-gray-900 mb-4">Quick Exam Readiness Quiz</h4>
      {!finished ? (
        <div>
          <div className="text-sm text-indigo-600 mb-3 font-semibold">Question {step + 1} of {questions.length}</div>
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div className="bg-indigo-600 h-2 rounded-full transition-all" style={{width: `${((step + 1) / questions.length) * 100}%`}}></div>
          </div>
          <div className="font-semibold text-gray-900 mb-4">{questions[step].q}</div>
          <div className="grid gap-3">
            {questions[step].opts.map((o, i) => (
              <button key={o} onClick={() => submit(i)} className="text-left px-4 py-3 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition font-medium text-gray-800 hover:text-indigo-700">✓ {o}</button>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center">
          <div className="inline-block text-6xl mb-4">🎉</div>
          <div className="text-4xl font-black text-indigo-600">{score}/{questions.length}</div>
          <div className="mt-4 text-gray-700 leading-relaxed">Great work! This preview shows how our coaching guides study practice and exam readiness.</div>
          <div className="mt-6">
            <Link href="/register" className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg font-bold shadow-lg hover:bg-indigo-700 transition">Join a Programme</Link>
          </div>
        </div>
      )}
    </div>
  );
};

const InteractiveSection: React.FC = () => {
  return (
    <section id="interactive" className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        <h3 className="text-4xl font-black text-center text-gray-900 mb-2">Student Success Stories</h3>
        <p className="text-center text-gray-600 mb-12 text-lg">Real results from learners, 
          corps members, and institutions we've partnered with.</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <StatsCounters />
            <TestimonialsCarousel />
          </div>

          <aside className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100
           h-fit sticky top-16">
            <h4 className="text-2xl font-black text-gray-900 mb-4">Why <br></br> Choose Zeteo</h4>
            <ul className="space-y-4 text-gray-700">
              <li className="flex gap-3">
                <span className="text-2xl">✓</span>
                <span className="font-semibold">Personalized exam-focused mentoring with proven strategies</span>
              </li>
              <li className="flex gap-3">
                <span className="text-2xl">✓</span>
                <span className="font-semibold">Professional development preparing you for workplace success</span>
              </li>
              <li className="flex gap-3">
                <span className="text-2xl">✓</span>
                <span className="font-semibold">Institutional partnerships ensuring quality and standards</span>
              </li>
              <li className="flex gap-3">
                <span className="text-2xl">✓</span>
                <span className="font-semibold">Career readiness and placement support included</span>
              </li>
            </ul>
            <div className="mt-6 pt-6 border-t border-gray-200">
              <Link href="/register" className="block w-full text-center
               bg-indigo-600 text-white py-3 rounded-lg font-bold
                hover:bg-indigo-700 transition">Start Now</Link>
            </div>
          </aside>
        </div>

        <div className="mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-3xl border border-blue-100">
          <h4 className="text-2xl font-black text-gray-900 mb-4">Test Your Readiness</h4>
          <p className="text-gray-700 mb-6">Take our quick quiz to see how exam-ready you are:</p>
          <QuizPreview />
        </div>
      </div>
    </section>
  );
};

export default InteractiveSection;
