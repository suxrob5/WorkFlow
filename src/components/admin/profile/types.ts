export type AdminProfileData = {
  fullName: string;
  email: string;
  phone: string;
  bio: string;
  birthDate: string;
  address: string;
  passport: string;
  role: string;
  avatarUrl: string;
  employeeId: string;
  registrationDate: string;
};

export type AdminProfileDraft = Pick<
  AdminProfileData,
  "fullName" | "email" | "phone" | "bio" | "birthDate" | "address"
>;
