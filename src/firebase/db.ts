import { auth, db } from "./index";
import {
  collection,
  doc,
  setDoc,
  getDocs,
  getDoc,
  writeBatch,
  query,
  updateDoc,
  limit,
  onSnapshot,
  deleteField,
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
// import { DASHBOARD_STATS } from "@/data";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { getPositionLabel } from "@/lib/positions";

export interface Employee {
  id: string | number;
  name: string;
  lastName: string;
  email: string;
  phone: string;
  positionKey?: string;
  position: string;
  avatar: string;
  role: string;
}

export interface AttendanceFeedItem {
  id: string;
  userId: string;
  image: string;
  location: { latitude: number; longitude: number } | null;
  checkOutImage: string;
  checkOutLocation: { latitude: number; longitude: number } | null;
  timestamp: string;
  checkIn: string;
  checkOut?: string;
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
      await setDoc(statsDocRef, { items: "" });
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
  return "DASHBOARD_STATS";
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
        positionKey: data.positionKey,
        position:
          data.role === "admin"
            ? "Администратор"
            : getPositionLabel({
                positionKey: data.positionKey,
                position: data.position,
                positionRu: data.positionRu,
              }),
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
    position: getPositionLabel({
      position: u.position,
      positionRu: u.positionRu,
    }),
    avatar: u.avatarUrl || "/main-logo.png",
    role: "user",
  }));
};

export const getAttendanceFeed = async () => {
  const colRef = collection(db, "attendance");
  const snap = await getDocs(colRef);
  const list: AttendanceFeedItem[] = [];
  const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;

  if (!snap.empty) {
    const usersList = await getEmployeesFromFirestore();
    const usersMap = new Map(usersList.map((u) => [String(u.id), u]));

    await Promise.all(
      snap.docs.map(async (d) => {
        const data = d.data();
        const user = usersMap.get(String(data.userId)) || {
          name: data.userName || "Сотрудник",
          lastName: "",
          position: "Отдел",
          avatar: "/main-logo.png",
        };
        const sortTime = data.createdAt?.toDate
          ? data.createdAt.toDate().getTime()
          : data.checkInTime?.toDate
            ? data.checkInTime.toDate().getTime()
            : data.date && data.checkIn
              ? new Date(`${data.date}T${data.checkIn}:00`).getTime()
              : data.timestamp
                ? new Date(String(data.timestamp).replace(/,/g, "")).getTime()
                : 0;
        const mediaExpired = sortTime > 0 && sortTime < oneDayAgo;
        const hasExpiredImage =
          data.image || data.imageUrl || data.checkOutImageUrl;

        if (mediaExpired && hasExpiredImage) {
          await updateDoc(doc(db, "attendance", d.id), {
            image: deleteField(),
            imageUrl: deleteField(),
            checkOutImageUrl: deleteField(),
          });
        }

        list.push({
          id: d.id,
          userId: data.userId,
          image: mediaExpired ? "" : data.imageUrl || data.image || "",
          location: data.location || null,
          checkOutImage: mediaExpired ? "" : data.checkOutImageUrl || "",
          checkOutLocation: data.checkOutLocation || null,
          timestamp:
            data.timestamp ||
            [data.date, data.checkIn].filter(Boolean).join(" ") ||
            "",
          checkIn: data.checkIn || "",
          checkOut: data.checkOut,
          employeeName: `${user.name} ${user.lastName || ""}`.trim(),
          employeePosition: user.position,
          employeeAvatar: user.avatar,
          sortTime,
        });
      }),
    );

    return list.sort((a, b) => b.sortTime - a.sortTime);
  }
  return [];
};

export const getUsersCount = async () => {
  const snap = await getDocs(collection(db, "users"));
  return snap.size;
};

// get user data

/**
 * Custom hook to access the authenticated user's profile data.
 * This replaces the broken top-level hook calls.
 */
export function useProfile() {
  const [user, authLoading] = useAuthState(auth);
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      setProfileData("nothing");
      setLoading(false);
      return;
    }

    const unsub = onSnapshot(
      doc(db, "users", user.uid),
      (snapshot) => {
        setProfileData(snapshot.exists() ? snapshot.data() : null);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching profile data:", error);
        setLoading(false);
      },
    );

    return () => unsub();
  }, [user, authLoading]);

  return { profileData, user, loading: authLoading || loading };
}

/**
 * Updates the user's avatar image in Firestore using a base64 string.
 */
export const updateUserAvatar = async (uid: string, base64String: string) => {
  const userRef = doc(db, "users", uid);
  return await updateDoc(userRef, {
    avatarUrl: base64String.trim(),
  });
};

/**
 * Updates general user profile information.
 */
export const updateUserProfile = async (uid: string, data: any) => {
  const userRef = doc(db, "users", uid);
  return await updateDoc(userRef, data);
};

// Dashboard Stats

// Barcha userlar + soni
export const getUsers = async () => {
  const usersSnap = await getDocs(collection(db, "users"));

  const users = usersSnap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return {
    users,
    size: users.length,
  };
};

