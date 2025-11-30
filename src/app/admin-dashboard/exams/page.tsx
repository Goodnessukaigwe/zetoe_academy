"use client";
import { useState, useEffect } from "react";
import { Exam, Course } from "@/types/database";
import { Plus, Search } from "lucide-react";
import ExamCard from "./examCard";
import CreateExamModal from "./createExamModal";
import { logger } from '@/lib/logger';

export default function ExamManagementPage() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);

  const fetchExams = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/exams");
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch exams");
      }

      setExams(data.exams || []);
      setError("");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      const res = await fetch("/api/courses");
      const data = await res.json();
      if (res.ok) {
        setCourses(data.courses || []);
        }
      } catch (err) {
        logger.error('Failed to fetch courses', err);
      }
    };  useEffect(() => {
    fetchExams();
    fetchCourses();
  }, []);

  const filteredExams = exams.filter(
    (exam) =>
      exam.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exam.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-gray-950 text-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold">Exam Management</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#3a0ca3] hover:bg-[#4c1d95] text-white rounded-lg font-medium transition"
        >
          <Plus size={20} />
          Create Exam
        </button>
      </div>

      {/* Search */}
      <div className="mb-6 relative">
        <div className="relative w-full sm:w-1/2">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search exams by title or code..."
            className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white focus:outline-none focus:border-[#3a0ca3]"
          />
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 p-4 bg-red-900/20 border border-red-500 rounded-lg text-red-400">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3a0ca3]"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExams.length > 0 ? (
            filteredExams.map((exam) => (
              <ExamCard key={exam.id} exam={exam} onRefresh={fetchExams} />
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-gray-500">
              No exams found.
            </div>
          )}
        </div>
      )}

      {/* Create Exam Modal */}
      {showCreateModal && (
        <CreateExamModal
          courses={courses}
          onClose={() => setShowCreateModal(false)}
          onSuccess={fetchExams}
        />
      )}
    </main>
  );
}
