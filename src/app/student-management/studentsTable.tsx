"use client";

interface Student {
  id: number;
  name: string;
  email: string;
  course: string; // ✅ match your filter keys
  payment: string; // optional if shown in table
}

import StudentRow from "./studentRow";

export default function StudentsTable({ data }: { data: Student[] }) {
  return (
    <div className="bg-gray-900 rounded-xl shadow-lg overflow-hidden border border-gray-800">
      <div className="overflow-x-auto max-h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-800 sticky top-0 z-10">
            <tr className="text-left text-gray-300">
              <th className="px-6 py-3 font-medium">Name</th>
              <th className="px-6 py-3 font-medium">Email</th>
              <th className="px-6 py-3 font-medium">Course</th>
              <th className="px-6 py-3 font-medium">Payment</th>
              <th className="px-6 py-3 font-medium text-center">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-800">
            {/* ✅ Use filtered `data` instead of all `students` */}
            {data.length > 0 ? (
              data.map((student) => (
                <StudentRow key={student.id} student={student} />
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
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
