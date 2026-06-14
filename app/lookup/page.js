"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useApp } from "@/app/context/AppContext";
import { Search, Calendar, MapPin, ShieldAlert, Sparkles, UserCheck } from "lucide-react";

function ReservationLookupContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { lang, bookings, t } = useApp();
  const [queryId, setQueryId] = useState("");
  const [activeBooking, setActiveBooking] = useState(null);
  const [searched, setSearched] = useState(false);

  const urlId = searchParams.get("id");

  useEffect(() => {
    if (urlId) {
      setQueryId(urlId);
      const match = bookings.find((b) => b.id.toUpperCase() === urlId.toUpperCase().trim());
      setActiveBooking(match || null);
      setSearched(true);
    }
  }, [urlId, bookings]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (queryId.trim()) {
      router.push(`/lookup?id=${queryId.trim()}`);
    }
  };

  // Masking helpers for client privacy (e.g. Jan Kowalski -> Ja Ko***i)
  const maskName = (firstName, lastName) => {
    const maskWord = (word) => {
      if (!word) return "";
      if (word.length <= 2) return word + "*";
      return word.slice(0, 2) + "***" + word.slice(-1);
    };
    return `${maskWord(firstName)} ${maskWord(lastName)}`;
  };

  const maskEmail = (email) => {
    if (!email) return "";
    const parts = email.split("@");
    if (parts.length !== 2) return "***";
    const name = parts[0];
    const domain = parts[1];
    const maskedName = name.slice(0, 2) + "***" + name.slice(-1);
    const maskedDomain = domain.slice(0, 2) + "***" + domain.slice(-3);
    return `${maskedName}@${maskedDomain}`;
  };

  const maskPhone = (phone) => {
    if (!phone) return "";
    const clean = phone.replace(/\s+/g, "");
    if (clean.length < 6) return "***";
    return clean.slice(0, 4) + " *** *** " + clean.slice(-2);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-8 animate-fade-in">
      
      {/* Title */}
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-extrabold text-slate-800 uppercase">{t("lookupTitle")}</h1>
        <p className="text-sm text-slate-500">
          Sprawdź szczegóły, status rezerwacji oraz termin odbioru wprowadzając numer rezerwacji.
        </p>
      </div>

      {/* Search Input Box */}
      <div className="glass-panel p-6 rounded-2xl">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            required
            placeholder={t("lookupPlaceholder")}
            value={queryId}
            onChange={(e) => setQueryId(e.target.value)}
            className="flex-grow px-4 py-3 bg-white border border-slate-200 focus:border-brand-red rounded-xl text-slate-800 font-mono placeholder-slate-400 uppercase tracking-widest text-sm focus:outline-none"
          />
          <button
            type="submit"
            className="px-6 py-3 bg-brand-red hover:bg-brand-red-hover text-white font-bold rounded-xl transition duration-200 shadow-md flex items-center justify-center space-x-2 text-sm"
          >
            <Search className="w-4 h-4" />
            <span>{t("lookupBtn")}</span>
          </button>
        </form>
      </div>

      {/* Results Box */}
      {searched && (
        <div className="space-y-6">
          {activeBooking ? (
            <div className="glass-panel rounded-2xl p-6 space-y-6 shadow-sm border border-slate-100 relative overflow-hidden">
              
              {/* Corner badge for status */}
              <div className="absolute top-0 right-0">
                <span className={`inline-block px-4 py-1.5 rounded-bl-xl text-xs font-black uppercase text-white ${
                  activeBooking.status === "confirmed" ? "bg-green-700" :
                  activeBooking.status === "cancelled" ? "bg-red-700" : "bg-yellow-600"
                }`}>
                  {activeBooking.status === "confirmed" ? t("statusConfirmed") :
                   activeBooking.status === "cancelled" ? t("statusCancelled") : t("statusAwaiting")}
                </span>
              </div>

              <div className="border-b border-slate-100 pb-4">
                <span className="text-[10px] text-slate-400 tracking-widest font-bold uppercase">{t("confirmNum")}</span>
                <h2 className="text-2xl font-black text-slate-800 font-mono tracking-wider mt-0.5">{activeBooking.id}</h2>
              </div>

              {/* Masked client warning banner */}
              <div className="flex items-start space-x-2.5 p-3.5 bg-slate-50 border border-slate-100 rounded-xl text-xs text-slate-500">
                <ShieldAlert className="w-4 h-4 text-brand-red flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-slate-700">Weryfikacja tożsamości aktywna</p>
                  <p className="mt-0.5">{t("lookupMaskedAlert")}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm font-semibold">
                
                {/* Dates card */}
                <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-100 space-y-3">
                  <h3 className="text-xs text-slate-400 uppercase flex items-center space-x-1.5">
                    <Calendar className="w-3.5 h-3.5 text-brand-red" />
                    <span>Okres Wynajmu / Period</span>
                  </h3>
                  <div className="space-y-1 text-slate-800">
                    <p className="text-xs text-slate-500">Odbiór / Pickup:</p>
                    <p>{activeBooking.dates.pickupDate} o godz. {activeBooking.dates.pickupTime}</p>
                    <p className="text-xs text-slate-500 pt-1.5">Zwrot / Return:</p>
                    <p>{activeBooking.dates.returnDate} o godz. {activeBooking.dates.returnTime}</p>
                  </div>
                </div>

                {/* Pickup details card */}
                <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-100 space-y-3">
                  <h3 className="text-xs text-slate-400 uppercase flex items-center space-x-1.5">
                    <MapPin className="w-3.5 h-3.5 text-brand-red" />
                    <span>Lokalizacja / Location</span>
                  </h3>
                  <div className="space-y-1 text-slate-800">
                    <p className="text-xs text-slate-500">Miejsce odbioru:</p>
                    <p>{activeBooking.dates.pickupLocation}</p>
                    <p className="text-xs text-slate-500 pt-1.5">Miejsce zwrotu:</p>
                    <p>{activeBooking.dates.returnLocation}</p>
                  </div>
                </div>

                {/* Car Details */}
                <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-100 space-y-3 col-span-1 md:col-span-2">
                  <h3 className="text-xs text-slate-400 uppercase flex items-center space-x-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-brand-red" />
                    <span>Zarezerwowany Pojazd / Vehicle</span>
                  </h3>
                  <div className="flex justify-between items-center text-slate-800">
                    <div>
                      <p className="text-base font-extrabold">{activeBooking.car.brand} {activeBooking.car.model}</p>
                      <p className="text-xs text-slate-500">Klasa: {activeBooking.car.class} | Paliwo: {activeBooking.car.fuel}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-400">Całkowity koszt najmu:</p>
                      <p className="text-base font-black text-brand-red">
                        {activeBooking.pricing.total === "Individual Price" ? "Indywidualna Wycena" : `PLN ${activeBooking.pricing.total.toFixed(2)}`}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Masked Customer Profile */}
                <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-100 space-y-3 col-span-1 md:col-span-2">
                  <h3 className="text-xs text-slate-400 uppercase flex items-center space-x-1.5">
                    <UserCheck className="w-3.5 h-3.5 text-brand-red" />
                    <span>Dane Wynajmującego / Renter Data</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 text-xs text-slate-600">
                    <div>
                      <p className="text-slate-400">Imię i Nazwisko:</p>
                      <p className="font-bold text-slate-800 mt-0.5">
                        {maskName(activeBooking.customer.firstName, activeBooking.customer.lastName)}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-400 font-semibold">Adres E-mail:</p>
                      <p className="font-bold text-slate-800 mt-0.5">
                        {maskEmail(activeBooking.customer.email)}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-400 font-semibold">Telefon kontaktowy:</p>
                      <p className="font-bold text-slate-800 mt-0.5">
                        {maskPhone(activeBooking.customer.phone)}
                      </p>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          ) : (
            <div className="p-8 border border-brand-red/20 rounded-2xl bg-brand-red/5 text-center text-sm font-semibold text-brand-red space-y-2.5 animate-pulse">
              <ShieldAlert className="w-8 h-8 text-brand-red mx-auto" />
              <p>{t("lookupNotFound")}</p>
              <p className="text-xs text-slate-500">Upewnij się, że wpisany identyfikator jest poprawny (np. CAR-GO-XXXX).</p>
            </div>
          )}
        </div>
      )}

    </div>
  );
}

export default function ReservationLookup() {
  return (
    <React.Suspense fallback={<div className="text-center py-12 text-slate-500 font-bold">Ładowanie / Loading...</div>}>
      <ReservationLookupContent />
    </React.Suspense>
  );
}
