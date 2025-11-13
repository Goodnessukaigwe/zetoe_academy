"use client";

import { useState } from "react";
import AdminTable from "./adminTable";
import AdminModal from "./adminModal";
import SearchBar from "./searchBar";
import { adminsData } from "./mockAdmins"; // temporary mock data

export default function AdminsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter admins based on search query
  const filteredAdmins = adminsData.filter(
    (admin) =>
      admin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      admin.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-[#f2f2f2] text-gray-900 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
        <h1 className="text-3xl font-semibold text-[#3a0ca3] mb-4 sm:mb-0">
          Admin Management
        </h1>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#3a0ca3] hover:bg-[#857fbbcc] text-white px-4 py-2 rounded-lg font-medium transition"
        >
          + Create Admin
        </button>
      </div>

      {/* Search Field and Button */}
      <div className="flex flex-col sm:flex-row items-center gap-3 mb-6">
        <div className="w-full sm:w-1/2">
          <SearchBar onSearch={setSearchQuery} />
        </div>
        <button
          onClick={() => {}}
          className="px-4 py-2 bg-[#3a0ca3] hover:bg-[#857fbbcc] text-white rounded-lg font-medium transition"
        >
          Search
        </button>
      </div>

      {/* Admin Table (filtered) */}
      <AdminTable data={filteredAdmins} />

      {/* Modal */}
      {isModalOpen && <AdminModal onClose={() => setIsModalOpen(false)} />}
    </main>
  );
}
