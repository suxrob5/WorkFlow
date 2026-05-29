'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from '@/components/theme-provider';

const Header = () => {
  const pathname = usePathname() || '/';
  const isActive = (path: string) =>
    pathname === path || pathname.startsWith(path + '/');

  const [avatarUrl, setAvatarUrl] = useState(
    'https://randomuser.me/api/portraits/men/1.jpg',
  );
  const { theme, toggleTheme } = useTheme();

  // Dynamic header avatar sync!
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedAvatar = localStorage.getItem('profile_avatar');
      if (savedAvatar) {
        setAvatarUrl(savedAvatar);
      }

      // Listen for storage changes in case of multi-tab sync
      const handleStorageChange = () => {
        const updatedAvatar = localStorage.getItem('profile_avatar');
        if (updatedAvatar) setAvatarUrl(updatedAvatar);
      };
      window.addEventListener('storage', handleStorageChange);

      // Custom event in case update happens in the same tab/window
      window.addEventListener('profileUpdate', handleStorageChange);

      return () => {
        window.removeEventListener('storage', handleStorageChange);
        window.removeEventListener('profileUpdate', handleStorageChange);
      };
    }
  }, []);

  return (
    <div className="bg-[#011E5D]/95 text-white backdrop-blur-sm border-b border-white/10 shadow-[0_15px_40px_-25px_rgba(0,0,0,0.5)] transition-all duration-300">
      <div className="mx-auto flex max-w-400 items-center justify-between gap-6 px-4 py-4 text-[17px] md:px-6">
        <div className="flex items-center gap-3">
          <Image
            src="/main-logo.png"
            alt="Logo"
            width={42}
            height={42}
            className="rounded-2xl border border-white/10 bg-white/5 p-1 transition duration-300 hover:scale-[1.03]"
          />
          <h1 className="text-2xl font-bold tracking-tight text-white">
            WorkFlow
          </h1>
        </div>
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
            className={`inline-flex items-center gap-3 rounded-full border border-white/15 px-4 py-1.5 text-sm font-semibold text-white transition duration-200 ${isActive('/profile') ? 'bg-white/10' : 'bg-white/5 hover:border-white/30 hover:bg-white/15 hover:text-slate-100'}`}
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-sky-500 to-blue-600 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition duration-200 hover:-translate-y-0.5 hover:shadow-sky-500/40 overflow-hidden relative">
              <Image
                src={avatarUrl}
                alt="User Avatar"
                fill
                className="rounded-full object-cover"
              />
            </span>
            <span className="hidden sm:inline">Profile</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Header;
