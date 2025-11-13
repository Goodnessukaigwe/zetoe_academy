"use client";
import DashboardCard from "./dashboardcard";

export default function AdminDashboardPage() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <DashboardCard title="Total Exams Uploaded" value={10} color="blue-600" />
      <DashboardCard title="Total Students" value={245} color="green-600" />
      <DashboardCard title="Paid Student" value={16} color="purple-600" />
      <DashboardCard title="UnPaid Student" value={6} color="red-600" />
    </div>
  );
}
