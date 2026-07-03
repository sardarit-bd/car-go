"use client";

import React from "react";
import { useApp } from "@/app/context/AppContext";
import { Mail } from "lucide-react";

export default function EmailsTab() {
  const { emails } = useApp();

  return (
    <div className="glass-panel p-6 rounded-2xl space-y-5">
      <h2 className="text-base font-extrabold text-slate-800 border-b border-slate-100 pb-3 uppercase tracking-wider flex items-center space-x-2">
        <Mail className="w-5 h-5 text-brand-red animate-pulse" />
        <span>Skrzynka reservations@car-go.pl ({emails.length})</span>
      </h2>
      <div className="space-y-4">
        {emails.map((email) => (
          <div
            key={email.id}
            className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-2 text-xs font-semibold"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-slate-400 border-b border-slate-100 pb-1.5 text-[10px]">
              <span>
                DO / TO:{" "}
                <strong className="text-slate-800">{email.to}</strong>
              </span>
              <span>WYŚLANO: {email.date}</span>
            </div>
            <p className="text-slate-800 font-extrabold text-xs">
              TEMAT: {email.subject}
            </p>
            <pre className="text-[10px] text-slate-600 whitespace-pre-wrap font-mono bg-white p-3 rounded leading-normal border border-slate-150 shadow-sm">
              {email.body}
            </pre>
          </div>
        ))}
        {emails.length === 0 && (
          <p className="text-center text-slate-400 py-6">
            Brak zarejestrowanych wysyłek e-mail.
          </p>
        )}
      </div>
    </div>
  );
}