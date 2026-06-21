"use client";

import AdHeader from "@/components/admin/header";
import AdminAvatarPicker from "@/components/admin/profile/admin-avatar-picker";
import AdminProfileForm from "@/components/admin/profile/admin-profile-form";
import AdminProfileHero from "@/components/admin/profile/admin-profile-hero";
import AdminProfileInformation from "@/components/admin/profile/admin-profile-information";
import type {
  AdminProfileData,
  AdminProfileDraft,
} from "@/components/admin/profile/types";
import ProfileStats from "@/components/admin/profile-stats";
import Loading from "@/components/loading";
import ToastMessage from "@/components/user/ToastMessage";
import { auth, db } from "@/firebase";
import { updateUserAvatar } from "@/firebase/db";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuthState, useSignOut } from "react-firebase-hooks/auth";

const emptyProfile: AdminProfileData = {
  fullName: "",
  email: "",
  phone: "",
  bio: "",
  birthDate: "",
  address: "",
  passport: "",
  role: "",
  avatarUrl: "/user-logo.png",
  employeeId: "—",
  registrationDate: "—",
};

const toDraft = (profile: AdminProfileData): AdminProfileDraft => ({
  fullName: profile.fullName,
  email: profile.email,
  phone: profile.phone,
  bio: profile.bio,
  birthDate: profile.birthDate,
  address: profile.address,
});

const normalizeBirthDate = (value: unknown) => {
  const date = String(value || "").trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(date)) return date;

  const match = date.match(/^(\d{2})[./-](\d{2})[./-](\d{4})$/);
  if (!match) return "";

  const [, day, month, year] = match;
  const parsed = new Date(Number(year), Number(month) - 1, Number(day));
  const isValid =
    parsed.getFullYear() === Number(year) &&
    parsed.getMonth() === Number(month) - 1 &&
    parsed.getDate() === Number(day);

  return isValid ? `${year}-${month}-${day}` : "";
};

