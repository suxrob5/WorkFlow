"use client";

import { EMAIL_VERIFICATION_ENABLED, auth, db } from "@/firebase";
import { sendEmailVerification, signOut } from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [waitingEmail, setWaitingEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [signInWithEmailAndPassword] = useSignInWithEmailAndPassword(auth);

  const activateUser = async (uid: string) => {
    await setDoc(
      doc(db, "users", uid),
      {
        isActive: true,
        userActive: true,
        active: true,
        emailVerified: true,
        status: "active",
        verifiedAt: serverTimestamp(),
      },
      { merge: true },
    );
  };

  const putUserOnWaiting = async (uid: string) => {
    await setDoc(
      doc(db, "users", uid),
      {
        isActive: false,
        userActive: false,
        active: false,
        emailVerified: false,
        status: "waiting",
      },
      { merge: true },
    );
  };

  const onSubmit = async () => {
    if (!email || !password) {
      alert("Пожалуйста, введите email и пароль.");
      return;
    }

    setIsSubmitting(true);

    try {
      const userCredential = await signInWithEmailAndPassword(email, password);
      const user = userCredential?.user;

      if (!user) {
        alert("Неверный логин или пароль. Попробуйте еще раз.");
        return;
      }

      if (EMAIL_VERIFICATION_ENABLED) {
        await user.reload();
      }

      if (EMAIL_VERIFICATION_ENABLED && !user.emailVerified) {
        await putUserOnWaiting(user.uid);
        setWaitingEmail(user.email ?? email);
        return;
      }

      await activateUser(user.uid);
      router.push("/");
    } catch (error) {
      console.error("Login error:", error);
      alert("Произошла ошибка при входе. Попробуйте еще раз.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resendVerificationEmail = async () => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      await sendEmailVerification(user);
      alert("Письмо для подтверждения отправлено повторно.");
    } catch (error) {
      console.error("Resend verification error:", error);
    }
  };

  const checkVerification = async () => {
    const user = auth.currentUser;
    if (!user) return;

    setIsSubmitting(true);

    try {
      await user.reload();

      if (!user.emailVerified) {
        alert("Email еще не подтвержден. Перейдите по ссылке в письме.");
        return;
      }

      await activateUser(user.uid);
      router.push("/");
    } catch (error) {
      console.error("Check verification error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const backToLogin = async () => {
    await signOut(auth);
    setWaitingEmail("");
  };

  if (waitingEmail) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-6">
        <div className="w-full max-w-md rounded-3xl bg-white border border-slate-200 p-6 text-center shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 text-amber-600">
            <svg
              className="h-7 w-7"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">
            Ожидание подтверждения email
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Вход в систему закрыт, пока {waitingEmail} не будет подтвержден.
            Перейдите по ссылке в письме, затем проверьте еще раз.
          </p>
          <div className="mt-6 space-y-3">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={checkVerification}
              className="w-full rounded-xl bg-linear-to-br from-sky-500 to-blue-600 py-3.5 font-bold text-white shadow-lg shadow-sky-500/20 transition-all duration-200 hover:opacity-90 disabled:opacity-60 active:scale-[0.98]"
            >
              {isSubmitting ? "Проверяем..." : "Я подтвердил email"}
            </button>
            <button
              type="button"
              onClick={resendVerificationEmail}
              className="w-full rounded-xl border border-slate-300 bg-slate-50 py-3 font-bold text-slate-700 transition-all duration-200 hover:bg-white"
            >
              Отправить ссылку повторно
            </button>
            <button
              type="submit"
              onClick={backToLogin}
              className="w-full rounded-xl py-2.5 text-sm font-medium text-slate-500 hover:text-slate-700"
            >
              Войти с другим email
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <form className="w-full max-w-md p-8 rounded-3xl bg-white border border-slate-200 shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight font-nunito">
            С возвращением
          </h1>
          <p className="text-slate-600 mt-2 text-sm">
            Введите данные для входа в систему
          </p>
        </div>

        <div className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 ml-1">
              Email
            </label>
            <input
              type="email"
              placeholder="Email"
              className="w-full rounded-xl bg-slate-50 border border-slate-300 px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-sky-500/50 transition-all duration-200"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 ml-1">
              Пароль
            </label>
            <input
              type="password"
              placeholder="********"
              className="w-full rounded-xl bg-slate-50 border border-slate-300 px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-sky-500/50 transition-all duration-200"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-linear-to-br from-sky-500 to-blue-600 hover:opacity-90 disabled:opacity-60 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-sky-500/20 transition-all duration-200 active:scale-[0.98] mt-2"
            onClick={onSubmit}
          >
            {isSubmitting ? "Проверяем..." : "Войти"}
          </button>
        </div>

        <div className="mt-6 text-center text-sm text-slate-600">
          Нет аккаунта?{" "}
          <Link
            href="/register"
            className="text-sky-500 hover:text-sky-400 font-medium transition-colors"
          >
            Зарегистрироваться
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
