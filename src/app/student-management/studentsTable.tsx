"use client";
import { Student } from "@/types/database";
import StudentRow from "./studentRow";

export default function StudentsTable({
  data,
  onRefresh,
}: {
  data: Student[];
  onRefresh: () => void;
}) {
  return (
    <div className="bg-gray-900 rounded-xl shadow-lg overflow-hidden border border-gray-800">
      <div className="overflow-x-auto max-h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-800 sticky top-0 z-10">
            <tr className="text-left text-gray-300">
              <th className="px-6 py-3 font-medium">Name</th>
              <th className="px-6 py-3 font-medium">Email</th>
              <th className="px-6 py-3 font-medium">Phone</th>
              <th className="px-6 py-3 font-medium">Course</th>
              <th className="px-6 py-3 font-medium">Payment</th>
              <th className="px-6 py-3 font-medium text-center">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-800">
            {data.length > 0 ? (
              data.map((student) => (
                <StudentRow key={student.id} student={student} onRefresh={onRefresh} />
              ))
            ) : (
              <tr>
                <td
                  colSpan={6}
                  className="text-center py-6 text-gray-500 italic"
                >
                  No students found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
