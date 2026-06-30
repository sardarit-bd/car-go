"use client";

import { Loader2 } from "lucide-react";

function renderCarSvg() {
  return (
    <svg className="w-20 h-10 opacity-80" viewBox="0 0 500 220" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M70 120 C 130 115, 230 115, 270 95 C 310 75, 360 70, 390 90 C 420 110, 440 120, 460 120 C 480 120, 490 135, 490 145 L 490 165 C 490 170, 480 175, 470 175 C 450 175, 430 175, 410 175 C 400 160, 375 160, 365 175 C 320 175, 180 175, 135 175 C 125 160, 100 160, 90 175 C 60 175, 30 170, 20 165 C 15 160, 10 145, 10 135 C 10 128, 30 122, 70 120 Z" fill="#64748b" stroke="#cbd5e1" strokeWidth="2.5" />
      <path d="M120 125 C 170 120, 260 120, 280 105 L 340 105 C 375 120, 390 125, 430 125" stroke="#FF0000" strokeWidth="3" />
      <circle cx="112" cy="175" r="26" fill="#1e293b" stroke="#cbd5e1" strokeWidth="4" />
      <circle cx="382" cy="175" r="26" fill="#1e293b" stroke="#cbd5e1" strokeWidth="4" />
    </svg>
  );
}

export default function CheckoutStep1({ 
  activeSearch, 
  loadingVehicles, 
  availableVehicles, 
  getDays, 
  handleSelectCar, 
  t 
}) {
  return (
    <div className="space-y-6">
      {!activeSearch && (
        <div className="p-5 bg-blue-50 border border-blue-200 rounded-2xl text-sm text-blue-900 font-semibold flex items-start gap-3">
          <span className="text-lg flex-shrink-0">ℹ️</span>
          <span>Proszę wyszukać dogodne terminy przy użyciu formularza. Wyświetlamy ofertę domyślną.</span>
        </div>
      )}
      
      {loadingVehicles ? (
        <div className="p-12 text-center bg-white border border-slate-200 rounded-3xl flex flex-col items-center justify-center space-y-3 shadow-sm">
          <Loader2 className="w-8 h-8 animate-spin text-brand-red" />
          <p className="font-bold text-slate-800">Sprawdzanie dostępności pojazdów...</p>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between pb-4 border-b border-slate-200">
            <h2 className="text-2xl font-black text-slate-900">
              {t("checkoutStep1")}
            </h2>
            <span className="text-sm font-bold text-slate-500">
              {availableVehicles.length} {availableVehicles.length === 1 ? "pojazd" : "pojazdów"}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {availableVehicles.length === 0 ? (
              <div className="p-12 text-center bg-white border border-slate-200 rounded-3xl space-y-3 shadow-sm">
                <p className="font-black text-slate-900 text-xl">Brak dostępnych pojazdów</p>
                <p className="text-slate-500 font-semibold">Wszystkie nasze samochody są zarezerwowane w wybranym terminie.</p>
              </div>
            ) : (
              availableVehicles.map((car) => {
                const carTotal = activeSearch?.isCustomPrice ? "Individual Price" : car.price * getDays();
                return (
                  <div 
                    key={car.id} 
                    className="group p-6 bg-white rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm hover:shadow-xl hover:border-brand-red/30 transition-all duration-300"
                  >
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                      <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-4 flex items-center justify-center w-32 h-20 border border-slate-200 group-hover:border-brand-red/20 transition-colors duration-300">
                        {car.image ? (
                          <img 
                            src={car.image} 
                            alt={`${car.brand} ${car.model}`} 
                            className="h-12 w-auto object-contain transition duration-500 group-hover:scale-110" 
                          />
                        ) : (
                          renderCarSvg()
                        )}
                      </div>
                      <div className="text-center sm:text-left space-y-1">
                        <h3 className="text-lg font-black text-slate-900 group-hover:text-brand-red transition-colors duration-300">
                          {car.brand} {car.model}
                        </h3>
                        <p className="text-xs text-slate-500 font-bold">
                          {car.class} • {car.fuel === "Petrol" ? t("fuelPetrol") : t("fuelDiesel")}
                        </p>
                      </div>
                    </div>
                    <div className="text-center sm:text-right flex flex-col items-center sm:items-end justify-center gap-2">
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">Cena za okres najmu:</span>
                        <p className="text-2xl font-black text-brand-red mt-1">
                          {carTotal === "Individual Price" ? "Indywidualna" : `PLN ${carTotal}`}
                        </p>
                      </div>
                      <button
                        onClick={() => handleSelectCar(car)}
                        className="px-6 py-3 bg-brand-red hover:bg-brand-red-hover text-white text-xs font-black rounded-xl shadow-lg shadow-brand-red/20 hover:shadow-brand-red/40 transition-all duration-300 hover:-translate-y-0.5"
                      >
                        WYBIERZ / SELECT
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </>
      )}
    </div>
  );
}