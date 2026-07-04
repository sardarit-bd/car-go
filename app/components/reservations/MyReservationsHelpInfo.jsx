"use client";

import { Info } from "lucide-react";

export default function MyReservationsHelpInfo() {
  return (
    <div className="p-5 bg-blue-50 border border-blue-200 rounded-2xl flex items-start gap-3 text-sm text-blue-900 no-print font-medium leading-relaxed">
      <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
      <div>
        <p className="font-bold text-slate-900">Gdzie znajdę dane logowania i numer rezerwacji?</p>
        <p className="mt-1 text-slate-700">Wszystkie dane rezerwacji (identyfikator oraz szczegóły) zostały przesłane w automatycznej wiadomości e-mail tuż po dokonaniu rezerwacji online. W razie pytań prosimy o kontakt pod numerem +48 789 200 100.</p>
      </div>
    </div>
  );
}