import type { SalaryDashboardData } from "@/firebase/salary";
import SalaryIcon from "./salary-icon";

export const formatUzs = new Intl.NumberFormat("uz-UZ", {
  style: "currency",
  currency: "UZS",
  maximumFractionDigits: 0,
});

export default function SalarySummary({ data }: { data: SalaryDashboardData }) {
  return (
    <section className="grid gap-4 lg:grid-cols-[1fr_auto_1fr_auto_1fr] lg:items-stretch">
      <div className="rounded-3xl bg-linear-to-br from-blue-500 to-blue-700 p-6 text-white shadow-xl shadow-blue-500/20">
        <div className="flex items-center gap-4">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-white/95 text-blue-600">
            <SalaryIcon name="wallet" />
          </span>
          <div>
            <p className="text-sm text-blue-100">Фиксированная зарплата</p>
            <strong className="mt-1 block text-2xl md:text-3xl">
              {formatUzs.format(data.baseSalary)}
            </strong>
          </div>
        </div>
        <p className="mt-5 text-sm text-blue-100">Базовая часть</p>
      </div>

      <span className="hidden self-center text-4xl font-light text-slate-400 lg:block">
        +
      </span>

      <div className="rounded-3xl bg-linear-to-br from-emerald-500 to-green-600 p-6 text-white shadow-xl shadow-emerald-500/20">
        <div className="flex items-center gap-4">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-white/95 text-emerald-600">
            <SalaryIcon name="gift" />
          </span>
          <div>
            <p className="text-sm text-emerald-50">Бонусная часть</p>
            <strong className="mt-1 block text-2xl md:text-3xl">
              {formatUzs.format(data.bonus)}
            </strong>
          </div>
        </div>
        <p className="mt-5 text-sm text-emerald-50">
          Максимум: {formatUzs.format(data.maximumBonus)}
        </p>
      </div>

      <span className="hidden self-center text-4xl font-light text-slate-400 lg:block">
        =
      </span>

      <div className="rounded-3xl border border-blue-200 bg-blue-50/90 p-6 shadow-lg dark:border-blue-400/20 dark:bg-blue-500/10">
        <div className="flex items-center gap-4">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-blue-600 text-white">
            <SalaryIcon name="wallet" />
          </span>
          <div>
            <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
              Общая зарплата
            </p>
            <strong className="mt-1 block text-2xl text-blue-600 dark:text-sky-400 md:text-3xl">
              {formatUzs.format(data.totalSalary)}
            </strong>
          </div>
        </div>
        <p className="mt-5 text-sm font-bold text-slate-600 dark:text-slate-300">
          Фиксированная + бонусная часть
        </p>
      </div>
    </section>
  );
}
