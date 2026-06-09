const Loading = ({ pageName }: { pageName: string }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-[#021236]">
      <div className="relative">
        {/* Outer spinning ring */}
        <div className="w-20 h-20 rounded-full border-4 border-sky-500/20 border-t-sky-500 animate-spin" />
        {/* Inner pulsing logo or icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-10 h-10 bg-sky-500 rounded-xl animate-pulse" />
        </div>
      </div>
      <h2 className="mt-6 text-lg font-bold text-slate-900 dark:text-white animate-pulse font-nunito">
        Загрузка {pageName}...
      </h2>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 font-nunito">
        Пожалуйста, подождите
      </p>
    </div>
  );
};

export default Loading;
