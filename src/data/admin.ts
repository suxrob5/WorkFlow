
// ── Sidebar / nav ────────────────────────────────────────────

export const NAV_LINKS = [
  { href: "/dashboard", label: "Главная" },
  { href: "/employee", label: "Сотрудники" },
  { href: "/activities", label: "Рабочие графики" },
] as const;

// ── Smena statusi ─────────────────────────────────────────────

export const STATUS_CONFIG = {
  active: {
    label: "В графике",
    color: "text-emerald-400 bg-emerald-500/10 border-emerald-400/20",
  },
  vacation: {
    label: "Отпуск",
    color: "text-amber-400 bg-amber-500/10 border-amber-400/20",
  },
  sick: {
    label: "Больничный",
    color: "text-rose-400 bg-rose-500/10 border-rose-400/20",
  },
} as const;

export type ShiftStatus = keyof typeof STATUS_CONFIG;

// ── Hafta kunlari ─────────────────────────────────────────────

export const WEEKDAYS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"] as const;

// ── Xodimlar smenalari ro'yxati ──────────────────────────────

export interface Shift {
  id: number;
  employee: string;
  dept: string;
  shift: string;
  days: string[];
  status: ShiftStatus;
}

export const SHIFTS: Shift[] = [
  { id: 1, employee: "Алексей Петров",   dept: "Разработка",    shift: "Утро (08:00–16:00)",  days: ["Пн","Вт","Ср","Чт","Пт"], status: "active"   },
  { id: 2, employee: "Мария Иванова",    dept: "Менеджмент",    shift: "День (10:00–18:00)",  days: ["Пн","Вт","Чт","Пт"],        status: "active"   },
  { id: 3, employee: "Дмитрий Козлов",   dept: "DevOps",        shift: "Ночь (22:00–06:00)",  days: ["Пн","Ср","Пт"],             status: "active"   },
  { id: 4, employee: "Анна Сидорова",    dept: "Дизайн",        shift: "Утро (08:00–16:00)",  days: ["Вт","Ср","Чт","Пт"],        status: "vacation" },
  { id: 5, employee: "Иван Новиков",     dept: "Тестирование",  shift: "День (10:00–18:00)",  days: ["Пн","Вт","Ср","Чт","Пт"], status: "active"   },
  { id: 6, employee: "Ольга Федорова",   dept: "Разработка",    shift: "Вечер (14:00–22:00)", days: ["Ср","Чт","Пт","Сб"],        status: "sick"     },
  { id: 7, employee: "Сергей Михайлов",  dept: "Менеджмент",    shift: "День (10:00–18:00)",  days: ["Пн","Вт","Ср"],             status: "active"   },
  { id: 8, employee: "Татьяна Волкова",  dept: "Дизайн",        shift: "Утро (08:00–16:00)",  days: ["Пн","Вт","Ср","Чт","Пт"], status: "active"   },
  { id: 9, employee: "Роман Беляев",     dept: "DevOps",        shift: "День (10:00–18:00)",  days: ["Пн","Вт","Ср","Чт"],        status: "active"   },
  { id:10, employee: "Екатерина Попова", dept: "Тестирование",  shift: "Утро (08:00–16:00)",  days: ["Вт","Ср","Чт","Пт"],        status: "vacation" },
];

// ── Dashboard KPI kartochkalari ───────────────────────────────

export interface StatCard {
  label: string;
  value: string;
  delta: string;
  deltaLabel: string;
  color: string;
  glow: string;
}

export const DASHBOARD_STATS: StatCard[] = [
  {
    label: "Всего сотрудников",
    value: "350",
    delta: "+12",
    deltaLabel: "за месяц",
    color: "from-sky-500 to-blue-600",
    glow: "shadow-sky-500/25",
  },
  {
    label: "На смене сегодня",
    value: "286",
    delta: "81.7%",
    deltaLabel: "явка",
    color: "from-emerald-500 to-teal-600",
    glow: "shadow-emerald-500/25",
  },
  {
    label: "Отсутствуют",
    value: "64",
    delta: "-5",
    deltaLabel: "vs вчера",
    color: "from-rose-500 to-red-600",
    glow: "shadow-rose-500/25",
  },
  {
    label: "Эффективность",
    value: "94%",
    delta: "+2.1%",
    deltaLabel: "vs прошлый мес.",
    color: "from-violet-500 to-indigo-600",
    glow: "shadow-violet-500/25",
  },
];

// ── "Рабочие графики" sahifasi kartochkalari ─────────────────

export interface SummaryCard {
  label: string;
  value: string;
  sub: string;
  icon: string;
  color: string;
}

