"use client";

import { useState } from "react";

interface Admin {
  id: number;
  name: string;
  email: string;
  role: string;
}

export default function AdminRow({ admin }: { admin: Admin }) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <tr className="hover:bg-gray-100 transition">
      <td className="px-6 py-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3">
          <span className="font-medium">{admin.name}</span>
          <span className="text-xs text-gray-500 sm:hidden">{admin.email}</span>
        </div>
      </td>

      <td className="px-6 py-3 hidden sm:table-cell">{admin.email}</td>
      <td className="px-6 py-3 hidden md:table-cell">{admin.role}</td>

      <td className="px-6 py-3 text-center flex justify-center gap-2 sm:gap-3">
        <button className="px-2 sm:px-3 py-1.5 bg-zaffre text-white rounded-lg text-xs sm:text-sm bg-[#3a0ca3] hover:bg-[#857fbbcc] transition">
          Edit
        </button>
        <button
          onClick={() => setConfirmDelete(true)}
          className="px-2 sm:px-3 py-1.5 bg-red-600 text-white rounded-lg text-xs sm:text-sm hover:bg-red-700 transition"
        >
          Delete
        </button>

        {confirmDelete && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-sm text-center">
              <h2 className="text-lg font-semibold mb-2">Confirm Delete</h2>
              <p className="text-gray-600 mb-4">
                Are you sure you want to delete <strong>{admin.name}</strong>?
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
