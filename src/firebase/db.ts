import { db } from "./index";
import {
  collection,
  doc,
  setDoc,
  getDocs,
  getDoc,
  writeBatch,
  query,
  limit,
} from "firebase/firestore";
import {
  SCHEDULE_SUMMARY,
  SHIFTS,
  BAR_CHART_DATA,
  LINE_CHART_DATA,
  DOUGHNUT_CHART_DATA,
  PIE_CHART_DATA,
  type Shift,
  SEEDED_USERS,
} from "@/data/admin";
import { DASHBOARD_STATS } from "@/data";

export interface Employee {
  id: string | number;
  name: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  avatar: string;
  role: string;
}

export interface AttendanceFeedItem {
  id: string;
  userId: string;
  image: string;
  location: { latitude: number; longitude: number } | null;
  timestamp: string;
  employeeName: string;
  employeePosition: string;
  employeeAvatar: string;
  sortTime: number;
}

// Seed function to initialize Firestore with mock data if collections are empty
export const seedDatabaseIfEmpty = async () => {
  try {
    // 1. Check & seed dashboard stats doc
    const statsDocRef = doc(db, "dashboard_data", "stats");
    const statsSnap = await getDoc(statsDocRef);
    if (!statsSnap.exists()) {
      await setDoc(statsDocRef, { items: DASHBOARD_STATS });
      console.log("Seeded dashboard_stats");
    }

    // 2. Check & seed schedule summary doc
    const summaryDocRef = doc(db, "dashboard_data", "schedule_summary");
    const summarySnap = await getDoc(summaryDocRef);
    if (!summarySnap.exists()) {
      await setDoc(summaryDocRef, { items: SCHEDULE_SUMMARY });
      console.log("Seeded schedule_summary");
    }

    // 3. Check & seed charts doc
    const chartsDocRef = doc(db, "dashboard_data", "charts");
    const chartsSnap = await getDoc(chartsDocRef);
    if (!chartsSnap.exists()) {
      await setDoc(chartsDocRef, {
        bar: BAR_CHART_DATA,
        line: LINE_CHART_DATA,
        doughnut: DOUGHNUT_CHART_DATA,
        pie: PIE_CHART_DATA,
      });
      console.log("Seeded chart data");
    }

    // 4. Check & seed shifts collection
    const shiftsColRef = collection(db, "shifts");
    const shiftsSnap = await getDocs(query(shiftsColRef, limit(1)));
    if (shiftsSnap.empty) {
      const batch = writeBatch(db);
      SHIFTS.forEach((shift) => {
        const docRef = doc(shiftsColRef, `shift_${shift.id}`);
        batch.set(docRef, shift);
      });
      await batch.commit();
      console.log("Seeded shifts collection");
    }

    // 5. Check & seed users collection (only seed if empty)
    const usersColRef = collection(db, "users");
    const usersSnap = await getDocs(query(usersColRef, limit(2)));
    if (usersSnap.empty) {
      const batch = writeBatch(db);
      SEEDED_USERS.forEach((u) => {
        const docRef = doc(usersColRef, u.id);
        batch.set(docRef, {
          id: u.id,
          name: u.name,
          lastName: u.lastName || "",
          email: u.email || "",
          phone: u.phone || "",
          position: u.position,
          positionRu: u.positionRu,
          avatarUrl: u.avatarUrl || "/user-logo.png",
          role: "user",
          createdAt: new Date().toISOString(),
        });
      });
      await batch.commit();
      console.log("Seeded mock users collection");
    }

    // 6. Check & seed attendance collection (live check-ins feed)
    const attendanceColRef = collection(db, "attendance");
    const attendanceSnap = await getDocs(query(attendanceColRef, limit(1)));
    if (attendanceSnap.empty) {
      const batch = writeBatch(db);
      const now = new Date();

      const seedCheckIns = [
        {
          id: "att_1",
          userId: "user_1", // Алексей Петров
          image:
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&fit=crop&q=80",
          location: { latitude: 41.311081, longitude: 69.240562 },
          timestamp: new Date(
            now.getTime() - 2 * 60 * 60 * 1000,
          ).toLocaleString("ru-RU"), // 2 hours ago
          checkInTime: new Date(now.getTime() - 2 * 60 * 60 * 1000),
        },
        {
          id: "att_2",
          userId: "user_2", // Мария Иванова
          image:
            "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&fit=crop&q=80",
          location: { latitude: 41.327543, longitude: 69.281121 },
          timestamp: new Date(now.getTime() - 45 * 60 * 1000).toLocaleString(
            "ru-RU",
          ), // 45 mins ago
          checkInTime: new Date(now.getTime() - 45 * 60 * 1000),
        },
        {
          id: "att_3",
          userId: "user_5", // Иван Новиков
          image:
            "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&fit=crop&q=80",
          location: { latitude: 41.299498, longitude: 69.240091 },
          timestamp: new Date(now.getTime() - 15 * 60 * 1000).toLocaleString(
            "ru-RU",
          ), // 15 mins ago
          checkInTime: new Date(now.getTime() - 15 * 60 * 1000),
        },
      ];

      seedCheckIns.forEach((checkIn) => {
        const docRef = doc(attendanceColRef, checkIn.id);
        batch.set(docRef, {
          userId: checkIn.userId,
          image: checkIn.image,
          location: checkIn.location,
          timestamp: checkIn.timestamp,
          checkInTime: checkIn.checkInTime,
        });
      });
      await batch.commit();
      console.log("Seeded mock attendance/check-ins collection");
    }
  } catch (error) {
    console.error("Error seeding Firestore database:", error);
  }
};

