"use client";

import { useEffect, useState } from "react";
import { STAT_ICONS } from "@/assets/logos/images";
import { StatCard } from "@/types";
import {
  getTodayAbsentUsers,
  getTodayLateUsers,
  getTodayPresentUsers,
  getUsers,
  getDashboardChartsFromFirestore,
} from "@/firebase/db";
import Modal from "./modal";
const Stats = ({ setCharts }: any) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [totalUsers, setTotalUsers] = useState<any>(null);
  const [todayPresent, setTodayPresent] = useState<any>(null);
  const [todayLate, setTodayLate] = useState<any>(null);
  const [todayAbsent, setTodayAbsent] = useState<any>(null);
  const [modalData, setModalData] = useState<any>("");
  useEffect(() => {
    const loadStats = async () => {
      try {
        const [
          totalUsers,
          todayPresent,
          todayLate,
          todayAbsent,
          dashboardCharts,
        ] = await Promise.all([
          getUsers(),
          getTodayPresentUsers(),
          getTodayLateUsers(),
          getTodayAbsentUsers(),
          getDashboardChartsFromFirestore(),
        ]);
        setTotalUsers(totalUsers);
        setTodayPresent(todayPresent);
        setTodayLate(todayLate);
        setTodayAbsent(todayAbsent);
        setCharts(dashboardCharts);
      } catch (error) {
        console.error("Error loading dashboard stats:", error);
        const emptyStats = { users: [], size: 0 };
        setTotalUsers(emptyStats);
        setTodayPresent(emptyStats);
        setTodayLate(emptyStats);
        setTodayAbsent(emptyStats);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [setCharts]);

  if (loading || !totalUsers || !todayPresent || !todayLate || !todayAbsent) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded-3xl bg-white/60 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 backdrop-blur-xl p-5 h-36 flex flex-col justify-between shadow-md dark:shadow-lg animate-pulse"
          >
            <div className="flex items-center justify-between">
              <div className="w-11 h-11 rounded-2xl bg-slate-200 dark:bg-white/10" />
              <div className="h-6 w-12 rounded-full bg-slate-200 dark:bg-white/10" />
            </div>
            <div className="space-y-2">
              <div className="h-8 w-20 rounded-xl bg-slate-200 dark:bg-white/10" />
              <div className="h-4 w-32 rounded-lg bg-slate-200 dark:bg-white/10" />
              <div className="h-3 w-24 rounded-lg bg-slate-200 dark:bg-white/5" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  const DASHBOARD_STATS: StatCard[] = [
    {
      label: "Всего сотрудников",
      value: `${totalUsers.size ?? 0}`,
      delta: "",
      modalInfo: totalUsers.users ?? [],
      deltaLabel: "активные сотрудники",
      color: "from-sky-500 to-blue-600",
      glow: "shadow-sky-500/25",
    },
    {
      label: "Сегодня пришли",
      value: `${todayPresent.size ?? 0}`,
      delta: "",
      modalInfo: todayPresent.users ?? [],
      deltaLabel: "отметились сегодня",
      color: "from-emerald-500 to-teal-600",
      glow: "shadow-emerald-500/25",
    },
    {
      label: "Отсутствовали",
      value: `${todayAbsent.size ?? 0}`,
      delta: "",
      modalInfo: todayAbsent.users ?? [],
      deltaLabel: "не пришли сегодня",
      color: "from-amber-500 to-orange-600",
      glow: "shadow-amber-500/25",
    },
    {
      label: "Опоздавшие",
      value: `${todayLate.size ?? 0}`,
      delta: "",
      modalInfo: todayLate.users ?? [],
      deltaLabel: "опоздали сегодня",
      color: "from-rose-500 to-red-600",
      glow: "shadow-rose-500/25",
    },
  ];
  const handleOpen = (modalInfo: any, name: string, value: string) => {
    setOpen(true);
    setModalData({ modalInfo, name, value });
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <Modal open={open} modalData={modalData} onClose={() => setOpen(false)} />
      {DASHBOARD_STATS.map((stat, i) => (
        <div
          key={i}
          onClick={() => handleOpen(stat.modalInfo, stat.label, stat.value)}
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
  );
};

export default Stats;
