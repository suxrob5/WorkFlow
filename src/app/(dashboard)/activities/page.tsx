"use client";

import { useEffect, useState } from "react";
import AdHeader from "@/components/admin/header";
import BarChart from "@/components/admin/chart/bar-chart";
import LineChart from "@/components/admin/chart/line-chart";
import DoughnutChart from "@/components/admin/chart/doughnut-chart";
import {
  seedDatabaseIfEmpty,
  getScheduleSummary,
  getShiftsFromFirestore,
  getChartsData,
} from "@/firebase/db";
import { STATUS_CONFIG, WEEKDAYS, type ShiftStatus } from "@/data/admin";

export default function ActivitiesPage() {
  const [activeChart, setActiveChart] = useState<"bar" | "line" | "doughnut">(
    "bar",
  );
  const [summary, setSummary] = useState<any[]>([]);
  const [shifts, setShifts] = useState<any[]>([]);
  const [charts, setCharts] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadActivitiesData = async () => {
      try {
        setLoading(true);
        // Ensure database is seeded with mock data if it is empty
        await seedDatabaseIfEmpty();

        const liveSummary = await getScheduleSummary();
        const liveShifts = await getShiftsFromFirestore();
        const liveCharts = await getChartsData();

        setSummary(liveSummary);
        setShifts(liveShifts);
        setCharts(liveCharts);
      } catch (error) {
        console.error("Error loading activities data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadActivitiesData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen text-slate-800 dark:text-slate-100 relative overflow-hidden transition-colors duration-300">
        <AdHeader />

        {/* Ambient background glows */}
        <div className="absolute top-[-15%] right-[-10%] w-[55vw] h-[55vw] rounded-full bg-violet-500/8 blur-[130px] pointer-events-none z-0" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[55vw] h-[55vw] rounded-full bg-sky-600/8 blur-[140px] pointer-events-none z-0" />

        <main className="relative z-10 max-w-7xl mx-auto px-4 py-8 md:px-6 space-y-8 animate-pulse">
          {/* Skeleton Header */}
          <div className="space-y-2">
            <div className="h-8 w-64 bg-slate-200 dark:bg-white/10 rounded-2xl" />
            <div className="h-4 w-96 bg-slate-200 dark:bg-white/5 rounded-xl" />
          </div>

          {/* Skeleton Summary Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="rounded-3xl bg-white/60 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 p-5 h-28 flex flex-col justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-slate-300 dark:bg-white/10" />
                  <div className="h-4 w-20 bg-slate-300 dark:bg-white/10 rounded-md" />
                </div>
                <div className="h-6 w-12 bg-slate-300 dark:bg-white/10 rounded-lg" />
              </div>
            ))}
          </div>

          {/* Skeleton Chart */}
          <div className="h-95 rounded-3xl bg-white/60 dark:bg-white/5 border border-slate-200/60 dark:border-white/10" />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-slate-800 dark:text-slate-100 relative overflow-hidden transition-colors duration-300">
      <AdHeader />

      {/* Ambient background glows */}
      <div className="absolute top-[-15%] right-[-10%] w-[55vw] h-[55vw] rounded-full bg-violet-500/8 blur-[130px] pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[55vw] h-[55vw] rounded-full bg-sky-600/8 blur-[140px] pointer-events-none z-0" />

      <main className="relative z-10 max-w-7xl mx-auto px-4 py-8 md:px-6 space-y-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Рабочие графики
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Аналитика смен, графики и распределение нагрузки
            </p>
          </div>
          <button className="self-start sm:self-auto bg-linear-to-r from-sky-500 to-blue-600 hover:opacity-90 text-white font-bold px-5 py-2.5 rounded-2xl shadow-lg shadow-sky-500/20 transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98] flex items-center gap-2 text-sm cursor-pointer">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Новый график
          </button>
        </div>

        {/* Summary Cards — from Firebase */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {summary.map((card, i) => (
            <div
              key={i}
              className="rounded-3xl bg-white/60 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 backdrop-blur-xl p-5 hover:border-slate-300 dark:hover:border-white/20 hover:-translate-y-0.5 transition-all duration-300 shadow-md dark:shadow-lg"
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className={`w-10 h-10 rounded-2xl bg-linear-to-r ${card.color} flex items-center justify-center text-lg shadow-md`}
                >
                  {card.icon}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-bold leading-tight">
                  {card.label}
                </p>
              </div>
              <p className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white">
                {card.value}
              </p>
              <p className="text-[10px] text-slate-500 dark:text-slate-500 mt-1">
                {card.sub}
              </p>
            </div>
          ))}
        </div>

        {/* Chart Switcher + Display */}
        <div className="rounded-3xl bg-white/60 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 backdrop-blur-xl p-6 shadow-md dark:shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Аналитика графиков
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Выберите тип визуализации
              </p>
            </div>
            <div className="flex gap-1.5 p-1 bg-white/40 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl self-start sm:self-auto">
              {(["bar", "line", "doughnut"] as const).map((type) => {
                const labels = {
                  bar: "Посещаемость",
                  line: "Часы работы",
                  doughnut: "Отделы",
                };
                return (
                  <button
                    key={type}
                    onClick={() => setActiveChart(type)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                      activeChart === type
                        ? "bg-sky-500 text-white shadow-md shadow-sky-500/30"
                        : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5"
                    }`}
                  >
                    {labels[type]}
                  </button>
                );
              })}
            </div>
          </div>
          <div key={activeChart} className="">
            {activeChart === "bar" && <BarChart data={charts?.bar} />}
            {activeChart === "line" && <LineChart data={charts?.line} />}
            {activeChart === "doughnut" && (
              <DoughnutChart data={charts?.doughnut} />
            )}
          </div>
        </div>

        {/* Weekly shift heatmap — from Firebase */}
        <div className="rounded-3xl bg-white/60 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 backdrop-blur-xl p-6 shadow-md dark:shadow-xl">
          <h2 className="text-base font-bold text-slate-900 dark:text-white mb-2">
            Сетка рабочих смен
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">
            Визуальное расписание по дням недели
          </p>
          <div className="overflow-x-auto">
            <table className="w-full min-w-160 text-sm">
              <thead>
                <tr>
                  <th className="text-left text-xs font-semibold text-slate-500 dark:text-slate-400 pb-3 pr-4 whitespace-nowrap">
                    Сотрудник
                  </th>
                  {WEEKDAYS.map((day) => (
                    <th
                      key={day}
                      className="text-center text-xs font-semibold text-slate-500 dark:text-slate-400 pb-3 px-2"
                    >
                      {day}
                    </th>
                  ))}
                  <th className="text-left text-xs font-semibold text-slate-500 dark:text-slate-400 pb-3 pl-4">
                    Статус
                  </th>
                </tr>
              </thead>
              <tbody>
                {shifts.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-white/30 dark:hover:bg-white/5 transition duration-200"
                  >
                    <td className="py-3 pr-4">
                      <p className="text-sm font-bold text-slate-900 dark:text-white whitespace-nowrap">
                        {row.employee}
                      </p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">
                        {row.dept}
                      </p>
                    </td>
                    {WEEKDAYS.map((day) => (
                      <td key={day} className="text-center py-3 px-2">
                        {row.days && row.days.includes(day) ? (
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-sky-500/20 border border-sky-400/30">
                            <span className="w-2 h-2 rounded-full bg-sky-400" />
                          </span>
                        ) : (
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200/50 dark:border-transparent">
                            <span className="w-2 h-2 rounded-full bg-slate-300 dark:bg-white/10" />
                          </span>
                        )}
                      </td>
                    ))}
                    <td className="py-3 pl-4">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                          STATUS_CONFIG[row.status as ShiftStatus]?.color || ""
                        }`}
                      >
                        {STATUS_CONFIG[row.status as ShiftStatus]?.label ||
                          row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
