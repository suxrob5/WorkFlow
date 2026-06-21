import type { AdminProfileData } from "./types";

function InfoCard({
  label,
  value,
  className = "",
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-slate-200/60 bg-white/30 p-4 dark:border-white/5 dark:bg-white/2 ${className}`}
    >
      <span className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">
        {label}
      </span>
      <p className="mt-1 break-words text-lg font-bold text-slate-900 dark:text-white">
        {value || "—"}
      </p>
    </div>
  );
}

export default function AdminProfileInformation({
  profile,
}: {
  profile: AdminProfileData;
}) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <InfoCard
          label="Полное имя"
          value={profile.fullName}
          className="md:col-span-2"
        />
        <InfoCard label="Электронная почта" value={profile.email} />
        <InfoCard label="Номер телефона" value={profile.phone} />
        <InfoCard label="Дата рождения" value={profile.birthDate} />
        <InfoCard label="Паспорт" value={profile.passport} />
        <InfoCard label="Дата регистрации" value={profile.registrationDate} />
        <InfoCard
          label="Адрес"
          value={profile.address}
          className="md:col-span-2"
        />
        <InfoCard
          label="Роль в системе"
          value={profile.role}
          className="md:col-span-2"
        />
      </div>
      <InfoCard label="О себе" value={profile.bio} />
    </div>
  );
}
