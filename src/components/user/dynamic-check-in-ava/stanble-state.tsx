const StableState = ({ startCamera }: { startCamera: () => void }) => {
  return (
    /* Standby State */
    <div className="py-8 space-y-6 flex flex-col items-center">
      <div className="w-20 h-20 rounded-full bg-linear-to-tr from-sky-500/10 to-indigo-600/20 border border-slate-200/60 dark:border-white/15 flex items-center justify-center shadow-lg relative group">
        <span className="absolute inset-0 rounded-full bg-sky-500/5 animate-ping" />
        <svg
          className="w-10 h-10 text-sky-550 dark:text-sky-400 group-hover:scale-110 transition duration-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      </div>

      <div className="space-y-2">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
          Готовы начать рабочую смену?
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
          Программа запросит доступ к фронтальной камере для снимка и запишет
          текущие координаты GPS для сверки.
        </p>
      </div>

      <button
        onClick={startCamera}
        className="bg-linear-to-r from-sky-500 to-blue-600 hover:opacity-95 text-white font-bold px-8 py-3.5 rounded-2xl shadow-lg shadow-sky-500/20 transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98] flex items-center gap-2.5 cursor-pointer text-sm"
      >
        Начать отметку смены
      </button>
    </div>
  );
};

export default StableState;
