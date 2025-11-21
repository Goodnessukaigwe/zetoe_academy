export default function SuperAdminDashboard() {
  return (
    <div>
      <h2 className="text-3xl font-bold text-[#3a0ca3] mb-9">
        Welcome Super Admin 👋
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-gray-700 font-semibold text-lg">Total Admins</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">10</p>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-gray-700 font-semibold text-lg">Total Students</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">245</p>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-gray-700 font-semibold text-lg">Payments Recorded</h3>
          <p className="text-3xl font-bold text-purple-600 mt-2">₦1.2M</p>
        </div>
        
      </div>
    </div>
  );
}
