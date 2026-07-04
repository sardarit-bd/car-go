"use client";

export function LoadingState({ lang }) {
  return (
    <div className="text-center py-16 border border-slate-200 rounded-2xl bg-white shadow-sm">
      <div className="inline-flex items-center gap-3 text-slate-500 font-semibold">
        <div className="w-5 h-5 border-2 border-brand-red border-t-transparent rounded-full animate-spin"></div>
        <p>{lang === "pl" ? "Ładowanie pojazdów..." : "Loading vehicles..."}</p>
      </div>
    </div>
  );
}

export function ErrorState({ lang }) {
  return (
    <div className="text-center py-16 border border-red-200 rounded-2xl bg-red-50 shadow-sm">
      <p className="text-red-600 font-semibold">
        {lang === "pl" ? "Błąd podczas pobierania pojazdów." : "Error fetching vehicles."}
      </p>
    </div>
  );
}

export function EmptyState({ lang }) {
  return (
    <div className="text-center py-16 border border-slate-200 rounded-2xl bg-white shadow-sm">
      <p className="text-slate-500 font-semibold">
        {lang === "pl" ? "Brak pojazdów spełniających kryteria wyszukiwania." : "No vehicles match the selected filters."}
      </p>
    </div>
  );
}