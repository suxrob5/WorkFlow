export function SalaryError({ message }: { message: string }) {
  if (!message) return null;

  return (
    <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-700 dark:border-red-400/20 dark:bg-red-500/10 dark:text-red-300">
      {message}
    </div>
  );
}

export function SalaryLoading() {
  return (
    <div className="grid min-h-95 place-items-center rounded-3xl border border-slate-200/70 bg-white/60 dark:border-white/10 dark:bg-white/5">
      <span className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
    </div>
  );
}

export function SalaryEmpty() {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white/60 p-10 text-center text-slate-500 dark:border-white/10 dark:bg-white/5">
      Сотрудники не найдены
    </div>
  );
}
