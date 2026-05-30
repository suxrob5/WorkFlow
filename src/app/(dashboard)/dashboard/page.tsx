"use client";

import { useState } from "react";
import Stats from "@/components/admin/stats";
import AdHeader from "@/components/admin/header";
import PieChart from "@/components/admin/chart/pie-chart";
import BarChart from "@/components/admin/chart/bar-chart";
import AttendanceFeed from "@/components/admin/attendance-feed";
import { BAR_CHART_DATA, PIE_CHART_DATA, LINE_CHART_DATA } from "@/data/admin";

const Dashboard = () => {
  const [charts, setCharts] = useState({
    bar: BAR_CHART_DATA,
    pie: PIE_CHART_DATA,
    line: LINE_CHART_DATA,
  });

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
            Обновлено только что
          </div>
        </div>

        {/* KPI Stats — live from Firebase */}
        <Stats setCharts={setCharts} />
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
          <AttendanceFeed />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
