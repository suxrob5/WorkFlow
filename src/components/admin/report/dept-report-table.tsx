"use client";

import React from "react";
import { Employee, AttendanceFeedItem } from "@/firebase/db";
import { WORK_START_TIME_STR, WORK_END_TIME_STR } from "@/lib/config";

interface DeptReportTableProps {
  employees: any[];
  attendanceLogs: any[];
  startDate: string;
  endDate: string;
  searchTerm: string;
  deptFilter: string;
  positionFilter: string;
  tableId: string;
}

// Helpers
const parseShiftTimes = (shiftName: string) => {
  if (!shiftName)
    return {
      start: WORK_START_TIME_STR,
      end: WORK_END_TIME_STR,
      norm: "09:00",
    };
  const regex = /(\d{2}:\d{2})[-–—](\d{2}:\d{2})/;
  const match = shiftName.match(regex);
  if (match) {
    const start = match[1];
    const end = match[2];
    const [sh, sm] = start.split(":").map(Number);
    const [eh, em] = end.split(":").map(Number);
    let diff = eh * 60 + em - (sh * 60 + sm);
    if (diff < 0) diff += 24 * 60; // overnight shifts
    const normH = Math.floor(diff / 60);
    const normM = diff % 60;
    const normStr = `${String(normH).padStart(2, "0")}:${String(normM).padStart(2, "0")}`;
    return { start, end, norm: normStr };
  }
  return { start: WORK_START_TIME_STR, end: WORK_END_TIME_STR, norm: "09:00" };
};

const timeToMinutes = (timeStr: string) => {
  const [h, m] = timeStr.split(":").map(Number);
  return h * 60 + m;
};

const minutesToTime = (mins: number) => {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
};

const calculateInsideSchedule = (
  planStartStr: string,
  planEndStr: string,
  factStartStr: string,
  factEndStr: string,
) => {
  if (!factStartStr || !factEndStr) return "00:00";
  const planStart = timeToMinutes(planStartStr);
  const planEnd = timeToMinutes(planEndStr);
  const factStart = timeToMinutes(factStartStr);
  const factEnd = timeToMinutes(factEndStr);

  const start = Math.max(planStart, factStart);
  const end = Math.min(planEnd, factEnd);
  if (end > start) {
    return minutesToTime(end - start);
  }
  return "00:00";
};

