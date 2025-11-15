// 

"use client";

interface Admin {
  id: number;
  name: string;
  email: string;
  role: string;
}

export default function AdminTable({ data }: { data: Admin[] }) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-[#3a0ca3] text-white sticky top-0">
            <tr>
              <th className="px-6 py-3 text-left font-medium">Name</th>
              <th className="px-6 py-3 text-left font-medium">Email</th>
              <th className="px-6 py-3 text-left font-medium">Role</th>
              <th className="px-6 py-3 text-center font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.length > 0 ? (
              data.map((admin) => (
                <tr
                  key={admin.id}
                  className="hover:bg-[#f3f1ff] transition-colors duration-150"
                >
                  <td className="px-6 py-3">{admin.name}</td>
                  <td className="px-6 py-3">{admin.email}</td>
                  <td className="px-6 py-3">{admin.role}</td>
                  <td className="px-6 py-3 text-center">
                    <button className="text-blue-600 hover:underline mr-3">Edit</button>
                    <button className="text-red-600 hover:underline">Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={4}
                  className="text-center py-6 text-gray-500 italic"
                >
                  No admins found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
