"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/app/context/AppContext";
import Link from "next/link";
import { User, Lock, AlertTriangle } from "lucide-react";

export default function CustomerLogin() {
  const router = useRouter();
  const { loginUser, t } = useApp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");

    const success = loginUser(email, password);
    if (success) {
      router.push("/account");
    } else {
      setError("Nieprawidłowy e-mail lub hasło / Invalid credentials");
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 py-12 animate-fade-in">
      <div className="glass-panel p-8 rounded-2xl space-y-6 shadow-sm border border-slate-100">
        
        {/* Title */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-black text-slate-800 uppercase">{t("navLogin")}</h1>
          <p className="text-xs text-slate-500">Zaloguj się do panelu klienta aby zarządzać rezerwacjami.</p>
        </div>

        {/* Error notification */}
        {error && (
          <div className="flex items-center space-x-2 p-3 bg-brand-red/10 border border-brand-red/30 rounded-lg text-xs text-brand-red">
            <AlertTriangle className="w-4.5 h-4.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1.5 flex items-center space-x-1">
              <User className="w-3.5 h-3.5 text-slate-400" />
              <span>{t("email")}</span>
            </label>
            <input
              type="email"
              required
              placeholder="np. jan.kowalski@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 bg-white border border-slate-200 focus:border-brand-red rounded-lg text-slate-800 text-sm focus:outline-none placeholder-slate-400"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1.5 flex items-center space-x-1">
              <Lock className="w-3.5 h-3.5 text-slate-400" />
              <span>Hasło / Password</span>
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 bg-white border border-slate-200 focus:border-brand-red rounded-lg text-slate-800 text-sm focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-brand-red hover:bg-brand-red-hover text-white font-bold rounded-lg transition duration-200 shadow"
          >
            {t("navLogin")}
          </button>
        </form>

        {/* Info Box */}
        <div className="p-3 bg-slate-50 border border-slate-200/60 rounded-lg text-[10px] text-slate-500 leading-normal">
          💡 <strong>Pierwsze logowanie?</strong> Konta klientów tworzone są automatycznie podczas składania rezerwacji. Po zatwierdzeniu rezerwacji przez administratora otrzymasz e-mail z linkiem do aktywacji konta.
          <br />
          <span className="text-slate-700 font-bold">Dla celów testowych wpisz dowolny e-mail oraz hasło (min. 4 znaki).</span>
        </div>

      </div>
    </div>
  );
}
