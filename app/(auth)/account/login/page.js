"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/app/context/AppContext";
import Link from "next/link";
import { User, Lock, AlertTriangle, Loader2 } from "lucide-react";
import * as yup from "yup";

const getLoginSchema = (lang) =>
  yup.object().shape({
    email: yup
      .string()
      .required(
        lang === "en"
          ? "Login / Email is required"
          : "Login / E-mail jest wymagany",
      )
      .min(
        3,
        lang === "en"
          ? "Login must be at least 3 characters"
          : "Login musi mieć minimum 3 znaki",
      ),
    password: yup
      .string()
      .required(lang === "en" ? "Password is required" : "Hasło jest wymagane")
      .min(
        6,
        lang === "en"
          ? "Password must be at least 6 characters"
          : "Hasło musi mieć minimum 6 znaków",
      ),
  });

export default function CustomerLogin() {
  const router = useRouter();
  // We only need loginUser and t now. Removed loginAdmin and setCurrentUser.
  const { loginUser, t, lang } = useApp();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setFieldErrors({});

    try {
      await getLoginSchema(lang).validate(
        { email, password },
        { abortEarly: false },
      );
    } catch (validationError) {
      const errors = {};
      validationError.inner.forEach((err) => {
        errors[err.path] = err.message;
      });
      setFieldErrors(errors);
      return;
    }

    setLoading(true);

    // Call the centralized context function
    const result = await loginUser(email.toLowerCase().trim(), password);

    if (result.success) {
      const user = result.user;
      // Check role based on your Prisma Enum (ADMIN, USER)
      if (user.role === "ADMIN" || user.role === "EMPLOYEE") {
        router.push("/admin");
      } else {
        router.push("/account");
      }
    } else {
      setError(result.message);
    }

    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 py-28 animate-fade-in">
      <div className="glass-panel p-8 rounded-2xl space-y-6 shadow-sm border border-slate-100">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-black text-slate-800 uppercase">
            {t("navLogin")}
          </h1>
          <p className="text-xs text-slate-500">
            {lang === "en"
              ? "Log in to your customer account to manage reservations."
              : "Zaloguj się do panelu klienta aby zarządzać rezerwacjami."}
          </p>
        </div>

        {error && (
          <div className="flex items-center space-x-2 p-3 bg-brand-red/10 border border-brand-red/30 rounded-lg text-xs text-brand-red">
            <AlertTriangle className="w-4.5 h-4.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4" noValidate>
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1.5 flex items-center space-x-1">
              <User className="w-3.5 h-3.5 text-slate-400" />
              <span>{lang === "en" ? "Login / Email" : "Login / E-mail"}</span>
            </label>
            <input
              type="text"
              placeholder={
                lang === "en"
                  ? "Email or test login"
                  : "E-mail lub login testowy"
              }
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full px-4 py-2.5 bg-white border ${fieldErrors.email ? "border-brand-red" : "border-slate-200"} focus:border-brand-red rounded-lg text-slate-800 text-sm focus:outline-none placeholder-slate-400`}
            />
            {fieldErrors.email && (
              <p className="text-[10px] text-brand-red mt-1 font-semibold">
                {fieldErrors.email}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1.5 flex items-center space-x-1">
              <Lock className="w-3.5 h-3.5 text-slate-400" />
              <span>{lang === "en" ? "Password" : "Hasło / Password"}</span>
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full px-4 py-2.5 bg-white border ${fieldErrors.password ? "border-brand-red" : "border-slate-200"} focus:border-brand-red rounded-lg text-slate-800 text-sm focus:outline-none`}
            />
            {fieldErrors.password && (
              <p className="text-[10px] text-brand-red mt-1 font-semibold">
                {fieldErrors.password}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-brand-red hover:bg-brand-red-hover text-white font-bold rounded-lg transition duration-200 shadow disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {lang === "en" ? "Logging in..." : "Logowanie..."}
              </>
            ) : (
              t("navLogin")
            )}
          </button>

          <div className="text-center text-xs text-slate-500">
            {lang === "en"
              ? "Don't have an account yet? "
              : "Nie masz jeszcze konta? "}
            <Link
              href="/account/signup"
              className="text-brand-red font-bold hover:underline"
            >
              {lang === "en" ? "Sign up" : "Zarejestruj się"}
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
