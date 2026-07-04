"use client";

import { ChevronRight } from "lucide-react";

export default function CheckoutSteps({ step, t }) {
  const steps = [
    { num: 1, label: t("checkoutStep1") },
    { num: 2, label: t("checkoutStep2") },
    { num: 3, label: t("checkoutStep3") },
    { num: 4, label: t("checkoutStep4") }
  ];

  return (
    <div className="flex justify-between items-center max-w-3xl mx-auto mb-10">
      {steps.map((s, index) => (
        <div key={s.num} className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all duration-300 ${
              step >= s.num 
                ? "bg-brand-red text-white shadow-lg shadow-brand-red/30" 
                : "bg-slate-100 text-slate-400"
            }`}>
              {s.num}
            </div>
            <span className={`text-xs sm:text-sm font-bold hidden sm:block transition-colors duration-300 ${
              step >= s.num ? "text-slate-900" : "text-slate-400"
            }`}>
              {s.label}
            </span>
          </div>
          {index < steps.length - 1 && (
            <ChevronRight className={`w-4 h-4 hidden sm:block transition-colors duration-300 ${
              step > s.num ? "text-brand-red" : "text-slate-300"
            }`} />
          )}
        </div>
      ))}
    </div>
  );
}