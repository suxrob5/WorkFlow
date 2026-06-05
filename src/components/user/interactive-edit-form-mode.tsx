interface InteractiveEditFormProps {
  editName: string;
  setEditName: (value: string) => void;
  editSurname: string;
  setEditSurname: (value: string) => void;
  editEmail: string;
  setEditEmail: (value: string) => void;
  editPhone: string;
  setEditPhone: (value: string) => void;
  editBirthDate: string;
  setEditBirthDate: (value: string) => void;
  editPassport: string;
  editPosition: string;
  editPositionRu: string;
  editAddress: string;
  setEditAddress: (value: string) => void;
  editBio: string;
  setEditBio: (value: string) => void;
  handleSave: (e: React.FormEvent) => void;
  role: string;
  cancelEdit: () => void;
  isSaving: boolean;
}

const InteractiveEditForm: React.FC<InteractiveEditFormProps> = ({
  editName,
  setEditName,
  editSurname,
  setEditSurname,
  editEmail,
  setEditEmail,
  editPhone,
  setEditPhone,
  editBirthDate,
  setEditBirthDate,
  editPassport,
  editPosition,
  editPositionRu,
  editAddress,
  setEditAddress,
  editBio,
  setEditBio,
  handleSave,
  role,
  cancelEdit,
  isSaving,
}) => {
  return (
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-2">
          <label className="text-xs font-semibold tracking-wider text-slate-600 dark:text-slate-300 ml-1">
            ДАТА РОЖДЕНИЯ
          </label>
          <input
            type="date"
            value={editBirthDate}
            onChange={(e) => setEditBirthDate(e.target.value)}
            className="w-full rounded-2xl bg-white/85 dark:bg-white/5 border border-slate-200 dark:border-white/10 px-4 py-3.5 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-sky-500/30 dark:focus:ring-sky-500/50 focus:border-sky-500/50 dark:focus:border-sky-500/50 transition-all duration-200"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold tracking-wider text-slate-600 dark:text-slate-300 ml-1">
            ПАСПОРТ (ФИКСИРОВАННЫЙ)
          </label>
          <div className="w-full rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 px-4 py-3.5 text-slate-600 dark:text-slate-400 select-none font-medium">
            {editPassport || "—"}
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold tracking-wider text-slate-600 dark:text-slate-300 ml-1">
            ДОЛЖНОСТЬ (ФИКСИРОВАННАЯ)
          </label>
          <div className="w-full rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 px-4 py-3.5 text-slate-600 dark:text-slate-400 select-none font-medium">
            {editPositionRu || "—"}
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold tracking-wider text-slate-600 dark:text-slate-300 ml-1">
            LAVOZIM (O&apos;ZGARTIRIB BO&apos;LMAYDI)
          </label>
          <div className="w-full rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 px-4 py-3.5 text-slate-600 dark:text-slate-400 select-none font-medium">
            {editPosition || "—"}
          </div>
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
          className="w-full rounded-2xl bg-white/85 dark:bg-white/5 border border-slate-200 dark:border-white/10 px-4 py-3.5 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-sky-500/30 dark:focus:ring-sky-500/50 focus:border-sky-500/50 dark:focus:border-sky-500/50 transition-all duration-200"
          placeholder="г. Ташкент, Чиланзарский район"
        />
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
  );
};

export default InteractiveEditForm;
