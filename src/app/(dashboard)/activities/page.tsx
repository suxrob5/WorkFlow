"use client";

import { useEffect, useState, useMemo } from "react";
import AdHeader from "@/components/admin/header";
import BarChart from "@/components/admin/chart/bar-chart";
import LineChart from "@/components/admin/chart/line-chart";
import DoughnutChart from "@/components/admin/chart/doughnut-chart";
import { getActivitiesDataFromFirestore } from "@/firebase/db";

export default function ActivitiesPage() {
  const [activeChart, setActiveChart] = useState<"bar" | "line" | "doughnut">(
    "line",
  );
  const [period, setPeriod] = useState<"1day" | "7days" | "30days" | "year">(
    "7days",
  );
  const [summary, setSummary] = useState<any[]>([]);
  const [charts, setCharts] = useState<any>(null);
  const [rawUsers, setRawUsers] = useState<any[]>([]);
  const [rawAttendance, setRawAttendance] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadActivitiesData = async () => {
      try {
        setLoading(true);
        const activitiesData = await getActivitiesDataFromFirestore();

        setSummary(activitiesData.summary);
        setCharts(activitiesData.charts);
        setRawUsers(activitiesData.rawUsers || []);
        setRawAttendance(activitiesData.rawAttendance || []);
      } catch (error) {
        console.error("Error loading activities data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadActivitiesData();
  }, []);

  const filteredCharts = useMemo(() => {
    if (!rawUsers.length || !rawAttendance.length || !charts) return charts;

    const now = new Date();
    const todayStr = now.toISOString().split("T")[0];

    // Helper: Map user to department
    const userDeptMap = new Map<string, string>();
    rawUsers.forEach((u) => {
      const dept = u.positionRu || u.position || "Отдел";
      userDeptMap.set(String(u.id), dept);
      userDeptMap.set(String(u.uid), dept);
    });

    const allDepartments = Array.from(
      new Set(rawUsers.map((u) => u.positionRu || u.position || "Отдел")),
    );

    if (period === "1day") {
      // 1. Bar Chart: Hourly Check-in and Check-out distribution today
      const hours = [
        "08:00",
        "09:00",
        "10:00",
        "11:00",
        "12:00",
        "13:00",
        "14:00",
        "15:00",
        "16:00",
        "17:00",
        "18:00",
        "19:00",
        "20:00",
        "22:00",
      ];
      const checkInCounts = Array(hours.length).fill(0);
      const checkOutCounts = Array(hours.length).fill(0);

      const todayAttendance = rawAttendance.filter(
        (a) => a.date === todayStr,
      );

      todayAttendance.forEach((a) => {
        if (a.checkIn) {
          const hour = a.checkIn.split(":")[0];
          const index = hours.findIndex((h) => h.startsWith(hour));
          if (index !== -1) checkInCounts[index]++;
        }
        if (a.checkOut) {
          const hour = a.checkOut.split(":")[0];
          const index = hours.findIndex((h) => h.startsWith(hour));
          if (index !== -1) checkOutCounts[index]++;
        }
      });

      const bar = {
        labels: hours,
        datasets: [
          {
            label: "Приходы",
            data: checkInCounts,
            backgroundColor: "rgba(56, 189, 248, 0.8)",
            borderColor: "rgba(56, 189, 248, 1)",
            borderWidth: 2,
            borderRadius: 8,
            borderSkipped: false as const,
          },
          {
            label: "Уходы",
            data: checkOutCounts,
            backgroundColor: "rgba(239, 68, 68, 0.6)",
            borderColor: "rgba(239, 68, 68, 1)",
            borderWidth: 2,
            borderRadius: 8,
            borderSkipped: false as const,
          },
        ],
      };

      // 2. Line Chart: Worked and Overtime hours by Department
      const workedByDept = Array(allDepartments.length).fill(0);
      const overtimeByDept = Array(allDepartments.length).fill(0);

      todayAttendance.forEach((a) => {
        const dept = userDeptMap.get(String(a.userId)) || "Отдел";
        const deptIdx = allDepartments.indexOf(dept);
        if (deptIdx !== -1) {
          workedByDept[deptIdx] += Math.round(
            Number(a.workedMinutes || 0) / 60,
          );
          overtimeByDept[deptIdx] += Math.round(
            Number(a.overtimeMinutes || 0) / 60,
          );
        }
      });

      const line = {
        labels: allDepartments,
        datasets: [
          {
            label: "Рабочие часы",
            data: workedByDept,
            borderColor: "rgba(56, 189, 248, 1)",
            backgroundColor: "rgba(56, 189, 248, 0.1)",
            pointBackgroundColor: "rgba(56, 189, 248, 1)",
            pointBorderColor: "#fff",
            pointBorderWidth: 2,
            pointRadius: 5,
            pointHoverRadius: 8,
            borderWidth: 3,
            fill: true,
            tension: 0.4,
          },
          {
            label: "Сверхурочные",
            data: overtimeByDept,
            borderColor: "rgba(167, 139, 250, 1)",
            backgroundColor: "rgba(167, 139, 250, 0.1)",
            pointBackgroundColor: "rgba(167, 139, 250, 1)",
            pointBorderColor: "#fff",
            pointBorderWidth: 2,
            pointRadius: 5,
            pointHoverRadius: 8,
            borderWidth: 3,
            fill: true,
            tension: 0.4,
          },
        ],
      };

      // 3. Doughnut Chart: Distribution of today's present employees by Department
      const todayPresentByDept = new Map<string, number>();
      allDepartments.forEach((d) => todayPresentByDept.set(d, 0));
      todayAttendance.forEach((a) => {
        const dept = userDeptMap.get(String(a.userId)) || "Отдел";
        if (todayPresentByDept.has(dept)) {
          todayPresentByDept.set(
            dept,
            (todayPresentByDept.get(dept) || 0) + 1,
          );
        }
      });

      const doughnutData = allDepartments.map(
        (d) => todayPresentByDept.get(d) || 0,
      );
      const totalPresent = doughnutData.reduce((s, v) => s + v, 0);
      const dataToUse =
        totalPresent > 0
          ? doughnutData
          : allDepartments.map(
              (d) =>
                rawUsers.filter(
                  (u) => (u.positionRu || u.position || "Отдел") === d,
                ).length,
            );

      const doughnut = {
        labels: allDepartments,
        datasets: [
          {
            label: "Присутствующие сотрудники",
            data: dataToUse,
            backgroundColor: [
              "rgba(56, 189, 248, 0.85)",
              "rgba(99, 102, 241, 0.85)",
              "rgba(16, 185, 129, 0.85)",
              "rgba(245, 158, 11, 0.85)",
              "rgba(239, 68, 68, 0.85)",
              "rgba(168, 85, 247, 0.85)",
            ],
            borderColor: "rgba(1,18,54,1)",
            borderWidth: 3,
            hoverOffset: 10,
          },
        ],
      };

      return { bar, line, doughnut };
    }

    if (period === "7days") {
      // 1. Bar Chart: Weekly Attendance (Present vs Absent)
      const monday = new Date(now);
      const day = monday.getDay();
      const diff = day === 0 ? -6 : 1 - day;
      monday.setDate(monday.getDate() + diff);
      monday.setHours(0, 0, 0, 0);

      const weekDates = Array.from({ length: 7 }, (_, index) => {
        const date = new Date(monday);
        date.setDate(monday.getDate() + index);
        return date.toISOString().split("T")[0];
      });

      const weekDaysLabels = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
      const totalUsersCount = rawUsers.length;

      const presentCounts = Array(7).fill(0);
      const absentCounts = Array(7).fill(0);
      const workedHours = Array(7).fill(0);
      const overtimeHours = Array(7).fill(0);
      const deptHours = new Map<string, number>();
      allDepartments.forEach((d) => deptHours.set(d, 0));

      weekDates.forEach((dateStr, idx) => {
        const dateAttendance = rawAttendance.filter(
          (a) => a.date === dateStr,
        );
        const uniqueUserIds = new Set(
          dateAttendance.map((a) => String(a.userId)),
        );
        presentCounts[idx] = uniqueUserIds.size;
        absentCounts[idx] = Math.max(totalUsersCount - uniqueUserIds.size, 0);

        dateAttendance.forEach((a) => {
          workedHours[idx] += Math.round(Number(a.workedMinutes || 0) / 60);
          overtimeHours[idx] += Math.round(
            Number(a.overtimeMinutes || 0) / 60,
          );

          const dept = userDeptMap.get(String(a.userId)) || "Отдел";
          deptHours.set(
            dept,
            (deptHours.get(dept) || 0) +
              Math.round(Number(a.workedMinutes || 0) / 60),
          );
        });
      });

      const bar = {
        labels: weekDaysLabels,
        datasets: [
          {
            label: "Присутствовали",
            data: presentCounts,
            backgroundColor: "rgba(56, 189, 248, 0.8)",
            borderColor: "rgba(56, 189, 248, 1)",
            borderWidth: 2,
            borderRadius: 8,
            borderSkipped: false as const,
          },
          {
            label: "Отсутствовали",
            data: absentCounts,
            backgroundColor: "rgba(239, 68, 68, 0.6)",
            borderColor: "rgba(239, 68, 68, 1)",
            borderWidth: 2,
            borderRadius: 8,
            borderSkipped: false as const,
          },
        ],
      };

      const line = {
        labels: weekDaysLabels,
        datasets: [
          {
            label: "Рабочие часы",
            data: workedHours,
            borderColor: "rgba(56, 189, 248, 1)",
            backgroundColor: "rgba(56, 189, 248, 0.1)",
            pointBackgroundColor: "rgba(56, 189, 248, 1)",
            pointBorderColor: "#fff",
            pointBorderWidth: 2,
            pointRadius: 5,
            pointHoverRadius: 8,
            borderWidth: 3,
            fill: true,
            tension: 0.4,
          },
          {
            label: "Сверхурочные",
            data: overtimeHours,
            borderColor: "rgba(167, 139, 250, 1)",
            backgroundColor: "rgba(167, 139, 250, 0.1)",
            pointBackgroundColor: "rgba(167, 139, 250, 1)",
            pointBorderColor: "#fff",
            pointBorderWidth: 2,
            pointRadius: 5,
            pointHoverRadius: 8,
            borderWidth: 3,
            fill: true,
            tension: 0.4,
          },
        ],
      };

      const doughnut = {
        labels: allDepartments,
        datasets: [
          {
            label: "Рабочие часы",
            data: allDepartments.map((d) => deptHours.get(d) || 0),
            backgroundColor: [
              "rgba(56, 189, 248, 0.85)",
              "rgba(99, 102, 241, 0.85)",
              "rgba(16, 185, 129, 0.85)",
              "rgba(245, 158, 11, 0.85)",
              "rgba(239, 68, 68, 0.85)",
              "rgba(168, 85, 247, 0.85)",
            ],
            borderColor: "rgba(1,18,54,1)",
            borderWidth: 3,
            hoverOffset: 10,
          },
        ],
      };

      return { bar, line, doughnut };
    }

    if (period === "30days") {
      // 1. Bar Chart: Daily Attendance for the last 30 days
      const dates30 = Array.from({ length: 30 }, (_, index) => {
        const date = new Date();
        date.setDate(date.getDate() - (29 - index));
        return date.toISOString().split("T")[0];
      });

      const labels30 = dates30.map((dateStr) => {
        const [_, m, d] = dateStr.split("-");
        return `${d}.${m}`;
      });

      const totalUsersCount = rawUsers.length;
      const presentCounts = Array(30).fill(0);
      const absentCounts = Array(30).fill(0);
      const workedHours = Array(30).fill(0);
      const overtimeHours = Array(30).fill(0);
      const deptHours = new Map<string, number>();
      allDepartments.forEach((d) => deptHours.set(d, 0));

      dates30.forEach((dateStr, idx) => {
        const dateAttendance = rawAttendance.filter(
          (a) => a.date === dateStr,
        );
        const uniqueUserIds = new Set(
          dateAttendance.map((a) => String(a.userId)),
        );
        presentCounts[idx] = uniqueUserIds.size;
        absentCounts[idx] = Math.max(totalUsersCount - uniqueUserIds.size, 0);

        dateAttendance.forEach((a) => {
          workedHours[idx] += Math.round(Number(a.workedMinutes || 0) / 60);
          overtimeHours[idx] += Math.round(
            Number(a.overtimeMinutes || 0) / 60,
          );

          const dept = userDeptMap.get(String(a.userId)) || "Отдел";
          deptHours.set(
            dept,
            (deptHours.get(dept) || 0) +
              Math.round(Number(a.workedMinutes || 0) / 60),
          );
        });
      });

      const bar = {
        labels: labels30,
        datasets: [
          {
            label: "Присутствовали",
            data: presentCounts,
            backgroundColor: "rgba(56, 189, 248, 0.8)",
            borderColor: "rgba(56, 189, 248, 1)",
            borderWidth: 1.5,
            borderRadius: 4,
            borderSkipped: false as const,
          },
          {
            label: "Отсутствовали",
            data: absentCounts,
            backgroundColor: "rgba(239, 68, 68, 0.6)",
            borderColor: "rgba(239, 68, 68, 1)",
            borderWidth: 1.5,
            borderRadius: 4,
            borderSkipped: false as const,
          },
        ],
      };

      const line = {
        labels: labels30,
        datasets: [
          {
            label: "Рабочие часы",
            data: workedHours,
            borderColor: "rgba(56, 189, 248, 1)",
            backgroundColor: "rgba(56, 189, 248, 0.05)",
            pointBackgroundColor: "rgba(56, 189, 248, 1)",
            pointBorderColor: "#fff",
            pointBorderWidth: 1,
            pointRadius: 3,
            pointHoverRadius: 5,
            borderWidth: 2,
            fill: true,
            tension: 0.4,
          },
          {
            label: "Сверхурочные",
            data: overtimeHours,
            borderColor: "rgba(167, 139, 250, 1)",
            backgroundColor: "rgba(167, 139, 250, 0.05)",
            pointBackgroundColor: "rgba(167, 139, 250, 1)",
            pointBorderColor: "#fff",
            pointBorderWidth: 1,
            pointRadius: 3,
            pointHoverRadius: 5,
            borderWidth: 2,
            fill: true,
            tension: 0.4,
          },
        ],
      };

      const doughnut = {
        labels: allDepartments,
        datasets: [
          {
            label: "Рабочие часы",
            data: allDepartments.map((d) => deptHours.get(d) || 0),
            backgroundColor: [
              "rgba(56, 189, 248, 0.85)",
              "rgba(99, 102, 241, 0.85)",
              "rgba(16, 185, 129, 0.85)",
              "rgba(245, 158, 11, 0.85)",
              "rgba(239, 68, 68, 0.85)",
              "rgba(168, 85, 247, 0.85)",
            ],
            borderColor: "rgba(1,18,54,1)",
            borderWidth: 3,
            hoverOffset: 10,
          },
        ],
      };

      return { bar, line, doughnut };
    }

    if (period === "year") {
      // 1. Bar Chart: Average monthly daily attendance
      const monthsLabels = [
        "Янв",
        "Фев",
        "Мар",
        "Апр",
        "Май",
        "Июн",
        "Июл",
        "Авг",
        "Сен",
        "Окт",
        "Ноя",
        "Дек",
      ];
      const currentYearVal = now.getFullYear();

      const workedHours = Array(12).fill(0);
      const overtimeHours = Array(12).fill(0);
      const monthlyAttendanceSets = Array.from(
        { length: 12 },
        () => new Map<string, Set<string>>(),
      );
      const totalUsersCount = rawUsers.length;
      const deptHours = new Map<string, number>();
      allDepartments.forEach((d) => deptHours.set(d, 0));

      rawAttendance.forEach((a) => {
        if (!a.date) return;
        const parsedDate = new Date(a.date);
        if (parsedDate.getFullYear() === currentYearVal) {
          const monthIdx = parsedDate.getMonth();

          workedHours[monthIdx] += Math.round(Number(a.workedMinutes || 0) / 60);
          overtimeHours[monthIdx] += Math.round(
            Number(a.overtimeMinutes || 0) / 60,
          );

          const dept = userDeptMap.get(String(a.userId)) || "Отдел";
          deptHours.set(
            dept,
            (deptHours.get(dept) || 0) +
              Math.round(Number(a.workedMinutes || 0) / 60),
          );

          if (!monthlyAttendanceSets[monthIdx].has(a.date)) {
            monthlyAttendanceSets[monthIdx].set(a.date, new Set());
          }
          monthlyAttendanceSets[monthIdx].get(a.date)?.add(String(a.userId));
        }
      });

      const avgPresent = Array(12).fill(0);
      const avgAbsent = Array(12).fill(0);

      for (let m = 0; m < 12; m++) {
        const datesMap = monthlyAttendanceSets[m];
        const daysWithRecords = datesMap.size;
        if (daysWithRecords > 0) {
          let sumPresent = 0;
          datesMap.forEach((userSet) => {
            sumPresent += userSet.size;
          });
          const avgP = Math.round(sumPresent / daysWithRecords);
          avgPresent[m] = avgP;
          avgAbsent[m] = Math.max(totalUsersCount - avgP, 0);
        } else {
          avgPresent[m] = 0;
          avgAbsent[m] = totalUsersCount;
        }
      }

      const bar = {
        labels: monthsLabels,
        datasets: [
          {
            label: "Присутствовали (сред.)",
            data: avgPresent,
            backgroundColor: "rgba(56, 189, 248, 0.8)",
            borderColor: "rgba(56, 189, 248, 1)",
            borderWidth: 2,
            borderRadius: 6,
            borderSkipped: false as const,
          },
          {
            label: "Отсутствовали (сред.)",
            data: avgAbsent,
            backgroundColor: "rgba(239, 68, 68, 0.6)",
            borderColor: "rgba(239, 68, 68, 1)",
            borderWidth: 2,
            borderRadius: 6,
            borderSkipped: false as const,
          },
        ],
      };

      const line = {
        labels: monthsLabels,
        datasets: [
          {
            label: "Рабочие часы",
            data: workedHours,
            borderColor: "rgba(56, 189, 248, 1)",
            backgroundColor: "rgba(56, 189, 248, 0.1)",
            pointBackgroundColor: "rgba(56, 189, 248, 1)",
            pointBorderColor: "#fff",
            pointBorderWidth: 2,
            pointRadius: 5,
            pointHoverRadius: 8,
            borderWidth: 3,
            fill: true,
            tension: 0.4,
          },
          {
            label: "Сверхурочные",
            data: overtimeHours,
            borderColor: "rgba(167, 139, 250, 1)",
            backgroundColor: "rgba(167, 139, 250, 0.1)",
            pointBackgroundColor: "rgba(167, 139, 250, 1)",
            pointBorderColor: "#fff",
            pointBorderWidth: 2,
            pointRadius: 5,
            pointHoverRadius: 8,
            borderWidth: 3,
            fill: true,
            tension: 0.4,
          },
        ],
      };

      const doughnut = {
        labels: allDepartments,
        datasets: [
          {
            label: "Рабочие часы",
            data: allDepartments.map((d) => deptHours.get(d) || 0),
            backgroundColor: [
              "rgba(56, 189, 248, 0.85)",
              "rgba(99, 102, 241, 0.85)",
              "rgba(16, 185, 129, 0.85)",
              "rgba(245, 158, 11, 0.85)",
              "rgba(239, 68, 68, 0.85)",
              "rgba(168, 85, 247, 0.85)",
            ],
            borderColor: "rgba(1,18,54,1)",
            borderWidth: 3,
            hoverOffset: 10,
          },
        ],
      };

      return { bar, line, doughnut };
    }

    return charts;
  }, [period, rawUsers, rawAttendance, charts]);

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
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Аналитика графиков
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Выберите тип визуализации и временной период
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 self-start lg:self-auto">
              {/* Type Switcher */}
              <div className="flex gap-1.5 p-1 bg-white/40 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl">
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

              {/* Period Switcher */}
              <div className="flex gap-1.5 p-1 bg-white/40 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl">
                {(["1day", "7days", "30days", "year"] as const).map((p) => {
                  const labels = {
                    "1day": "Сегодня",
                    "7days": "Неделя",
                    "30days": "Месяц",
                    year: "Год",
                  };
                  return (
                    <button
                      key={p}
                      onClick={() => setPeriod(p)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                        period === p
                          ? "bg-sky-500 text-white shadow-md shadow-sky-500/30"
                          : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5"
                      }`}
                    >
                      {labels[p]}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
          <div key={activeChart + "_" + period} className="">
            {activeChart === "bar" && <BarChart data={filteredCharts?.bar} />}
            {activeChart === "line" && <LineChart data={filteredCharts?.line} />}
            {activeChart === "doughnut" && (
              <DoughnutChart data={filteredCharts?.doughnut} />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
