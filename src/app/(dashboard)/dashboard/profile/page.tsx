"use client";

import React, { useState, useEffect, useRef } from "react";
import AdHeader from "@/components/admin/header";
import Image from "next/image";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "@/firebase";
import { useRouter } from "next/navigation";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { updateUserAvatar } from "@/firebase/db";
import ProfileStats from "@/components/admin/profile-stats";

const AdminProfile = () => {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();

  // Core Profile States
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("admin");
  const [avatarUrl, setAvatarUrl] = useState("/user-logo.png");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [address, setAddress] = useState("");
  const [position, setPosition] = useState("");
  const [positionRu, setPositionRu] = useState("");
  const [passport, setPassport] = useState("");
  const [employeeId, setEmployeeId] = useState("...");
  const [registrationDate, setRegistrationDate] = useState("...");

  // Redirect logic: Only allow 'admin' role on this page.
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    } else if (!loading && user && role === "user") {
      // Redirect standard users to their dedicated profile page
      router.push("/profile");
    }
  }, [user, loading, role, router]);

  // Interactive UI States
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form inputs for editing state
  const [editName, setEditName] = useState(name);
  const [editSurname, setEditSurname] = useState(surname);
  const [editEmail, setEditEmail] = useState(email);
  const [editPhone, setEditPhone] = useState(phone);
  const [editBio, setEditBio] = useState(bio);
  const [editBirthDate, setEditBirthDate] = useState(birthDate);
  const [editAddress, setEditAddress] = useState(address);
  const [editPosition, setEditPosition] = useState(position);
  const [editPositionRu, setEditPositionRu] = useState(positionRu);
  const [editPassport, setEditPassport] = useState(passport);

  // Fetch profile data from Firestore on mount
  useEffect(() => {
    const fetchProfileData = async () => {
      if (user?.uid) {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            const profileName = data.fullName || data.name;
            if (profileName) {
              setName(profileName);
              setEditName(profileName);
            }
            if (data.surname) {
              setSurname(data.surname);
              setEditSurname(data.surname);
            }
            if (data.email) {
              setEmail(data.email);
              setEditEmail(data.email);
            }
            if (data.avatarUrl) setAvatarUrl(String(data.avatarUrl).trim());
            if (data.phone) {
              setPhone(data.phone);
              setEditPhone(data.phone);
            }
            if (data.bio) {
              setBio(data.bio);
              setEditBio(data.bio);
            }
            if (data.birthDate) {
              setBirthDate(data.birthDate);
              setEditBirthDate(data.birthDate);
            }
            if (data.address) {
              setAddress(data.address);
              setEditAddress(data.address);
            }
            if (data.position) {
              setPosition(data.position);
              setEditPosition(data.position);
            }
            if (data.positionRu) {
              setPositionRu(data.positionRu);
              setEditPositionRu(data.positionRu);
            }
            if (data.passport) {
              setPassport(data.passport);
              setEditPassport(data.passport);
            }
            if (data.role) setRole(data.role);
            if (data.employeeId) setEmployeeId(data.employeeId);
            if (data.createdAt) {
              const date = data.createdAt.toDate
                ? data.createdAt.toDate()
                : new Date(data.createdAt);
              setRegistrationDate(
                date.toLocaleDateString("ru-RU", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                }),
              );
            }
          }
        } catch (error) {
          console.error("Error fetching profile:", error);
        }
      }
    };

    if (!loading && user) {
      fetchProfileData();
    }
  }, [user, loading]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      if (user?.uid) {
        await updateDoc(doc(db, "users", user.uid), {
          name: editName,
          surname: editSurname,
          email: editEmail,
          phone: editPhone,
          bio: editBio,
          birthDate: editBirthDate,
          address: editAddress,
          position: editPosition,
          positionRu: editPositionRu,
          passport: editPassport,
        });
      }

      setName(editName);
      setSurname(editSurname);
      setEmail(editEmail);
      setPhone(editPhone);
      setBio(editBio);
      setBirthDate(editBirthDate);
      setAddress(editAddress);
      setPosition(editPosition);
      setPositionRu(editPositionRu);
      setPassport(editPassport);
      setIsSaving(false);
      setIsEditing(false);
      setToastMessage("Профиль администратора обновлен!");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (error) {
      console.error("Error saving profile:", error);
      setIsSaving(false);
      setToastMessage("Ошибка при сохранении");
      setShowToast(true);
    }
  };

  const cancelEdit = () => {
    setEditName(name);
    setEditSurname(surname);
    setEditEmail(email);
    setEditPhone(phone);
    setEditBio(bio);
    setEditBirthDate(birthDate);
    setEditAddress(address);
    setEditPosition(position);
    setEditPositionRu(positionRu);
    setEditPassport(passport);
    setIsEditing(false);
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
          setAvatarUrl(base64String.trim());
          setToastMessage("Аватар администратора обновлен!");
          setShowToast(true);
          setTimeout(() => setShowToast(false), 3000);
        } catch (error) {
          console.error("Firestore Upload error:", error);
          setToastMessage("Ошибка загрузки");
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

  return (
    <div className="min-h-screen text-slate-800 dark:text-slate-100 font-nunito relative overflow-hidden pb-12 transition-colors duration-300">
      <AdHeader />

      <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-rose-500/10 blur-[120px] pointer-events-none z-0" />

      <div
        className={`fixed top-6 right-6 z-50 transition-all duration-300 transform ${showToast ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0 pointer-events-none"}`}
      >
        <div className="bg-white dark:bg-[#021E5D] border border-slate-200/60 dark:border-rose-500/30 text-rose-600 dark:text-rose-400 px-6 py-4 rounded-2xl shadow-xl backdrop-blur-xl flex items-center gap-3">
          <span className="font-semibold text-sm">{toastMessage}</span>
        </div>
      </div>

      <main className="relative z-10 mx-auto max-w-4xl px-4 py-8 md:px-6">
        <div className="w-full rounded-3xl bg-white/60 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 backdrop-blur-xl shadow-xl overflow-hidden mb-8">
          <div className="h-44 md:h-52 w-full relative bg-linear-to-r from-rose-600 via-pink-600 to-indigo-800 flex items-center overflow-hidden">
            <div className="absolute bottom-4 right-6 text-xs text-white/50 bg-black/30 backdrop-blur-md px-3 py-1 rounded-full border border-white/5">
              Admin ID: {employeeId}
            </div>
          </div>

          <div className="px-6 pb-6 pt-0 relative flex flex-col md:flex-row md:items-end justify-between gap-6 -mt-16 md:-mt-20">
            <div className="flex flex-col md:flex-row items-center md:items-end gap-5 text-center md:text-left">
              <div className="relative group w-32 h-32 md:w-36 md:h-36 rounded-full p-1.5 bg-linear-to-tr from-rose-400 via-pink-500 to-indigo-600 shadow-xl transition duration-300 hover:scale-[1.03]">
                <div className="w-full h-full rounded-full overflow-hidden border-4 border-slate-50 dark:border-[#021236] relative">
                  <Image
                    src={avatarUrl}
                    alt="Admin Avatar"
                    width={150}
                    height={150}
                    priority
                    className="object-cover w-full h-full transition duration-300 group-hover:brightness-[0.7]"
                  />
                </div>
                <button
                  onClick={() => setShowAvatarSelector(!showAvatarSelector)}
                  className="absolute inset-1.5 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer text-white"
                >
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </button>
              </div>
              <div className="mb-2">
                <div className="flex flex-col md:flex-row items-center gap-3">
                  <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                    {name} {surname}
                  </h2>
                  <span className="px-3 py-1 text-xs font-bold text-rose-600 dark:text-rose-300 bg-rose-500/10 border border-rose-400/30 rounded-full flex items-center gap-1.5 uppercase tracking-tighter">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                    Administrator
                  </span>
                </div>
                <p className="text-slate-600 dark:text-slate-400 text-sm mt-1 font-medium">
                  {email}
                </p>
              </div>
            </div>
            <div className="flex justify-center mb-2">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:bg-slate-200 dark:hover:bg-white/15 text-slate-800 dark:text-white font-semibold px-6 py-2.5 rounded-2xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
                >
                  <svg
                    className="w-4 h-4 text-rose-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  Редактировать админ-профиль
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={cancelEdit}
                    className="bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 px-4 py-2.5 rounded-2xl cursor-pointer"
                  >
                    Отмена
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="bg-linear-to-br from-rose-500 to-pink-600 text-white font-bold px-6 py-2.5 rounded-2xl shadow-lg flex items-center gap-2 cursor-pointer"
                  >
                    {isSaving ? "Сохранение..." : "Сохранить"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {showAvatarSelector && (
          <div className="w-full rounded-3xl bg-white/80 dark:bg-white/5 border border-rose-500/20 backdrop-blur-2xl shadow-2xl p-6 mb-8 animate-fadeIn relative z-20">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Загрузить фото администратора
              </h3>
              <button
                onClick={() => setShowAvatarSelector(false)}
                className="cursor-pointer"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="flex flex-wrap gap-4">
              <label
                htmlFor="admin-avatar-upload"
                className="relative w-24 h-24 rounded-2xl border-2 border-dashed border-rose-300 dark:border-white/20 flex flex-col items-center justify-center hover:border-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition cursor-pointer group"
              >
                <svg
                  className="w-8 h-8 text-slate-400 group-hover:text-rose-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                <span className="text-[10px] font-bold text-slate-400 group-hover:text-rose-500 uppercase mt-1">
                  Upload
                </span>
                <input
                  type="file"
                  id="admin-avatar-upload"
                  onChange={handleFileUpload}
                  accept="image/*"
                  className="hidden"
                />
              </label>
            </div>
          </div>
        )}

        <ProfileStats />

        <div className="w-full rounded-3xl bg-white/60 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 backdrop-blur-xl shadow-xl p-6 md:p-8">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 pb-3 border-b border-slate-200 dark:border-white/10 flex items-center gap-2">
            <span className="w-1.5 h-6 rounded-full bg-rose-500" />
            Панель управления администратора
          </h3>

          {!isEditing ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white/30 dark:bg-white/2 border border-slate-200/60 dark:border-white/5 p-4 rounded-2xl">
                  <span className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
                    Имя
                  </span>
                  <p className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                    {name}
                  </p>
                </div>
                <div className="bg-white/30 dark:bg-white/2 border border-slate-200/60 dark:border-white/5 p-4 rounded-2xl">
                  <span className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
                    Фамилия
                  </span>
                  <p className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                    {surname}
                  </p>
                </div>
                <div className="bg-white/30 dark:bg-white/2 border border-slate-200/60 dark:border-white/5 p-4 rounded-2xl">
                  <span className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
                    Доступ
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-lg font-bold text-slate-900 dark:text-white capitalize">
                      {role}
                    </p>
                    <span className="px-2 py-0.5 text-[10px] font-extrabold bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-400/20 rounded-md uppercase">
                      Полный доступ
                    </span>
                  </div>
                </div>
                <div className="bg-white/30 dark:bg-white/2 border border-slate-200/60 dark:border-white/5 p-4 rounded-2xl">
                  <span className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
                    Email
                  </span>
                  <p className="text-lg font-bold text-slate-900 dark:text-white mt-1 break-all">
                    {email}
                  </p>
                </div>
                <div className="bg-white/30 dark:bg-white/2 border border-slate-200/60 dark:border-white/5 p-4 rounded-2xl">
                  <span className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
                    Телефон
                  </span>
                  <p className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                    {phone}
                  </p>
                </div>
                <div className="bg-white/30 dark:bg-white/2 border border-slate-200/60 dark:border-white/5 p-4 rounded-2xl">
                  <span className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
                    Дата назначения
                  </span>
                  <p className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                    {registrationDate}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white/30 dark:bg-white/2 border border-slate-200/60 dark:border-white/5 p-4 rounded-2xl">
                  <span className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
                    Должность
                  </span>
                  <p className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                    {positionRu || position || "—"}
                  </p>
                  {positionRu && position && (
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">
                      {position}
                    </p>
                  )}
                </div>
                <div className="bg-white/30 dark:bg-white/2 border border-slate-200/60 dark:border-white/5 p-4 rounded-2xl">
                  <span className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
                    Дата рождения
                  </span>
                  <p className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                    {birthDate || "—"}
                  </p>
                </div>
                <div className="bg-white/30 dark:bg-white/2 border border-slate-200/60 dark:border-white/5 p-4 rounded-2xl">
                  <span className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
                    Паспорт
                  </span>
                  <p className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                    {passport || "—"}
                  </p>
                </div>
                <div className="bg-white/30 dark:bg-white/2 border border-slate-200/60 dark:border-white/5 p-4 rounded-2xl">
                  <span className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
                    Адрес
                  </span>
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mt-2 leading-relaxed">
                    {address || "—"}
                  </p>
                </div>
              </div>
              <div className="bg-white/30 dark:bg-white/2 border border-slate-200/60 dark:border-white/5 p-4 rounded-2xl">
                <span className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
                  Заметки администратора
                </span>
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mt-2 italic leading-relaxed">
                  &ldquo;{bio}&rdquo;
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-xs font-semibold tracking-wider text-slate-600 dark:text-slate-300 ml-1">
                    ИМЯ
                  </label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full rounded-2xl bg-white/85 dark:bg-white/5 border border-slate-200 dark:border-white/10 px-4 py-3.5 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-rose-500/50 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold tracking-wider text-slate-600 dark:text-slate-300 ml-1">
                    ФАМИЛИЯ
                  </label>
                  <input
                    type="text"
                    required
                    value={editSurname}
                    onChange={(e) => setEditSurname(e.target.value)}
                    className="w-full rounded-2xl bg-white/85 dark:bg-white/5 border border-slate-200 dark:border-white/10 px-4 py-3.5 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-rose-500/50 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold tracking-wider text-slate-600 dark:text-slate-300 ml-1">
                    EMAIL
                  </label>
                  <input
                    type="email"
                    required
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="w-full rounded-2xl bg-white/85 dark:bg-white/5 border border-slate-200 dark:border-white/10 px-4 py-3.5 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-rose-500/50 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold tracking-wider text-slate-600 dark:text-slate-300 ml-1">
                    ТЕЛЕФОН
                  </label>
                  <input
                    type="tel"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full rounded-2xl bg-white/85 dark:bg-white/5 border border-slate-200 dark:border-white/10 px-4 py-3.5 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-rose-500/50 transition-all"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-xs font-semibold tracking-wider text-slate-600 dark:text-slate-300 ml-1">
                    ДАТА РОЖДЕНИЯ
                  </label>
                  <input
                    type="date"
                    value={editBirthDate}
                    onChange={(e) => setEditBirthDate(e.target.value)}
                    className="w-full rounded-2xl bg-white/85 dark:bg-white/5 border border-slate-200 dark:border-white/10 px-4 py-3.5 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-rose-500/50 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold tracking-wider text-slate-600 dark:text-slate-300 ml-1">
                    ПАСПОРТ
                  </label>
                  <input
                    type="text"
                    value={editPassport}
                    onChange={(e) => setEditPassport(e.target.value)}
                    placeholder="AD 1234567"
                    className="w-full rounded-2xl bg-white/85 dark:bg-white/5 border border-slate-200 dark:border-white/10 px-4 py-3.5 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-rose-500/50 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold tracking-wider text-slate-600 dark:text-slate-300 ml-1">
                    ДОЛЖНОСТЬ
                  </label>
                  <input
                    type="text"
                    value={editPositionRu}
                    onChange={(e) => setEditPositionRu(e.target.value)}
                    placeholder="Грузчик"
                    className="w-full rounded-2xl bg-white/85 dark:bg-white/5 border border-slate-200 dark:border-white/10 px-4 py-3.5 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-rose-500/50 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold tracking-wider text-slate-600 dark:text-slate-300 ml-1">
                    LAVOZIM
                  </label>
                  <input
                    type="text"
                    value={editPosition}
                    onChange={(e) => setEditPosition(e.target.value)}
                    placeholder="Yuk tashuvchi"
                    className="w-full rounded-2xl bg-white/85 dark:bg-white/5 border border-slate-200 dark:border-white/10 px-4 py-3.5 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-rose-500/50 transition-all"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold tracking-wider text-slate-600 dark:text-slate-300 ml-1">
                  АДРЕС
                </label>
                <input
                  type="text"
                  value={editAddress}
                  onChange={(e) => setEditAddress(e.target.value)}
                  placeholder="г. Ташкент, Чиланзарский район"
                  className="w-full rounded-2xl bg-white/85 dark:bg-white/5 border border-slate-200 dark:border-white/10 px-4 py-3.5 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-rose-500/50 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold tracking-wider text-slate-600 dark:text-slate-300 ml-1">
                  О СЕБЕ
                </label>
                <textarea
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  rows={3}
                  className="w-full rounded-2xl bg-white/85 dark:bg-white/5 border border-slate-200 dark:border-white/10 px-4 py-3 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-rose-500/50 transition-all resize-none"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="bg-slate-100 dark:bg-white/5 px-5 py-3 rounded-2xl cursor-pointer"
                >
                  Отменить
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="bg-linear-to-br from-rose-500 to-pink-600 text-white font-bold px-8 py-3 rounded-2xl shadow-lg cursor-pointer"
                >
                  {isSaving ? "Сохранение..." : "Сохранить изменения"}
                </button>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminProfile;
