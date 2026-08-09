"use client";

import { ShieldCheck } from "lucide-react";

export default function VehicleDetailsActions({ car, t, lang }) {
  console.log("VehicleDetailsActions car:", car); // Debugging line
  return (
    <div className="space-y-4">
      {car?.highlights?.map((highlight, index) => (
        <div className="px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-2xl flex flex-row items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
          </div>

          <p className="text-sm text-emerald-900 font-bold leading-tight">
            {lang === "pl"
              ? "Nielimitowany przebieg oraz ubezpieczenie OC w cenie!"
              : "Unlimited mileage and liability insurance included!"}
          </p>
        </div>
      ))}
    </div>
  );
}
