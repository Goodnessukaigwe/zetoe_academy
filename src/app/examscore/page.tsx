"use client";
import React, { useState } from "react";

export default function ExamResultsPage() {
  // Sample data
  const sampleResults = [
    { id: 1, name: "goodness", exam: "Mathematics", score: 85, date: "2025-10-12" },
    { id: 2, name: "levi", exam: "Physics", score: 92, date: "2025-10-15" },
    { id: 3, name: "collins", exam: "Chemistry", score: 78, date: "2025-10-20" },
    { id: 4, name: "lazarus", exam: "Biology", score: 88, date: "2025-10-25" },
    { id: 5, name: "vicky", exam: "Biology", score: 88, date: "2025-10-25" },
  ];

  const [search, setSearch] = useState("");

  const filteredResults = sampleResults.filter(
    (result) =>
      result.name.toLowerCase().includes(search.toLowerCase()) ||
      result.exam.toLowerCase().includes(search.toLowerCase())
  );

  return (

     <div>

                {/* top navigation */}
        <div className=" sticky top-0 flex  justify-end font-opensans font-bold p-4  text-black text-30 space-x-10 bg-white ">
                    {/* logo */}
          <div className=' flex justify-center  items-center m-auto text-blue-700   '>
          <img src="/zetelog.png"  alt="logo" className='  h-30 w-20  '/>
          <h1 className=' text-center font-extrabold  '>ZETEO CITADEL CONSULT<br /> in collaboration with university of ibadan <br />(consultancy unit)</h1>
          <img src="/ibadanlog.png"  alt="logo" className='  h-17 w-20  '/>
          <a href="#" className="text-black ml-300 absolute cursor-pointer">➜]logout</a>
          </div>

      
        </div>
             {/* navigation */}
        <div className=' sticky top-28 flex justify-between font-opensans font-bold p-3 text-white-700 space-x-10  bg-blue-800 '>
                       
             
                        {/* menus */}
          <div  className='space-x-15 text-center justify-center m-auto text-white-800  ' > <a className=' hover:text-white hover:border hover:rounded-4xl hover:p-1' href="#">home</a> <a href="#" className='hover:text-white hover:border hover:rounded-4xl hover:p-1' >Academic</a> <a className='hover:text-white hover:border hover:rounded-4xl hover:p-1' href="#">Mail</a> <a href="#" className='hover:text-white hover:border hover:rounded-4xl hover:p-1'>Calender</a> <a href="#" className='hover:text-white hover:border hover:rounded-4xl hover:p-1'>News & Blog</a>
          </div>

        </div >


    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-black mb-4 text-center">
          Exam Results
        </h2>

        {/* Search Bar */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by name or exam..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 text-black py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Results Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left border border-gray-200">
            <thead className="bg-blue-600 text-">
              <tr>
                <th className="px-4 py-2">Student Name</th>
                <th className="px-4 py-2">Exam Title</th>
                <th className="px-4 py-2">Score</th>
                <th className="px-4 py-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredResults.length > 0 ? (
                filteredResults.map((result) => (
                  <tr
                    key={result.id}
                    className="border-t hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-2">{result.name}</td>
                    <td className="px-4 py-2">{result.exam}</td>
                    <td className="px-4 py-2">{result.score}</td>
                    <td className="px-4 py-2">{result.date}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={4}
                    className="text-center text-black py-4 italic"
                  >
                    No results found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    
     </div>
  );
}
