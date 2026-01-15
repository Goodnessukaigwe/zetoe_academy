"use client";
import { useState } from "react";
import { Course } from "@/types/database";
import { Pencil, Trash2, BookOpen } from "lucide-react";
import EditCourseModal from "./editCourseModal";

export default function CourseCard({
  course,
  onRefresh,
  userRole,
}: {
  course: Course;
  onRefresh: () => void;
  userRole: string | null;
}) {
  const [showEditModal, setShowEditModal] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setDeleting(true);
      const res = await fetch(`/api/courses/${course.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete course");
      }

      onRefresh();
      setConfirmDelete(false);
    } catch (error: any) {
      alert(error.message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-[#3a0ca3] transition-all">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#3a0ca3]/20 rounded-lg">
              <BookOpen className="text-[#3a0ca3]" size={24} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">
                {course.name}
              </h3>
              <p className="text-sm text-gray-400">{course.duration || "N/A"}</p>
            </div>
          </div>
        </div>

        <p className="text-gray-400 text-sm mb-4 line-clamp-3">
          {course.description || "No description provided"}
        </p>

        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-2xl font-bold text-[#3a0ca3]">
              ₦{course.price.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500">Course Fee</p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setShowEditModal(true)}
            className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-[#3a0ca3] hover:bg-blue-700 rounded-lg text-sm font-medium text-white transition"
          >
            <Pencil size={16} />
            Edit
          </button>
          {userRole === 'super_admin' && (
            <button
              onClick={() => setConfirmDelete(true)}
              className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-medium text-white transition"
            >
              <Trash2 size={16} />
              Delete
            </button>
          )}
        </div>
      </div>

      {/* Delete Confirmation */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-lg shadow-lg p-6 w-[90%] max-w-sm text-center border border-gray-700">
            <h2 className="text-lg font-semibold mb-2 text-white">
              Confirm Delete
            </h2>
            <p className="text-gray-400 mb-4">
              Are you sure you want to delete{" "}
              <strong className="text-white">{course.name}</strong>?
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setConfirmDelete(false)}
                disabled={deleting}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md text-sm font-medium text-white disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md text-sm font-medium text-white disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <EditCourseModal
          course={course}
          onClose={() => setShowEditModal(false)}
          onSuccess={onRefresh}
        />
      )}
    </>
  );
}
