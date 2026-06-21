import React from "react";

const WEEKDAYS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

interface WeeklyAttendanceCalendarProps {
  employeeId: string | number;
  shiftDays: string[];
  selectedWeekStart: Date;
  attendanceLogs: any[];
}

export default function WeeklyAttendanceCalendar({
  employeeId,
  shiftDays,
  selectedWeekStart,
  attendanceLogs,
}: WeeklyAttendanceCalendarProps) {
  // Generate the 7 dates of the selected week (Monday to Sunday)
  const getDatesOfWeek = (monday: Date) => {
    return Array.from({ length: 7 }, (_, index) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + index);
      return d;
    });
  };

  const weekDates = getDatesOfWeek(selectedWeekStart);
  const todayStr = new Date().toISOString().split("T")[0];

  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {weekDates.map((dateObj, index) => {
        const dateStr = dateObj.toISOString().split("T")[0];
        const dayName = WEEKDAYS[index];
        const isScheduled = shiftDays && shiftDays.includes(dayName);
        const isFuture = dateStr > todayStr;

        const log = attendanceLogs.find(
          (l) => String(l.userId) === String(employeeId) && l.date === dateStr,
        );

        let dayColorClass = "";
        let tooltipText = "";

        if (log) {
          const isLate =
            log.status === "late" || (log.lateMinutes && log.lateMinutes > 0);
          if (isLate) {
            dayColorClass =
              "bg-amber-500 dark:bg-amber-600 text-white border-amber-400/20";
            tooltipText = `Пришел с опозданием: ${log.checkIn} (опоздание на ${log.lateMinutes} мин)`;
          } else {
            dayColorClass =
              "bg-blue-500 dark:bg-blue-600 text-white border-blue-400/20";
            tooltipText = `Присутствовал: ${log.checkIn} - ${log.checkOut || "В процессе"}`;
          }
        } else {
          if (isFuture) {
            dayColorClass =
              "bg-slate-100 dark:bg-white/5 text-slate-400 dark:text-slate-600 border-slate-200 dark:border-white/5";
            tooltipText = "Будущий день";
          } else {
            if (isScheduled) {
              dayColorClass =
                "bg-rose-500 dark:bg-rose-600 text-white border-rose-400/20";
              tooltipText = "Не пришел (Отсутствовал)";
            } else {
              dayColorClass =
                "bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-500 border-slate-200 dark:border-white/5";
              tooltipText = "Выходной";
            }
          }
        }

        return (
          <div
            key={dateStr}
            className={`flex flex-col items-center justify-center w-10 h-12 rounded-xl border text-center transition-all duration-200 cursor-help select-none ${dayColorClass}`}
            title={`${dayName} (${dateObj.getDate()}): ${tooltipText}`}
          >
            <span className="text-[9px] font-bold uppercase leading-none opacity-80">
              {dayName}
            </span>
            <span className="text-[11px] font-black leading-none mt-1">
              {dateObj.getDate()}
            </span>
          </div>
        );
      })}
    </div>
  );
}
