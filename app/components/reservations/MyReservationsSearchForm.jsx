"use client";

import { Search, ShieldAlert, Loader2 } from "lucide-react";

export default function MyReservationsSearchForm({
  queryReservationNumber,
  setQueryReservationNumber,
  loading,
  errorMsg,
  onSubmit,
  t,
  lang,
}) {
  return (
    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 space-y-6 shadow-sm no-print">
      <div className="space-y-2">
        <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
          <Search className="w-5 h-5 text-brand-red" />
          <span>Zweryfikuj szczegóły rezerwacji / Verify Booking</span>
        </h2>
        <p className="text-sm text-slate-500 font-semibold">
          Wprowadź numer rezerwacji, aby przejść do szczegółów.
        </p>
      </div>

      {loading && (
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center gap-3">
          <Loader2 className="w-5 h-5 animate-spin text-brand-red" />
          <p className="text-sm text-slate-700 font-semibold">
            {lang === "pl"
              ? "Wyszukiwanie rezerwacji..."
              : "Looking up your reservation..."}
          </p>
        </div>
      )}

      {!loading && errorMsg && (
        <div className="p-4 bg-brand-red/5 border border-brand-red/20 rounded-2xl flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-brand-red flex-shrink-0 mt-0.5" />
          <p className="text-sm text-brand-red font-semibold">{errorMsg}</p>
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            {lang === "pl" ? "Numer rezerwacji" : "Reservation Number"} *
          </label>
          <input
            type="text"
            required
            placeholder="np. RES-123456"
            value={queryReservationNumber}
            onChange={(e) => setQueryReservationNumber(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm font-semibold focus:outline-none focus:border-brand-red focus:bg-white transition font-mono uppercase"
          />
        </div>

        <button
          type="submit"
          className="w-full py-4 bg-brand-red hover:bg-brand-red-hover text-white text-sm font-black tracking-wider uppercase rounded-xl shadow-lg shadow-brand-red/20 hover:shadow-brand-red/40 transition-all duration-300 hover:-translate-y-0.5"
        >
          ZWERYFIKUJ I SPRAWDŹ / SEARCH & PRINT
        </button>
      </form>
    </div>
  );
}
