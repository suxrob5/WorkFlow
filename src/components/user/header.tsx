"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/components/theme-provider";
import { auth, db } from "@/firebase";
import { useAuthState, useSignOut } from "react-firebase-hooks/auth";
import { doc, onSnapshot } from "firebase/firestore";

const Header = () => {
  const pathname = usePathname() || "/";
  const isActive = (path: string) =>
    pathname === path || pathname.startsWith(path + "/");

  const [avatarUrl, setAvatarUrl] = useState("/user-logo.png");
  const [displayName, setDisplayName] = useState("Profile");

  const { toggleTheme } = useTheme();
  const [user] = useAuthState(auth);
  const [signOut] = useSignOut(auth);

  // Real-time user data synchronization
  useEffect(() => {
    if (!user) {
      // Reset to default placeholders when no Firebase user is authenticated
      setAvatarUrl("/user-logo.png");
      setDisplayName("Profile");
      return;
    }

    // Immediately pull basic profile info from Firebase Auth if available
    if (user.photoURL) setAvatarUrl(user.photoURL);
    if (user.displayName) setDisplayName(user.displayName);

    // Subscribe to Firestore for the most up-to-date custom profile data
    const unsub = onSnapshot(doc(db, "users", user.uid), (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        if (data.avatarUrl) setAvatarUrl(String(data.avatarUrl).trim());
        if (data.name) setDisplayName(data.name);
      }
    });

    return () => unsub();
  }, [user]);

  return (
    <div className="bg-[#011E5D]/95 text-white backdrop-blur-sm border-b border-white/10 shadow-[0_15px_40px_-25px_rgba(0,0,0,0.5)] transition-all duration-300">
      <div className="mx-auto flex max-w-400 items-center justify-between gap-6 px-4 py-4 text-[17px] md:px-6">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/main-logo.png"
            alt="Logo"
            width={42}
            height={42}
            className="rounded-2xl border border-white/10 bg-white/5 p-1 transition duration-300 hover:scale-[1.03]"
          />
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Mission Foods
          </h1>
        </Link>
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

          <div className="relative group">
            <Link
              href="/profile"
              className={`inline-flex items-center gap-3 rounded-full border border-white/15 px-4 py-1.5 text-sm font-semibold text-white transition duration-200 ${isActive("/profile") ? "bg-white/10" : "bg-white/5 group-hover:border-white/30 group-hover:bg-white/15"}`}
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-sky-100 to-blue-300 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition duration-200 group-hover:-translate-y-0.5 overflow-hidden relative">
                <Image
                  src={
                    typeof avatarUrl === "string" ? avatarUrl.trim() : avatarUrl
                  }
                  alt="User Avatar"
                  fill
                  className="rounded-full object-cover"
                />
              </span>
              <span className="hidden sm:inline">{displayName}</span>
            </Link>

            {/* Sign Out Button on Hover */}
            <div className="absolute top-full right-0 pt-2 opacity-0 translate-y-1 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-200 z-50">
              <button
                className="bg-white cursor-pointer text-red-500 font-bold text-xs px-4 py-2 rounded-xl shadow-xl border border-slate-200 flex items-center gap-2 hover:bg-red-50 transition-colors whitespace-nowrap"
                onClick={() => signOut()}
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
    </div>
  );
};

export default Header;
