"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/app/context/AppContext";
import { Shield, Lock, AlertTriangle, Key } from "lucide-react";

export default function AdminLogin() {
  const router = useRouter();
  const { loginAdmin } = useApp();
  
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");

    const success = loginAdmin(username, password);
    if (success) {
      router.push("/admin");
    } else {
      setError("Nieprawidłowy login lub hasło administratora / Unauthorized");
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 py-16 animate-fade-in">
      <div className="glass-panel p-8 rounded-2xl space-y-6 shadow-sm border border-slate-100">
        
        {/* Title */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-brand-red/10 border border-brand-red/30 flex items-center justify-center mx-auto mb-2 text-brand-red">
            <Shield className="w-6 h-6 animate-pulse" />
          </div>
          <h1 className="text-xl font-black text-slate-800 uppercase">CAR-GO CMS Panel</h1>
          <p className="text-xs text-slate-500">Autoryzacja dostępu do systemu zarządzania flotą i treściami.</p>
        </div>

        {error && (
          <div className="flex items-center space-x-2 p-3 bg-brand-red/10 border border-brand-red/30 rounded-lg text-xs text-brand-red">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1.5 flex items-center space-x-1">
              <Key className="w-3.5 h-3.5 text-slate-400" />
              <span>Login Administratora</span>
            </label>
            <input
              type="text"
              required
              placeholder="np. admin lub employee"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2.5 bg-white border border-slate-200 focus:border-brand-red rounded-lg text-slate-800 text-sm focus:outline-none placeholder-slate-400 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1.5 flex items-center space-x-1">
              <Lock className="w-3.5 h-3.5 text-slate-400" />
              <span>Hasło Autoryzacyjne</span>
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
            AUTORYZUJ / LOGIN
          </button>
        </form>

        {/* Demo Credentials Panel */}
        <div className="p-4 bg-slate-50 border border-slate-200/60 rounded-xl text-[11px] text-slate-500 space-y-2">
          <p className="font-extrabold text-slate-800">Dostępne konta testowe / Test credentials:</p>
          <ul className="space-y-1.5 font-mono">
            <li>
              👑 <strong>Właściciel (Pełne uprawnienia):</strong>
              <br />
              <span className="text-slate-600">Login:</span> admin / <span className="text-slate-600">Hasło:</span> admin123
            </li>
            <li className="border-t border-slate-100 pt-1.5">
              💼 <strong>Pracownik (Tylko rezerwacje i poczta):</strong>
              <br />
              <span className="text-slate-600">Login:</span> employee / <span className="text-slate-600">Hasło:</span> employee123
            </li>
          </ul>
        </div>

      </div>
    </div>
  );
}
