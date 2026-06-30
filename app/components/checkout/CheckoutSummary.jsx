"use client";

import { Calendar } from "lucide-react";

export default function CheckoutSummary({ 
  activeSearch, 
  selectedCar, 
  selectedPackage, 
  selectedAddons, 
  addons, 
  getDays, 
  getPackageCost, 
  getTotalGross,
  t 
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-5 shadow-sm">
      <h3 className="text-sm font-black text-slate-900 border-b border-slate-200 pb-3 uppercase tracking-wider flex items-center gap-2">
        <Calendar className="w-4 h-4 text-brand-red" />
        <span>{t("summaryTitle")}</span>
      </h3>

      {/* Search Parameters */}
      {activeSearch ? (
        <div className="space-y-4 text-sm">
          <div className="space-y-2">
            <p className="text-[10px] text-slate-500 uppercase font-black tracking-wider">Lokalizacja:</p>
            <div className="space-y-1 text-slate-700 font-semibold">
              <p>Odbiór: <span className="text-slate-900 font-black">{activeSearch.pickupLocation}</span></p>
              <p>Zwrot: <span className="text-slate-900 font-black">{activeSearch.returnLocation}</span></p>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-[10px] text-slate-500 uppercase font-black tracking-wider">Okres najmu:</p>
            <div className="space-y-1 text-slate-700 font-semibold">
              <p>Od: <span className="text-slate-900 font-black">{activeSearch.pickupDate}</span></p>
              <p>Do: <span className="text-slate-900 font-black">{activeSearch.returnDate}</span></p>
              <p className="text-brand-red font-black pt-1">Dni: {getDays()}</p>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-sm text-slate-500 font-bold">Wybierz parametry wynajmu.</p>
      )}

      {/* Selected Car */}
      {selectedCar && (
        <div className="border-t border-slate-200 pt-4 text-sm space-y-2">
          <p className="text-[10px] text-slate-500 uppercase font-black tracking-wider">Pojazd:</p>
          <div className="flex justify-between items-center text-slate-900">
            <span className="font-black">{selectedCar.brand} {selectedCar.model}</span>
            <span className="font-black">PLN {selectedCar.price * getDays()}</span>
          </div>
        </div>
      )}

      {/* Selected Package */}
      {selectedPackage && (
        <div className="border-t border-slate-200 pt-4 text-sm space-y-2">
          <p className="text-[10px] text-slate-500 uppercase font-black tracking-wider">Pakiet:</p>
          <div className="flex justify-between items-center text-slate-900 font-bold">
            <span>{selectedPackage.name}</span>
            <span className="font-black">+PLN {getPackageCost()}</span>
          </div>
        </div>
      )}

      {/* Selected Addons */}
      {selectedAddons.length > 0 && (
        <div className="border-t border-slate-200 pt-4 text-sm space-y-2">
          <p className="text-[10px] text-slate-500 uppercase font-black tracking-wider">Dodatki:</p>
          <div className="space-y-2 text-slate-900 font-bold">
            {selectedAddons.map((id) => {
              const item = addons.find((a) => a.id === id);
              const itemCost = item.isPerDay ? item.price * getDays() : item.price;
              return (
                <div key={id} className="flex justify-between">
                  <span>{item.name}</span>
                  <span className="font-black">+PLN {itemCost}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Total */}
      <div className="border-t-2 border-slate-200 pt-4 space-y-2">
        <p className="text-[10px] text-slate-500 font-black uppercase tracking-wider">{t("totalPrice")}</p>
        <p className="text-3xl font-black text-slate-900">
          {getTotalGross() === "Individual Price" ? "Cena Indywidualna" : `PLN ${getTotalGross().toFixed(2)}`}
        </p>
      </div>
    </div>
  );
}