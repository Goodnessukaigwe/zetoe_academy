"use client";
import { useState } from "react";
import { Exam } from "@/types/database";
import { FileText, Clock, Code, Trash2 } from "lucide-react";

export default function ExamCard({
  exam,
  onRefresh,
}: {
  exam: Exam;
  onRefresh: () => void;
}) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setDeleting(true);
      const res = await fetch(`/api/exams/${exam.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete exam");
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
              <FileText className="text-[#3a0ca3]" size={24} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">{exam.title}</h3>
              <p className="text-sm text-gray-400">
                {exam.course?.name || "No Course"}
              </p>
            </div>
          </div>
        </div>

        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
          {exam.description || "No description"}
        </p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <Code size={16} className="text-[#3a0ca3]" />
            <span className="font-mono font-semibold">{exam.code}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <Clock size={16} className="text-[#3a0ca3]" />
            <span>{exam.duration_minutes} minutes</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <FileText size={16} className="text-[#3a0ca3]" />
            <span>{exam.questions?.length || 0} questions</span>
          </div>
          <div className="text-sm text-gray-300">
            <span className="text-gray-400">Passing Score:</span>{" "}
            <span className="font-semibold">{exam.passing_score}%</span>
          </div>
        </div>

        <button
          onClick={() => setConfirmDelete(true)}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-medium text-white transition"
        >
          <Trash2 size={16} />
          Delete Exam
        </button>
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
              <strong className="text-white">{exam.title}</strong>?
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
    </>
  );
}
