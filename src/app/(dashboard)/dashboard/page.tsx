"use client";

import { useEffect, useState } from "react";
import AdHeader from "@/components/admin/header";
import PieChart from "@/components/admin/chart/pie-chart";
import BarChart from "@/components/admin/chart/bar-chart";
import LineChart from "@/components/admin/chart/line-chart";
import Users from "@/components/admin/users";
import {
  seedDatabaseIfEmpty,
  getDashboardStats,
  getChartsData,
  getAttendanceFeed,
} from "@/firebase/db";

// SVG icons for each stat card
const STAT_ICONS = [
  <svg
    key="users"
    className="w-6 h-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>,
  <svg
    key="check"
    className="w-6 h-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>,
  <svg
    key="absent"
    className="w-6 h-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
    />
  </svg>,
  <svg
    key="trend"
    className="w-6 h-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
    />
  </svg>,
];

const Dashboard = () => {
  const [stats, setStats] = useState<any[]>([]);
  const [charts, setCharts] = useState<any>(null);
  const [attendanceFeed, setAttendanceFeed] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        // Guarantee database is seeded with mock data if it is empty
        await seedDatabaseIfEmpty();

        // Retrieve live data
        const liveStats = await getDashboardStats();
        const liveCharts = await getChartsData();
        const liveFeed = await getAttendanceFeed();

        setStats(liveStats);
        setCharts(liveCharts);
        setAttendanceFeed(liveFeed);
      } catch (error) {
        console.error("Error fetching Firestore dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen text-slate-800 dark:text-slate-100 relative overflow-hidden transition-colors duration-300">
        <AdHeader />
        {/* Ambient glows */}
        <div className="absolute top-[-15%] left-[-10%] w-[55vw] h-[55vw] rounded-full bg-sky-500/8 blur-[130px] pointer-events-none z-0" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[55vw] h-[55vw] rounded-full bg-blue-600/8 blur-[140px] pointer-events-none z-0" />

        <main className="relative z-10 max-w-7xl mx-auto px-4 py-8 md:px-6 space-y-8 animate-pulse">
          {/* Skeleton Header */}
          <div className="space-y-2">
            <div className="h-8 w-64 bg-slate-200 dark:bg-white/10 rounded-2xl" />
            <div className="h-4 w-96 bg-slate-200 dark:bg-white/5 rounded-xl" />
          </div>

          {/* Skeleton KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="rounded-3xl bg-white/60 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 p-5 h-36 flex flex-col justify-between"
              >
                <div className="flex justify-between items-center">
                  <div className="w-11 h-11 rounded-2xl bg-slate-300 dark:bg-white/10" />
                  <div className="w-12 h-6 bg-slate-300 dark:bg-white/10 rounded-full" />
                </div>
                <div className="space-y-1.5">
                  <div className="h-6 w-16 bg-slate-300 dark:bg-white/10 rounded-lg" />
                  <div className="h-4 w-28 bg-slate-300 dark:bg-white/5 rounded-md" />
                </div>
              </div>
            ))}
          </div>

          {/* Skeleton Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 h-[380px] rounded-3xl bg-white/60 dark:bg-white/5 border border-slate-200/60 dark:border-white/10" />
            <div className="h-[380px] rounded-3xl bg-white/60 dark:bg-white/5 border border-slate-200/60 dark:border-white/10" />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-slate-800 dark:text-slate-100 relative overflow-hidden transition-colors duration-300">
      <AdHeader />

      {/* Ambient glows */}
      <div className="absolute top-[-15%] left-[-10%] w-[55vw] h-[55vw] rounded-full bg-sky-500/8 blur-[130px] pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[55vw] h-[55vw] rounded-full bg-blue-600/8 blur-[140px] pointer-events-none z-0" />

      <main className="relative z-10 max-w-7xl mx-auto px-4 py-8 md:px-6 space-y-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Панель управления
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Общая аналитика по сотрудникам и сменам
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 bg-white/60 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 rounded-2xl px-4 py-2.5 self-start sm:self-auto shadow-sm backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Обновлено только что (Firebase)
          </div>
        </div>

        {/* KPI Stats — live from Firebase */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <div
              key={i}
              className={`rounded-3xl bg-white/60 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 backdrop-blur-xl p-5 flex flex-col gap-4 hover:border-slate-300 dark:hover:border-white/20 transition-all duration-300 hover:-translate-y-0.5 shadow-md dark:shadow-lg ${stat.glow || ""}`}
            >
              <div className="flex items-center justify-between">
                <div
                  className={`w-11 h-11 rounded-2xl bg-linear-to-r ${stat.color} flex items-center justify-center text-white shadow-lg`}
                >
                  {STAT_ICONS[i]}
                </div>
                <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-400/15 dark:border-emerald-400/20">
                  {stat.delta}
                </span>
              </div>
              <div>
                <p className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {stat.value}
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 font-bold">
                  {stat.label}
                </p>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  {stat.deltaLabel}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Row 1: Bar + Pie */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-3xl bg-white/60 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 backdrop-blur-xl p-6 shadow-md dark:shadow-xl">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Посещаемость по дням недели
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Присутствие vs отсутствие за неделю
                </p>
              </div>
              <span className="text-xs text-sky-600 dark:text-sky-400 bg-sky-500/10 border border-sky-400/15 dark:border-sky-400/20 px-3 py-1 rounded-full font-bold">
                Эта неделя
              </span>
            </div>
            <BarChart data={charts?.bar} />
          </div>
          <div className="rounded-3xl bg-white/60 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 backdrop-blur-xl p-6 shadow-md dark:shadow-xl">
            <div className="mb-5">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Явка сегодня
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Пришли vs не пришли
              </p>
            </div>
            <PieChart data={charts?.pie} />
          </div>
        </div>

        {/* Charts Row 2: Line */}
        <div className="rounded-3xl bg-white/60 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 backdrop-blur-xl p-6 shadow-md dark:shadow-xl">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Рабочие часы за год
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Фактические vs сверхурочные часы по месяцам
              </p>
            </div>
            <span className="text-xs text-violet-600 dark:text-violet-400 bg-violet-500/10 border border-violet-400/15 dark:border-violet-400/20 px-3 py-1 rounded-full font-bold">
              2026 год
            </span>
          </div>
          <LineChart data={charts?.line} />
        </div>

        {/* Recent Attendance Check-ins (Photo + Map Location) */}
        <div className="rounded-3xl bg-white/60 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 backdrop-blur-xl p-6 md:p-8 shadow-md dark:shadow-xl space-y-6 transition-all duration-300">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              Живая лента отметок присутствия
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Фотографии и координаты сотрудников в реальном времени при
              фиксации смен
            </p>
          </div>

          {attendanceFeed.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
              {attendanceFeed.slice(0, 6).map((feed) => (
                <div
                  key={feed.id}
                  className="rounded-2xl border border-slate-200/50 dark:border-white/5 bg-white/40 dark:bg-white/3 overflow-hidden flex flex-col hover:border-slate-300 dark:hover:border-white/15 transition-all duration-300 shadow-sm"
                >
                  {/* Photo Container */}
                  <div className="aspect-video w-full bg-slate-100 dark:bg-[#021236]/30 relative overflow-hidden group">
                    {feed.image ? (
                      <img
                        src={feed.image}
                        alt={`${feed.employeeName} selfie`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 gap-2">
                        <svg
                          className="w-8 h-8"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        <span className="text-xs">Фото отсутствует</span>
                      </div>
                    )}
                    <span className="absolute top-3 right-3 text-[10px] font-bold bg-slate-900/80 dark:bg-slate-950/80 text-white px-2.5 py-1 rounded-full border border-white/10 backdrop-blur-md">
                      {feed.timestamp}
                    </span>
                  </div>

                  {/* Profile & Location details */}
                  <div className="p-4 flex-1 flex flex-col justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={feed.employeeAvatar}
                        alt={feed.employeeName}
                        className="w-10 h-10 rounded-full border-2 border-slate-200 dark:border-white/10 object-cover shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                          {feed.employeeName}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                          {feed.employeePosition}
                        </p>
                      </div>
                    </div>

                    {/* Geolocation Button Link */}
                    {feed.location ? (
                      <a
                        href={`https://www.google.com/maps?q=${feed.location.latitude},${feed.location.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between text-xs text-sky-600 dark:text-sky-400 bg-sky-500/10 hover:bg-sky-500/25 border border-sky-400/20 px-3 py-2.5 rounded-xl font-bold transition duration-200 active:scale-[0.98]"
                      >
                        <span className="flex items-center gap-1.5 min-w-0">
                          <svg
                            className="w-4 h-4 text-sky-500 shrink-0"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                          <span className="truncate">
                            {feed.location.latitude.toFixed(5)},{" "}
                            {feed.location.longitude.toFixed(5)}
                          </span>
                        </span>
                        <span className="shrink-0 text-[10px] bg-sky-500/20 px-2 py-0.5 rounded-md border border-sky-400/20">
                          Карта ↗
                        </span>
                      </a>
                    ) : (
                      <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-slate-100 dark:bg-white/5 px-3 py-2 rounded-xl">
                        <span className="w-2 h-2 rounded-full bg-slate-300 dark:bg-white/10" />
                        <span>Координаты отсутствуют</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-200 dark:border-white/10 p-8 text-center text-slate-500 dark:text-slate-400">
              <p className="text-sm font-semibold">
                Нет недавних отметок сотрудников
              </p>
              <p className="text-xs mt-1">
                Отметки сотрудников с селфи-фото и координатами появятся здесь в
                реальном времени.
              </p>
            </div>
          )}
        </div>

        {/* Employee List */}
        <div className="rounded-3xl bg-white/60 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 backdrop-blur-xl p-6 md:p-8 shadow-md dark:shadow-xl transition-all duration-300">
          <Users />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
