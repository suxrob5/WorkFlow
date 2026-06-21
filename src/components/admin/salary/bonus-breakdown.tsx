import type { SalaryCriterion, SalaryDashboardData } from "@/firebase/salary";
import CircleScore from "./circle-score";
import SalaryIcon, { type SalaryIconName } from "./salary-icon";
import { formatUzs } from "./salary-summary";

const criterionPresentation: Record<
  SalaryCriterion["key"],
  { icon: SalaryIconName; color: string }
> = {
  attendance: {
    icon: "calendar",
    color: "text-blue-600 bg-blue-500/10",
  },
  violations: {
    icon: "warning",
    color: "text-orange-600 bg-orange-500/10",
  },
  discipline: {
    icon: "user",
    color: "text-violet-600 bg-violet-500/10",
  },
};

function CriterionCard({ item }: { item: SalaryCriterion }) {
  const presentation = criterionPresentation[item.key];

  return (
    <article className="rounded-2xl border border-slate-200/80 bg-white/80 p-4 shadow-sm dark:border-white/10 dark:bg-white/5">
      <div className="flex items-center gap-3">
        <span
          className={`grid h-11 w-11 place-items-center rounded-xl ${presentation.color}`}
        >
          <SalaryIcon name={presentation.icon} className="h-6 w-6" />
        </span>
        <h3 className="font-extrabold text-slate-900 dark:text-white">
          {item.title}
        </h3>
        <span className="ml-auto grid h-5 w-5 place-items-center rounded-full border border-slate-400 text-[11px] text-slate-500">
          i
        </span>
      </div>
      <div className="my-2 flex justify-center">
        <CircleScore score={item.score} />
      </div>
      <div className="space-y-2 border-t border-slate-200 pt-3 text-xs dark:border-white/10">
        <p className="text-slate-500 dark:text-slate-400">{item.plan}</p>
        <p className="font-bold text-slate-800 dark:text-slate-200">
          {item.fact}
          <span className="float-right text-emerald-500">●</span>
        </p>
      </div>
    </article>
  );
}

export default function BonusBreakdown({
  data,
}: {
  data: SalaryDashboardData;
}) {
  return (
    <section className="grid gap-5 xl:grid-cols-[minmax(0,2fr)_minmax(280px,0.8fr)]">
      <div className="rounded-3xl border border-slate-200/70 bg-white/60 p-4 shadow-md backdrop-blur-xl dark:border-white/10 dark:bg-white/5 md:p-5">
        <h2 className="mb-4 text-lg font-black text-slate-900 dark:text-white">
          Критерии бонусной части
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          {data.criteria.map((item) => (
            <CriterionCard key={item.key} item={item} />
          ))}
        </div>
      </div>

      <aside className="rounded-3xl border border-emerald-200/70 bg-white/70 p-5 shadow-md backdrop-blur-xl dark:border-emerald-400/15 dark:bg-white/5">
        <h2 className="text-lg font-black text-slate-900 dark:text-white">
          Бонусная часть
        </h2>
        <div className="my-4 flex justify-center">
          <CircleScore score={data.bonusPercent} large />
        </div>
        <div className="rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-900 dark:bg-emerald-500/10 dark:text-emerald-200">
          <strong>
            {data.bonusPercent === 100
              ? "Все критерии выполнены на 100%"
              : `Итоговый результат: ${data.bonusPercent}%`}
          </strong>
          <p className="mt-1 text-xs opacity-75">
            Бонус рассчитан по данным Firebase
          </p>
        </div>
        <div className="mt-5 flex items-end justify-between gap-3">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Сумма бонуса к выплате
          </span>
          <strong className="text-xl text-emerald-600 dark:text-emerald-400">
            {formatUzs.format(data.bonus)}
          </strong>
        </div>
      </aside>
    </section>
  );
}
