export interface StatCard {
  label: string;
  value: string;
  delta: string;
  deltaLabel: string;
  color: string;
  glow: string;
}

export interface AttendanceType {
  id: string;
  userId: string;
  userName: string;
  date: string;
  checkIn: string;
  checkOut?: string;
  status: "present" | "late";
  lateMinutes: number;
  imageUrl: string;
  location: {
    latitude: number;
    longitude: number;
  };
  createdAt: any;
}
