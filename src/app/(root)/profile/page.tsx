"use client"

import React, { useState, useEffect } from "react"
import AdHeader from "@/components/admin/header"
import Header from "@/components/user/header"
import Image from "next/image"

const Profile = () => {
    const role = "user"
    
    // Core Profile States (Default values in Russian to match login/register)
    const [name, setName] = useState("Иван")
    const [surname, setSurname] = useState("Иванов")
    const [email, setEmail] = useState("ivan@example.com")
    const [avatarUrl, setAvatarUrl] = useState("https://randomuser.me/api/portraits/men/1.jpg")
    const [phone, setPhone] = useState("+998 (90) 123-45-67")
    const [bio, setBio] = useState("Специалист по внедрению рабочих графиков и координации команд в WorkFlow.")
    
    // Interactive UI States
    const [isEditing, setIsEditing] = useState(false)
    const [activeTab, setActiveTab] = useState("overview") // "overview" | "activity"
    const [isSaving, setIsSaving] = useState(false)
    const [showToast, setShowToast] = useState(false)
    const [toastMessage, setToastMessage] = useState("")
    const [showAvatarSelector, setShowAvatarSelector] = useState(false)

    // Form inputs for editing state
    const [editName, setEditName] = useState(name)
    const [editSurname, setEditSurname] = useState(surname)
    const [editEmail, setEditEmail] = useState(email)
    const [editPhone, setEditPhone] = useState(phone)
    const [editBio, setEditBio] = useState(bio)

    // Load from localStorage on client render to persist user edits!
    useEffect(() => {
        if (typeof window !== "undefined") {
            const savedName = localStorage.getItem("profile_name")
            const savedSurname = localStorage.getItem("profile_surname")
            const savedEmail = localStorage.getItem("profile_email")
            const savedAvatar = localStorage.getItem("profile_avatar")
            const savedPhone = localStorage.getItem("profile_phone")
            const savedBio = localStorage.getItem("profile_bio")

            if (savedName) { setName(savedName); setEditName(savedName); }
            if (savedSurname) { setSurname(savedSurname); setEditSurname(savedSurname); }
            if (savedEmail) { setEmail(savedEmail); setEditEmail(savedEmail); }
            if (savedAvatar) setAvatarUrl(savedAvatar)
            if (savedPhone) { setPhone(savedPhone); setEditPhone(savedPhone); }
            if (savedBio) { setBio(savedBio); setEditBio(savedBio); }
        }
    }, [])

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault()
        setIsSaving(true)

        // Simulate modern premium saving with subtle micro-delay for realistic feedback
        setTimeout(() => {
            setName(editName)
            setSurname(editSurname)
            setEmail(editEmail)
            setPhone(editPhone)
            setBio(editBio)

            if (typeof window !== "undefined") {
                localStorage.setItem("profile_name", editName)
                localStorage.setItem("profile_surname", editSurname)
                localStorage.setItem("profile_email", editEmail)
                localStorage.setItem("profile_phone", editPhone)
                localStorage.setItem("profile_bio", editBio)
            }

            setIsSaving(false)
            setIsEditing(false)
            setToastMessage("Профиль успешно обновлен!")
            setShowToast(true)
            setTimeout(() => setShowToast(false), 3000)
        }, 1200)
    }

    const cancelEdit = () => {
        setEditName(name)
        setEditSurname(surname)
        setEditEmail(email)
        setEditPhone(phone)
        setEditBio(bio)
        setIsEditing(false)
    }

    const selectAvatar = (url: string) => {
        setAvatarUrl(url)
        if (typeof window !== "undefined") {
            localStorage.setItem("profile_avatar", url)
            window.dispatchEvent(new Event("profileUpdate"))
        }
        setShowAvatarSelector(false)
        setToastMessage("Аватар успешно обновлен!")
        setShowToast(true)
        setTimeout(() => setShowToast(false), 3000)
    }

    const avatarPresets = [
        "https://randomuser.me/api/portraits/men/1.jpg",
        "https://randomuser.me/api/portraits/women/1.jpg",
        "https://randomuser.me/api/portraits/men/10.jpg",
        "https://randomuser.me/api/portraits/women/10.jpg",
        "https://randomuser.me/api/portraits/men/32.jpg",
        "https://randomuser.me/api/portraits/women/32.jpg",
        "https://randomuser.me/api/portraits/men/44.jpg",
        "https://randomuser.me/api/portraits/women/44.jpg",
        "https://randomuser.me/api/portraits/men/85.jpg",
        "https://randomuser.me/api/portraits/women/85.jpg"
    ]

    return (
        <div className="min-h-screen text-slate-100 font-nunito relative overflow-hidden pb-12">
            {/* Nav Header */}
            {role === "user" ? <Header /> : <AdHeader />}

            {/* Glowing Ambient Background Elements */}
            <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-sky-500/10 blur-[120px] pointer-events-none z-0" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-blue-600/10 blur-[150px] pointer-events-none z-0" />

            {/* Notification Toast */}
            <div className={`fixed top-6 right-6 z-50 transition-all duration-300 transform ${showToast ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0 pointer-events-none"}`}>
                <div className="bg-[#021E5D] border border-emerald-500/30 text-emerald-400 px-6 py-4 rounded-2xl shadow-[0_15px_30px_rgba(0,0,0,0.4)] backdrop-blur-xl flex items-center gap-3">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-300">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                    </span>
                    <span className="font-semibold text-sm">{toastMessage}</span>
                </div>
            </div>

            <main className="relative z-10 mx-auto max-w-4xl px-4 py-8 md:px-6">
                
                {/* Profile Hero Header Card */}
                <div className="w-full rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-[0_25px_50px_rgba(0,0,0,0.35)] overflow-hidden mb-8">
                    
                    {/* Glowing Banner Background */}
                    <div className="h-44 md:h-52 w-full relative bg-gradient-to-r from-sky-600 via-indigo-600 to-blue-800 flex items-center overflow-hidden">
                        <div className="absolute inset-0 opacity-30">
                            <div className="absolute top-6 left-12 w-24 h-24 rounded-full bg-white/20 blur-xl animate-pulse" />
                            <div className="absolute bottom-4 right-16 w-36 h-36 rounded-full bg-sky-400/20 blur-2xl animate-pulse delay-75" />
                        </div>
                        <div className="absolute inset-0 bg-black/10" />
                        <div className="absolute bottom-4 right-6 text-xs text-white/50 bg-black/30 backdrop-blur-md px-3 py-1 rounded-full border border-white/5">
                            ID: WF-94820
                        </div>
                    </div>

                    {/* Profile Information Overview Row */}
                    <div className="px-6 pb-6 pt-0 relative flex flex-col md:flex-row md:items-end justify-between gap-6 -mt-16 md:-mt-20">
                        <div className="flex flex-col md:flex-row items-center md:items-end gap-5 text-center md:text-left">
                            
                            {/* Avatar container with interactive hover selector trigger */}
                            <div className="relative group w-32 h-32 md:w-36 md:h-36 rounded-full p-1.5 bg-gradient-to-tr from-sky-400 via-indigo-500 to-blue-600 shadow-[0_10px_35px_rgba(14,165,233,0.3)] transition duration-300 hover:scale-[1.03]">
                                <div className="w-full h-full rounded-full overflow-hidden border-4 border-[#021236] relative">
                                    <Image 
                                        src={avatarUrl} 
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
                                    <svg className="w-8 h-8 drop-shadow-md" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </button>
                            </div>

                            {/* Name, surname, and Role Badge */}
                            <div className="mb-2">
                                <div className="flex flex-col md:flex-row items-center gap-3">
                                    <h2 className="text-3xl font-bold text-white tracking-tight leading-tight">
                                        {name} {surname}
                                    </h2>
                                    <span className="px-3 py-1 text-xs font-bold tracking-wider text-sky-300 bg-sky-500/10 border border-sky-400/30 rounded-full flex items-center gap-1.5 uppercase shadow-inner">
                                        <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
                                        {role}
                                    </span>
                                </div>
                                <p className="text-slate-400 text-sm mt-1 max-w-md font-medium">
                                    {email}
                                </p>
                            </div>
                        </div>

                        {/* Top Action buttons */}
                        <div className="flex justify-center mb-2">
                            {!isEditing ? (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="bg-white/5 border border-white/10 hover:border-white/30 hover:bg-white/15 text-white font-semibold px-6 py-2.5 rounded-2xl shadow-md transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98] flex items-center gap-2 cursor-pointer"
                                >
                                    <svg className="w-4 h-4 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                    Редактировать
                                </button>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={cancelEdit}
                                        className="bg-white/5 border border-white/5 hover:bg-white/10 text-slate-300 font-semibold px-4 py-2.5 rounded-2xl transition duration-150 active:scale-[0.98] cursor-pointer"
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
                                                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                </svg>
                                                Сохранение...
                                            </>
                                        ) : (
                                            <>
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
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
                    <div className="w-full rounded-3xl bg-white/5 border border-sky-500/30 backdrop-blur-2xl shadow-[0_20px_40px_rgba(0,0,0,0.5)] p-6 mb-8 transition-all duration-300 animate-fadeIn relative z-20">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <svg className="w-5 h-5 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                Выберите новый аватар
                            </h3>
                            <button 
                                onClick={() => setShowAvatarSelector(false)} 
                                className="text-slate-400 hover:text-white cursor-pointer"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="grid grid-cols-5 md:grid-cols-10 gap-3">
                            {avatarPresets.map((preset, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => selectAvatar(preset)}
                                    className={`relative w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden border-2 cursor-pointer transition duration-200 hover:scale-110 ${avatarUrl === preset ? "border-sky-500 scale-105 shadow-[0_0_15px_rgba(14,165,233,0.5)]" : "border-white/10 hover:border-sky-400/50"}`}
                                >
                                    <Image src={preset} alt={`Preset ${idx + 1}`} fill className="object-cover" />
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Dashboard Stats Row to improve visual layout density */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition duration-300 flex flex-col items-center justify-center text-center backdrop-blur-md shadow-lg">
                        <span className="text-2xl md:text-3xl font-extrabold text-sky-400 tracking-tight">24</span>
                        <span className="text-[11px] md:text-xs font-semibold text-slate-400 mt-1 uppercase tracking-wider">Выполнено задач</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition duration-300 flex flex-col items-center justify-center text-center backdrop-blur-md shadow-lg">
                        <span className="text-2xl md:text-3xl font-extrabold text-indigo-400 tracking-tight">18</span>
                        <span className="text-[11px] md:text-xs font-semibold text-slate-400 mt-1 uppercase tracking-wider">Отработано смен</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition duration-300 flex flex-col items-center justify-center text-center backdrop-blur-md shadow-lg">
                        <span className="text-2xl md:text-3xl font-extrabold text-emerald-400 tracking-tight">98%</span>
                        <span className="text-[11px] md:text-xs font-semibold text-slate-400 mt-1 uppercase tracking-wider">Эффективность</span>
                    </div>
                </div>

                {/* Main Content Layout with Sidebar Tabs and Main details Card */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
                    
                    {/* Navigation Sidebar Tabs */}
                    <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-2 md:pb-0 scrollbar-none z-10">
                        <button
                            onClick={() => setActiveTab("overview")}
                            className={`flex items-center justify-center md:justify-start gap-3 px-5 py-3.5 rounded-2xl font-bold text-sm transition-all duration-200 whitespace-nowrap cursor-pointer w-full ${activeTab === "overview" ? "bg-sky-500/10 border border-sky-500/30 text-sky-300 shadow-[0_5px_15px_rgba(14,165,233,0.1)]" : "text-slate-400 hover:text-slate-200 hover:bg-white/5"}`}
                        >
                            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            Личные данные
                        </button>
                        <button
                            onClick={() => setActiveTab("activity")}
                            className={`flex items-center justify-center md:justify-start gap-3 px-5 py-3.5 rounded-2xl font-bold text-sm transition-all duration-200 whitespace-nowrap cursor-pointer w-full ${activeTab === "activity" ? "bg-sky-500/10 border border-sky-500/30 text-sky-300 shadow-[0_5px_15px_rgba(14,165,233,0.1)]" : "text-slate-400 hover:text-slate-200 hover:bg-white/5"}`}
                        >
                            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                            </svg>
                            Активность
                        </button>
                    </div>

                    {/* Main Card with Details based on the Active Tab */}
                    <div className="md:col-span-3 w-full rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-xl p-6 md:p-8">
                        
                        {/* TAB 1: OVERVIEW & PERSONAL INFO */}
                        {activeTab === "overview" && (
                            <div>
                                <h3 className="text-xl font-bold text-white mb-6 pb-3 border-b border-white/10 flex items-center gap-2">
                                    <span className="w-1.5 h-6 rounded-full bg-sky-500" />
                                    Сведения о сотруднике
                                </h3>

                                {!isEditing ? (
                                    /* Display View Mode */
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-1 bg-white/[0.02] border border-white/5 p-4 rounded-2xl">
                                                <span className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">Имя</span>
                                                <p className="text-lg font-semibold text-white mt-1">{name}</p>
                                            </div>
                                            <div className="space-y-1 bg-white/[0.02] border border-white/5 p-4 rounded-2xl">
                                                <span className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">Фамилия</span>
                                                <p className="text-lg font-semibold text-white mt-1">{surname}</p>
                                            </div>
                                            <div className="space-y-1 bg-white/[0.02] border border-white/5 p-4 rounded-2xl">
                                                <span className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">Роль в системе</span>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <p className="text-lg font-semibold text-white capitalize">{role}</p>
                                                    <span className="px-2 py-0.5 text-[10px] font-extrabold bg-blue-500/20 text-blue-300 border border-blue-400/20 rounded-md">Базовый доступ</span>
                                                </div>
                                            </div>
                                            <div className="space-y-1 bg-white/[0.02] border border-white/5 p-4 rounded-2xl">
                                                <span className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">Электронная почта</span>
                                                <p className="text-lg font-semibold text-white mt-1 break-all">{email}</p>
                                            </div>
                                            <div className="space-y-1 bg-white/[0.02] border border-white/5 p-4 rounded-2xl">
                                                <span className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">Номер телефона</span>
                                                <p className="text-lg font-semibold text-white mt-1">{phone}</p>
                                            </div>
                                            <div className="space-y-1 bg-white/[0.02] border border-white/5 p-4 rounded-2xl">
                                                <span className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">Дата регистрации</span>
                                                <p className="text-lg font-semibold text-white mt-1">28 мая 2026</p>
                                            </div>
                                        </div>

                                        <div className="space-y-1 bg-white/[0.02] border border-white/5 p-4 rounded-2xl">
                                            <span className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">О себе</span>
                                            <p className="text-sm font-medium text-slate-300 mt-2 leading-relaxed italic">
                                                &ldquo;{bio}&rdquo;
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    /* Interactive Edit Form Mode */
                                    <form onSubmit={handleSave} className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                            <div className="space-y-2">
                                                <label className="text-xs font-semibold tracking-wider text-slate-300 ml-1">ИМЯ</label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={editName}
                                                    onChange={(e) => setEditName(e.target.value)}
                                                    className="w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-3.5 text-white placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500/55 transition-all duration-200"
                                                    placeholder="Введите имя"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-xs font-semibold tracking-wider text-slate-300 ml-1">ФАМИЛИЯ</label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={editSurname}
                                                    onChange={(e) => setEditSurname(e.target.value)}
                                                    className="w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-3.5 text-white placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500/55 transition-all duration-200"
                                                    placeholder="Введите фамилию"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-xs font-semibold tracking-wider text-slate-300 ml-1">ЭЛЕКТРОННАЯ ПОЧТА</label>
                                                <input
                                                    type="email"
                                                    required
                                                    value={editEmail}
                                                    onChange={(e) => setEditEmail(e.target.value)}
                                                    className="w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-3.5 text-white placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500/55 transition-all duration-200"
                                                    placeholder="example@mail.com"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-xs font-semibold tracking-wider text-slate-300 ml-1">НОМЕР ТЕЛЕФОНА</label>
                                                <input
                                                    type="tel"
                                                    value={editPhone}
                                                    onChange={(e) => setEditPhone(e.target.value)}
                                                    className="w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-3.5 text-white placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500/55 transition-all duration-200"
                                                    placeholder="+998"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-semibold tracking-wider text-slate-300 ml-1">РОЛЬ В СИСТЕМЕ (ФИКСИРОВАННАЯ)</label>
                                            <div className="w-full rounded-2xl bg-white/5 border border-white/5 px-4 py-3.5 text-slate-400 select-none flex items-center justify-between">
                                                <span className="capitalize font-semibold">{role}</span>
                                                <span className="text-[11px] font-bold text-sky-400/80 bg-sky-500/10 px-3 py-1 rounded-full border border-sky-400/20 uppercase tracking-widest">
                                                    Изменение заблокировано администратором
                                                </span>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-semibold tracking-wider text-slate-300 ml-1">О СЕБЕ</label>
                                            <textarea
                                                value={editBio}
                                                onChange={(e) => setEditBio(e.target.value)}
                                                rows={3}
                                                className="w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-3 text-white placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500/55 transition-all duration-200 resize-none leading-relaxed"
                                                placeholder="Расскажите немного о своей роли..."
                                            />
                                        </div>

                                        <div className="flex justify-end gap-2 pt-2">
                                            <button
                                                type="button"
                                                onClick={cancelEdit}
                                                className="bg-white/5 border border-white/5 hover:bg-white/10 text-slate-300 font-semibold px-5 py-3 rounded-2xl transition duration-150 active:scale-[0.98] cursor-pointer"
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
                        )}

                        {/* TAB 2: SYSTEM ACTIVITY */}
                        {activeTab === "activity" && (
                            <div>
                                <h3 className="text-xl font-bold text-white mb-4 pb-3 border-b border-white/10 flex items-center gap-2">
                                    <span className="w-1.5 h-6 rounded-full bg-indigo-500" />
                                    Журнал рабочей активности
                                </h3>
                                <p className="text-sm text-slate-400 mb-6">
                                    История последних выходов на смену, выполненных задач и зафиксированных рабочих часов.
                                </p>

                                <div className="space-y-4">
                                    {/* Activity Timeline List */}
                                    <div className="border-l-2 border-white/10 ml-3 space-y-6 py-2">
                                        <div className="relative pl-7">
                                            <span className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-emerald-500 ring-4 ring-[#021236] flex items-center justify-center" />
                                            <div className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl">
                                                <div className="flex justify-between items-start">
                                                    <h4 className="text-sm font-bold text-white">Смена завершена успешно</h4>
                                                    <span className="text-[10px] font-semibold text-slate-400 bg-white/5 px-2 py-0.5 rounded">Вчера, 18:30</span>
                                                </div>
                                                <p className="text-xs text-slate-400 mt-1">Отработано часов: 8.0. Отмечен уход из офиса (Технопарк А3).</p>
                                            </div>
                                        </div>
                                        <div className="relative pl-7">
                                            <span className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-sky-500 ring-4 ring-[#021236]" />
                                            <div className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl">
                                                <div className="flex justify-between items-start">
                                                    <h4 className="text-sm font-bold text-white">Выполнение задачи: Координация спринта</h4>
                                                    <span className="text-[10px] font-semibold text-slate-400 bg-white/5 px-2 py-0.5 rounded">27 мая, 14:15</span>
                                                </div>
                                                <p className="text-xs text-slate-400 mt-1">Задача №449 переведена в статус &quot;Выполнено&quot;.</p>
                                            </div>
                                        </div>
                                        <div className="relative pl-7">
                                            <span className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-indigo-500 ring-4 ring-[#021236]" />
                                            <div className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl">
                                                <div className="flex justify-between items-start">
                                                    <h4 className="text-sm font-bold text-white">Вход в систему зафиксирован</h4>
                                                    <span className="text-[10px] font-semibold text-slate-400 bg-white/5 px-2 py-0.5 rounded">26 мая, 08:58</span>
                                                </div>
                                                <p className="text-xs text-slate-400 mt-1">Авторизация через веб-интерфейс, IP-адрес: 192.168.1.14.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    )
}

export default Profile