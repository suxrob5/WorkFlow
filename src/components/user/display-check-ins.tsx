"use client";

import { CheckIn } from "@/app/(root)/page";
import Image from "next/image";

interface DisplayCheckInsNoProps {
  displayCheckIns: CheckIn[];
  deleteCheckIn: (id: string) => void;
}

const DisplayCheckIns: React.FC<DisplayCheckInsNoProps> = ({
  displayCheckIns,
  deleteCheckIn,
}) => {
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
              {/* Absolute Delete Button on hover */}
              <button
                onClick={() => deleteCheckIn(item.docId!)}
                className="absolute top-2 right-2 w-7 h-7 rounded-full bg-slate-200/80 dark:bg-black/40 hover:bg-red-500/20 text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-200 cursor-pointer"
                title="Удалить отметку"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>

              {/* Camera Snapshot base64 preview */}
              <div className="w-24 h-24 rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-slate-900 shrink-0 relative">
                <Image
                  src={item.image}
                  alt="Snaped Checkin shot"
                  fill
                  className="object-cover"
                />
              </div>

              {/* Metadata display */}
              <div className="flex flex-col justify-between py-1 text-left min-w-0 flex-1">
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
                    {item.timestamp}
                  </p>
                </div>

                <div className="space-y-1.5">
                  <div className="text-[10px] font-mono text-slate-600 dark:text-slate-400 leading-tight">
                    🧭 Lat: {item.location.latitude.toFixed(6)}
                    <br />
                    🧭 Lng: {item.location.longitude.toFixed(6)}
                  </div>

                  <div className="overflow-hidden rounded-3xl border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-slate-900 mt-3">
                    <iframe
                      title={`map-${item.id}`}
                      src={`https://maps.google.com/maps?q=${item.location.latitude},${item.location.longitude}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                      className="w-full h-32"
                      loading="lazy"
                    />
                  </div>

                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${item.location.latitude},${item.location.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[10px] font-bold text-sky-600 dark:text-sky-400 hover:text-sky-500 dark:hover:text-sky-300 transition"
                  >
                    Открыть карту
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
