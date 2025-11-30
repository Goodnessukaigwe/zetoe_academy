"use client";

export const dynamic = "force-dynamic";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { logger } from '@/lib/logger';

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

      router.push(`/exam/${data.exam.id}`);
    } catch (err) {
      logger.error('Exam access error', err);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#f2f2f2]">
      {/* FORM CONTAINER */}
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md text-center">
        
        {/* LOGO INSIDE FORM LIKE FIRST PAGE */}
        <div className="flex justify-center mb-4">
          <Image
            src="/zetoe/zetoe-logo.jpeg"
            alt="Zetoe logo"
            width={70}
            height={70}
            className="rounded-full"
          />
        </div>

        {/* TITLE */}
        <h2 className="text-2xl font-bold text-center mb-2 text-[#3a0ca3]">
          Student Exam Access
        </h2>
        <p className="text-center text-gray-600 mb-6">
          Enter your exam key to continue
        </p>

        {/* INPUT FIELD */}
        <div className="space-y-4">

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Exam Key
            </label>
            <input
              type="text"
              placeholder="Enter exam key"
              value={examCode}
              onChange={(e) => setExamCode(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md text-black placeholder-gray-500 bg-white
              focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* ERROR MESSAGE */}
          {error && (
            <p className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-sm">
              {error}
            </p>
          )}

          {/* SUBMIT BUTTON */}
          <button
            onClick={handleVerify}
            className="w-full py-3 rounded-md font-semibold text-white bg-[#3a0ca3] hover:bg-[#1d0555] 
            transition duration-300"
          >
            Continue
          </button>
        </div>

      </div>
    </div>
  );
}

export default ExamAccessPage;
