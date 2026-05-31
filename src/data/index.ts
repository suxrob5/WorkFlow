// ── Dashboard KPI kartochkalari ───────────────────────────────

import { db } from "@/firebase";
import { StatCard } from "@/types";

import { doc, getDoc } from "firebase/firestore";

const snap = await getDoc(doc(db, "dashboard", "stats"));

if (snap.exists()) {
  console.log(snap.data().stats);
}

export const DASHBOARD_STATS: StatCard[] = [
  {
    label: "Всего сотрудников",
    value: "1,248",
    delta: "+12",
    deltaLabel: "за месяц",
    color: "from-sky-500 to-blue-600",
    glow: "shadow-sky-500/25",
  },
  {
    label: "Прогресс за месяц",
    value: "68%",
    delta: "+5.4%",
    deltaLabel: "vs прошлый мес.",
    color: "from-emerald-500 to-teal-600",
    glow: "shadow-emerald-500/25",
  },
  {
    label: "Пришли / Ушли (месяц)",
    value: "84 / 12",
    delta: "72",
    deltaLabel: "чистый приток",
    color: "from-amber-500 to-orange-600",
    glow: "shadow-amber-500/25",
  },
  {
    label: "Опоздавшие",
    value: "14",
    delta: "-3",
    deltaLabel: "vs вчера",
    color: "from-rose-500 to-red-600",
    glow: "shadow-rose-500/25",
  },
];

