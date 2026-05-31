export interface StatCard {
  label: string;
  value: string;
  delta: string;
  deltaLabel: string;
  color: string;
  glow: string;
  modalInfo: any;
}

export interface AttendanceType {
  id: string;
  userId: string;
  userName: string;
  date: string;
  checkIn: string;
  checkOut?: string;
  checkOutImageUrl?: string;
  checkOutLocation?: {
    latitude: number;
    longitude: number;
  };
  earlyLeaveMinutes?: number;
  overtimeMinutes?: number;
  workedMinutes?: number;
  status: "present" | "late";
  lateMinutes: number;
  imageUrl: string;
  location: {
    latitude: number;
    longitude: number;
  };
  createdAt: any;
}

export type TotalUsersType = {
  users: {id:string}[];
  size: string;
};
