import React from "react";

interface WeekNavigatorProps {
  selectedWeekStart: Date;
  onChange: (date: Date) => void;
}

export default function WeekNavigator({
  selectedWeekStart,
  onChange,
}: WeekNavigatorProps) {
  const handlePrevWeek = () => {
    const prev = new Date(selectedWeekStart);
    prev.setDate(selectedWeekStart.getDate() - 7);
    onChange(prev);
  };

  const handleNextWeek = () => {
    const next = new Date(selectedWeekStart);
    next.setDate(selectedWeekStart.getDate() + 7);
    onChange(next);
  };

  const handleCurrentWeek = () => {
    const d = new Date();
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(d.setDate(diff));
    monday.setHours(0, 0, 0, 0);
    onChange(monday);
  };

  const formatWeekRange = (monday: Date) => {
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    const optionsShort: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "short",
    };
    const optionsYear: Intl.DateTimeFormatOptions = {
      year: "numeric",
    };

    const mondayStr = monday.toLocaleDateString("ru-RU", optionsShort);
    const sundayStr = sunday.toLocaleDateString("ru-RU", optionsShort);
    const yearStr = sunday.toLocaleDateString("ru-RU", optionsYear);

    return `${mondayStr} — ${sundayStr}, ${yearStr}`;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 rounded-2xl bg-white/60 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 backdrop-blur-xl shadow-sm">
      <div className="flex items-center gap-2">
        <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
          Выбранный период:
        </span>
        <div className="flex items-center gap-2 bg-slate-50 dark:bg-white/3 border border-slate-100 dark:border-white/5 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 dark:text-slate-200 tabular-nums">
          <span>📅</span>
          <span>{formatWeekRange(selectedWeekStart)}</span>
        </div>
      </div>
      <div className="flex items-center gap-1.5 self-end sm:self-auto">
        <button
          onClick={handlePrevWeek}
          className="flex items-center justify-center w-8 h-8 rounded-xl border border-slate-200 dark:border-white/10 bg-white/80 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/10 active:scale-95 transition-all cursor-pointer animate-duration-150"
          title="Предыдущая неделя"
        >
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <button
          onClick={handleCurrentWeek}
          className="px-3.5 py-1.5 text-xs font-bold rounded-xl border border-slate-200 dark:border-white/10 bg-white/80 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/10 active:scale-95 transition-all cursor-pointer animate-duration-150"
        >
          Текущая неделя
        </button>
        <button
          onClick={handleNextWeek}
          className="flex items-center justify-center w-8 h-8 rounded-xl border border-slate-200 dark:border-white/10 bg-white/80 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/10 active:scale-95 transition-all cursor-pointer animate-duration-150"
          title="Следующая неделя"
        >
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
