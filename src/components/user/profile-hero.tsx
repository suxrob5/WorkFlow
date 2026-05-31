"use client";

import { Changing, Save, Saving } from "@/assets/logos/images";
import { useProfile } from "@/firebase/db";
import Image from "next/image";

interface ProfileHeroProps {
  setShowAvatarSelector: (value: boolean) => void;
  showAvatarSelector: boolean;
  isEditing: boolean;
  setIsEditing: (value: boolean) => void;
  cancelEdit: () => void;
  isSaving: boolean;
  user: any;
  handleSave: (e: React.FormEvent) => Promise<void>;
}

const ProfileHero = ({
  setShowAvatarSelector,
  showAvatarSelector,
  isEditing,
  setIsEditing,
  cancelEdit,
  isSaving,
  user,
  handleSave,
}: ProfileHeroProps) => {
  const { profileData, loading } = useProfile();

  if (loading || !profileData || profileData === "nothing") {
    return null;
  }

  return (
    <div className="w-full rounded-3xl bg-white/60 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 backdrop-blur-xl shadow-[0_25px_50px_rgba(0,0,0,0.06)] dark:shadow-[0_25px_50px_rgba(0,0,0,0.35)] overflow-hidden mb-8 transition-all duration-300">
      {/* Glowing Banner Background */}
      <div className="h-44 md:h-52 w-full relative bg-linear-to-r from-sky-600 via-indigo-600 to-blue-800 flex items-center overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-6 left-12 w-24 h-24 rounded-full bg-white/20 blur-xl animate-pulse" />
          <div className="absolute bottom-4 right-16 w-36 h-36 rounded-full bg-sky-400/20 blur-2xl animate-pulse delay-75" />
        </div>
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute bottom-4 right-6 text-xs text-white/50 bg-black/30 backdrop-blur-md px-3 py-1 rounded-full border border-white/5">
          ID: {user?.uid}
        </div>
      </div>

      {/* Profile Information Overview Row */}
      <div className="px-6 pb-6 pt-0 relative flex flex-col md:flex-row md:items-end justify-between gap-6 -mt-16 md:-mt-20">
        <div className="flex flex-col md:flex-row items-center md:items-end gap-5 text-center md:text-left">
          {/* Avatar container with interactive hover selector trigger */}
          <div className="relative group w-32 h-32 md:w-36 md:h-36 rounded-full p-1.5 bg-linear-to-tr from-sky-400 via-indigo-500 to-blue-600 shadow-[0_10px_35px_rgba(14,165,233,0.2)] dark:shadow-[0_10px_35px_rgba(14,165,233,0.3)] transition duration-300 hover:scale-[1.03]">
            <div className="w-full h-full rounded-full overflow-hidden border-4 border-slate-50 dark:border-[#021236] relative transition-colors duration-300">
              <Image
                src={
                  typeof profileData.avatarUrl === "string"
                    ? profileData.avatarUrl.trim()
                    : profileData.avatarUrl
                }
                alt="Profile Avatar"
                width={150}
                height={150}
                priority
                className="object-cover w-full h-full transition duration-300 group-hover:brightness-[0.7]"
              />
            </div>
            {/* Camera overlay hover button */}
            <button
              onClick={() => setShowAvatarSelector(!showAvatarSelector)}
              className="absolute inset-1.5 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer text-white"
              title="Сменить аватар"
            >
              <svg
                className="w-8 h-8 drop-shadow-md"
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
            </button>
          </div>

          {/* Name, surname, and Role Badge */}
          <div className="mb-2">
            <div className="flex flex-col md:flex-row items-center gap-3">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight leading-tight">
                {profileData.fullName}
              </h2>
              <span className="px-3 py-1 text-xs font-bold tracking-wider text-sky-600 dark:text-sky-300 bg-sky-500/10 border border-sky-450/20 dark:border-sky-400/30 rounded-full flex items-center gap-1.5 uppercase shadow-inner">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-550 dark:bg-sky-400 animate-pulse" />
                {profileData.role}
              </span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-sm mt-1 max-w-md font-medium">
              {user?.email}
            </p>
          </div>
        </div>

        {/* Top Action buttons */}
        <div className="flex justify-center mb-2">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/30 hover:bg-slate-200 dark:hover:bg-white/15 text-slate-800 dark:text-white font-semibold px-6 py-2.5 rounded-2xl shadow-md transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98] flex items-center gap-2 cursor-pointer"
            >
              <Changing />
              Редактировать
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={cancelEdit}
                className="bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 font-semibold px-4 py-2.5 rounded-2xl transition duration-150 active:scale-[0.98] cursor-pointer"
              >
                Отмена
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-linear-to-br from-sky-500 to-blue-600 hover:opacity-90 disabled:opacity-50 text-white font-bold px-6 py-2.5 rounded-2xl shadow-lg shadow-sky-500/20 transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98] flex items-center gap-2 cursor-pointer"
              >
                {isSaving ? (
                  <>
                    <Saving />
                    Сохранение...
                  </>
                ) : (
                  <>
                    <Save />
                    Сохранить
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileHero;
