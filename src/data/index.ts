// ── Dashboard KPI kartochkalari ───────────────────────────────

import { db } from "@/firebase";
import { StatCard } from "@/types";

import { doc, getDoc } from "firebase/firestore";

const snap = await getDoc(doc(db, "dashboard", "stats"));

if (snap.exists()) {
  console.log(snap.data().stats);
}
