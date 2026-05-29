interface Props {
  currentLocation: { latitude: number; longitude: number } | null;
  startCamera: () => void;
  submitCheckIn: () => void;
}

const LastSec: React.FC<Props> = ({
  currentLocation,
  startCamera,
  submitCheckIn,
}) => {
  return (
    <div className="w-full md:w-1/2 space-y-5">
      <div className="bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-400 p-5 rounded-2xl space-y-2.5">
        <h4 className="text-sm font-bold flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 dark:bg-emerald-450 animate-ping" />
          Данные верифицированы:
        </h4>
        <div className="text-xs space-y-1.5 font-mono mt-3">
          <p>📸 Фото фиксация: Выполнена</p>
          <p>🧭 Широта: {currentLocation?.latitude.toFixed(6) || "..."}</p>
          <p>🧭 Долгота: {currentLocation?.longitude.toFixed(6) || "..."}</p>
          <p>⏰ Время регистрации: {new Date().toLocaleString("ru-RU")}</p>
        </div>
      </div>

      <div className="flex gap-2.5">
        <button
          onClick={startCamera}
          className="bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 font-semibold px-5 py-3 rounded-2xl transition cursor-pointer text-xs"
        >
          Переснять
        </button>
        <button
          onClick={submitCheckIn}
          className="bg-linear-to-r from-emerald-500 to-teal-600 hover:opacity-95 text-white font-bold px-8 py-3 rounded-2xl shadow-lg shadow-emerald-500/25 transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98] cursor-pointer text-xs"
        >
          Завершить и отправить
        </button>
      </div>
    </div>
  );
};

export default LastSec;
