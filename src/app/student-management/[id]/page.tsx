"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  CheckCircle2,
  Mail,
  Phone,
  Plus,
  Save,
  User,
} from "lucide-react";
import AdminShell from "@/component/AdminShell";
import { Course } from "@/types/database";
import { PaymentStatus } from "@/types/enrollment";
import { logger } from "@/lib/logger";

interface EnrollmentCourse {
  id: string;
  name: string;
  description: string | null;
}

interface StudentEnrollment {
  id: string;
  course_id: string;
  payment_status: PaymentStatus;
  enrolled_at: string;
  updated_at: string;
  course: EnrollmentCourse | null;
}

interface StudentDetail {
  id: string;
  name: string;
  email: string;
  username: string;
  phone: string | null;
  created_at: string;
  enrollments: StudentEnrollment[];
}

interface ScoreRecord {
  id: string;
  score: number;
  total_questions: number;
  percentage: number;
  submitted_at: string;
  exam: {
    id: string;
    title: string;
    course?: {
      id: string;
      name: string;
    } | null;
  } | null;
}

const paymentBadgeStyles: Record<PaymentStatus, string> = {
  paid: "bg-green-600/20 text-green-400 border-green-500/30",
  partial: "bg-yellow-600/20 text-yellow-400 border-yellow-500/30",
  unpaid: "bg-red-600/20 text-red-400 border-red-500/30",
};

