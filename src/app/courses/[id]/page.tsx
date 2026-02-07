"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Course } from "@/types/database";
import Link from "next/link";
import { ArrowLeft, Clock, DollarSign, BookOpen, CheckCircle } from "lucide-react";
import Header from "@/component/Header";

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await fetch(`/api/courses/${courseId}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to fetch course");
        }

        setCourse(data.course);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchCourse();
    }
  }, [courseId]);

  if (loading) {
    return (
      <div>
        <Header />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-700"></div>
        </div>
      </div>
    );
  }

  if (error || !course) {
  
    return (
      
      <div className="min-h-screen bg-gray-50 flex flex-col items-center
       justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Course Not Found</h1>
          <p className="text-gray-600 mb-6">{error || "The course you're looking for doesn't exist."}</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition"
          >
            <ArrowLeft size={20} />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="bg-gradient-to-r from-blue-700 to-blue-900 text-white py-16">
        <div className="max-w-6xl mx-auto px-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white hover:text-gray-200 mb-6 transition"
          >
            <ArrowLeft size={20} />
            Back to Courses
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{course.name}</h1>
          <p className="text-xl text-gray-200">Professional certification and training program</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Course Info */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                About This Course
              </h2>
              <p className="text-gray-700 leading-relaxed text-lg">
                {course.description ||
                  "This comprehensive professional training program is designed to equip you with the skills and knowledge needed to excel in your field. Our expert instructors provide hands-on training and real-world insights."}
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                What You'll Learn
              </h2>
              <div className="space-y-3">
                {[
                  "Industry-standard practices and methodologies",
                  "Hands-on practical skills and applications",
                  "Real-world project experience",
                  "Professional certification upon completion",
                  "Access to learning resources and materials",
                  "Mentorship from experienced professionals",
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="text-green-600 mt-1 flex-shrink-0" size={20} />
                    <p className="text-gray-700">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-8 sticky top-8">
              <div className="text-center mb-6">
                <p className="text-gray-600 text-sm mb-2">Course Fee</p>
                <p className="text-4xl font-bold text-blue-700">
                  ₦{course.price.toLocaleString()}
                </p>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3 text-gray-700">
                  <Clock className="text-blue-700" size={20} />
                  <div>
                    <p className="font-semibold">Duration</p>
                    <p className="text-sm text-gray-600">{course.duration || "Flexible"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-gray-700">
                  <BookOpen className="text-blue-700" size={20} />
                  <div>
                    <p className="font-semibold">Format</p>
                    <p className="text-sm text-gray-600">Instructor-led training</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-gray-700">
                  <DollarSign className="text-blue-700" size={20} />
                  <div>
                    <p className="font-semibold">Certification</p>
                    <p className="text-sm text-gray-600">Yes, upon completion</p>
                  </div>
                </div>
              </div>

              <Link
                href="/login"
                className="block w-full bg-gradient-to-r from-blue-700 to-blue-900 text-white py-4 rounded-lg font-semibold text-lg hover:from-blue-800 hover:to-blue-950 transition shadow-lg text-center"
              >
                Sign In to View Details
              </Link>

              <p className="text-center text-gray-500 text-sm mt-4">
                Contact admin to enroll in this course
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
