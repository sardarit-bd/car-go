"use client";

import { ArrowLeft } from "lucide-react";

export default function MyReservationsResultsList({
  results,
  onSelect,
  onReset,
  lang
}) {
  return (
    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 space-y-4 shadow-sm no-print">
      <div className="flex justify-between items-center border-b border-slate-100 pb-4">
        <h2 className="text-lg font-black text-slate-900">
          {lang === "pl" ? "Znaleziono kilka rezerwacji" : "Multiple reservations found"}
        </h2>
        <button
          onClick={onReset}
          className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-slate-900 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{lang === "pl" ? "Wyszukaj ponownie" : "Search again"}</span>
        </button>
      </div>
      <div className="divide-y divide-slate-100">
        {results.map((b) => (
          <button
            key={b.id}
            onClick={() => onSelect(b)}
            className="w-full text-left py-4 flex justify-between items-center hover:bg-slate-50 transition rounded-xl px-3 -mx-3"
          >
            <div>
              <p className="text-sm text-slate-900 font-mono font-black">{b.id}</p>
              <p className="text-xs text-slate-500 font-semibold mt-1">
                {b.dates.pickupDate} - {b.dates.returnDate} | <strong className="text-slate-700">{b.car.brand} {b.car.model}</strong>
              </p>
            </div>
            <span className="px-4 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl text-xs font-black text-slate-700 transition">
              ZOBACZ / VIEW
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}