export default function SuperAdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">


   
      <div className="flex flex-1">
    
        <aside className="w-64 bg-black shadow-md p-4">
          <nav className="flex flex-col gap-3">
            <button className="text-left w-full px-4 py-2 rounded hover:bg-blue-300
             text-white font-medium">
              Manage Admins
            </button>
            <button className="text-left w-full px-4 py-2 rounded hover:bg-blue-300
            text-white font-medium">
              Manage Students
            </button>
            <button className="text-left w-full px-4 py-2 rounded hover:bg-blue-300
             text-white font-medium">
              Payment Info
            </button>
            <button className="text-left w-full px-4 py-2 rounded hover:bg-blue-300
             text-white font-medium">
              System Overview
            </button>
          </nav>
        </aside>

       
        <main className="flex-1 p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Dashboard Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Cards */}
            <div className="bg-white p-6 rounded shadow">
              <h3 className="text-lg font-semibold text-gray-700">Total Admins</h3>
              <p className="text-3xl font-bold text-blue-600 mt-2">10</p>
            </div>

            <div className="bg-white p-6 rounded shadow">
              <h3 className="text-lg font-semibold text-gray-700">Total Students</h3>
              <p className="text-3xl font-bold text-green-600 mt-2">245</p>
            </div>

            <div className="bg-white p-6 rounded shadow">
              <h3 className="text-lg font-semibold text-gray-700">Payments Recorded</h3>
              <p className="text-3xl font-bold text-purple-600 mt-2">₦1.2M</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}