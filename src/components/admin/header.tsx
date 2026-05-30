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
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname() || "/";
  const isActive = (path: string) =>
    pathname === path || pathname.startsWith(path + "/");
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
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
    <header className="sticky top-0 z-30 bg-[#011E5D]/95 text-white backdrop-blur-sm border-b border-white/10 shadow-[0_15px_40px_-25px_rgba(0,0,0,0.5)] transition-all duration-300">
      <div className="mx-auto flex justify-between max-w-400 items-center gap-3 px-4 py-3 text-[17px] lg:flex-nowrap lg:gap-6 lg:px-6">
        <Link href="/dashboard" className="flex items-center gap-3">
          <Image
            src="/main-logo.png"
            alt="Logo"
            width={42}
            height={42}
            className="rounded-2xl border border-white/10 bg-white/5 p-1 transition duration-300 hover:scale-[1.03]"
          />
          <div className="min-w-0">
            <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
              Mission Foods
            </h1>
            <p className="max-w-56 truncate text-xs text-slate-300 sm:max-w-none">
              Управление сотрудниками и графиками
            </p>
          </div>
        </Link>
        <nav className="w-[60%]  ml-5">
          <ul className="flex w-max items-center gap-2 text-sm font-semibold lg:mx-auto lg:gap-4">
            <li>
              <Link
                href="/dashboard"
                className={`block rounded-full px-4 py-2 transition duration-200 ${isActive("/dashboard") ? "bg-white/10 text-white" : "text-white/80 hover:bg-white/10 hover:text-white"}`}
              >
                Главная
              </Link>
            </li>
            <li>
              <Link
                href="/employee"
                className={`block rounded-full px-4 py-2 transition duration-200 ${isActive("/employee") ? "bg-white/10 text-white" : "text-white/80 hover:bg-white/10 hover:text-white"}`}
              >
                Сотрудники
              </Link>
            </li>
            <li>
              <Link
                href="/activities"
                className={`block rounded-full px-4 py-2 transition duration-200 ${isActive("/activities") ? "bg-white/10 text-white" : "text-white/80 hover:bg-white/10 hover:text-white"}`}
              >
                Рабочие графики
              </Link>
            </li>
          </ul>
        </nav>

        <div className="flex items-center gap-5">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="relative cursor-pointer overflow-hidden rounded-full border border-white/15 bg-white/5 p-2.5 text-amber-500 shadow-sm transition-all duration-300 hover:bg-white/10 dark:text-sky-300"
            aria-label="Toggle theme"
          >
            {/* Sun Icon */}
            <svg
              className="w-5 h-5 transition-all duration-500 transform rotate-0 scale-100 dark:rotate-90 dark:scale-0"
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
              className="w-5 h-5 absolute top-2.5 left-2.5 transition-all duration-500 transform -rotate-90 scale-0 dark:rotate-0 dark:scale-100 text-sky-400"
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
