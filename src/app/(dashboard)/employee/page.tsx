"use client";

import Header from "@/components/admin/header";
import { STATUS_CONFIG, WEEKDAYS, type ShiftStatus } from "@/data/admin";
import { getShiftsFromFirestore, seedDatabaseIfEmpty } from "@/firebase/db";
import { useEffect, useState } from "react";

const Users = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [shifts, setShifts] = useState<any[]>([]);

  useEffect(() => {
    const loadActivitiesData = async () => {
      try {
        // Ensure database is seeded with mock data if it is empty
        await seedDatabaseIfEmpty();
        const liveShifts = await getShiftsFromFirestore();

        setShifts(liveShifts);
      } catch (error) {
        console.error("Error loading activities data:", error);
      }
    };

    loadActivitiesData();
  }, []);

  const filtered = shifts.filter(
    (s) =>
      (s.userName || s.employee || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (s.dept || "").toLowerCase().includes(searchTerm.toLowerCase()),
  );
  return (
    <div>
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="rounded-3xl bg-white/60 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 backdrop-blur-xl p-6 shadow-md dark:shadow-xl transition-all duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Список назначенных смен
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Детальное расписание сотрудников
              </p>
            </div>
            <div className="relative self-start sm:self-auto">
              <svg
                className="w-4 h-4 text-slate-500 dark:text-slate-400 absolute left-3 top-1/2 -translate-y-1/2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Поиск сотрудника..."
                className="bg-white/80 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl pl-9 pr-4 py-2 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-sky-500/30 dark:focus:ring-sky-500/50 focus:border-sky-500/50 dark:focus:border-sky-500/40 transition w-full sm:w-48"
              />
            </div>
          </div>

          <div className="space-y-3">
            {filtered.map((shift) => (
              <div
                key={shift.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white/40 dark:bg-white/3 border border-slate-100 dark:border-white/5 hover:border-slate-200 dark:hover:border-white/15 p-4 rounded-2xl transition duration-200 hover:bg-white/60 dark:hover:bg-white/5 shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-linear-to-r from-sky-500/20 to-blue-600/20 border border-sky-400/20 flex items-center justify-center shrink-0">
                    <span className="text-sky-600 dark:text-sky-400 font-bold text-sm">
                      {(shift.userName || shift.employee || "").charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">
                      {shift.userName || shift.employee}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {shift.dept} · {shift.shift}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {WEEKDAYS.map((day) => (
                    <span
                      key={day}
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border ${
                        shift.days && shift.days.includes(day)
                          ? "bg-sky-500/15 text-sky-600 dark:text-sky-300 border-sky-400/20"
                          : "bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-500 border-slate-200 dark:border-white/5"
                      }`}
                    >
                      {day}
                    </span>
                  ))}
                  <span
                    className={`ml-2 text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                      STATUS_CONFIG[shift.status as ShiftStatus]?.color || ""
                    }`}
                  >
                    {STATUS_CONFIG[shift.status as ShiftStatus]?.label ||
                      shift.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Users;

// <section className="rounded-2xl bg-white/60 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 p-6 shadow-md dark:shadow-lg backdrop-blur-xl transition-all duration-300">
//     <UsersList />
//   </section>
