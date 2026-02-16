"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowUpRight,
  Award,
  BookOpen,
  BookPlus,
  Calendar,
  FilePlus2,
  FileText,
  ShieldCheck,
  TrendingUp,
  UserPlus,
  Users,
} from "lucide-react";
import DashboardCard from "./dashboardcard";
import { logger } from "@/lib/logger";

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

  const formattedDate = useMemo(() => {
    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "full",
    }).format(new Date());
  }, []);

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
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-slate-200 border-t-slate-700"></div>
      </div>
    );
  }

  const paidPercent = stats.totalStudents
    ? Math.round((stats.paidStudents / stats.totalStudents) * 100)
    : 0;
  const unpaidPercent = stats.totalStudents ? 100 - paidPercent : 0;

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-8 text-white shadow-xl">
        <div className="absolute -right-20 -top-16 h-48 w-48 rounded-full bg-sky-500/20 blur-3xl" />
        <div className="absolute bottom-0 left-10 h-40 w-40 rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-300">
              Admin Control Center
            </p>
            <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">
              Dashboard Overview
            </h1>
            <p className="mt-3 max-w-2xl text-base text-slate-300">
              Monitor student engagement, exams, and payment status in one place. Keep actions fast and decisions informed.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-slate-200">
              <Calendar size={16} />
              {formattedDate}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 px-4 py-2 text-sm text-emerald-200">
              <ShieldCheck size={16} />
              Admin Verified
            </span>
          </div>
        </div>
        <div className="relative mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            href="/student-management"
            className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:-translate-y-0.5 hover:bg-white/10"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/20 text-sky-200">
                <UserPlus size={18} />
              </span>
              <div>
                <p className="text-sm font-semibold">Add Student</p>
                <p className="text-xs text-slate-300">Onboard new learners</p>
              </div>
            </div>
            <ArrowUpRight size={18} className="text-slate-300" />
          </Link>
          <Link
            href="/admin-dashboard/courses"
            className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:-translate-y-0.5 hover:bg-white/10"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/20 text-violet-200">
                <BookPlus size={18} />
              </span>
              <div>
                <p className="text-sm font-semibold">Create Course</p>
                <p className="text-xs text-slate-300">Publish new content</p>
              </div>
            </div>
            <ArrowUpRight size={18} className="text-slate-300" />
          </Link>
          <Link
            href="/admin-dashboard/exams"
            className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:-translate-y-0.5 hover:bg-white/10"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/20 text-rose-200">
                <FilePlus2 size={18} />
              </span>
              <div>
                <p className="text-sm font-semibold">Schedule Exam</p>
                <p className="text-xs text-slate-300">Set upcoming assessments</p>
              </div>
            </div>
            <ArrowUpRight size={18} className="text-slate-300" />
          </Link>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <DashboardCard
          title="Total Exams"
          value={stats.totalExams}
          description="Active assessments running"
          icon={FileText}
          accent="sky"
          footer="Updated in real time"
        />
        <DashboardCard
          title="Total Students"
          value={stats.totalStudents}
          description="Learners enrolled across courses"
          icon={Users}
          accent="emerald"
          footer="Includes all active profiles"
        />
        <DashboardCard
          title="Paid Students"
          value={stats.paidStudents}
          description="Up-to-date tuition status"
          icon={Award}
          accent="violet"
          footer={`${paidPercent}% of total students`}
        />
        <DashboardCard
          title="Unpaid Students"
          value={stats.unpaidStudents}
          description="Require follow-up or reminders"
          icon={TrendingUp}
          accent="rose"
          footer={`${unpaidPercent}% of total students`}
        />
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Payment Status</h2>
              <p className="mt-1 text-sm text-slate-500">Track tuition health across enrolled students.</p>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
              Last 30 days
            </span>
          </div>
          <div className="mt-6 space-y-5">
            <div>
              <div className="flex items-center justify-between text-sm text-slate-500">
                <span>Paid Students</span>
                <span className="font-semibold text-slate-700">{paidPercent}%</span>
              </div>
              <div className="mt-2 h-2 rounded-full bg-slate-100">
                <div
                  className="h-2 rounded-full bg-emerald-500"
                  style={{ width: `${paidPercent}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between text-sm text-slate-500">
                <span>Unpaid Students</span>
                <span className="font-semibold text-slate-700">{unpaidPercent}%</span>
              </div>
              <div className="mt-2 h-2 rounded-full bg-slate-100">
                <div
                  className="h-2 rounded-full bg-rose-500"
                  style={{ width: `${unpaidPercent}%` }}
                />
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200/70 bg-slate-50/80 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-700">Payment Follow-Up</p>
                  <p className="mt-1 text-xs text-slate-500">Focus on unpaid students this week.</p>
                </div>
                <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-600">
                  {stats.unpaidStudents} Pending
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Highlights</h2>
          <p className="mt-1 text-sm text-slate-500">Quick insights to keep you aligned.</p>
          <div className="mt-6 space-y-4">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-50 text-sky-600">
                <BookOpen size={18} />
              </span>
              <div>
                <p className="text-sm font-semibold text-slate-700">Course Health</p>
                <p className="text-xs text-slate-500">Review course completion and update content.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                <Users size={18} />
              </span>
              <div>
                <p className="text-sm font-semibold text-slate-700">Engagement Pulse</p>
                <p className="text-xs text-slate-500">Keep learners active with reminders.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
                <Award size={18} />
              </span>
              <div>
                <p className="text-sm font-semibold text-slate-700">Certificate Flow</p>
                <p className="text-xs text-slate-500">Ensure approvals are handled promptly.</p>
              </div>
            </div>
          </div>
          <Link
            href="/admin-dashboard/certificates"
            className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-700 transition hover:text-slate-900"
          >
            Review certificates
            <ArrowUpRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
