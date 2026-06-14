"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useApp } from "@/app/context/AppContext";
import { CreditCard, ShieldCheck, ArrowLeft, Info, HelpCircle } from "lucide-react";
import Link from "next/link";

function OnlinePaymentSimulatorContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { bookings, updateBookingStatus, t, logEmail } = useApp();
  
  const [activeBooking, setActiveBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentDone, setPaymentDone] = useState(false);
  const [selectedGateway, setSelectedGateway] = useState("blik"); // blik, p24, autopay

  const id = searchParams.get("id");

  useEffect(() => {
    if (id) {
      // Find the booking in local state or localStorage
      const match = bookings.find((b) => b.id.toUpperCase() === id.toUpperCase().trim());
      setActiveBooking(match || null);
    }
    setLoading(false);
  }, [id, bookings]);

  if (loading) {
    return (
      <div className="max-w-xl mx-auto text-center py-20 px-4 text-slate-500">
        <span>Ładowanie bramki płatniczej... / Loading gateway...</span>
      </div>
    );
  }

  if (!activeBooking) {
    return (
      <div className="max-w-xl mx-auto text-center py-20 px-4 space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Brak aktywnej transakcji / Booking Not Found</h2>
        <p className="text-xs text-slate-500">Rezerwacja o tym identyfikatorze nie istnieje w systemie.</p>
        <Link href="/" className="inline-flex items-center space-x-1 text-brand-red hover:underline text-xs">
          <ArrowLeft className="w-4 h-4" />
          <span>Powrót do strony głównej / Back to Home</span>
        </Link>
      </div>
    );
  }

  const handlePay = () => {
    // Modify booking payment status to paid_online
    const localBookings = JSON.parse(localStorage.getItem("cargo_bookings") || "[]");
    const updated = localBookings.map((b) => {
      if (b.id === activeBooking.id) {
        return { ...b, paymentStatus: "paid_online" };
      }
      return b;
    });
    localStorage.setItem("cargo_bookings", JSON.stringify(updated));

    // Force context sync by calling updateBookingStatus with current status
    updateBookingStatus(activeBooking.id, activeBooking.status);

    // Send simulated confirmation email
    const emailText = `
Witaj/Hello ${activeBooking.customer.firstName} ${activeBooking.customer.lastName},

Otrzymaliśmy płatność online za rezerwację ${activeBooking.id} za pośrednictwem bramki ${selectedGateway.toUpperCase()}!
We have successfully received your online payment for booking ${activeBooking.id} via ${selectedGateway.toUpperCase()}!

Kwota / Paid amount: PLN ${activeBooking.pricing.total.toFixed(2)}
Status płatności / Payment status: OPŁACONA / PAID

Oczekuj na ostateczne zatwierdzenie rezerwacji przez administratora.
Please await final confirmation of your booking by the administrator.

Pozdrawiamy / Best regards,
Zespół CAR-GO.PL
    `;

    logEmail({
      id: "pay_simulator_" + Math.random().toString(36).substr(2, 9),
      to: activeBooking.customer.email,
      subject: `[CAR-GO.PL] Potwierdzenie płatności / Payment confirmation ${activeBooking.id}`,
      body: emailText,
      date: new Date().toLocaleString()
    });

    setPaymentDone(true);
  };

  const isAlreadyPaid = activeBooking.paymentStatus === "paid_online" || paymentDone;

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 py-12 animate-fade-in">
      <div className="glass-panel p-8 rounded-2xl space-y-6 shadow-sm border border-slate-100 relative overflow-hidden">
        
        {/* Top Header */}
        <div className="text-center space-y-2 border-b border-slate-100 pb-4">
          <div className="w-12 h-12 rounded-full bg-brand-red/10 border border-brand-red/30 flex items-center justify-center mx-auto mb-2 text-brand-red">
            <CreditCard className="w-6 h-6" />
          </div>
          <h1 className="text-lg font-black text-slate-800 uppercase">Symulator Bramki Płatniczej</h1>
          <p className="text-[10px] text-slate-400">CAR-GO Online Payments | ID transakcji: {activeBooking.id}</p>
        </div>

        {isAlreadyPaid ? (
          <div className="p-8 border border-green-600/30 bg-green-50/50 rounded-xl text-center space-y-3 text-green-700 animate-fade-in">
            <ShieldCheck className="w-12 h-12 mx-auto" />
            <p className="text-sm font-bold">Transakcja Zakończona Pomyślnie!</p>
            <p className="text-xs text-slate-500">Płatność za rezerwację została uregulowana. Środki zablokowane.</p>
            <button
              onClick={() => router.push(`/lookup?id=${activeBooking.id}`)}
              className="mt-4 px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 rounded text-xs text-slate-600 font-bold transition"
            >
              SPRAWDŹ REZERWACJĘ / LOOKUP STATUS
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            
            {/* Booking sum */}
            <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl text-xs space-y-2 font-semibold">
              <div className="flex justify-between">
                <span className="text-slate-400">Wynajmujący:</span>
                <span className="text-slate-800">{activeBooking.customer.firstName} {activeBooking.customer.lastName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Pojazd:</span>
                <span className="text-slate-800">{activeBooking.car.brand} {activeBooking.car.model}</span>
              </div>
              <div className="flex justify-between border-t border-slate-100 pt-2 text-sm font-black">
                <span className="text-slate-500">Do zapłaty:</span>
                <span className="text-brand-red">PLN {activeBooking.pricing.total.toFixed(2)}</span>
              </div>
            </div>

            {/* Provider selectors */}
            <div className="space-y-2.5 text-xs font-bold text-slate-500">
              <p className="uppercase tracking-wider text-[10px] text-slate-400">Wybierz operatora płatności:</p>
              
              <div
                onClick={() => setSelectedGateway("blik")}
                className={`p-3 rounded-lg border cursor-pointer transition flex items-center justify-between ${
                  selectedGateway === "blik" ? "border-brand-red bg-brand-red/5 text-slate-800" : "border-slate-200 bg-white text-slate-600 hover:border-slate-400"
                }`}
              >
                <span>BLIK (Standardowy kod BLIK)</span>
                <span className="text-[10px] text-white bg-pink-700 px-2 py-0.5 rounded font-black">BLIK</span>
              </div>

              <div
                onClick={() => setSelectedGateway("p24")}
                className={`p-3 rounded-lg border cursor-pointer transition flex items-center justify-between ${
                  selectedGateway === "p24" ? "border-brand-red bg-brand-red/5 text-slate-800" : "border-slate-200 bg-white text-slate-600 hover:border-slate-400"
                }`}
              >
                <span>Przelewy24 (Szybki przelew)</span>
                <span className="text-[10px] text-white bg-blue-700 px-2 py-0.5 rounded font-black">P24</span>
              </div>

              <div
                onClick={() => setSelectedGateway("autopay")}
                className={`p-3 rounded-lg border cursor-pointer transition flex items-center justify-between ${
                  selectedGateway === "autopay" ? "border-brand-red bg-brand-red/5 text-slate-800" : "border-slate-200 bg-white text-slate-600 hover:border-slate-400"
                }`}
              >
                <span>Autopay (Szybka płatność kartą)</span>
                <span className="text-[10px] text-white bg-green-700 px-2 py-0.5 rounded font-black">Autopay</span>
              </div>
            </div>

            <button
              onClick={handlePay}
              className="w-full py-3 bg-brand-red hover:bg-brand-red-hover text-white text-xs font-black rounded-lg transition uppercase tracking-wider shadow"
            >
              SYMULUJ OPŁATĘ / SIMULATE PAYMENT
            </button>

            <div className="flex items-start space-x-1.5 p-3 bg-slate-50 border border-slate-200/60 rounded-lg text-[10px] text-slate-500 leading-normal">
              <Info className="w-4 h-4 text-brand-red flex-shrink-0 mt-0.5" />
              <span>To jest symulowana bramka transakcyjna. Kliknięcie przycisku ureguluje status płatności rezerwacji w systemie local storage.</span>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}

export default function OnlinePaymentSimulator() {
  return (
    <React.Suspense fallback={<div className="text-center py-12 text-slate-500 font-bold">Ładowanie / Loading...</div>}>
      <OnlinePaymentSimulatorContent />
    </React.Suspense>
  );
}