// Bugun kelganlar + soni
export const getTodayPresentUsers = async () => {
  const today = new Date().toISOString().split("T")[0];

  const attendanceSnap = await getDocs(collection(db, "attendance"));

  const users = attendanceSnap.docs
    .filter((doc) => doc.data().date === today)
    .map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

  return {
    users,
    size: users.length,
  };
};

// Bugun kech qolganlar + soni
export const getTodayLateUsers = async () => {
  const today = new Date().toISOString().split("T")[0];

  const attendanceSnap = await getDocs(collection(db, "attendance"));

  const users = attendanceSnap.docs
    .filter((doc) => doc.data().date === today && doc.data().status === "late")
    .map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

  return {
    users,
    size: users.length,
  };
};

// Bugun kelmaganlar + soni
export const getTodayAbsentUsers = async () => {
  const { users } = await getUsers();
  const { users: presentUsers } = await getTodayPresentUsers();

  const presentIds = new Set(presentUsers.map((user: any) => user.userId));

  const absentUsers = users.filter(
    (user: any) => !presentIds.has(user.uid || user.id),
  );

  return {
    users: absentUsers,
    size: absentUsers.length,
  };
};


// active userlar
export const getActiveShifts = async () => {
  const attendanceSnap = await getDocs(collection(db, "attendance"));

  const activeUsers = attendanceSnap.docs
    .filter((doc) => !doc.data().checkOut)
    .map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

  return {
    users: activeUsers,
    size: activeUsers.length,
  };
};

const toDateKey = (date: Date) => date.toISOString().split("T")[0];

export const getDashboardChartsFromFirestore = async () => {
  const usersSnap = await getDocs(collection(db, "users"));
  const attendanceSnap = await getDocs(collection(db, "attendance"));
  const totalUsers = usersSnap.size;
  const now = new Date();
  const today = toDateKey(now);

  const monday = new Date(now);
  const day = monday.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  monday.setDate(monday.getDate() + diff);
  monday.setHours(0, 0, 0, 0);

  const weekDates = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + index);
    return toDateKey(date);
  });

  const presentByDate = new Map<string, Set<string>>();
  const lateTodayUsers = new Set<string>();
  const presentTodayUsers = new Set<string>();

  attendanceSnap.forEach((attendanceDoc) => {
    const data = attendanceDoc.data();
    const attendanceDate = data.date;
    const userId = data.userId;

    if (!attendanceDate || !userId) return;

    if (!presentByDate.has(attendanceDate)) {
      presentByDate.set(attendanceDate, new Set());
    }
    presentByDate.get(attendanceDate)?.add(userId);

    if (attendanceDate === today) {
      presentTodayUsers.add(userId);

      if (data.status === "late" || Number(data.lateMinutes || 0) > 0) {
        lateTodayUsers.add(userId);
      }
    }
  });

  const presentCounts = weekDates.map(
    (date) => presentByDate.get(date)?.size ?? 0,
  );
  const absentCounts = presentCounts.map((present) =>
    Math.max(totalUsers - present, 0),
  );
  const lateToday = lateTodayUsers.size;
  const presentOnTimeToday = Math.max(presentTodayUsers.size - lateToday, 0);
  const absentToday = Math.max(totalUsers - presentTodayUsers.size, 0);

  return {
    bar: {
      labels: ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"],
      datasets: [
        {
          label: "Присутствовали",
          data: presentCounts,
          backgroundColor: "rgba(56, 189, 248, 0.8)",
          borderColor: "rgba(56, 189, 248, 1)",
          borderWidth: 2,
          borderRadius: 8,
          borderSkipped: false as const,
        },
        {
          label: "Отсутствовали",
          data: absentCounts,
          backgroundColor: "rgba(239, 68, 68, 0.6)",
          borderColor: "rgba(239, 68, 68, 1)",
          borderWidth: 2,
          borderRadius: 8,
          borderSkipped: false as const,
        },
      ],
    },
    pie: {
      labels: ["Пришли вовремя", "Опоздали", "Не пришли"],
      datasets: [
        {
          label: "Сотрудники",
          data: [presentOnTimeToday, lateToday, absentToday],
          backgroundColor: [
            "rgba(56, 189, 248, 0.85)",
            "rgba(245, 158, 11, 0.85)",
            "rgba(239, 68, 68, 0.75)",
          ],
          borderColor: "rgba(1,18,54,1)",
          borderWidth: 3,
          hoverOffset: 12,
        },
      ],
    },
    line: LINE_CHART_DATA,
  };
};

