"use client";

import { AlertTriangle, ShieldCheck } from "lucide-react";

export default function VehicleDetailsActions({ car, t, lang, onBookNow }) {
  return (
    <div className="space-y-4">
      {/* Deposit Warning */}
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <p className="text-[10px] text-amber-600 font-bold uppercase tracking-wider">
              {t("depositLabel")}
            </p>
            <p className="text-lg text-slate-900 font-black">
              PLN {car.deposit}
            </p>
          </div>
        </div>
      </div>

      {/* Guarantee Badge */}
      <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
        </div>
        <p className="text-sm text-emerald-900 font-bold leading-tight">
          {lang === "pl" 
            ? "Nielimitowany przebieg oraz ubezpieczenie OC w cenie!" 
            : "Unlimited mileage and liability insurance included!"}
        </p>
      </div>

      {/* Book Now Button */}
      <button
        onClick={onBookNow}
        className="w-full py-4 bg-brand-red hover:bg-brand-red-hover text-white text-sm font-black tracking-wider uppercase rounded-2xl shadow-lg shadow-brand-red/20 hover:shadow-brand-red/40 transition-all duration-300 hover:-translate-y-0.5"
      >
        {t("reserveBtn")}
      </button>
    </div>
  );
}