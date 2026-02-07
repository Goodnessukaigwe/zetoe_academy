"use client";
import SearchBar from "./searchBar";
import StudentsTable from "./studentsTable";
import { useState, useEffect } from "react";
import { Student } from "@/types/database";
import { Plus } from "lucide-react";
import AddStudentModal from "./addStudentModal";
import { useRouter } from "next/navigation";
import { logger } from '@/lib/logger';

import AdminShell from "@/component/AdminShell";

export default function StudentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const router = useRouter();

  // Check if user is admin or super_admin
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (!res.ok) {
        router.push('/login');
        return;
      }

      const data = await res.json();
      if (data.role !== 'admin' && data.role !== 'super_admin') {
        router.push('/dashboard');
        return;
      }

      fetchStudents();
    } catch (err) {
      logger.error('Auth check error', err);
      router.push('/login');
    }
  };

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

  // Filter students based on search query
  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.course?.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminShell>
      <div className="min-h-screen bg-gray-950 text-gray-100 p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h1 className="text-2xl sm:text-3xl font-semibold">Student Management</h1>
          <button
            onClick={() => setShowAddModal(true)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-[#3a0ca3] hover:bg-[#4c1d95] text-white rounded-lg font-medium transition"
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
      </div>
    </AdminShell>
  );
}
