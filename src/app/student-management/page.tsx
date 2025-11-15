"use client";
import SearchBar from "./searchBar";
import StudentsTable from "./studentsTable";
import { useState, useEffect } from "react";
import { Student } from "@/types/database";
import { Plus } from "lucide-react";
import AddStudentModal from "./addStudentModal";

export default function StudentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  // Fetch students from API
  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/students");
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch students");
      }

      setStudents(data.students || []);
      setError("");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Filter students based on search query
  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.course?.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-gray-950 text-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold">Student Management</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#3a0ca3] hover:bg-[#4c1d95] text-white rounded-lg font-medium transition"
        >
          <Plus size={20} />
          Add Student
        </button>
      </div>

      {/* Search Field */}
      <div className="mb-6">
        <div className="w-full sm:w-1/2">
          <SearchBar onSearch={setSearchQuery} />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-900/20 border border-red-500 rounded-lg text-red-400">
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3a0ca3]"></div>
        </div>
      ) : (
        <StudentsTable data={filteredStudents} onRefresh={fetchStudents} />
      )}

      {/* Add Student Modal */}
      {showAddModal && (
        <AddStudentModal
          onClose={() => setShowAddModal(false)}
          onSuccess={fetchStudents}
        />
      )}
    </main>
  );
}
