"use client";

import { AttendanceType } from "@/types";
import Image from "next/image";

interface Props {
  displayCheckIns: AttendanceType[];
}

type LocationPoint =
  | {
      latitude: number;
      longitude: number;
    }
  | null
  | undefined;

const formatCoordinate = (value?: number) =>
  typeof value === "number" ? value.toFixed(6) : "--";

const LocationMap = ({
  id,
  label,
  time,
  location,
  emptyText,
  tone,
}: {
  id: string;
  label: string;
  time?: string;
  location: LocationPoint;
  emptyText: string;
  tone: "sky" | "emerald";
}) => {
  const hasLocation =
    typeof location?.latitude === "number" &&
    typeof location?.longitude === "number";
  const mapUrl = hasLocation
    ? `https://maps.google.com/maps?q=${location.latitude},${location.longitude}&t=&z=15&ie=UTF8&iwloc=&output=embed`
    : "";
  const openMapUrl = hasLocation
    ? `https://www.google.com/maps/search/?api=1&query=${location.latitude},${location.longitude}`
    : "";
  const toneClasses =
    tone === "sky"
      ? "text-sky-700 dark:text-sky-300 bg-sky-500/10"
      : "text-emerald-700 dark:text-emerald-300 bg-emerald-500/10";

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white/45 dark:bg-white/3 p-2">
      <div className="mb-1.5 flex items-center justify-between gap-2">
        <div
          className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${toneClasses}`}
        >
          {label}: {time || "--:--"}
        </div>
        {hasLocation && (
          <a
            href={openMapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center gap-1 text-[10px] font-bold text-sky-600 dark:text-sky-400 hover:text-sky-500 dark:hover:text-sky-300 transition"
          >
            Открыть
            <svg
              className="w-2.5 h-2.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
        )}
      </div>

      <div className="mb-1.5 text-[9px] font-mono text-slate-600 dark:text-slate-400 leading-tight">
        Lat: {formatCoordinate(location?.latitude)}
        <span className="mx-1 text-slate-300">/</span>
        Lng: {formatCoordinate(location?.longitude)}
      </div>

      {hasLocation ? (
        <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-slate-900">
          <iframe
            title={`${id}-${label}-map`}
            src={mapUrl}
            className="h-20 w-full"
            loading="lazy"
          />
        </div>
      ) : (
        <div className="flex min-h-7 items-center justify-center rounded-xl border border-dashed border-slate-300 dark:border-white/10 bg-slate-100/70 px-2 py-1 text-center text-[9px] font-bold text-slate-400 dark:bg-slate-900/60">
          {emptyText}
        </div>
      )}
    </div>
  );
};

const DisplayCheckIns: React.FC<Props> = ({ displayCheckIns }) => {
  return (
    <>
      {displayCheckIns.length === 0 ? (
        <div className="bg-white/40 dark:bg-white/2 border border-slate-200/60 dark:border-white/5 p-12 rounded-3xl text-center text-slate-500 dark:text-slate-400 backdrop-blur-md">
          <svg
            className="w-14 h-14 text-slate-400 dark:text-slate-600 mx-auto mb-4 animate-pulse"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <p className="text-sm font-bold text-slate-800 dark:text-slate-300">
            Сохраненных отметок не найдено
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs mx-auto leading-relaxed">
            Сделайте первый фотоснимок с координатами GPS выше, чтобы
            сформировать массив данных смены.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {displayCheckIns.map((item) => (
            <div
              key={item.id}
              className="bg-white/60 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 p-4 rounded-3xl backdrop-blur-md flex gap-4 transition duration-300 hover:scale-[1.01] hover:shadow-[0_10px_25px_-5px_rgba(0,0,0,0.05)] dark:hover:shadow-[0_10px_25px_-5px_rgba(0,0,0,0.3)] relative group"
            >
              <div className="w-28 shrink-0 space-y-2">
                <div className="space-y-1">
                  <span className="block text-[9px] font-bold uppercase text-sky-700 dark:text-sky-300">
                    Приход
                  </span>
                  <div className="h-20 rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-slate-900 relative">
                    {item.imageUrl ? (
                      <Image
                        src={item.imageUrl}
                        alt="Фото прихода"
                        fill
                        className="object-cover"
                      />
                    ) : null}
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="block text-[9px] font-bold uppercase text-emerald-700 dark:text-emerald-300">
                    Уход
                  </span>
                  <div className="h-20 rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-slate-900 relative">
                    {item.checkOutImageUrl ? (
                      <Image
                        src={item.checkOutImageUrl}
                        alt="Фото ухода"
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center px-2 text-center text-[10px] font-bold text-slate-400">
                        Открыта
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex min-w-0 flex-1 flex-col py-1 text-left">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/5 dark:bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-400/15 dark:border-emerald-400/20 uppercase tracking-wide">
                      Verified
                    </span>
                    <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 font-semibold">
                      {item.id}
                    </span>
                  </div>
                  <p className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                    <svg
                      className="w-3.5 h-3.5 text-emerald-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {item.date}
                  </p>
                  <div className="space-y-1.5 text-[10px] font-bold">
                    <div className="rounded-lg bg-sky-500/10 px-2 py-1 text-sky-700 dark:text-sky-300">
                      Приход: {item.checkIn || "--:--"}
                    </div>
                    <div className="rounded-lg bg-emerald-500/10 px-2 py-1 text-emerald-700 dark:text-emerald-300">
                      Уход: {item.checkOut || "Открыта"}
                    </div>
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-1 gap-2 xl:grid-cols-2">
                  <LocationMap
                    id={item.id}
                    label="Приход"
                    time={item.checkIn}
                    location={item.location}
                    emptyText="Локация прихода не найдена"
                    tone="sky"
                  />
                  <LocationMap
                    id={item.id}
                    label="Уход"
                    time={item.checkOut}
                    location={item.checkOutLocation}
                    emptyText="Локация ухода появится после закрытия смены"
                    tone="emerald"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default DisplayCheckIns;
