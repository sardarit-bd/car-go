"use client";

import { Fuel } from "lucide-react";

function renderCarSvgDetails() {
  return (
    <svg className="w-full max-w-md mx-auto opacity-90 drop-shadow-2xl" viewBox="0 0 500 220" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M70 120 C 130 115, 230 115, 270 95 C 310 75, 360 70, 390 90 C 420 110, 440 120, 460 120 C 480 120, 490 135, 490 145 L 490 165 C 490 170, 480 175, 470 175 C 450 175, 430 175, 410 175 C 400 160, 375 160, 365 175 C 320 175, 180 175, 135 175 C 125 160, 100 160, 90 175 C 60 175, 30 170, 20 165 C 15 160, 10 145, 10 135 C 10 128, 30 122, 70 120 Z" fill="#64748b" stroke="#cbd5e1" strokeWidth="2.5" />
      <path d="M120 125 C 170 120, 260 120, 280 105 L 340 105 C 375 120, 390 125, 430 125" stroke="#FF0000" strokeWidth="4.5" strokeLinecap="round" />
      <circle cx="112" cy="175" r="26" fill="#1e293b" stroke="#cbd5e1" strokeWidth="4" />
      <circle cx="112" cy="175" r="10" fill="#ff0000" />
      <circle cx="382" cy="175" r="26" fill="#1e293b" stroke="#cbd5e1" strokeWidth="4" />
      <circle cx="382" cy="175" r="10" fill="#ff0000" />
    </svg>
  );
}

export default function VehicleDetailsHero({ car, t }) {
  return (
    <div className="space-y-6">
      {/* Main Image Card */}
      <div className="relative bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
        {/* Badges */}
        <div className="absolute top-4 left-4 z-10 flex gap-2">
          <span className="px-3 py-1.5 bg-white/95 backdrop-blur-sm text-[10px] text-slate-800 rounded-full font-black uppercase shadow-md border border-slate-200/50">
            {car.class.split(" ")[0]}
          </span>
          <span className={`px-3 py-1.5 rounded-full text-[10px] font-black text-white uppercase shadow-md flex items-center gap-1 ${
            car.fuel.toLowerCase() === "petrol" ? "bg-emerald-600" : "bg-slate-700"
          }`}>
            <Fuel className="w-3 h-3" />
            {car.fuel === "Petrol" ? t("fuelPetrol") : t("fuelDiesel")}
          </span>
        </div>

        {/* Image Container */}
        <div className="h-64 md:h-80 flex items-center justify-center p-8">
          {car.image || car.id === "fiat-500" ? (
            <img
              src={car.image || "/fiat500.png"}
              alt={`${car.brand} ${car.model}`}
              className="h-full w-auto object-contain transition duration-500 hover:scale-105"
            />
          ) : (
            renderCarSvgDetails()
          )}
        </div>
      </div>

      {/* Info Notice */}
      <div className="p-5 bg-brand-red/5 border border-brand-red/20 rounded-2xl text-xs text-slate-700 leading-relaxed font-semibold">
        <div className="flex items-start gap-3">
          <span className="text-lg flex-shrink-0">💡</span>
          <div>
            <strong className="text-slate-900">
              {car.lang === "pl" ? "Rzeczywiste zdjęcia pojazdu:" : "Actual car photos:"}
            </strong>
            <span className="ml-1">
              {car.lang === "pl" 
                ? "Prezentowana grafika obrazuje sylwetkę wybranego modelu. Wydawany pojazd może nieznacznie różnić się kolorem lakieru i elementami wyposażenia." 
                : "Presented graphic shows the model silhouette. The actual car collected may vary in color or optional equipment."}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}