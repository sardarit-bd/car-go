"use client";

import React from "react";
import Link from "next/link";
import { useApp } from "@/app/context/AppContext";
import { CheckCircle, Sparkles, Phone } from "lucide-react";

export default function SidebarCTA() {
  const { lang, t } = useApp();

  const marketingSlogans = [t("motto1"), t("motto2"), t("motto3"), t("motto4")];

  return (
    <div className="glass-panel border-slate-100 p-6 rounded-2xl glow-red shadow-xl bg-white/95 w-full space-y-6 relative overflow-hidden">
      <div className="absolute -right-10 -top-10 w-32 h-32 bg-brand-red/5 rounded-full filter blur-2xl pointer-events-none" />
      <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-brand-red/5 border border-brand-red/15 rounded-full text-[10px] font-bold text-brand-red">
        <Sparkles className="w-3 h-3 animate-pulse" />
        <span>{t("tagline")}</span>
      </div>
      <div className="space-y-2">
        <h3 className="text-xl font-extrabold tracking-tight text-slate-900 leading-tight">
          <span className="text-gradient block">{t("searchTitle")}</span>
        </h3>
        <p className="text-xs text-slate-500 font-semibold leading-relaxed">
          {lang === "pl"
            ? "Zarezerwuj idealny samochód online z odbiorem we wskazanej lokalizacji lub dostawą pod drzwi."
            : "Reserve the ideal car online with collection at a chosen location or home delivery."}
        </p>
      </div>
      <div className="space-y-3 pt-2">
        {marketingSlogans.map((slogan, index) => (
          <div
            key={index}
            className="flex items-center space-x-2.5 text-xs text-slate-700 font-semibold"
          >
            <CheckCircle className="w-4 h-4 text-brand-red flex-shrink-0" />
            <span>{slogan}</span>
          </div>
        ))}
      </div>
      <div className="pt-2 space-y-4">
        <Link
          href="/vehicles"
          className="w-full inline-flex justify-center items-center py-3 px-4 bg-brand-red hover:bg-brand-red-hover text-white text-xs font-black tracking-widest uppercase rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 text-center"
        >
          {lang === "pl" ? "SPRAWDŹ POJAZDY" : "VIEW VEHICLES"}
        </Link>
        <div className="flex flex-col items-center space-y-1 text-[10px] text-slate-400 font-bold border-t border-slate-100 pt-4">
          <div className="flex items-center space-x-1.5">
            <Phone className="w-3.5 h-3.5 text-brand-red" />
            <span className="text-slate-700 font-black">+48 789 200 100</span>
          </div>
          <span className="text-[9px] font-semibold text-slate-450">
            {t("phoneHours")}
          </span>
        </div>
      </div>
    </div>
  );
}
