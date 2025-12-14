export default function StudentDashboard() {
  const student = { name: "Lawrence" };
  return ( <>
     {/* navi */}
   <nav className="bg-[#f7f6f8]  p-4 flex justify-between items-center shadow-md font-['Open_Sans']">
    
        <div className="flex items-center space-x-3">
            <img src="/zetelog.png" alt="zetoe logo" className="w-30 h-30" />
          <h1 className="text-2xl font-extrabold text-blue-600">
            Zeteo Citadel Consult
          </h1>
        </div>
      
        <button
        
          className="relative top-0 font-['Times_New_Roman'] text-white px-5 py-2 rounded-md
           bg-[#3a0ca3] border border-white hover:bg-white hover:text-[#3a0ca3] transition duration-300 font-bold shadow-sm"
        >
          Logout
        </button>
      </nav>

  {/* header */}
   <header className="mb-8 ml-20 mt-10">
    <h1 className="text-3xl font-bold text-gray-800">Student Dashboard</h1>
    <p className="text-gray-600">ZETEO CITADEL CONSULT • Portal</p>
        <h1 className="text-2xl text-black font-bold">Good morning, {student.name.split(' ')[0]} 👋</h1>
  </header>


<div className="min-h-screen bg-gray-50 p-4 md:p-8">
  

  <div className="mb-8 flex flex-col ml-30"> <div className="relative w-32 h-32 rounded-4xl overflow-hidden shadow"> <img src="/mrlaw.jpg" alt="Student Photo" className="w-full h-full object-cover" /> <label className="absolute bottom-2 right-2 bg-white p-1 rounded-full shadow cursor-pointer text-xs font-medium"> <input type="file" className="hidden" /> Edit </label> </div> </div>
  

  {/* GRID LAYOUT */}
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    {/* STUDENT INFO */}
    <section className="md:col-span-1 bg-white p-6 rounded-2xl shadow-sm border">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">Student Information</h2>
      <div className="space-y-4 text-gray-600">
        <div>
          <label className="font-medium block text-gray-700"> First Name:</label>
          <input type="text" placeholder="collins" className="w-full p-2 border rounded-lg" />
        </div>
        
        <div>
          <label className="font-medium block text-gray-700">Other Name:</label>
          <input type="number" placeholder="gooodness audu" className="w-full p-2 border rounded-lg" />
        </div>

        <div>
          <label className="font-medium block text-gray-700">Email:</label>
          <input type="text" placeholder="zeteocidaleconsult@gmail.com" className="w-full p-2 border rounded-lg" />
        </div>

        <div>
          <label className="font-medium block text-gray-700">course studied:</label>
          <input type="text" placeholder="project managemant" className="w-full p-2 border rounded-lg" />
        </div>

        <div>
          <label className="font-medium block text-gray-700">phone number:</label>
          <input type="text" placeholder="0907511****" className="w-full p-2 border rounded-lg" />
        </div>

        <button className="mt-4 bg-blue-600 text-white w-full py-2 rounded-lg hover:bg-blue-700">Save Changes</button>
      </div>
    </section>

    {/* ACADEMICS OVERVIEW */}
    <section className="md:col-span-2 bg-white p-6 rounded-2xl shadow-sm border">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">Academic Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 p-4 rounded-xl border">
          <p className="text-sm text-gray-500">number of courses</p>
          <h3 className="text-2xl font-bold text-gray-800">3</h3>
        </div>
        <div className="bg-green-50 p-4 rounded-xl border">
          <p className="text-sm text-gray-500">Completed Courses</p>
          <h3 className="text-2xl font-bold text-gray-800">2</h3>
        </div>
        <div className="bg-purple-50 p-4 rounded-xl border">
          <p className="text-sm text-gray-500">Outstanding</p>
          <h3 className="text-2xl font-bold text-gray-800">10000</h3>
        </div>
                <div className="mt-6 pt-4 border-t border-slate-100 text-sm text-slate-600">
          <p className="font-medium">Need help?</p>
          <p className="mt-1">Contact academic advisor or support.</p>
        </div>

      </div>
    </section>
  </div>

  {/* EXAMS AND RESULTS */}
  <section className="mt-8 bg-white p-6 rounded-2xl shadow-sm border">
    <h2 className="text-xl font-semibold text-gray-700 mb-4">Exams & Results</h2>

    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-left text-gray-700">
        <thead>
          <tr className="bg-gray-100 text-gray-600 text-sm">
            <th className="p-3 border">CourseS</th>
            <th className="p-3 border">Course Title</th>
            <th className="p-3 border">Score</th>
            <th className="p-3 border">Grade</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="p-3 border">WEB DEVELOPMENT</td>
            <td className="p-3 border">CSS & HTML</td>
            <td className="p-3 border">78</td>
            <td className="p-3 border font-semibold text-green-600">A</td>
          </tr>
          <tr className="bg-gray-50">
            <td className="p-3 border">COMPUTER DIPLOMA</td>
            <td className="p-3 border">EXCELL AND WORD</td>
            <td className="p-3 border">65</td>
            <td className="p-3 border font-semibold text-yellow-600">B</td>
          </tr>
          <tr>
            <td className="p-3 border">HUMAN MANAGEMENT</td>
            <td className="p-3 border">SCOPE AND RISK</td>
            <td className="p-3 border">72</td>
            <td className="p-3 border font-semibold text-green-600">A</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>

  {/* QUICK ACTIONS */}
  <section className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
    <button className="bg-blue-600 text-white p-4 rounded-xl shadow hover:bg-blue-700 transition">View Profile</button>
    <button className="bg-green-600 text-white p-4 rounded-xl shadow hover:bg-green-700 transition">Course Registration</button>
    <button className="bg-purple-600 text-white p-4 rounded-xl shadow hover:bg-purple-700 transition">Payment Portal</button>
  </section>
</div>

</> ); }