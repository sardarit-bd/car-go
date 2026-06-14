"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useApp } from "@/app/context/AppContext";
import { Lock, UserCheck, ShieldCheck } from "lucide-react";

export default function AccountActivation() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { lang, registerUser, t } = useApp();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [activated, setActivated] = useState(false);

  useEffect(() => {
    const queryEmail = searchParams.get("email");
    if (queryEmail) {
      setEmail(queryEmail);
    }
  }, [searchParams]);

  const handleActivate = (e) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError(lang === "pl" ? "Hasło musi mieć co najmniej 6 znaków!" : "Password must be at least 6 characters!");
      return;
    }

    if (password !== confirmPassword) {
      setError(lang === "pl" ? "Hasła nie są zgodne!" : "Passwords do not match!");
      return;
    }

    registerUser(email, password);
    setActivated(true);

    setTimeout(() => {
      router.push("/account");
    }, 3000);
  };

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 py-12 animate-fade-in">
      <div className="glass-panel p-8 rounded-2xl space-y-6 shadow-sm border border-slate-100">
        
        {/* Title */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-black text-slate-800 uppercase">Aktywacja Konta / Activation</h1>
          <p className="text-xs text-slate-500">Ustaw hasło do swojego konta przypisanego do adresu e-mail.</p>
        </div>

        {activated ? (
          <div className="p-8 border border-green-600/30 bg-green-50/50 rounded-xl text-center space-y-3 text-green-700 animate-fade-in">
            <ShieldCheck className="w-12 h-12 mx-auto" />
            <p className="text-sm font-bold">Konto zostało aktywowane pomyślnie!</p>
            <p className="text-xs text-slate-500">Przekierowuję do panelu Moje Konto...</p>
          </div>
        ) : (
          <form onSubmit={handleActivate} className="space-y-4">
            
            {error && (
              <div className="p-3 bg-brand-red/10 border border-brand-red/30 rounded-lg text-xs text-brand-red">
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Twój Login (Adres E-mail)</label>
              <input
                type="text"
                disabled
                value={email}
                className="w-full px-4 py-2.5 bg-slate-100/70 border border-slate-200 rounded-lg text-slate-400 text-sm cursor-not-allowed font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5 flex items-center space-x-1">
                <Lock className="w-3.5 h-3.5 text-slate-400" />
                <span>Nowe Hasło / New Password</span>
              </label>
              <input
                type="password"
                required
                placeholder="minimum 6 znaków"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-slate-200 focus:border-brand-red rounded-lg text-slate-800 text-sm focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5 flex items-center space-x-1">
                <Lock className="w-3.5 h-3.5 text-slate-400" />
                <span>Potwierdź Hasło / Confirm Password</span>
              </label>
              <input
                type="password"
                required
                placeholder="Wpisz ponownie hasło"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-slate-200 focus:border-brand-red rounded-lg text-slate-800 text-sm focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-brand-red hover:bg-brand-red-hover text-white font-bold rounded-lg transition duration-200 shadow flex items-center justify-center space-x-2"
            >
              <UserCheck className="w-4.5 h-4.5" />
              <span>AKTYWUJ KONTO / ACTIVATE</span>
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
