"use client";

import { useApp } from "@/app/context/AppContext";
import { AlertTriangle, ArrowLeft, Briefcase, Compass, Fuel, ShieldCheck, Users } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

export default function VehicleDetails() {
  const router = useRouter();
  const { id } = useParams();
  const { lang, vehicles, t } = useApp();

  const car = vehicles.find((v) => v.id === id);

  if (!car) {
    return (
      <div className="max-w-xl mx-auto text-center py-20 px-4">
        <h2 className="text-xl font-bold text-slate-800 mb-4">Pojazd nie został znaleziony / Vehicle Not Found</h2>
        <Link href="/vehicles" className="inline-flex items-center space-x-1 text-brand-red hover:underline font-bold text-sm">
          <ArrowLeft className="w-4 h-4" />
          <span>Powrót do katalogu / Return to catalog</span>
        </Link>
      </div>
    );
  }

  const handleBookNow = () => {
    router.push(`/checkout?step=1&car=${car.id}`);
  };

  const renderCarSvgDetails = () => (
    <svg className="w-full max-w-md mx-auto text-white drop-shadow-[0_12px_24px_rgba(255,0,0,0.1)]" viewBox="0 0 500 220" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M70 120 C 130 115, 230 115, 270 95 C 310 75, 360 70, 390 90 C 420 110, 440 120, 460 120 C 480 120, 490 135, 490 145 L 490 165 C 490 170, 480 175, 470 175 C 450 175, 430 175, 410 175 C 400 160, 375 160, 365 175 C 320 175, 180 175, 135 175 C 125 160, 100 160, 90 175 C 60 175, 30 170, 20 165 C 15 160, 10 145, 10 135 C 10 128, 30 122, 70 120 Z" fill="#64748b" stroke="#cbd5e1" strokeWidth="2.5" />
      <path d="M120 125 C 170 120, 260 120, 280 105 L 340 105 C 375 120, 390 125, 430 125" stroke="#FF0000" strokeWidth="4.5" strokeLinecap="round" />
      <circle cx="112" cy="175" r="26" fill="#1e293b" stroke="#cbd5e1" strokeWidth="4" />
      <circle cx="112" cy="175" r="10" fill="#ff0000" />
      <circle cx="382" cy="175" r="26" fill="#1e293b" stroke="#cbd5e1" strokeWidth="4" />
      <circle cx="382" cy="175" r="10" fill="#ff0000" />
    </svg>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8 animate-fade-in">

      {/* Back button */}
      <Link href="/vehicles" className="inline-flex items-center space-x-2 text-xs font-bold text-slate-505 hover:text-slate-800 transition">
        <ArrowLeft className="w-4 h-4" />
        <span>{t("backToVehicles").toUpperCase()}</span>
      </Link>

      {/* 2-Column Sidebar Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* Right Area: Vehicle Details Content */}
        <div className="lg:col-span-12 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column: Image Block */}
            <div className="space-y-6">

              <div className="bg-white border border-slate-100 p-8 rounded-2xl flex justify-center items-center h-64 relative shadow-sm">
                <span className="absolute top-4 left-4 px-2.5 py-0.5 bg-slate-100 border border-slate-200 text-[10px] text-slate-700 rounded font-bold uppercase">
                  Class {car.class}
                </span>
                {car.image || car.id === "fiat-500" ? (
                  <img
                    src={car.image || "/fiat500.png"}
                    alt={`${car.brand} ${car.model}`}
                    className="h-48 w-auto object-contain transition duration-300 hover:scale-105"
                  />
                ) : (
                  renderCarSvgDetails()
                )}
              </div>

              <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl text-xs text-slate-500 leading-relaxed font-semibold shadow-sm">
                💡 <strong>{lang === "pl" ? "Rzeczywiste zdjęcia pojazdu:" : "Actual car photos:"}</strong> {lang === "pl" ? "Prezentowana grafika obrazuje sylwetkę wybranego modelu. Wydawany pojazd może nieznacznie różnić się kolorem lakieru i elementami wyposażenia." : "Presented graphic shows the model silhouette. The actual car collected may vary in color or optional equipment."}
              </div>
            </div>

            {/* Right Column: Specs Block */}
            <div className="space-y-6">
              <div className="space-y-2">
                <h1 className="text-3xl font-black text-slate-900">
                  {car.brand} {car.model}
                </h1>
                <p className="text-sm font-bold text-brand-red uppercase tracking-wider">
                  {t("priceFrom")} PLN {car.price} {t("dayUnit")}
                </p>
              </div>

              {/* Description */}
              <div className="text-sm text-slate-650 font-semibold leading-relaxed border-t border-slate-100 pt-4">
                <p>{lang === "pl" ? car.description : car.descriptionEn}</p>
              </div>

              {/* Specification Grid */}
              <div className="grid grid-cols-2 gap-4 text-xs font-semibold">
                <div className="p-3 bg-white border border-slate-200 rounded-lg flex items-center space-x-3 shadow-sm">
                  <Fuel className="w-5 h-5 text-slate-400" />
                  <div>
                    <p className="text-slate-400 font-bold">{lang === "pl" ? "Paliwo" : "Fuel"}</p>
                    <p className="text-slate-800 font-extrabold">{car.fuel === "Petrol" ? t("fuelPetrol") : t("fuelDiesel")}</p>
                  </div>
                </div>

                <div className="p-3 bg-white border border-slate-200 rounded-lg flex items-center space-x-3 shadow-sm">
                  {/* Shifter SVG icon */}
                  <svg className="w-5 h-5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="5" r="3" fill="currentColor" />
                    <path d="M12 8v13" />
                    <path d="M9 13h6" />
                    <path d="M9 13v5" />
                    <path d="M15 13v5" />
                  </svg>
                  <div>
                    <p className="text-slate-400 font-bold">{lang === "pl" ? "Skrzynia" : "Transmission"}</p>
                    <p className="text-slate-800 font-extrabold">{car.transmission === "Automatic" ? t("gearAuto") : t("gearManual")}</p>
                  </div>
                </div>

                <div className="p-3 bg-white border border-slate-200 rounded-lg flex items-center space-x-3 shadow-sm">
                  <Users className="w-5 h-5 text-slate-400" />
                  <div>
                    <p className="text-slate-400 font-bold">{lang === "pl" ? "Miejsca" : "Seats"}</p>
                    <p className="text-slate-800 font-extrabold">{car.seats} {t("seatsUnit")}</p>
                  </div>
                </div>

                <div className="p-3 bg-white border border-slate-200 rounded-lg flex items-center space-x-3 shadow-sm">
                  <Briefcase className="w-5 h-5 text-slate-400" />
                  <div>
                    <p className="text-slate-400 font-bold">{lang === "pl" ? "Bagaż" : "Luggage"}</p>
                    <p className="text-slate-800 font-extrabold">{car.luggage} {t("luggageUnit")}</p>
                  </div>
                </div>

                {/* Technical Items */}
                {car.specs && (
                  <>
                    <div className="p-3 bg-white border border-slate-200 rounded-lg flex items-center space-x-3 shadow-sm">
                      <Compass className="w-5 h-5 text-slate-400" />
                      <div>
                        <p className="text-slate-400 font-bold">Silnik / Engine</p>
                        <p className="text-slate-800 font-extrabold">{car.specs.engine}</p>
                      </div>
                    </div>

                    <div className="p-3 bg-white border border-slate-200 rounded-lg flex items-center space-x-3 shadow-sm">
                      <Compass className="w-5 h-5 text-slate-400" />
                      <div>
                        <p className="text-slate-400 font-bold">Spalanie / Consumption</p>
                        <p className="text-slate-800 font-extrabold">{car.specs.consumption}</p>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Deposit Block */}
              <div className="p-4 bg-slate-100 border border-slate-200 rounded-xl flex items-center justify-between text-xs font-bold shadow-sm">
                <div className="flex items-center space-x-2 text-slate-600">
                  <AlertTriangle className="w-4.5 h-4.5 text-brand-red animate-pulse" />
                  <span>{t("depositLabel")}</span>
                </div>
                <span className="text-slate-900 text-sm font-extrabold">PLN {car.deposit}</span>
              </div>

              {/* Guarantee Check */}
              <div className="flex items-center space-x-2 text-xs text-green-600 font-bold pl-1">
                <ShieldCheck className="w-4.5 h-4.5 flex-shrink-0" />
                <span>{lang === "pl" ? "Nielimitowany przebieg oraz ubezpieczenie OC w cenie!" : "Unlimited mileage and liability insurance included!"}</span>
              </div>

              {/* Book Trigger */}
              <button
                onClick={handleBookNow}
                className="w-full py-3.5 bg-brand-red hover:bg-brand-red-hover text-white text-xs font-black tracking-widest uppercase rounded-xl shadow hover:shadow-brand-red/20 transition duration-300"
              >
                {t("reserveBtn")} (ROZPOCZNIJ REZERWACJĘ / BOOK NOW)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
