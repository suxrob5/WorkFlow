"use client";

import { auth, db } from "@/firebase";
import { doc, setDoc } from "firebase/firestore";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";

const Register = () => {



  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [createUserWithEmailAndPassword] =
    useCreateUserWithEmailAndPassword(auth);

  const handSubmit = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        email,
        password
      );

      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        name: "Ali",
        email: user.email,
        role: "user",
        createdAt: new Date(),
      });

      console.log("User yaratildi va Firestorega saqlandi");

      setEmail("");
      setPassword("");

      router.push("/");
    } catch (error) {
      console.error(error);
    }
  };











  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md p-8 rounded-3xl bg-white border border-slate-200 shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight font-nunito">
            Создать аккаунт
          </h1>
          <p className="text-slate-600 mt-2 text-sm">
            Присоединяйтесь к нам, заполнив свои данные
          </p>
        </div>

        <div className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 ml-1">
              Электронная почта
            </label>
            <input
              type="email"
              placeholder="ivan@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl bg-slate-50 border border-slate-300 px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-sky-500/50 transition-all duration-200"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 ml-1">
              Пароль
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl bg-slate-50 border border-slate-300 px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-sky-500/50 transition-all duration-200"
            />
          </div>

          <button
            onClick={handSubmit}
            type="submit"
            className="w-full bg-linear-to-br from-sky-500 to-blue-600 hover:opacity-90 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-sky-500/20 transition-all duration-200 active:scale-[0.98] mt-2"
          >
            Зарегистрироваться
          </button>
        </div>

        <div className="mt-6 text-center text-sm text-slate-600">
          У вас уже есть аккаунт?{" "}
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
