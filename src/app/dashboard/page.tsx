"use client";
import React, { useEffect, useState } from "react";

const Page = () => {
  const [student, setStudent] = useState<any>(null);
  const [payment, setPayment] = useState<any>(null);
  const [exams, setExams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        
        const userRes = await fetch("/api/auth/me", { cache: "no-store" });
        const userData = await userRes.json();

        if (!userRes.ok || !userData?.profile) {
          throw new Error(userData.error || "User not authenticated");
        }

        const profile = userData.profile;
        setStudent(profile);


         const [paymentRes, examsRes] = await Promise.all([
          fetch("/api/payment/student_id",profile.user_id),
          fetch("/api/exams/student_id",profile.user_id),
       ]);

        const paymentData = await paymentRes.json();
        const examsData = await examsRes.json();

        setPayment(paymentData);
        setExams(examsData);
      } catch (error) {
        console.error("Dashboard fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen text-[#3a0ca3] font-bold text-xl">
        Loading dashboard...
      </div>
    );

  if (!student)
    return (
      <div className="flex justify-center items-center min-h-screen text-red-600 font-semibold">
        Unable to load dashboard. Please log in again.
      </div>
    );

  return (
    <div className="min-h-screen bg-[#f2f2f2] px-6 py-10 font-['Roboto_Condensed']">
      <h2 className="text-3xl font-bold mb-4 text-[#3a0ca3]">
        Welcome, {student.name} 👋
      </h2>
      <p className="text-gray-700 mb-8">
        Here you can view your profile, payment status, courses, and available exams.
      </p>

      <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
       
        <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition duration-300">
          <h3 className="font-semibold mb-4 text-xl text-[#3a0ca3] text-center">
            Profile Info
          </h3>
          <div className="space-y-2 text-gray-800 text-center">
            <p className="text-lg font-bold">{student.name}</p>
            <p className="text-sm">{student.email}</p>
            <p className="text-sm italic">
              {student.course?.name || "No course assigned"}
            </p>
          </div>
        </div>

        
        <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition duration-300">
          <h3 className="font-semibold mb-3 text-[#3a0ca3] text-lg">
            Payment Status
          </h3>
          <span
            className={`px-4 py-1 rounded-full text-sm font-bold ${
              payment?.status === "Paid"
                ? "bg-green-600 text-white"
                : "bg-red-600 text-white"
            
                
            }`}>
            {payment?.status || "Unpaid"} 
          </span>
        </div>

        
        <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition duration-300">
          <h3 className="font-semibold mb-3 text-[#3a0ca3] text-lg">Exams</h3>
          <ul className="list-disc ml-5 text-gray-800">
            {exams.length > 0 ? (
              exams.map((exam, i) => <li key={i}>{exam.title}</li>)
            ) : (
              <li>No exams available</li>
            )}
          </ul>
        </div>

        
        <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition duration-300">
          <h3 className="font-semibold mb-3 text-[#3a0ca3] text-lg">Courses</h3>
          <ul className="list-disc ml-5 text-gray-800">
            {student.course ? (
              <li>{student.course.name}</li>
            ) : (
              <li>No course found</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  )
};

export default Page;