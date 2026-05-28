"use client";

import AdHeader from "@/components/admin/header";
import PieChart from "@/components/admin/chart/pie-chart";
import BarChart from "@/components/admin/chart/bar-chart";
import LineChart from "@/components/admin/chart/line-chart";
import Users from "@/components/admin/users";
import { DASHBOARD_STATS } from "@/data/admin";

// SVG icons for each stat card (order matches DASHBOARD_STATS)
const STAT_ICONS = [
  <svg key="users" className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>,
  <svg key="check" className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>,
  <svg key="absent" className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
  </svg>,
  <svg key="trend" className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>,
];

const Dashboard = () => {
  return (
    <div className="min-h-screen text-slate-100 relative overflow-hidden">
      <AdHeader />

      {/* Ambient glows */}
      <div className="absolute top-[-15%] left-[-10%] w-[55vw] h-[55vw] rounded-full bg-sky-500/8 blur-[130px] pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[55vw] h-[55vw] rounded-full bg-blue-600/8 blur-[140px] pointer-events-none z-0" />

      <main className="relative z-10 max-w-7xl mx-auto px-4 py-8 md:px-6 space-y-8">

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">Панель управления</h1>
            <p className="text-sm text-slate-400 mt-1">Общая аналитика по сотрудникам и сменам</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400 bg-white/5 border border-white/10 rounded-2xl px-4 py-2.5 self-start sm:self-auto">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Обновлено только что
          </div>
        </div>

        {/* KPI Stats — data from @/data/admin */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {DASHBOARD_STATS.map((stat, i) => (
            <div key={i} className={`rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl p-5 flex flex-col gap-4 hover:border-white/20 transition-all duration-300 hover:-translate-y-0.5 shadow-lg ${stat.glow}`}>
              <div className="flex items-center justify-between">
                <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white shadow-lg`}>
                  {STAT_ICONS[i]}
                </div>
                <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-400/20">
                  {stat.delta}
                </span>
              </div>
              <div>
                <p className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">{stat.value}</p>
                <p className="text-xs text-slate-400 mt-0.5 font-medium">{stat.label}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">{stat.deltaLabel}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Row 1: Bar + Pie */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-base font-bold text-white">Посещаемость по дням недели</h2>
                <p className="text-xs text-slate-400 mt-0.5">Присутствие vs отсутствие за неделю</p>
              </div>
              <span className="text-xs text-sky-400 bg-sky-500/10 border border-sky-400/20 px-3 py-1 rounded-full font-semibold">Эта неделя</span>
            </div>
            <BarChart />
          </div>
          <div className="rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl p-6 shadow-xl">
            <div className="mb-5">
              <h2 className="text-base font-bold text-white">Явка сегодня</h2>
              <p className="text-xs text-slate-400 mt-0.5">Пришли vs не пришли</p>
            </div>
            <PieChart />
          </div>
        </div>

        {/* Charts Row 2: Line */}
        <div className="rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-base font-bold text-white">Рабочие часы за год</h2>
              <p className="text-xs text-slate-400 mt-0.5">Фактические vs сверхурочные часы по месяцам</p>
            </div>
            <span className="text-xs text-violet-400 bg-violet-500/10 border border-violet-400/20 px-3 py-1 rounded-full font-semibold">2026 год</span>
          </div>
          <LineChart />
        </div>

        {/* Employee List */}
        <div className="rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl p-6 md:p-8 shadow-xl">
          <Users />
        </div>

      </main>
    </div>
  );
};

export default Dashboard;