import type { SalaryDashboardData } from "@/firebase/salary";

export default function BonusFormula({ data }: { data: SalaryDashboardData }) {
  return (
    <section className="flex flex-col items-center gap-4 rounded-3xl border border-blue-100 bg-blue-50/80 p-5 text-center dark:border-blue-400/10 dark:bg-blue-500/8 md:flex-row md:text-left">
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-blue-600 text-xl font-black text-white">
        i
      </span>
      <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
        Итоговый бонус формируется из посещаемости, отсутствия нарушений и
        дисциплины сотрудника.
      </p>
      <div className="ml-auto flex flex-wrap items-center justify-center gap-2 text-xs font-extrabold text-slate-600 dark:text-slate-300">
        {data.criteria.map((item, index) => (
          <span key={item.key} className="contents">
            <span className="rounded-full bg-white px-3 py-2 shadow-sm dark:bg-white/10">
              ✓ {item.title} {item.score}%
            </span>
            {index < data.criteria.length - 1 ? <b>+</b> : null}
          </span>
        ))}
        <b>=</b>
        <span className="rounded-full bg-emerald-100 px-3 py-2 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
          Бонус {data.bonusPercent}%
        </span>
      </div>
    </section>
  );
}
