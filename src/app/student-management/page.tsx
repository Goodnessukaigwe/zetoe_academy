"use client";
import SearchBar from "./searchBar";
import StudentsTable from "./studentsTable";
import { students } from "./mockData"
import {useState} from "react" 


export default function StudentsPage() {
  
    const [searchQuery, setSearchQuery] = useState("");
    // Filter students based on search query
    const filteredstudents = students.filter(
      (student) =>
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.course.toLowerCase().includes(searchQuery.toLowerCase())
    );
  return (
    <main className="min-h-screen bg-gray-950 text-gray-100 p-6">
      <h1 className="text-3xl font-semibold mb-6">Student Management</h1>
      
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
      
            {/* Student Table (filtered) */}
            <StudentsTable data={filteredstudents} />

      
    </main>
  );
}
