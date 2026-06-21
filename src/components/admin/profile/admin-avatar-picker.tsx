type AdminAvatarPickerProps = {
  onClose: () => void;
  onUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function AdminAvatarPicker({
  onClose,
  onUpload,
}: AdminAvatarPickerProps) {
  return (
    <div className="relative z-20 mb-8 w-full rounded-3xl border border-sky-500/20 bg-white/80 p-6 shadow-[0_20px_40px_rgba(0,0,0,0.06)] backdrop-blur-2xl dark:border-sky-500/30 dark:bg-white/5 dark:shadow-[0_20px_40px_rgba(0,0,0,0.5)]">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          Выберите новый аватар
        </h3>
        <button
          type="button"
          onClick={onClose}
          className="cursor-pointer text-slate-500 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
          aria-label="Закрыть"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18 18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
      <label
        htmlFor="admin-avatar-upload"
        className="group flex h-24 w-24 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 transition hover:border-sky-500 hover:bg-sky-50 dark:border-white/20 dark:hover:bg-sky-500/10"
      >
        <span className="text-3xl text-slate-400 transition group-hover:text-sky-500">
          +
        </span>
        <span className="mt-1 text-[10px] font-bold text-slate-400 uppercase group-hover:text-sky-500">
          Загрузить
        </span>
        <input
          type="file"
          id="admin-avatar-upload"
          onChange={onUpload}
          accept="image/*"
          className="hidden"
        />
      </label>
    </div>
  );
}