export const getActivitiesDataFromFirestore = async () => {
  const [usersSnap, attendanceSnap, shifts] = await Promise.all([
    getDocs(collection(db, "users")),
    getDocs(collection(db, "attendance")),
    getShiftsFromFirestore(),
  ]);

  const now = new Date();
  const today = toDateKey(now);
  const month = now.getMonth();
  const year = now.getFullYear();
  const monthlyWorked = Array(12).fill(0);
  const monthlyOvertime = Array(12).fill(0);
  const departmentCounts = new Map<string, number>();
  const activeShiftUsers = new Set<string>();
  const todayUsers = new Set<string>();
  const lateTodayUsers = new Set<string>();

  usersSnap.forEach((userDoc) => {
    const data = userDoc.data();
    const department =
      data.role === "admin"
        ? "Администратор"
        : getPositionLabel({
            positionKey: data.positionKey,
            position: data.position,
            positionRu: data.positionRu,
          });
    departmentCounts.set(department, (departmentCounts.get(department) ?? 0) + 1);
  });

  attendanceSnap.forEach((attendanceDoc) => {
    const data = attendanceDoc.data();
    const attendanceDate = data.date;
    const userId = data.userId;

    if (!attendanceDate || !userId) return;

    if (!data.checkOut) {
      activeShiftUsers.add(userId);
    }

    if (attendanceDate === today) {
      todayUsers.add(userId);

      if (data.status === "late" || Number(data.lateMinutes || 0) > 0) {
        lateTodayUsers.add(userId);
      }
    }

    const parsedDate = new Date(attendanceDate);
    if (
      !Number.isNaN(parsedDate.getTime()) &&
      parsedDate.getFullYear() === year
    ) {
      monthlyWorked[parsedDate.getMonth()] += Number(data.workedMinutes || 0);
      monthlyOvertime[parsedDate.getMonth()] += Number(
        data.overtimeMinutes || 0,
      );
    }
  });

  const workedThisMonthMinutes = monthlyWorked[month];

  return {
    summary: [
      {
        label: "Активных смен",
        value: String(activeShiftUsers.size),
        sub: "сейчас открыты",
        icon: "⏱",
        color: "from-sky-500 to-blue-600",
      },
      {
        label: "Смен сегодня",
        value: String(todayUsers.size),
        sub: "отметились сегодня",
        icon: "✔",
        color: "from-emerald-500 to-teal-600",
      },
      {
        label: "Опоздавших",
        value: String(lateTodayUsers.size),
        sub: "за сегодняшний день",
        icon: "!",
        color: "from-amber-500 to-orange-500",
      },
      {
        label: "Отработано часов",
        value: String(Math.round(workedThisMonthMinutes / 60)),
        sub: "за этот месяц",
        icon: "ч",
        color: "from-rose-500 to-pink-600",
      },
    ],
    shifts,
    charts: {
      bar: (await getDashboardChartsFromFirestore()).bar,
      line: {
        labels: [
          "Янв",
          "Фев",
          "Мар",
          "Апр",
          "Май",
          "Июн",
          "Июл",
          "Авг",
          "Сен",
          "Окт",
          "Ноя",
          "Дек",
        ],
        datasets: [
          {
            label: "Рабочие часы",
            data: monthlyWorked.map((minutes) => Math.round(minutes / 60)),
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
            data: monthlyOvertime.map((minutes) => Math.round(minutes / 60)),
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
      },
      doughnut: {
        labels: Array.from(departmentCounts.keys()),
        datasets: [
          {
            label: "Сотрудники",
            data: Array.from(departmentCounts.values()),
            backgroundColor: [
              "rgba(56, 189, 248, 0.85)",
              "rgba(99, 102, 241, 0.85)",
              "rgba(16, 185, 129, 0.85)",
              "rgba(245, 158, 11, 0.85)",
              "rgba(239, 68, 68, 0.85)",
              "rgba(168, 85, 247, 0.85)",
            ],
            borderColor: "rgba(1,18,54,1)",
            borderWidth: 3,
            hoverOffset: 10,
          },
        ],
      },
    },
  };
};

export const getEmployeeRowsFromFirestore = async () => {
  const [employees, shifts, attendanceSnap] = await Promise.all([
    getEmployeesFromFirestore(),
    getShiftsFromFirestore(),
    getDocs(collection(db, "attendance")),
  ]);

  const activeShiftUsers = new Set<string>();
  attendanceSnap.forEach((attendanceDoc) => {
    const data = attendanceDoc.data();
    if (data.userId && !data.checkOut) {
      activeShiftUsers.add(data.userId);
    }
  });

  return employees.map((employee) => {
    const employeeName = `${employee.name} ${employee.lastName || ""}`.trim();
    const employeeShift = shifts.find((shift: any) => {
      const shiftName = shift.userName || shift.employee || "";
      return (
        shift.userId === employee.id ||
        shift.id === employee.id ||
        shiftName.toLowerCase() === employeeName.toLowerCase()
      );
    });

    return {
      id: employee.id,
      userName: employeeName,
      dept: employee.position || "Сотрудник",
      shift: employeeShift?.shift || "День (09:00-18:00)",
      days: employeeShift?.days || ["Пн", "Вт", "Ср", "Чт", "Пт"],
      status: activeShiftUsers.has(String(employee.id))
        ? "active"
        : employeeShift?.status || "active",
      avatar: employee.avatar,
      email: employee.email,
      phone: employee.phone,
    };
  });
};