export default function DeptReportTable({
  employees,
  attendanceLogs,
  startDate,
  endDate,
  searchTerm,
  deptFilter,
  positionFilter,
  tableId,
}: DeptReportTableProps) {
  // Generate date list
  const start = new Date(startDate);
  const end = new Date(endDate);
  const dates: Date[] = [];
  const current = new Date(start);
  while (current <= end) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  const WEEKDAY_NAMES = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];

  // Filter employees
  const filteredEmployees = employees.filter((emp) => {
    const name = (emp.userName || "").toLowerCase();
    const dept = (emp.dept || "").toLowerCase();
    const matchesSearch =
      name.includes(searchTerm.toLowerCase()) ||
      dept.includes(searchTerm.toLowerCase());
    const matchesDept = deptFilter === "all" || emp.dept === deptFilter;
    const matchesPosition =
      positionFilter === "all" ||
      emp.position === positionFilter ||
      emp.positionRu === positionFilter ||
      emp.dept === positionFilter;
    return matchesSearch && matchesDept && matchesPosition;
  });

  // Unique departments from filtered employees
  const departments = Array.from(
    new Set(filteredEmployees.map((emp) => emp.dept).filter(Boolean)),
  );

  // Grouped render data
  const renderData = dates
    .map((dateObj) => {
      const dateStr = dateObj.toISOString().split("T")[0];
      const weekday = WEEKDAY_NAMES[dateObj.getDay()];

      // Format visual date: 02.06.2026
      const visualDate = dateObj.toLocaleDateString("ru-RU", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });

      const deptsData = departments
        .map((dept) => {
          const deptEmployees = filteredEmployees.filter(
            (emp) => emp.dept === dept,
          );

          const rows = deptEmployees.map((emp) => {
            // Find attendance for this user on this date
            const log = attendanceLogs.find(
              (l) => String(l.userId) === String(emp.id) && l.date === dateStr,
            );

            const shift = parseShiftTimes(emp.shift);

            let factStart = "-";
            let factEnd = "-";
            let factWorked = "00:00";
            let insideSchedule = "00:00";

            if (log) {
              factStart = log.checkIn || "-";
              factEnd = log.checkOut || "-";
              if (log.workedMinutes) {
                factWorked = minutesToTime(log.workedMinutes);
              } else if (log.checkIn && log.checkOut) {
                const diff =
                  timeToMinutes(log.checkOut) - timeToMinutes(log.checkIn);
                factWorked = minutesToTime(diff > 0 ? diff : 0);
              }

              if (log.checkIn && log.checkOut) {
                insideSchedule = calculateInsideSchedule(
                  shift.start,
                  shift.end,
                  log.checkIn,
                  log.checkOut,
                );
              }
            }

            // Pin code and Tab No based on employee data or deterministic hashing
            const tabNo =
              emp.tabNo ||
              `AF00-${String(emp.id).replace(/\D/g, "").slice(0, 5).padStart(5, "0") || "00001"}`;
            const pinCode =
              emp.pinCode ||
              `${((String(emp.id).charCodeAt(0) * 123) % 90000) + 10000}`;

            return {
              tabNo,
              pinCode,
              name: emp.userName,
              planStart: shift.start,
              planEnd: shift.end,
              planNorm: shift.norm,
              factStart,
              factEnd,
              factWorked,
              insideSchedule,
            };
          });

          return {
            departmentName: dept,
            rows,
          };
        })
        .filter((d) => d.rows.length > 0);

      return {
        dateStr,
        visualDate,
        weekday,
        deptsData,
      };
    })
    .filter((d) => d.deptsData.length > 0);

  return (
    <div className="overflow-x-auto w-full border border-slate-200/60 dark:border-white/10 rounded-2xl bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl shadow-inner scrollbar-thin">
      <table
        id={tableId}
        className="w-full text-left border-collapse text-xs md:text-sm text-slate-800 dark:text-slate-200"
      >
        <thead>
          <tr className="bg-slate-100/80 dark:bg-white/5 border-b border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px] tracking-wider">
            <th
              rowSpan={2}
              className="p-3 align-middle border-r border-slate-200 dark:border-white/10"
            >
              Таб. №
            </th>
            <th
              rowSpan={2}
              className="p-3 align-middle border-r border-slate-200 dark:border-white/10"
            >
              Пин код
            </th>
            <th
              rowSpan={2}
              className="p-3 align-middle border-r border-slate-200 dark:border-white/10 min-w-50"
            >
              Ф.И.О
            </th>
            <th
              colSpan={3}
              className="p-2 text-center border-b border-r border-slate-200 dark:border-white/10"
            >
              План
            </th>
            <th
              colSpan={3}
              className="p-2 text-center border-b border-r border-slate-200 dark:border-white/10"
            >
              Факт
            </th>
            <th rowSpan={2} className="p-3 align-middle text-center min-w-37.5">
              Фактические часы внутри графика
            </th>
          </tr>
          <tr className="bg-slate-50/50 dark:bg-white/3 border-b border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 font-bold uppercase text-[9px] tracking-wider">
            <th className="p-2 text-center border-r border-slate-200 dark:border-white/10">
              Приход
            </th>
            <th className="p-2 text-center border-r border-slate-200 dark:border-white/10">
              Уход
            </th>
            <th className="p-2 text-center border-r border-slate-200 dark:border-white/10">
              Норма
            </th>
            <th className="p-2 text-center border-r border-slate-200 dark:border-white/10">
              Приход
            </th>
            <th className="p-2 text-center border-r border-slate-200 dark:border-white/10">
              Уход
            </th>
            <th className="p-2 text-center border-r border-slate-200 dark:border-white/10">
              Норма
            </th>
          </tr>
        </thead>
        <tbody>
          {renderData.length === 0 ? (
            <tr>
              <td
                colSpan={10}
                className="p-8 text-center text-slate-400 dark:text-slate-500 font-semibold"
              >
                Нет данных для отображения
              </td>
            </tr>
          ) : (
            renderData.map((day) => (
              <React.Fragment key={day.dateStr}>
                {/* Date Row Header */}
                <tr className="bg-emerald-500/10 border-y border-slate-200 dark:border-white/10">
                  <td
                    colSpan={10}
                    className="p-2.5 font-extrabold text-slate-900 dark:text-emerald-400 tracking-wide text-xs"
                  >
                    {day.visualDate} {day.weekday}
                  </td>
                </tr>
                {day.deptsData.map((dept) => (
                  <React.Fragment key={dept.departmentName}>
                    {/* Department Row Header */}
                    <tr className="bg-slate-100/50 dark:bg-white/3 font-semibold text-slate-700 dark:text-slate-300">
                      <td
                        colSpan={10}
                        className="p-2 pl-4 border-b border-slate-200 dark:border-white/10 italic text-[11px]"
                      >
                        📁 {dept.departmentName}
                      </td>
                    </tr>
                    {dept.rows.map((row, idx) => (
                      <tr
                        key={idx}
                        className="border-b border-slate-100 dark:border-white/5 hover:bg-slate-50/50 dark:hover:bg-white/2 transition duration-150"
                      >
                        <td className="p-2.5 font-medium border-r border-slate-200 dark:border-white/10 tabular-nums">
                          {row.tabNo}
                        </td>
                        <td className="p-2.5 border-r border-slate-200 dark:border-white/10 tabular-nums">
                          {row.pinCode}
                        </td>
                        <td className="p-2.5 font-semibold text-slate-900 dark:text-white border-r border-slate-200 dark:border-white/10">
                          {row.name}
                        </td>
                        <td className="p-2 text-center border-r border-slate-200 dark:border-white/10 tabular-nums text-slate-500">
                          {row.planStart}
                        </td>
                        <td className="p-2 text-center border-r border-slate-200 dark:border-white/10 tabular-nums text-slate-500">
                          {row.planEnd}
                        </td>
                        <td className="p-2 text-center border-r border-slate-200 dark:border-white/10 tabular-nums font-bold text-slate-600 dark:text-slate-300">
                          {row.planNorm}
                        </td>
                        <td className="p-2 text-center border-r border-slate-200 dark:border-white/10 tabular-nums">
                          {row.factStart !== "-" ? (
                            <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                              {row.factStart}
                            </span>
                          ) : (
                            <span className="text-slate-400 dark:text-slate-600">
                              -
                            </span>
                          )}
                        </td>
                        <td className="p-2 text-center border-r border-slate-200 dark:border-white/10 tabular-nums">
                          {row.factEnd !== "-" ? (
                            <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                              {row.factEnd}
                            </span>
                          ) : (
                            <span className="text-slate-400 dark:text-slate-600">
                              -
                            </span>
                          )}
                        </td>
                        <td className="p-2 text-center border-r border-slate-200 dark:border-white/10 tabular-nums font-semibold">
                          {row.factWorked !== "00:00" ? (
                            row.factWorked
                          ) : (
                            <span className="text-slate-400 dark:text-slate-600">
                              -
                            </span>
                          )}
                        </td>
                        <td className="p-2 text-center font-bold tabular-nums text-sky-600 dark:text-sky-400">
                          {row.insideSchedule !== "00:00"
                            ? row.insideSchedule
                            : "-"}
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </React.Fragment>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
