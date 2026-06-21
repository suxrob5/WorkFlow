"use client";

import AdHeader from "@/components/admin/header";
import AttendanceDetails from "@/components/admin/salary/attendance-details";
import BonusBreakdown from "@/components/admin/salary/bonus-breakdown";
import BonusFormula from "@/components/admin/salary/bonus-formula";
import {
  SalaryEmpty,
  SalaryError,
  SalaryLoading,
} from "@/components/admin/salary/salary-states";
import SalarySummary from "@/components/admin/salary/salary-summary";
import SalaryToolbar from "@/components/admin/salary/salary-toolbar";
import {
  getSalaryDashboardData,
  getSalaryEmployees,
  type SalaryDashboardData,
  type SalaryEmployee,
} from "@/firebase/salary";
import { useEffect, useState } from "react";

const currentMonth = () => {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
};

export default function SalaryPage() {
  const [employees, setEmployees] = useState<SalaryEmployee[]>([]);
  const [employeeId, setEmployeeId] = useState("");
  const [month, setMonth] = useState(currentMonth);
  const [data, setData] = useState<SalaryDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getSalaryEmployees()
      .then((items) => {
        setEmployees(items);
        setEmployeeId((selected) => selected || items[0]?.id || "");
        if (items.length === 0) setLoading(false);
      })
      .catch(() => {
        setError("Сотрудников не удалось загрузить");
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!employeeId) return;

    setLoading(true);
    setError("");
    getSalaryDashboardData(employeeId, month)
      .then(setData)
      .catch((loadError) => {
        console.error("Error loading salary dashboard:", loadError);
        setError("Данные о зарплате не удалось загрузить");
      })
      .finally(() => setLoading(false));
  }, [employeeId, month]);

  return (
    <div className="relative min-h-screen overflow-hidden text-slate-800 dark:text-slate-100">
      <AdHeader />
      <div className="pointer-events-none absolute -left-40 top-20 h-150 w-150 rounded-full bg-blue-500/8 blur-[130px]" />
      <div className="pointer-events-none absolute -right-40 bottom-0 h-150 w-150 rounded-full bg-emerald-500/8 blur-[130px]" />

      <main className="relative z-10 mx-auto max-w-7xl space-y-6 px-4 py-7 md:px-6">
        <SalaryToolbar
          employeeLabel={data?.employee.name || "Сотрудник"}
          employees={employees}
          employeeId={employeeId}
          month={month}
          onEmployeeChange={setEmployeeId}
          onMonthChange={setMonth}
        />

        <SalaryError message={error} />

        {loading ? (
          <SalaryLoading />
        ) : data ? (
          <>
            <SalarySummary data={data} />
            <BonusBreakdown data={data} />
            <AttendanceDetails data={data} />
            <BonusFormula data={data} />
          </>
        ) : (
          <SalaryEmpty />
        )}
      </main>
    </div>
  );
}
