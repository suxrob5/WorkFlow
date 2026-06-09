"use client";

import { WORK_START_TIME_STR, WORK_END_TIME_STR } from "@/lib/config";

interface LatesReportTableProps {
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
  if (!shiftName) return { start: WORK_START_TIME_STR, end: WORK_END_TIME_STR };
  const regex = /(\d{2}:\d{2})[-–—](\d{2}:\d{2})/;
  const match = shiftName.match(regex);
  if (match) {
    return { start: match[1], end: match[2] };
  }
  return { start: WORK_START_TIME_STR, end: WORK_END_TIME_STR };
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

export default function LatesReportTable({
  employees,
  attendanceLogs,
  startDate,
  endDate,
  searchTerm,
  deptFilter,
  positionFilter,
  tableId,
}: LatesReportTableProps) {
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

  // Gather all logs with violations
  const violations: any[] = [];

  dates.forEach((dateObj) => {
    const dateStr = dateObj.toISOString().split("T")[0];
    const weekday = WEEKDAY_NAMES[dateObj.getDay()];
    const visualDate = dateObj.toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    employees.forEach((emp) => {
      // Apply filters
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
      if (!matchesSearch || !matchesDept || !matchesPosition) return;

      const log = attendanceLogs.find(
        (l) => String(l.userId) === String(emp.id) && l.date === dateStr,
      );

      if (log) {
        const shift = parseShiftTimes(emp.shift);

        let lateMins = 0;
        let earlyMins = 0;

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

        if (lateMins > 0 || earlyMins > 0) {
          violations.push({
            employeeId: emp.id,
            name: emp.userName,
            dept: emp.dept,
            avatar: emp.avatar,
            dateStr,
            visualDate,
            weekday,
            planStart: shift.start,
            planEnd: shift.end,
            factStart: log.checkIn || "-",
            factEnd: log.checkOut || "-",
            lateStr: lateMins > 0 ? minutesToTime(lateMins) : "-",
            earlyStr: earlyMins > 0 ? minutesToTime(earlyMins) : "-",
            isLate: lateMins > 0,
            isEarly: earlyMins > 0,
          });
        }
      }
    });
  });

  return (
    <div className="overflow-x-auto w-full border border-slate-200/60 dark:border-white/10 rounded-2xl bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl shadow-inner scrollbar-thin">
      <table
        id={tableId}
        className="w-full text-left border-collapse text-xs md:text-sm text-slate-800 dark:text-slate-200"
      >
        <thead>
          <tr className="bg-slate-100/80 dark:bg-white/5 border-b border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px] tracking-wider">
            <th className="p-3">Сотрудник</th>
            <th className="p-3">Отдел</th>
            <th className="p-3">Дата</th>
            <th className="p-3 text-center">План (Приход/Уход)</th>
            <th className="p-3 text-center">Факт (Приход/Уход)</th>
            <th className="p-3 text-center">Опоздание</th>
            <th className="p-3 text-center">Ранний уход</th>
            <th className="p-3 text-center">Нарушение</th>
          </tr>
        </thead>
        <tbody>
          {violations.length === 0 ? (
            <tr>
              <td
                colSpan={8}
                className="p-8 text-center text-slate-400 dark:text-slate-500 font-semibold"
              >
                Нарушений за выбранный период не зафиксировано
              </td>
            </tr>
          ) : (
            violations.map((v, idx) => (
              <tr
                key={idx}
                className="border-b border-slate-100 dark:border-white/5 hover:bg-slate-50/50 dark:hover:bg-white/2 transition duration-150"
              >
                <td className="p-3 font-semibold text-slate-900 dark:text-white flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-linear-to-r from-amber-500/20 to-rose-600/20 border border-rose-500/20 flex items-center justify-center text-[10px] font-bold text-rose-500">
                    {v.name.charAt(0)}
                  </div>
                  {v.name}
                </td>
                <td className="p-3 text-slate-500 dark:text-slate-400">
                  {v.dept}
                </td>
                <td className="p-3 font-medium tabular-nums">
                  {v.visualDate}{" "}
                  <span className="text-slate-400">({v.weekday})</span>
                </td>
                <td className="p-3 text-center tabular-nums text-slate-500">
                  {v.planStart} – {v.planEnd}
                </td>
                <td className="p-3 text-center tabular-nums">
                  <span className="text-slate-900 dark:text-white font-medium">
                    {v.factStart}
                  </span>
                  <span className="text-slate-400 dark:text-slate-500 mx-1">
                    /
                  </span>
                  <span className="text-slate-900 dark:text-white font-medium">
                    {v.factEnd}
                  </span>
                </td>
                <td className="p-3 text-center tabular-nums font-bold">
                  {v.isLate ? (
                    <span className="text-amber-500">{v.lateStr}</span>
                  ) : (
                    <span className="text-slate-400">-</span>
                  )}
                </td>
                <td className="p-3 text-center tabular-nums font-bold">
                  {v.isEarly ? (
                    <span className="text-rose-500">{v.earlyStr}</span>
                  ) : (
                    <span className="text-slate-400">-</span>
                  )}
                </td>
                <td className="p-3 text-center">
                  {v.isLate && v.isEarly ? (
                    <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-linear-to-r from-amber-500 to-rose-500 text-white shadow-sm">
                      Опоздание + Ранний уход
                    </span>
                  ) : v.isLate ? (
                    <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-400/25">
                      Опоздание
                    </span>
                  ) : (
                    <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-400/25">
                      Ранний уход
                    </span>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
