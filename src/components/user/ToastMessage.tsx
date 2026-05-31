const ToastMessage = ({
  showToast,
  toastMessage,
}: {
  showToast: boolean;
  toastMessage: string;
}) => {
  return (
    <div
      className={`fixed top-6 right-6 z-50 transition-all duration-300 transform ${showToast ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0 pointer-events-none"}`}
    >
      <div className="bg-white dark:bg-[#021E5D] border border-slate-200/60 dark:border-emerald-500/30 text-emerald-600 dark:text-emerald-400 px-6 py-4 rounded-2xl shadow-[0_15px_30px_rgba(0,0,0,0.1)] dark:shadow-[0_15px_30px_rgba(0,0,0,0.4)] backdrop-blur-xl flex items-center gap-3">
        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-300">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </span>
        <span className="font-semibold text-sm">{toastMessage}</span>
      </div>
    </div>
  );
};

export default ToastMessage;
