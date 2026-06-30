"use client";

import { Briefcase, Users, Settings, Fuel } from "lucide-react";
import Link from "next/link";

function renderCarSvg() {
  return (
    <svg className="w-full max-w-[200px] opacity-80" viewBox="0 0 500 220" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M70 120 C 130 115, 230 115, 270 95 C 310 75, 360 70, 390 90 C 420 110, 440 120, 460 120 C 480 120, 490 135, 490 145 L 490 165 C 490 170, 480 175, 470 175 C 450 175, 430 175, 410 175 C 400 160, 375 160, 365 175 C 320 175, 180 175, 135 175 C 125 160, 100 160, 90 175 C 60 175, 30 170, 20 165 C 15 160, 10 145, 10 135 C 10 128, 30 122, 70 120 Z" fill="#64748b" stroke="#cbd5e1" strokeWidth="2.5" />
      <path d="M120 125 C 170 120, 260 120, 280 105 L 340 105 C 375 120, 390 125, 430 125" stroke="#FF0000" strokeWidth="3.5" strokeLinecap="round" />
      <circle cx="112" cy="175" r="26" fill="#1e293b" stroke="#cbd5e1" strokeWidth="4" />
      <circle cx="382" cy="175" r="26" fill="#1e293b" stroke="#cbd5e1" strokeWidth="4" />
    </svg>
  );
}

export default function VehicleCard({ car, lang, t }) {
  return (
    <div className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:border-brand-red/30 transition-all duration-300 hover:-translate-y-1 flex flex-col md:flex-row">
      {/* Image Section - Full Coverage */}
      <div className="relative w-full md:w-80 lg:w-96 flex-shrink-0 overflow-hidden bg-gradient-to-br bg-white">
        {/* Image Container - Full Height */}
        <div className="absolute inset-0 flex items-center justify-center p-8">
          {car.image ? (
            <img
              src={`http://localhost:5000${car.image}`}
              alt={`${car.brand} ${car.model}`}
              className="w-full h-full object-contain transition duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="w-full flex items-center justify-center py-12">
              {renderCarSvg()}
            </div>
          )}
        </div>
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
          <span className="px-3 py-1 bg-white/95 backdrop-blur-sm text-[10px] text-slate-800 rounded-full font-black uppercase shadow-md border border-slate-200/50">
            {car.class.split(" ")[0]}
          </span>
        </div>
        <div className="absolute top-4 right-4 z-10">
          <span className={`px-3 py-1 rounded-full text-[10px] font-black text-white uppercase shadow-md flex items-center gap-1 ${
            car.fuel.toLowerCase() === "petrol" ? "bg-emerald-600" : "bg-slate-700"
          }`}>
            <Fuel className="w-3 h-3" />
            {car.fuel === "Petrol" ? t("fuelPetrol") : t("fuelDiesel")}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
        {/* Title & Price */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-baseline gap-3">
          <div>
            <h3 className="text-xl font-black text-slate-900 group-hover:text-brand-red transition-colors duration-300 mb-1">
              {car.brand} {car.model}
            </h3>
            <p className="text-xs text-slate-500 font-bold uppercase">
              {lang === "pl" ? "Klasa" : "Class"} {car.class}
            </p>
          </div>
          <div className="sm:text-right">
            <span className="text-[10px] text-slate-400 font-bold uppercase block mb-0.5">
              {t("priceFrom")}
            </span>
            <p className="text-2xl font-black text-slate-900 leading-none">
              {car.price}
              <span className="text-xs text-slate-500 font-bold ml-1">PLN</span>
            </p>
            <span className="text-[10px] text-slate-400 font-medium">
              {t("dayUnit")}
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-slate-600 font-medium leading-relaxed">
          {lang === "pl" ? car.description : car.descriptionEn}
        </p>

        {/* Specs */}
        <div className="grid grid-cols-3 gap-3 py-4 border-t border-b border-slate-100">
          <SpecItem 
            icon={Users} 
            label={`${car.seats} ${t("seatsUnit")}`} 
            groupHover 
          />
          <SpecItem 
            icon={Briefcase} 
            label={`${car.luggage} ${t("luggageUnit")}`} 
            groupHover 
            border 
          />
          <SpecItem 
            icon={Settings} 
            label={car.transmission === "Automatic" ? t("gearAuto") : t("gearManual")} 
            groupHover 
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-1">
          <Link
            href={`/vehicles/${car.id}`}
            className="flex-grow sm:flex-none text-center px-6 py-3 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs text-slate-700 font-bold rounded-xl transition-all duration-200"
          >
            {t("specifications").toUpperCase()}
          </Link>
          <Link
            href={`/checkout?step=1&car=${car.id}`}
            className="flex-grow sm:flex-none text-center px-6 py-3 bg-brand-red hover:bg-brand-red-hover text-xs text-white font-bold rounded-xl shadow-lg shadow-brand-red/20 hover:shadow-brand-red/40 transition-all duration-200 hover:-translate-y-0.5"
          >
            {t("reserveBtn")}
          </Link>
        </div>
      </div>
    </div>
  );
}

function SpecItem({ icon: Icon, label, groupHover = false, border = false }) {
  return (
    <div className={`flex flex-col items-center justify-center text-center ${border ? 'border-l border-r border-slate-100' : ''}`}>
      <div className={`w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mb-1.5 transition-colors duration-300 ${groupHover ? 'group-hover:bg-brand-red/10' : ''}`}>
        <Icon className={`w-4 h-4 text-slate-600 transition-colors duration-300 ${groupHover ? 'group-hover:text-brand-red' : ''}`} />
      </div>
      <span className="text-[10px] text-slate-500 font-bold">
        {label}
      </span>
    </div>
  );
}