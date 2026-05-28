"use client";

import { useState } from "react";
import AdHeader from "@/components/admin/header";
import BarChart from "@/components/admin/chart/bar-chart";
import LineChart from "@/components/admin/chart/line-chart";
import DoughnutChart from "@/components/admin/chart/doughnut-chart";
import {
  SHIFTS,
  STATUS_CONFIG,
  WEEKDAYS,
  SCHEDULE_SUMMARY,
  type ShiftStatus,
} from "@/data/admin";

export default function ActivitiesPage() {
  const [activeChart, setActiveChart] = useState<"bar" | "line" | "doughnut">("bar");
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = SHIFTS.filter(
    (s) =>
      s.employee.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.dept.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen text-slate-100 relative overflow-hidden">
      <AdHeader />

      {/* Ambient background glows */}
      <div className="absolute top-[-15%] right-[-10%] w-[55vw] h-[55vw] rounded-full bg-violet-500/8 blur-[130px] pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[55vw] h-[55vw] rounded-full bg-sky-600/8 blur-[140px] pointer-events-none z-0" />

      <main className="relative z-10 max-w-7xl mx-auto px-4 py-8 md:px-6 space-y-8">

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">Рабочие графики</h1>
            <p className="text-sm text-slate-400 mt-1">Аналитика смен, графики и распределение нагрузки</p>
          </div>
          <button className="self-start sm:self-auto bg-linear-to-r from-sky-500 to-blue-600 hover:opacity-90 text-white font-bold px-5 py-2.5 rounded-2xl shadow-lg shadow-sky-500/20 transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98] flex items-center gap-2 text-sm cursor-pointer">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Новый график
          </button>
        </div>

        {/* Summary Cards — from @/data/admin → SCHEDULE_SUMMARY */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {SCHEDULE_SUMMARY.map((card, i) => (
            <div key={i} className="rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl p-5 hover:border-white/20 hover:-translate-y-0.5 transition-all duration-300 shadow-lg">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-2xl bg-linear-to-r ${card.color} flex items-center justify-center text-lg shadow-md`}>
                  {card.icon}
                </div>
                <p className="text-xs text-slate-400 font-medium leading-tight">{card.label}</p>
              </div>
              <p className="text-2xl md:text-3xl font-extrabold text-white">{card.value}</p>
              <p className="text-[10px] text-slate-500 mt-1">{card.sub}</p>
            </div>
          ))}
        </div>

        {/* Chart Switcher + Display */}
        <div className="rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl p-6 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-base font-bold text-white">Аналитика графиков</h2>
              <p className="text-xs text-slate-400 mt-0.5">Выберите тип визуализации</p>
            </div>
            <div className="flex gap-1.5 p-1 bg-white/5 border border-white/10 rounded-2xl self-start sm:self-auto">
              {(["bar", "line", "doughnut"] as const).map((type) => {
                const labels = { bar: "Посещаемость", line: "Часы работы", doughnut: "Отделы" };
                return (
                  <button
                    key={type}
                    onClick={() => setActiveChart(type)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${activeChart === type
                        ? "bg-sky-500 text-white shadow-md shadow-sky-500/30"
                        : "text-slate-400 hover:text-white hover:bg-white/5"
                      }`}
                  >
                    {labels[type]}
                  </button>
                );
              })}
            </div>
          </div>
          <div key={activeChart}>
            {activeChart === "bar" && <BarChart />}
            {activeChart === "line" && <LineChart />}
            {activeChart === "doughnut" && <DoughnutChart />}
          </div>
        </div>

        {/* Weekly shift heatmap — SHIFTS & WEEKDAYS from @/data/admin */}
        <div className="rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl p-6 shadow-xl">
          <h2 className="text-base font-bold text-white mb-2">Сетка рабочих смен</h2>
          <p className="text-xs text-slate-400 mb-5">Визуальное расписание по дням недели</p>
          <div className="overflow-x-auto">
            <table className="w-full min-w-160 text-sm">
              <thead>
                <tr>
                  <th className="text-left text-xs font-semibold text-slate-400 pb-3 pr-4 whitespace-nowrap">Сотрудник</th>
                  {WEEKDAYS.map((day) => (
                    <th key={day} className="text-center text-xs font-semibold text-slate-400 pb-3 px-2">{day}</th>
                  ))}
                  <th className="text-left text-xs font-semibold text-slate-400 pb-3 pl-4">Статус</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((row) => (
                  <tr key={row.id} className="hover:bg-white/5 transition duration-200">
                    <td className="py-3 pr-4">
                      <p className="text-sm font-semibold text-white whitespace-nowrap">{row.employee}</p>
                      <p className="text-[10px] text-slate-400">{row.dept}</p>
                    </td>
                    {WEEKDAYS.map((day) => (
                      <td key={day} className="text-center py-3 px-2">
                        {row.days.includes(day) ? (
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-sky-500/20 border border-sky-400/30">
                            <span className="w-2 h-2 rounded-full bg-sky-400" />
                          </span>
                        ) : (
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-white/5">
                            <span className="w-2 h-2 rounded-full bg-white/10" />
                          </span>
                        )}
                      </td>
                    ))}
                    <td className="py-3 pl-4">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${STATUS_CONFIG[row.status as ShiftStatus].color}`}>
                        {STATUS_CONFIG[row.status as ShiftStatus].label}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Shift List with search — SHIFTS from @/data/admin */}
        <div className="rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl p-6 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
            <div>
              <h2 className="text-base font-bold text-white">Список назначенных смен</h2>
              <p className="text-xs text-slate-400 mt-0.5">Детальное расписание сотрудников</p>
            </div>
            <div className="relative self-start sm:self-auto">
              <svg className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Поиск сотрудника..."
                className="bg-white/5 border border-white/10 rounded-2xl pl-9 pr-4 py-2 text-sm text-white placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500/40 transition w-full sm:w-48"
              />
            </div>
          </div>

          <div className="space-y-3">
            {filtered.map((shift) => (
              <div key={shift.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white/3 border border-white/5 hover:border-white/15 p-4 rounded-2xl transition duration-200 hover:bg-white/5">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-linear-to-r from-sky-500/20 to-blue-600/20 border border-sky-400/20 flex items-center justify-center shrink-0">
                    <span className="text-sky-400 font-bold text-sm">{shift.employee.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{shift.employee}</p>
                    <p className="text-xs text-slate-400">{shift.dept} · {shift.shift}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {WEEKDAYS.map((day) => (
                    <span key={day} className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border ${shift.days.includes(day) ? "bg-sky-500/15 text-sky-300 border-sky-400/20" : "bg-white/5 text-slate-600 border-white/5"}`}>
                      {day}
                    </span>
                  ))}
                  <span className={`ml-2 text-[10px] font-bold px-2.5 py-1 rounded-full border ${STATUS_CONFIG[shift.status as ShiftStatus].color}`}>
                    {STATUS_CONFIG[shift.status as ShiftStatus].label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
}
