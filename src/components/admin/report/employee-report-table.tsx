"use client";

import React from "react";
import { WORK_START_TIME_STR, WORK_END_TIME_STR } from "@/lib/config";

interface EmployeeReportTableProps {
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
    return { start: WORK_START_TIME_STR, end: WORK_END_TIME_STR, norm: 540 }; // 9 hours in mins
  const regex = /(\d{2}:\d{2})[-–—](\d{2}:\d{2})/;
  const match = shiftName.match(regex);
  if (match) {
    const start = match[1];
    const end = match[2];
    const [sh, sm] = start.split(":").map(Number);
    const [eh, em] = end.split(":").map(Number);
    let diff = eh * 60 + em - (sh * 60 + sm);
    if (diff < 0) diff += 24 * 60; // overnight shift
    return { start, end, norm: diff };
  }
  return { start: WORK_START_TIME_STR, end: WORK_END_TIME_STR, norm: 540 };
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

const formatDeviation = (mins: number) => {
  if (mins === 0) return "00:00";
  const abs = Math.abs(mins);
  const h = Math.floor(abs / 60);
  const m = abs % 60;
  const timeStr = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  return mins > 0 ? `+${timeStr}` : `-${timeStr}`;
};

export default function EmployeeReportTable({
  employees,
  attendanceLogs,
  startDate,
  endDate,
  searchTerm,
  deptFilter,
  positionFilter,
  tableId,
}: EmployeeReportTableProps) {
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

  // Calculate calendar grid rows for each employee
  const reportData = filteredEmployees.map((emp) => {
    let totalPlanNorm = 0;
    let totalFactWorked = 0;
    let totalLate = 0;
    let totalEarlyLeave = 0;
    let totalDeviation = 0;

    const rows = dates.map((dateObj) => {
      const dateStr = dateObj.toISOString().split("T")[0];
      const weekday = WEEKDAY_NAMES[dateObj.getDay()];

      const visualDate = dateObj.toLocaleDateString("ru-RU", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });

      const log = attendanceLogs.find(
        (l) => String(l.userId) === String(emp.id) && l.date === dateStr,
      );

      const shift = parseShiftTimes(emp.shift);

      let factStart = "-";
      let factEnd = "-";
      let workedMins = 0;
      let lateMins = 0;
      let earlyMins = 0;
      let deviationMins = 0;

      // Plan norm defaults to shift norm if they are supposed to work today, or simply shift norm as base
      const normMins = shift.norm;
      totalPlanNorm += normMins;

      if (log) {
        factStart = log.checkIn || "-";
        factEnd = log.checkOut || "-";

        if (log.workedMinutes !== undefined) {
          workedMins = log.workedMinutes;
        } else if (log.checkIn && log.checkOut) {
          const diff = timeToMinutes(log.checkOut) - timeToMinutes(log.checkIn);
          workedMins = diff > 0 ? diff : 0;
        }

        if (log.lateMinutes !== undefined) {
          lateMins = log.lateMinutes;
        } else if (log.checkIn) {
          const checkInMins = timeToMinutes(log.checkIn);
          const shiftStartMins = timeToMinutes(shift.start);
          lateMins = Math.max(0, checkInMins - shiftStartMins);
        }

        if (log.earlyLeaveMinutes !== undefined) {
          earlyMins = log.earlyLeaveMinutes;
        } else if (log.checkOut) {
          const checkOutMins = timeToMinutes(log.checkOut);
          const shiftEndMins = timeToMinutes(shift.end);
          earlyMins = Math.max(0, shiftEndMins - checkOutMins);
        }

        // Deviation = actual worked mins - planned norm mins
        deviationMins = workedMins - normMins;
      } else {
        // Absent: deviation is -planned norm mins
        deviationMins = -normMins;
      }

      totalFactWorked += workedMins;
      totalLate += lateMins;
      totalEarlyLeave += earlyMins;
      totalDeviation += deviationMins;

      return {
        dateStr,
        visualDate,
        weekday,
        planStart: shift.start,
        planEnd: shift.end,
        planNorm: minutesToTime(normMins),
        factStart,
        factEnd,
        factWorked: workedMins > 0 ? minutesToTime(workedMins) : "-",
        lateStr: lateMins > 0 ? minutesToTime(lateMins) : "-",
        earlyStr: earlyMins > 0 ? minutesToTime(earlyMins) : "-",
        deviationStr: formatDeviation(deviationMins),
        rawDeviation: deviationMins,
      };
    });

    return {
      employeeId: emp.id,
      employeeName: emp.userName,
      employeeDept: emp.dept,
      rows,
      totals: {
        planNorm: minutesToTime(totalPlanNorm),
        factWorked: minutesToTime(totalFactWorked),
        late: totalLate > 0 ? minutesToTime(totalLate) : "-",
        earlyLeave: totalEarlyLeave > 0 ? minutesToTime(totalEarlyLeave) : "-",
        deviation: formatDeviation(totalDeviation),
        rawDeviation: totalDeviation,
      },
    };
  });

