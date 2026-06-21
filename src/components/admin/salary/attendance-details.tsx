import type {
  SalaryAttendanceDay,
  SalaryDashboardData,
  SalaryLocation,
} from "@/firebase/salary";

const dateFormatter = new Intl.DateTimeFormat("ru-RU", {
  day: "2-digit",
  month: "short",
  weekday: "short",
});

const statusPresentation: Record<
  SalaryAttendanceDay["status"],
  { label: string; className: string }
> = {
  present: {
    label: "Выполнено",
    className:
      "border-emerald-400/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  },
  late: {
    label: "Опоздание",
    className:
      "border-amber-400/20 bg-amber-500/10 text-amber-700 dark:text-amber-300",
  },
  incomplete: {
    label: "Нет отметки",
    className:
      "border-orange-400/20 bg-orange-500/10 text-orange-700 dark:text-orange-300",
  },
  absent: {
    label: "Отсутствовал",
    className:
      "border-rose-400/20 bg-rose-500/10 text-rose-700 dark:text-rose-300",
  },
};

function LocationLink({ location }: { location: SalaryLocation }) {
  if (!location) {
    return <span className="text-xs text-slate-400">Нет локации</span>;
  }

  return (
    <a
      href={`https://www.google.com/maps?q=${location.latitude},${location.longitude}`}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 rounded-lg bg-sky-500/10 px-2 py-1 text-xs font-bold text-sky-700 transition hover:bg-sky-500/20 dark:text-sky-300"
    >
      <svg
        className="h-3.5 w-3.5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17.657 16.657 13.414 20.9a2 2 0 0 1-2.827 0l-4.244-4.243a8 8 0 1 1 11.314 0Z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 11a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
        />
      </svg>
      Карта ↗
    </a>
  );
}

function AttendanceMark({
  label,
  time,
  location,
}: {
  label: string;
  time: string;
  location: SalaryLocation;
}) {
  return (
    <div className="min-w-0">
      <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase md:hidden">
        {label}
      </span>
      <div className="mt-0.5 flex flex-wrap items-center gap-2 md:mt-0">
        <strong
          className={`text-sm ${time ? "text-slate-800 dark:text-slate-100" : "text-rose-500"}`}
        >
          {time || "Нет отметки"}
        </strong>
        <LocationLink location={location} />
      </div>
    </div>
  );
}

export default function AttendanceDetails({
  data,
}: {
  data: SalaryDashboardData;
}) {
  const missingMarks = data.attendanceDays.filter(
    (day) => day.status === "absent" || day.status === "incomplete",
  ).length;

  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200/70 bg-white/60 shadow-md backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
      <div className="flex flex-col gap-3 border-b border-slate-200/70 p-5 dark:border-white/10 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-black text-slate-900 dark:text-white">
            Детали посещаемости
          </h2>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Время прихода, ухода и геолокация каждой отметки
          </p>
        </div>
        <span
          className={`w-fit rounded-full px-3 py-1.5 text-xs font-bold ${missingMarks ? "bg-orange-500/10 text-orange-700 dark:text-orange-300" : "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"}`}
        >
          {missingMarks
            ? `Нет отметок: ${missingMarks}`
            : "Все отметки заполнены"}
        </span>
      </div>

      {data.attendanceDays.length ? (
        <div className="max-h-105 overflow-y-auto">
          <div className="sticky top-0 z-10 hidden grid-cols-[130px_1fr_1fr_130px] gap-4 border-b border-slate-200 bg-slate-50/95 px-5 py-3 text-[11px] font-extrabold tracking-wider text-slate-500 uppercase backdrop-blur md:grid dark:border-white/10 dark:bg-[#071c45]/95 dark:text-slate-400">
            <span>Дата</span>
            <span>Приход и локация</span>
            <span>Уход и локация</span>
            <span>Статус</span>
          </div>
          <div className="divide-y divide-slate-200/70 dark:divide-white/10">
            {data.attendanceDays.map((day) => {
              const presentation = statusPresentation[day.status];
              const parsedDate = new Date(`${day.date}T00:00:00`);

              return (
                <article
                  key={day.date}
                  className="grid gap-4 px-5 py-4 transition hover:bg-white/50 md:grid-cols-[130px_1fr_1fr_130px] md:items-center dark:hover:bg-white/3"
                >
                  <div>
                    <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase md:hidden">
                      Дата
                    </span>
                    <p className="text-sm font-extrabold text-slate-800 capitalize dark:text-slate-100">
                      {dateFormatter.format(parsedDate)}
                    </p>
                  </div>
                  <AttendanceMark
                    label="Приход"
                    time={day.checkIn}
                    location={day.checkInLocation}
                  />
                  <AttendanceMark
                    label="Уход"
                    time={day.checkOut}
                    location={day.checkOutLocation}
                  />
                  <span
                    className={`w-fit rounded-full border px-2.5 py-1 text-[11px] font-extrabold ${presentation.className}`}
                  >
                    {presentation.label}
                  </span>
                </article>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="p-8 text-center text-sm text-slate-500 dark:text-slate-400">
          За выбранный период рабочих дней нет
        </div>
      )}
    </section>
  );
}
