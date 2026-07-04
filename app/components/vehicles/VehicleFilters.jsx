"use client";

import { Search } from "lucide-react";

export default function VehicleFilters({ 
  lang, 
  t, 
  searchTerm, 
  onSearchChange, 
  seatsFilter, 
  onSeatsChange, 
  transmissionFilter, 
  onTransmissionChange 
}) {
  return (
    <div className="bg-white border border-slate-200 p-4 sm:p-5 rounded-2xl shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4 items-center">
        {/* Search Input */}
        <div className="md:col-span-6 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder={lang === "pl" ? "Wyszukaj markę, model, klasę..." : "Search brand, model, class..."}
            value={searchTerm}
            onChange={onSearchChange}
            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm font-medium focus:outline-none focus:border-brand-red focus:bg-white transition placeholder-slate-400"
          />
        </div>

        {/* Seats Filter */}
        <div className="md:col-span-3">
          <select
            value={seatsFilter}
            onChange={onSeatsChange}
            className="w-full bg-slate-50 border border-slate-200 text-slate-700 px-4 py-3 rounded-xl focus:outline-none focus:border-brand-red focus:bg-white text-sm font-medium cursor-pointer transition"
          >
            <option value="all">{t("seatsFilterAll")}</option>
            <option value="4">{t("seatsFilter4")}</option>
            <option value="5">{t("seatsFilter5")}</option>
          </select>
        </div>

        {/* Transmission Filter */}
        <div className="md:col-span-3">
          <select
            value={transmissionFilter}
            onChange={onTransmissionChange}
            className="w-full bg-slate-50 border border-slate-200 text-slate-700 px-4 py-3 rounded-xl focus:outline-none focus:border-brand-red focus:bg-white text-sm font-medium cursor-pointer transition"
          >
            <option value="all">{lang === "pl" ? "Dowolna skrzynia" : "All Transmissions"}</option>
            <option value="automatic">{t("gearAuto")}</option>
            <option value="manual">{t("gearManual")}</option>
          </select>
        </div>
      </div>
    </div>
  );
}