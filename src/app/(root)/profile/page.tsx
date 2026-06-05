"use client";

import { useEffect, useState } from "react";
import Header from "@/components/user/header";
import UserStats from "@/components/user/user-stats";
import ToastMessage from "@/components/user/ToastMessage";
import ProfileHero from "@/components/user/profile-hero";
import { Gallary, Plus, XIcon } from "@/assets/logos/images";
import ProfileInformation from "@/components/user/profile-inform";
import InteractiveEditForm from "@/components/user/interactive-edit-form-mode";
import { useRouter } from "next/navigation";
import { useProfile, updateUserAvatar, updateUserProfile } from "@/firebase/db";

const ProfileLoading = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-[#021236]">
    <div className="relative">
      {/* Outer spinning ring */}
      <div className="w-20 h-20 rounded-full border-4 border-sky-500/20 border-t-sky-500 animate-spin" />
      {/* Inner pulsing logo or icon */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-10 h-10 bg-sky-500 rounded-xl animate-pulse" />
      </div>
    </div>
    <h2 className="mt-6 text-lg font-bold text-slate-900 dark:text-white animate-pulse font-nunito">
      Загрузка профиля...
    </h2>
    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 font-nunito">
      Пожалуйста, подождите
    </p>
  </div>
);

const Profile = () => {
  const router = useRouter();
  const { profileData, user, loading } = useProfile();

  // // Interactive UI States
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);

  // Form inputs for editing state
  const [editName, setEditName] = useState("");
  const [editSurname, setEditSurname] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editBio, setEditBio] = useState("");
  const [editBirthDate, setEditBirthDate] = useState("");
  const [editAddress, setEditAddress] = useState("");
  const [editPosition, setEditPosition] = useState("");
  const [editPositionRu, setEditPositionRu] = useState("");
  const [editPassport, setEditPassport] = useState("");

  // Sync local edit state when profile data is loaded/updated from Firestore
  useEffect(() => {
    if (profileData && profileData !== "nothing") {
      setEditName(
        profileData.name || profileData.fullName?.split(" ")[0] || "",
      );
      setEditSurname(
        profileData.surname ||
          profileData.lastName ||
          profileData.fullName?.split(" ")[1] ||
          "",
      );
      setEditEmail(profileData.email || "");
      setEditPhone(profileData.phone || "");
      setEditBio(profileData.bio || "");
      setEditBirthDate(profileData.birthDate || "");
      setEditAddress(profileData.address || "");
      setEditPosition(profileData.position || "");
      setEditPositionRu(profileData.positionRu || "");
      setEditPassport(profileData.passport || "");
    }
  }, [profileData]);

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!user?.uid) return;
    setIsSaving(true);

    try {
      await updateUserProfile(user.uid, {
        fullName: `${editName} ${editSurname}`.trim(),
        name: editName,
        surname: editSurname,
        email: editEmail,
        phone: editPhone,
        bio: editBio,
        birthDate: editBirthDate,
        address: editAddress,
      });

      setIsEditing(false);
      setToastMessage("Профиль успешно обновлен!");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (error) {
      console.error("Error saving profile:", error);
      setToastMessage("Ошибка при сохранении");
      setShowToast(true);
    } finally {
      setIsSaving(false);
    }
  };

  const cancelEdit = () => {
    // Reset edit state to the current saved data
    if (profileData && profileData !== "nothing") {
      setEditName(
        profileData.name || profileData.fullName?.split(" ")[0] || "",
      );
      setEditSurname(
        profileData.surname ||
          profileData.lastName ||
          profileData.fullName?.split(" ")[1] ||
          "",
      );
      setEditEmail(profileData.email || "");
      setEditPhone(profileData.phone || "");
      setEditBio(profileData.bio || "");
      setEditBirthDate(profileData.birthDate || "");
      setEditAddress(profileData.address || "");
      setEditPosition(profileData.position || "");
      setEditPositionRu(profileData.positionRu || "");
      setEditPassport(profileData.passport || "");
    }
    setIsEditing(false);
    setToastMessage("Редактирование отменено");
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setToastMessage("Файл слишком большой. Максимальный размер 2МБ.");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result as string;
      if (user?.uid) {
        setIsSaving(true);
        try {
          await updateUserAvatar(user.uid, base64String);
          setToastMessage("Аватар успешно обновлен!");
          setShowToast(true);
          setShowAvatarSelector(false);
          setTimeout(() => setShowToast(false), 3000);
        } catch (error) {
          console.error("Upload error:", error);
          setToastMessage("Ошибка при загрузке аватара");
          setShowToast(true);
        } finally {
          setIsSaving(false);
        }
      }
    };
    // Reset input value to allow selecting the same file again
    e.target.value = "";
    reader.readAsDataURL(file);
  };

  // Redirect logic: Keep this page for 'user' role only.
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    } else if (!loading && user && profileData?.role === "admin") {
      // Redirect admins to their dedicated profile page
      router.push("/dashboard/profile");
    }
  }, [user, loading, profileData?.role, router]);

  if (loading || (user && profileData?.role === "admin")) {
    return <ProfileLoading />;
  }

  return (
    <div className="min-h-screen text-slate-800 dark:text-slate-100 font-nunito relative overflow-hidden pb-12 transition-colors duration-300">
      {/* Nav Header */}
      <Header />

      {/* Glowing Ambient Background Elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-sky-500/10 blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-blue-600/10 blur-[150px] pointer-events-none z-0" />

      {/* Notification Toast */}
      <ToastMessage showToast={showToast} toastMessage={toastMessage} />

      <main className="relative z-10 mx-auto max-w-4xl px-4 py-8 md:px-6">
        {/* Profile Hero Header Card */}
        <ProfileHero
          setShowAvatarSelector={setShowAvatarSelector}
          showAvatarSelector={showAvatarSelector}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          cancelEdit={cancelEdit}
          isSaving={isSaving}
          user={user}
          handleSave={handleSave}
        />

        {/* Avatar Picker Modal Dropdown (appears beautifully right under banner when avatar clicked) */}
        {showAvatarSelector && (
          <div className="w-full rounded-3xl bg-white/80 dark:bg-white/5 border border-sky-500/20 dark:border-sky-500/30 backdrop-blur-2xl shadow-[0_20px_40px_rgba(0,0,0,0.06)] dark:shadow-[0_20px_40px_rgba(0,0,0,0.5)] p-6 mb-8 transition-all duration-300 animate-fadeIn relative z-20">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Gallary />
                Выберите новый аватар
              </h3>
              <button
                onClick={() => setShowAvatarSelector(false)}
                className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white cursor-pointer"
              >
                <XIcon />
              </button>
            </div>
            <div className="flex flex-wrap gap-4">
              <label
                htmlFor="avatar-upload"
                className="relative w-24 h-24 rounded-2xl border-2 border-dashed border-slate-300 dark:border-white/20 flex flex-col items-center justify-center hover:border-sky-500 hover:bg-sky-50 dark:hover:bg-sky-500/10 transition duration-200 cursor-pointer group/upload"
              >
                <Plus />
                <span className="text-[10px] font-bold text-slate-400 group-hover/upload:text-sky-500 uppercase mt-1">
                  Загрузить
                </span>
                <input
                  type="file"
                  id="avatar-upload"
                  onChange={handleFileUpload}
                  accept="image/*"
                  className="hidden"
                />
              </label>
            </div>
          </div>
        )}

        {/* Dashboard Stats Row to improve visual layout density */}
        <UserStats />

        {/* Main Content Card */}
        <div className="w-full rounded-3xl bg-white/60 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 backdrop-blur-xl shadow-[0_20px_40px_rgba(0,0,0,0.04)] dark:shadow-xl p-6 md:p-8 transition-all duration-300">
          {/* PERSONAL INFO */}
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 pb-3 border-b border-slate-200 dark:border-white/10 flex items-center gap-2">
              <span className="w-1.5 h-6 rounded-full bg-sky-500" />
              Сведения о сотруднике
            </h3>
            {!isEditing ? (
              <ProfileInformation />
            ) : (
              <InteractiveEditForm
                editName={editName}
                setEditName={setEditName}
                editSurname={editSurname}
                setEditSurname={setEditSurname}
                editEmail={editEmail}
                setEditEmail={setEditEmail}
                editPhone={editPhone}
                setEditPhone={setEditPhone}
                editBirthDate={editBirthDate}
                setEditBirthDate={setEditBirthDate}
                editPassport={editPassport}
                editPosition={editPosition}
                editPositionRu={editPositionRu}
                editAddress={editAddress}
                setEditAddress={setEditAddress}
                editBio={editBio}
                setEditBio={setEditBio}
                handleSave={handleSave}
                role={profileData?.role || "user"}
                cancelEdit={cancelEdit}
                isSaving={isSaving}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
