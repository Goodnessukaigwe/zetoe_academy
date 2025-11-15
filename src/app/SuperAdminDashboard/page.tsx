export default function SuperAdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
   
       
        <main className="flex-1 p-6">
          <h2 className="text-3xl font-bold text-[#3a0ca3] mb-9">Welcome Super Admin 👋</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
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

             <div className="bg-white p-6 rounded shadow">
              <h3 className="text-lg font-semibold text-gray-700">System Overview</h3>
              <p className=" text-gray-600 text-sm mt-2"> All systems operational ✅</p>
            </div>
          </div>
        </main>
      </div>
  
  );
}