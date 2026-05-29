import React from 'react';
import Link from 'next/link';

const Register = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#011E5D] px-4">
      <div className="w-full max-w-md p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white tracking-tight font-nunito">
            Создать аккаунт
          </h1>
          <p className="text-slate-400 mt-2 text-sm">
            Присоединяйтесь к нам, заполнив свои данные
          </p>
        </div>

        <form className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300 ml-1">
              ФИО
            </label>
            <input
              type="text"
              placeholder="Иван Иванов"
              className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-sky-500/50 transition-all duration-200"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300 ml-1">
              Электронная почта
            </label>
            <input
              type="email"
              placeholder="ivan@example.com"
              className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-sky-500/50 transition-all duration-200"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300 ml-1">
              Номер телефона
            </label>
            <input
              type="tel"
              placeholder="+998 (90) 123-45-67"
              className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-sky-500/50 transition-all duration-200"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300 ml-1">
              Пароль
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-sky-500/50 transition-all duration-200"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-linear-to-br from-sky-500 to-blue-600 hover:opacity-90 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-sky-500/25 transition-all duration-200 active:scale-[0.98] mt-2"
          >
            Зарегистрироваться
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-400">
          У вас уже есть аккаунт?{' '}
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
