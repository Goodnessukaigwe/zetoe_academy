"use client";

import { useState } from "react";
import { Search } from "lucide-react";

export default function SearchBar({
  onSearch,
}: {
  onSearch: (query: string) => void;
}) {
  const [query, setQuery] = useState("");

  return (
    <div className="relative w-full">
      <input
        type="text"
        placeholder="Search Student by name, username, email or course ..."
        className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#3a0ca3]"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          onSearch(e.target.value);
        }}
      />
      <Search
        size={18}
        className="absolute left-3 top-2.5 text-gray-400 pointer-events-none"
      />
    </div>
  );
}
