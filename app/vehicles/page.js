"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useApp } from "@/app/context/AppContext";
import { Users, Briefcase, Settings, Search, Fuel } from "lucide-react";

export default function Vehicles() {
  const { lang, vehicles, t } = useApp();
  const [searchTerm, setSearchTerm] = useState("");
  const [fuelFilter, setFuelFilter] = useState("all");
  const [transmissionFilter, setTransmissionFilter] = useState("all");

  const filteredVehicles = vehicles.filter((car) => {
    const matchesSearch =
      car.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.class.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFuel = fuelFilter === "all" || car.fuel.toLowerCase() === fuelFilter.toLowerCase();
    
    const matchesTransmission =
      transmissionFilter === "all" || car.transmission.toLowerCase() === transmissionFilter.toLowerCase();

    return matchesSearch && matchesFuel && matchesTransmission;
  });

  const renderCarSvg = () => (
    <svg className="w-full max-w-[200px]" viewBox="0 0 500 220" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M70 120 C 130 115, 230 115, 270 95 C 310 75, 360 70, 390 90 C 420 110, 440 120, 460 120 C 480 120, 490 135, 490 145 L 490 165 C 490 170, 480 175, 470 175 C 450 175, 430 175, 410 175 C 400 160, 375 160, 365 175 C 320 175, 180 175, 135 175 C 125 160, 100 160, 90 175 C 60 175, 30 170, 20 165 C 15 160, 10 145, 10 135 C 10 128, 30 122, 70 120 Z" fill="#64748b" stroke="#cbd5e1" strokeWidth="2.5"/>
      <path d="M120 125 C 170 120, 260 120, 280 105 L 340 105 C 375 120, 390 125, 430 125" stroke="#FF0000" strokeWidth="3.5" strokeLinecap="round" />
      <circle cx="112" cy="175" r="26" fill="#1e293b" stroke="#cbd5e1" strokeWidth="4" />
      <circle cx="382" cy="175" r="26" fill="#1e293b" stroke="#cbd5e1" strokeWidth="4" />
    </svg>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
      
      {/* Title Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-800 uppercase">{t("navVehicles")}</h1>
        <p className="text-sm font-semibold text-slate-500">
          Porównaj dostępne modele i wybierz idealny środek transportu. Gwarantujemy przejrzystość cenową.
        </p>
      </div>

      {/* Search & Filter Controls */}
      <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        {/* Search */}
        <div className="md:col-span-6 relative">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder={lang === "pl" ? "Wyszukaj markę, model, klasę..." : "Search brand, model, class..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-850 text-sm font-semibold focus:outline-none focus:border-brand-red placeholder-slate-400"
          />
        </div>

        {/* Fuel filter */}
        <div className="md:col-span-3">
          <select
            value={fuelFilter}
            onChange={(e) => setFuelFilter(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 text-slate-700 px-3.5 py-2.5 rounded-lg focus:outline-none focus:border-brand-red text-sm font-semibold cursor-pointer"
          >
            <option value="all">{lang === "pl" ? "Wszystkie paliwa" : "All Fuel Types"}</option>
            <option value="petrol">{t("fuelPetrol")}</option>
            <option value="diesel">{t("fuelDiesel")}</option>
          </select>
        </div>

        {/* Transmission filter */}
        <div className="md:col-span-3">
          <select
            value={transmissionFilter}
            onChange={(e) => setTransmissionFilter(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 text-slate-700 px-3.5 py-2.5 rounded-lg focus:outline-none focus:border-brand-red text-sm font-semibold cursor-pointer"
          >
            <option value="all">{lang === "pl" ? "Dowolna skrzynia" : "All Transmissions"}</option>
            <option value="automatic">{t("gearAuto")}</option>
            <option value="manual">{t("gearManual")}</option>
          </select>
        </div>
      </div>

      {/* Grid List */}
      {filteredVehicles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {filteredVehicles.map((car) => (
            <div
              key={car.id}
              className="group bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-300 hover:translate-y-[-4px]"
            >
              {/* Graphic Header */}
              <div className="bg-slate-50/70 p-6 flex justify-center items-center border-b border-slate-100 relative overflow-hidden h-40">
                {car.image || car.id === "fiat-500" ? (
                  <img
                    src={car.image || "/fiat500.png"}
                    alt={`${car.brand} ${car.model}`}
                    className="h-28 w-auto object-contain transition duration-300 group-hover:scale-105"
                  />
                ) : (
                  renderCarSvg()
                )}
                <span className="absolute top-3 left-3 px-2 py-0.5 bg-slate-200/60 text-[10px] text-slate-700 rounded font-bold uppercase border border-slate-200/30">
                  Class {car.class.split(" ")[0]}
                </span>
                <span className={`absolute top-3 right-3 px-2 py-0.5 rounded text-[10px] font-black text-white uppercase ${
                  car.fuel.toLowerCase() === "petrol" ? "bg-green-700" : "bg-slate-800"
                }`}>
                  {car.fuel === "Petrol" ? t("fuelPetrol") : t("fuelDiesel")}
                </span>
              </div>

              {/* Specs body */}
              <div className="p-5 space-y-4">
                <div className="flex justify-between items-baseline">
                  <h3 className="text-lg font-black text-slate-855 group-hover:text-brand-red transition">
                    {car.brand} {car.model}
                  </h3>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">{t("priceFrom")}</span>
                    <p className="text-base font-extrabold text-slate-900">
                      PLN {car.price}
                      <span className="text-xs text-slate-500 font-normal">{t("dayUnit")}</span>
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 py-2 border-t border-b border-slate-100 text-xs text-slate-500 font-bold">
                  <span className="flex items-center space-x-1 justify-center">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <span>{car.seats} {t("seatsUnit").slice(0, 1)}</span>
                  </span>
                  <span className="flex items-center space-x-1 justify-center border-l border-slate-100 border-r">
                    <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                    <span>{car.luggage} {t("luggageUnit").slice(0, 3)}</span>
                  </span>
                  <span className="flex items-center space-x-1 justify-center">
                    <Settings className="w-3.5 h-3.5 text-slate-400" />
                    <span>{car.transmission === "Automatic" ? t("gearAuto").slice(0, 4) : t("gearManual").slice(0, 3)}</span>
                  </span>
                </div>

                <p className="text-xs text-slate-500 font-semibold line-clamp-2 leading-relaxed">
                  {lang === "pl" ? car.description : car.descriptionEn}
                </p>

                <div className="flex space-x-3 pt-2">
                  <Link
                    href={`/vehicles/${car.id}`}
                    className="flex-1 text-center py-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs text-slate-700 font-bold rounded-lg transition"
                  >
                    SPECYFIKACJA / SPECS
                  </Link>
                  <Link
                    href={`/checkout?step=1&car=${car.id}`}
                    className="flex-1 text-center py-2 bg-brand-red hover:bg-brand-red-hover text-xs text-white font-bold rounded-lg transition"
                  >
                    {t("reserveBtn")}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border border-slate-200 rounded-2xl bg-white text-slate-500 font-semibold shadow-sm">
          <p>{lang === "pl" ? "Brak pojazdów spełniających kryteria wyszukiwania." : "No vehicles match the selected filters."}</p>
        </div>
      )}

    </div>
  );
}