export const SCHEDULE_SUMMARY: SummaryCard[] = [
  { label: "Активных смен",   value: "12",  sub: "В этом месяце", icon: "🗓️", color: "from-sky-500 to-blue-600"      },
  { label: "Утренних смен",   value: "5",   sub: "08:00 – 16:00",  icon: "🌅", color: "from-amber-500 to-orange-500"  },
  { label: "Ночных смен",     value: "3",   sub: "22:00 – 06:00",  icon: "🌙", color: "from-indigo-500 to-violet-600" },
  { label: "Сверхурочных ч.", value: "147", sub: "За этот месяц",  icon: "⚡", color: "from-rose-500 to-pink-600"    },
];

// ── Bar chart — haftalik poseshaemost' ───────────────────────

export const BAR_CHART_DATA = {
  labels: ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"],
  datasets: [
    {
      label: "Присутствовали",
      data: [42, 38, 45, 50, 47, 20, 10],
      backgroundColor: "rgba(56, 189, 248, 0.8)",
      borderColor: "rgba(56, 189, 248, 1)",
      borderWidth: 2,
      borderRadius: 8,
      borderSkipped: false as const,
    },
    {
      label: "Отсутствовали",
      data: [8, 12, 5, 0, 3, 30, 40],
      backgroundColor: "rgba(239, 68, 68, 0.6)",
      borderColor: "rgba(239, 68, 68, 1)",
      borderWidth: 2,
      borderRadius: 8,
      borderSkipped: false as const,
    },
  ],
};

// ── Line chart — yillik ish soatlari ─────────────────────────

export const LINE_CHART_LABELS = ["Янв","Фев","Мар","Апр","Май","Июн","Июл","Авг","Сен","Окт","Ноя","Дек"];

export const LINE_CHART_DATA = {
  labels: LINE_CHART_LABELS,
  datasets: [
    {
      label: "Рабочие часы",
      data: [168, 152, 176, 165, 180, 172, 188, 175, 160, 170, 158, 165],
      borderColor: "rgba(56, 189, 248, 1)",
      backgroundColor: "rgba(56, 189, 248, 0.1)",
      pointBackgroundColor: "rgba(56, 189, 248, 1)",
      pointBorderColor: "#fff",
      pointBorderWidth: 2,
      pointRadius: 5,
      pointHoverRadius: 8,
      borderWidth: 3,
      fill: true,
      tension: 0.4,
    },
    {
      label: "Сверхурочные",
      data: [12, 8, 15, 10, 20, 14, 25, 18, 9, 13, 7, 11],
      borderColor: "rgba(167, 139, 250, 1)",
      backgroundColor: "rgba(167, 139, 250, 0.1)",
      pointBackgroundColor: "rgba(167, 139, 250, 1)",
      pointBorderColor: "#fff",
      pointBorderWidth: 2,
      pointRadius: 5,
      pointHoverRadius: 8,
      borderWidth: 3,
      fill: true,
      tension: 0.4,
    },
  ],
};

// ── Doughnut chart — bo'limlar bo'yicha xodimlar ─────────────

export const DOUGHNUT_CHART_DATA = {
  labels: ["Разработчики", "Менеджеры", "Дизайнеры", "Тестировщики", "DevOps"],
  datasets: [
    {
      label: "Сотрудники",
      data: [35, 20, 18, 15, 12],
      backgroundColor: [
        "rgba(56, 189, 248, 0.85)",
        "rgba(99, 102, 241, 0.85)",
        "rgba(16, 185, 129, 0.85)",
        "rgba(245, 158, 11, 0.85)",
        "rgba(239, 68, 68, 0.85)",
      ],
      borderColor: "rgba(1,18,54,1)",
      borderWidth: 3,
      hoverOffset: 10,
    },
  ],
};

// ── Pie chart — bugungi yavka ─────────────────────────────────

export const PIE_CHART_DATA = {
  labels: ["ПРИШЛИ", "НЕ ПРИШЛИ"],
  datasets: [
    {
      label: "Сотрудники",
      data: [286, 64],
      backgroundColor: [
        "rgba(56, 189, 248, 0.85)",
        "rgba(239, 68, 68, 0.75)",
      ],
      borderColor: "rgba(1,18,54,1)",
      borderWidth: 3,
      hoverOffset: 12,
    },
  ],
};

// ── Chart.js umumiy tooltip options ──────────────────────────

export const CHART_TOOLTIP_STYLE = {
  backgroundColor: "rgba(1,30,93,0.95)",
  titleColor: "#fff",
  bodyColor: "rgba(255,255,255,0.75)",
  borderColor: "rgba(255,255,255,0.1)",
  borderWidth: 1,
  padding: 12,
  cornerRadius: 12,
} as const;

export const CHART_LEGEND_LABEL_STYLE = {
  color: "rgba(255,255,255,0.75)",
  font: { size: 12, weight: "bold" as const },
  padding: 16,
  usePointStyle: true,
} as const;

export const CHART_SCALE_STYLE = {
  grid: { color: "rgba(255,255,255,0.05)" },
  ticks: { color: "rgba(255,255,255,0.6)", font: { size: 11 } },
} as const;
