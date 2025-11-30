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
  const [showEnrollForm, setShowEnrollForm] = useState(false);

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

      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2
         border-blue-700"></div>
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
            className="inline-flex items-center gap-2 text-white
             hover:text-gray-200 mb-6 transition"
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

              <button
                onClick={() => setShowEnrollForm(true)}
                className="w-full bg-gradient-to-r from-blue-700 to-blue-900 text-white py-4 rounded-lg font-semibold text-lg hover:from-blue-800 hover:to-blue-950 transition shadow-lg"
              >
                Enroll Now
              </button>

              <p className="text-center text-gray-500 text-sm mt-4">
                Limited seats available
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Enrollment Modal */}
      {showEnrollForm && (
        <EnrollmentModal
          course={course}
          onClose={() => setShowEnrollForm(false)}
        />
      )}
    </div>
  );
}

function EnrollmentModal({
  course,
  onClose,
}: {
  course: Course;
  onClose: () => void;
}) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    // Simulate submission - in real app, send to API or email service
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setSuccess(true);
    setTimeout(() => {
      router.push("/register");
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-8">
        {success ? (
          <div className="text-center">
            <CheckCircle className="text-green-600 mx-auto mb-4" size={64} />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Enrollment Request Sent!
            </h2>
            <p className="text-gray-600 mb-4">
              We'll contact you shortly with registration details.
            </p>
            <p className="text-sm text-gray-500">
              Redirecting to registration page...
            </p>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Enroll in {course.name}
            </h2>
            <p className="text-gray-600 mb-6">
              Fill out the form below and we'll contact you with enrollment details.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="+234 XXX XXX XXXX"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={submitting}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition disabled:opacity-50"
                >
                  {submitting ? "Submitting..." : "Submit"}
                </button>
              </div>
            </form>
          </>
        )}
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
               <li><a href="#" className="hover:text-white transition">Home</a></li>
            <li><a href="#" className="hover:text-white transition">Course</a></li>
            <li><a href="#" className="hover:text-white transition">About</a></li>
         
            
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
