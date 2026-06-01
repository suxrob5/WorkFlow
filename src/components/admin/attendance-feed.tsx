"use client";

import { useEffect, useState } from "react";
import { getAttendanceFeed, type AttendanceFeedItem } from "@/firebase/db";

type LocationPoint = {
  latitude: number;
  longitude: number;
} | null;

const LocationStatus = ({
  label,
  time,
  location,
  tone,
  emptyText,
}: {
  label: string;
  time?: string;
  location: LocationPoint;
  tone: "sky" | "emerald";
  emptyText: string;
}) => {
  const hasLocation =
    typeof location?.latitude === "number" &&
    typeof location?.longitude === "number";
  const toneClasses =
    tone === "sky"
      ? "border-sky-400/20 bg-sky-500/10 text-sky-700 dark:text-sky-300"
      : "border-emerald-400/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300";

  if (!hasLocation) {
    return (
      <div className="flex min-h-10 items-center justify-between gap-2 rounded-xl bg-slate-100 px-3 py-2 text-xs text-slate-400 dark:bg-white/5">
        <span className="flex min-w-0 items-center gap-1.5">
          <span className="h-2 w-2 shrink-0 rounded-full bg-slate-300 dark:bg-white/10" />
          <span className="truncate">
            {label}: {emptyText}
          </span>
        </span>
        <span className="shrink-0 text-[10px] font-bold">
          {time || "--:--"}
        </span>
      </div>
    );
  }

  return (
    <a
      href={`https://www.google.com/maps?q=${location.latitude},${location.longitude}`}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex min-h-10 items-center justify-between gap-2 rounded-xl border px-3 py-2 text-xs font-bold transition duration-200 hover:brightness-105 active:scale-[0.98] ${toneClasses}`}
    >
      <span className="flex min-w-0 items-center gap-1.5">
        <svg
          className="h-4 w-4 shrink-0"
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
          {label}: {location.latitude.toFixed(5)},{" "}
          {location.longitude.toFixed(5)}
        </span>
      </span>
      <span className="shrink-0 rounded-md bg-white/45 px-2 py-0.5 text-[10px] font-extrabold dark:bg-white/10">
        {time || "--:--"} ↗
      </span>
    </a>
  );
};

const AttendanceFeed = () => {
  const [attendanceFeed, setAttendanceFeed] = useState<AttendanceFeedItem[]>(
    [],
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAttendanceFeed = async () => {
      try {
        setLoading(true);
        const feed = await getAttendanceFeed();
        setAttendanceFeed(feed);
      } catch (error) {
        console.error("Error loading attendance feed:", error);
      } finally {
        setLoading(false);
      }
    };

    loadAttendanceFeed();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2].map((item) => (
          <div
            key={item}
            className="overflow-hidden rounded-2xl border border-slate-200/50 bg-white/40 shadow-sm animate-pulse dark:border-white/5 dark:bg-white/3"
          >
            <div className="aspect-video w-full bg-slate-200 dark:bg-white/10" />
            <div className="space-y-4 p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-white/10" />
                <div className="space-y-2">
                  <div className="h-4 w-32 rounded-lg bg-slate-200 dark:bg-white/10" />
                  <div className="h-3 w-24 rounded-lg bg-slate-200 dark:bg-white/5" />
                </div>
              </div>
              <div className="h-10 rounded-xl bg-slate-200 dark:bg-white/10" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      {attendanceFeed.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 animate-fadeIn md:grid-cols-2 lg:grid-cols-3">
          {attendanceFeed.map((feed) => (
            <div
              key={feed.id}
              className="flex flex-col overflow-hidden rounded-2xl border border-slate-200/50 bg-white/40 shadow-sm transition-all duration-300 hover:border-slate-300 dark:border-white/5 dark:bg-white/3 dark:hover:border-white/15"
            >
              <div className="group relative aspect-video w-full overflow-hidden bg-slate-100 dark:bg-[#021236]/30">
                {feed.image ? (
                  <img
                    src={feed.image}
                    alt={`${feed.employeeName} selfie`}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-slate-400">
                    <svg
                      className="h-8 w-8"
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
                <span className="absolute right-3 top-3 rounded-full border border-white/10 bg-slate-900/80 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur-md dark:bg-slate-950/80">
                  {feed.timestamp}
                </span>
              </div>

              <div className="flex flex-1 flex-col justify-between gap-4 p-4">
                <div className="flex items-center gap-3">
                  <img
                    src={feed.employeeAvatar}
                    alt={feed.employeeName}
                    className="h-10 w-10 shrink-0 rounded-full border-2 border-slate-200 object-cover dark:border-white/10"
                  />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-slate-900 dark:text-white">
                      {feed.employeeName}
                    </p>
                    <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                      {feed.employeePosition}
                    </p>
                  </div>
                </div>

                <div className="grid gap-2">
                  <LocationStatus
                    label="Приход"
                    time={feed.checkIn}
                    location={feed.location}
                    tone="sky"
                    emptyText="координаты отсутствуют"
                  />
                  <LocationStatus
                    label="Уход"
                    time={feed.checkOut}
                    location={feed.checkOutLocation}
                    tone="emerald"
                    emptyText="смена открыта"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center text-slate-500 dark:border-white/10 dark:text-slate-400">
          <p className="text-sm font-semibold">
            Нет недавних отметок сотрудников
          </p>
          <p className="mt-1 text-xs">
            Отметки сотрудников с селфи-фото и координатами появятся здесь в
            реальном времени.
          </p>
        </div>
      )}
    </>
  );
};

export default AttendanceFeed;
