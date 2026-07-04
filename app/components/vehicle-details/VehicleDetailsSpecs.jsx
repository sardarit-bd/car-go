"use client";

import { Fuel, Users, Briefcase, Compass, Settings } from "lucide-react";

function TransmissionIcon() {
  return (
    <svg className="w-5 h-5 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="5" r="3" fill="currentColor" />
      <path d="M12 8v13" />
      <path d="M9 13h6" />
      <path d="M9 13v5" />
      <path d="M15 13v5" />
    </svg>
  );
}

export default function VehicleDetailsSpecs({ car, lang, t }) {
  const specs = [
    {
      icon: Fuel,
      label: lang === "pl" ? "Paliwo" : "Fuel",
      value: car.fuel === "Petrol" ? t("fuelPetrol") : t("fuelDiesel")
    },
    {
      icon: TransmissionIcon,
      label: lang === "pl" ? "Skrzynia" : "Transmission",
      value: car.transmission === "Automatic" ? t("gearAuto") : t("gearManual")
    },
    {
      icon: Users,
      label: lang === "pl" ? "Miejsca" : "Seats",
      value: `${car.seats} ${t("seatsUnit")}`
    },
    {
      icon: Briefcase,
      label: lang === "pl" ? "Bagaż" : "Luggage",
      value: `${car.luggage} ${t("luggageUnit")}`
    }
  ];

  // Add technical specs if available
  if (car.specs) {
    if (car.specs.engine && car.specs.engine !== "N/A") {
      specs.push({
        icon: Compass,
        label: "Silnik / Engine",
        value: car.specs.engine
      });
    }
    if (car.specs.consumption && car.specs.consumption !== "N/A") {
      specs.push({
        icon: Compass,
        label: "Spalanie / Consumption",
        value: car.specs.consumption
      });
    }
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      {specs.map((spec, index) => {
        const Icon = spec.icon;
        return (
          <div 
            key={index}
            className="p-4 bg-white border border-slate-200 rounded-2xl flex items-center gap-3 shadow-sm hover:shadow-md hover:border-brand-red/20 transition-all duration-300"
          >
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
              {typeof Icon === 'function' && Icon.toString().includes('svg') ? (
                <Icon />
              ) : (
                <Icon className="w-5 h-5 text-slate-600" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                {spec.label}
              </p>
              <p className="text-sm text-slate-900 font-black truncate">
                {spec.value}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}