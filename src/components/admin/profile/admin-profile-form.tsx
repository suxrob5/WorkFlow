import type { AdminProfileData, AdminProfileDraft } from "./types";

type AdminProfileFormProps = {
  draft: AdminProfileDraft;
  profile: AdminProfileData;
  isSaving: boolean;
  onChange: (field: keyof AdminProfileDraft, value: string) => void;
  onCancel: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};

const inputClass =
  "w-full rounded-2xl border border-slate-200 bg-white/85 px-4 py-3.5 text-slate-900 outline-none transition-all duration-200 focus:border-sky-500/50 focus:ring-2 focus:ring-sky-500/30 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:ring-sky-500/50";

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="ml-1 text-xs font-semibold tracking-wider text-slate-600 uppercase dark:text-slate-300">
      {children}
    </label>
  );
}

function ReadOnlyField({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-2">
      <FieldLabel>{label}</FieldLabel>
      <div className="w-full select-none rounded-2xl border border-slate-200 bg-slate-100 px-4 py-3.5 font-medium text-slate-600 dark:border-white/5 dark:bg-white/5 dark:text-slate-400">
        {value || "—"}
      </div>
    </div>
  );
}

export default function AdminProfileForm({
  draft,
  profile,
  isSaving,
  onChange,
  onCancel,
  onSubmit,
}: AdminProfileFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-2">
        <FieldLabel>Полное имя</FieldLabel>
        <input
          type="text"
          required
          autoComplete="name"
          value={draft.fullName}
          onChange={(event) => onChange("fullName", event.target.value)}
          placeholder="Введите имя и фамилию"
          className={inputClass}
        />
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <FieldLabel>Электронная почта</FieldLabel>
          <input
            type="email"
            required
            autoComplete="email"
            value={draft.email}
            onChange={(event) => onChange("email", event.target.value)}
            placeholder="example@mail.com"
            className={inputClass}
          />
        </div>
        <div className="space-y-2">
          <FieldLabel>Номер телефона</FieldLabel>
          <input
            type="tel"
            autoComplete="tel"
            value={draft.phone}
            onChange={(event) => onChange("phone", event.target.value)}
            placeholder="+998 90 123 45 67"
            className={inputClass}
          />
        </div>
        <div className="space-y-2">
          <FieldLabel>Дата рождения</FieldLabel>
          <input
            type="date"
            value={draft.birthDate}
            onChange={(event) => onChange("birthDate", event.target.value)}
            className={inputClass}
          />
        </div>
        <ReadOnlyField
          label="Паспорт (изменение недоступно)"
          value={profile.passport}
        />
        <ReadOnlyField
          label="Роль (изменение недоступно)"
          value={profile.role}
        />
      </div>

      <div className="space-y-2">
        <FieldLabel>Адрес</FieldLabel>
        <input
          type="text"
          autoComplete="street-address"
          value={draft.address}
          onChange={(event) => onChange("address", event.target.value)}
          placeholder="г. Ташкент"
          className={inputClass}
        />
      </div>

      <div className="space-y-2">
        <FieldLabel>О себе</FieldLabel>
        <textarea
          value={draft.bio}
          onChange={(event) => onChange("bio", event.target.value)}
          rows={3}
          placeholder="Расскажите немного о себе..."
          className={`${inputClass} resize-none leading-relaxed`}
        />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="cursor-pointer rounded-2xl border border-slate-200 bg-slate-100 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-200 dark:border-white/5 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10"
        >
          Отменить
        </button>
        <button
          type="submit"
          disabled={isSaving}
          className="cursor-pointer rounded-2xl bg-linear-to-br from-sky-500 to-blue-600 px-8 py-3 font-bold text-white shadow-lg shadow-sky-500/20 transition-all hover:-translate-y-0.5 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSaving ? "Сохранение..." : "Сохранить изменения"}
        </button>
      </div>
    </form>
  );
}
