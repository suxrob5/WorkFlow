"use client";

import Header from "@/components/admin/header";
import { STATUS_CONFIG, WEEKDAYS, type ShiftStatus } from "@/data/admin";
import { getEmployeeRowsFromFirestore, getAttendanceRaw } from "@/firebase/db";
import { useEffect, useRef, useState } from "react";
import WeekNavigator from "@/components/admin/employee/week-navigator";
import Pagination from "@/components/admin/employee/pagination";
import WeeklyAttendanceCalendar from "@/components/admin/employee/weekly-attendance-calendar";

// ── Custom dropdown component ──────────────────────────────────────────────
function FilterDropdown({
  value,
  onChange,
  options,
  icon,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  icon: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = options.find((o) => o.value === value) ?? options[0];
  const isActive = value !== "all";

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((p) => !p)}
        className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl border text-xs font-bold transition-all duration-200 cursor-pointer select-none whitespace-nowrap
          ${
            isActive
              ? "bg-sky-500 text-white border-sky-400 shadow-lg shadow-sky-500/25"
              : "bg-white/80 dark:bg-white/5 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 hover:bg-white dark:hover:bg-white/10"
          }`}
      >
        <span
          className={
            isActive ? "text-white/80" : "text-slate-400 dark:text-slate-500"
          }
        >
          {icon}
        </span>
        {selected.label}
        <svg
          className={`w-3 h-3 transition-transform duration-200 ${open ? "rotate-180" : ""} ${isActive ? "text-white/70" : "text-slate-400"}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {open && (
        <div className="absolute top-full mt-2 left-0 z-50 min-w-40 rounded-2xl border border-slate-200 dark:border-white/10 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl shadow-xl shadow-slate-900/10 dark:shadow-black/40 overflow-hidden">
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-left transition-colors duration-150 cursor-pointer
                ${
                  opt.value === value
                    ? "bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400"
                    : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5"
                }`}
            >
              {opt.value === value && (
                <svg
                  className="w-3 h-3 text-sky-500 shrink-0"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                </svg>
              )}
              {opt.value !== value && <span className="w-3 shrink-0" />}
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────
const Users = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [shifts, setShifts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [deptFilter, setDeptFilter] = useState<string>("all");
  const [dayFilter, setDayFilter] = useState<string>("all");
  const [importSuccess, setImportSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Added States
  const [attendanceLogs, setAttendanceLogs] = useState<any[]>([]);
  const [selectedWeekStart, setSelectedWeekStart] = useState<Date>(() => {
    const d = new Date();
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(d.setDate(diff));
    monday.setHours(0, 0, 0, 0);
    return monday;
  });
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 5;

  useEffect(() => {
    const loadEmployeesData = async () => {
      try {
        setLoading(true);
        const [liveShifts, rawAttendance] = await Promise.all([
          getEmployeeRowsFromFirestore(),
          getAttendanceRaw(),
        ]);
        setShifts(liveShifts);
        setAttendanceLogs(rawAttendance);
      } catch (error) {
        console.error("Error loading employees data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadEmployeesData();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, deptFilter, dayFilter]);

  const departments = Array.from(
    new Set(shifts.map((s) => s.dept).filter(Boolean)),
  );

  const filtered = shifts.filter((s) => {
    const name = (s.userName || s.employee || "").toLowerCase();
    const dept = (s.dept || "").toLowerCase();
    const matchesSearch =
      name.includes(searchTerm.toLowerCase()) ||
      dept.includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || s.status === statusFilter;
    const matchesDept = deptFilter === "all" || s.dept === deptFilter;
    const matchesDay =
      dayFilter === "all" || (s.days && s.days.includes(dayFilter));
    return matchesSearch && matchesStatus && matchesDept && matchesDay;
  });

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginatedShifts = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const activeFiltersCount = [
    statusFilter !== "all",
    deptFilter !== "all",
    dayFilter !== "all",
  ].filter(Boolean).length;

  const resetFilters = () => {
    setStatusFilter("all");
    setDeptFilter("all");
    setDayFilter("all");
    setSearchTerm("");
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImportSuccess(true);
    setTimeout(() => setImportSuccess(false), 3000);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const statusOptions = [
    { value: "all", label: "Все статусы" },
    { value: "active", label: "Активен" },
    { value: "vacation", label: "Отпуск" },
    { value: "sick", label: "Больничный" },
    { value: "inactive", label: "Неактивен" },
  ];

  const deptOptions = [
    { value: "all", label: "Все отделы" },
    ...departments.map((d) => ({ value: d, label: d })),
  ];

  const dayOptions = [
    { value: "all", label: "Все дни" },
    ...WEEKDAYS.map((d) => ({ value: d, label: d })),
  ];

  return (
    <div>
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-6 space-y-5">
        {/* Import banner */}
        {importSuccess && (
          <div className="flex items-center gap-3 rounded-2xl bg-emerald-500/10 border border-emerald-400/20 px-5 py-3 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
            <svg
              className="w-4 h-4 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            Файл успешно импортирован
          </div>
        )}

        {/* Main card */}
        <div className="rounded-3xl bg-white/60 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 backdrop-blur-xl p-6 shadow-md dark:shadow-xl transition-all duration-300">
          {/* Header row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Список назначенных смен
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Детальное расписание сотрудников
              </p>
            </div>
            <div className="flex items-center gap-2 self-start sm:self-auto">
              {/* Import button */}
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.xlsx,.xls"
                className="hidden"
                onChange={handleImport}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2 rounded-2xl border border-slate-200 dark:border-white/10 bg-white/80 dark:bg-white/5 text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/10 transition-all duration-200 hover:-translate-y-0.5 shadow-sm cursor-pointer"
              >
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
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                  />
                </svg>
                Импорт
              </button>

              {/* Search */}
              <div className="relative">
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
          </div>

          {/* Filter bar */}
          <div className="flex flex-wrap items-center gap-2 mb-5 p-3 rounded-2xl bg-slate-50/80 dark:bg-white/3 border border-slate-100 dark:border-white/5">
            {/* Filter icon label */}
            <div className="flex items-center gap-1.5 pr-2 border-r border-slate-200 dark:border-white/10 mr-1">
              <svg
                className="w-3.5 h-3.5 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z"
                />
              </svg>
              <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">
                Фильтры
              </span>
            </div>

            {/* Status dropdown */}
            <FilterDropdown
              value={statusFilter}
              onChange={setStatusFilter}
              options={statusOptions}
              icon={
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <circle cx="12" cy="12" r="4" strokeWidth={2.5} />
                </svg>
              }
            />

            {/* Department dropdown */}
            <FilterDropdown
              value={deptFilter}
              onChange={setDeptFilter}
              options={deptOptions}
              icon={
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              }
            />

            {/* Day dropdown */}
            <FilterDropdown
              value={dayFilter}
              onChange={setDayFilter}
              options={dayOptions}
              icon={
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              }
            />

            {/* Reset button */}
            {activeFiltersCount > 0 && (
              <button
                onClick={resetFilters}
                className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-2xl bg-rose-50 dark:bg-rose-500/10 text-rose-500 dark:text-rose-400 border border-rose-200 dark:border-rose-400/20 hover:bg-rose-100 dark:hover:bg-rose-500/20 transition-all duration-150 cursor-pointer"
              >
                <svg
                  className="w-3 h-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                Сбросить
                <span className="w-4 h-4 rounded-full bg-rose-500 text-white flex items-center justify-center text-[10px] leading-none">
                  {activeFiltersCount}
                </span>
              </button>
            )}

            {/* Count */}
            <span className="ml-auto text-xs text-slate-400 dark:text-slate-500 font-semibold tabular-nums">
              {loading ? "—" : `${filtered.length} / ${shifts.length}`}
            </span>
          </div>

          {/* Week Navigator */}
          <div className="mb-5">
            <WeekNavigator
              selectedWeekStart={selectedWeekStart}
              onChange={setSelectedWeekStart}
            />
          </div>

          {/* Employee rows */}
          <div className="space-y-3">
            {loading &&
              [0, 1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white/40 dark:bg-white/3 border border-slate-100 dark:border-white/5 p-4 rounded-2xl shadow-sm animate-pulse"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-slate-200 dark:bg-white/10" />
                    <div className="space-y-2">
                      <div className="h-4 w-36 rounded-lg bg-slate-200 dark:bg-white/10" />
                      <div className="h-3 w-48 rounded-lg bg-slate-200 dark:bg-white/5" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    {[0, 1, 2, 3, 4, 5, 6].map((day) => (
                      <div
                        key={day}
                        className="h-12 w-10 rounded-xl bg-slate-200 dark:bg-white/10"
                      />
                    ))}
                  </div>
                </div>
              ))}

            {!loading &&
              paginatedShifts.map((shift) => (
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
                  <div className="flex items-center gap-4 flex-wrap sm:flex-nowrap">
                    <WeeklyAttendanceCalendar
                      employeeId={shift.id}
                      shiftDays={shift.days}
                      selectedWeekStart={selectedWeekStart}
                      attendanceLogs={attendanceLogs}
                    />
                    <span
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full border shrink-0 ${
                        STATUS_CONFIG[shift.status as ShiftStatus]?.color || ""
                      }`}
                    >
                      {STATUS_CONFIG[shift.status as ShiftStatus]?.label ||
                        shift.status}
                    </span>
                  </div>
                </div>
              ))}

            {!loading && filtered.length === 0 && (
              <div className="rounded-2xl border border-dashed border-slate-200 dark:border-white/10 bg-white/30 dark:bg-white/3 p-8 text-center text-sm font-semibold text-slate-500 dark:text-slate-400">
                Сотрудники не найдены
              </div>
            )}

            {/* Pagination */}
            {!loading && filtered.length > 0 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Users;
