"use client";
import { useState } from "react"

interface Student {
  id: number;
  name: string;
  email: string;
  course: string;
  payment: string;
}

export default function StudentRow({ student }: { student: Student }) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  return (
    
    <tr className="hover:bg-gray-800/70 transition-colors duration-200">
      <td className="px-6 py-3">{student.name}</td>
      <td className="px-6 py-3">{student.email}</td>
      <td className="px-6 py-3">{student.course}</td>
      <td className="px-6 py-3">
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            student.payment === "Paid"
              ? "bg-green-600/20 text-green-400"
              : "bg-yellow-600/20 text-yellow-400"
          }`}
        >
          {student.payment}
        </span>
      </td>
      <td className="px-6 py-3 flex items-center justify-center gap-3">
        <button className="px-3 py-1.5 bg-[#3a0ca3] hover:bg-blue-700 rounded-lg text-xs font-medium text-white transition-all">
          Edit
        </button>
        <button 
        onClick={() => setConfirmDelete(true)}
        className="px-3 py-1.5 bg-red-600 hover:bg-red-700 rounded-lg text-xs font-medium text-white transition-all">
          Delete
        </button>
      

    {confirmDelete && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-sm text-center">
              <h2 className="text-lg font-semibold mb-2 text-black/40">Confirm Delete</h2>
              <p className="text-gray-600 mb-4">
                Are you sure you want to delete <strong>{student.name}</strong>?
              </p>
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-md text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setConfirmDelete(false);
                    alert("Admin deleted (UI only)");
                  }}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
        </td>
    </tr>
  );
}
