"use client";

import React, { useState, useEffect, useRef } from "react";
import AdHeader from "@/components/admin/header";
import Header from "@/components/user/header";
import Image from "next/image";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "@/firebase";
import { useRouter } from "next/navigation";
import { doc, getDoc, updateDoc } from "firebase/firestore";

const Profile = () => {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();

  // Core Profile States
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("user");
  const [avatarUrl, setAvatarUrl] = useState("/user-logo.png");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");
  const [employeeId, setEmployeeId] = useState("...");
  const [registrationDate, setRegistrationDate] = useState("...");

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

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

  // Fetch profile data from Firestore on mount
  useEffect(() => {
    const fetchProfileData = async () => {
      if (user?.uid) {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            if (data.name) {
              setName(data.name);
              setEditName(data.name);
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
        });
      }

      setName(editName);
      setSurname(editSurname);
      setEmail(editEmail);
      setPhone(editPhone);
      setBio(editBio);
      setIsSaving(false);
      setIsEditing(false);
      setToastMessage("Профиль успешно обновлен!");
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
    setIsEditing(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 2MB size limit check
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
        try {
          await updateDoc(doc(db, "users", user.uid), {
            avatarUrl: base64String,
          });
          setAvatarUrl(base64String.trim());
          setToastMessage("Аватар успешно загружен!");
          setShowToast(true);
          setTimeout(() => setShowToast(false), 3000);
        } catch (error) {
          console.error("Firestore Upload error:", error);
          setToastMessage("Ошибка: файл слишком велик для базы данных.");
          setShowToast(true);
          setTimeout(() => setShowToast(false), 3000);
        }
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen text-slate-800 dark:text-slate-100 font-nunito relative overflow-hidden pb-12 transition-colors duration-300">
      {/* Nav Header */}
      {role === "user" ? <Header /> : <AdHeader />}

      {/* Glowing Ambient Background Elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-sky-500/10 blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-blue-600/10 blur-[150px] pointer-events-none z-0" />

      {/* Notification Toast */}
      <div
        className={`fixed top-6 right-6 z-50 transition-all duration-300 transform ${showToast ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0 pointer-events-none"}`}
      >
        <div className="bg-white dark:bg-[#021E5D] border border-slate-200/60 dark:border-emerald-500/30 text-emerald-600 dark:text-emerald-400 px-6 py-4 rounded-2xl shadow-[0_15px_30px_rgba(0,0,0,0.1)] dark:shadow-[0_15px_30px_rgba(0,0,0,0.4)] backdrop-blur-xl flex items-center gap-3">
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-300">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </span>
          <span className="font-semibold text-sm">{toastMessage}</span>
        </div>
      </div>

      <main className="relative z-10 mx-auto max-w-4xl px-4 py-8 md:px-6">
        {/* Profile Hero Header Card */}
        <div className="w-full rounded-3xl bg-white/60 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 backdrop-blur-xl shadow-[0_25px_50px_rgba(0,0,0,0.06)] dark:shadow-[0_25px_50px_rgba(0,0,0,0.35)] overflow-hidden mb-8 transition-all duration-300">
          {/* Glowing Banner Background */}
          <div className="h-44 md:h-52 w-full relative bg-linear-to-r from-sky-600 via-indigo-600 to-blue-800 flex items-center overflow-hidden">
            <div className="absolute inset-0 opacity-30">
              <div className="absolute top-6 left-12 w-24 h-24 rounded-full bg-white/20 blur-xl animate-pulse" />
              <div className="absolute bottom-4 right-16 w-36 h-36 rounded-full bg-sky-400/20 blur-2xl animate-pulse delay-75" />
            </div>
            <div className="absolute inset-0 bg-black/10" />
            <div className="absolute bottom-4 right-6 text-xs text-white/50 bg-black/30 backdrop-blur-md px-3 py-1 rounded-full border border-white/5">
              ID: {employeeId}
            </div>
          </div>

          {/* Profile Information Overview Row */}
          <div className="px-6 pb-6 pt-0 relative flex flex-col md:flex-row md:items-end justify-between gap-6 -mt-16 md:-mt-20">
            <div className="flex flex-col md:flex-row items-center md:items-end gap-5 text-center md:text-left">
              {/* Avatar container with interactive hover selector trigger */}
              <div className="relative group w-32 h-32 md:w-36 md:h-36 rounded-full p-1.5 bg-linear-to-tr from-sky-400 via-indigo-500 to-blue-600 shadow-[0_10px_35px_rgba(14,165,233,0.2)] dark:shadow-[0_10px_35px_rgba(14,165,233,0.3)] transition duration-300 hover:scale-[1.03]">
                <div className="w-full h-full rounded-full overflow-hidden border-4 border-slate-50 dark:border-[#021236] relative transition-colors duration-300">
                  <Image
                    src={typeof avatarUrl === "string" ? avatarUrl.trim() : avatarUrl}
                    alt="Profile Avatar"
                    width={150}
                    height={150}
                    priority
                    className="object-cover w-full h-full transition duration-300 group-hover:brightness-[0.7]"
                  />
                </div>
                {/* Camera overlay hover button */}
                <button
                  onClick={() => setShowAvatarSelector(!showAvatarSelector)}
                  className="absolute inset-1.5 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer text-white"
                  title="Сменить аватар"
                >
                  <svg
                    className="w-8 h-8 drop-shadow-md"
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

              {/* Name, surname, and Role Badge */}
              <div className="mb-2">
                <div className="flex flex-col md:flex-row items-center gap-3">
                  <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight leading-tight">
                    {name} {surname}
                  </h2>
                  <span className="px-3 py-1 text-xs font-bold tracking-wider text-sky-600 dark:text-sky-300 bg-sky-500/10 border border-sky-450/20 dark:border-sky-400/30 rounded-full flex items-center gap-1.5 uppercase shadow-inner">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-550 dark:bg-sky-400 animate-pulse" />
                    {role}
                  </span>
                </div>
                <p className="text-slate-600 dark:text-slate-400 text-sm mt-1 max-w-md font-medium">
                  {email}
                </p>
              </div>
            </div>

            {/* Top Action buttons */}
            <div className="flex justify-center mb-2">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/30 hover:bg-slate-200 dark:hover:bg-white/15 text-slate-800 dark:text-white font-semibold px-6 py-2.5 rounded-2xl shadow-md transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98] flex items-center gap-2 cursor-pointer"
                >
                  <svg
                    className="w-4 h-4 text-sky-650 dark:text-sky-400"
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
                  Редактировать
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={cancelEdit}
                    className="bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 font-semibold px-4 py-2.5 rounded-2xl transition duration-150 active:scale-[0.98] cursor-pointer"
                  >
                    Отмена
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="bg-linear-to-br from-sky-500 to-blue-600 hover:opacity-90 disabled:opacity-50 text-white font-bold px-6 py-2.5 rounded-2xl shadow-lg shadow-sky-500/20 transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98] flex items-center gap-2 cursor-pointer"
                  >
                    {isSaving ? (
                      <>
                        <svg
                          className="animate-spin h-4 w-4 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Сохранение...
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2.5}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        Сохранить
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Avatar Picker Modal Dropdown (appears beautifully right under banner when avatar clicked) */}
        {showAvatarSelector && (
          <div className="w-full rounded-3xl bg-white/80 dark:bg-white/5 border border-sky-500/20 dark:border-sky-500/30 backdrop-blur-2xl shadow-[0_20px_40px_rgba(0,0,0,0.06)] dark:shadow-[0_20px_40px_rgba(0,0,0,0.5)] p-6 mb-8 transition-all duration-300 animate-fadeIn relative z-20">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-sky-500 dark:text-sky-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                Выберите новый аватар
              </h3>
              <button
                onClick={() => setShowAvatarSelector(false)}
                className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white cursor-pointer"
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
              <button
                onClick={() => fileInputRef.current?.click()}
                className="relative w-24 h-24 rounded-2xl border-2 border-dashed border-slate-300 dark:border-white/20 flex flex-col items-center justify-center hover:border-sky-500 hover:bg-sky-50 dark:hover:bg-sky-500/10 transition duration-200 cursor-pointer group/upload"
              >
                <svg className="w-8 h-8 text-slate-400 group-hover/upload:text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span className="text-[10px] font-bold text-slate-400 group-hover/upload:text-sky-500 uppercase mt-1">Загрузить</span>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  className="hidden"
                />
              </button>
            </div>
          </div>
        )}

        {/* Dashboard Stats Row to improve visual layout density */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="p-4 rounded-2xl bg-white/60 dark:bg-white/5 border border-slate-200/60 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/10 transition duration-300 flex flex-col items-center justify-center text-center backdrop-blur-md shadow-md dark:shadow-lg">
            <span className="text-2xl md:text-3xl font-extrabold text-sky-500 dark:text-sky-400 tracking-tight">
              24
            </span>
            <span className="text-[11px] md:text-xs font-semibold text-slate-600 dark:text-slate-400 mt-1 uppercase tracking-wider">
              Выполнено задач
            </span>
          </div>
          <div className="p-4 rounded-2xl bg-white/60 dark:bg-white/5 border border-slate-200/60 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/10 transition duration-300 flex flex-col items-center justify-center text-center backdrop-blur-md shadow-md dark:shadow-lg">
            <span className="text-2xl md:text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 tracking-tight">
              18
            </span>
            <span className="text-[11px] md:text-xs font-semibold text-slate-600 dark:text-slate-400 mt-1 uppercase tracking-wider">
              Отработано смен
            </span>
          </div>
          <div className="p-4 rounded-2xl bg-white/60 dark:bg-white/5 border border-slate-200/60 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/10 transition duration-300 flex flex-col items-center justify-center text-center backdrop-blur-md shadow-md dark:shadow-lg">
            <span className="text-2xl md:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 tracking-tight">
              98%
            </span>
            <span className="text-[11px] md:text-xs font-semibold text-slate-600 dark:text-slate-400 mt-1 uppercase tracking-wider">
              Эффективность
            </span>
          </div>
        </div>

        {/* Main Content Card */}
        <div className="w-full rounded-3xl bg-white/60 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 backdrop-blur-xl shadow-[0_20px_40px_rgba(0,0,0,0.04)] dark:shadow-xl p-6 md:p-8 transition-all duration-300">
          {/* PERSONAL INFO */}
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 pb-3 border-b border-slate-200 dark:border-white/10 flex items-center gap-2">
              <span className="w-1.5 h-6 rounded-full bg-sky-500" />
              Сведения о сотруднике
            </h3>

            {!isEditing ? (
              /* Display View Mode */
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1 bg-white/30 dark:bg-white/2 border border-slate-200/60 dark:border-white/5 p-4 rounded-2xl">
                    <span className="text-[11px] font-semibold tracking-wider text-slate-500 dark:text-slate-400 uppercase">
                      Имя
                    </span>
                    <p className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                      {name}
                    </p>
                  </div>
                  <div className="space-y-1 bg-white/30 dark:bg-white/2 border border-slate-200/60 dark:border-white/5 p-4 rounded-2xl">
                    <span className="text-[11px] font-semibold tracking-wider text-slate-500 dark:text-slate-400 uppercase">
                      Фамилия
                    </span>
                    <p className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                      {surname}
                    </p>
                  </div>
                  <div className="space-y-1 bg-white/30 dark:bg-white/2 border border-slate-200/60 dark:border-white/5 p-4 rounded-2xl">
                    <span className="text-[11px] font-semibold tracking-wider text-slate-500 dark:text-slate-400 uppercase">
                      Роль в системе
                    </span>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-lg font-bold text-slate-900 dark:text-white capitalize">
                        {role}
                      </p>
                      <span className="px-2 py-0.5 text-[10px] font-extrabold bg-blue-500/20 text-blue-600 dark:text-blue-300 border border-blue-400/20 rounded-md">
                        Базовый доступ
                      </span>
                    </div>
                  </div>
                  <div className="space-y-1 bg-white/30 dark:bg-white/2 border border-slate-200/60 dark:border-white/5 p-4 rounded-2xl">
                    <span className="text-[11px] font-semibold tracking-wider text-slate-500 dark:text-slate-400 uppercase">
                      Электронная почта
                    </span>
                    <p className="text-lg font-bold text-slate-900 dark:text-white mt-1 break-all">
                      {email}
                    </p>
                  </div>
                  <div className="space-y-1 bg-white/30 dark:bg-white/2 border border-slate-200/60 dark:border-white/5 p-4 rounded-2xl">
                    <span className="text-[11px] font-semibold tracking-wider text-slate-500 dark:text-slate-400 uppercase">
                      Номер телефона
                    </span>
                    <p className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                      {phone}
                    </p>
                  </div>
                  <div className="space-y-1 bg-white/30 dark:bg-white/2 border border-slate-200/60 dark:border-white/5 p-4 rounded-2xl">
                    <span className="text-[11px] font-semibold tracking-wider text-slate-500 dark:text-slate-400 uppercase">
                      Дата регистрации
                    </span>
                    <p className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                      {registrationDate}
                    </p>
                  </div>
                </div>

                <div className="space-y-1 bg-white/30 dark:bg-white/2 border border-slate-200/60 dark:border-white/5 p-4 rounded-2xl">
                  <span className="text-[11px] font-semibold tracking-wider text-slate-500 dark:text-slate-400 uppercase">
                    О себе
                  </span>
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mt-2 leading-relaxed italic">
                    &ldquo;{bio}&rdquo;
                  </p>
                </div>
              </div>
            ) : (
              /* Interactive Edit Form Mode */
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
                      className="w-full rounded-2xl bg-white/85 dark:bg-white/5 border border-slate-200 dark:border-white/10 px-4 py-3.5 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-sky-500/30 dark:focus:ring-sky-500/50 focus:border-sky-500/50 dark:focus:border-sky-500/50 transition-all duration-200"
                      placeholder="Введите имя"
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
                      className="w-full rounded-2xl bg-white/85 dark:bg-white/5 border border-slate-200 dark:border-white/10 px-4 py-3.5 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-sky-500/30 dark:focus:ring-sky-500/50 focus:border-sky-500/50 dark:focus:border-sky-500/50 transition-all duration-200"
                      placeholder="Введите фамилию"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold tracking-wider text-slate-600 dark:text-slate-300 ml-1">
                      ЭЛЕКТРОННАЯ ПОЧТА
                    </label>
                    <input
                      type="email"
                      required
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                      className="w-full rounded-2xl bg-white/85 dark:bg-white/5 border border-slate-200 dark:border-white/10 px-4 py-3.5 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-sky-500/30 dark:focus:ring-sky-500/50 focus:border-sky-500/50 dark:focus:border-sky-500/50 transition-all duration-200"
                      placeholder="example@mail.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold tracking-wider text-slate-600 dark:text-slate-300 ml-1">
                      НОМЕР ТЕЛЕФОНА
                    </label>
                    <input
                      type="tel"
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      className="w-full rounded-2xl bg-white/85 dark:bg-white/5 border border-slate-200 dark:border-white/10 px-4 py-3.5 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-sky-500/30 dark:focus:ring-sky-500/50 focus:border-sky-500/50 dark:focus:border-sky-500/50 transition-all duration-200"
                      placeholder="+998"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold tracking-wider text-slate-600 dark:text-slate-300 ml-1">
                    РОЛЬ В СИСТЕМЕ (ФИКСИРОВАННАЯ)
                  </label>
                  <div className="w-full rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 px-4 py-3.5 text-slate-600 dark:text-slate-400 select-none flex items-center justify-between">
                    <span className="capitalize font-semibold">{role}</span>
                    <span className="text-[10px] font-bold text-sky-600 dark:text-sky-400/80 bg-sky-500/10 px-3 py-1 rounded-full border border-sky-400/20 uppercase tracking-widest">
                      Изменение заблокировано администратором
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold tracking-wider text-slate-600 dark:text-slate-300 ml-1">
                    О СЕБЕ
                  </label>
                  <textarea
                    value={editBio}
                    onChange={(e) => setEditBio(e.target.value)}
                    rows={3}
                    className="w-full rounded-2xl bg-white/85 dark:bg-white/5 border border-slate-200 dark:border-white/10 px-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-sky-500/30 dark:focus:ring-sky-500/50 focus:border-sky-500/50 dark:focus:border-sky-500/50 transition-all duration-200 resize-none leading-relaxed"
                    placeholder="Расскажите немного о своей роли..."
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 font-semibold px-5 py-3 rounded-2xl transition duration-150 active:scale-[0.98] cursor-pointer"
                  >
                    Отменить
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="bg-linear-to-br from-sky-500 to-blue-600 hover:opacity-90 disabled:opacity-50 text-white font-bold px-8 py-3 rounded-2xl shadow-lg shadow-sky-500/20 transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98] flex items-center gap-2 cursor-pointer"
                  >
                    {isSaving ? "Сохранение..." : "Сохранить изменения"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
