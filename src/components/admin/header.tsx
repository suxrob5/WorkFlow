"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/components/theme-provider";

const AdHeader = () => {
  const pathname = usePathname() || "/";
  const isActive = (path: string) =>
    pathname === path || pathname.startsWith(path + "/");
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-30 bg-[#011E5D]/95 text-white backdrop-blur-sm border-b border-white/10 shadow-[0_15px_40px_-25px_rgba(0,0,0,0.5)] transition-all duration-300">
      <div className="mx-auto flex max-w-400 items-center justify-between gap-6 px-4 py-4 text-[17px] md:px-6">
        <div className="flex items-center gap-3">
          <Image
            src="/main-logo.png"
            alt="Logo"
            width={42}
            height={42}
            className="rounded-2xl border border-white/10 bg-white/5 p-1 transition duration-300 hover:scale-[1.03]"
          />
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              WorkFlow
            </h1>
            <p className="text-xs text-slate-300">
              Управление сотрудниками и графиками
            </p>
          </div>
        </div>

        <nav className="hidden md:block">
          <ul className="flex items-center gap-5 text-sm font-semibold">
            <li>
              <Link
                href="/dashboard"
                className={`rounded-full px-4 py-2 transition duration-200 ${isActive("/dashboard") ? "bg-white/10 text-white" : "text-white/80 hover:bg-white/10 hover:text-white"}`}
              >
                Главная
              </Link>
            </li>
            <li>
              <Link
                href="/employee"
                className={`rounded-full px-4 py-2 transition duration-200 ${isActive("/employee") ? "bg-white/10 text-white" : "text-white/80 hover:bg-white/10 hover:text-white"}`}
              >
                Сотрудники
              </Link>
            </li>
            <li>
              <Link
                href="/activities"
                className={`rounded-full px-4 py-2 transition duration-200 ${isActive("/activities") ? "bg-white/10 text-white" : "text-white/80 hover:bg-white/10 hover:text-white"}`}
              >
                Рабочие графики
              </Link>
            </li>
          </ul>
        </nav>

        <div className="flex items-center gap-3.5">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-amber-500 dark:text-sky-300 transition-all duration-300 cursor-pointer shadow-sm relative overflow-hidden group"
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

          <Link
            href="/profile"
            className={`inline-flex items-center gap-3 rounded-full border border-white/15 px-4 py-1.5 text-sm font-semibold text-white transition duration-200 ${isActive("/profile") ? "bg-white/10" : "bg-white/5 hover:border-white/30 hover:bg-white/15 hover:text-slate-100"}`}
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-sky-500 to-blue-600 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition duration-200 hover:-translate-y-0.5 hover:shadow-sky-500/40">
              Is
            </span>
            <span className="hidden sm:inline">Profile</span>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default AdHeader;
