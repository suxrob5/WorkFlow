"use client";

import { useState } from "react";

const AttendanceFeed = () => {
  const [attendanceFeed, setAttendanceFeed] = useState<any[]>([]);
  return (
    <>
      {attendanceFeed.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
          {attendanceFeed.slice(0, 6).map((feed) => (
            <div
              key={feed.id}
              className="rounded-2xl border border-slate-200/50 dark:border-white/5 bg-white/40 dark:bg-white/3 overflow-hidden flex flex-col hover:border-slate-300 dark:hover:border-white/15 transition-all duration-300 shadow-sm"
            >
              {/* Photo Container */}
              <div className="aspect-video w-full bg-slate-100 dark:bg-[#021236]/30 relative overflow-hidden group">
                {feed.image ? (
                  <img
                    src={feed.image}
                    alt={`${feed.employeeName} selfie`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 gap-2">
                    <svg
                      className="w-8 h-8"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <span className="text-xs">Фото отсутствует</span>
                  </div>
                )}
                <span className="absolute top-3 right-3 text-[10px] font-bold bg-slate-900/80 dark:bg-slate-950/80 text-white px-2.5 py-1 rounded-full border border-white/10 backdrop-blur-md">
                  {feed.timestamp}
                </span>
              </div>

              {/* Profile & Location details */}
              <div className="p-4 flex-1 flex flex-col justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={feed.employeeAvatar}
                    alt={feed.employeeName}
                    className="w-10 h-10 rounded-full border-2 border-slate-200 dark:border-white/10 object-cover shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                      {feed.employeeName}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      {feed.employeePosition}
                    </p>
                  </div>
                </div>

                {/* Geolocation Button Link */}
                {feed.location ? (
                  <a
                    href={`https://www.google.com/maps?q=${feed.location.latitude},${feed.location.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between text-xs text-sky-600 dark:text-sky-400 bg-sky-500/10 hover:bg-sky-500/25 border border-sky-400/20 px-3 py-2.5 rounded-xl font-bold transition duration-200 active:scale-[0.98]"
                  >
                    <span className="flex items-center gap-1.5 min-w-0">
                      <svg
                        className="w-4 h-4 text-sky-500 shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <span className="truncate">
                        {feed.location.latitude.toFixed(5)},{" "}
                        {feed.location.longitude.toFixed(5)}
                      </span>
                    </span>
                    <span className="shrink-0 text-[10px] bg-sky-500/20 px-2 py-0.5 rounded-md border border-sky-400/20">
                      Карта ↗
                    </span>
                  </a>
                ) : (
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-slate-100 dark:bg-white/5 px-3 py-2 rounded-xl">
                    <span className="w-2 h-2 rounded-full bg-slate-300 dark:bg-white/10" />
                    <span>Координаты отсутствуют</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-200 dark:border-white/10 p-8 text-center text-slate-500 dark:text-slate-400">
          <p className="text-sm font-semibold">
            Нет недавних отметок сотрудников
          </p>
          <p className="text-xs mt-1">
            Отметки сотрудников с селфи-фото и координатами появятся здесь в
            реальном времени.
          </p>
        </div>
      )}
    </>
  );
};

export default AttendanceFeed;
