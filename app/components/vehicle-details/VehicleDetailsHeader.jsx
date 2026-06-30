"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function VehicleDetailsHeader({ car, t }) {
  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link 
        href="/vehicles" 
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-brand-red transition group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
        <span>{t("backToVehicles").toUpperCase()}</span>
      </Link>

      {/* Title & Price */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-brand-red font-bold text-sm tracking-wide">
            * {car.class}
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900">
          {car.brand} {car.model}
        </h1>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-black text-brand-red">
            PLN {car.price}
          </span>
          <span className="text-sm text-slate-500 font-semibold">
            {t("dayUnit")}
          </span>
        </div>
      </div>

      {/* Description */}
      <p className="text-base text-slate-600 font-medium leading-relaxed max-w-2xl">
        {car.lang === "pl" ? car.description : car.descriptionEn}
      </p>
    </div>
  );
}