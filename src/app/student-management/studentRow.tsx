"use client";
import { useState } from "react";
import { Student } from "@/types/database";
import { Pencil, Trash2 } from "lucide-react";
import EditStudentModal from "./editStudentModal";

export default function StudentRow({
  student,
  onRefresh,
}: {
  student: Student;
  onRefresh: () => void;
}) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setDeleting(true);
      const res = await fetch(`/api/students/${student.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete student");
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
      <tr className="hover:bg-gray-800/70 transition-colors duration-200">
        <td className="px-6 py-3">{student.name}</td>
        <td className="px-6 py-3">{student.email}</td>
        <td className="px-6 py-3">{student.phone || "N/A"}</td>
        <td className="px-6 py-3">{student.course?.name || "Not Enrolled"}</td>
        <td className="px-6 py-3">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              student.payment_status === "paid"
                ? "bg-green-600/20 text-green-400"
                : student.payment_status === "partial"
                ? "bg-yellow-600/20 text-yellow-400"
                : "bg-red-600/20 text-red-400"
            }`}
          >
            {student.payment_status.charAt(0).toUpperCase() +
              student.payment_status.slice(1)}
          </span>
        </td>
        <td className="px-6 py-3 flex items-center justify-center gap-3">
          <button
            onClick={() => setShowEditModal(true)}
            className="flex items-center gap-1 px-3 py-1.5 bg-[#3a0ca3] hover:bg-blue-700 rounded-lg text-xs font-medium text-white transition-all"
          >
            <Pencil size={14} />
            Edit
          </button>
          <button
            onClick={() => setConfirmDelete(true)}
            className="flex items-center gap-1 px-3 py-1.5 bg-red-600 hover:bg-red-700 rounded-lg text-xs font-medium text-white transition-all"
          >
            <Trash2 size={14} />
            Delete
          </button>
        </td>
      </tr>

      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-lg shadow-lg p-6 w-[90%] max-w-sm text-center border border-gray-700">
            <h2 className="text-lg font-semibold mb-2 text-white">
              Confirm Delete
            </h2>
            <p className="text-gray-400 mb-4">
              Are you sure you want to delete{" "}
              <strong className="text-white">{student.name}</strong>?
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

      {/* Edit Student Modal */}
      {showEditModal && (
        <EditStudentModal
          student={student}
          onClose={() => setShowEditModal(false)}
          onSuccess={onRefresh}
        />
      )}
    </>
  );
}
