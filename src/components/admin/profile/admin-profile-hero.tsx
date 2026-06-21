import Image from "next/image";
import type { AdminProfileData } from "./types";

type AdminProfileHeroProps = {
  profile: AdminProfileData;
  isEditing: boolean;
  isSaving: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onSave: () => void;
  onSignOut: () => void;
  onAvatarClick: () => void;
};

export default function AdminProfileHero({
  profile,
  isEditing,
  isSaving,
  onEdit,
  onCancel,
  onSave,
  onSignOut,
  onAvatarClick,
}: AdminProfileHeroProps) {
  return (
    <div className="mb-8 w-full overflow-hidden rounded-3xl border border-slate-200/60 bg-white/60 shadow-[0_25px_50px_rgba(0,0,0,0.06)] backdrop-blur-xl transition-all duration-300 dark:border-white/10 dark:bg-white/5 dark:shadow-[0_25px_50px_rgba(0,0,0,0.35)]">
      <div className="relative flex h-44 w-full items-center overflow-hidden bg-linear-to-r from-sky-600 via-indigo-600 to-blue-800 md:h-52">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-6 left-12 h-24 w-24 animate-pulse rounded-full bg-white/20 blur-xl" />
          <div className="absolute right-16 bottom-4 h-36 w-36 animate-pulse rounded-full bg-sky-400/20 blur-2xl" />
        </div>
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute right-6 bottom-4 rounded-full border border-white/5 bg-black/30 px-3 py-1 text-xs text-white/50 backdrop-blur-md">
          Admin ID: {profile.employeeId}
        </div>
      </div>

      <div className="relative -mt-16 flex flex-col items-center justify-between gap-6 px-6 pt-0 pb-6 md:-mt-20 md:flex-row md:flex-wrap md:items-end">
        <div className="flex min-w-0 flex-1 flex-col items-center gap-5 text-center md:flex-row md:items-end md:text-left">
          <div className="group relative h-32 w-32 shrink-0 rounded-full bg-linear-to-tr from-sky-400 via-indigo-500 to-blue-600 p-1.5 shadow-[0_10px_35px_rgba(14,165,233,0.25)] transition duration-300 hover:scale-[1.03] md:h-36 md:w-36">
            <div className="relative h-full w-full overflow-hidden rounded-full border-4 border-slate-50 transition-colors dark:border-[#021236]">
              <Image
                src={profile.avatarUrl || "/user-logo.png"}
                alt="Admin avatar"
                width={150}
                height={150}
                priority
                className="h-full w-full object-cover transition duration-300 group-hover:brightness-[0.7]"
              />
            </div>
            <button
              type="button"
              onClick={onAvatarClick}
              title="Сменить аватар"
              className="absolute inset-1.5 flex cursor-pointer items-center justify-center rounded-full bg-black/40 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            >
              <svg
                className="h-8 w-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 9a2 2 0 0 1 2-2h.93a2 2 0 0 0 1.664-.89l.812-1.22A2 2 0 0 1 10.07 4h3.86a2 2 0 0 1 1.664.89l.812 1.22A2 2 0 0 0 18.07 7H19a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 13a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
              </svg>
            </button>
          </div>

          <div className="mb-2 min-w-0 flex-1">
            <div className="flex flex-col items-center gap-3 md:flex-row md:flex-wrap">
              <h2 className="text-3xl leading-tight font-bold tracking-tight text-slate-900 dark:text-white">
                {profile.fullName || "Администратор"}
              </h2>
              <span className="flex shrink-0 items-center gap-1.5 rounded-full border border-sky-400/30 bg-sky-500/10 px-3 py-1 text-xs font-bold tracking-wider text-sky-600 uppercase dark:text-sky-300">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-sky-500 dark:bg-sky-400" />
                Administrator
              </span>
            </div>
            <p className="mt-1 max-w-md text-sm font-medium text-slate-600 dark:text-slate-400">
              {profile.email}
            </p>
          </div>
        </div>

        <div className="mb-2 flex shrink-0 items-center justify-center gap-3">
          {!isEditing ? (
            <>
              <button
                type="button"
                onClick={onEdit}
                className="flex cursor-pointer items-center gap-2 rounded-2xl border border-slate-200 bg-slate-100 px-6 py-2.5 font-semibold text-slate-800 shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-200 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/15"
              >
                Редактировать
              </button>
              <button
                type="button"
                onClick={onSignOut}
                className="flex cursor-pointer items-center gap-2 rounded-2xl border border-red-500/20 bg-red-500/10 px-6 py-2.5 font-bold text-red-600 shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:bg-red-500/15 dark:bg-red-500/5 dark:text-red-400"
              >
                Выйти
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={onCancel}
                className="cursor-pointer rounded-2xl border border-slate-200 bg-slate-100 px-4 py-2.5 font-semibold text-slate-700 transition hover:bg-slate-200 dark:border-white/5 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10"
              >
                Отмена
              </button>
              <button
                type="button"
                onClick={onSave}
                disabled={isSaving}
                className="cursor-pointer rounded-2xl bg-linear-to-br from-sky-500 to-blue-600 px-6 py-2.5 font-bold text-white shadow-lg shadow-sky-500/20 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSaving ? "Сохранение..." : "Сохранить"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
