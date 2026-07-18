"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useApp } from "@/app/context/AppContext";
import {
  CreditCard,
  ShieldCheck,
  ArrowLeft,
  Info,
  Mail,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";

function OnlinePaymentSimulatorContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { bookings, updateBookingStatus, t, logEmail, lang } = useApp();

  const [activeBooking, setActiveBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentDone, setPaymentDone] = useState(false);
  const [selectedGateway, setSelectedGateway] = useState("blik");

  const id = searchParams.get("id");
  const paymentStatusFromUrl = searchParams.get("status");

  useEffect(() => {
    if (id) {
      const match = bookings.find(
        (b) => b.id.toUpperCase() === id.toUpperCase().trim(),
      );

      if (
        paymentStatusFromUrl === "success" &&
        match &&
        match.paymentStatus !== "paid_online"
      ) {
        const localBookings = JSON.parse(
          localStorage.getItem("cargo_bookings") || "[]",
        );
        const updated = localBookings.map((b) => {
          if (b.id === match.id) {
            return { ...b, paymentStatus: "paid_online", status: "confirmed" };
          }
          return b;
        });
        localStorage.setItem("cargo_bookings", JSON.stringify(updated));

        setActiveBooking({
          ...match,
          paymentStatus: "paid_online",
          status: "confirmed",
        });
        setPaymentDone(true);

        if (updateBookingStatus) {
          updateBookingStatus(match.id, "confirmed");
        }
      } else {
        setActiveBooking(match || null);
      }
    }
    setLoading(false);
  }, [id, bookings, paymentStatusFromUrl, updateBookingStatus]);

  if (loading) {
    return (
      <div className="max-w-xl mx-auto text-center py-20 px-4 text-slate-500">
        <span className="animate-pulse font-semibold">
          {lang === "pl"
            ? "Ładowanie bramki płatniczej..."
            : "Loading payment gateway..."}
        </span>
      </div>
    );
  }

  if (!activeBooking) {
    return (
      <div className="max-w-xl mx-auto text-center py-20 px-4 space-y-4">
        <h2 className="text-xl font-bold text-slate-800">
          {lang === "pl" ? "Brak aktywnej transakcji" : "No active transaction"}
        </h2>
        <p className="text-sm text-slate-500">
          {lang === "pl"
            ? "Rezerwacja o tym identyfikatorze nie istnieje w systemie."
            : "A reservation with this ID does not exist in the system."}
        </p>
        <Link
          href="/"
          className="inline-flex items-center space-x-1 text-brand-red hover:underline text-sm font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>
            {lang === "pl" ? "Powrót do strony głównej" : "Back to Home"}
          </span>
        </Link>
      </div>
    );
  }

  const handlePay = () => {
    setPaymentDone(true);
  };

  const isAlreadyPaid =
    activeBooking?.paymentStatus === "paid_online" ||
    paymentDone ||
    paymentStatusFromUrl === "success";

  const gateways = [
    {
      id: "blik",
      labelPl: "BLIK (Standardowy kod BLIK)",
      labelEn: "BLIK (Standard BLIK code)",
      badge: "BLIK",
      badgeColor: "bg-pink-600",
    },
    {
      id: "p24",
      labelPl: "Przelewy24 (Szybki przelew)",
      labelEn: "Przelewy24 (Fast transfer)",
      badge: "P24",
      badgeColor: "bg-blue-600",
    },
    {
      id: "autopay",
      labelPl: "Autopay (Szybka płatność kartą)",
      labelEn: "Autopay (Fast card payment)",
      badge: "Autopay",
      badgeColor: "bg-emerald-600",
    },
  ];

  return (
    <div className="max-w-lg mx-auto px-4 sm:px-6 py-12 animate-fade-in">
      <div className="bg-white p-8 rounded-3xl space-y-6 shadow-xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden">
        {/* Top Header */}
        <div className="text-center space-y-3 pb-6 border-b border-slate-100">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-red to-red-700 flex items-center justify-center mx-auto text-white shadow-lg shadow-brand-red/20">
            <CreditCard className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-800 uppercase tracking-tight">
              {lang === "pl" ? "Bramka Płatnicza" : "Payment Gateway"}
            </h1>
            <p className="text-[11px] text-slate-400 font-medium mt-1">
              CAR-GO Secure Checkout |{" "}
              {lang === "pl" ? "ID transakcji:" : "Transaction ID:"}{" "}
              {activeBooking.id}
            </p>
          </div>
        </div>

        {/* UPDATED: Explicit Email Activation & Status Reminder */}
        {!isAlreadyPaid && (
          <div className="flex items-start space-x-3 p-4 bg-blue-50/60 border border-blue-200/60 rounded-2xl">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <Mail className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800 mb-1">
                {lang === "pl"
                  ? "E-mail z instrukcjami został wysłany!"
                  : "Instruction email has been sent!"}
              </p>
              <p className="text-xs text-slate-600 leading-relaxed">
                {lang === "pl"
                  ? `Wysłaliśmy wiadomość na adres ${activeBooking.customer.email}. Kliknij link w e-mailu, aby aktywować swoje konto, ustawić hasło i zobaczyć status rezerwacji.`
                  : `We have sent an email to ${activeBooking.customer.email}. Click the link in the email to activate your account, set your password, and see your reservation status.`}
              </p>
            </div>
          </div>
        )}

        {isAlreadyPaid ? (
          /* SUCCESS STATE */
          <div className="p-8 border border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl text-center space-y-4 animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <p className="text-lg font-black text-slate-800">
                {lang === "pl"
                  ? "Transakcja Zakończona Pomyślnie!"
                  : "Transaction Successful!"}
              </p>
              <p className="text-sm text-slate-500 mt-1">
                {lang === "pl"
                  ? "Płatność za rezerwację została uregulowana."
                  : "Payment for the reservation has been settled."}
              </p>
            </div>
            <button
              onClick={() => router.push(`/lookup?id=${activeBooking.id}`)}
              className="mt-4 px-6 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl text-xs text-slate-700 font-bold transition shadow-sm"
            >
              {lang === "pl" ? "SPRAWDŹ REZERWACJĘ" : "CHECK RESERVATION"}
            </button>
          </div>
        ) : (
          /* PAYMENT FORM STATE */
          <div className="space-y-6">
            {/* Booking Summary */}
            <div className="p-5 bg-slate-50/80 border border-slate-100 rounded-2xl text-sm space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">
                  {lang === "pl" ? "Wynajmujący:" : "Renter:"}
                </span>
                <span className="text-slate-800 font-bold">
                  {activeBooking.customer.firstName}{" "}
                  {activeBooking.customer.lastName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">
                  {lang === "pl" ? "Pojazd:" : "Vehicle:"}
                </span>
                <span className="text-slate-800 font-bold">
                  {activeBooking.car.brand} {activeBooking.car.model}
                </span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-3 text-base">
                <span className="text-slate-600 font-bold">
                  {lang === "pl" ? "Do zapłaty:" : "Total to pay:"}
                </span>
                <span className="text-brand-red font-black text-lg">
                  PLN {activeBooking.pricing.total.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Gateway Selection */}
            <div className="space-y-3">
              <p className="uppercase tracking-wider text-[11px] text-slate-400 font-black px-1">
                {lang === "pl"
                  ? "Wybierz metodę płatności:"
                  : "Select payment method:"}
              </p>

              <div className="space-y-2.5">
                {gateways.map((gateway) => (
                  <div
                    key={gateway.id}
                    onClick={() => setSelectedGateway(gateway.id)}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 flex items-center justify-between group ${
                      selectedGateway === gateway.id
                        ? "border-brand-red bg-brand-red/5 shadow-sm"
                        : "border-slate-100 bg-white hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      {/* Custom Radio Button */}
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                          selectedGateway === gateway.id
                            ? "border-brand-red"
                            : "border-slate-300"
                        }`}
                      >
                        {selectedGateway === gateway.id && (
                          <div className="w-2.5 h-2.5 rounded-full bg-brand-red"></div>
                        )}
                      </div>
                      <span
                        className={`text-sm font-semibold ${selectedGateway === gateway.id ? "text-slate-900" : "text-slate-600"}`}
                      >
                        {lang === "pl" ? gateway.labelPl : gateway.labelEn}
                      </span>
                    </div>
                    <span
                      className={`text-[10px] text-white ${gateway.badgeColor} px-2.5 py-1 rounded-md font-black tracking-wide`}
                    >
                      {gateway.badge}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pay Button */}
            <button
              onClick={handlePay}
              className="w-full py-4 bg-gradient-to-r from-brand-red to-red-600 hover:from-red-600 hover:to-red-700 text-white text-sm font-black rounded-xl transition-all uppercase tracking-wider shadow-lg shadow-brand-red/20 active:scale-[0.98]"
            >
              {lang === "pl" ? "ZAPŁAĆ TERAZ" : "PAY NOW"}
            </button>

            {/* Info Footer */}
            <div className="flex items-start space-x-2 p-3 bg-slate-50 border border-slate-100 rounded-xl text-[11px] text-slate-500 leading-relaxed">
              <Info className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
              <span>
                {lang === "pl"
                  ? "To jest środowisko testowe. Kliknięcie przycisku ureguluje status płatności w systemie."
                  : "This is a test environment. Clicking the button will settle the payment status in the system."}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function OnlinePaymentSimulator() {
  return (
    <React.Suspense
      fallback={
        <div className="text-center py-12 text-slate-500 font-bold">
          Ładowanie / Loading...
        </div>
      }
    >
      <OnlinePaymentSimulatorContent />
    </React.Suspense>
  );
}
