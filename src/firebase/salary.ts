import { db } from "@/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";

export type SalaryEmployee = {
  id: string;
  name: string;
  position: string;
};

export type SalaryCriterion = {
  key: "attendance" | "violations" | "discipline";
  title: string;
  score: number;
  plan: string;
  fact: string;
};

export type SalaryLocation = {
  latitude: number;
  longitude: number;
} | null;

export type SalaryAttendanceDay = {
  date: string;
  checkIn: string;
  checkOut: string;
  checkInLocation: SalaryLocation;
  checkOutLocation: SalaryLocation;
  status: "present" | "late" | "incomplete" | "absent";
};

export type SalaryDashboardData = {
  employee: SalaryEmployee;
  baseSalary: number;
  maximumBonus: number;
  bonus: number;
  totalSalary: number;
  bonusPercent: number;
  criteria: SalaryCriterion[];
  attendanceDays: SalaryAttendanceDay[];
};

type FirestoreRecord = Record<string, unknown>;

// Temporary display values. Replace these with salary fields from Firestore later.
const TEMPORARY_BASE_SALARY = 3_000_000;
const TEMPORARY_BONUS = 4_000_000;

const asNumber = (...values: unknown[]) => {
  for (const value of values) {
    if (value === null || value === undefined || value === "") continue;
    const parsed = Number(value);
    if (Number.isFinite(parsed) && parsed >= 0) return parsed;
  }
  return 0;
};

const asText = (...values: unknown[]) => {
  const value = values.find(
    (item) => typeof item === "string" && item.trim().length > 0,
  );
  return typeof value === "string" ? value.trim() : "";
};

const clampScore = (value: number) =>
  Math.max(0, Math.min(100, Math.round(value)));

const asLocation = (value: unknown): SalaryLocation => {
  if (!value || typeof value !== "object") return null;

  const location = value as Record<string, unknown>;
  const latitude = Number(location.latitude);
  const longitude = Number(location.longitude);

  return Number.isFinite(latitude) && Number.isFinite(longitude)
    ? { latitude, longitude }
    : null;
};