export default function StudentInfoPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const studentId = params?.id;

  const [student, setStudent] = useState<StudentDetail | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [scores, setScores] = useState<ScoreRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [addingCourse, setAddingCourse] = useState(false);
  const [updatingEnrollmentId, setUpdatingEnrollmentId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [profileForm, setProfileForm] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [courseForm, setCourseForm] = useState<{
    course_id: string;
    payment_status: PaymentStatus;
  }>({
    course_id: "",
    payment_status: "unpaid",
  });

  const loadData = useCallback(async () => {
    if (!studentId) return;

    const [studentRes, coursesRes, scoresRes] = await Promise.all([
      fetch(`/api/students/${studentId}`),
      fetch("/api/courses"),
      fetch(`/api/scores?student_id=${studentId}`),
    ]);

    const [studentData, coursesData, scoresData] = await Promise.all([
      studentRes.json(),
      coursesRes.json(),
      scoresRes.json(),
    ]);

    if (!studentRes.ok) {
      throw new Error(studentData.error || "Failed to load student details");
    }

    if (!coursesRes.ok) {
      throw new Error(coursesData.error || "Failed to load courses");
    }

    if (!scoresRes.ok) {
      throw new Error(scoresData.error || "Failed to load exam history");
    }

    setStudent({
      ...studentData.student,
      enrollments: studentData.student?.enrollments || [],
    });
    setCourses(coursesData.courses || []);
    setScores(scoresData.scores || []);
  }, [studentId]);

  const checkAuthAndLoad = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const authRes = await fetch("/api/auth/me");

      if (!authRes.ok) {
        router.push("/login");
        return;
      }

      const authData = await authRes.json();

      if (authData.role !== "admin" && authData.role !== "super_admin") {
        router.push("/dashboard");
        return;
      }

      await loadData();
    } catch (err) {
      logger.error("Student info auth error", err);
      setError("Failed to load student information");
    } finally {
      setLoading(false);
    }
  }, [loadData, router]);

  useEffect(() => {
    if (!studentId) return;
    checkAuthAndLoad();
  }, [checkAuthAndLoad, studentId]);

  useEffect(() => {
    if (!student) return;

    setProfileForm({
      name: student.name,
      email: student.email,
      phone: student.phone || "",
    });
  }, [student]);

  const availableCourses = useMemo(() => {
    if (!student) return courses;
    const enrolledCourseIds = new Set(student.enrollments.map((enrollment) => enrollment.course_id));
    return courses.filter((course) => !enrolledCourseIds.has(course.id));
  }, [courses, student]);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!studentId) return;

    try {
      setSavingProfile(true);
      setError("");
      setSuccess("");

      const res = await fetch(`/api/students/${studentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profileForm),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to update student profile");
      }

      setStudent({
        ...data.student,
        enrollments: data.student?.enrollments || [],
      });
      setSuccess("Student profile updated successfully.");
    } catch (err: any) {
      setError(err.message || "Failed to update student profile");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleAddCourse = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!student || !courseForm.course_id) return;

    try {
      setAddingCourse(true);
      setError("");
      setSuccess("");

      const res = await fetch("/api/enrollments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          student_id: student.id,
          course_id: courseForm.course_id,
          payment_status: courseForm.payment_status,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to add course");
      }

      await loadData();
      setCourseForm({ course_id: "", payment_status: "unpaid" });
      setSuccess("Course added successfully.");
    } catch (err: any) {
      setError(err.message || "Failed to add course");
    } finally {
      setAddingCourse(false);
    }
  };

  const handlePaymentStatusChange = async (
    enrollmentId: string,
    paymentStatus: PaymentStatus
  ) => {
    try {
      setUpdatingEnrollmentId(enrollmentId);
      setError("");
      setSuccess("");

      const res = await fetch(`/api/enrollments/${enrollmentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ payment_status: paymentStatus }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to update payment status");
      }

      setStudent((currentStudent) => {
        if (!currentStudent) return currentStudent;

        return {
          ...currentStudent,
          enrollments: currentStudent.enrollments.map((enrollment) =>
            enrollment.id === enrollmentId
              ? { ...enrollment, payment_status: paymentStatus }
              : enrollment
          ),
        };
      });
      setSuccess("Payment status updated successfully.");
    } catch (err: any) {
      setError(err.message || "Failed to update payment status");
    } finally {
      setUpdatingEnrollmentId(null);
    }
  };

  const formatDate = (value?: string | null) => {
    if (!value) return "N/A";

    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
    }).format(new Date(value));
  };

  return (
    <AdminShell>
      <div className="min-h-screen bg-gray-950 text-gray-100 p-6 rounded-xl">
        <div className="flex flex-col gap-4 mb-6">
          <button
            type="button"
            onClick={() => router.push("/student-management")}
            className="w-fit inline-flex items-center gap-2 text-sm text-gray-300 hover:text-white transition"
          >
            <ArrowLeft size={16} />
            Back to Students
          </button>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
            <div>
              <h1 className="text-3xl font-semibold text-white">Student Info</h1>
              <p className="text-gray-400 mt-1">
                View profile details, manage course enrollments, and review exam records.
              </p>
            </div>

            {student && (
              <div className="px-4 py-3 rounded-xl bg-gray-900 border border-gray-800">
                <p className="text-sm text-gray-400">Student ID</p>
                <p className="text-lg font-semibold text-white">{student.username || "N/A"}</p>
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 rounded-lg border border-green-500/40 bg-green-500/10 px-4 py-3 text-sm text-green-300">
            {success}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-[#3a0ca3]" />
          </div>
        ) : !student ? (
          <div className="rounded-xl border border-gray-800 bg-gray-900 p-8 text-center text-gray-400">
            Student record not found.
          </div>
        ) : (
          <div className="space-y-6">
            <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              <div className="rounded-xl border border-gray-800 bg-gray-900 p-5">
                <div className="flex items-center gap-3 text-gray-400 mb-3">
                  <User size={18} />
                  <span className="text-sm">Full Name</span>
                </div>
                <p className="text-lg font-semibold text-white">{student.name}</p>
              </div>

              <div className="rounded-xl border border-gray-800 bg-gray-900 p-5">
                <div className="flex items-center gap-3 text-gray-400 mb-3">
                  <Mail size={18} />
                  <span className="text-sm">Email Address</span>
                </div>
                <p className="text-lg font-semibold text-white break-all">{student.email}</p>
              </div>

              <div className="rounded-xl border border-gray-800 bg-gray-900 p-5">
                <div className="flex items-center gap-3 text-gray-400 mb-3">
                  <BookOpen size={18} />
                  <span className="text-sm">Current Courses</span>
                </div>
                <p className="text-lg font-semibold text-white">{student.enrollments.length}</p>
              </div>

              <div className="rounded-xl border border-gray-800 bg-gray-900 p-5">
                <div className="flex items-center gap-3 text-gray-400 mb-3">
                  <Calendar size={18} />
                  <span className="text-sm">Registration Date</span>
                </div>
                <p className="text-lg font-semibold text-white">{formatDate(student.created_at)}</p>
              </div>
            </section>

            <section className="grid grid-cols-1 xl:grid-cols-5 gap-6">
              <div className="xl:col-span-2 rounded-xl border border-gray-800 bg-gray-900 p-6">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h2 className="text-xl font-semibold text-white">Profile Details</h2>
                    <p className="text-sm text-gray-400 mt-1">Update the student&apos;s basic account information.</p>
                  </div>
                </div>

                <form onSubmit={handleProfileSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={profileForm.name}
                      onChange={(e) => setProfileForm((current) => ({ ...current, name: e.target.value }))}
                      className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-white focus:border-[#3a0ca3] focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Email Address</label>
                    <input
                      type="email"
                      value={profileForm.email}
                      onChange={(e) => setProfileForm((current) => ({ ...current, email: e.target.value }))}
                      className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-white focus:border-[#3a0ca3] focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Phone Number</label>
                    <div className="relative">
                      <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                      <input
                        type="tel"
                        value={profileForm.phone}
                        onChange={(e) => setProfileForm((current) => ({ ...current, phone: e.target.value }))}
                        className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 pl-10 text-white focus:border-[#3a0ca3] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="rounded-lg border border-gray-800 bg-gray-950/60 px-4 py-3">
                    <p className="text-sm text-gray-400">Student ID</p>
                    <p className="text-base font-medium text-white">{student.username || "N/A"}</p>
                  </div>

                  <button
                    type="submit"
                    disabled={savingProfile}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#3a0ca3] px-4 py-2 font-medium text-white transition hover:bg-[#4c1d95] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Save size={16} />
                    {savingProfile ? "Saving..." : "Save Changes"}
                  </button>
                </form>
              </div>

              <div className="xl:col-span-3 rounded-xl border border-gray-800 bg-gray-900 p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-5">
                  <div>
                    <h2 className="text-xl font-semibold text-white">Courses & Payment Status</h2>
                    <p className="text-sm text-gray-400 mt-1">Manage the student&apos;s course enrollments and payment status per course.</p>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  {student.enrollments.length > 0 ? (
                    student.enrollments.map((enrollment) => (
                      <div
                        key={enrollment.id}
                        className="rounded-xl border border-gray-800 bg-gray-950/60 p-4"
                      >
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                          <div>
                            <h3 className="text-lg font-semibold text-white">
                              {enrollment.course?.name || "Unnamed Course"}
                            </h3>
                            <p className="text-sm text-gray-400 mt-1">
                              {enrollment.course?.description || "No course description available."}
                            </p>
                            <p className="text-xs text-gray-500 mt-2">
                              Enrolled on {formatDate(enrollment.enrolled_at)}
                            </p>
                          </div>

                          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                            <span
                              className={`inline-flex w-fit items-center rounded-full border px-3 py-1 text-xs font-medium ${paymentBadgeStyles[enrollment.payment_status]}`}
                            >
                              {enrollment.payment_status.charAt(0).toUpperCase() + enrollment.payment_status.slice(1)}
                            </span>

                            <select
                              value={enrollment.payment_status}
                              onChange={(e) =>
                                handlePaymentStatusChange(
                                  enrollment.id,
                                  e.target.value as PaymentStatus
                                )
                              }
                              disabled={updatingEnrollmentId === enrollment.id}
                              className="rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white focus:border-[#3a0ca3] focus:outline-none disabled:opacity-60"
                            >
                              <option value="unpaid">Unpaid</option>
                              <option value="partial">Partial</option>
                              <option value="paid">Paid</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-xl border border-dashed border-gray-700 bg-gray-950/40 p-6 text-center text-gray-400">
                      No courses enrolled yet.
                    </div>
                  )}
                </div>

                <div className="rounded-xl border border-gray-800 bg-gray-950/60 p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <Plus size={18} className="text-[#b5179e]" />
                    <h3 className="text-lg font-semibold text-white">Add Course</h3>
                  </div>

                  {availableCourses.length === 0 ? (
                    <p className="text-sm text-gray-400">All available courses are already assigned to this student.</p>
                  ) : (
                    <form onSubmit={handleAddCourse} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-300 mb-1">Select Course</label>
                        <select
                          value={courseForm.course_id}
                          onChange={(e) =>
                            setCourseForm((current) => ({ ...current, course_id: e.target.value }))
                          }
                          className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-white focus:border-[#3a0ca3] focus:outline-none"
                          required
                        >
                          <option value="">Choose a course</option>
                          {availableCourses.map((course) => (
                            <option key={course.id} value={course.id}>
                              {course.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Payment Status</label>
                        <select
                          value={courseForm.payment_status}
                          onChange={(e) =>
                            setCourseForm((current) => ({
                              ...current,
                              payment_status: e.target.value as PaymentStatus,
                            }))
                          }
                          className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-white focus:border-[#3a0ca3] focus:outline-none"
                        >
                          <option value="unpaid">Unpaid</option>
                          <option value="partial">Partial</option>
                          <option value="paid">Paid</option>
                        </select>
                      </div>

                      <div className="md:col-span-3">
                        <button
                          type="submit"
                          disabled={addingCourse}
                          className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#b5179e] px-4 py-2 font-medium text-white transition hover:bg-[#9d1388] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          <Plus size={16} />
                          {addingCourse ? "Adding Course..." : "Add Course"}
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </section>

            <section className="rounded-xl border border-gray-800 bg-gray-900 p-6">
              <div className="flex items-center justify-between gap-3 mb-5">
                <div>
                  <h2 className="text-xl font-semibold text-white">Exam History</h2>
                  <p className="text-sm text-gray-400 mt-1">Review the student&apos;s completed exam attempts and scores.</p>
                </div>

                <div className="inline-flex items-center gap-2 rounded-lg bg-gray-950/60 px-3 py-2 text-sm text-gray-300">
                  <CheckCircle2 size={16} className="text-green-400" />
                  {scores.length} record{scores.length === 1 ? "" : "s"}
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-800 text-left text-gray-400">
                      <th className="px-4 py-3 font-medium">Course</th>
                      <th className="px-4 py-3 font-medium">Exam Title</th>
                      <th className="px-4 py-3 font-medium">Score</th>
                      <th className="px-4 py-3 font-medium">Date Taken</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scores.length > 0 ? (
                      scores.map((record) => (
                        <tr key={record.id} className="border-b border-gray-800/70 text-gray-200">
                          <td className="px-4 py-3">{record.exam?.course?.name || "N/A"}</td>
                          <td className="px-4 py-3">{record.exam?.title || "Untitled Exam"}</td>
                          <td className="px-4 py-3">
                            {record.score}/{record.total_questions}
                            <span className="ml-2 text-xs text-gray-400">({record.percentage}%)</span>
                          </td>
                          <td className="px-4 py-3 text-gray-400">{formatDate(record.submitted_at)}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                          No exam history found for this student.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        )}
      </div>
    </AdminShell>
  );
}