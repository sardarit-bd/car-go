"use client";

import SearchForm from "@/app/components/SearchForm";
import { useApp } from "@/app/context/AppContext";
import { Briefcase, Search, Users } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function Vehicles() {
  const { lang, vehicles, t } = useApp();
  const [searchTerm, setSearchTerm] = useState("");
  const [seatsFilter, setSeatsFilter] = useState("all");
  const [transmissionFilter, setTransmissionFilter] = useState("all");

  const filteredVehicles = vehicles.filter((car) => {
    const matchesSearch =
      car.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.class.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSeats = seatsFilter === "all" || car.seats === parseInt(seatsFilter);

    const matchesTransmission =
      transmissionFilter === "all" || car.transmission.toLowerCase() === transmissionFilter.toLowerCase();

    return matchesSearch && matchesSeats && matchesTransmission;
  });

  const renderCarSvg = () => (
    <svg className="w-full max-w-[200px]" viewBox="0 0 500 220" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M70 120 C 130 115, 230 115, 270 95 C 310 75, 360 70, 390 90 C 420 110, 440 120, 460 120 C 480 120, 490 135, 490 145 L 490 165 C 490 170, 480 175, 470 175 C 450 175, 430 175, 410 175 C 400 160, 375 160, 365 175 C 320 175, 180 175, 135 175 C 125 160, 100 160, 90 175 C 60 175, 30 170, 20 165 C 15 160, 10 145, 10 135 C 10 128, 30 122, 70 120 Z" fill="#64748b" stroke="#cbd5e1" strokeWidth="2.5" />
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
          {lang === "pl" ? "Porównaj dostępne modele i wybierz idealny środek transportu. Gwarantujemy przejrzystość cenową." : "Compare available models and select the ideal vehicle. We guarantee price transparency."}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Sticky Left Sidebar Reservation Panel */}
        <div className="lg:col-span-4 sticky top-36 hidden lg:block">
          <SearchForm vertical={true} />
        </div>

        {/* Right Content: Search, Filters and Vehicle List */}
        <div className="lg:col-span-8 space-y-8">

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

            {/* Seats filter */}
            <div className="md:col-span-3">
              <select
                value={seatsFilter}
                onChange={(e) => setSeatsFilter(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-700 px-3.5 py-2.5 rounded-lg focus:outline-none focus:border-brand-red text-sm font-semibold cursor-pointer"
              >
                <option value="all">{t("seatsFilterAll")}</option>
                <option value="4">{t("seatsFilter4")}</option>
                <option value="5">{t("seatsFilter5")}</option>
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

          {/* List Layout of Vehicles */}
          {filteredVehicles.length > 0 ? (
            <div className="space-y-6">
              {filteredVehicles.map((car) => (
                <div
                  key={car.id}
                  className="group bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md hover:border-slate-200 transition-all duration-300 flex flex-col md:flex-row items-stretch"
                >
                  {/* Left Side: Larger image */}
                  <div className="bg-slate-50/70 p-6 flex justify-center items-center border-b md:border-b-0 md:border-r border-slate-100 relative overflow-hidden w-full md:w-72 lg:w-80 flex-shrink-0">
                    {car.image || car.id === "fiat-500" ? (
                      <img
                        src={car.image || "/fiat500.png"}
                        alt={`${car.brand} ${car.model}`}
                        className="h-32 md:h-36 w-auto object-contain transition duration-300 group-hover:scale-105"
                      />
                    ) : (
                      renderCarSvg()
                    )}
                    <span className="absolute top-3 left-3 px-2 py-0.5 bg-slate-200/60 text-[10px] text-slate-705 rounded font-bold uppercase border border-slate-200/30">
                      Class {car.class.split(" ")[0]}
                    </span>
                    <span className={`absolute top-3 right-3 px-2 py-0.5 rounded text-[10px] font-black text-white uppercase ${car.fuel.toLowerCase() === "petrol" ? "bg-green-700" : "bg-slate-800"
                      }`}>
                      {car.fuel === "Petrol" ? t("fuelPetrol") : t("fuelDiesel")}
                    </span>
                  </div>

                  {/* Right Side: Specs and CTA buttons */}
                  <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-baseline gap-2">
                      <div>
                        <h3 className="text-xl font-black text-slate-800 group-hover:text-brand-red transition">
                          {car.brand} {car.model}
                        </h3>
                        <p className="text-xs text-slate-400 font-bold uppercase mt-0.5">Klasa {car.class}</p>
                      </div>
                      <div className="sm:text-right">
                        <span className="text-[10px] text-slate-400 font-bold uppercase">{t("priceFrom")}</span>
                        <p className="text-lg font-black text-slate-900 leading-none">
                          PLN {car.price}
                          <span className="text-xs text-slate-500 font-normal">{t("dayUnit")}</span>
                        </p>
                      </div>
                    </div>

                    <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                      {lang === "pl" ? car.description : car.descriptionEn}
                    </p>

                    {/* Specs Row */}
                    <div className="flex flex-wrap gap-4 py-3 border-t border-b border-slate-100 text-xs text-slate-505 font-bold items-center">
                      <span className="flex items-center space-x-1.5">
                        <Users className="w-4 h-4 text-slate-400" />
                        <span>{car.seats} {t("seatsUnit")}</span>
                      </span>
                      <span className="flex items-center space-x-1.5 border-l border-slate-100 pl-4">
                        <Briefcase className="w-4 h-4 text-slate-400" />
                        <span>{car.luggage} {t("luggageUnit")}</span>
                      </span>
                      <span className="flex items-center space-x-1.5 border-l border-slate-100 pl-4">
                        {/* Shifter SVG icon */}
                        <svg className="w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="5" r="3" fill="currentColor" />
                          <path d="M12 8v13" />
                          <path d="M9 13h6" />
                          <path d="M9 13v5" />
                          <path d="M15 13v5" />
                        </svg>
                        <span>{car.transmission === "Automatic" ? t("gearAuto") : t("gearManual")}</span>
                      </span>
                    </div>

                    <div className="flex space-x-3 pt-1">
                      <Link
                        href={`/vehicles/${car.id}`}
                        className="flex-grow sm:flex-none text-center px-6 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs text-slate-700 font-bold rounded-lg transition"
                      >
                        {t("specifications").toUpperCase()}
                      </Link>
                      <Link
                        href={`/checkout?step=1&car=${car.id}`}
                        className="flex-grow sm:flex-none text-center px-6 py-2 bg-brand-red hover:bg-brand-red-hover text-xs text-white font-bold rounded-lg transition"
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
      </div>
    </div>
  );
}
