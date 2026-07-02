"use client";

import { Briefcase, Settings, Users, Fuel, Cog } from "lucide-react";
import Link from "next/link";
import { useApp } from "@/app/context/AppContext";

function renderCarSvg() {
  return (
    <svg className="w-full max-w-lg mx-auto opacity-80 drop-shadow-[0_10px_20px_rgba(255,0,0,0.1)]" viewBox="0 0 500 220" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M70 120 C 130 115, 230 115, 270 95 C 310 75, 360 70, 390 90 C 420 110, 440 120, 460 120 C 480 120, 490 135, 490 145 L 490 165 C 490 170, 480 175, 470 175 C 450 175, 430 175, 410 175 C 400 160, 375 160, 365 175 C 320 175, 180 175, 135 175 C 125 160, 100 160, 90 175 C 60 175, 30 170, 20 165 C 15 160, 10 145, 10 135 C 10 128, 30 122, 70 120 Z" fill="#64748b" stroke="#cbd5e1" strokeWidth="2.5" />
      <path d="M120 125 C 170 120, 260 120, 280 105 L 340 105 C 375 120, 390 125, 430 125" stroke="#FF0000" strokeWidth="3.5" strokeLinecap="round" />
      <circle cx="112" cy="175" r="26" fill="#1e293b" stroke="#cbd5e1" strokeWidth="4" />
      <circle cx="112" cy="175" r="14" fill="#334155" />
      <circle cx="382" cy="175" r="26" fill="#1e293b" stroke="#cbd5e1" strokeWidth="4" />
      <circle cx="382" cy="175" r="14" fill="#334155" />
      <path d="M280 102 L 315 72 C 322 65, 335 63, 345 68 L 388 90 C 395 93, 398 100, 395 107 Z" fill="#0f172a" stroke="#cbd5e1" strokeWidth="1.5" />
    </svg>
  );
}

export default function VehicleCard({ car, lang, t }) {
  const { searchParams } = useApp();
  
  // Calculate total price if dates are selected
  const days = searchParams?.days || 0;
  const hasDates = days > 0;
  const totalPrice = hasDates ? car.price * days : 0;

  return (
    <div className="lg:w-[48%] group bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 flex flex-col">
      {/* Image Section */}
      <div className="relative bg-gradient-to-br from-slate-50 to-slate-100 h-56 flex justify-center items-center overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:20px_20px] opacity-50" />
        
        {car.image ? (
          <img
            src={`http://localhost:5000${car.image}`}
            alt={`${car.brand} ${car.model}`}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="p-8">
            {renderCarSvg()}
          </div>
        )}

        {/* Floating Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <span className="px-3 py-1.5 bg-white/90 backdrop-blur-sm text-[11px] text-slate-700 rounded-full font-bold uppercase border border-slate-200/50 shadow-sm">
            {car.class.split(" ")[0]}
          </span>
        </div>

        <div className="absolute top-4 right-4">
          <span className={`px-3 py-1.5 rounded-full text-[11px] font-bold text-white uppercase backdrop-blur-sm shadow-lg ${
            car.fuel.toLowerCase() === "petrol" 
              ? "bg-green-600/90" 
              : "bg-slate-800/90"
          }`}>
            <Fuel className="w-3 h-3 inline-block mr-1" />
            {car.fuel === "Petrol" ? t("fuelPetrol") : t("fuelDiesel")}
          </span>
        </div>

        {/* Bottom Gradient Overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white/80 to-transparent pointer-events-none" />
      </div>

      {/* Content Section */}
      <div className="p-4 flex-1 flex flex-col">
        {/* Title and Price */}
        <div className="flex flex-col justify-between items-start mb-6 ">
          <div className="w-full min-w-0">
            <h3 className="text-xl font-black text-slate-900 group-hover:text-brand-red transition-colors duration-300 mb-1">
              {car.brand} {car.model}
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              {car.class}
            </p>
          </div>
          <div className="w-full flex   justify-between items-center shrink-0 ">
          <div className="">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">
              {t("priceFrom")}
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-slate-900">
                {car.price}
              </span>
              <span className="text-sm font-bold text-slate-500">
                PLN{t("dayUnit")}
              </span>
            </div>
          </div>

            
            {/* Show total price when dates are selected */}
            {hasDates && (
              <div className="mt-2 pt-2 border-t border-slate-100">
                <p className="text-[10px] text-slate-500 font-bold uppercase">
                  {lang === "pl" ? "Cena za" : "Total for"} {days} {lang === "pl" ? "dni" : "days"}
                </p>
                <p className="text-lg text-right font-black text-brand-red leading-none mt-1">
                  {totalPrice} PLN
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Specs Grid */}
        <div className="grid grid-cols-3 gap-3 py-4 mb-6 border-t border-slate-100">
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-brand-red/10 transition-colors duration-300">
              <Users className="w-5 h-5 text-slate-600 group-hover:text-brand-red transition-colors duration-300" />
            </div>
            <div className="text-center">
              <span className="block text-sm font-bold text-slate-900">{car.seats}</span>
              <span className="text-[10px] text-slate-500 uppercase">{t("seatsUnit")}</span>
            </div>
          </div>
          
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-brand-red/10 transition-colors duration-300">
              <Briefcase className="w-5 h-5 text-slate-600 group-hover:text-brand-red transition-colors duration-300" />
            </div>
            <div className="text-center">
              <span className="block text-sm font-bold text-slate-900">{car.luggage}</span>
              <span className="text-[10px] text-slate-500 uppercase">{t("luggageUnit")}</span>
            </div>
          </div>
          
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-brand-red/10 transition-colors duration-300">
              <Cog className="w-5 h-5 text-slate-600 group-hover:text-brand-red transition-colors duration-300" />
            </div>
            <div className="text-center">
              <span className="block text-sm font-bold text-slate-900">
                {car.transmission === "Automatic" ? t("gearAuto").slice(0, 4) : t("gearManual").slice(0, 3)}
              </span>
              <span className="text-[10px] text-slate-500 uppercase">
                {car.transmission}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-auto">
          <Link
            href={`/vehicles/${car.id}`}
            className="flex-1 text-center py-3 bg-slate-100 hover:bg-slate-200 text-xs text-slate-700 font-bold rounded-xl transition-all duration-300 hover:shadow-md"
          >
            {t("specifications").toUpperCase()}
          </Link>
          <Link
            href={`/checkout?step=2&car=${car.id}`}
            className="flex-1 text-center py-3 bg-brand-red hover:bg-brand-red-hover text-xs text-white font-bold rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-brand-red/30 hover:-translate-y-0.5"
          >
            {t("reserveBtn")}
          </Link>
        </div>
      </div>
    </div>
  );
}