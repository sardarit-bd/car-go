"use client";

import {
  ArrowLeft,
  Printer,
  Calendar,
  MapPin,
  Sparkles,
  UserCheck,
  Download,
  ShieldAlert,
} from "lucide-react";
// REMOVED: import html2pdf from "html2pdf.js"; (This was causing the SSR crash)

export default function MyReservationsVoucher({
  activeBooking,
  onReset,
  onPrint,
  t,
  lang,
  isLoggedIn,
}) {
  const maskString = (str) => {
    if (!str) return "";
    if (str.length <= 2) return str + "****";
    return str.substring(0, 2) + "****";
  };

  const maskPhone = (phone) => {
    if (!phone) return "";
    if (phone.length < 9) return phone;
    return `${phone.substring(0, 7)}****${phone.substring(phone.length - 2)}`;
  };

  const maskEmail = (email) => {
    if (!email) return "";
    const [user, domain] = email.split("@");
    if (!domain) return email;
    return `${user.substring(0, 2)}****@${domain}`;
  };

  const customer = isLoggedIn
    ? activeBooking.customer
    : {
        firstName: maskString(activeBooking.customer.firstName),
        lastName: maskString(activeBooking.customer.lastName),
        phone: maskPhone(activeBooking.customer.phone),
        email: maskEmail(activeBooking.customer.email),
      };

  // UPDATED: Made async and added dynamic import to prevent SSR errors
  const handleDownloadPdf = async () => {
    const element = document.getElementById("voucher-pdf-content");
    if (!element) return;

    // Dynamically import html2pdf ONLY when the button is clicked (Client-side only)
    const html2pdf = (await import("html2pdf.js")).default;

    const opt = {
      margin: [5, 5, 5, 5],
      filename: `Rezerwacja_${activeBooking.id}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        logging: false,
        letterRendering: true,
        scrollY: 0,
      },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      pagebreak: { mode: ["avoid-all", "css", "legacy"] },
    };

    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="space-y-6 print:space-y-0">
      {/* Web-only Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm no-print">
        <button
          onClick={onReset}
          className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-slate-900 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>
            {lang === "pl"
              ? "Wyszukaj inną rezerwację"
              : "Search another booking"}
          </span>
        </button>
        <div className="flex gap-3">
          <button
            onClick={handleDownloadPdf}
            className="flex items-center gap-2 px-6 py-3 bg-brand-red hover:bg-brand-red-hover text-white text-xs font-black tracking-wider uppercase rounded-xl shadow-lg transition-all duration-300"
          >
            <Download className="w-4 h-4" />
            <span>
              {t("downloadPdf") ||
                (lang === "pl" ? "Pobierz PDF" : "Download PDF")}
            </span>
          </button>
        </div>
      </div>

      {/* PDF & Print Optimized Content */}
      <div
        id="voucher-pdf-content"
        className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm text-slate-900"
        style={{
          fontFamily: "system-ui, -apple-system, sans-serif",
          lineHeight: "1.4",
          fontSize: "13px",
        }}
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 border-b-2 border-brand-red pb-4 mb-4 break-inside-avoid">
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <img
              src="/logo.png"
              alt="CAR-GO"
              className="h-8 sm:h-10 w-auto object-contain flex-shrink-0"
              crossOrigin="anonymous"
            />
            <div className="min-w-0">
              <h1 className="text-lg sm:text-xl font-black uppercase tracking-tight whitespace-nowrap">
                CAR<span className="text-brand-red">-GO</span>.PL
              </h1>
              <p className="text-[10px] sm:text-[11px] text-slate-500 font-semibold truncate">
                Skarbimierz-Osiedle, Polska
              </p>
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-[9px] sm:text-[10px] text-slate-500 font-black uppercase tracking-wider">
              {lang === "pl" ? "Numer rezerwacji" : "Reservation Number"}
            </p>
            <p className="text-base sm:text-lg font-black font-mono tracking-wider mt-1 break-all">
              {activeBooking.id}
            </p>
          </div>
        </div>

        {/* Status Bar */}
        <div className="grid grid-cols-3 gap-3 mb-4 break-inside-avoid">
          <div className="border border-slate-200 rounded-lg p-3 bg-slate-50">
            <p className="text-[10px] text-slate-500 font-bold uppercase">
              {lang === "pl" ? "Status" : "Status"}
            </p>
            <p className="text-sm font-black text-slate-900 mt-1 capitalize">
              {activeBooking.status === "confirmed"
                ? t("statusConfirmed")
                : activeBooking.status === "cancelled"
                  ? t("statusCancelled")
                  : t("statusAwaiting")}
            </p>
          </div>
          <div className="border border-slate-200 rounded-lg p-3 bg-slate-50">
            <p className="text-[10px] text-slate-500 font-bold uppercase">
              {lang === "pl" ? "Metoda płatności" : "Payment Method"}
            </p>
            <p className="text-sm font-black text-slate-900 mt-1">
              {activeBooking.paymentMethod ||
                (lang === "pl" ? "Przy odbiorze" : "Upon Pickup")}
            </p>
          </div>
          <div className="border border-slate-200 rounded-lg p-3 bg-slate-50">
            <p className="text-[10px] text-slate-500 font-bold uppercase">
              {lang === "pl" ? "Całkowity koszt" : "Total Cost"}
            </p>
            <p className="text-lg font-black text-brand-red mt-1">
              PLN {activeBooking.pricing.total.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Main Details Grid */}
        <div className="grid grid-cols-2 gap-4 mb-4 break-inside-avoid">
          {/* Rental Period */}
          <div className="border border-slate-200 rounded-lg p-3">
            <h3 className="text-[11px] font-black uppercase text-slate-500 mb-2 flex items-center gap-2">
              <Calendar className="w-3 h-3 text-brand-red" />{" "}
              {lang === "pl" ? "Okres wynajmu" : "Rental Period"}
            </h3>
            <div className="space-y-1 text-sm">
              <p>
                <span className="font-bold text-slate-700">
                  {lang === "pl" ? "Odbiór:" : "Pickup:"}
                </span>{" "}
                {activeBooking.dates.pickupDate} {lang === "pl" ? "o" : "at"}{" "}
                {activeBooking.dates.pickupTime}
              </p>
              <p>
                <span className="font-bold text-slate-700">
                  {lang === "pl" ? "Zwrot:" : "Return:"}
                </span>{" "}
                {activeBooking.dates.returnDate} {lang === "pl" ? "o" : "at"}{" "}
                {activeBooking.dates.returnTime}
              </p>
              <p className="text-brand-red font-black text-xs mt-2">
                {lang === "pl"
                  ? `Czas trwania: ${activeBooking.pricing.days} dni`
                  : `Duration: ${activeBooking.pricing.days} days`}
              </p>
            </div>
          </div>

          {/* Locations */}
          <div className="border border-slate-200 rounded-lg p-3">
            <h3 className="text-[11px] font-black uppercase text-slate-500 mb-2 flex items-center gap-2">
              <MapPin className="w-3 h-3 text-brand-red" />{" "}
              {lang === "pl" ? "Lokalizacje" : "Locations"}
            </h3>
            <div className="space-y-1 text-sm">
              <p>
                <span className="font-bold text-slate-700">
                  {lang === "pl" ? "Odbiór:" : "Pickup:"}
                </span>{" "}
                {activeBooking.dates.pickupLocation}
              </p>
              <p>
                <span className="font-bold text-slate-700">
                  {lang === "pl" ? "Zwrot:" : "Return:"}
                </span>{" "}
                {activeBooking.dates.returnLocation}
              </p>
            </div>
          </div>
        </div>

        {/* Vehicle & Extras */}
        <div className="grid grid-cols-2 gap-4 mb-4 break-inside-avoid">
          <div className="border border-slate-200 rounded-lg p-3">
            <h3 className="text-[11px] font-black uppercase text-slate-500 mb-2 flex items-center gap-2">
              <Sparkles className="w-3 h-3 text-brand-red" />{" "}
              {lang === "pl" ? "Pojazd" : "Vehicle"}
            </h3>
            <p className="text-base font-black text-slate-900">
              {activeBooking.car.name}
            </p>
          </div>

          <div className="border border-slate-200 rounded-lg p-3">
            <h3 className="text-[11px] font-black uppercase text-slate-500 mb-2 flex items-center gap-2">
              <UserCheck className="w-3 h-3 text-brand-red" />{" "}
              {lang === "pl" ? "Ochrona i Dodatki" : "Protection & Extras"}
            </h3>
            <p className="text-sm font-black text-slate-900">
              {activeBooking.package.name.split(" / ")[0]}
            </p>
            <p className="text-xs text-slate-600 mt-2 font-bold uppercase">
              {lang === "pl" ? "Dodatki:" : "Extras:"}
            </p>
            <p className="text-xs text-slate-700">{activeBooking.addons}</p>
          </div>
        </div>

        {/* Customer Details */}
        <div className="border border-slate-200 rounded-lg p-3 mb-4 break-inside-avoid">
          <h3 className="text-[11px] font-black uppercase text-slate-500 mb-2 flex items-center gap-2">
            <UserCheck className="w-3 h-3 text-brand-red" />{" "}
            {lang === "pl" ? "Dane Wynajmującego" : "Renter Details"}
          </h3>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-[10px] text-slate-500 font-bold uppercase">
                {lang === "pl" ? "Imię i nazwisko" : "Name"}
              </p>
              <p className="font-semibold text-slate-900">
                {customer.firstName} {customer.lastName}
              </p>
            </div>
            <div>
              <p className="text-[10px] text-slate-500 font-bold uppercase">
                {lang === "pl" ? "E-mail" : "Email"}
              </p>
              <p className="font-semibold text-slate-900 break-all">
                {customer.email}
              </p>
            </div>
            <div>
              <p className="text-[10px] text-slate-500 font-bold uppercase">
                {lang === "pl" ? "Telefon" : "Phone"}
              </p>
              <p className="font-semibold text-slate-900">{customer.phone}</p>
            </div>
          </div>
          {!isLoggedIn && (
            <p className="text-[11px] text-brand-red font-bold mt-3 flex items-center gap-2 bg-brand-red/5 p-2 rounded">
              <ShieldAlert className="w-3 h-3" />
              {t("lookupMaskedAlert")}
            </p>
          )}
        </div>

        {/* Pricing Summary */}
        <div className="border border-slate-200 rounded-lg p-3 break-inside-avoid">
          <h3 className="text-[11px] font-black uppercase text-slate-500 mb-2">
            {lang === "pl" ? "Podsumowanie cenowe" : "Pricing Summary"}
          </h3>
          <table className="w-full text-sm">
            <tbody>
              <tr className="border-b border-slate-100">
                <td className="py-2 text-slate-600">
                  {lang === "pl"
                    ? `Wynajem pojazdu (${activeBooking.pricing.days} dni)`
                    : `Vehicle Rental (${activeBooking.pricing.days} days)`}
                </td>
                <td className="py-2 text-right font-bold">
                  PLN {activeBooking.pricing.carCost.toFixed(2)}
                </td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="py-2 text-slate-600">
                  {lang === "pl" ? "Pakiet ochronny" : "Protection Package"}
                </td>
                <td className="py-2 text-right font-bold">
                  PLN {activeBooking.pricing.packageCost.toFixed(2)}
                </td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="py-2 text-slate-600">
                  {lang === "pl"
                    ? "Akcesoria i dodatki"
                    : "Accessories & Extras"}
                </td>
                <td className="py-2 text-right font-bold">
                  PLN {activeBooking.pricing.addonsCost.toFixed(2)}
                </td>
              </tr>
              <tr>
                <td className="py-3 text-base font-black text-slate-900">
                  {lang === "pl"
                    ? "RAZEM BRUTTO (23% VAT)"
                    : "TOTAL GROSS (23% VAT)"}
                </td>
                <td className="py-3 text-right text-base font-black text-brand-red">
                  PLN {activeBooking.pricing.total.toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Footer Terms */}
        <div className="mt-4 pt-3 border-t border-slate-200 text-[10px] text-slate-500 leading-tight break-inside-avoid">
          <p>
            •{" "}
            {lang === "pl"
              ? "Odbiór pojazdu jest możliwy wyłącznie po okazaniu ważnego dowodu osobistego i prawa jazdy."
              : "Vehicle pickup is only possible upon presentation of a valid ID and driving license."}
          </p>
          <p>
            •{" "}
            {lang === "pl"
              ? "Nielimitowany przebieg obowiązuje wyłącznie na terenie Rzeczypospolitej Polskiej."
              : "Unlimited mileage applies only within the territory of the Republic of Poland."}
          </p>
        </div>
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          header,
          footer,
          .no-print,
          .lg\\:col-span-4 {
            display: none !important;
          }
          body {
            background: #fff !important;
            color: #000 !important;
          }
          #voucher-pdf-content {
            border: none !important;
            box-shadow: none !important;
            padding: 0 !important;
            width: 100% !important;
          }
        }
      `}</style>
    </div>
  );
}
