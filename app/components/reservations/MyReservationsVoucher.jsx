"use client";

import { ArrowLeft, Printer, Calendar, MapPin, Sparkles, UserCheck } from "lucide-react";

export default function MyReservationsVoucher({
  activeBooking,
  onReset,
  onPrint,
  t,
  lang
}) {
  return (
    <div className="space-y-6 print:space-y-0">
      {/* Actions Header */}
      <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-200 shadow-sm no-print">
        <button
          onClick={onReset}
          className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-slate-900 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{lang === "pl" ? "Wyszukaj inną rezerwację" : "Search another booking"}</span>
        </button>
        <button
          onClick={onPrint}
          className="flex items-center gap-2 px-6 py-3 bg-brand-red hover:bg-brand-red-hover text-white text-xs font-black tracking-wider uppercase rounded-xl shadow-lg shadow-brand-red/20 hover:shadow-brand-red/40 transition-all duration-300"
        >
          <Printer className="w-4 h-4" />
          <span>{t("printVoucher")}</span>
        </button>
      </div>

      {/* VOUCHER CARD */}
      <div className="print-voucher-card bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 relative overflow-hidden print:border-none print:shadow-none print:p-0">
        {/* Header */}
        <div className="border-b-2 border-brand-red pb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-slate-900 uppercase">
              CAR<span className="text-brand-red">-GO</span>.PL
            </h2>
            <p className="text-xs text-slate-500 font-semibold mt-1">Skarbimierz-Osiedle, Polska | reservations@car-go.pl</p>
          </div>
          <div className="sm:text-right">
            <span className="text-[10px] text-slate-500 font-black uppercase tracking-wider">{t("confirmNum")}</span>
            <p className="text-xl font-black text-slate-900 font-mono tracking-widest mt-1">{activeBooking.id}</p>
          </div>
        </div>

        {/* Status Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-b border-slate-100 pb-6">
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Status rezerwacji / Status</p>
            <span className={`inline-block mt-2 px-3 py-1.5 rounded-lg text-xs font-black uppercase text-white ${
              activeBooking.status === "confirmed" ? "bg-emerald-600" :
              activeBooking.status === "cancelled" ? "bg-red-600" : "bg-amber-600"
            }`}>
              {activeBooking.status === "confirmed" ? t("statusConfirmed") :
               activeBooking.status === "cancelled" ? t("statusCancelled") : t("statusAwaiting")}
            </span>
          </div>
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Płatność / Payment Status</p>
            <span className="block mt-2 text-sm font-black text-slate-900">
              {activeBooking.paymentStatus === "paid_online" ? t("payStatusPaid") :
               activeBooking.paymentStatus === "payment_upon_pickup" ? t("payStatusPickup") : t("payStatusAwaiting")}
            </span>
          </div>
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Kwota całkowita / Total Cost</p>
            <span className="block mt-2 text-xl font-black text-brand-red">
              {activeBooking.pricing.total === "Individual Price"
                ? (lang === "pl" ? "Wycena indywidualna" : "Individual Quote")
                : `PLN ${activeBooking.pricing.total.toFixed(2)}`}
            </span>
          </div>
        </div>

        {/* Rental Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm font-semibold border-b border-slate-100 pb-6">
          <div className="space-y-4">
            <h3 className="text-xs text-slate-500 uppercase tracking-wider font-black flex items-center gap-2">
              <Calendar className="w-4 h-4 text-brand-red" />
              <span>Okres Wynajmu / Rental Period</span>
            </h3>
            <div className="space-y-3 text-slate-700">
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-bold">Odbiór / Pickup:</p>
                <p className="text-slate-900 font-semibold mt-1">{activeBooking.dates.pickupDate} o godz. {activeBooking.dates.pickupTime}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-bold">Zwrot / Return:</p>
                <p className="text-slate-900 font-semibold mt-1">{activeBooking.dates.returnDate} o godz. {activeBooking.dates.returnTime}</p>
              </div>
              <p className="text-sm text-brand-red font-black pt-2">Długość najmu: {activeBooking.pricing.days} dni / days</p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs text-slate-500 uppercase tracking-wider font-black flex items-center gap-2">
              <MapPin className="w-4 h-4 text-brand-red" />
              <span>Lokalizacje / Locations</span>
            </h3>
            <div className="space-y-3 text-slate-700">
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-bold">Miejsce odbioru:</p>
                <p className="text-slate-900 font-semibold mt-1">{activeBooking.dates.pickupLocation}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-bold">Miejsce zwrotu:</p>
                <p className="text-slate-900 font-semibold mt-1">{activeBooking.dates.returnLocation}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Vehicle & Package */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm font-semibold border-b border-slate-100 pb-6">
          <div className="space-y-3">
            <h3 className="text-xs text-slate-500 uppercase tracking-wider font-black flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-red" />
              <span>Pojazd / Vehicle</span>
            </h3>
            <div className="text-slate-700">
              <p className="text-lg font-black text-slate-900">{activeBooking.car.brand} {activeBooking.car.model}</p>
              <p className="text-xs text-slate-500 mt-1">Klasa: {activeBooking.car.class} | Skrzynia: {activeBooking.car.transmission === "Automatic" ? t("gearAuto") : activeBooking.car.transmission === "Manual" ? t("gearManual") : activeBooking.car.transmission}</p>
              <p className="text-xs text-slate-500 mt-1">Paliwo: {activeBooking.car.fuel === "Petrol" ? t("fuelPetrol") : activeBooking.car.fuel === "Diesel" ? t("fuelDiesel") : activeBooking.car.fuel}</p>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs text-slate-500 uppercase tracking-wider font-black flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-brand-red" />
              <span>Ochrona / Protection Package</span>
            </h3>
            <div className="text-slate-700">
              <p className="font-black text-slate-900">{activeBooking.package.name.split(" / ")[0]}</p>
              <p className="text-xs text-slate-500 mt-1">Stawka kaucji: PLN {activeBooking.car.deposit}</p>
            </div>
          </div>
        </div>

        {/* Customer Details */}
        <div className="space-y-4 border-b border-slate-100 pb-6 text-sm">
          <h3 className="text-xs text-slate-500 uppercase tracking-wider font-black flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-brand-red" />
            <span>Dane Wynajmującego / Renter</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-semibold text-slate-700">
            <div>
              <p className="text-[10px] text-slate-500 uppercase font-bold">Imię i nazwisko:</p>
              <p className="text-slate-900 mt-1">{activeBooking.customer.firstName} {activeBooking.customer.lastName}</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-500 uppercase font-bold">E-mail:</p>
              <p className="text-slate-900 mt-1">{activeBooking.customer.email}</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-500 uppercase font-bold">Telefon:</p>
              <p className="text-slate-900 mt-1">{activeBooking.customer.phone}</p>
            </div>
          </div>
        </div>

        {/* Pricing Summary */}
        <div className="space-y-4 text-sm">
          <h3 className="text-xs text-slate-500 uppercase tracking-wider font-black">Rozliczenie / Pricing Summary</h3>
          <div className="space-y-2 text-sm font-semibold text-slate-600">
            <div className="flex justify-between">
              <span>Wynajem pojazdu ({activeBooking.pricing.days} dni):</span>
              <span className="text-slate-900 font-bold">PLN {activeBooking.pricing.carCost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Pakiet ochrony:</span>
              <span className="text-slate-900 font-bold">PLN {activeBooking.pricing.packageCost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Akcesoria i dodatki:</span>
              <span className="text-slate-900 font-bold">PLN {activeBooking.pricing.addonsCost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-black text-slate-900 pt-4 border-t-2 border-slate-200">
              <span>RAZEM BRUTTO (23% VAT):</span>
              <span className="text-brand-red">
                {activeBooking.pricing.total === "Individual Price"
                  ? (lang === "pl" ? "Wycena indywidualna" : "Individual Quote")
                  : `PLN ${activeBooking.pricing.total.toFixed(2)}`}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-6 border-t border-slate-100 text-xs text-slate-500 leading-relaxed space-y-2 print:block">
          <p> Odbiór pojazdu możliwy wyłącznie po okazaniu dokumentu tożsamości oraz ważnego prawa jazdy.</p>
          <p> Nielimitowany przebieg obowiązuje na terytorium Rzeczypospolitej Polskiej.</p>
        </div>
      </div>

      {/* Print Styles */}
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
  );
}