export default function AdminProfile() {
  const [user, authLoading] = useAuthState(auth);
  const [signOut] = useSignOut(auth);
  const router = useRouter();
  const [profile, setProfile] = useState(emptyProfile);
  const [draft, setDraft] = useState<AdminProfileDraft>(toDraft(emptyProfile));
  const [profileLoading, setProfileLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);

  const notify = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    window.setTimeout(() => setShowToast(false), 3000);
  };

  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
  }, [authLoading, router, user]);

  useEffect(() => {
    if (authLoading || !user) return;

    const loadProfile = async () => {
      try {
        const snapshot = await getDoc(doc(db, "users", user.uid));
        if (!snapshot.exists()) return;

        const data = snapshot.data();
        if (data.role && data.role !== "admin") {
          router.push("/profile");
          return;
        }

        const createdAt = data.createdAt?.toDate
          ? data.createdAt.toDate()
          : data.createdAt
            ? new Date(data.createdAt)
            : null;
        const loadedProfile: AdminProfileData = {
          fullName:
            String(data.fullName || "").trim() ||
            [data.name, data.surname || data.lastName]
              .filter(Boolean)
              .join(" ")
              .trim(),
          email: data.email || user.email || "",
          phone: data.phone || "",
          bio: data.bio || "",
          birthDate: normalizeBirthDate(data.birthDate),
          address: data.address || "",
          passport: data.passport || "",
          role: data.role || "admin",
          avatarUrl: String(
            data.avatarUrl || user.photoURL || "/user-logo.png",
          ).trim(),
          employeeId: data.employeeId || user.uid,
          registrationDate: createdAt
            ? createdAt.toLocaleDateString("ru-RU", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })
            : "—",
        };

        setProfile(loadedProfile);
        setDraft(toDraft(loadedProfile));
      } catch (error) {
        console.error("Error loading admin profile:", error);
        notify("Не удалось загрузить профиль");
      } finally {
        setProfileLoading(false);
      }
    };

    loadProfile();
  }, [authLoading, router, user]);

  const handleDraftChange = (field: keyof AdminProfileDraft, value: string) => {
    setDraft((current) => ({ ...current, [field]: value }));
  };

  const cancelEdit = () => {
    setDraft(toDraft(profile));
    setIsEditing(false);
  };

  const handleSave = async (event?: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    if (!user?.uid || !draft.fullName.trim()) return;

    setIsSaving(true);
    try {
      const updatedDraft = { ...draft, fullName: draft.fullName.trim() };
      await updateDoc(doc(db, "users", user.uid), updatedDraft);
      setProfile((current) => ({ ...current, ...updatedDraft }));
      setDraft(updatedDraft);
      setIsEditing(false);
      notify("Профиль администратора обновлен!");
    } catch (error) {
      console.error("Error saving admin profile:", error);
      notify("Ошибка при сохранении");
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || !user?.uid) return;

    if (file.size > 2 * 1024 * 1024) {
      notify("Файл слишком большой. Максимальный размер 2МБ.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      const avatarUrl = String(reader.result || "").trim();
      if (!avatarUrl) return;

      setIsSaving(true);
      try {
        await updateUserAvatar(user.uid, avatarUrl);
        setProfile((current) => ({ ...current, avatarUrl }));
        setShowAvatarPicker(false);
        notify("Аватар администратора обновлен!");
      } catch (error) {
        console.error("Error uploading admin avatar:", error);
        notify("Ошибка при загрузке аватара");
      } finally {
        setIsSaving(false);
      }
    };
    reader.readAsDataURL(file);
  };

  if (authLoading || profileLoading) return <Loading pageName="профиль" />;

  return (
    <div className="relative min-h-screen overflow-hidden pb-12 text-slate-800 transition-colors duration-300 dark:text-slate-100">
      <AdHeader />
      <div className="pointer-events-none absolute -top-[20%] -left-[10%] z-0 h-[50vw] w-[50vw] rounded-full bg-sky-500/10 blur-[120px]" />
      <div className="pointer-events-none absolute -right-[10%] -bottom-[10%] z-0 h-[60vw] w-[60vw] rounded-full bg-blue-600/10 blur-[150px]" />
      <ToastMessage showToast={showToast} toastMessage={toastMessage} />

      <main className="relative z-10 mx-auto max-w-4xl px-4 py-8 md:px-6">
        <AdminProfileHero
          profile={profile}
          isEditing={isEditing}
          isSaving={isSaving}
          onEdit={() => setIsEditing(true)}
          onCancel={cancelEdit}
          onSave={() => handleSave()}
          onSignOut={() => {
            if (confirm("Вы действительно хотите выйти?")) signOut();
          }}
          onAvatarClick={() => setShowAvatarPicker((visible) => !visible)}
        />

        {showAvatarPicker ? (
          <AdminAvatarPicker
            onClose={() => setShowAvatarPicker(false)}
            onUpload={handleFileUpload}
          />
        ) : null}

        <ProfileStats />

        <section className="w-full rounded-3xl border border-slate-200/60 bg-white/60 p-6 shadow-[0_20px_40px_rgba(0,0,0,0.04)] backdrop-blur-xl transition-all duration-300 dark:border-white/10 dark:bg-white/5 dark:shadow-xl md:p-8">
          <h3 className="mb-6 flex items-center gap-2 border-b border-slate-200 pb-3 text-xl font-bold text-slate-900 dark:border-white/10 dark:text-white">
            <span className="h-6 w-1.5 rounded-full bg-sky-500" />
            Сведения об администраторе
          </h3>
          {isEditing ? (
            <AdminProfileForm
              draft={draft}
              profile={profile}
              isSaving={isSaving}
              onChange={handleDraftChange}
              onCancel={cancelEdit}
              onSubmit={handleSave}
            />
          ) : (
            <AdminProfileInformation profile={profile} />
          )}
        </section>
      </main>
    </div>
  );
}
