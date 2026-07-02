"use client";

import { CreditCard, User, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
export default function CheckoutStep3({
  firstName, setFirstName,
  lastName, setLastName,
  phone, setPhone,
  email, setEmail,
  notes, setNotes,
  isInvoice, setIsInvoice,
  companyName, setCompanyName,
  companyAddress, setCompanyAddress,
  nip, setNip,
  paymentMethod, setPaymentMethod,
  consentPrivacy, setConsentPrivacy,
  consentTerms, setConsentTerms,
  consentData, setConsentData,
  consentMarketing, setConsentMarketing,
  isSubmitting,
  handleSubmit,
  t
}) {
    const router = useRouter();
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-2xl font-black text-slate-900 pb-3 border-b border-slate-200">
        {t("checkoutStep3")}
      </h2>

      {/* Customer Details */}
      <div className="p-6 bg-white rounded-2xl border border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-4 shadow-sm">
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{t("firstName")} *</label>
          <input 
            type="text" 
            required 
            value={firstName} 
            onChange={(e) => setFirstName(e.target.value)} 
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm font-semibold focus:outline-none focus:border-brand-red focus:bg-white transition" 
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{t("lastName")} *</label>
          <input 
            type="text" 
            required 
            value={lastName} 
            onChange={(e) => setLastName(e.target.value)} 
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm font-semibold focus:outline-none focus:border-brand-red focus:bg-white transition" 
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{t("phone")} *</label>
          <input 
            type="tel" 
            required 
            placeholder="+48 123 456 789" 
            value={phone} 
            onChange={(e) => setPhone(e.target.value)} 
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm font-semibold focus:outline-none focus:border-brand-red focus:bg-white transition" 
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{t("email")} *</label>
          <input 
            type="email" 
            required 
            placeholder="email@example.com" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm font-semibold focus:outline-none focus:border-brand-red focus:bg-white transition" 
          />
        </div>
        <div className="col-span-1 md:col-span-2">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{t("notes")}</label>
          <textarea 
            rows={3} 
            value={notes} 
            onChange={(e) => setNotes(e.target.value)} 
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm font-semibold focus:outline-none focus:border-brand-red focus:bg-white transition resize-none" 
          />
        </div>
      </div>

      {/* Invoice Section */}
      <div className="p-6 bg-white rounded-2xl border border-slate-200 space-y-4 shadow-sm">
        <label className="flex items-center gap-3 cursor-pointer">
          <input 
            type="checkbox" 
            checked={isInvoice} 
            onChange={(e) => setIsInvoice(e.target.checked)} 
            className="w-5 h-5 accent-brand-red rounded-lg border-slate-300 cursor-pointer" 
          />
          <span className="text-sm font-bold text-slate-900">{t("invoiceCheck")}</span>
        </label>
        {isInvoice && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 animate-fade-in">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{t("companyName")} *</label>
              <input 
                type="text" 
                required={isInvoice} 
                value={companyName} 
                onChange={(e) => setCompanyName(e.target.value)} 
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm font-semibold focus:outline-none focus:border-brand-red focus:bg-white transition" 
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{t("companyAddress")} *</label>
              <input 
                type="text" 
                required={isInvoice} 
                value={companyAddress} 
                onChange={(e) => setCompanyAddress(e.target.value)} 
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm font-semibold focus:outline-none focus:border-brand-red focus:bg-white transition" 
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{t("nip")} *</label>
              <input 
                type="text" 
                required={isInvoice} 
                placeholder="10-cyfrowy NIP" 
                value={nip} 
                onChange={(e) => setNip(e.target.value)} 
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm font-semibold focus:outline-none focus:border-brand-red focus:bg-white transition" 
              />
            </div>
          </div>
        )}
      </div>

      {/* Payment Method */}
      <div className="p-6 bg-white rounded-2xl border border-slate-200 space-y-4 shadow-sm">
        <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">{t("paymentTitle")}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div 
            onClick={() => setPaymentMethod("online")} 
            className={`p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 shadow-sm ${
              paymentMethod === "online" 
                ? "border-brand-red bg-brand-red/5 shadow-md shadow-brand-red/10" 
                : "border-slate-200 bg-slate-50 hover:border-slate-400 hover:shadow-md"
            }`}
          >
            <div className="flex items-center gap-3">
              <CreditCard className={`w-6 h-6 ${paymentMethod === "online" ? "text-brand-red" : "text-slate-400"}`} />
              <div>
                <p className="text-sm font-bold text-slate-900">Płatność Online</p>
                <p className="text-xs text-slate-500 font-medium">BLIK, Przelewy24, Autopay</p>
              </div>
            </div>
          </div>
          <div 
            onClick={() => setPaymentMethod("pickup")} 
            className={`p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 shadow-sm ${
              paymentMethod === "pickup" 
                ? "border-brand-red bg-brand-red/5 shadow-md shadow-brand-red/10" 
                : "border-slate-200 bg-slate-50 hover:border-slate-400 hover:shadow-md"
            }`}
          >
            <div className="flex items-center gap-3">
              <User className={`w-6 h-6 ${paymentMethod === "pickup" ? "text-brand-red" : "text-slate-400"}`} />
              <div>
                <p className="text-sm font-bold text-slate-900">Płatność przy odbiorze</p>
                <p className="text-xs text-slate-500 font-medium">Gotówka w punkcie wydań</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Consents */}
      <div className="p-6 bg-white rounded-2xl border border-slate-200 space-y-4 shadow-sm">
        <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-4">{t("consentsTitle")}</h3>
        <div className="space-y-3">
          <label className="flex items-start gap-3 cursor-pointer py-2">
            <input 
              type="checkbox" 
              required 
              checked={consentPrivacy} 
              onChange={(e) => setConsentPrivacy(e.target.checked)} 
              className="w-5 h-5 accent-brand-red mt-0.5 cursor-pointer rounded" 
            />
            <span className="text-sm text-slate-700 font-semibold">
              Akceptuję <Link href="/privacy" className="text-brand-red hover:underline font-bold" target="_blank">Politykę Prywatności</Link> *
            </span>
          </label>
          <label className="flex items-start gap-3 cursor-pointer py-2">
            <input 
              type="checkbox" 
              required 
              checked={consentTerms} 
              onChange={(e) => setConsentTerms(e.target.checked)} 
              className="w-5 h-5 accent-brand-red mt-0.5 cursor-pointer rounded" 
            />
            <span className="text-sm text-slate-700 font-semibold">
              Akceptuję <Link href="/terms" className="text-brand-red hover:underline font-bold" target="_blank">Regulamin Wypożyczalni</Link> *
            </span>
          </label>
          <label className="flex items-start gap-3 cursor-pointer py-2">
            <input 
              type="checkbox" 
              required 
              checked={consentData} 
              onChange={(e) => setConsentData(e.target.checked)} 
              className="w-5 h-5 accent-brand-red mt-0.5 cursor-pointer rounded" 
            />
            <span className="text-sm text-slate-700 font-semibold">{t("consentData")} *</span>
          </label>
          <label className="flex items-start gap-3 cursor-pointer py-2 border-t border-slate-100 pt-4 mt-2">
            <input 
              type="checkbox" 
              checked={consentMarketing} 
              onChange={(e) => setConsentMarketing(e.target.checked)} 
              className="w-5 h-5 accent-brand-red mt-0.5 cursor-pointer rounded" 
            />
            <span className="text-sm text-slate-700 font-semibold">{t("consentMarketing")}</span>
          </label>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-4 bg-brand-red hover:bg-brand-red-hover text-white text-sm font-black rounded-xl shadow-lg shadow-brand-red/20 hover:shadow-brand-red/40 transition-all duration-300 uppercase tracking-widest disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        onClick={() => router.push("/checkout?step=4")} 
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Przetwarzanie...
          </>
        ) : (
          `${t("reserveBtn")} (POTWIERDŹ REZERWACJĘ / SUBMIT BOOKING)`
        )}
      </button>
    </form>
  );
}