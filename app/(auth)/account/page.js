"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/app/context/AppContext";
import { User, Calendar, ShieldCheck, Mail, Phone, Lock, Eye, Download, Star, CheckCircle, AlertTriangle } from "lucide-react";

export default function CustomerPanel() {
  const router = useRouter();
  const {
    lang,
    currentUser,
    bookings,
    updateProfile,
    addReview,
    logoutUser,
    vehicles,
    t
  } = useApp();
  console.log(currentUser);
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // Reviews state
  const [reviewCar, setReviewCar] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  
  // Modals state
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  // Redirect to login if not logged in


  // if (!currentUser) {
  //   return null;
  // }

  // Find bookings of this client
  const myBookings = bookings.filter((b) => b.customer.email.toLowerCase() === currentUser.email.toLowerCase());

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    setSaveSuccess(false);
    console.log(password);
    if (password && password !== confirmPassword) {
      alert(lang === "pl" ? "Hasła nie pasują!" : "Passwords do not match!");
      return;
    }

    updateProfile(phone, password || null);
    setSaveSuccess(true);
    setPassword("");
    setConfirmPassword("");
    
    setTimeout(() => {
      setSaveSuccess(false);
    }, 4000);
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (reviewText.trim()) {
      addReview({
        id: "rev_" + Math.random().toString(36).substr(2, 9),
        name: currentUser.firstName,
        rating: reviewRating,
        car: reviewCar,
        text: reviewText,
        date: new Date().toISOString().split("T")[0],
        approved: false // awaits admin moderation
      });

      setReviewSuccess(true);
      setReviewText("");
      setTimeout(() => {
        setReviewSuccess(false);
      }, 4000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-12 animate-fade-in print:bg-white print:text-black">
      
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 pb-6 gap-4 print:hidden">
        <div>
          <h1 className="text-3xl font-black text-slate-800 uppercase">{t("navMyAccount")}</h1>
          <p className="text-xs text-slate-500">Zarządzaj swoimi danymi kontaktowymi, historią rezerwacji i dodawaj opinie.</p>
        </div>
        <button
          onClick={() => {
            logoutUser();
            router.push("/");
          }}
          className="px-5 py-2 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 text-xs font-bold rounded-lg text-slate-600 transition"
        >
          {t("navLogout")}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 print:block">
        
        {/* Left Side: Profile Information Form */}
        <div className="lg:col-span-5 space-y-6 print:hidden">
          <div className="glass-panel p-6 rounded-2xl space-y-5">
            <h2 className="text-base font-extrabold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2.5">
              Twoje Dane Profilowe / Personal Info:
            </h2>

            {saveSuccess && (
              <div className="p-3 bg-green-950/20 border border-green-800/30 text-green-500 text-xs font-bold rounded-lg flex items-center space-x-2">
                <CheckCircle className="w-4 h-4" />
                <span>Dane zostały zaktualizowane! / Profile updated!</span>
              </div>
            )}

            <form onSubmit={handleUpdateProfile} className="space-y-4 text-xs font-bold text-slate-500">
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1.5">{t("firstName")}</label>
                  <input
                    type="text"
                    disabled
                    value={currentUser?.firstName}
                    className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded text-slate-400 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block mb-1.5">{t("lastName")}</label>
                  <input
                    type="text"
                    disabled
                    value={currentUser?.lastName}
                    className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded text-slate-400 cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1.5">{t("email")} (Login)</label>
                <input
                  type="email"
                  disabled
                  value={currentUser?.email}
                  className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded text-slate-400 cursor-not-allowed font-mono"
                />
              </div>

              <div>
                <label className="block mb-1.5 flex items-center space-x-1">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{t("phone")}</span>
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 focus:border-brand-red text-slate-800 rounded focus:outline-none"
                />
              </div>

              <div className="border-t border-slate-100 pt-4 mt-2 space-y-3">
                <p className="text-[10px] text-slate-400 uppercase font-extrabold tracking-wider">Zmień Hasło / Change Password</p>
                <div>
                  <input
                    type="password"
                    placeholder="Nowe hasło / New password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 focus:border-brand-red text-slate-800 rounded text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <input
                    type="password"
                    placeholder="Potwierdź nowe hasło / Confirm password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 focus:border-brand-red text-slate-800 rounded text-xs focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-brand-red hover:bg-brand-red-hover text-white text-xs font-extrabold rounded transition shadow"
              >
                ZAPISZ ZMIANY / SAVE CHANGES
              </button>

            </form>
          </div>
        </div>

        {/* Right Side: Reservation History */}
        <div className="lg:col-span-7 space-y-6 print:w-full">
          
          {/* Reservation List */}
          <div className="glass-panel p-6 rounded-2xl space-y-5 print:border-none print:bg-white print:text-black">
            <h2 className="text-base font-extrabold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2.5 print:text-black print:border-black">
              Historia Twoich Rezerwacji / Bookings History:
            </h2>

            {myBookings.length > 0 ? (
              <div className="space-y-4 print:space-y-6">
                {myBookings.map((b) => {
                  const statusColors = {
                    awaiting_confirmation: "bg-yellow-600 text-white",
                    confirmed: "bg-green-700 text-white",
                    cancelled: "bg-red-700 text-white"
                  };

                  const payColors = {
                    paid_online: "text-green-600",
                    payment_upon_pickup: "text-blue-600",
                    awaiting_payment: "text-yellow-600"
                  };

                  return (
                    <div key={b.id} className="p-4 bg-slate-50 border border-slate-200/60 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 print:border-black print:bg-white">
                      <div className="space-y-1 text-xs font-semibold">
                        <div className="flex items-center space-x-2">
                          <span className="font-mono text-sm font-extrabold text-slate-800 print:text-black">{b.id}</span>
                          <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${statusColors[b.status]}`}>
                            {b.status === "confirmed" ? t("statusConfirmed") :
                             b.status === "cancelled" ? t("statusCancelled") : t("statusAwaiting")}
                          </span>
                        </div>
                        <p className="text-slate-500 print:text-black">{b.dates.pickupDate} - {b.dates.returnDate} | <strong className="text-slate-800 print:text-black">{b.car.brand} {b.car.model}</strong></p>
                        <p className="text-[10px] text-slate-400 flex items-center space-x-1">
                          <span>Status płatności:</span>
                          <strong className={payColors[b.paymentStatus]}>
                            {b.paymentStatus === "paid_online" ? t("payStatusPaid") :
                             b.paymentStatus === "payment_upon_pickup" ? t("payStatusPickup") : t("payStatusAwaiting")}
                          </strong>
                        </p>
                      </div>
                      
                      <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto text-xs font-bold gap-2 print:hidden">
                        <span className="text-slate-800 text-sm font-extrabold">
                          {b.pricing.total === "Individual Price" ? "Indywidualna" : `PLN ${b.pricing.total.toFixed(2)}`}
                        </span>
                        <button
                          onClick={() => setSelectedBooking(b)}
                          className="px-3.5 py-1.5 bg-white border border-slate-200 hover:border-slate-300 text-[10px] text-slate-600 rounded transition flex items-center space-x-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>SZCZEGÓŁY / DETAILS</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-8 border border-slate-200 rounded-xl bg-slate-50/50 text-center text-xs text-slate-500">
                Brak dokonanych rezerwacji pod tym adresem.
              </div>
            )}
          </div>

          {/* Add Review Panel */}
          <div className="glass-panel p-6 rounded-2xl space-y-5 print:hidden">
            <h2 className="text-base font-extrabold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2.5">
              Napisz Opinię / Submit a Review:
            </h2>

            {reviewSuccess && (
              <div className="p-3 bg-green-950/20 border border-green-800/30 text-green-500 text-xs font-bold rounded-lg flex items-center space-x-2">
                <CheckCircle className="w-4 h-4" />
                <span>Opinia została wysłana! Oczekuje na zatwierdzenie przez administratora.</span>
              </div>
            )}

            <form onSubmit={handleSubmitReview} className="space-y-4 text-xs font-bold text-slate-500">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1.5">Wybierz pojazd *</label>
                  <select
                    value={reviewCar}
                    onChange={(e) => setReviewCar(e.target.value)}
                    className="w-full bg-white border border-slate-200 text-slate-800 px-3 py-2 rounded focus:outline-none"
                  >
                    {vehicles.map((v) => (
                      <option key={v.id} value={`${v.brand} ${v.model}`}>
                        {v.brand} {v.model}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block mb-1.5">{t("ratingLabel")} *</label>
                  <select
                    value={reviewRating}
                    onChange={(e) => setReviewRating(parseInt(e.target.value))}
                    className="w-full bg-white border border-slate-200 text-slate-800 px-3 py-2 rounded focus:outline-none text-yellow-500"
                  >
                    <option value={5}>★★★★★ (5/5)</option>
                    <option value={4}>★★★★☆ (4/5)</option>
                    <option value={3}>★★★☆☆ (3/5)</option>
                    <option value={2}>★★☆☆☆ (2/5)</option>
                    <option value={1}>★☆☆☆☆ (1/5)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block mb-1.5">{t("reviewTextLabel")} *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Napisz kilka zdań o samochodzie i obsłudze..."
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 focus:border-brand-red text-slate-800 text-xs rounded focus:outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-brand-red hover:bg-brand-red-hover text-white text-xs font-extrabold rounded transition shadow"
              >
                WYŚLIJ OPINIĘ / SUBMIT
              </button>
            </form>
          </div>

        </div>

      </div>

      {/* Details Modal (Printable) */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/65 backdrop-blur-sm p-4 print:relative print:bg-white print:text-black print:inset-0 print:p-0">
          <div className="w-full max-w-2xl bg-white border border-slate-100 rounded-2xl p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto animate-scale-up print:border-none print:bg-white print:text-black print:max-h-full print:shadow-none print:p-0">
            
            <div className="flex justify-between items-center border-b border-slate-100 pb-4 print:hidden">
              <h3 className="text-base font-extrabold text-slate-800 uppercase tracking-wider">Szczegóły rezerwacji</h3>
              <button
                onClick={() => setSelectedBooking(null)}
                className="px-3 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-100 rounded text-[10px] text-slate-500 hover:text-slate-800"
              >
                ZAMKNIJ / CLOSE
              </button>
            </div>

            {/* Print Layout details block */}
            <div className="space-y-6 text-sm text-slate-600 print:text-black">
              
              <div className="flex justify-between items-baseline border-b border-slate-100 pb-4">
                <div>
                  <h4 className="text-xl font-black text-slate-800 font-mono print:text-black">{selectedBooking.id}</h4>
                  <p className="text-xs text-slate-500">Data rezerwacji: {selectedBooking.date}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Status:</span>
                  <p className="font-extrabold text-brand-red print:text-black">
                    {selectedBooking.status === "confirmed" ? "POTWIERDZONA" :
                     selectedBooking.status === "cancelled" ? "ANULOWANA" : "OCZEKUJE NA POTWIERDZENIE"}
                  </p>
                </div>
              </div>

              {/* Rented Car details */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5 p-3.5 bg-slate-50/50 border border-slate-100 rounded-xl print:border-black">
                  <h5 className="text-xs text-slate-400 uppercase font-bold">Pojazd / Vehicle</h5>
                  <p className="font-extrabold text-slate-800 print:text-black">{selectedBooking.car.brand} {selectedBooking.car.model}</p>
                  <p className="text-xs text-slate-500">Klasa: {selectedBooking.car.class} | Paliwo: {selectedBooking.car.fuel}</p>
                </div>
                <div className="space-y-1.5 p-3.5 bg-slate-50/50 border border-slate-100 rounded-xl print:border-black">
                  <h5 className="text-xs text-slate-400 uppercase font-bold">Pakiet ochrony</h5>
                  <p className="font-extrabold text-slate-800 print:text-black">{selectedBooking.package.name.split(" / ")[0]}</p>
                  <p className="text-xs text-slate-500">Cena: +PLN {selectedBooking.pricing.packageCost}</p>
                </div>
              </div>

              {/* Rental periods and locations */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-100 pt-4">
                <div className="space-y-1.5">
                  <h5 className="text-xs text-slate-400 uppercase font-bold">Termin / Dates</h5>
                  <p>Odbiór: <strong className="text-slate-800 print:text-black">{selectedBooking.dates.pickupDate}</strong> godz. {selectedBooking.dates.pickupTime}</p>
                  <p>Zwrot: <strong className="text-slate-800 print:text-black">{selectedBooking.dates.returnDate}</strong> godz. {selectedBooking.dates.returnTime}</p>
                  <p className="text-xs text-slate-500">Dni najmu: {selectedBooking.pricing.days} d.</p>
                </div>
                
                <div className="space-y-1.5">
                  <h5 className="text-xs text-slate-400 uppercase font-bold">Lokalizacja / Locations</h5>
                  <p>Punkt wydania: <strong className="text-slate-800 print:text-black">{selectedBooking.dates.pickupLocation}</strong></p>
                  <p>Punkt zwrotu: <strong className="text-slate-800 print:text-black">{selectedBooking.dates.returnLocation}</strong></p>
                </div>
              </div>

              {/* Addons selected */}
              {selectedBooking.addons.length > 0 && (
                <div className="border-t border-slate-100 pt-4 space-y-1.5">
                  <h5 className="text-xs text-slate-400 uppercase font-bold">Dodatkowe Akcesoria / Extras</h5>
                  <ul className="list-disc pl-5 text-xs text-slate-600 space-y-0.5 print:text-black">
                    {selectedBooking.addons.map((addName, idx) => (
                      <li key={idx}>{addName.split(" / ")[0]}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Pricing overview */}
              <div className="border-t border-slate-100 pt-4 space-y-3.5">
                <h5 className="text-xs text-slate-400 uppercase font-bold">Rozliczenie Finansowe / Pricing Breakdown</h5>
                <div className="text-xs font-semibold text-slate-500 space-y-1 text-left">
                  <div className="flex justify-between">
                    <span>Wynajem pojazdu ({selectedBooking.pricing.days} dni):</span>
                    <span className="text-slate-800 print:text-black">PLN {selectedBooking.pricing.carCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pakiet ochrony:</span>
                    <span className="text-slate-800 print:text-black">PLN {selectedBooking.pricing.packageCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Dodatki:</span>
                    <span className="text-slate-800 print:text-black">PLN {selectedBooking.pricing.addonsCost.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between text-base font-black text-slate-800 pt-2.5 border-t border-slate-100 print:text-black print:border-black">
                    <span>KOSZT BRUTTO (23% VAT):</span>
                    <span className="text-brand-red print:text-black">
                      {selectedBooking.pricing.total === "Individual Price" ? "Wycena Indywidualna" : `PLN ${selectedBooking.pricing.total.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="text-right text-[10px] text-slate-400">
                    Kaucja zwrotna (blokowana przy odbiorze): PLN {selectedBooking.car.deposit}
                  </div>
                </div>
              </div>

            </div>

            {/* Print and Download Actions */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100 print:hidden">
              <button
                onClick={handlePrint}
                className="px-5 py-2 bg-brand-red hover:bg-brand-red-hover text-white text-xs font-bold rounded-lg flex items-center space-x-1.5 shadow"
              >
                <Download className="w-3.5 h-3.5" />
                <span>DRUKUJ POTWIERDZENIE (DOWNLOAD PDF)</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
