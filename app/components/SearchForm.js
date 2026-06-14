"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/app/context/AppContext";
import { Calendar, MapPin, Clock, AlertTriangle, ArrowRightLeft } from "lucide-react";

export default function SearchForm({ vertical = false }) {
  const router = useRouter();
  const { lang, locations, setSearchParams, t } = useApp();

  // Initialize with tomorrow and 3 days later
  const getTomorrowString = (offsetDays = 1) => {
    const today = new Date();
    today.setDate(today.getDate() + offsetDays);
    return today.toISOString().split("T")[0];
  };

  const [pickupLocation, setPickupLocation] = useState("Skarbimierz-Osiedle");
  const [returnLocation, setReturnLocation] = useState("Skarbimierz-Osiedle");
  const [pickupDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [pickupTime, setPickupTime] = useState("08:00");
  const [returnTime, setReturnTime] = useState("08:00");
  
  const [validationError, setValidationError] = useState("");
  const [customAddress, setCustomAddress] = useState("");
  const [customAddressReturn, setCustomAddressReturn] = useState("");

  useEffect(() => {
    setPickupDate(getTomorrowString(1));
    setReturnDate(getTomorrowString(4));
  }, []);

  const timeOptions = Array.from({ length: 13 }, (_, i) => {
    const hour = i + 8;
    return `${hour.toString().padStart(2, "0")}:00`;
  });

  const calculateDays = () => {
    if (!pickupDate || !returnDate) return 0;
    const start = new Date(`${pickupDate}T${pickupTime}`);
    const end = new Date(`${returnDate}T${returnTime}`);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const checkValidation = () => {
    setValidationError("");

    if (!pickupLocation || !returnLocation || !pickupDate || !returnDate) {
      setValidationError(t("requiredFields"));
      return false;
    }

    const start = new Date(`${pickupDate}T${pickupTime}`);
    const end = new Date(`${returnDate}T${returnTime}`);

    if (start <= new Date()) {
      setValidationError(lang === "pl" ? "Data odbioru musi być w przyszłości!" : "Pickup date must be in the future!");
      return false;
    }

    if (end <= start) {
      setValidationError(lang === "pl" ? "Data zwrotu musi być po dacie odbioru!" : "Return date must be after pickup date!");
      return false;
    }

    const diffDays = calculateDays();

    // Enforce minimum rental periods
    const getMinDaysForLocationName = (name) => {
      const loc = locations.find((l) => name.includes(l.name) || l.name.includes(name));
      return loc ? loc.minDays : 1;
    };

    const pickupMin = getMinDaysForLocationName(pickupLocation);
    const returnMin = getMinDaysForLocationName(returnLocation);
    const requiredMin = Math.max(pickupMin, returnMin);

    if (diffDays < requiredMin) {
      const warningText = t("minDaysWarning").replace("{days}", requiredMin);
      setValidationError(warningText);
      return false;
    }

    return true;
  };

  const handleSearch = (e) => {
    e.preventDefault();

    if (checkValidation()) {
      const isCustomPickup = pickupLocation.toLowerCase().includes("dostawa") || pickupLocation.toLowerCase().includes("address");
      const isCustomReturn = returnLocation.toLowerCase().includes("dostawa") || returnLocation.toLowerCase().includes("address");

      const searchData = {
        pickupLocation: isCustomPickup ? `Dostawa: ${customAddress}` : pickupLocation,
        returnLocation: isCustomReturn ? `Odbiór: ${customAddressReturn || customAddress}` : returnLocation,
        pickupDate,
        returnDate,
        pickupTime,
        returnTime,
        days: calculateDays(),
        isCustomPrice: isCustomPickup || isCustomReturn
      };

      setSearchParams(searchData);
      
      // Navigate to checkout search results page
      router.push("/checkout?step=1");
    }
  };

  const swapLocations = () => {
    const temp = pickupLocation;
    setPickupLocation(returnLocation);
    setReturnLocation(temp);
  };

  const isCustomPickup = pickupLocation.toLowerCase().includes("dostawa") || pickupLocation.toLowerCase().includes("address");
  const isCustomReturn = returnLocation.toLowerCase().includes("dostawa") || returnLocation.toLowerCase().includes("address");

  return (
    <div className={`glass-panel border-slate-100 p-6 sm:p-8 rounded-2xl glow-red shadow-xl bg-white/95 w-full`}>
      <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center space-x-2.5 border-b border-slate-100 pb-4">
        <Calendar className="w-5.5 h-5.5 text-brand-red" />
        <span>{t("searchTitle")}</span>
      </h3>

      <form onSubmit={handleSearch} className="space-y-6">
        {/* Error Notification */}
        {validationError && (
          <div className="flex items-center space-x-2 p-3 bg-brand-red/10 border border-brand-red/20 rounded-xl text-sm text-brand-red animate-shake">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        {/* Locations Grid Wrapper */}
        <div className="relative grid grid-cols-1 sm:grid-cols-2 gap-y-8 gap-x-12 sm:gap-x-16">
          {/* Pickup Location */}
          <div className="relative">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
              <MapPin className="w-4 h-4 text-brand-red" />
              <span>{t("pickupLocation")}</span>
            </label>
            <div className="relative">
              <select
                value={pickupLocation}
                onChange={(e) => setPickupLocation(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 hover:border-slate-350 text-slate-800 px-4 py-3 rounded-xl focus:outline-none focus:border-brand-red text-sm font-semibold cursor-pointer transition appearance-none"
              >
                {locations.map((loc) => (
                  <option key={loc.id} value={loc.name}>
                    {loc.name} {loc.minDays > 1 ? `(min. ${loc.minDays} dni)` : ""}
                  </option>
                ))}
              </select>
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                ▼
              </div>
            </div>
          </div>

          {/* Floating Swap button - absolute positioned between fields on both mobile and desktop */}
          <div className="absolute left-1/2 top-[50%] sm:top-[60%] -translate-x-1/2 -translate-y-1/2 z-10 block">
            <button
              type="button"
              onClick={swapLocations}
              className="p-2.5 bg-white border border-slate-250 hover:border-brand-red rounded-full text-slate-500 hover:text-brand-red shadow-md transition-all duration-200 hover:scale-110 active:scale-95"
              title="Swap Locations"
            >
              <ArrowRightLeft className="w-4 h-4" />
            </button>
          </div>

          {/* Return Location */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
              <MapPin className="w-4 h-4 text-slate-400" />
              <span>{t("returnLocation")}</span>
            </label>
            <div className="relative">
              <select
                value={returnLocation}
                onChange={(e) => setReturnLocation(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 hover:border-slate-350 text-slate-800 px-4 py-3 rounded-xl focus:outline-none focus:border-brand-red text-sm font-semibold cursor-pointer transition appearance-none"
              >
                {locations.map((loc) => (
                  <option key={loc.id} value={loc.name}>
                    {loc.name} {loc.minDays > 1 ? `(min. ${loc.minDays} dni)` : ""}
                  </option>
                ))}
              </select>
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                ▼
              </div>
            </div>
          </div>
        </div>

        {/* Dates and Times Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Pickup Date & Time */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span>{t("pickupDate")}</span>
            </label>
            <div className="flex bg-slate-50 border border-slate-200 hover:border-slate-350 rounded-xl overflow-hidden focus-within:border-brand-red transition">
              <input
                type="date"
                value={pickupDate}
                min={getTomorrowString(0)}
                onChange={(e) => setPickupDate(e.target.value)}
                className="w-full bg-transparent text-slate-800 px-3 py-3 text-xs font-semibold focus:outline-none cursor-text"
              />
              <select
                value={pickupTime}
                onChange={(e) => setPickupTime(e.target.value)}
                className="bg-transparent border-l border-slate-200 text-slate-800 px-2 py-3 text-xs font-semibold focus:outline-none cursor-pointer"
              >
                {timeOptions.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Return Date & Time */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span>{t("returnDate")}</span>
            </label>
            <div className="flex bg-slate-50 border border-slate-200 hover:border-slate-350 rounded-xl overflow-hidden focus-within:border-brand-red transition">
              <input
                type="date"
                value={returnDate}
                min={pickupDate || getTomorrowString(1)}
                onChange={(e) => setReturnDate(e.target.value)}
                className="w-full bg-transparent text-slate-800 px-3 py-3 text-xs font-semibold focus:outline-none cursor-text"
              />
              <select
                value={returnTime}
                onChange={(e) => setReturnTime(e.target.value)}
                className="bg-transparent border-l border-slate-200 text-slate-800 px-2 py-3 text-xs font-semibold focus:outline-none cursor-pointer"
              >
                {timeOptions.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Custom Address Fields (Google Map simulation / custom input) */}
        {(isCustomPickup || isCustomReturn) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 p-5 bg-slate-50 border border-slate-100 rounded-xl animate-fade-in text-sm text-slate-700">
            {isCustomPickup && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Adres dostawy pojazdu / Delivery Street Address:
                </label>
                <input
                  type="text"
                  required
                  placeholder="np. ul. Chopina 15, Oława"
                  value={customAddress}
                  onChange={(e) => setCustomAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-brand-red font-semibold"
                />
              </div>
            )}
            {isCustomReturn && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Adres zwrotu pojazdu / Return Street Address:
                </label>
                <input
                  type="text"
                  required={isCustomReturn}
                  placeholder={isCustomPickup ? "Taki sam jak dostawy / Same as delivery" : "np. Dworzec Kolejowy, Brzeg"}
                  value={customAddressReturn}
                  onChange={(e) => setCustomAddressReturn(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-brand-red font-semibold"
                />
              </div>
            )}
            <div className="col-span-1 sm:col-span-2 text-xs text-brand-red font-bold">
              ℹ️ {t("individualPriceAlert")}
            </div>
          </div>
        )}

        {/* Search Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            className="w-full bg-brand-red hover:bg-brand-red-hover text-white text-sm font-black tracking-widest py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0"
          >
            {t("searchBtn")}
          </button>
        </div>
      </form>
    </div>
  );
}
