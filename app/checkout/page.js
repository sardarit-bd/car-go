"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useApp } from "@/app/context/AppContext";
import SearchForm from "@/app/components/SearchForm";
import { Calendar, User, CreditCard, ShieldCheck, CheckCircle2, ChevronRight, Info, Plus, Check } from "lucide-react";

function CheckoutFlowContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    lang,
    vehicles,
    packages,
    addons,
    searchParams: activeSearch,
    setSearchParams,
    addBooking,
    bookings,
    updateBookingStatus,
    t
  } = useApp();

  // URL step routing
  const initialStep = parseInt(searchParams.get("step")) || 1;
  const preSelectedCarId = searchParams.get("car") || "";

  const [step, setStep] = useState(initialStep);
  const [selectedCar, setSelectedCar] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [selectedAddons, setSelectedAddons] = useState([]);
  
  // Client forms
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [isInvoice, setIsInvoice] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");
  const [nip, setNip] = useState("");
  
  // Payment methods
  const [paymentMethod, setPaymentMethod] = useState("online"); // online or pickup
  
  // Consents
  const [consentPrivacy, setConsentPrivacy] = useState(false);
  const [consentTerms, setConsentTerms] = useState(false);
  const [consentData, setConsentData] = useState(false);
  const [consentMarketing, setConsentMarketing] = useState(false);
  
  // Final states
  const [createdBooking, setCreatedBooking] = useState(null);
  const [paymentCompleted, setPaymentCompleted] = useState(false);

  // Sync step changes with searchParams
  useEffect(() => {
    const urlStep = parseInt(searchParams.get("step")) || 1;
    setStep(urlStep);
  }, [searchParams]);

  // Pre-select vehicle if URL contains car parameter
  useEffect(() => {
    if (preSelectedCarId && vehicles.length > 0) {
      const match = vehicles.find((v) => v.id === preSelectedCarId);
      if (match) {
        setSelectedCar(match);
      }
    }
  }, [preSelectedCarId, vehicles]);

  // Auto-set default package to "basic"
  useEffect(() => {
    if (packages.length > 0 && !selectedPackage) {
      setSelectedPackage(packages[0]);
    }
  }, [packages, selectedPackage]);

  // Pricing calculations
  const getDays = () => {
    return activeSearch ? activeSearch.days : 1;
  };

  const getCarCost = () => {
    if (!selectedCar) return 0;
    return selectedCar.price * getDays();
  };

  const getPackageCost = () => {
    if (!selectedPackage) return 0;
    return selectedPackage.pricePerDay * getDays();
  };

  const getAddonsCost = () => {
    let cost = 0;
    selectedAddons.forEach((addonId) => {
      const item = addons.find((a) => a.id === addonId);
      if (item) {
        cost += item.isPerDay ? item.price * getDays() : item.price;
      }
    });
    return cost;
  };

  const getTotalGross = () => {
    if (activeSearch?.isCustomPrice) {
      return "Individual Price";
    }
    return getCarCost() + getPackageCost() + getAddonsCost();
  };

  // Step Actions
  const handleSelectCar = (car) => {
    setSelectedCar(car);
    // If no search context yet, set simple default search parameter
    if (!activeSearch) {
      setSearchParams({
        pickupLocation: "Skarbimierz-Osiedle",
        returnLocation: "Skarbimierz-Osiedle",
        pickupDate: new Date(Date.now() + 86400000).toISOString().split("T")[0],
        returnDate: new Date(Date.now() + 86400000 * 4).toISOString().split("T")[0],
        pickupTime: "08:00",
        returnTime: "08:00",
        days: 3,
        isCustomPrice: false
      });
    }
    router.push("/checkout?step=2");
  };

  const handleToggleAddon = (addonId) => {
    if (selectedAddons.includes(addonId)) {
      setSelectedAddons(selectedAddons.filter((id) => id !== addonId));
    } else {
      setSelectedAddons([...selectedAddons, addonId]);
    }
  };

  const handleSaveDetails = (e) => {
    e.preventDefault();

    if (!consentPrivacy || !consentTerms || !consentData) {
      alert(lang === "pl" ? "Proszę zaakceptować wymagane zgody!" : "Please accept the required consents!");
      return;
    }

    // Generate unique booking code
    const bookingId = "CAR-GO-" + Math.floor(10000 + Math.random() * 90000);

    const newBooking = {
      id: bookingId,
      car: selectedCar,
      dates: activeSearch,
      pricing: {
        days: getDays(),
        carCost: getCarCost(),
        packageCost: getPackageCost(),
        addonsCost: getAddonsCost(),
        total: getTotalGross()
      },
      package: selectedPackage,
      addons: selectedAddons.map((id) => addons.find((a) => a.id === id).name),
      customer: {
        firstName,
        lastName,
        phone,
        email,
        notes,
        invoice: isInvoice ? { companyName, companyAddress, nip } : null
      },
      status: "awaiting_confirmation",
      paymentMethod: paymentMethod === "online" ? "online" : "pickup",
      paymentStatus: paymentMethod === "online" ? "awaiting_payment" : "payment_upon_pickup",
      date: new Date().toISOString().split("T")[0]
    };

    addBooking(newBooking);
    setCreatedBooking(newBooking);
    router.push(`/checkout?step=4&id=${bookingId}`);
  };

  const handleSimulatePayment = () => {
    if (createdBooking) {
      updateBookingStatus(createdBooking.id, "awaiting_confirmation"); // keep status, change payment state
      
      // Update local copy
      const localUsers = JSON.parse(localStorage.getItem("cargo_bookings") || "[]");
      const match = localUsers.find((b) => b.id === createdBooking.id);
      if (match) {
        match.paymentStatus = "paid_online";
        localStorage.setItem("cargo_bookings", JSON.stringify(localUsers));
      }
      
      setPaymentCompleted(true);
      
      // Log payment confirmation mail
      const emailText = `
Witaj/Hello ${createdBooking.customer.firstName} ${createdBooking.customer.lastName},

Otrzymaliśmy płatność online za rezerwację ${createdBooking.id}!
We have successfully received your online payment for booking ${createdBooking.id}!

Kwota / Paid amount: PLN ${createdBooking.pricing.total.toFixed(2)}
Status płatności / Payment status: OPŁACONA / PAID

Oczekuj na ostateczne zatwierdzenie rezerwacji przez administratora.
Please await final confirmation of your booking by the administrator.

Pozdrawiamy / Best regards,
Zespół CAR-GO.PL
      `;
      
      // trigger logEmail
      const cargoEmails = JSON.parse(localStorage.getItem("cargo_emails") || "[]");
      cargoEmails.unshift({
        id: "pay_" + Math.random().toString(36).substr(2, 9),
        to: createdBooking.customer.email,
        subject: `[CAR-GO.PL] Potwierdzenie płatności / Payment confirmation ${createdBooking.id}`,
        body: emailText,
        date: new Date().toLocaleString()
      });
      localStorage.setItem("cargo_emails", JSON.stringify(cargoEmails));
    }
  };

  // Render SVG diagrams for vehicles
  const renderCarSvg = () => (
    <svg className="w-24 h-12" viewBox="0 0 500 220" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M70 120 C 130 115, 230 115, 270 95 C 310 75, 360 70, 390 90 C 420 110, 440 120, 460 120 C 480 120, 490 135, 490 145 L 490 165 C 490 170, 480 175, 470 175 C 450 175, 430 175, 410 175 C 400 160, 375 160, 365 175 C 320 175, 180 175, 135 175 C 125 160, 100 160, 90 175 C 60 175, 30 170, 20 165 C 15 160, 10 145, 10 135 C 10 128, 30 122, 70 120 Z" fill="#64748b" stroke="#cbd5e1" strokeWidth="2.5"/>
      <path d="M120 125 C 170 120, 260 120, 280 105 L 340 105 C 375 120, 390 125, 430 125" stroke="#FF0000" strokeWidth="3" />
      <circle cx="112" cy="175" r="26" fill="#1e293b" stroke="#cbd5e1" strokeWidth="4" />
      <circle cx="382" cy="175" r="26" fill="#1e293b" stroke="#cbd5e1" strokeWidth="4" />
    </svg>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 space-y-8 animate-fade-in text-slate-800">
      
      {/* Checkout Steps Indicator */}
      <div className="flex justify-between items-center max-w-2xl mx-auto border-b border-slate-100 pb-5 text-xs sm:text-sm font-bold text-slate-400">
        <div className={`flex items-center space-x-1 ${step >= 1 ? "text-slate-800" : ""}`}>
          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 1 ? "bg-brand-red text-white" : "bg-slate-200 text-slate-400"}`}>1</span>
          <span>{t("checkoutStep1")}</span>
        </div>
        <ChevronRight className="w-4 h-4 text-slate-300" />
        <div className={`flex items-center space-x-1 ${step >= 2 ? "text-slate-800" : ""}`}>
          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 2 ? "bg-brand-red text-white" : "bg-slate-200 text-slate-400"}`}>2</span>
          <span>{t("checkoutStep2")}</span>
        </div>
        <ChevronRight className="w-4 h-4 text-slate-300" />
        <div className={`flex items-center space-x-1 ${step >= 3 ? "text-slate-800" : ""}`}>
          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 3 ? "bg-brand-red text-white" : "bg-slate-200 text-slate-400"}`}>3</span>
          <span>{t("checkoutStep3")}</span>
        </div>
        <ChevronRight className="w-4 h-4 text-slate-300" />
        <div className={`flex items-center space-x-1 ${step >= 4 ? "text-slate-800" : ""}`}>
          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 4 ? "bg-brand-red text-white" : "bg-slate-200 text-slate-400"}`}>4</span>
          <span>{t("checkoutStep4")}</span>
        </div>
      </div>

      {/* Main Layout containing Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left/Center Panel: Step content */}
        <div className="lg:col-span-8">
          
          {/* STEP 1: Vehicles Selection */}
          {step === 1 && (
            <div className="space-y-6">
              {!activeSearch && (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-500 font-semibold shadow-sm">
                  ℹ️ Proszę wyszukać dogodne terminy przy użyciu formularza. Wyświetlamy ofertę domyślną.
                </div>
              )}
              {(() => {
                const availableVehicles = vehicles.filter((car) => {
                  if (!activeSearch || !activeSearch.pickupDate || !activeSearch.returnDate) return true;
                  const { pickupDate, returnDate } = activeSearch;
                  
                  const hasOverlap = bookings.some((booking) => {
                    if (booking.car.id !== car.id) return false;
                    if (booking.status === "cancelled") return false;
                    
                    const bStart = booking.dates?.pickupDate;
                    const bEnd = booking.dates?.returnDate;
                    
                    if (!bStart || !bEnd) return false;
                    return bStart <= returnDate && bEnd >= pickupDate;
                  });
                  
                  return !hasOverlap;
                });

                return (
                  <>
                    <h2 className="text-xl font-black text-slate-800 border-b border-slate-100 pb-3 uppercase">
                      {t("checkoutStep1")} ({availableVehicles.length})
                    </h2>

                    <div className="grid grid-cols-1 gap-4">
                      {availableVehicles.length === 0 ? (
                        <div className="p-8 text-center bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                          <p className="font-extrabold text-slate-800 text-lg">
                            {lang === "pl" ? "Brak dostępnych pojazdów" : "No vehicles available"}
                          </p>
                          <p className="text-slate-500 text-sm font-semibold">
                            {lang === "pl" 
                              ? "Wszystkie nasze samochody są zarezerwowane w wybranym terminie. Spróbuj zmienić daty wynajmu." 
                              : "All our vehicles are booked during the selected period. Please try changing your rental dates."}
                          </p>
                        </div>
                      ) : (
                        availableVehicles.map((car) => {
                          const carTotal = activeSearch?.isCustomPrice ? "Individual Price" : car.price * getDays();
                          return (
                            <div key={car.id} className="p-4 bg-white rounded-xl border border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm hover:border-slate-350 transition">
                              <div className="flex flex-col sm:flex-row items-center gap-4">
                                <div className="bg-slate-50 rounded p-2 flex items-center justify-center w-28 h-16 border border-slate-100">
                                  {car.image || car.id === "fiat-500" ? (
                                    <img
                                      src={car.image || "/fiat500.png"}
                                      alt={`${car.brand} ${car.model}`}
                                      className="h-12 w-auto object-contain transition"
                                    />
                                  ) : (
                                    renderCarSvg()
                                  )}
                                </div>
                                <div className="text-center sm:text-left space-y-1">
                                  <h3 className="text-base font-extrabold text-slate-800">{car.brand} {car.model}</h3>
                                  <p className="text-xs text-slate-500 font-bold">{car.class} | {car.fuel === "Petrol" ? t("fuelPetrol") : t("fuelDiesel")}</p>
                                </div>
                              </div>
                              <div className="text-center sm:text-right flex flex-col items-center sm:items-end justify-center">
                                <span className="text-[10px] text-slate-400 font-bold uppercase">Cena za okres najmu:</span>
                                <p className="text-base font-black text-brand-red mt-0.5">
                                  {carTotal === "Individual Price" ? t("individualPriceAlert").slice(0, 18) : `PLN ${carTotal}`}
                                </p>
                                <button
                                  onClick={() => handleSelectCar(car)}
                                  className="mt-2.5 px-5 py-2 bg-brand-red hover:bg-brand-red-hover text-white text-xs font-black rounded-lg shadow transition"
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
                );
              })()}
            </div>
          )}

          {/* STEP 2: Protection Packages & Add-ons */}
          {step === 2 && selectedCar && (
            <div className="space-y-8">
              
              {/* Packages */}
              <div className="space-y-4">
                <h2 className="text-xl font-black text-slate-800 border-b border-slate-100 pb-3 uppercase">
                  {t("packageTitle")}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {packages.map((pkg) => {
                    const isSelected = selectedPackage?.id === pkg.id;
                    return (
                      <div
                        key={pkg.id}
                        onClick={() => setSelectedPackage(pkg)}
                        className={`p-5 rounded-xl border cursor-pointer transition flex flex-col justify-between shadow-sm ${
                          isSelected
                            ? "bg-brand-red/5 border-brand-red text-slate-800 glow-red"
                            : "bg-white border-slate-200 text-slate-700 hover:border-slate-400"
                        }`}
                      >
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <h3 className="text-sm font-extrabold uppercase text-slate-800">{pkg.name.split(" / ")[lang === "pl" ? 0 : 1]}</h3>
                            {isSelected && <CheckCircle2 className="w-5 h-5 text-brand-red" />}
                          </div>
                          <p className="text-base font-black text-slate-900 mt-1">
                            +PLN {pkg.pricePerDay}
                            <span className="text-xs text-slate-400 font-normal">/doba</span>
                          </p>
                          <ul className="space-y-1.5 text-[10px] text-slate-500 leading-relaxed font-semibold mt-3 border-t border-slate-100 pt-3">
                            {(lang === "pl" ? pkg.featuresPl : pkg.featuresEn).map((f, i) => (
                              <li key={i} className="flex items-start space-x-1.5">
                                <span className="text-brand-red mt-0.5">•</span>
                                <span>{f}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Addons */}
              <div className="space-y-4">
                <h2 className="text-xl font-black text-slate-800 border-b border-slate-100 pb-3 uppercase">
                  {t("addonsTitle")}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {addons.map((add) => {
                    const isChecked = selectedAddons.includes(add.id);
                    return (
                      <div
                        key={add.id}
                        onClick={() => handleToggleAddon(add.id)}
                        className={`p-4 rounded-xl border cursor-pointer transition flex items-center justify-between shadow-sm ${
                          isChecked
                            ? "bg-brand-red/5 border-brand-red"
                            : "bg-white border-slate-200 hover:border-slate-400"
                        }`}
                      >
                        <div className="space-y-0.5 text-left">
                          <p className="text-xs font-black text-slate-800">
                            {add.name.split(" / ")[lang === "pl" ? 0 : 1]}
                          </p>
                          <p className="text-[10px] text-slate-500 font-medium">
                            {lang === "pl" ? add.descriptionPl : add.descriptionEn}
                          </p>
                          <p className="text-xs text-brand-red font-extrabold pt-1">
                            PLN {add.price}
                            <span className="text-[10px] text-slate-450 font-normal">
                              {add.isPerDay ? "/doba" : " (jednorazowo)"}
                            </span>
                          </p>
                        </div>
                        <div className={`w-5 h-5 rounded border flex items-center justify-center transition ${
                          isChecked ? "bg-brand-red border-brand-red text-white" : "border-slate-300 bg-slate-50"
                        }`}>
                          {isChecked && <Check className="w-3.5 h-3.5" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Navigation button */}
              <div className="flex justify-end pt-4">
                <button
                  onClick={() => router.push("/checkout?step=3")}
                  className="px-8 py-3 bg-brand-red hover:bg-brand-red-hover text-white text-xs font-black rounded-xl shadow transition duration-200"
                >
                  DALEJ / CONTINUE
                </button>
              </div>

            </div>
          )}

          {/* STEP 3: Customer Information & Consent Form */}
          {step === 3 && selectedCar && (
            <form onSubmit={handleSaveDetails} className="space-y-8">
              <h2 className="text-xl font-black text-slate-800 border-b border-slate-100 pb-3 uppercase">
                {t("checkoutStep3")}
              </h2>

              {/* Contact Information Fields */}
              <div className="p-6 bg-white rounded-xl border border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-4 shadow-sm">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5">{t("firstName")} *</label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-sm font-semibold focus:outline-none focus:border-brand-red"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5">{t("lastName")} *</label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-sm font-semibold focus:outline-none focus:border-brand-red"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5">{t("phone")} *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+48 123 456 789"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-sm font-semibold focus:outline-none focus:border-brand-red"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5">{t("email")} *</label>
                  <input
                    type="email"
                    required
                    placeholder="email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-sm font-semibold focus:outline-none focus:border-brand-red"
                  />
                </div>
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-xs font-bold text-slate-500 mb-1.5">{t("notes")}</label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-sm font-semibold focus:outline-none focus:border-brand-red resize-none"
                  />
                </div>
              </div>

              {/* VAT Invoice Fields */}
              <div className="p-6 bg-white rounded-xl border border-slate-100 space-y-4 shadow-sm">
                <label className="flex items-center space-x-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isInvoice}
                    onChange={(e) => setIsInvoice(e.target.checked)}
                    className="w-4.5 h-4.5 accent-brand-red rounded border-slate-300 cursor-pointer"
                  />
                  <span className="text-xs font-bold text-slate-850">{t("invoiceCheck")}</span>
                </label>

                {isInvoice && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 animate-fade-in">
                    <div>
                      <label className="block text-xs font-bold text-slate-550 mb-1.5">{t("companyName")} *</label>
                      <input
                        type="text"
                        required={isInvoice}
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-xs font-semibold focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-550 mb-1.5">{t("companyAddress")} *</label>
                      <input
                        type="text"
                        required={isInvoice}
                        value={companyAddress}
                        onChange={(e) => setCompanyAddress(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-xs font-semibold focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-550 mb-1.5">{t("nip")} *</label>
                      <input
                        type="text"
                        required={isInvoice}
                        placeholder="10-cyfrowy NIP"
                        value={nip}
                        onChange={(e) => setNip(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-xs font-semibold focus:outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Payment Methods Choice */}
              <div className="p-6 bg-white rounded-xl border border-slate-100 space-y-4 shadow-sm">
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">{t("paymentTitle")}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div
                    onClick={() => setPaymentMethod("online")}
                    className={`p-4 rounded-xl border cursor-pointer transition shadow-sm ${
                      paymentMethod === "online" ? "border-brand-red bg-brand-red/5" : "border-slate-200 bg-slate-50 hover:border-slate-400"
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <CreditCard className="w-5 h-5 text-brand-red" />
                      <div>
                        <p className="text-xs font-bold text-slate-850">Płatność Online</p>
                        <p className="text-[10px] text-slate-400">BLIK, Przelewy24, Autopay</p>
                      </div>
                    </div>
                  </div>
                  <div
                    onClick={() => setPaymentMethod("pickup")}
                    className={`p-4 rounded-xl border cursor-pointer transition shadow-sm ${
                      paymentMethod === "pickup" ? "border-brand-red bg-brand-red/5" : "border-slate-200 bg-slate-50 hover:border-slate-400"
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <User className="w-5 h-5 text-slate-450" />
                      <div>
                        <p className="text-xs font-bold text-slate-850">Płatność przy odbiorze</p>
                        <p className="text-[10px] text-slate-400">Gotówka w punkcie wydań</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Consents */}
              <div className="p-6 bg-white rounded-xl border border-slate-100 space-y-3.5 text-xs text-slate-600 font-semibold shadow-sm">
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider mb-2">{t("consentsTitle")}</h3>
                <label className="flex items-start space-x-3.5 cursor-pointer py-1">
                  <input
                    type="checkbox"
                    required
                    checked={consentPrivacy}
                    onChange={(e) => setConsentPrivacy(e.target.checked)}
                    className="w-4.5 h-4.5 accent-brand-red mt-0.5 cursor-pointer"
                  />
                  <span>Akceptuję <Link href="/privacy" className="text-brand-red hover:underline font-bold" target="_blank">Politykę Prywatności</Link> *</span>
                </label>
                <label className="flex items-start space-x-3.5 cursor-pointer py-1">
                  <input
                    type="checkbox"
                    required
                    checked={consentTerms}
                    onChange={(e) => setConsentTerms(e.target.checked)}
                    className="w-4.5 h-4.5 accent-brand-red mt-0.5 cursor-pointer"
                  />
                  <span>Akceptuję <Link href="/terms" className="text-brand-red hover:underline font-bold" target="_blank">Regulamin Wypożyczalni</Link> *</span>
                </label>
                <label className="flex items-start space-x-3.5 cursor-pointer py-1">
                  <input
                    type="checkbox"
                    required
                    checked={consentData}
                    onChange={(e) => setConsentData(e.target.checked)}
                    className="w-4.5 h-4.5 accent-brand-red mt-0.5 cursor-pointer"
                  />
                  <span>{t("consentData")} *</span>
                </label>
                <label className="flex items-start space-x-3.5 cursor-pointer py-1 border-t border-slate-100 pt-3.5 mt-2">
                  <input
                    type="checkbox"
                    checked={consentMarketing}
                    onChange={(e) => setConsentMarketing(e.target.checked)}
                    className="w-4.5 h-4.5 accent-brand-red mt-0.5 cursor-pointer"
                  />
                  <span>{t("consentMarketing")}</span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-4 bg-brand-red hover:bg-brand-red-hover text-white text-sm font-black rounded-xl shadow hover:shadow-md transition uppercase tracking-widest"
              >
                {t("reserveBtn")} (POTWIERDŹ REZERWACJĘ / SUBMIT BOOKING)
              </button>
            </form>
          )}

          {/* STEP 4: Confirmation Screen */}
          {step === 4 && createdBooking && (
            <div className="space-y-6 animate-fade-in text-center lg:text-left">
              <div className="bg-white border border-slate-100 p-6 rounded-2xl space-y-6 shadow-sm">
                
                {/* Visual Check banner */}
                <div className="flex flex-col items-center py-4 space-y-3">
                  <CheckCircle2 className="w-16 h-16 text-green-500" />
                  <h2 className="text-2xl font-black text-slate-800">{t("confirmTitle")}</h2>
                  <div className="text-sm bg-slate-100 border border-slate-200 px-4 py-1.5 rounded-full text-slate-800 font-semibold">
                    {t("confirmNum")}: <span className="font-mono text-brand-red font-bold text-base tracking-widest">{createdBooking.id}</span>
                  </div>
                </div>

                {/* Specific payment options text */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-150 text-xs text-slate-600 font-semibold leading-relaxed text-left">
                  {createdBooking.paymentMethod === "online" ? (
                    <div className="space-y-3">
                      <p className="font-bold text-slate-800 flex items-center space-x-1.5">
                        <Info className="w-4 h-4 text-brand-red" />
                        <span>{t("confirmOnlineText")}</span>
                      </p>
                      {paymentCompleted ? (
                        <div className="p-3 bg-green-100 border border-green-200 rounded-lg text-green-700 font-bold text-center">
                          ✅ Płatność zakończona pomyślnie! Kwota została zablokowana.
                        </div>
                      ) : (
                        <button
                          onClick={handleSimulatePayment}
                          className="w-full py-2.5 bg-green-600 hover:bg-green-700 text-white font-black text-xs rounded-lg shadow transition"
                        >
                          {t("confirmPayBtn")} (SIMULATE GATEWAY INTERFACE)
                        </button>
                      )}
                    </div>
                  ) : (
                    <p className="text-center font-bold text-yellow-600 py-2">
                      ⚠️ {t("confirmPickupText")}
                    </p>
                  )}
                </div>

                {/* Masked details verification */}
                <div className="space-y-3 text-left">
                  <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">
                    Weryfikacja Wprowadzonych Danych / Details Verification:
                  </h3>
                  <ul className="text-xs text-slate-600 font-semibold space-y-1">
                    <li>Imię i Nazwisko: <strong className="text-slate-800 font-extrabold">{createdBooking.customer.firstName} {createdBooking.customer.lastName}</strong></li>
                    <li>E-mail: <strong className="text-slate-800 font-extrabold">{createdBooking.customer.email}</strong></li>
                    <li>Telefon: <strong className="text-slate-800 font-extrabold">{createdBooking.customer.phone}</strong></li>
                    {createdBooking.customer.invoice && (
                      <li className="text-[11px] text-slate-500 font-semibold">Faktura VAT na NIP: {createdBooking.customer.invoice.nip} ({createdBooking.customer.invoice.companyName})</li>
                    )}
                  </ul>
                </div>

                {/* Verification alerts */}
                <div className="border-t border-slate-100 pt-4 text-left">
                  <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider mb-2">{t("docRequired")}</h3>
                  <ul className="text-xs text-slate-500 space-y-1.5 leading-relaxed font-semibold">
                    <li className="flex items-center space-x-2">
                      <span className="w-1.5 h-1.5 bg-brand-red rounded-full flex-shrink-0" />
                      <span>{t("docId")} (Dowód osobisty / Paszport)</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="w-1.5 h-1.5 bg-brand-red rounded-full flex-shrink-0" />
                      <span>{t("docLicense")} (Ważne prawo jazdy)</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="w-1.5 h-1.5 bg-brand-red rounded-full flex-shrink-0" />
                      <span>{t("docCard")} (Karta płatnicza na depozyt)</span>
                    </li>
                  </ul>
                </div>

                <div className="flex justify-center pt-4">
                  <button
                    onClick={() => router.push("/")}
                    className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 font-bold text-xs rounded-lg transition"
                  >
                    POWRÓT DO STRONY GŁÓWNEJ / MAIN PAGE
                  </button>
                </div>

              </div>
            </div>
          )}

        </div>

        {/* Right Panel: Floating summary side box */}
        <div className="lg:col-span-4 lg:sticky lg:top-24">
          <div className="bg-white border border-slate-100 rounded-2xl p-5 space-y-5 shadow-sm">
            <h3 className="text-sm font-black text-slate-800 border-b border-slate-100 pb-2.5 uppercase tracking-wider flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-brand-red" />
              <span>{t("summaryTitle")}</span>
            </h3>

            {/* Dates & Location summary */}
            {activeSearch ? (
              <div className="space-y-3.5 text-xs font-semibold">
                <div className="space-y-1 text-slate-600">
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Lokalizacja / Locations:</p>
                  <p>Odbiór: <span className="text-slate-800 font-extrabold">{activeSearch.pickupLocation}</span></p>
                  <p>Zwrot: <span className="text-slate-800 font-extrabold">{activeSearch.returnLocation}</span></p>
                </div>
                <div className="space-y-1 text-slate-600">
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Okres najmu / Period:</p>
                  <p>Od: <span className="text-slate-800 font-extrabold">{activeSearch.pickupDate} o {activeSearch.pickupTime}</span></p>
                  <p>Do: <span className="text-slate-800 font-extrabold">{activeSearch.returnDate} o {activeSearch.returnTime}</span></p>
                  <p className="text-brand-red font-black pt-0.5">Dni wynajmu / Days: {getDays()}</p>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400 font-bold">Wybierz parametry wynajmu aby zobaczyć wycenę.</p>
            )}

            {/* Selected Car preview */}
            {selectedCar && (
              <div className="border-t border-slate-100 pt-3 text-xs space-y-1.5 font-semibold">
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Wybrany pojazd / Car:</p>
                <div className="flex justify-between items-center text-slate-800">
                  <span className="font-black">{selectedCar.brand} {selectedCar.model}</span>
                  <span className="font-extrabold">PLN {selectedCar.price * getDays()} ({getDays()} d.)</span>
                </div>
              </div>
            )}

            {/* Protection Package preview */}
            {selectedPackage && (
              <div className="border-t border-slate-100 pt-3 text-xs space-y-1.5 font-semibold">
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Pakiet ochrony / Protection:</p>
                <div className="flex justify-between items-center text-slate-800 font-bold">
                  <span>{selectedPackage.name.split(" / ")[0]}</span>
                  <span className="font-extrabold text-slate-900">+PLN {getPackageCost()}</span>
                </div>
              </div>
            )}

            {/* Addons List preview */}
            {selectedAddons.length > 0 && (
              <div className="border-t border-slate-100 pt-3 text-xs space-y-1.5 font-semibold">
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Wybrane dodatki / Add-ons:</p>
                <div className="space-y-1 text-slate-800 font-bold">
                  {selectedAddons.map((id) => {
                    const item = addons.find((a) => a.id === id);
                    const itemCost = item.isPerDay ? item.price * getDays() : item.price;
                    return (
                      <div key={id} className="flex justify-between">
                        <span>{item.name.split(" / ")[0]}</span>
                        <span className="font-extrabold text-slate-900">+PLN {itemCost}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Includes info */}
            <div className="border-t border-slate-100 pt-3 space-y-1.5 text-[10px] text-slate-500 font-bold leading-relaxed">
              <p className="text-[9px] text-slate-450 uppercase font-bold tracking-wider">{t("includedLabel")}:</p>
              <div className="flex items-center space-x-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-green-600 flex-shrink-0" />
                <span>{t("vatLabel")}</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-green-600 flex-shrink-0" />
                <span>{t("mileageLabel")}</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-green-600 flex-shrink-0" />
                <span>{t("cancellationLabel")}</span>
              </div>
            </div>

            {/* Total Price broken down */}
            <div className="border-t border-slate-200 pt-4 flex flex-col justify-between items-baseline gap-1">
              <span className="text-[10px] text-slate-450 font-bold uppercase tracking-wider">{t("totalPrice")}</span>
              <div className="text-right w-full">
                <p className="text-2xl font-black text-slate-850 tracking-tight">
                  {getTotalGross() === "Individual Price"
                    ? "Cena Indywidualna"
                    : `PLN ${getTotalGross().toFixed(2)}`}
                </p>
                {getTotalGross() !== "Individual Price" && (
                  <p className="text-[9px] text-slate-400 font-semibold mt-0.5">Zawiera 23% VAT | PLN {(getTotalGross() * 0.187).toFixed(2)} VAT</p>
                )}
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}

export default function CheckoutFlow() {
  return (
    <React.Suspense fallback={<div className="text-center py-12 text-slate-500 font-bold">Ładowanie / Loading...</div>}>
      <CheckoutFlowContent />
    </React.Suspense>
  );
}
