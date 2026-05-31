"use client";

import { useProfile } from "@/firebase/db";

const ProfileInformation = () => {

    const { profileData, loading } = useProfile();

    if (loading || !profileData || profileData === "nothing") {
        return null;
    }
    return (
        <div className=" grid gap-3 grid-cols-1">
            {/* 1ST STAGE */}
            <div className="space-y-1 bg-white/30 dark:bg-white/2 border border-slate-200/60 dark:border-white/5 p-4 rounded-2xl">
                <span className="text-[11px] font-semibold tracking-wider text-slate-500 dark:text-slate-400 uppercase">
                    полная имя
                </span>
                <p className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                    {profileData.fullName}
                </p>
            </div>
            {/* 2ND STAGE */}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1 bg-white/30 dark:bg-white/2 border border-slate-200/60 dark:border-white/5 p-4 rounded-2xl">
                    <span className="text-[11px] font-semibold tracking-wider text-slate-500 dark:text-slate-400 uppercase">
                        Доступ
                    </span>
                    <p className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                        {profileData.role}
                    </p>
                </div>
                <div className="space-y-1 bg-white/30 dark:bg-white/2 border border-slate-200/60 dark:border-white/5 p-4 rounded-2xl">
                    <span className="text-[11px] font-semibold tracking-wider text-slate-500 dark:text-slate-400 uppercase">
                        Электронная почта
                    </span>
                    <p className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                        {profileData.email}
                    </p>
                </div>
            </div>
            {/* 3RD STAGE */}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1 bg-white/30 dark:bg-white/2 border border-slate-200/60 dark:border-white/5 p-4 rounded-2xl">
                    <span className="text-[11px] font-semibold tracking-wider text-slate-500 dark:text-slate-400 uppercase">
                        Телефон номер
                    </span>
                    <p className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                        {profileData.phone}
                    </p>
                </div>
                <div className="space-y-1 bg-white/30 dark:bg-white/2 border border-slate-200/60 dark:border-white/5 p-4 rounded-2xl">
                    <span className="text-[11px] font-semibold tracking-wider text-slate-500 dark:text-slate-400 uppercase">
                        Паспорт серия
                    </span>
                    <p className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                        {profileData.passport}
                    </p>
                </div>
            </div>
            {/* 4TH STAGE */}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1 bg-white/30 dark:bg-white/2 border border-slate-200/60 dark:border-white/5 p-4 rounded-2xl">
                    <span className="text-[11px] font-semibold tracking-wider text-slate-500 dark:text-slate-400 uppercase">
                        Должность
                    </span>
                    <p className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                        {profileData.position}
                    </p>
                </div>
                <div className="space-y-1 bg-white/30 dark:bg-white/2 border border-slate-200/60 dark:border-white/5 p-4 rounded-2xl">
                    <span className="text-[11px] font-semibold tracking-wider text-slate-500 dark:text-slate-400 uppercase">
                        Дата регистрации
                    </span>
                    <p className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                        {profileData.createdAt.toDate().toLocaleDateString("ru-RU", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                        })}
                    </p>
                </div>
            </div>
              {/* 5TH STAGE */}
            <div className="space-y-1 bg-white/30 dark:bg-white/2 border border-slate-200/60 dark:border-white/5 p-4 rounded-2xl">
                <span className="text-[11px] font-semibold tracking-wider text-slate-500 dark:text-slate-400 uppercase">
                    Биография
                </span>
                <p className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                    {profileData.bio}
                </p>
            </div>
        </div>
    );
};

export default ProfileInformation;
