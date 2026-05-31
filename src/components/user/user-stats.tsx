const UserStats = () => {
  return (
    <div className="grid grid-cols-3 gap-4 mb-8">
      <div className="p-4 rounded-2xl bg-white/60 dark:bg-white/5 border border-slate-200/60 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/10 transition duration-300 flex flex-col items-center justify-center text-center backdrop-blur-md shadow-md dark:shadow-lg">
        <span className="text-2xl md:text-3xl font-extrabold text-sky-500 dark:text-sky-400 tracking-tight">
          24
        </span>
        <span className="text-[11px] md:text-xs font-semibold text-slate-600 dark:text-slate-400 mt-1 uppercase tracking-wider">
          Выполнено задач
        </span>
      </div>
      <div className="p-4 rounded-2xl bg-white/60 dark:bg-white/5 border border-slate-200/60 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/10 transition duration-300 flex flex-col items-center justify-center text-center backdrop-blur-md shadow-md dark:shadow-lg">
        <span className="text-2xl md:text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 tracking-tight">
          18
        </span>
        <span className="text-[11px] md:text-xs font-semibold text-slate-600 dark:text-slate-400 mt-1 uppercase tracking-wider">
          Отработано смен
        </span>
      </div>
      <div className="p-4 rounded-2xl bg-white/60 dark:bg-white/5 border border-slate-200/60 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/10 transition duration-300 flex flex-col items-center justify-center text-center backdrop-blur-md shadow-md dark:shadow-lg">
        <span className="text-2xl md:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 tracking-tight">
          98%
        </span>
        <span className="text-[11px] md:text-xs font-semibold text-slate-600 dark:text-slate-400 mt-1 uppercase tracking-wider">
          Эффективность
        </span>
      </div>
    </div>
  );
};

export default UserStats;
