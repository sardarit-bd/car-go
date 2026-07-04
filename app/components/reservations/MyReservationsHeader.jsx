"use client";

export default function MyReservationsHeader({ t, lang }) {
  return (
    <div className="text-center space-y-4 max-w-3xl mx-auto mb-12 sm:mb-16 no-print">
      <span className="text-brand-red font-bold text-sm tracking-wide flex items-center justify-center gap-1">
        <span className="text-brand-red">*</span> {t("navMyReservations")}
      </span>
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900">
        {t("navMyReservations")}
      </h1>
      <p className="text-base sm:text-lg text-slate-500 font-medium leading-relaxed max-w-2xl mx-auto">
        {lang === "pl"
          ? "Zarządzaj swoimi rezerwacjami, sprawdź ich status i pobierz oficjalne potwierdzenie voucher."
          : "Manage your reservations, verify status details, and print your official confirmation voucher."}
      </p>
    </div>
  );
}