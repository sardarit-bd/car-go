"use client";

import SearchForm from "@/app/components/SearchForm";
import { useApp } from "@/app/context/AppContext";
import useVehicles from "@/app/hooks/useVehicles";
import { Briefcase, Search, Users, Fuel, Settings } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function Vehicles() {
  const { lang, t, searchParams } = useApp();

  const initialApiParams = searchParams?.pickupDate ? {
    location: searchParams.pickupLocation,
    pickupDate: searchParams.pickupDate,
    returnDate: searchParams.returnDate,
  } : {};

  const [searchTerm, setSearchTerm] = useState("");
  const [seatsFilter, setSeatsFilter] = useState("all");
  const [transmissionFilter, setTransmissionFilter] = useState("all");

  const { vehicles, loading, error, updateApiParams, updateClientFilters } = useVehicles(initialApiParams);

  const handleSearchFormSubmit = (searchData) => {
    updateApiParams({
      location: searchData.pickupLocation,
      pickupDate: searchData.pickupDate,
      returnDate: searchData.returnDate,
    });
  };

  const handleSearchTermChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    updateClientFilters({ searchTerm: value });
  };

  const handleSeatsFilterChange = (e) => {
    const value = e.target.value;
    setSeatsFilter(value);
    updateApiParams({ seats: value === "all" ? undefined : parseInt(value, 10) });
  };

  const handleTransmissionFilterChange = (e) => {
    const value = e.target.value;
    setTransmissionFilter(value);
    updateClientFilters({ transmission: value });
  };

  const renderCarSvg = () => (
    <svg className="w-full max-w-[200px] opacity-80" viewBox="0 0 500 220" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M70 120 C 130 115, 230 115, 270 95 C 310 75, 360 70, 390 90 C 420 110, 440 120, 460 120 C 480 120, 490 135, 490 145 L 490 165 C 490 170, 480 175, 470 175 C 450 175, 430 175, 410 175 C 400 160, 375 160, 365 175 C 320 175, 180 175, 135 175 C 125 160, 100 160, 90 175 C 60 175, 30 170, 20 165 C 15 160, 10 145, 10 135 C 10 128, 30 122, 70 120 Z" fill="#64748b" stroke="#cbd5e1" strokeWidth="2.5" />
      <path d="M120 125 C 170 120, 260 120, 280 105 L 340 105 C 375 120, 390 125, 430 125" stroke="#FF0000" strokeWidth="3.5" strokeLinecap="round" />
      <circle cx="112" cy="175" r="26" fill="#1e293b" stroke="#cbd5e1" strokeWidth="4" />
      <circle cx="382" cy="175" r="26" fill="#1e293b" stroke="#cbd5e1" strokeWidth="4" />
    </svg>
  );

  return (
    <div className="relative">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808005_1px,transparent_1px),linear-gradient(to_bottom,#80808005_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 relative z-10">

        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto mb-12 sm:mb-16">
          <span className="text-brand-red font-bold text-sm tracking-wide flex items-center justify-center gap-1">
            <span className="text-brand-red">*</span> {t("navVehicles")}
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900">
            {lang === "pl" ? "Nasza Flota Pojazdów" : "Our Vehicle Fleet"}
          </h1>
          <p className="text-base sm:text-lg text-slate-500 font-medium leading-relaxed max-w-2xl mx-auto">
            {lang === "pl" 
              ? "Porównaj dostępne modele i wybierz idealny środek transportu. Gwarantujemy przejrzystość cenową." 
              : "Compare available models and select the ideal vehicle. We guarantee price transparency."}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Left Sidebar - Search Form */}
          <div className="lg:col-span-4 sticky top-36 hidden lg:block">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <SearchForm vertical={true} onSearch={handleSearchFormSubmit} />
            </div>
          </div>

          {/* Right Content */}
          <div className="lg:col-span-8 space-y-6">

            {/* Filter Bar */}
            <div className="bg-white border border-slate-200 p-4 sm:p-5 rounded-2xl shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4 items-center">

                {/* Search Input */}
                <div className="md:col-span-6 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder={lang === "pl" ? "Wyszukaj markę, model, klasę..." : "Search brand, model, class..."}
                    value={searchTerm}
                    onChange={handleSearchTermChange}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm font-medium focus:outline-none focus:border-brand-red focus:bg-white transition placeholder-slate-400"
                  />
                </div>

                {/* Seats Filter */}
                <div className="md:col-span-3">
                  <select
                    value={seatsFilter}
                    onChange={handleSeatsFilterChange}
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
                    onChange={handleTransmissionFilterChange}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-700 px-4 py-3 rounded-xl focus:outline-none focus:border-brand-red focus:bg-white text-sm font-medium cursor-pointer transition"
                  >
                    <option value="all">{lang === "pl" ? "Dowolna skrzynia" : "All Transmissions"}</option>
                    <option value="automatic">{t("gearAuto")}</option>
                    <option value="manual">{t("gearManual")}</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="text-center py-16 border border-slate-200 rounded-2xl bg-white shadow-sm">
                <div className="inline-flex items-center gap-3 text-slate-500 font-semibold">
                  <div className="w-5 h-5 border-2 border-brand-red border-t-transparent rounded-full animate-spin"></div>
                  <p>{lang === "pl" ? "Ładowanie pojazdów..." : "Loading vehicles..."}</p>
                </div>
              </div>
            )}

            {/* Error State */}
            {error && !loading && (
              <div className="text-center py-16 border border-red-200 rounded-2xl bg-red-50 shadow-sm">
                <p className="text-red-600 font-semibold">{lang === "pl" ? "Błąd podczas pobierania pojazdów." : "Error fetching vehicles."}</p>
              </div>
            )}

            {/* Vehicle List */}
            {!loading && !error && vehicles.length > 0 ? (
              <div className="space-y-5">
                {vehicles.map((car) => (
                  <div
                    key={car.id}
                    className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:border-brand-red/30 transition-all duration-300 hover:-translate-y-1 flex flex-col md:flex-row items-stretch"
                  >
                    {/* Image Section */}
                    <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-6 flex justify-center items-center border-b md:border-b-0 md:border-r border-slate-100 relative overflow-hidden w-full md:w-72 lg:w-80 flex-shrink-0">
                      {car.image || car.id === "fiat-500" ? (
                        <img
                          src={`http://localhost:5000${car.image}` || "/fiat500.png"}
                          alt={`${car.brand} ${car.model}`}
                          className="h-32 md:h-36 w-auto object-contain transition duration-500 group-hover:scale-110"
                        />
                      ) : (
                        renderCarSvg()
                      )}
                      
                      {/* Badges */}
                      <div className="absolute top-4 left-4 flex flex-col gap-2">
                        <span className="px-3 py-1 bg-white/95 backdrop-blur-sm text-[10px] text-slate-800 rounded-full font-black uppercase shadow-md border border-slate-200/50">
                          {car.class.split(" ")[0]}
                        </span>
                      </div>
                      <div className="absolute top-4 right-4">
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
                        <div className="flex flex-col items-center justify-center text-center">
                          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mb-1.5 group-hover:bg-brand-red/10 transition-colors duration-300">
                            <Users className="w-4 h-4 text-slate-600 group-hover:text-brand-red transition-colors duration-300" />
                          </div>
                          <span className="text-[10px] text-slate-500 font-bold">
                            {car.seats} {t("seatsUnit")}
                          </span>
                        </div>
                        <div className="flex flex-col items-center justify-center text-center border-l border-r border-slate-100">
                          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mb-1.5 group-hover:bg-brand-red/10 transition-colors duration-300">
                            <Briefcase className="w-4 h-4 text-slate-600 group-hover:text-brand-red transition-colors duration-300" />
                          </div>
                          <span className="text-[10px] text-slate-500 font-bold">
                            {car.luggage} {t("luggageUnit")}
                          </span>
                        </div>
                        <div className="flex flex-col items-center justify-center text-center">
                          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mb-1.5 group-hover:bg-brand-red/10 transition-colors duration-300">
                            <Settings className="w-4 h-4 text-slate-600 group-hover:text-brand-red transition-colors duration-300" />
                          </div>
                          <span className="text-[10px] text-slate-500 font-bold">
                            {car.transmission === "Automatic" ? t("gearAuto") : t("gearManual")}
                          </span>
                        </div>
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
                ))}
              </div>
            ) : (
              !loading && !error && (
                <div className="text-center py-16 border border-slate-200 rounded-2xl bg-white shadow-sm">
                  <p className="text-slate-500 font-semibold">
                    {lang === "pl" ? "Brak pojazdów spełniających kryteria wyszukiwania." : "No vehicles match the selected filters."}
                  </p>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}