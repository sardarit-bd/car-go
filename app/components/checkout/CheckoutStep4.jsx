"use client";

import { CheckCircle2, Info } from "lucide-react";
import { useRouter } from "next/navigation";
// REMOVED: import { t } from "@/app/context/AppContext"; 
// (This was crashing the component because 't' is not exported from the context file)

export default function CheckoutStep4({ createdBooking, paymentCompleted, handleSimulatePayment, t }) {
  const router = useRouter();

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white border border-slate-200 p-8 rounded-3xl space-y-6 shadow-sm">
        {/* Success Header */}
        <div className="flex flex-col items-center py-6 space-y-4">
          <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center">
            <CheckCircle2 className="w-12 h-12 text-emerald-600" />
          </div>
          <h2 className="text-3xl font-black text-slate-900">{t("confirmTitle")}</h2>
          <div className="px-6 py-3 bg-slate-100 border border-slate-200 rounded-full">
            <span className="text-sm text-slate-600 font-bold">{t("confirmNum")}: </span>
            <span className="font-mono text-brand-red font-black text-lg tracking-widest">{createdBooking.id}</span>
          </div>
        </div>

        {/* Payment Info */}
        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200">
          {createdBooking.paymentMethod === "online" ? (
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-brand-red flex-shrink-0 mt-0.5" />
                <p className="text-sm text-slate-700 font-semibold">{t("confirmOnlineText")}</p>
              </div>
              {paymentCompleted ? (
                <div className="p-4 bg-emerald-100 border border-emerald-200 rounded-xl text-emerald-700 font-bold text-center">
                  ✅ Płatność zakończona pomyślnie!
                </div>
              ) : (
                <button 
                  onClick={handleSimulatePayment} 
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm rounded-xl shadow-lg transition-all duration-300"
                >
                  {t("confirmPayBtn")}
                </button>
              )}
            </div>
          ) : (
            <div className="flex items-start gap-3">
              <span className="text-xl">⚠️</span>
              <p className="text-sm text-amber-700 font-bold">{t("confirmPickupText")}</p>
            </div>
          )}
        </div>

        {/* Customer Details Verification */}
        <div className="space-y-4">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-3">
            Weryfikacja Danych:
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-600 font-semibold">Imię i Nazwisko:</span>
              <span className="text-slate-900 font-black">{createdBooking.customer.firstName} {createdBooking.customer.lastName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600 font-semibold">E-mail:</span>
              <span className="text-slate-900 font-black">{createdBooking.customer.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600 font-semibold">Telefon:</span>
              <span className="text-slate-900 font-black">{createdBooking.customer.phone}</span>
            </div>
          </div>
        </div>

        {/* Back to Home */}
        <div className="flex justify-center pt-4">
          <button 
            onClick={() => router.push("/")} 
            className="px-8 py-3 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 font-bold text-sm rounded-xl transition-all duration-300"
          >
            POWRÓT DO STRONY GŁÓWNEJ
          </button>
        </div>
      </div>
    </div>
  );
} 