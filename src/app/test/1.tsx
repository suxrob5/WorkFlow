"use client";

import { doc, setDoc } from "firebase/firestore";

import { db } from "@/firebase";
import { DASHBOARD_STATS } from "@/data";

export default function PushDashboardStats() {
  const pushStats = async () => {
    try {
      await setDoc(doc(db, "dashboard", "stats"), {
        stats: DASHBOARD_STATS,
        updatedAt: new Date(),
      });

      alert("Dashboard stats Firebase ga saqlandi!");
    } catch (error) {
      console.error(error);
      alert("Xatolik yuz berdi");
    }
  };

  return (
    <button
      onClick={pushStats}
      className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
    >
      Firebase Push
    </button>
  );
}
