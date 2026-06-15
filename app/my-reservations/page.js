"use client";

import SidebarCTA from "@/app/components/SidebarCTA";
import { useApp } from "@/app/context/AppContext";
import { ArrowLeft, Calendar, Info, MapPin, Printer, Search, ShieldAlert, Sparkles, UserCheck } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

function MyReservationsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { lang, bookings, currentUser, t } = useApp();

  const [queryId, setQueryId] = useState("");
  const [queryEmail, setQueryEmail] = useState("");
  const [activeBooking, setActiveBooking] = useState(null);
  const [searched, setSearched] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const urlId = searchParams.get("id");
  const urlEmail = searchParams.get("email");

  useEffect(() => {
    if (urlId && urlEmail) {
      setQueryId(urlId);
      setQueryEmail(urlEmail);
      const match = bookings.find(
        (b) =>
          b.id.toUpperCase() === urlId.toUpperCase().trim() &&
          b.customer.email.toLowerCase() === urlEmail.toLowerCase().trim()
      );
      if (match) {
        setActiveBooking(match);
        setErrorMsg("");
      } else {
        setActiveBooking(null);
        setErrorMsg(t("lookupNotFound"));
      }
      setSearched(true);
    }
  }, [urlId, urlEmail, bookings, t]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (queryId.trim() && queryEmail.trim()) {
      router.push(`/my-reservations?id=${queryId.trim()}&email=${encodeURIComponent(queryEmail.trim())}`);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // If client is logged in, list their bookings
  const myBookings = currentUser
    ? bookings.filter((b) => b.customer.email.toLowerCase() === currentUser.email.toLowerCase())
    : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">

      {/* Title */}
      <div className="text-center space-y-3 max-w-2xl mx-auto no-print">
        <h1 className="text-3xl font-black text-slate-800 uppercase">{t("navMyReservations")}</h1>
        <p className="text-sm font-semibold text-slate-500">
          {lang === "pl"
            ? "Zarządzaj swoimi rezerwacjami, sprawdź ich status i pobierz oficjalne potwierdzenie voucher."
            : "Manage your reservations, verify status details, and print your official confirmation voucher."}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Sticky Left Sidebar CTA Panel */}
        <div className="lg:col-span-4 sticky top-36 hidden lg:block no-print">
          <SidebarCTA />
        </div>

        {/* Right Content */}
        <div className="lg:col-span-8 space-y-8 print:w-full print:col-span-12">

          {/* Printable Voucher Section */}
          {searched && activeBooking ? (
            <div className="space-y-6 print:space-y-0">

              {/* Actions Header */}
              <div className="flex justify-between items-center bg-slate-100 p-4 rounded-xl border border-slate-200 no-print">
                <button
                  onClick={() => {
                    setSearched(false);
                    setActiveBooking(null);
                    router.push("/my-reservations");
                  }}
                  className="flex items-center space-x-1 text-xs font-bold text-slate-600 hover:text-slate-800 transition"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>{lang === "pl" ? "Wyszukaj inną rezerwację" : "Search another booking"}</span>
                </button>
                <button
                  onClick={handlePrint}
                  className="flex items-center space-x-1.5 px-4 py-2 bg-brand-red hover:bg-brand-red-hover text-white text-xs font-black tracking-wider uppercase rounded-lg shadow transition"
                >
                  <Printer className="w-4 h-4" />
                  <span>{t("printVoucher")}</span>
                </button>
              </div>

              {/* CONFIRMATION VOUCHER CARD */}
              <div className="print-voucher-card bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6 relative overflow-hidden print:border-none print:shadow-none print:p-0">
                {/* Print Banner Top */}
                <div className="border-b-2 border-brand-red pb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h2 className="text-2xl font-black tracking-tight text-slate-800 font-sans uppercase">
                      CAR<span className="text-brand-red">-GO</span>.PL
                    </h2>
                    <p className="text-xs text-slate-400 font-semibold mt-0.5">Skarbimierz-Osiedle, Polska | reservations@car-go.pl</p>
                  </div>
                  <div className="sm:text-right">
                    <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider">{t("confirmNum")}</span>
                    <p className="text-xl font-black text-slate-800 font-mono tracking-widest mt-0.5">{activeBooking.id}</p>
                  </div>
                </div>

                {/* Status and Summary Header */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-b border-slate-100 pb-6">
                  <div className="p-3 bg-slate-50 border border-slate-200/50 rounded-lg">
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Status rezerwacji / Status</p>
                    <span className={`inline-block mt-1.5 px-2.5 py-1 rounded text-xs font-black uppercase text-white ${activeBooking.status === "confirmed" ? "bg-green-700" :
                        activeBooking.status === "cancelled" ? "bg-red-700" : "bg-yellow-600"
                      }`}>
                      {activeBooking.status === "confirmed" ? t("statusConfirmed") :
                        activeBooking.status === "cancelled" ? t("statusCancelled") : t("statusAwaiting")}
                    </span>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200/50 rounded-lg">
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Płatność / Payment Status</p>
                    <span className="block mt-2 text-xs font-black uppercase text-slate-700">
                      {activeBooking.paymentStatus === "paid_online" ? t("payStatusPaid") :
                        activeBooking.paymentStatus === "payment_upon_pickup" ? t("payStatusPickup") : t("payStatusAwaiting")}
                    </span>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200/50 rounded-lg">
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Kwota całkowita / Total Cost</p>
                    <span className="block mt-1 text-base font-black text-brand-red">
                      {activeBooking.pricing.total === "Individual Price"
                        ? (lang === "pl" ? "Wycena indywidualna" : "Individual Quote")
                        : `PLN ${activeBooking.pricing.total.toFixed(2)}`}
                    </span>
                  </div>
                </div>

                {/* Rental Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm font-semibold border-b border-slate-100 pb-6">
                  <div className="space-y-4">
                    <h3 className="text-xs text-slate-400 uppercase tracking-wider font-extrabold flex items-center space-x-1.5">
                      <Calendar className="w-4 h-4 text-brand-red" />
                      <span>Okres Wynajmu / Rental Period</span>
                    </h3>
                    <div className="space-y-2 text-slate-700">
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase">Odbiór / Pickup:</p>
                        <p className="text-slate-800">{activeBooking.dates.pickupDate} o godz. {activeBooking.dates.pickupTime}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase">Zwrot / Return:</p>
                        <p className="text-slate-800">{activeBooking.dates.returnDate} o godz. {activeBooking.dates.returnTime}</p>
                      </div>
                      <p className="text-xs text-brand-red font-bold">Długość najmu: {activeBooking.pricing.days} dni / days</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xs text-slate-400 uppercase tracking-wider font-extrabold flex items-center space-x-1.5">
                      <MapPin className="w-4 h-4 text-brand-red" />
                      <span>Lokalizacje / Locations</span>
                    </h3>
                    <div className="space-y-2 text-slate-700">
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase">Miejsce odbioru:</p>
                        <p className="text-slate-800">{activeBooking.dates.pickupLocation}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase">Miejsce zwrotu:</p>
                        <p className="text-slate-800">{activeBooking.dates.returnLocation}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Rented Car & Protection Package */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm font-semibold border-b border-slate-100 pb-6">
                  <div className="space-y-3">
                    <h3 className="text-xs text-slate-400 uppercase tracking-wider font-extrabold flex items-center space-x-1.5">
                      <Sparkles className="w-4 h-4 text-brand-red" />
                      <span>Pojazd / Vehicle</span>
                    </h3>
                    <div className="text-slate-700">
                      <p className="text-base font-extrabold text-slate-800">{activeBooking.car.brand} {activeBooking.car.model}</p>
                      <p className="text-xs text-slate-500 mt-0.5">Klasa: {activeBooking.car.class} | Skrzynia: {activeBooking.car.transmission === "Automatic" ? t("gearAuto") : t("gearManual")}</p>
                      <p className="text-xs text-slate-500">Paliwo: {activeBooking.car.fuel === "Petrol" ? t("fuelPetrol") : t("fuelDiesel")}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-xs text-slate-400 uppercase tracking-wider font-extrabold flex items-center space-x-1.5">
                      <UserCheck className="w-4 h-4 text-brand-red" />
                      <span>Ochrona / Protection Package</span>
                    </h3>
                    <div className="text-slate-700">
                      <p className="font-extrabold text-slate-800">{activeBooking.package.name.split(" / ")[0]}</p>
                      <p className="text-xs text-slate-500 mt-1">Stawka kaucji: PLN {activeBooking.car.deposit}</p>
                    </div>
                  </div>
                </div>

                {/* Customer Details */}
                <div className="space-y-3 border-b border-slate-100 pb-6 text-sm">
                  <h3 className="text-xs text-slate-400 uppercase tracking-wider font-extrabold flex items-center space-x-1.5">
                    <UserCheck className="w-4 h-4 text-brand-red" />
                    <span>Dane Wynajmującego / Renter</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-semibold text-slate-700">
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-bold">Imię i nazwisko:</p>
                      <p className="text-slate-800">{activeBooking.customer.firstName} {activeBooking.customer.lastName}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-bold">E-mail:</p>
                      <p className="text-slate-800">{activeBooking.customer.email}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-bold">Telefon:</p>
                      <p className="text-slate-800">{activeBooking.customer.phone}</p>
                    </div>
                  </div>
                </div>

                {/* Pricing Summary */}
                <div className="space-y-3 text-sm">
                  <h3 className="text-xs text-slate-400 uppercase tracking-wider font-extrabold">Rozliczenie / Pricing Summary</h3>
                  <div className="space-y-1 text-xs font-semibold text-slate-500 text-left">
                    <div className="flex justify-between">
                      <span>Wynajem pojazdu ({activeBooking.pricing.days} dni):</span>
                      <span className="text-slate-850">PLN {activeBooking.pricing.carCost.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Pakiet ochrony:</span>
                      <span className="text-slate-850">PLN {activeBooking.pricing.packageCost.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Akcesoria i dodatki:</span>
                      <span className="text-slate-850">PLN {activeBooking.pricing.addonsCost.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-base font-black text-slate-800 pt-3 border-t border-slate-200">
                      <span>RAZEM BRUTTO (23% VAT):</span>
                      <span className="text-brand-red">
                        {activeBooking.pricing.total === "Individual Price"
                          ? (lang === "pl" ? "Wycena indywidualna" : "Individual Quote")
                          : `PLN ${activeBooking.pricing.total.toFixed(2)}`}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Printable rules footer */}
                <div className="pt-6 border-t border-slate-100 text-[10px] text-slate-400 leading-relaxed space-y-1 print:block">
                  <p>📍 Odbiór pojazdu możliwy wyłącznie po okazaniu dokumentu tożsamości oraz ważnego prawa jazdy.</p>
                  <p>🚗 Nielimitowany przebieg obowiązuje na terytorium Rzeczypospolitej Polskiej.</p>
                </div>

              </div>

              {/* Printable Media stylesheet overrides */}
              <style jsx global>{`
                @media print {
                  header, footer, .no-print, .lg\\:col-span-4 {
                    display: none !important;
                  }
                  main {
                    padding-top: 0 !important;
                    padding-bottom: 0 !important;
                  }
                  body {
                    background: #fff !important;
                    color: #000 !important;
                  }
                  .print-voucher-card {
                    border: none !important;
                    box-shadow: none !important;
                    padding: 0 !important;
                    width: 100% !important;
                  }
                }
              `}</style>

            </div>
          ) : (
            <div className="space-y-6">

              {/* LOOKUP FORM CARD */}
              <div className="glass-panel p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-100 space-y-6 no-print">
                <div className="space-y-1">
                  <h2 className="text-lg font-black text-slate-800 uppercase flex items-center space-x-2">
                    <Search className="w-5 h-5 text-brand-red" />
                    <span>Zweryfikuj szczegóły rezerwacji / Verify Booking</span>
                  </h2>
                  <p className="text-xs text-slate-500 font-semibold">
                    Wprowadź numer rezerwacji oraz e-mail podany podczas dokonywania zamówienia, aby przejść do szczegółów.
                  </p>
                </div>

                {errorMsg && (
                  <div className="p-3.5 bg-brand-red/10 border border-brand-red/20 rounded-xl text-xs text-brand-red font-semibold flex items-center space-x-2">
                    <ShieldAlert className="w-4.5 h-4.5 flex-shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <form onSubmit={handleSearchSubmit} className="space-y-4 text-xs font-bold text-slate-500">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-1.5">{t("confirmNum")} *</label>
                      <input
                        type="text"
                        required
                        placeholder="np. CAR-GO-123456"
                        value={queryId}
                        onChange={(e) => setQueryId(e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-brand-red rounded-lg text-slate-800 text-sm focus:outline-none uppercase tracking-widest font-mono"
                      />
                    </div>
                    <div>
                      <label className="block mb-1.5">{t("verifyEmailLabel")} *</label>
                      <input
                        type="email"
                        required
                        placeholder="np. jan.kowalski@email.com"
                        value={queryEmail}
                        onChange={(e) => setQueryEmail(e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-brand-red rounded-lg text-slate-800 text-sm focus:outline-none font-mono"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-brand-red hover:bg-brand-red-hover text-white text-xs font-black tracking-widest uppercase rounded-lg shadow transition duration-200"
                  >
                    ZWERYFIKUJ I SPRAWDŹ / SEARCH & PRINT
                  </button>
                </form>
              </div>

              {/* LIST BOOKINGS SIMULATOR (If logged in, helpful client portal access) */}
              {currentUser && (
                <div className="glass-panel p-6 rounded-2xl border border-slate-100 space-y-4 no-print">
                  <h2 className="text-base font-extrabold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2.5 flex items-center space-x-2">
                    <UserCheck className="w-5 h-5 text-brand-red" />
                    <span>Rezerwacje przypisane do Twojego konta:</span>
                  </h2>

                  {myBookings.length > 0 ? (
                    <div className="divide-y divide-slate-100">
                      {myBookings.map((b) => (
                        <div key={b.id} className="py-3.5 flex justify-between items-center text-xs font-semibold">
                          <div>
                            <p className="text-slate-800 font-mono font-extrabold">{b.id}</p>
                            <p className="text-slate-400 font-normal">{b.dates.pickupDate} - {b.dates.returnDate} | <strong className="text-slate-650">{b.car.brand} {b.car.model}</strong></p>
                          </div>
                          <Link
                            href={`/my-reservations?id=${b.id}&email=${encodeURIComponent(b.customer.email)}`}
                            className="px-3 py-1.5 bg-white border border-slate-200 rounded hover:border-slate-350 transition text-[10px]"
                          >
                            ZOBACZ / PRINT VOUCHER
                          </Link>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 py-2">Brak aktywnych rezerwacji dla konta {currentUser.email}.</p>
                  )}
                </div>
              )}

              {/* Default Help info */}
              <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl flex items-start space-x-3 text-xs text-slate-600 no-print font-medium leading-relaxed">
                <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-slate-850">Gdzie znajdę dane logowania i numer rezerwacji?</p>
                  <p className="mt-0.5">Wszystkie dane rezerwacji (identyfikator oraz szczegóły) zostały przesłane w automatycznej wiadomości e-mail tuż po dokonaniu rezerwacji online. W razie pytań prosimy o kontakt pod numerem +48 789 200 100.</p>
                </div>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default function MyReservations() {
  return (
    <React.Suspense fallback={<div className="text-center py-12 text-slate-500 font-bold">Ładowanie / Loading...</div>}>
      <MyReservationsContent />
    </React.Suspense>
  );
}
