"use client";

interface ModalProps {
    open: boolean;
    onClose: () => void;
    modalData: {
        modalInfo: any[];
        name: string;
        value: string;
    };
}

const Modal = ({ open, onClose, modalData }: ModalProps) => {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center dark:bg-black bg-slate-950/60 backdrop-blur-md p-4">
            <div className="w-full max-w-4xl rounded-3xl bg-white/80  dark:bg-black backdrop-blur-xl border border-slate-200/60 dark:border-white/10 shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-6 py-5 border-b border-slate-200/60 dark:border-white/10">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                            {modalData.name}
                        </h2>

                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                            Всего: {modalData.value}
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 transition-all duration-200 text-slate-600 dark:text-slate-300"
                    >
                        ✕
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 max-h-[70vh] overflow-y-auto">
                    <div className="grid gap-3">
                        {modalData.modalInfo.map((user: any) => (
                            <div
                                key={user.id}
                                className="group flex items-center justify-between rounded-2xl border border-slate-200/60 dark:border-white/10 bg-slate-50/70 dark:bg-white/3 p-4 hover:bg-white dark:hover:bg-white/6 hover:shadow-lg transition-all duration-300"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-linear-to-r from-sky-500 to-blue-600 flex items-center justify-center text-white font-bold">
                                        {(user.userName || user.fullName)?.charAt(0)}
                                    </div>

                                    <div>
                                        <h3 className="font-semibold text-slate-900 dark:text-white">
                                            {user.userName || user.fullName}
                                        </h3>

                                        <p className="text-sm text-slate-500 dark:text-slate-400">
                                            {user.position || "Сотрудник"}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    {user.checkIn && (
                                        <div className="text-right">
                                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                                Check In
                                            </p>

                                            <p className="font-bold text-slate-900 dark:text-white">
                                                {user.checkIn}
                                            </p>
                                        </div>
                                    )}

                                    {user.status && (
                                        <span
                                            className={`px-3 py-1.5 rounded-full text-xs font-bold border ${user.status === "late"
                                                ? "bg-red-500/10 text-red-500 border-red-500/20"
                                                : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                                                }`}
                                        >
                                            {user.status === "late" ? "Опоздал" : "Присутствует"}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {modalData.modalInfo.length === 0 && (
                        <div className="py-20 text-center">
                            <p className="text-slate-500 dark:text-slate-400">Нет данных</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Modal;
