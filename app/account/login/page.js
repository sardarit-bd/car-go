"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/app/context/AppContext";
import Link from "next/link";
import { User, Lock, AlertTriangle } from "lucide-react";

export default function CustomerLogin() {
  const router = useRouter();
  const { loginUser, loginAdmin, t } = useApp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");

    const userLower = email.toLowerCase().trim();

    // Auto-detect role: Admin (Owner)
    if ((userLower === "admin" || userLower === "admin@car-go.pl") && password === "admin123") {
      loginAdmin("admin", "admin123");
      router.push("/admin");
      return;
    }

    // Auto-detect role: Admin (Employee)
    if ((userLower === "employee" || userLower === "employee@car-go.pl") && password === "employee123") {
      loginAdmin("employee", "employee123");
      router.push("/admin");
      return;
    }

    // Default Customer login
    const success = loginUser(email, password);
    if (success) {
      router.push("/account");
    } else {
      setError("Nieprawidłowe dane logowania / Invalid credentials");
    }
  };

  const handleAutoLogin = (usernameVal, passwordVal, role) => {
    setEmail(usernameVal);
    setPassword(passwordVal);
    
    if (role === "admin" || role === "employee") {
      loginAdmin(usernameVal, passwordVal);
      router.push("/admin");
    } else {
      loginUser(usernameVal, passwordVal);
      router.push("/account");
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
              <span>Login / E-mail</span>
            </label>
            <input
              type="text"
              required
              placeholder="E-mail lub login testowy"
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

        {/* Demo Credentials Panel */}
        <div className="p-4 bg-slate-50 border border-slate-200/60 rounded-xl text-[11px] text-slate-500 space-y-3">
          <p className="font-extrabold text-slate-800 uppercase tracking-wider text-[10px]">Autouzupełnianie kont testowych / Demo Auto Logins:</p>
          
          <div className="grid grid-cols-1 gap-2.5">
            <button
              type="button"
              onClick={() => handleAutoLogin("test@car-go.pl", "password123", "client")}
              className="px-3 py-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-extrabold rounded shadow-sm text-xs transition duration-200 text-left flex justify-between items-center"
            >
              <span>🔑 Klient / Client</span>
              <span className="text-[9px] text-slate-400 font-mono">test@car-go.pl</span>
            </button>

            <button
              type="button"
              onClick={() => handleAutoLogin("admin", "admin123", "admin")}
              className="px-3 py-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-extrabold rounded shadow-sm text-xs transition duration-200 text-left flex justify-between items-center"
            >
              <span>👑 Właściciel / Owner</span>
              <span className="text-[9px] text-slate-400 font-mono">admin</span>
            </button>

            <button
              type="button"
              onClick={() => handleAutoLogin("employee", "employee123", "employee")}
              className="px-3 py-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-extrabold rounded shadow-sm text-xs transition duration-200 text-left flex justify-between items-center"
            >
              <span>💼 Pracownik / Employee</span>
              <span className="text-[9px] text-slate-400 font-mono">employee</span>
            </button>
          </div>
          
          <div className="text-[10px] text-slate-400 leading-relaxed border-t border-slate-200/60 pt-2">
            💡 System automatycznie zidentyfikuje Twoją rolę i przekieruje Cię do odpowiedniego panelu (/admin lub /account).
          </div>
        </div>

      </div>
    </div>
  );
}