const monthBounds = (month: string) => {
  const [year, monthIndex] = month.split("-").map(Number);
  const start = `${year}-${String(monthIndex).padStart(2, "0")}-01`;
  const lastDay = new Date(year, monthIndex, 0).getDate();
  const end = `${year}-${String(monthIndex).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;
  return { start, end, year, monthIndex: monthIndex - 1, lastDay };
};

const expectedWeekdays = (month: string) => {
  const { year, monthIndex, lastDay } = monthBounds(month);
  const now = new Date();
  const isCurrentMonth =
    now.getFullYear() === year && now.getMonth() === monthIndex;
  const isFutureMonth =
    year > now.getFullYear() ||
    (year === now.getFullYear() && monthIndex > now.getMonth());

  if (isFutureMonth) return 0;

  const throughDay = isCurrentMonth ? now.getDate() : lastDay;
  let weekdays = 0;
  for (let day = 1; day <= throughDay; day += 1) {
    const weekDay = new Date(year, monthIndex, day).getDay();
    if (weekDay !== 0 && weekDay !== 6) weekdays += 1;
  }
  return weekdays;
};

const workdayDateKeys = (month: string) => {
  const { year, monthIndex, lastDay } = monthBounds(month);
  const now = new Date();
  const isCurrentMonth =
    now.getFullYear() === year && now.getMonth() === monthIndex;
  const isFutureMonth =
    year > now.getFullYear() ||
    (year === now.getFullYear() && monthIndex > now.getMonth());

  if (isFutureMonth) return [];

  const throughDay = isCurrentMonth ? now.getDate() : lastDay;
  return Array.from({ length: throughDay }, (_, index) => index + 1)
    .filter((day) => {
      const weekDay = new Date(year, monthIndex, day).getDay();
      return weekDay !== 0 && weekDay !== 6;
    })
    .map(
      (day) =>
        `${year}-${String(monthIndex + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
    );
};

const getEmployeeSalaryRecord = async (employeeId: string) => {
  const pluralSnapshot = await getDoc(doc(db, "salaries", employeeId));
  if (pluralSnapshot.exists()) return pluralSnapshot.data();

  const singularSnapshot = await getDoc(doc(db, "salary", employeeId));
  return singularSnapshot.exists() ? singularSnapshot.data() : {};
};

export const getSalaryEmployees = async (): Promise<SalaryEmployee[]> => {
  const snapshot = await getDocs(collection(db, "users"));

  return snapshot.docs
    .filter(
      (userDoc) =>
        String(userDoc.data().role || "user")
          .trim()
          .toLowerCase() !== "admin",
    )
    .map((userDoc) => {
      const data = userDoc.data();
      return {
        id: userDoc.id,
        name:
          `${asText(data.name, data.fullName)} ${asText(data.lastName, data.surname)}`.trim() ||
          asText(data.email) ||
          "Сотрудник",
        position:
          asText(data.positionRu, data.position, data.role) || "Сотрудник",
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name, "ru"));
};

export const getSalaryDashboardData = async (
  employeeId: string,
  month: string,
): Promise<SalaryDashboardData> => {
  const { start, end } = monthBounds(month);
  const [userSnapshot, salaryRecord, attendanceSnapshot] = await Promise.all([
    getDoc(doc(db, "users", employeeId)),
    getEmployeeSalaryRecord(employeeId),
    getDocs(
      query(collection(db, "attendance"), where("userId", "==", employeeId)),
    ),
  ]);

  const userData = (
    userSnapshot.exists() ? userSnapshot.data() : {}
  ) as FirestoreRecord;
  const salaryData = salaryRecord as FirestoreRecord;
  const attendance = attendanceSnapshot.docs
    .map((item) => item.data())
    .filter((item) => {
      const date = String(item.date || "");
      return date >= start && date <= end;
    });

  const employee: SalaryEmployee = {
    id: employeeId,
    name:
      `${asText(userData.name, userData.fullName)} ${asText(userData.lastName, userData.surname)}`.trim() ||
      asText(userData.email) ||
      "Сотрудник",
    position:
      asText(userData.positionRu, userData.position, userData.role) ||
      "Сотрудник",
  };

  const baseSalary = TEMPORARY_BASE_SALARY;
  const maximumBonus = TEMPORARY_BONUS;

  const presentDays = new Set(
    attendance.map((item) => String(item.date || "")).filter(Boolean),
  ).size;
  const planDays = expectedWeekdays(month);
  const attendanceScore =
    planDays === 0 ? 0 : clampScore((presentDays / planDays) * 100);
  const violations = attendance.filter(
    (item) =>
      item.status === "late" ||
      asNumber(item.lateMinutes) > 0 ||
      asNumber(item.earlyLeaveMinutes) > 0,
  ).length;
  const violationsScore = clampScore(100 - violations * 10);
  const disciplineScore = clampScore(
    asNumber(
      salaryData.disciplineScore,
      userData.disciplineScore,
      violationsScore,
    ),
  );

  const criteria: SalaryCriterion[] = [
    {
      key: "attendance",
      title: "Посещаемость",
      score: attendanceScore,
      plan: `План: ${planDays} рабочих дней`,
      fact: `Факт: ${presentDays} дней`,
    },
    {
      key: "violations",
      title: "Нарушения",
      score: violationsScore,
      plan: "План: 0 нарушений",
      fact: `Факт: ${violations}`,
    },
    {
      key: "discipline",
      title: "Дисциплина",
      score: disciplineScore,
      plan: "План: 100% соблюдения правил",
      fact: `Факт: ${disciplineScore}%`,
    },
  ];

  const bonusPercent = clampScore(
    criteria.reduce((sum, item) => sum + item.score, 0) / criteria.length,
  );
  const bonus = TEMPORARY_BONUS;
  const attendanceByDate = new Map(
    attendance.map((item) => [String(item.date || ""), item]),
  );
  const attendanceDates = attendance
    .map((item) => String(item.date || ""))
    .filter(Boolean);
  const allAttendanceDates = Array.from(
    new Set([...workdayDateKeys(month), ...attendanceDates]),
  ).sort((a, b) => b.localeCompare(a));
  const attendanceDays: SalaryAttendanceDay[] = allAttendanceDates.map(
    (date) => {
      const item = attendanceByDate.get(date);
      if (!item) {
        return {
          date,
          checkIn: "",
          checkOut: "",
          checkInLocation: null,
          checkOutLocation: null,
          status: "absent",
        };
      }

      const checkIn = String(item.checkIn || "");
      const checkOut = String(item.checkOut || "");
      const isLate =
        item.status === "late" || Number(item.lateMinutes || 0) > 0;

      return {
        date,
        checkIn,
        checkOut,
        checkInLocation: asLocation(item.location),
        checkOutLocation: asLocation(item.checkOutLocation),
        status:
          !checkIn || !checkOut ? "incomplete" : isLate ? "late" : "present",
      };
    },
  );

  return {
    employee,
    baseSalary,
    maximumBonus,
    bonus,
    totalSalary: baseSalary + bonus,
    bonusPercent,
    criteria,
    attendanceDays,
  };
};