  return (
    <div className="space-y-8 w-full" id={tableId}>
      {reportData.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white/40 dark:bg-slate-900/40 p-8 text-center text-slate-400 dark:text-slate-500 font-semibold">
          Нет данных для отображения
        </div>
      ) : (
        reportData.map((employee) => (
          <div
            key={employee.employeeId}
            className="rounded-3xl border border-slate-200/60 dark:border-white/10 bg-white/60 dark:bg-slate-950/40 backdrop-blur-xl shadow-md p-5 space-y-4 transition-all duration-300"
          >
            {/* Employee Header Info */}
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 pb-3 border-b border-slate-100 dark:border-white/5">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  👤 {employee.employeeName}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {employee.employeeDept}
                </p>
              </div>
              <span className="text-[10px] font-bold px-3 py-1 bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-400/20 rounded-full self-start">
                Сводный отчет
              </span>
            </div>

            {/* Daily Table Grid */}
            <div className="overflow-x-auto rounded-2xl border border-slate-100 dark:border-white/5 scrollbar-thin">
              <table className="w-full text-left border-collapse text-xs md:text-sm text-slate-800 dark:text-slate-200">
                <thead>
                  <tr className="bg-slate-50 dark:bg-white/3 border-b border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 font-bold uppercase text-[9px] tracking-wider">
                    <th
                      rowSpan={2}
                      className="p-3 border-r border-slate-200 dark:border-white/10"
                    >
                      Дата
                    </th>
                    <th
                      rowSpan={2}
                      className="p-3 border-r border-slate-200 dark:border-white/10"
                    >
                      День
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
                    <th
                      rowSpan={2}
                      className="p-3 text-center border-r border-slate-200 dark:border-white/10"
                    >
                      Опоздание
                    </th>
                    <th
                      rowSpan={2}
                      className="p-3 text-center border-r border-slate-200 dark:border-white/10"
                    >
                      Ранний уход
                    </th>
                    <th rowSpan={2} className="p-3 text-center">
                      Отклонения
                    </th>
                  </tr>
                  <tr className="bg-slate-50/50 dark:bg-white/1 border-b border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 font-bold uppercase text-[8px] tracking-wider">
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
                      Отработано
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {employee.rows.map((row, idx) => (
                    <tr
                      key={idx}
                      className="border-b border-slate-100 dark:border-white/5 hover:bg-slate-50/30 dark:hover:bg-white/2 transition duration-150"
                    >
                      <td className="p-2.5 font-medium border-r border-slate-200 dark:border-white/10">
                        {row.visualDate}
                      </td>
                      <td className="p-2.5 border-r border-slate-200 dark:border-white/10 font-bold text-slate-500">
                        {row.weekday}
                      </td>
                      <td className="p-2 text-center border-r border-slate-200 dark:border-white/10 tabular-nums text-slate-500">
                        {row.planStart}
                      </td>
                      <td className="p-2 text-center border-r border-slate-200 dark:border-white/10 tabular-nums text-slate-500">
                        {row.planEnd}
                      </td>
                      <td className="p-2 text-center border-r border-slate-200 dark:border-white/10 tabular-nums font-semibold text-slate-600 dark:text-slate-400">
                        {row.planNorm}
                      </td>

                      <td className="p-2 text-center border-r border-slate-200 dark:border-white/10 tabular-nums">
                        {row.factStart !== "-" ? (
                          <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
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
                          <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                            {row.factEnd}
                          </span>
                        ) : (
                          <span className="text-slate-400 dark:text-slate-600">
                            -
                          </span>
                        )}
                      </td>
                      <td className="p-2 text-center border-r border-slate-200 dark:border-white/10 tabular-nums font-semibold">
                        {row.factWorked}
                      </td>

                      <td className="p-2 text-center border-r border-slate-200 dark:border-white/10 tabular-nums font-medium">
                        {row.lateStr !== "-" ? (
                          <span className="text-amber-500 dark:text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded-md font-bold">
                            {row.lateStr}
                          </span>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td className="p-2 text-center border-r border-slate-200 dark:border-white/10 tabular-nums font-medium">
                        {row.earlyStr !== "-" ? (
                          <span className="text-rose-500 dark:text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded-md font-bold">
                            {row.earlyStr}
                          </span>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td className="p-2 text-center font-bold tabular-nums">
                        {row.rawDeviation < 0 ? (
                          <span className="text-rose-500">
                            {row.deviationStr}
                          </span>
                        ) : row.rawDeviation > 0 ? (
                          <span className="text-emerald-500">
                            {row.deviationStr}
                          </span>
                        ) : (
                          <span className="text-slate-400">00:00</span>
                        )}
                      </td>
                    </tr>
                  ))}

                  {/* Totals Row */}
                  <tr className="bg-slate-100/50 dark:bg-white/5 border-t-2 border-slate-200 dark:border-white/20 font-bold text-slate-900 dark:text-white">
                    <td
                      colSpan={2}
                      className="p-3 text-right border-r border-slate-200 dark:border-white/10"
                    >
                      Итого:
                    </td>
                    <td
                      colSpan={2}
                      className="border-r border-slate-200 dark:border-white/10"
                    ></td>
                    <td className="p-2 text-center border-r border-slate-200 dark:border-white/10 tabular-nums">
                      {employee.totals.planNorm}
                    </td>
                    <td
                      colSpan={2}
                      className="border-r border-slate-200 dark:border-white/10"
                    ></td>
                    <td className="p-2 text-center border-r border-slate-200 dark:border-white/10 tabular-nums text-emerald-600 dark:text-emerald-400">
                      {employee.totals.factWorked}
                    </td>
                    <td className="p-2 text-center border-r border-slate-200 dark:border-white/10 tabular-nums text-amber-500">
                      {employee.totals.late}
                    </td>
                    <td className="p-2 text-center border-r border-slate-200 dark:border-white/10 tabular-nums text-rose-500">
                      {employee.totals.earlyLeave}
                    </td>
                    <td className="p-2 text-center tabular-nums">
                      {employee.totals.rawDeviation < 0 ? (
                        <span className="text-rose-500">
                          {employee.totals.deviation}
                        </span>
                      ) : employee.totals.rawDeviation > 0 ? (
                        <span className="text-emerald-500">
                          {employee.totals.deviation}
                        </span>
                      ) : (
                        <span className="text-slate-400">00:00</span>
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
