"use client";

import { useEffect, useState } from "react";
import { BAR_CHART_DATA, PIE_CHART_DATA, LINE_CHART_DATA } from "@/data/admin";
import { STAT_ICONS } from "@/assets/logos/images";
import { StatCard } from "@/types";
import {
  getTodayAbsentUsers,
  getTodayLateUsers,
  getTodayPresentUsers,
  getUsers,
} from "@/firebase/db";
import Modal from "./modal";
const Stats = ({ setCharts }: any) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [totalUsers, setTotalUsers] = useState<any>("");
  const [todayPresent, setTodayPresent] = useState<any>("");
  const [todayLate, setTodayLate] = useState<any>("");
  const [todayAbsent, setTodayAbsent] = useState<any>("");
  const [modalData, setModalData] = useState<any>("");
  useEffect(() => {
    const loadStats = async () => {
      const totalUsers = await getUsers();
      const todayPresent = await getTodayPresentUsers();
      const todayLate = await getTodayLateUsers();
      const todayAbsent = await getTodayAbsentUsers();
      setTotalUsers(totalUsers);
      setTodayPresent(todayPresent);
      setTodayLate(todayLate);
      setTodayAbsent(todayAbsent);
      setLoading(false);
    };

    loadStats();

    setCharts({
      bar: BAR_CHART_DATA,
      pie: PIE_CHART_DATA,
      line: LINE_CHART_DATA,
    });
    setLoading(false);
  }, []);

  const DASHBOARD_STATS: StatCard[] = [
    {
      label: "Всего сотрудников",
      value: `${totalUsers.size}`,
      delta: "",
      modalInfo: totalUsers.users,
      deltaLabel: "активные сотрудники",
      color: "from-sky-500 to-blue-600",
      glow: "shadow-sky-500/25",
    },
    {
      label: "Сегодня пришли",
      value: `${todayPresent.size}`,
      delta: "",
      modalInfo: todayPresent.users,
      deltaLabel: "отметились сегодня",
      color: "from-emerald-500 to-teal-600",
      glow: "shadow-emerald-500/25",
    },
    {
      label: "Отсутствовали",
      value: `${todayLate.size}`,
      delta: "",
      modalInfo: todayLate.users,
      deltaLabel: "не пришли сегодня",
      color: "from-amber-500 to-orange-600",
      glow: "shadow-amber-500/25",
    },
    {
      label: "Опоздавшие",
      value: `${todayAbsent.size}`,
      delta: "",
      modalInfo: todayAbsent.users,
      deltaLabel: "опоздали сегодня",
      color: "from-rose-500 to-red-600",
      glow: "shadow-rose-500/25",
    },
  ];
  const handleOpen = (modalInfo: any, name: string, value: string) => {
    setOpen(true);
    console.log(modalInfo);
    setModalData({ modalInfo, name, value });
  };
  console.log(modalData);

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

//   if (loading) {
//     return (
//       <div className="min-h-screen text-slate-800 dark:text-slate-100 relative overflow-hidden transition-colors duration-300">
//         <AdHeader />
//         {/* Ambient glows */}
//         <div className="absolute top-[-15%] left-[-10%] w-[55vw] h-[55vw] rounded-full bg-sky-500/8 blur-[130px] pointer-events-none z-0" />
//         <div className="absolute bottom-[-10%] right-[-10%] w-[55vw] h-[55vw] rounded-full bg-blue-600/8 blur-[140px] pointer-events-none z-0" />

//         <main className="relative z-10 max-w-7xl mx-auto px-4 py-8 md:px-6 space-y-8 animate-pulse">
//           {/* Skeleton Header */}
//           <div className="space-y-2">
//             <div className="h-8 w-64 bg-slate-200 dark:bg-white/10 rounded-2xl" />
//             <div className="h-4 w-96 bg-slate-200 dark:bg-white/5 rounded-xl" />
//           </div>

//           {/* Skeleton KPI Cards */}
//           <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
//             {[0, 1, 2, 3].map((i) => (
//               <div
//                 key={i}
//                 className="rounded-3xl bg-white/60 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 p-5 h-36 flex flex-col justify-between"
//               >
//                 <div className="flex justify-between items-center">
//                   <div className="w-11 h-11 rounded-2xl bg-slate-300 dark:bg-white/10" />
//                   <div className="w-12 h-6 bg-slate-300 dark:bg-white/10 rounded-full" />
//                 </div>
//                 <div className="space-y-1.5">
//                   <div className="h-6 w-16 bg-slate-300 dark:bg-white/10 rounded-lg" />
//                   <div className="h-4 w-28 bg-slate-300 dark:bg-white/5 rounded-md" />
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* Skeleton Charts */}
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//             <div className="lg:col-span-2 h-[95] rounded-3xl bg-white/60 dark:bg-white/5 border border-slate-200/60 dark:border-white/10" />
//             <div className="h-[95] rounded-3xl bg-white/60 dark:bg-white/5 border border-slate-200/60 dark:border-white/10" />
//           </div>
//         </main>
//       </div>
//     );
//   }
