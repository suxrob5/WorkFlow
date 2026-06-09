"use client";

import React, { useState, useEffect } from "react";
import AdHeader from "@/components/admin/header";
import { getEmployeeRowsFromFirestore, getAttendanceRaw } from "@/firebase/db";

// Sub-components
import DeptReportTable from "@/components/admin/report/dept-report-table";
import EmployeeReportTable from "@/components/admin/report/employee-report-table";
import LatesReportTable from "@/components/admin/report/lates-report-table";

interface Tab {
  id: string;
  title: string;
  reportType?: string; // by_departments, by_employees, lates_early_departures
}

const REPORT_TYPES = [
  {
    id: "by_departments",
    title: "По отделам",
    desc: "Сводный табель посещаемости сотрудников по отделам",
  },
  {
    id: "by_employees",
    title: "По сотрудникам",
    desc: "Индивидуальный детальный календарь учета времени сотрудников",
  },
  {
    id: "lates_early_departures",
    title: "Опоздания и Ранние уходы",
    desc: "Отчет по нарушениям графика приходов и уходов",
  },
];

export default function ReportPage() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [attendanceLogs, setAttendanceLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Tabs state
  const [openTabs, setOpenTabs] = useState<Tab[]>([
    { id: "reports_home", title: "Отчеты" },
  ]);
  const [activeTabId, setActiveTabId] = useState<string>("reports_home");

  // Date and filter states
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [deptFilter, setDeptFilter] = useState<string>("all");
  const [positionFilter, setPositionFilter] = useState<string>("all");

  // States used to trigger actual report generation
  const [genStartDate, setGenStartDate] = useState<string>("");
  const [genEndDate, setGenEndDate] = useState<string>("");
  const [genSearchTerm, setGenSearchTerm] = useState<string>("");
  const [genDeptFilter, setGenDeptFilter] = useState<string>("all");
  const [genPositionFilter, setGenPositionFilter] = useState<string>("all");
  const [isCompiled, setIsCompiled] = useState<boolean>(false);

  useEffect(() => {
    // Set default date range to last 7 days
    const today = new Date();
    const lastWeek = new Date();
    lastWeek.setDate(today.getDate() - 7);

    setStartDate(lastWeek.toISOString().split("T")[0]);
    setEndDate(today.toISOString().split("T")[0]);
    setGenStartDate(lastWeek.toISOString().split("T")[0]);
    setGenEndDate(today.toISOString().split("T")[0]);

    // Load initial data
    const loadData = async () => {
      try {
        setLoading(true);
        const [empData, attData] = await Promise.all([
          getEmployeeRowsFromFirestore(),
          getAttendanceRaw(),
        ]);
        setEmployees(empData);
        setAttendanceLogs(attData);
      } catch (err) {
        console.error("Error loading reports data:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const departments = Array.from(
    new Set(employees.map((e) => e.dept).filter(Boolean)),
  );

  // Open a report tab
  const handleOpenReport = (typeId: string, title: string) => {
    const existing = openTabs.find((t) => t.id === typeId);
    if (!existing) {
      const newTab: Tab = { id: typeId, title, reportType: typeId };
      setOpenTabs([...openTabs, newTab]);
    }
    setActiveTabId(typeId);
    setIsCompiled(false); // Reset compiled state when switching or opening
  };

  // Close a report tab
  const handleCloseTab = (e: React.MouseEvent, tabId: string) => {
    e.stopPropagation();
    const index = openTabs.findIndex((t) => t.id === tabId);
    const updated = openTabs.filter((t) => t.id !== tabId);
    setOpenTabs(updated);

    if (activeTabId === tabId) {
      // Switch active tab to previous or home
      const nextActiveIndex = Math.max(0, index - 1);
      setActiveTabId(updated[nextActiveIndex]?.id || "reports_home");
    }
  };

  // Compile report trigger
  const handleCompile = () => {
    setGenStartDate(startDate);
    setGenEndDate(endDate);
    setGenSearchTerm(searchTerm);
    setGenDeptFilter(deptFilter);
    setGenPositionFilter(positionFilter);
    setIsCompiled(true);
  };

  // Export HTML Table to CSV
  const handleExportCSV = () => {
    const tableId = `report-table-${activeTabId}`;
    const table = document.getElementById(tableId);
    if (!table) return;

    const rows = Array.from(table.querySelectorAll("tr"));
    const csvContent =
      "\uFEFF" +
      rows
        .map((tr) => {
          const cells = Array.from(tr.querySelectorAll("th, td"));
          return cells
            .map((cell) => {
              let text = cell.textContent || "";
              // Clean double spaces/tabs
              text = text.replace(/\s+/g, " ").trim();
              return `"${text.replace(/"/g, '""')}"`;
            })
            .join(",");
        })
        .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `Report_${activeTabId}_${genStartDate}_to_${genEndDate}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const activeTab = openTabs.find((t) => t.id === activeTabId);

  return (
    <div className="min-h-screen text-slate-800 dark:text-slate-100 relative overflow-hidden transition-colors duration-300">
      <AdHeader />

      {/* Background glow effects */}
      <div className="absolute top-[-10%] left-[-5%] w-[45vw] h-[45vw] rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[45vw] h-[45vw] rounded-full bg-blue-600/5 blur-[120px] pointer-events-none z-0" />

      <main className="relative z-10 max-w-7xl mx-auto px-4 py-8 md:px-6 space-y-6">
        {/* Dynamic Tab Row */}
        <div className="flex border-b border-slate-200 dark:border-white/10 overflow-x-auto scrollbar-none gap-1 bg-slate-100/50 dark:bg-white/5 p-1 rounded-2xl">
          {openTabs.map((tab) => {
            const isActive = tab.id === activeTabId;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTabId(tab.id);
                  setIsCompiled(false);
                }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer select-none whitespace-nowrap
                  ${
                    isActive
                      ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm border border-slate-200/50 dark:border-white/10"
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white hover:bg-white/30 dark:hover:bg-white/5"
                  }`}
              >
                {tab.title}
                {tab.id !== "reports_home" && (
                  <span
                    onClick={(e) => handleCloseTab(e, tab.id)}
                    className="w-4.5 h-4.5 rounded-full flex items-center justify-center text-[10px] font-bold bg-slate-200/50 hover:bg-rose-500/20 hover:text-rose-500 text-slate-500 dark:text-slate-400 transition"
                  >
                    ×
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab content */}
        {activeTabId === "reports_home" ? (
          /* Reports Selection Portal */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fadeIn">
            {REPORT_TYPES.map((rep) => (
              <div
                key={rep.id}
                className="rounded-3xl bg-white/60 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 backdrop-blur-xl p-6 shadow-md dark:shadow-xl hover:border-sky-500/50 dark:hover:border-sky-500/40 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-2xl bg-sky-500/10 border border-sky-400/20 flex items-center justify-center text-lg">
                    📊
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                    {rep.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {rep.desc}
                  </p>
                </div>
                <button
                  onClick={() => handleOpenReport(rep.id, rep.title)}
                  className="mt-6 w-full py-2.5 rounded-2xl bg-sky-500 text-white font-bold text-xs hover:bg-sky-600 transition shadow-lg shadow-sky-500/20 cursor-pointer"
                >
                  Открыть отчет
                </button>
              </div>
            ))}
          </div>
        ) : (
          /* Report Control Panel + Compiled Data View */
          <div className="space-y-6 animate-fadeIn">
            <div className="rounded-3xl bg-white/60 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 backdrop-blur-xl p-6 shadow-md dark:shadow-xl space-y-5">
              {/* Filter controls */}
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-3">
                  {/* Date range picker */}
                  <div className="flex items-center gap-2 bg-white/80 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-3.5 py-1.5 shadow-sm">
                    <span className="text-xs font-bold text-slate-400 uppercase">
                      С
                    </span>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="bg-transparent text-xs font-bold outline-none text-slate-800 dark:text-slate-100"
                    />
                    <span className="text-slate-400">—</span>
                    <span className="text-xs font-bold text-slate-400 uppercase">
                      По
                    </span>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="bg-transparent text-xs font-bold outline-none text-slate-800 dark:text-slate-100"
                    />
                  </div>

                  {/* Department select filter */}
                  <select
                    value={deptFilter}
                    onChange={(e) => setDeptFilter(e.target.value)}
                    className="bg-white/80 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-3 py-2 text-xs font-bold outline-none text-slate-700 dark:text-slate-300"
                  >
                    <option value="all">Все отделы</option>
                    {departments.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>

                  {/* Position select filter */}
                  <select
                    value={positionFilter}
                    onChange={(e) => setPositionFilter(e.target.value)}
                    className="bg-white/80 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-3 py-2 text-xs font-bold outline-none text-slate-700 dark:text-slate-300"
                  >
                    <option value="all">Все должности</option>
                    <option value="Руководитель склада">
                      Руководитель склада
                    </option>
                    <option value="Заместитель руководителя склада">
                      Заместитель руководителя склада
                    </option>
                    <option value="Супервайзер">Супервайзер</option>
                    <option value="Контролёр отправки товаров">
                      Контролёр отправки товаров
                    </option>
                    <option value="Контролёр приёмки товаров">
                      Контролёр приёмки товаров
                    </option>
                    <option value="Комплектовщик">Комплектовщик</option>
                    <option value="Грузчик">Грузчик</option>
                  </select>

                  {/* Search employee by name */}
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Поиск сотрудника..."
                    className="bg-white/80 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-3 py-2 text-xs font-semibold outline-none text-slate-900 dark:text-white placeholder:text-slate-400 w-48"
                  />

                  {/* Compile Report button */}
                  <button
                    onClick={handleCompile}
                    className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs px-5 py-2.5 rounded-2xl shadow-md transition duration-200 hover:-translate-y-0.5 cursor-pointer"
                  >
                    Составить отчет
                  </button>
                </div>

                {/* Right side options: Excel download */}
                {isCompiled && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleExportCSV}
                      title="Экспорт в Excel (CSV)"
                      className="flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-4 py-2.5 rounded-2xl shadow-md transition hover:-translate-y-0.5 cursor-pointer"
                    >
                      🟢 Excel
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Generated Reports Table Container */}
            {isCompiled ? (
              loading ? (
                <div className="text-center py-20 font-bold text-slate-500 dark:text-slate-400 animate-pulse">
                  Формирование отчета...
                </div>
              ) : (
                <div className="animate-fadeIn">
                  {activeTab?.reportType === "by_departments" && (
                    <DeptReportTable
                      employees={employees}
                      attendanceLogs={attendanceLogs}
                      startDate={genStartDate}
                      endDate={genEndDate}
                      searchTerm={genSearchTerm}
                      deptFilter={genDeptFilter}
                      positionFilter={genPositionFilter}
                      tableId={`report-table-${activeTabId}`}
                    />
                  )}
                  {activeTab?.reportType === "by_employees" && (
                    <EmployeeReportTable
                      employees={employees}
                      attendanceLogs={attendanceLogs}
                      startDate={genStartDate}
                      endDate={genEndDate}
                      searchTerm={genSearchTerm}
                      deptFilter={genDeptFilter}
                      positionFilter={genPositionFilter}
                      tableId={`report-table-${activeTabId}`}
                    />
                  )}
                  {activeTab?.reportType === "lates_early_departures" && (
                    <LatesReportTable
                      employees={employees}
                      attendanceLogs={attendanceLogs}
                      startDate={genStartDate}
                      endDate={genEndDate}
                      searchTerm={genSearchTerm}
                      deptFilter={genDeptFilter}
                      positionFilter={genPositionFilter}
                      tableId={`report-table-${activeTabId}`}
                    />
                  )}
                </div>
              )
            ) : (
              <div className="rounded-3xl border-2 border-dashed border-slate-200 dark:border-white/10 bg-white/20 dark:bg-white/2 p-16 text-center text-slate-400 dark:text-slate-500 font-semibold">
                Задайте параметры фильтрации выше и нажмите кнопку «Составить
                отчет»
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
