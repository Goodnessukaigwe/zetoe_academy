"use client";
import { useEffect, useState } from "react";
import DashboardCard from "./dashboardcard";
import { useRouter } from "next/navigation";
import { logger } from '@/lib/logger';

interface DashboardStats {
  totalExams: number;
  totalStudents: number;
  paidStudents: number;
  unpaidStudents: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalExams: 0,
    totalStudents: 0,
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

      // Verify user is admin
      const meRes = await fetch('/api/auth/me');
      if (!meRes.ok) {
        router.push('/login');
        return;
      }

      const meData = await meRes.json();
      if (meData.role !== 'admin' && meData.role !== 'super_admin') {
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
      logger.error('Error fetching dashboard stats', { error });
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <DashboardCard title="Total Exams Uploaded" value={stats.totalExams} color="blue-600" />
      <DashboardCard title="Total Students" value={stats.totalStudents} color="green-600" />
      <DashboardCard title="Paid Students" value={stats.paidStudents} color="purple-600" />
      <DashboardCard title="Unpaid Students" value={stats.unpaidStudents} color="red-600" />
    </div>
  );
}
