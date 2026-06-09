"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "@/components/theme-provider";
import { auth, db } from "@/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { useAuthState, useSignOut } from "react-firebase-hooks/auth";
import { MoonIcon, SunIcon } from "@/assets/logos/images";

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
            className="rounded-2xl border border-white/10 bg-white/5 p-1 transition duration-300 hover:scale-[1.03]"
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
        <nav className="order-3 w-full min-w-0 overflow-x-auto rounded-2xl border border-white/10 bg-white/5 p-1 shadow-inner shadow-black/10 scrollbar-none [&::-webkit-scrollbar]:hidden lg:order-0 lg:ml-5 lg:w-auto lg:flex-1 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none">
          <ul className="flex w-max min-w-full items-center gap-1.5 text-xs font-semibold sm:text-sm lg:mx-auto lg:min-w-0 lg:gap-3">
            <li className="shrink-0">
              <Link
                href="/dashboard"
                className={`block whitespace-nowrap rounded-xl px-3 py-2 text-center transition duration-200 sm:px-4 lg:rounded-full ${pathname === "/dashboard" ? "bg-white/15 text-white shadow-sm shadow-black/10" : "text-white/75 hover:bg-white/10 hover:text-white"}`}
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
            <li className="shrink-0">
              <Link
                href="/report"
                className={`block whitespace-nowrap rounded-xl px-3 py-2 text-center transition duration-200 sm:px-4 lg:rounded-full ${isActive("/report") ? "bg-white/15 text-white shadow-sm shadow-black/10" : "text-white/75 hover:bg-white/10 hover:text-white"}`}
              >
                Отчеты
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
            <SunIcon />
            {/* Moon Icon */}
            <MoonIcon />
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
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdHeader;
