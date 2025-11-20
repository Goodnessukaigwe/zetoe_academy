"use client";

export const dynamic = "force-dynamic";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

function ExamAccessPage() {
  const [examCode, setExamCode] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleVerify = async () => {
    setError("");

    if (!examCode.trim()) {
      setError("Please enter your exam key.");
      return;
    }

    try {
      const res = await fetch("/api/exams/access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: examCode.toUpperCase() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Invalid or expired exam key.");
        return;
      }

      // Redirect to the exam page
      router.push(`/exam/${data.exam.id}`);
    } catch (err) {
      console.error('Exam access error:', err);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f2f2f2]">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-4 text-[#3a0ca3] font-['Open_Sans']">
        <span className="text-sm">🌐 English</span>

        {/* <h1 className="text-2xl font-bold flex items-center gap-2">
          <span className="text-[#3a0ca3]">exam.</span>
          <span className="text-black">zetoe</span>
        </h1> */}
        

        <button className="border-2 border-[#3a0ca3] rounded-full p-1">
          ⏻
        </button>
      </nav>

      <div className="flex justify-center mb-4">
          <Image
            src="/zetoe/zetoe-logo.jpeg" // Make sure the image is in the public folder for Next.js
            alt="Zetoe logo"
            width={60}
            height={60}
            className="rounded-full"
          />
        </div>

      {/* Main Content */}
      <div className="flex-grow flex items-center justify-center">
        <div className="bg-white shadow-lg rounded-2xl p-10 w-[90%] max-w-md text-center">
          <h2 className="flex items-center justify-center text-xl font-semibold mb-4 text-[#3a0ca3] font-['Roboto_Condensed']">
            🎓 Student
          </h2>

          <div className="flex rounded-full border-2 border-[#3a0ca3] overflow-hidden mb-3">
            <input
              type="text"
              placeholder="Enter exam key"
              value={examCode}
              onChange={(e) => setExamCode(e.target.value)}
              className="flex-grow px-4 py-2 outline-none font-['Roboto_Condensed']"
            />
            <button
              onClick={handleVerify}
              className="bg-[#3a0ca3] text-white px-6 font-['Times_New_Roman']"
            >
              Next
            </button>
          </div>

          {error && (
            <p className="text-red-500 text-sm mb-2 font-['Roboto_Condensed']">
              {error}
            </p>
          )}

          <p className="text-gray-500 text-sm mt-2 font-['Roboto_Condensed']">
            🛡️ Read more about our cheat-prevention systems
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center text-gray-500 py-4 text-sm font-['Open_Sans']">
        zetoeacademy.com
      </footer>
    </div>
  );
}

export default ExamAccessPage;
