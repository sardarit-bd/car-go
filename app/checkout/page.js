"use client";

import { useApp } from "@/app/context/AppContext";
import { Calendar, Check, CheckCircle2, ChevronRight, CreditCard, Info, ShieldCheck, User, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import api from "@/lib/axios"; 

function CheckoutFlowContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    lang,
    vehicles,
    locations,
    packages,
    addons,
    searchParams: activeSearch,
    setSearchParams,
    addBooking,
    t
  } = useApp();

  const initialStep = parseInt(searchParams.get("step")) || 1;
  const preSelectedCarId = searchParams.get("car") || "";
  // console.log(packages);
  const [step, setStep] = useState(initialStep);
  const [selectedCar, setSelectedCar] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [selectedAddons, setSelectedAddons] = useState([]);


  const [availableVehicles, setAvailableVehicles] = useState([]);
  const [loadingVehicles, setLoadingVehicles] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [isInvoice, setIsInvoice] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");
  const [nip, setNip] = useState("");

  const [paymentMethod, setPaymentMethod] = useState("online");
  const [consentPrivacy, setConsentPrivacy] = useState(false);
  const [consentTerms, setConsentTerms] = useState(false);
  const [consentData, setConsentData] = useState(false);
  const [consentMarketing, setConsentMarketing] = useState(false);

  const [createdBooking, setCreatedBooking] = useState(null);
  const [paymentCompleted, setPaymentCompleted] = useState(false);

  useEffect(() => {
    const urlStep = parseInt(searchParams.get("step")) || 1;
    setStep(urlStep);
  }, [searchParams]);

  useEffect(() => {
    if (preSelectedCarId && vehicles.length > 0) {
      const match = vehicles.find((v) => v.id === preSelectedCarId);
      if (match) setSelectedCar(match);
    }
  }, [preSelectedCarId, vehicles]);

  useEffect(() => {
    if (packages.length > 0 && !selectedPackage) {
      setSelectedPackage(packages[0]);
    }
  }, [packages, selectedPackage]);


  useEffect(() => {
    const fetchAvailableVehicles = async () => {
      if (!activeSearch || !activeSearch.pickupDate || !activeSearch.returnDate) {
        setAvailableVehicles(vehicles); 
        return;
      }
      
      setLoadingVehicles(true);
      try {
        const params = {
          pickupDate: activeSearch.pickupDate,
          returnDate: activeSearch.returnDate,
          location: activeSearch.pickupLocation,
        };
        const response = await api.get("/api/vehicle", { params });
        

        const fetchedVehicles = response.data.data.vehicles.map(v => ({
          id: v.id,
          brand: v.brand,
          model: v.model,
          class: v.class || "Standard",
          fuel: "Petrol", 
          seats: v.seats,
          luggage: 0, 
          transmission: "Manual", 
          price: parseFloat(v.pricePerDay) || 0,
          deposit: 0, 
          image: v.images && v.images.length > 0 
            ? `${process.env.NEXT_PUBLIC_API_URL}${v.images[0].imageUrl}` 
            : "/fallback-car.png", 
          description: v.description,
          descriptionEn: v.description,
          specs: { engine: "N/A", consumption: "N/A", aircon: "Yes", year: "N/A" }
        }));
        
        setAvailableVehicles(fetchedVehicles);
      } catch (error) {
        console.error("Failed to fetch available vehicles:", error);
        setAvailableVehicles(vehicles); // Fallback
      } finally {
        setLoadingVehicles(false);
      }
    };

    fetchAvailableVehicles();
  }, [activeSearch, vehicles]);

  const getDays = () => activeSearch ? activeSearch.days : 1;
  const getCarCost = () => selectedCar ? selectedCar.price * getDays() : 0;
  const getPackageCost = () => selectedPackage ? selectedPackage.pricePerDay * getDays() : 0;

  const getAddonsCost = () => {
    let cost = 0;
    selectedAddons.forEach((addonId) => {
      const item = addons.find((a) => a.id === addonId);
      if (item) cost += item.isPerDay ? item.price * getDays() : item.price;
    });
    return cost;
  };

  const getTotalGross = () => {
    if (activeSearch?.isCustomPrice) return "Individual Price";
    return getCarCost() + getPackageCost() + getAddonsCost();
  };

  const handleSelectCar = (car) => {
    setSelectedCar(car);
    if (!activeSearch) {
      setSearchParams({
        pickupLocation: "Skarbimierz-Osiedle", returnLocation: "Skarbimierz-Osiedle",
        pickupDate: new Date(Date.now() + 86400000).toISOString().split("T")[0],
        returnDate: new Date(Date.now() + 86400000 * 4).toISOString().split("T")[0],
        pickupTime: "08:00", returnTime: "08:00", days: 3, isCustomPrice: false
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


  const handleSaveDetails = async (e) => {
    e.preventDefault();

    if (!consentPrivacy || !consentTerms || !consentData) {
      alert(lang === "pl" ? "Proszę zaakceptować wymagane zgody!" : "Please accept the required consents!");
      return;
    }


    const pickupLoc = locations.find(l => l.name === activeSearch?.pickupLocation);
    const returnLoc = locations.find(l => l.name === activeSearch?.returnLocation);
    console.log(locations)
    const payload = {
      vehicleId: selectedCar.id,
      phoneNumber: phone,
      pickupDate: new Date(`${activeSearch.pickupDate}T${activeSearch.pickupTime}:00`).toISOString(),
      returnDate: new Date(`${activeSearch.returnDate}T${activeSearch.returnTime}:00`).toISOString(),
      pickupLocationId: pickupLoc?.id || null,
      returnLocationId: returnLoc?.id || null,
      totalPrice: getTotalGross() === "Individual Price" ? 0 : getTotalGross(),
      
   
      customerFirstName: firstName,
      customerLastName: lastName,
      customerEmail: email,
      customerNotes: notes,
      packageData: selectedPackage ? { id: selectedPackage.id, name: selectedPackage.name, price: selectedPackage.pricePerDay } : null,
      addonsData: selectedAddons.map(id => {
        const addon = addons.find(a => a.id === id);
        return { id: addon.id, name: addon.name, price: addon.price };
      })
    };

    setIsSubmitting(true);

    try {
      const response = await api.post("/api/reservations", payload);
      const createdReservation = response.data.data; 
      console.log(createdReservation);  
      // Map backend response to frontend booking structure for local state
      const newBooking = {
        id: createdReservation.id,
        car: selectedCar,
        dates: activeSearch,
        pricing: {
          days: getDays(), carCost: getCarCost(), packageCost: getPackageCost(),
          addonsCost: getAddonsCost(), total: getTotalGross()
        },
        package: selectedPackage,
        addons: selectedAddons.map((id) => addons.find((a) => a.id === id).name),
        customer: {
          firstName, lastName, phone, email, notes,
          invoice: isInvoice ? { companyName, companyAddress, nip } : null
        },
        status: createdReservation.status.toLowerCase(), 
        paymentMethod: paymentMethod === "online" ? "online" : "pickup",
        paymentStatus: paymentMethod === "online" ? "awaiting_payment" : "payment_upon_pickup",
        date: new Date().toISOString().split("T")[0]
      };


      addBooking(newBooking); 
      
      setCreatedBooking(newBooking);
      router.push(`/checkout?step=4&id=${newBooking.id}`);
      
    } catch (error) {
      console.error("Reservation creation failed:", error);
      console.log(createdReservation);
      // addBooking(newBooking); 
      const errMsg = error.response?.data?.message || "Failed to create reservation. Please try again.";
      // router.push(`/checkout?step=4&id=${newBooking.id}`);
      // alert(lang === "pl" ? `Błąd: ${errMsg}` : `Error: ${errMsg}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSimulatePayment = () => {
    if (createdBooking) {
      setPaymentCompleted(true);
      // TODO: In the future, call api.post(`/api/reservations/${createdBooking.id}/send-payment-link`)
    }
  };

  const renderCarSvg = () => (
    <svg className="w-24 h-12" viewBox="0 0 500 220" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M70 120 C 130 115, 230 115, 270 95 C 310 75, 360 70, 390 90 C 420 110, 440 120, 460 120 C 480 120, 490 135, 490 145 L 490 165 C 490 170, 480 175, 470 175 C 450 175, 430 175, 410 175 C 400 160, 375 160, 365 175 C 320 175, 180 175, 135 175 C 125 160, 100 160, 90 175 C 60 175, 30 170, 20 165 C 15 160, 10 145, 10 135 C 10 128, 30 122, 70 120 Z" fill="#64748b" stroke="#cbd5e1" strokeWidth="2.5" />
      <path d="M120 125 C 170 120, 260 120, 280 105 L 340 105 C 375 120, 390 125, 430 125" stroke="#FF0000" strokeWidth="3" />
      <circle cx="112" cy="175" r="26" fill="#1e293b" stroke="#cbd5e1" strokeWidth="4" />
      <circle cx="382" cy="175" r="26" fill="#1e293b" stroke="#cbd5e1" strokeWidth="4" />
    </svg>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 space-y-8 animate-fade-in text-slate-800">
      {/* Steps Indicator (Unchanged) */}
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8">

          {step === 1 && (
            <div className="space-y-6">
              {!activeSearch && (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-500 font-semibold shadow-sm">
                  ℹ️ Proszę wyszukać dogodne terminy przy użyciu formularza. Wyświetlamy ofertę domyślną.
                </div>
              )}
              
              {loadingVehicles ? (
                <div className="p-8 text-center bg-slate-50 border border-slate-200 rounded-xl flex flex-col items-center justify-center space-y-2">
                  <Loader2 className="w-6 h-6 animate-spin text-brand-red" />
                  <p className="font-extrabold text-slate-800">Sprawdzanie dostępności pojazdów...</p>
                </div>
              ) : (
                <>
                  <h2 className="text-xl font-black text-slate-800 border-b border-slate-100 pb-3 uppercase">
                    {t("checkoutStep1")} ({availableVehicles.length})
                  </h2>

                  <div className="grid grid-cols-1 gap-4">
                    {availableVehicles.length === 0 ? (
                      <div className="p-8 text-center bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                        <p className="font-extrabold text-slate-800 text-lg">Brak dostępnych pojazdów</p>
                        <p className="text-slate-500 text-sm font-semibold">Wszystkie nasze samochody są zarezerwowane w wybranym terminie.</p>
                      </div>
                    ) : (
                      availableVehicles.map((car) => {
                        const carTotal = activeSearch?.isCustomPrice ? "Individual Price" : car.price * getDays();
                        return (
                          <div key={car.id} className="p-4 bg-white rounded-xl border border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm hover:border-slate-350 transition">
                            <div className="flex flex-col sm:flex-row items-center gap-4">
                              <div className="bg-slate-50 rounded p-2 flex items-center justify-center w-28 h-16 border border-slate-100">
                                {car.image ? (
                                  <img src={car.image} alt={`${car.brand} ${car.model}`} className="h-12 w-auto object-contain transition" />
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
              )}
            </div>
          )}


          {step === 2 && selectedCar && (
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-xl font-black text-slate-800 border-b border-slate-100 pb-3 uppercase">{t("packageTitle")}</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {packages.map((pkg) => {
                    const isSelected = selectedPackage?.id === pkg.id;
                    return (
                      <div key={pkg.id} onClick={() => setSelectedPackage(pkg)} className={`p-5 rounded-xl border cursor-pointer transition flex flex-col justify-between shadow-sm ${isSelected ? "bg-brand-red/5 border-brand-red text-slate-800 glow-red" : "bg-white border-slate-200 text-slate-700 hover:border-slate-400"}`}>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <h3 className="text-sm font-extrabold uppercase text-slate-800">{pkg.name}</h3>
                            {isSelected && <CheckCircle2 className="w-5 h-5 text-brand-red" />}
                          </div>
                          <p className="text-base font-black text-slate-900 mt-1">+PLN {pkg.pricePerDay}<span className="text-xs text-slate-400 font-normal">/doba</span></p>
                          <ul className="space-y-1.5 text-[10px] text-slate-500 leading-relaxed font-semibold mt-3 border-t border-slate-100 pt-3">
                            {(pkg.featuresPl || []).map((f, i) => (
                              <li key={i} className="flex items-start space-x-1.5"><span className="text-brand-red mt-0.5">•</span><span>{f}</span></li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-xl font-black text-slate-800 border-b border-slate-100 pb-3 uppercase">{t("addonsTitle")}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {addons.map((add) => {
                    const isChecked = selectedAddons.includes(add.id);
                    return (
                      <div key={add.id} onClick={() => handleToggleAddon(add.id)} className={`p-4 rounded-xl border cursor-pointer transition flex items-center justify-between shadow-sm ${isChecked ? "bg-brand-red/5 border-brand-red" : "bg-white border-slate-200 hover:border-slate-400"}`}>
                        <div className="space-y-0.5 text-left">
                          <p className="text-xs font-black text-slate-800">{add.name}</p>
                          <p className="text-[10px] text-slate-500 font-medium">{add.descriptionPl || add.description}</p>
                          <p className="text-xs text-brand-red font-extrabold pt-1">PLN {add.price}<span className="text-[10px] text-slate-450 font-normal">{add.isPerDay ? "/doba" : " (jednorazowo)"}</span></p>
                        </div>
                        <div className={`w-5 h-5 rounded border flex items-center justify-center transition ${isChecked ? "bg-brand-red border-brand-red text-white" : "border-slate-300 bg-slate-50"}`}>
                          {isChecked && <Check className="w-3.5 h-3.5" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button onClick={() => router.push("/checkout?step=3")} className="px-8 py-3 bg-brand-red hover:bg-brand-red-hover text-white text-xs font-black rounded-xl shadow transition duration-200">DALEJ / CONTINUE</button>
              </div>
            </div>
          )}

          {step === 3 && selectedCar && (
            <form onSubmit={handleSaveDetails} className="space-y-8">
              <h2 className="text-xl font-black text-slate-800 border-b border-slate-100 pb-3 uppercase">{t("checkoutStep3")}</h2>

              <div className="p-6 bg-white rounded-xl border border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-4 shadow-sm">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5">{t("firstName")} *</label>
                  <input type="text" required value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-sm font-semibold focus:outline-none focus:border-brand-red" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5">{t("lastName")} *</label>
                  <input type="text" required value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-sm font-semibold focus:outline-none focus:border-brand-red" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5">{t("phone")} *</label>
                  <input type="tel" required placeholder="+48 123 456 789" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-sm font-semibold focus:outline-none focus:border-brand-red" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5">{t("email")} *</label>
                  <input type="email" required placeholder="email@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-sm font-semibold focus:outline-none focus:border-brand-red" />
                </div>
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-xs font-bold text-slate-500 mb-1.5">{t("notes")}</label>
                  <textarea rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-sm font-semibold focus:outline-none focus:border-brand-red resize-none" />
                </div>
              </div>

              <div className="p-6 bg-white rounded-xl border border-slate-100 space-y-4 shadow-sm">
                <label className="flex items-center space-x-2.5 cursor-pointer">
                  <input type="checkbox" checked={isInvoice} onChange={(e) => setIsInvoice(e.target.checked)} className="w-4.5 h-4.5 accent-brand-red rounded border-slate-300 cursor-pointer" />
                  <span className="text-xs font-bold text-slate-850">{t("invoiceCheck")}</span>
                </label>
                {isInvoice && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 animate-fade-in">
                    <div><label className="block text-xs font-bold text-slate-550 mb-1.5">{t("companyName")} *</label><input type="text" required={isInvoice} value={companyName} onChange={(e) => setCompanyName(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-xs font-semibold focus:outline-none" /></div>
                    <div><label className="block text-xs font-bold text-slate-550 mb-1.5">{t("companyAddress")} *</label><input type="text" required={isInvoice} value={companyAddress} onChange={(e) => setCompanyAddress(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-xs font-semibold focus:outline-none" /></div>
                    <div><label className="block text-xs font-bold text-slate-550 mb-1.5">{t("nip")} *</label><input type="text" required={isInvoice} placeholder="10-cyfrowy NIP" value={nip} onChange={(e) => setNip(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-xs font-semibold focus:outline-none" /></div>
                  </div>
                )}
              </div>

              <div className="p-6 bg-white rounded-xl border border-slate-100 space-y-4 shadow-sm">
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">{t("paymentTitle")}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div onClick={() => setPaymentMethod("online")} className={`p-4 rounded-xl border cursor-pointer transition shadow-sm ${paymentMethod === "online" ? "border-brand-red bg-brand-red/5" : "border-slate-200 bg-slate-50 hover:border-slate-400"}`}>
                    <div className="flex items-center space-x-2.5"><CreditCard className="w-5 h-5 text-brand-red" /><div><p className="text-xs font-bold text-slate-850">Płatność Online</p><p className="text-[10px] text-slate-400">BLIK, Przelewy24, Autopay</p></div></div>
                  </div>
                  <div onClick={() => setPaymentMethod("pickup")} className={`p-4 rounded-xl border cursor-pointer transition shadow-sm ${paymentMethod === "pickup" ? "border-brand-red bg-brand-red/5" : "border-slate-200 bg-slate-50 hover:border-slate-400"}`}>
                    <div className="flex items-center space-x-2.5"><User className="w-5 h-5 text-slate-450" /><div><p className="text-xs font-bold text-slate-850">Płatność przy odbiorze</p><p className="text-[10px] text-slate-400">Gotówka w punkcie wydań</p></div></div>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-white rounded-xl border border-slate-100 space-y-3.5 text-xs text-slate-600 font-semibold shadow-sm">
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider mb-2">{t("consentsTitle")}</h3>
                <label className="flex items-start space-x-3.5 cursor-pointer py-1"><input type="checkbox" required checked={consentPrivacy} onChange={(e) => setConsentPrivacy(e.target.checked)} className="w-4.5 h-4.5 accent-brand-red mt-0.5 cursor-pointer" /><span>Akceptuję <Link href="/privacy" className="text-brand-red hover:underline font-bold" target="_blank">Politykę Prywatności</Link> *</span></label>
                <label className="flex items-start space-x-3.5 cursor-pointer py-1"><input type="checkbox" required checked={consentTerms} onChange={(e) => setConsentTerms(e.target.checked)} className="w-4.5 h-4.5 accent-brand-red mt-0.5 cursor-pointer" /><span>Akceptuję <Link href="/terms" className="text-brand-red hover:underline font-bold" target="_blank">Regulamin Wypożyczalni</Link> *</span></label>
                <label className="flex items-start space-x-3.5 cursor-pointer py-1"><input type="checkbox" required checked={consentData} onChange={(e) => setConsentData(e.target.checked)} className="w-4.5 h-4.5 accent-brand-red mt-0.5 cursor-pointer" /><span>{t("consentData")} *</span></label>
                <label className="flex items-start space-x-3.5 cursor-pointer py-1 border-t border-slate-100 pt-3.5 mt-2"><input type="checkbox" checked={consentMarketing} onChange={(e) => setConsentMarketing(e.target.checked)} className="w-4.5 h-4.5 accent-brand-red mt-0.5 cursor-pointer" /><span>{t("consentMarketing")}</span></label>
              </div>

              <button
                type="submit"
                onclike={()=>{
                  console.log("submit");  
                }}
                disabled={isSubmitting}
                className="w-full py-4 bg-brand-red hover:bg-brand-red-hover text-white text-sm font-black rounded-xl shadow hover:shadow-md transition uppercase tracking-widest disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Przetwarzanie...
                  </>
                ) : (
                  `${t("reserveBtn")} (POTWIERDŹ REZERWACJĘ / SUBMIT BOOKING)`
                )}
              </button>
            </form>
          )}

          {step === 4 && createdBooking && (
            <div className="space-y-6 animate-fade-in text-center lg:text-left">
              <div className="bg-white border border-slate-100 p-6 rounded-2xl space-y-6 shadow-sm">
                <div className="flex flex-col items-center py-4 space-y-3">
                  <CheckCircle2 className="w-16 h-16 text-green-500" />
                  <h2 className="text-2xl font-black text-slate-800">{t("confirmTitle")}</h2>
                  <div className="text-sm bg-slate-100 border border-slate-200 px-4 py-1.5 rounded-full text-slate-800 font-semibold">
                    {t("confirmNum")}: <span className="font-mono text-brand-red font-bold text-base tracking-widest">{createdBooking.id}</span>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-150 text-xs text-slate-600 font-semibold leading-relaxed text-left">
                  {createdBooking.paymentMethod === "online" ? (
                    <div className="space-y-3">
                      <p className="font-bold text-slate-800 flex items-center space-x-1.5"><Info className="w-4 h-4 text-brand-red" /><span>{t("confirmOnlineText")}</span></p>
                      {paymentCompleted ? (
                        <div className="p-3 bg-green-100 border border-green-200 rounded-lg text-green-700 font-bold text-center">✅ Płatność zakończona pomyślnie!</div>
                      ) : (
                        <button onClick={handleSimulatePayment} className="w-full py-2.5 bg-green-600 hover:bg-green-700 text-white font-black text-xs rounded-lg shadow transition">{t("confirmPayBtn")}</button>
                      )}
                    </div>
                  ) : (
                    <p className="text-center font-bold text-yellow-600 py-2">⚠️ {t("confirmPickupText")}</p>
                  )}
                </div>

                <div className="space-y-3 text-left">
                  <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">Weryfikacja Danych:</h3>
                  <ul className="text-xs text-slate-600 font-semibold space-y-1">
                    <li>Imię i Nazwisko: <strong className="text-slate-800 font-extrabold">{createdBooking.customer.firstName} {createdBooking.customer.lastName}</strong></li>
                    <li>E-mail: <strong className="text-slate-800 font-extrabold">{createdBooking.customer.email}</strong></li>
                    <li>Telefon: <strong className="text-slate-800 font-extrabold">{createdBooking.customer.phone}</strong></li>
                  </ul>
                </div>

                <div className="flex justify-center pt-4">
                  <button onClick={() => router.push("/")} className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 font-bold text-xs rounded-lg transition">POWRÓT DO STRONY GŁÓWNEJ</button>
                </div>
              </div>
            </div>
          )}
        </div>


        <div className="lg:col-span-4 lg:sticky lg:top-24">
          <div className="bg-white border border-slate-100 rounded-2xl p-5 space-y-5 shadow-sm">
            <h3 className="text-sm font-black text-slate-800 border-b border-slate-100 pb-2.5 uppercase tracking-wider flex items-center space-x-2"><Calendar className="w-4 h-4 text-brand-red" /><span>{t("summaryTitle")}</span></h3>
            {activeSearch ? (
              <div className="space-y-3.5 text-xs font-semibold">
                <div className="space-y-1 text-slate-600">
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Lokalizacja:</p>
                  <p>Odbiór: <span className="text-slate-800 font-extrabold">{activeSearch.pickupLocation}</span></p>
                  <p>Zwrot: <span className="text-slate-800 font-extrabold">{activeSearch.returnLocation}</span></p>
                </div>
                <div className="space-y-1 text-slate-600">
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Okres najmu:</p>
                  <p>Od: <span className="text-slate-800 font-extrabold">{activeSearch.pickupDate}</span></p>
                  <p>Do: <span className="text-slate-800 font-extrabold">{activeSearch.returnDate}</span></p>
                  <p className="text-brand-red font-black pt-0.5">Dni: {getDays()}</p>
                </div>
              </div>
            ) : <p className="text-xs text-slate-400 font-bold">Wybierz parametry wynajmu.</p>}

            {selectedCar && (
              <div className="border-t border-slate-100 pt-3 text-xs space-y-1.5 font-semibold">
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Pojazd:</p>
                <div className="flex justify-between items-center text-slate-800">
                  <span className="font-black">{selectedCar.brand} {selectedCar.model}</span>
                  <span className="font-extrabold">PLN {selectedCar.price * getDays()}</span>
                </div>
              </div>
            )}

            {selectedPackage && (
              <div className="border-t border-slate-100 pt-3 text-xs space-y-1.5 font-semibold">
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Pakiet:</p>
                <div className="flex justify-between items-center text-slate-800 font-bold">
                  <span>{selectedPackage.name}</span>
                  <span className="font-extrabold text-slate-900">+PLN {getPackageCost()}</span>
                </div>
              </div>
            )}

            {selectedAddons.length > 0 && (
              <div className="border-t border-slate-100 pt-3 text-xs space-y-1.5 font-semibold">
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Dodatki:</p>
                <div className="space-y-1 text-slate-800 font-bold">
                  {selectedAddons.map((id) => {
                    const item = addons.find((a) => a.id === id);
                    const itemCost = item.isPerDay ? item.price * getDays() : item.price;
                    return (<div key={id} className="flex justify-between"><span>{item.name}</span><span className="font-extrabold text-slate-900">+PLN {itemCost}</span></div>);
                  })}
                </div>
              </div>
            )}

            <div className="border-t border-slate-200 pt-4 flex flex-col justify-between items-baseline gap-1">
              <span className="text-[10px] text-slate-450 font-bold uppercase tracking-wider">{t("totalPrice")}</span>
              <div className="text-right w-full">
                <p className="text-2xl font-black text-slate-850 tracking-tight">
                  {getTotalGross() === "Individual Price" ? "Cena Indywidualna" : `PLN ${getTotalGross().toFixed(2)}`}
                </p>
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
    <React.Suspense fallback={<div className="text-center py-12 text-slate-500 font-bold">Ładowanie...</div>}>
      <CheckoutFlowContent />
    </React.Suspense>
  );
}