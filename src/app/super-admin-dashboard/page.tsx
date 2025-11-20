"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface DashboardStats {
  totalExams: number;
  totalStudents: number;
  totalAdmins: number;
  paidStudents: number;
  unpaidStudents: number;
}

export default function SuperAdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalExams: 0,
    totalStudents: 0,
    totalAdmins: 0,
    paidStudents: 0,
    unpaidStudents: 0,
  });
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);

      // Verify user is super admin
      const meRes = await fetch('/api/auth/me');
      if (!meRes.ok) {
        router.push('/login');
        return;
      }

      const meData = await meRes.json();
      if (meData.role !== 'super_admin') {
        router.push('/dashboard');
        return;
      }

      // Fetch students
      const studentsRes = await fetch('/api/students');
      if (studentsRes.ok) {
        const studentsData = await studentsRes.json();
        const students = studentsData.students || [];
        
        const totalStudents = students.length;
        const paidStudents = students.filter((s: any) => s.payment_status === 'paid').length;
        const unpaidStudents = students.filter((s: any) => s.payment_status === 'unpaid').length;
        
        setStats(prev => ({
          ...prev,
          totalStudents,
          paidStudents,
          unpaidStudents
        }));
      }

      // Fetch admins
      const adminsRes = await fetch('/api/admins');
      if (adminsRes.ok) {
        const adminsData = await adminsRes.json();
        setStats(prev => ({
          ...prev,
          totalAdmins: adminsData.admins?.length || 0
        }));
      }

      // Fetch exams
      const examsRes = await fetch('/api/exams');
      if (examsRes.ok) {
        const examsData = await examsRes.json();
        setStats(prev => ({
          ...prev,
          totalExams: examsData.exams?.length || 0
        }));
      }

    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3a0ca3]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Overview</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        <StatCard title="Total Admins" value={stats.totalAdmins} color="purple-600" />
        <StatCard title="Total Students" value={stats.totalStudents} color="green-600" />
        <StatCard title="Paid Students" value={stats.paidStudents} color="blue-600" />
        <StatCard title="Unpaid Students" value={stats.unpaidStudents} color="red-600" />
        <StatCard title="Total Exams" value={stats.totalExams} color="yellow-600" />
      </div>
    </div>
  );
}

function StatCard({ title, value, color }: { title: string; value: number; color: string }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
      <p className={`text-3xl font-bold mt-2 text-${color}`}>{value}</p>
    </div>
  );
}