// Fetch helper functions
export const getDashboardStats = async () => {
  const docRef = doc(db, "dashboard_data", "stats");
  const snap = await getDoc(docRef);
  if (snap.exists()) {
    return snap.data().items;
  }
  return DASHBOARD_STATS;
};

export const getScheduleSummary = async () => {
  const docRef = doc(db, "dashboard_data", "schedule_summary");
  const snap = await getDoc(docRef);
  if (snap.exists()) {
    return snap.data().items;
  }
  return SCHEDULE_SUMMARY;
};

export const getChartsData = async () => {
  const docRef = doc(db, "dashboard_data", "charts");
  const snap = await getDoc(docRef);
  if (snap.exists()) {
    return snap.data();
  }
  return {
    bar: BAR_CHART_DATA,
    line: LINE_CHART_DATA,
    doughnut: DOUGHNUT_CHART_DATA,
    pie: PIE_CHART_DATA,
  };
};

export const getShiftsFromFirestore = async () => {
  const colRef = collection(db, "shifts");
  const snap = await getDocs(colRef);
  if (!snap.empty) {
    const list: (Shift & { docId: string })[] = [];
    snap.forEach((d) => {
      list.push({ ...(d.data() as Shift), docId: d.id });
    });
    // Sort by numeric id for consistent layout rendering
    return list.sort((a, b) => (Number(a.id) || 0) - (Number(b.id) || 0));
  }
  return SHIFTS;
};

export const getEmployeesFromFirestore = async () => {
  const colRef = collection(db, "users");
  const snap = await getDocs(colRef);
  if (!snap.empty) {
    const list: Employee[] = [];
    snap.forEach((d) => {
      const data = d.data();
      list.push({
        id: data.id || d.id,
        name: data.name || data.fullName || "",
        lastName: data.lastName || data.surname || "",
        email: data.email || "",
        phone: data.phone || data.number || "",
        position:
          data.positionRu ||
          data.position ||
          (data.role === "admin" ? "Администратор" : "Сотрудник"),
        avatar: data.avatarUrl || data.avatar || "/main-logo.png",
        role: data.role || "user",
      });
    });
    return list;
  }
  // Fallback to local users list
  return SEEDED_USERS.map((u) => ({
    id: u.id,
    name: u.name,
    lastName: u.lastName || "",
    email: u.email || "",
    phone: u.phone || "",
    position: u.positionRu || u.position || "Сотрудник",
    avatar: u.avatarUrl || "/main-logo.png",
    role: "user",
  }));
};

export const getAttendanceFeed = async () => {
  const colRef = collection(db, "attendance");
  const snap = await getDocs(colRef);
  const list: AttendanceFeedItem[] = [];

  if (!snap.empty) {
    const usersList = await getEmployeesFromFirestore();
    const usersMap = new Map(usersList.map((u) => [u.id, u]));

    snap.forEach((d) => {
      const data = d.data();
      const user = usersMap.get(data.userId) || {
        name: "Сотрудник",
        lastName: "",
        position: "Отдел",
        avatar: "/main-logo.png",
      };

      list.push({
        id: d.id,
        userId: data.userId,
        image: data.image || "",
        location: data.location || null,
        timestamp: data.timestamp || "",
        employeeName: `${user.name} ${user.lastName || ""}`.trim(),
        employeePosition: user.position,
        employeeAvatar: user.avatar,
        sortTime: data.checkInTime?.toDate
          ? data.checkInTime.toDate().getTime()
          : data.timestamp
            ? new Date(data.timestamp.replace(/,/g, "")).getTime()
            : 0,
      });
    });

    // Sort descending (most recent first)
    return list.sort((a, b) => b.sortTime - a.sortTime);
  }
  return [];
};

export const usersCount = (await getDocs(collection(db, "users"))).size;


