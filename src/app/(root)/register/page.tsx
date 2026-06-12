"use client";

import { auth, db } from "@/firebase";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { POSITIONS, type PositionKey } from "@/lib/positions";

const PASSPORT_SERIES = ["AB", "AC", "AD", "AE", "AF", "BA", "BB", "BC"];

const formatUzPhone = (value: string) => {
  const digits = value.replace(/\D/g, "");
  const localDigits = digits.startsWith("998") ? digits.slice(3) : digits;
  const limitedDigits = localDigits.slice(0, 9);
  const parts = [
    limitedDigits.slice(0, 2),
    limitedDigits.slice(2, 5),
    limitedDigits.slice(5, 7),
    limitedDigits.slice(7, 9),
  ].filter(Boolean);

  return parts.length ? `+998 ${parts.join(" ")}` : "+998 ";
};

const formatBirthDate = (value: string) => {
  const [year = "", month = "", day = ""] = value.replace(/^\+/, "").split("-");
  const normalizedYear = year.replace(/\D/g, "").slice(0, 4);

  return [normalizedYear, month, day].filter(Boolean).join("-");
};

const Register = () => {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [address, setAddress] = useState("");
  const [positionKey, setPositionKey] = useState<PositionKey>(POSITIONS[0].key);
  const [passportSeries, setPassportSeries] = useState(PASSPORT_SERIES[0]);
  const [passportNumber, setPassportNumber] = useState("");
  const [phone, setPhone] = useState("+998 ");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPositionOpen, setIsPositionOpen] = useState(false);
  const [isPassportSeriesOpen, setIsPassportSeriesOpen] = useState(false);

  const [createUserWithEmailAndPassword] =
    useCreateUserWithEmailAndPassword(auth);

  const selectedPosition =
    POSITIONS.find((position) => position.key === positionKey) ?? POSITIONS[0];

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        email,
        password,
      );
      const user = userCredential?.user;

      if (!user) return;

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: fullName,
        fullName,
        email: user.email,
        phone,
        role: "user",
        positionKey: selectedPosition.key,
        position: selectedPosition.uz,
        positionRu: selectedPosition.ru,
        avatarUrl: "/user-logo.png",
        birthDate,
        address,
        passport: `${passportSeries}${passportNumber}`,
        isActive: true,
        createdAt: serverTimestamp(),
      });

      router.push("/");
    } catch (error) {
      console.error("Register error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-3 py-6 sm:px-4">
      <div className="w-full max-w-xl min-w-0 rounded-3xl bg-white border border-slate-200 p-4 shadow-[0_20px_50px_rgba(0,0,0,0.05)] sm:p-6">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight font-nunito">
            Регистрация сотрудника
          </h1>
          <p className="text-slate-600 mt-2 text-sm">
            Заполните данные сотрудника и выберите должность
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 ml-1">
              Ф.И.О
            </label>
            <input
              type="text"
              required
              placeholder="Иванов Алексей Сергеевич"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full rounded-xl bg-slate-50 border border-slate-300 px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-sky-500/50 transition-all duration-200"
            />
          </div>

          <div className="grid min-w-0 gap-4 md:grid-cols-2">
            <div className="min-w-0 space-y-2">
              <label className="text-sm font-medium text-slate-700 ml-1">
                Дата рождения
              </label>
              <input
                type="date"
                required
                min="1900-01-01"
                max="9999-12-31"
                value={birthDate}
                onChange={(e) => setBirthDate(formatBirthDate(e.target.value))}
                className="w-full rounded-xl bg-slate-50 border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:ring-2 focus:ring-sky-500/50 transition-all duration-200"
              />
            </div>

            <div className="min-w-0 space-y-2">
              <label className="text-sm font-medium text-slate-700 ml-1">
                Телефон
              </label>
              <input
                type="tel"
                required
                placeholder="+998123456789"
                value={phone}
                onChange={(e) => setPhone(formatUzPhone(e.target.value))}
                className="w-full rounded-xl bg-slate-50 border border-slate-300 px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-sky-500/50 transition-all duration-200"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 ml-1">
              Адрес
            </label>
            <input
              type="text"
              required
              placeholder="г. Ташкент, Чиланзарский район, 12-й квартал"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full rounded-xl bg-slate-50 border border-slate-300 px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-sky-500/50 transition-all duration-200"
            />
          </div>

          <div className="grid min-w-0 gap-4 md:grid-cols-2">
            <div className="min-w-0 space-y-2">
              <label className="text-sm font-medium text-slate-700 ml-1">
                Должность
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setIsPassportSeriesOpen(false);
                    setIsPositionOpen((open) => !open);
                  }}
                  className={`w-full rounded-xl border px-4 py-3 text-left outline-none transition-all duration-200 ${
                    isPositionOpen
                      ? "border-sky-400 bg-white ring-4 ring-sky-500/10 shadow-[0_12px_30px_rgba(14,165,233,0.14)]"
                      : "border-slate-300 bg-slate-50 hover:border-sky-300 hover:bg-white"
                  }`}
                >
                  <span className="flex items-center justify-between gap-3">
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-bold text-slate-900">
                        {selectedPosition.ru}
                      </span>
                      <span className="block truncate text-xs text-slate-500 mt-0.5">
                        {selectedPosition.uz}
                      </span>
                    </span>
                    <svg
                      className={`h-5 w-5 shrink-0 text-slate-500 transition-transform duration-200 ${
                        isPositionOpen ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </span>
                </button>

                {isPositionOpen && (
                  <div className="absolute left-0 right-0 top-full z-40 mt-2 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_20px_45px_rgba(15,23,42,0.14)]">
                    <div className="max-h-72 overflow-y-auto p-1.5">
                      {POSITIONS.map((position) => {
                        const isSelected = position.key === positionKey;

                        return (
                          <button
                            key={position.key}
                            type="button"
                            onClick={() => {
                              setPositionKey(position.key);
                              setIsPositionOpen(false);
                            }}
                            className={`w-full rounded-xl px-3 py-2.5 text-left transition duration-150 ${
                              isSelected
                                ? "bg-sky-500 text-white shadow-md shadow-sky-500/20"
                                : "text-slate-700 hover:bg-slate-100"
                            }`}
                          >
                            <span className="block text-sm font-bold">
                              {position.ru}
                            </span>
                            <span
                              className={`block text-xs mt-0.5 ${
                                isSelected ? "text-white/80" : "text-slate-500"
                              }`}
                            >
                              {position.uz}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="min-w-0 space-y-2">
              <label className="text-sm font-medium text-slate-700 ml-1">
                Серия паспорта
              </label>
              <div className="flex gap-2">
                <div className="relative w-28 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      setIsPositionOpen(false);
                      setIsPassportSeriesOpen((open) => !open);
                    }}
                    className={`flex h-full w-full items-center justify-between rounded-xl border px-4 py-3 font-bold text-slate-900 outline-none transition-all duration-200 ${
                      isPassportSeriesOpen
                        ? "border-sky-400 bg-white ring-4 ring-sky-500/10 shadow-[0_12px_30px_rgba(14,165,233,0.14)]"
                        : "border-slate-300 bg-slate-50 hover:border-sky-300 hover:bg-white"
                    }`}
                  >
                    {passportSeries}
                    <svg
                      className={`h-4 w-4 text-slate-500 transition-transform duration-200 ${
                        isPassportSeriesOpen ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {isPassportSeriesOpen && (
                    <div className="absolute left-0 top-full z-50 mt-2 w-full overflow-hidden rounded-2xl border border-slate-200 bg-white p-1.5 shadow-[0_20px_45px_rgba(15,23,42,0.14)]">
                      {PASSPORT_SERIES.map((series) => {
                        const isSelected = series === passportSeries;

                        return (
                          <button
                            key={series}
                            type="button"
                            onClick={() => {
                              setPassportSeries(series);
                              setIsPassportSeriesOpen(false);
                            }}
                            className={`w-full rounded-xl px-3 py-2 text-center text-sm font-bold transition duration-150 ${
                              isSelected
                                ? "bg-sky-500 text-white shadow-md shadow-sky-500/20"
                                : "text-slate-700 hover:bg-slate-100"
                            }`}
                          >
                            {series}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                <input
                  type="text"
                  inputMode="numeric"
                  required
                  maxLength={7}
                  placeholder="7654321"
                  value={passportNumber}
                  onChange={(e) =>
                    setPassportNumber(
                      e.target.value.replace(/\D/g, "").slice(0, 7),
                    )
                  }
                  className="min-w-0 flex-1 rounded-xl bg-slate-50 border border-slate-300 px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-sky-500/50 transition-all duration-200"
                />
              </div>
            </div>
          </div>

          <div className="grid min-w-0 gap-4 md:grid-cols-2">
            <div className="min-w-0 space-y-2">
              <label className="text-sm font-medium text-slate-700 ml-1">
                Email
              </label>
              <input
                type="email"
                required
                placeholder="sardor@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl bg-slate-50 border border-slate-300 px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-sky-500/50 transition-all duration-200"
              />
            </div>

            <div className="min-w-0 space-y-2">
              <label className="text-sm font-medium text-slate-700 ml-1">
                Пароль
              </label>
              <input
                type="password"
                required
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl bg-slate-50 border border-slate-300 px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-sky-500/50 transition-all duration-200"
              />
            </div>
          </div>

          <button
            disabled={isSubmitting}
            type="submit"
            className="w-full bg-linear-to-br from-sky-500 to-blue-600 hover:opacity-90 disabled:opacity-60 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-sky-500/20 transition-all duration-200 active:scale-[0.98] mt-2"
          >
            {isSubmitting ? "Сохранение..." : "Зарегистрировать"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-600">
          Уже есть аккаунт?{" "}
          <Link
            href="/login"
            className="text-sky-500 hover:text-sky-400 font-medium transition-colors"
          >
            Войти
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
