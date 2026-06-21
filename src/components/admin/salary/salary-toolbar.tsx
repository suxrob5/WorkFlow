import type { SalaryEmployee } from "@/firebase/salary";

type SalaryToolbarProps = {
  employeeLabel: string;
  employees: SalaryEmployee[];
  employeeId: string;
  month: string;
  onEmployeeChange: (employeeId: string) => void;
  onMonthChange: (month: string) => void;
};

export default function SalaryToolbar({
  employeeLabel,
  employees,
  employeeId,
  month,
  onEmployeeChange,
  onMonthChange,
}: SalaryToolbarProps) {
  return (
    <section className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <p className="mb-1 text-xs font-extrabold uppercase tracking-[0.18em] text-blue-600 dark:text-sky-400">
          Расчёт вознаграждения
        </p>
        <h1 className="text-2xl font-black tracking-tight text-slate-950 dark:text-white md:text-3xl">
          Дашборд сотрудника
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {employeeLabel} · зарплата и бонусы за выбранный месяц
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-xs font-bold text-slate-500 dark:text-slate-400">
          Сотрудник
          <select
            value={employeeId}
            onChange={(event) => onEmployeeChange(event.target.value)}
            className="mt-1 block h-11 min-w-55 rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold text-slate-800 outline-none focus:border-blue-500 dark:border-white/10 dark:bg-[#071c45] dark:text-white"
          >
            {employees.map((employee) => (
              <option key={employee.id} value={employee.id}>
                {employee.name}
              </option>
            ))}
          </select>
        </label>
        <label className="text-xs font-bold text-slate-500 dark:text-slate-400">
          Период
          <input
            type="month"
            value={month}
            onChange={(event) => onMonthChange(event.target.value)}
            className="mt-1 block h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold text-slate-800 outline-none focus:border-blue-500 dark:border-white/10 dark:bg-[#071c45] dark:text-white"
          />
        </label>
      </div>
    </section>
  );
}
