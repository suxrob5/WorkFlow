"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "@/components/theme-provider";
import { auth, db } from "@/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { useAuthState, useSignOut } from "react-firebase-hooks/auth";

const AdHeader = () => {
  const pathname = usePathname() || "/";
  const isActive = (path: string) =>
    pathname === path || pathname.startsWith(path + "/");
  const router = useRouter();
  const { toggleTheme } = useTheme();
  const [user] = useAuthState(auth);
  const [signOut] = useSignOut(auth);
  const [avatarUrl, setAvatarUrl] = useState("/user-logo.png");
  const [displayName, setDisplayName] = useState("Admin");

  useEffect(() => {
    if (!user) {
      setAvatarUrl("/user-logo.png");
      setDisplayName("Admin");
      return;
    }

    if (user.photoURL) setAvatarUrl(user.photoURL);
    if (user.displayName) setDisplayName(user.displayName);

    const unsubscribe = onSnapshot(doc(db, "users", user.uid), (snapshot) => {
      if (!snapshot.exists()) return;

      const data = snapshot.data();
      if (data.avatarUrl) setAvatarUrl(String(data.avatarUrl).trim());
      if (data.name) setDisplayName(String(data.name));
    });

    return () => unsubscribe();
  }, [user]);

  return (
    <header className="sticky top-0 z-30 w-full bg-[#011E5D]/95 text-white backdrop-blur-sm border-b border-white/10 shadow-[0_15px_40px_-25px_rgba(0,0,0,0.5)] transition-all duration-300">
      <div className="mx-auto flex max-w-400 flex-wrap items-center justify-between gap-2 px-3 py-2 text-[17px] sm:gap-3 sm:px-4 sm:py-3 lg:flex-nowrap lg:gap-6 lg:px-6">
        <Link
          href="/dashboard"
          className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3 lg:flex-none"
        >
          <Image
            src="/main-logo.png"
            alt="Logo"
            width={42}
            height={42}
            className="h-9 w-9 shrink-0 rounded-xl border border-white/10 bg-white/5 p-1 transition duration-300 hover:scale-[1.03] sm:h-[42px] sm:w-[42px] sm:rounded-2xl"
          />
          <div className="min-w-0">
            <h1 className="truncate text-lg font-bold tracking-tight text-white sm:text-2xl">
              Mission Foods
            </h1>
            <p className="hidden max-w-56 truncate text-xs text-slate-300 sm:block sm:max-w-none">
              Управление сотрудниками и графиками
            </p>
          </div>
        </Link>
        <nav className="order-3 w-full min-w-0 overflow-x-auto rounded-2xl border border-white/10 bg-white/5 p-1 shadow-inner shadow-black/10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:order-none lg:ml-5 lg:w-auto lg:flex-1 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none">
          <ul className="flex w-max min-w-full items-center gap-1.5 text-xs font-semibold sm:text-sm lg:mx-auto lg:min-w-0 lg:gap-3">
            <li className="shrink-0">
              <Link
                href="/dashboard"
                className={`block whitespace-nowrap rounded-xl px-3 py-2 text-center transition duration-200 sm:px-4 lg:rounded-full ${isActive("/dashboard") ? "bg-white/15 text-white shadow-sm shadow-black/10" : "text-white/75 hover:bg-white/10 hover:text-white"}`}
              >
                Главная
              </Link>
            </li>
            <li className="shrink-0">
              <Link
                href="/employee"
                className={`block whitespace-nowrap rounded-xl px-3 py-2 text-center transition duration-200 sm:px-4 lg:rounded-full ${isActive("/employee") ? "bg-white/15 text-white shadow-sm shadow-black/10" : "text-white/75 hover:bg-white/10 hover:text-white"}`}
              >
                Сотрудники
              </Link>
            </li>
            <li className="shrink-0">
              <Link
                href="/activities"
                className={`block whitespace-nowrap rounded-xl px-3 py-2 text-center transition duration-200 sm:px-4 lg:rounded-full ${isActive("/activities") ? "bg-white/15 text-white shadow-sm shadow-black/10" : "text-white/75 hover:bg-white/10 hover:text-white"}`}
              >
                Рабочие графики
              </Link>
            </li>
          </ul>
        </nav>

        <div className="flex shrink-0 items-center gap-2 sm:gap-4 lg:gap-5">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="relative cursor-pointer overflow-hidden rounded-full border border-white/15 bg-white/5 p-2 text-amber-500 shadow-sm transition-all duration-300 hover:bg-white/10 dark:text-sky-300 sm:p-2.5"
            aria-label="Toggle theme"
          >
            {/* Sun Icon */}
            <svg
              className="h-4 w-4 transform rotate-0 scale-100 transition-all duration-500 dark:rotate-90 dark:scale-0 sm:h-5 sm:w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707.707M12 8a4 4 0 100 8 4 4 0 000-8z"
              />
            </svg>

            {/* Moon Icon */}
            <svg
              className="absolute left-2 top-2 h-4 w-4 -rotate-90 scale-0 transform text-sky-400 transition-all duration-500 dark:rotate-0 dark:scale-100 sm:left-2.5 sm:top-2.5 sm:h-5 sm:w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
              />
            </svg>
          </button>

          <div className="relative group">
            <Link
              href="/dashboard/profile"
              className={`inline-flex items-center gap-2 rounded-full border border-white/15 px-2.5 py-1.5 text-sm font-semibold text-white transition duration-200 sm:gap-3 sm:px-4 ${isActive("/dashboard/profile") ? "bg-white/10" : "bg-white/5 group-hover:border-white/30 group-hover:bg-white/15 group-hover:text-slate-100"}`}
            >
              <span className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-linear-to-br from-rose-100 to-pink-300 text-sm font-semibold text-white shadow-lg shadow-rose-500/20 transition duration-200 group-hover:-translate-y-0.5 group-hover:shadow-rose-500/40">
                <Image
                  src={
                    typeof avatarUrl === "string" ? avatarUrl.trim() : avatarUrl
                  }
                  alt="Admin Avatar"
                  sizes="40px"
                  fill
                  className="rounded-full object-cover"
                />
              </span>
              <span className="hidden max-w-32 truncate sm:inline">
                {displayName}
              </span>
            </Link>

            <div className="absolute top-full right-0 pt-2 opacity-0 translate-y-1 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-200 z-50">
              <button
                className="bg-white cursor-pointer text-red-500 font-bold text-xs px-4 py-2 rounded-xl shadow-xl border border-slate-200 flex items-center gap-2 hover:bg-red-50 transition-colors whitespace-nowrap"
                onClick={async () => {
                  await signOut();
                  router.push("/login");
                }}
              >
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                Выйти
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdHeader;
