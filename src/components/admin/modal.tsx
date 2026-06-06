"use client";

import { getPositionLabel } from "@/lib/positions";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-md dark:bg-black/60">
      <div className="w-full max-w-4xl overflow-hidden rounded-3xl border border-slate-200/60 bg-white/80 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-[#021236]/90 dark:backdrop-blur-2xl">
        <div className="flex items-center justify-between border-b border-slate-200/60 p-6 py-5 dark:border-white/10">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {modalData.name}
            </h2>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Всего: {modalData.value}
            </p>
          </div>

          <button
            onClick={onClose}
            className="h-10 w-10 rounded-2xl bg-slate-100 text-slate-600 transition-all duration-200 hover:bg-slate-200 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10"
          >
            x
          </button>
        </div>

        <div className="max-h-[70vh] overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-300/60 [&::-webkit-scrollbar-thumb]:rounded-full dark:[&::-webkit-scrollbar-thumb]:bg-white/10 hover:[&::-webkit-scrollbar-thumb]:bg-slate-400/80 dark:hover:[&::-webkit-scrollbar-thumb]:bg-white/20">
          <div className="p-6 pr-4">
            <div className="grid gap-3">
              {modalData.modalInfo.map((user: any) => (
                <div
                  key={user.id}
                  className="group flex items-center justify-between rounded-2xl border border-slate-200/60 bg-slate-50/70 p-4 transition-all duration-300 hover:bg-white hover:shadow-lg dark:border-white/10 dark:bg-white/3 dark:hover:bg-white/6"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-r from-sky-500 to-blue-600 font-bold text-white">
                      {(user.userName || user.fullName)?.charAt(0)}
                    </div>

                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-white">
                        {user.userName || user.fullName}
                      </h3>

                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {getPositionLabel({
                          positionKey: user.positionKey,
                          position: user.position,
                          positionRu: user.positionRu,
                        })}
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
                        className={`rounded-full border px-3 py-1.5 text-xs font-bold ${
                          user.status === "late"
                            ? "border-red-500/20 bg-red-500/10 text-red-500"
                            : "border-emerald-500/20 bg-emerald-500/10 text-emerald-500"
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
    </div>
  );
};

export default Modal;
