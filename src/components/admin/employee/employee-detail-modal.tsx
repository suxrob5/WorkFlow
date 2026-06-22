"use client";
import React, { useEffect } from "react";
import { STATUS_CONFIG, type ShiftStatus } from "@/data/admin";
interface EmployeeDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    employee: {
        id: string | number;
        userName: string;
        dept: string;
        shift: string;
        days: string[];
        status: string;
        avatar?: string;
        email?: string;
        phone?: string;
        birthDate?: string;
        address?: string;
        passport?: string;
    } | null;
}
const EmployeeDetailModal = ({
    isOpen,
    onClose,
    employee,
}: EmployeeDetailModalProps) => {
    // Prevent background scrolling when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);
    if (!isOpen || !employee) return null;
    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };
    const statusLabel =
        STATUS_CONFIG[employee.status as ShiftStatus]?.label || employee.status;
    const statusColor =
        STATUS_CONFIG[employee.status as ShiftStatus]?.color ||
        "border-slate-500/20 bg-slate-500/10 text-slate-500";
    return (
        <div
            onClick={handleBackdropClick}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md dark:bg-black/60 transition-opacity duration-300 animate-fadeIn"
        >
            <div className="w-full max-w-xl rounded-3xl border border-slate-200/60 dark:border-white/10 bg-white/95 dark:bg-[#021236]/95 backdrop-blur-2xl p-6 shadow-2xl space-y-6 relative overflow-hidden transition-all duration-300">

                {/* Glow ambient background effects */}
                <div className="absolute top-[-20%] left-[-20%] w-48 h-48 rounded-full bg-sky-500/10 blur-[60px] pointer-events-none" />
                <div className="absolute bottom-[-20%] right-[-20%] w-48 h-48 rounded-full bg-blue-600/10 blur-[60px] pointer-events-none" />
                {/* Close Button */}
             <div className="flex items-center justify-between">
                   <h1 className="text-white">.</h1>
                   <button
                    onClick={onClose}
                    className="h-10 w-10 rounded-2xl bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors font-bold z-10 cursor-pointer"
                >
                    ✕
                </button>
             </div>
                {/* Profile Header */}
                <div className="flex flex-col items-center text-center space-y-3 pt-2 relative z-10">
                    <div className="relative w-24 h-24 rounded-full bg-linear-to-br from-sky-400 to-blue-600 p-1 shadow-lg shadow-sky-500/20">
                        <div className="w-full h-full rounded-full bg-white dark:bg-slate-900 overflow-hidden flex items-center justify-center relative">
                            {employee.avatar ? (
                                <img
                                    src={employee.avatar}
                                    alt={employee.userName}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <span className="text-3xl font-bold text-sky-500">
                                    {employee.userName.charAt(0)}
                                </span>
                            )}
                        </div>
                    </div>
                    <div>
                        <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                            {employee.userName}
                        </h3>
                        <p className="text-xs font-bold text-sky-500 dark:text-sky-400 uppercase tracking-wider mt-0.5">
                            {employee.dept}
                        </p>
                    </div>
                    <span
                        className={`text-[10px] font-bold px-3 py-1 rounded-full border ${statusColor}`}
                    >
                        {statusLabel}
                    </span>
                </div>
                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">

                    {/* Email */}
                    <div className="bg-slate-50/60 dark:bg-white/3 border border-slate-200/50 dark:border-white/5 p-4 rounded-2xl flex flex-col justify-center">
                        <span className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
                            Электронная почта
                        </span>
                        <span className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">
                            {employee.email || "Не указан"}
                        </span>
                    </div>
                    {/* Phone */}
                    <div className="bg-slate-50/60 dark:bg-white/3 border border-slate-200/50 dark:border-white/5 p-4 rounded-2xl flex flex-col justify-center">
                        <span className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
                            Номер телефона
                        </span>
                        <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                            {employee.phone || "Не указан"}
                        </span>
                    </div>
                    {/* Shift Schedule */}
                    <div className="bg-slate-50/60 dark:bg-white/3 border border-slate-200/50 dark:border-white/5 p-4 rounded-2xl flex flex-col justify-center">
                        <span className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
                            Рабочий график
                        </span>
                        <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                            {employee.shift}
                        </span>
                    </div>
                    {/* Days */}
                    <div className="bg-slate-50/60 dark:bg-white/3 border border-slate-200/50 dark:border-white/5 p-4 rounded-2xl flex flex-col justify-center">
                        <span className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
                            Рабочие дни
                        </span>
                        <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                            {employee.days.join(", ")}
                        </span>
                    </div>
                    {/* Birth Date */}
                    <div className="bg-slate-50/60 dark:bg-white/3 border border-slate-200/50 dark:border-white/5 p-4 rounded-2xl flex flex-col justify-center">
                        <span className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
                            Дата рождения
                        </span>
                        <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                            {employee.birthDate || "Не указана"}
                        </span>
                    </div>
                    {/* Passport */}
                    <div className="bg-slate-50/60 dark:bg-white/3 border border-slate-200/50 dark:border-white/5 p-4 rounded-2xl flex flex-col justify-center">
                        <span className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
                            Серия и номер паспорта
                        </span>
                        <span className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase">
                            {employee.passport || "Не указан"}
                        </span>
                    </div>
                    {/* Address */}
                    <div className="md:col-span-2 bg-slate-50/60 dark:bg-white/3 border border-slate-200/50 dark:border-white/5 p-4 rounded-2xl flex flex-col justify-center">
                        <span className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
                            Домашний адрес
                        </span>
                        <span className="text-sm font-bold text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">
                            {employee.address || "Не указан"}
                        </span>
                    </div>
                </div>
            </div>
        </div >
    );
};
export default EmployeeDetailModal;