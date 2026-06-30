"use client";

import SidebarCTA from "@/app/components/SidebarCTA";
import { useApp } from "@/app/context/AppContext";
import { ArrowLeft, Calendar, Info, MapPin, Printer, Search, ShieldAlert, Sparkles, UserCheck } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const API_BASE = "http://localhost:5000";

// Maps a raw API reservation object into the shape the voucher card expects
function mapApiBookingToVoucherShape(item) {
  const pickupDate = new Date(item.pickupDate);
  const returnDate = new Date(item.returnDate);
  const days = Math.max(
    1,
    Math.round((returnDate.getTime() - pickupDate.getTime()) / (1000 * 60 * 60 * 24))
  );

  const carCost = item.vehicle?.pricePerDay
    ? parseFloat(item.vehicle.pricePerDay) * days
    : 0;
  const packageCost = item.packageData?.price ? parseFloat(item.packageData.price) : 0;
  const addonsCost = Array.isArray(item.addonsData)
    ? item.addonsData.reduce((sum, a) => sum + (parseFloat(a.price) || 0), 0)
    : 0;

  const total = item.totalPrice ? parseFloat(item.totalPrice) : carCost + packageCost + addonsCost;

  const fmtDate = (d) => d.toLocaleDateString("pl-PL");
  const fmtTime = (d) => d.toLocaleTimeString("pl-PL", { hour: "2-digit", minute: "2-digit" });

  return {
    id: item.id,
    status: item.status ? item.status.toLowerCase() : "pending",
    paymentStatus: "payment_upon_pickup", // not provided by API; defaulting
    customer: {
      firstName: item.customerFirstName,
      lastName: item.customerLastName,
      email: item.customerEmail,
      phone: item.phoneNumber,
    },
    dates: {
      pickupDate: fmtDate(pickupDate),
      pickupTime: fmtTime(pickupDate),
      returnDate: fmtDate(returnDate),
      returnTime: fmtTime(returnDate),
      pickupLocation: item.pickupLocationId || "—",
      returnLocation: item.returnLocationId || "—",
    },
    car: {
      brand: item.vehicle?.brand || "",
      model: item.vehicle?.model || "",
      class: item.vehicle?.class || "—",
      transmission: item.vehicle?.transmission || "—",
      fuel: item.vehicle?.fuel || "—",
      deposit: item.vehicle?.deposit ?? "—",
    },
    package: {
      name: item.packageData?.name || "—",
    },
    pricing: {
      total,
      days,
      carCost,
      packageCost,
      addonsCost,
    },
  };
}

function MyReservationsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { lang, bookings, currentUser, t } = useApp();

  const [queryPhone, setQueryPhone] = useState("");
  const [queryEmail, setQueryEmail] = useState("");
  const [results, setResults] = useState([]);
  const [activeBooking, setActiveBooking] = useState(null);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const urlPhone = searchParams.get("phone");
  const urlEmail = searchParams.get("email");

  useEffect(() => {
    if (!urlPhone) return;

    setQueryPhone(urlPhone);
    setQueryEmail(urlEmail || "");
    setActiveBooking(null);
    setResults([]);
    setErrorMsg("");
    setLoading(true);
    setSearched(true);

    const fetchReservations = async () => {
      try {
        const res = await fetch(
          `${API_BASE}/api/reservations/check/${encodeURIComponent(urlPhone)}`
        );
        const json = await res.json();

        if (!json.success || !Array.isArray(json.data) || json.data.length === 0) {
          setErrorMsg(t("lookupNotFound"));
          setResults([]);
          return;
        }

        let matches = json.data;

        // If email was provided, narrow results down to that email when possible
        if (urlEmail) {
          const filtered = matches.filter(
            (r) => r.customerEmail?.toLowerCase() === urlEmail.toLowerCase().trim()
          );
          if (filtered.length > 0) matches = filtered;
        }

        const mapped = matches.map(mapApiBookingToVoucherShape);

        if (mapped.length === 1) {
          setActiveBooking(mapped[0]);
        } else {
          setResults(mapped);
        }
      } catch (err) {
        setErrorMsg(
          lang === "pl"
            ? "Nie udało się połączyć z serwerem. Spróbuj ponownie."
            : "Could not connect to the server. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, [urlPhone, urlEmail, lang, t]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!queryPhone.trim()) return;
    const params = new URLSearchParams();
    params.set("phone", queryPhone.trim());
    if (queryEmail.trim()) params.set("email", queryEmail.trim());
    router.push(`/my-reservations?${params.toString()}`);
  };

  const handlePrint = () => {
    window.print();
  };

  const resetSearch = () => {
    setSearched(false);
    setActiveBooking(null);
    setResults([]);
    router.push("/my-reservations");
  };

  // If client is logged in, list their bookings (existing local context feature, unchanged)
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
                  onClick={resetSearch}
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
                      <p className="text-xs text-slate-500 mt-0.5">Klasa: {activeBooking.car.class} | Skrzynia: {activeBooking.car.transmission === "Automatic" ? t("gearAuto") : activeBooking.car.transmission === "Manual" ? t("gearManual") : activeBooking.car.transmission}</p>
                      <p className="text-xs text-slate-500">Paliwo: {activeBooking.car.fuel === "Petrol" ? t("fuelPetrol") : activeBooking.car.fuel === "Diesel" ? t("fuelDiesel") : activeBooking.car.fuel}</p>
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
          ) : searched && results.length > 0 ? (
            /* MULTIPLE RESERVATIONS FOUND — selection list */
            <div className="glass-panel p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-100 space-y-4 no-print">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <h2 className="text-base font-black text-slate-800 uppercase">
                  {lang === "pl" ? "Znaleziono kilka rezerwacji" : "Multiple reservations found"}
                </h2>
                <button
                  onClick={resetSearch}
                  className="flex items-center space-x-1 text-xs font-bold text-slate-600 hover:text-slate-800 transition"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>{lang === "pl" ? "Wyszukaj ponownie" : "Search again"}</span>
                </button>
              </div>
              <div className="divide-y divide-slate-100">
                {results.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => setActiveBooking(b)}
                    className="w-full text-left py-3.5 flex justify-between items-center text-xs font-semibold hover:bg-slate-50 transition rounded-lg px-2"
                  >
                    <div>
                      <p className="text-slate-800 font-mono font-extrabold">{b.id}</p>
                      <p className="text-slate-400 font-normal">
                        {b.dates.pickupDate} - {b.dates.returnDate} | <strong className="text-slate-650">{b.car.brand} {b.car.model}</strong>
                      </p>
                    </div>
                    <span className="px-3 py-1.5 bg-white border border-slate-200 rounded text-[10px]">
                      ZOBACZ / VIEW
                    </span>
                  </button>
                ))}
              </div>
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
                    Wprowadź numer telefonu (oraz opcjonalnie e-mail) podany podczas dokonywania zamówienia, aby przejść do szczegółów.
                  </p>
                </div>

                {loading && (
                  <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-500 font-semibold">
                    {lang === "pl" ? "Wyszukiwanie rezerwacji..." : "Looking up your reservation..."}
                  </div>
                )}

                {!loading && errorMsg && (
                  <div className="p-3.5 bg-brand-red/10 border border-brand-red/20 rounded-xl text-xs text-brand-red font-semibold flex items-center space-x-2">
                    <ShieldAlert className="w-4.5 h-4.5 flex-shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <form onSubmit={handleSearchSubmit} className="space-y-4 text-xs font-bold text-slate-500">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-1.5">{lang === "pl" ? "Numer telefonu" : "Phone Number"} *</label>
                      <input
                        type="tel"
                        required
                        placeholder="np. +1 (398) 143-4806"
                        value={queryPhone}
                        onChange={(e) => setQueryPhone(e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-brand-red rounded-lg text-slate-800 text-sm focus:outline-none font-mono"
                      />
                    </div>
                    <div>
                      <label className="block mb-1.5">{t("verifyEmailLabel")} ({lang === "pl" ? "opcjonalnie" : "optional"})</label>
                      <input
                        type="email"
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