"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/app/context/AppContext";
import {
  Shield, BookOpen, Car, MapPin, Tag, MessageSquare, Edit3, Mail,
  LogOut, Plus, Trash2, ShieldCheck, ShieldAlert, Check, X, AlertTriangle, Send
} from "lucide-react";

export default function AdminDashboard() {
  const router = useRouter();
  const {
    lang, adminUser, logoutAdmin, bookings, updateBookingStatus, vehicles, locations,
    packages, addons, reviews, updateReview, deleteReview, emails, cmsTexts, updateCmsText, t,
    fetchPackages, fetchAddons, addVehicle, deleteVehicle, addLocation, deleteLocation, 
    updatePackagePrice, updateAddonPrice
  } = useApp();

  const [activeTab, setActiveTab] = useState("bookings");
  const [selectedBookingDetails, setSelectedBookingDetails] = useState(null);
  const [customPriceInput, setCustomPriceInput] = useState("");

  // Fleet editor state variables
  const [newBrand, setNewBrand] = useState("");
  const [newModel, setNewModel] = useState("");
  const [newClass, setNewClass] = useState("A (Economy)");
  const [newFuel, setNewFuel] = useState("Petrol");
  const [newSeats, setNewSeats] = useState(5);
  const [newLuggage, setNewLuggage] = useState(2);
  const [newTransmission, setNewTransmission] = useState("Manual");
  const [newPrice, setNewPrice] = useState(100);
  const [newDeposit, setNewDeposit] = useState(1000);
  const [newDescPl, setNewDescPl] = useState("");
  const [newDescEn, setNewDescEn] = useState("");

  // Location editor state variables
  const [newLocName, setNewLocName] = useState("");
  const [newLocMinDays, setNewLocMinDays] = useState(1);

  // Content CMS edit states
  const [cmsHeaderPl, setCmsHeaderPl] = useState("");
  const [cmsHeaderEn, setCmsHeaderEn] = useState("");
  const [cmsSubheaderPl, setCmsSubheaderPl] = useState("");
  const [cmsSubheaderEn, setCmsSubheaderEn] = useState("");

  // Pricing Packages and Add-ons edit states
  const [goldPrice, setGoldPrice] = useState(30);
  const [platinumPrice, setPlatinumPrice] = useState(60);
  const [childSeatPrice, setChildSeatPrice] = useState(15);
  const [boosterPrice, setBoosterPrice] = useState(8);
  const [gpsPrice, setGpsPrice] = useState(10);
  const [driverPrice, setDriverPrice] = useState(50);

  useEffect(() => {
    if (!adminUser) {
      router.push("/account/login");
    } else {
      if (cmsTexts.homeHeader) {
        setCmsHeaderPl(cmsTexts.homeHeader.pl || "");
        setCmsHeaderEn(cmsTexts.homeHeader.en || "");
      }
      if (cmsTexts.homeSubheader) {
        setCmsSubheaderPl(cmsTexts.homeSubheader.pl || "");
        setCmsSubheaderEn(cmsTexts.homeSubheader.en || "");
      }
      const gold = packages.find((p) => p.id === "gold");
      const plat = packages.find((p) => p.id === "platinum");
      if (gold) setGoldPrice(gold.pricePerDay);
      if (plat) setPlatinumPrice(plat.pricePerDay);

      const cs = addons.find((a) => a.id === "child-seat");
      const bs = addons.find((a) => a.id === "booster");
      const gps = addons.find((a) => a.id === "gps");
      const drv = addons.find((a) => a.id === "extra-driver");
      if (cs) setChildSeatPrice(cs.price);
      if (bs) setBoosterPrice(bs.price);
      if (gps) setGpsPrice(gps.price);
      if (drv) setDriverPrice(drv.price);
    }
  }, [adminUser, router, cmsTexts, packages, addons]);

  if (!adminUser) {
    return (
      <div className="text-center py-20 text-slate-500 font-bold">
        Przekierowanie do logowania / Redirecting to login...
      </div>
    );
  }

  const isOwner = adminUser.role === "owner";

  // --- HANDLERS ---
  const handleBookingConfirm = (id) => updateBookingStatus(id, "confirmed");
  const handleBookingCancel = (id) => updateBookingStatus(id, "cancelled");

  const handleBookingCustomPrice = (id) => {
    if (customPriceInput) {
      updateBookingStatus(id, "confirmed", customPriceInput);
      setCustomPriceInput("");
      setSelectedBookingDetails(null);
      alert("Wycena została zapisana, a e-mail wysłany do klienta!");
    }
  };

  const handleAddVehicle = async (e) => {
    e.preventDefault();
    if (newBrand && newModel) {
      const vehicleData = {
        brand: newBrand, model: newModel, class: newClass, fuel: newFuel,
        seats: parseInt(newSeats), luggage: parseInt(newLuggage), transmission: newTransmission,
        price: parseFloat(newPrice), deposit: parseFloat(newDeposit),
        description: newDescPl || "Nowy samochód we flocie.",
      };
      
      const result = await addVehicle(vehicleData);
      if (result.success) {
        setNewBrand(""); setNewModel(""); setNewDescPl(""); setNewDescEn("");
        alert("Pojazd został dodany!");
      } else {
        alert("Błąd dodawania pojazdu: " + (result.message || "Spróbuj ponownie"));
      }
    }
  };

  const handleDeleteVehicle = async (carId) => {
    if (confirm("Czy na pewno chcesz usunąć ten pojazd?")) {
      const result = await deleteVehicle(carId);
      if (result.success) alert("Pojazd usunięty.");
      else alert("Błąd usuwania pojazdu.");
    }
  };

  const handleAddLocation = async (e) => {
    e.preventDefault();
    if (newLocName) {
      const result = await addLocation({ name: newLocName, minDays: parseInt(newLocMinDays) });
      if (result.success) {
        setNewLocName(""); setNewLocMinDays(1);
        alert("Lokalizacja dodana!");
      } else alert("Błąd dodawania lokalizacji.");
    }
  };

  const handleDeleteLocation = async (locId) => {
    if (confirm("Usunąć lokalizację?")) {
      const loc = locations.find(l => l.id === locId);
      const backendId = loc?.backendId || locId;
      const result = await deleteLocation(backendId);
      if (result.success) alert("Lokalizacja usunięta.");
      else alert("Błąd usuwania lokalizacji.");
    }
  };

  const handleReviewApprove = (id) => updateReview(id, true);
  const handleReviewReject = (id) => deleteReview(id);

  const handleSaveCmsTexts = (e) => {
    e.preventDefault();
    updateCmsText("homeHeader", cmsHeaderPl, cmsHeaderEn);
    updateCmsText("homeSubheader", cmsSubheaderPl, cmsSubheaderEn);
    alert("Treści CMS zaktualizowane pomyślnie!");
  };

  const handleSavePricing = async (e) => {
    e.preventDefault();
    const gold = packages.find((p) => p.id === "gold");
    const plat = packages.find((p) => p.id === "platinum");
    if (gold && gold.backendId) await updatePackagePrice(gold.backendId, goldPrice);
    if (plat && plat.backendId) await updatePackagePrice(plat.backendId, platinumPrice);

    const cs = addons.find((a) => a.id === "child-seat");
    const bs = addons.find((a) => a.id === "booster");
    const gps = addons.find((a) => a.id === "gps");
    const drv = addons.find((a) => a.id === "extra-driver");
    if (cs && cs.backendId) await updateAddonPrice(cs.backendId, childSeatPrice);
    if (bs && bs.backendId) await updateAddonPrice(bs.backendId, boosterPrice);
    if (gps && gps.backendId) await updateAddonPrice(gps.backendId, gpsPrice);
    if (drv && drv.backendId) await updateAddonPrice(drv.backendId, driverPrice);

    alert("Cennik pakietów i dodatków został zapisany!");
    fetchPackages();
    fetchAddons();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8 animate-fade-in">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 pb-6 gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-brand-red/10 border border-brand-red/30 rounded-xl text-brand-red">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-800 uppercase">Panel Zarządzania CMS</h1>
            <p className="text-xs text-slate-500">
              Autoryzowana rola: <strong className="text-brand-red uppercase">{adminUser.role === "owner" ? "Właściciel / Owner" : "Pracownik / Employee"}</strong>
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            logoutAdmin();
            router.push("/account/login");
          }}
          className="px-5 py-2 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 text-xs font-bold rounded-lg text-slate-600 transition flex items-center space-x-1.5"
        >
          <LogOut className="w-4 h-4" />
          <span>WYLOGUJ / LOGOUT</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Sidebar Nav */}
        <div className="lg:col-span-3 glass-panel rounded-xl p-3 flex flex-col space-y-1.5 text-xs font-bold text-slate-500">
          <button onClick={() => setActiveTab("bookings")} className={`w-full text-left px-4 py-2.5 rounded-lg transition flex items-center space-x-2.5 ${activeTab === "bookings" ? "bg-brand-red text-white" : "hover:bg-slate-50 hover:text-slate-800"}`}>
            <BookOpen className="w-4 h-4" /> <span>Rezerwacje / Bookings</span>
          </button>
          <button onClick={() => setActiveTab("fleet")} className={`w-full text-left px-4 py-2.5 rounded-lg transition flex items-center space-x-2.5 ${activeTab === "fleet" ? "bg-brand-red text-white" : "hover:bg-slate-50 hover:text-slate-800"}`}>
            <Car className="w-4 h-4" /> <span>Flota Pojazdów / Fleet</span>
          </button>
          <button onClick={() => setActiveTab("locations")} className={`w-full text-left px-4 py-2.5 rounded-lg transition flex items-center space-x-2.5 ${activeTab === "locations" ? "bg-brand-red text-white" : "hover:bg-slate-50 hover:text-slate-800"}`}>
            <MapPin className="w-4 h-4" /> <span>Punkty Odbioru / Locations</span>
          </button>
          <button onClick={() => setActiveTab("reviews")} className={`w-full text-left px-4 py-2.5 rounded-lg transition flex items-center space-x-2.5 ${activeTab === "reviews" ? "bg-brand-red text-white" : "hover:bg-slate-50 hover:text-slate-800"}`}>
            <MessageSquare className="w-4 h-4" /> <span>Moderacja Opinii / Reviews</span>
          </button>
          <button onClick={() => setActiveTab("content")} className={`w-full text-left px-4 py-2.5 rounded-lg transition flex items-center space-x-2.5 ${activeTab === "content" ? "bg-brand-red text-white" : "hover:bg-slate-50 hover:text-slate-800"}`}>
            <Edit3 className="w-4 h-4" /> <span>Edycja Treści / CMS Texts</span>
          </button>
          <button onClick={() => setActiveTab("pricing")} className={`w-full text-left px-4 py-2.5 rounded-lg transition flex items-center space-x-2.5 ${activeTab === "pricing" ? "bg-brand-red text-white" : "hover:bg-slate-50 hover:text-slate-800"}`}>
            <Tag className="w-4 h-4" /> <span>Cennik i Pakiety / Pricing</span>
          </button>
          <button onClick={() => setActiveTab("emails")} className={`w-full text-left px-4 py-2.5 rounded-lg transition flex items-center space-x-2.5 ${activeTab === "emails" ? "bg-brand-red text-white" : "hover:bg-slate-50 hover:text-slate-800"}`}>
            <Mail className="w-4 h-4" /> <span>Poczta i Logi / Email logs</span>
          </button>
        </div>

        {/* Content Panel Area */}
        <div className="lg:col-span-9 space-y-6">
          
          {/* TAB 1: Bookings */}
          {activeTab === "bookings" && (
            <div className="glass-panel p-6 rounded-2xl space-y-5">
              <h2 className="text-base font-extrabold text-slate-800 border-b border-slate-100 pb-3 uppercase tracking-wider">
                Lista Rezerwacji / Bookings Database ({bookings.length})
              </h2>
              <div className="overflow-x-auto text-xs">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px]">
                      <th className="pb-3">Nr Rezerwacji</th><th className="pb-3">Klient</th><th className="pb-3">Okres Najmu</th>
                      <th className="pb-3">Pojazd</th><th className="pb-3">Koszt</th><th className="pb-3">Status</th><th className="pb-3 text-right">Opcje</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-600 font-semibold">
                    {bookings.map((b) => (
                      <tr key={b.id} className="hover:bg-slate-50/50 transition">
                        <td className="py-3.5 font-mono text-slate-800 font-extrabold">{b.id}</td>
                        <td className="py-3.5">{b.customer.firstName} {b.customer.lastName}</td>
                        <td className="py-3.5">{b.dates.pickupDate} - {b.dates.returnDate}</td>
                        <td className="py-3.5">{b.car.brand} {b.car.model}</td>
                        <td className="py-3.5 text-brand-red">PLN {b.pricing.total}</td>
                        <td className="py-3.5">
                          <span className={`px-2 py-0.5 rounded text-[9px] uppercase text-white font-bold ${b.status === "confirmed" ? "bg-green-700" : b.status === "cancelled" ? "bg-red-700" : "bg-yellow-600"}`}>
                            {b.status}
                          </span>
                        </td>
                        <td className="py-3.5 text-right">
                          <button onClick={() => setSelectedBookingDetails(b)} className="px-2.5 py-1 bg-white text-slate-600 border border-slate-200 rounded hover:border-slate-300 transition text-[10px]">Zarządzaj</button>
                        </td>
                      </tr>
                    ))}
                    {bookings.length === 0 && <tr><td colSpan={7} className="text-center py-8 text-slate-400">Brak zgłoszonych rezerwacji.</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: Fleet */}
          {activeTab === "fleet" && (
            <div className="space-y-6">
              {!isOwner ? (
                <div className="p-6 border border-brand-red/30 bg-brand-red/5 text-brand-red rounded-xl flex items-center space-x-2 text-sm font-bold">
                  <ShieldAlert className="w-5 h-5 flex-shrink-0" /> <span>Brak uprawnień. Zarządzanie flotą dostępne jest wyłącznie dla Właściciela (Owner).</span>
                </div>
              ) : (
                <>
                  <div className="glass-panel p-6 rounded-2xl space-y-4">
                    <h2 className="text-base font-extrabold text-slate-800 border-b border-slate-100 pb-2.5 uppercase tracking-wider">Dodaj Nowy Pojazd / Add Vehicle</h2>
                    <form onSubmit={handleAddVehicle} className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-bold text-slate-500">
                      <div><label className="block mb-1">Marka / Brand *</label><input type="text" required value={newBrand} onChange={(e) => setNewBrand(e.target.value)} className="w-full px-3 py-2 bg-white border border-slate-200 rounded text-slate-800 focus:outline-none focus:border-brand-red" /></div>
                      <div><label className="block mb-1">Model *</label><input type="text" required value={newModel} onChange={(e) => setNewModel(e.target.value)} className="w-full px-3 py-2 bg-white border border-slate-200 rounded text-slate-800 focus:outline-none focus:border-brand-red" /></div>
                      <div><label className="block mb-1">Klasa pojazdu / Class</label><select value={newClass} onChange={(e) => setNewClass(e.target.value)} className="w-full bg-white border border-slate-200 text-slate-800 px-3 py-2 rounded focus:outline-none"><option value="A (Economy)">Klasa A (Economy)</option><option value="B (Compact)">Klasa B (Compact)</option><option value="C (Medium)">Klasa C (Medium)</option><option value="D (SUV)">Klasa D (SUV)</option><option value="E (Premium)">Klasa E (Premium)</option></select></div>
                      <div><label className="block mb-1">Stawka dobowa (PLN) *</label><input type="number" required value={newPrice} onChange={(e) => setNewPrice(e.target.value)} className="w-full px-3 py-2 bg-white border border-slate-200 rounded text-slate-800 focus:outline-none focus:border-brand-red" /></div>
                      <div><label className="block mb-1">Miejsca / Seats</label><input type="number" value={newSeats} onChange={(e) => setNewSeats(e.target.value)} className="w-full px-3 py-2 bg-white border border-slate-200 rounded text-slate-800 focus:outline-none focus:border-brand-red" /></div>
                      <div className="md:col-span-3 pt-2"><button type="submit" className="w-full py-2.5 bg-brand-red hover:bg-brand-red-hover text-white font-bold rounded transition">DODAJ AUTO / SAVE VEHICLE</button></div>
                    </form>
                  </div>
                  <div className="glass-panel p-6 rounded-2xl space-y-4">
                    <h2 className="text-base font-extrabold text-slate-800 border-b border-slate-100 pb-2.5 uppercase tracking-wider">Aktualna Flota Pojazdów / Active Fleet ({vehicles.length})</h2>
                    <div className="space-y-3">
                      {vehicles.map((v) => (
                        <div key={v.id} className="p-3 bg-slate-50 border border-slate-200/60 rounded-xl flex items-center justify-between gap-4 text-xs font-semibold">
                          <div>
                            <p className="text-sm font-extrabold text-slate-800">{v.brand} {v.model}</p>
                            <p className="text-slate-500 mt-1 font-bold">Cena: <strong className="text-brand-red">PLN {v.price}/doba</strong></p>
                          </div>
                          <button onClick={() => handleDeleteVehicle(v.id)} className="p-2 border border-brand-red/30 hover:border-brand-red text-brand-red bg-brand-red/5 rounded transition" title="Usuń pojazd"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* TAB 3: Locations */}
          {activeTab === "locations" && (
            <div className="space-y-6">
              {!isOwner ? (
                <div className="p-6 border border-brand-red/30 bg-brand-red/5 text-brand-red rounded-xl flex items-center space-x-2 text-sm font-bold"><ShieldAlert className="w-5 h-5 flex-shrink-0" /><span>Brak uprawnień. Sekcja dostępna wyłącznie dla Właściciela (Owner).</span></div>
              ) : (
                <>
                  <div className="glass-panel p-6 rounded-2xl space-y-4">
                    <h2 className="text-base font-extrabold text-slate-800 border-b border-slate-100 pb-2.5 uppercase tracking-wider">Dodaj Nowy Punkt Odbioru / Add Location</h2>
                    <form onSubmit={handleAddLocation} className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-bold text-slate-500 items-end">
                      <div><label className="block mb-1.5">Nazwa lokalizacji / City Name *</label><input type="text" required placeholder="np. Wrocław Dworzec" value={newLocName} onChange={(e) => setNewLocName(e.target.value)} className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded text-slate-800 focus:outline-none focus:border-brand-red" /></div>
                      <div><button type="submit" className="w-full py-2.5 bg-brand-red hover:bg-brand-red-hover text-white font-bold rounded transition">DODAJ PUNKT</button></div>
                    </form>
                  </div>
                  <div className="glass-panel p-6 rounded-2xl space-y-4">
                    <h2 className="text-base font-extrabold text-slate-800 border-b border-slate-100 pb-2.5 uppercase tracking-wider">Zdefiniowane Lokalizacje ({locations.length})</h2>
                    <div className="space-y-2">
                      {locations.map((loc) => (
                        <div key={loc.id} className="p-3 bg-slate-50 border border-slate-200/60 rounded-xl flex items-center justify-between gap-4 text-xs font-semibold">
                          <div><p className="text-sm font-extrabold text-slate-800">{loc.name}</p></div>
                          {!loc.isCustomAddress && loc.id !== "skarbimierz" ? (
                            <button onClick={() => handleDeleteLocation(loc.id)} className="p-1.5 border border-brand-red/30 hover:border-brand-red text-brand-red bg-brand-red/5 rounded transition"><Trash2 className="w-3.5 h-3.5" /></button>
                          ) : (
                            <span className="text-[10px] text-slate-400 italic">Baza Systemowa</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* TAB 4: Reviews */}
          {activeTab === "reviews" && (
            <div className="space-y-6">
              {!isOwner ? (
                <div className="p-6 border border-brand-red/30 bg-brand-red/5 text-brand-red rounded-xl flex items-center space-x-2 text-sm font-bold"><ShieldAlert className="w-5 h-5 flex-shrink-0" /><span>Brak uprawnień. Sekcja dostępna wyłącznie dla Właściciela (Owner).</span></div>
              ) : (
                <div className="glass-panel p-6 rounded-2xl space-y-5">
                  <h2 className="text-base font-extrabold text-slate-800 border-b border-slate-100 pb-3 uppercase tracking-wider">Moderacja Opinii Klientów / Reviews Moderation Queue</h2>
                  <div className="space-y-4">
                    {reviews.map((rev) => (
                      <div key={rev.id} className="p-4 bg-slate-50 border border-slate-200/60 rounded-xl space-y-3 text-xs font-semibold">
                        <div className="flex justify-between items-baseline">
                          <div>
                            <span className="font-extrabold text-slate-800">{rev.name}</span>
                            <span className="text-slate-400 font-normal ml-1.5">auto: {rev.car} | {rev.date}</span>
                          </div>
                          <div className="flex items-center space-x-1 text-yellow-500">
                            {Array.from({ length: rev.rating }).map((_, i) => <span key={i}>★</span>)}
                          </div>
                        </div>
                        <p className="text-slate-600 italic">"{rev.text}"</p>
                        <div className="flex justify-between items-center pt-2 border-t border-slate-100 text-[10px]">
                          <div className="flex items-center space-x-1">
                            <span>Status:</span>
                            {rev.approved ? (
                              <span className="text-green-600 font-bold">Zatwierdzona i widoczna publicznie</span>
                            ) : (
                              <span className="text-yellow-600 font-bold flex items-center space-x-0.5"><AlertTriangle className="w-3.5 h-3.5" /><span>Oczekuje na akceptację</span></span>
                            )}
                          </div>
                          <div className="flex space-x-2">
                            {!rev.approved && (
                              <button onClick={() => handleReviewApprove(rev.id)} className="px-3 py-1 bg-green-700 hover:bg-green-600 text-white rounded font-extrabold transition flex items-center space-x-1"><Check className="w-3 h-3" /><span>Zatwierdź</span></button>
                            )}
                            <button onClick={() => handleReviewReject(rev.id)} className="px-3 py-1 bg-red-700 hover:bg-red-600 text-white rounded font-extrabold transition flex items-center space-x-1"><X className="w-3 h-3" /><span>Usuń</span></button>
                          </div>
                        </div>
                      </div>
                    ))}
                    {reviews.length === 0 && <p className="text-center text-slate-400 py-6">Brak opinii w kolejce.</p>}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: CMS */}
          {activeTab === "content" && (
            <div className="space-y-6">
              {!isOwner ? (
                <div className="p-6 border border-brand-red/30 bg-brand-red/5 text-brand-red rounded-xl flex items-center space-x-2 text-sm font-bold"><ShieldAlert className="w-5 h-5 flex-shrink-0" /><span>Brak uprawnień. Sekcja dostępna wyłącznie dla Właściciela (Owner).</span></div>
              ) : (
                <div className="glass-panel p-6 rounded-2xl space-y-5">
                  <h2 className="text-base font-extrabold text-slate-800 border-b border-slate-100 pb-3 uppercase tracking-wider">Edycja Pól Tekstowych Strony / Website Content Editor</h2>
                  <form onSubmit={handleSaveCmsTexts} className="space-y-5 text-xs font-bold text-slate-500">
                    <div className="space-y-2 border-b border-slate-100 pb-4">
                      <p className="text-sm font-extrabold text-slate-800">1. Nagłówek Główny (Hero Headline)</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div><label className="block mb-1">Po polsku (PL)</label><input type="text" value={cmsHeaderPl} onChange={(e) => setCmsHeaderPl(e.target.value)} className="w-full px-3 py-2 bg-white border border-slate-200 rounded text-slate-800 focus:outline-none focus:border-brand-red" /></div>
                        <div><label className="block mb-1">Po angielsku (EN)</label><input type="text" value={cmsHeaderEn} onChange={(e) => setCmsHeaderEn(e.target.value)} className="w-full px-3 py-2 bg-white border border-slate-200 rounded text-slate-800 focus:outline-none focus:border-brand-red" /></div>
                      </div>
                    </div>
                    <button type="submit" className="w-full py-2.5 bg-brand-red hover:bg-brand-red-hover text-white font-extrabold rounded transition shadow">ZAPISZ TEKSTY / PUBLISH CMS CHANGES</button>
                  </form>
                </div>
              )}
            </div>
          )}

          {/* TAB 6: Pricing */}
          {activeTab === "pricing" && (
            <div className="space-y-6">
              {!isOwner ? (
                <div className="p-6 border border-brand-red/30 bg-brand-red/5 text-brand-red rounded-xl flex items-center space-x-2 text-sm font-bold"><ShieldAlert className="w-5 h-5 flex-shrink-0" /><span>Brak uprawnień. Sekcja dostępna wyłącznie dla Właściciela (Owner).</span></div>
              ) : (
                <div className="glass-panel p-6 rounded-2xl space-y-5">
                  <h2 className="text-base font-extrabold text-slate-800 border-b border-slate-100 pb-3 uppercase tracking-wider">Konfiguracja Cennika / Rates Manager</h2>
                  <form onSubmit={handleSavePricing} className="space-y-6 text-xs font-bold text-slate-500">
                    <div className="space-y-3.5 border-b border-slate-100 pb-5">
                      <p className="text-sm font-extrabold text-slate-800">1. Pakiety Ochrony</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div><label className="block mb-1.5">Złoty / Gold Protect</label><input type="number" required min={0} value={goldPrice} onChange={(e) => setGoldPrice(e.target.value)} className="w-full px-3 py-2 bg-white border border-slate-200 rounded text-slate-800 focus:outline-none focus:border-brand-red" /></div>
                        <div><label className="block mb-1.5">Platynowy / Platinum Protect</label><input type="number" required min={0} value={platinumPrice} onChange={(e) => setPlatinumPrice(e.target.value)} className="w-full px-3 py-2 bg-white border border-slate-200 rounded text-slate-800 focus:outline-none focus:border-brand-red" /></div>
                      </div>
                    </div>
                    <button type="submit" className="w-full py-2.5 bg-brand-red hover:bg-brand-red-hover text-white font-extrabold rounded transition shadow">ZAPISZ CENNIK / SAVE RATES</button>
                  </form>
                </div>
              )}
            </div>
          )}

          {/* TAB 7: Emails */}
          {activeTab === "emails" && (
            <div className="glass-panel p-6 rounded-2xl space-y-5">
              <h2 className="text-base font-extrabold text-slate-800 border-b border-slate-100 pb-3 uppercase tracking-wider flex items-center space-x-2">
                <Mail className="w-5 h-5 text-brand-red animate-pulse" />
                <span>Skrzynka reservations@car-go.pl ({emails.length})</span>
              </h2>
              <div className="space-y-4">
                {emails.map((email) => (
                  <div key={email.id} className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-2 text-xs font-semibold">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-slate-400 border-b border-slate-100 pb-1.5 text-[10px]">
                      <span>DO / TO: <strong className="text-slate-800">{email.to}</strong></span>
                      <span>WYŚLANO: {email.date}</span>
                    </div>
                    <p className="text-slate-800 font-extrabold text-xs">TEMAT: {email.subject}</p>
                    <pre className="text-[10px] text-slate-600 whitespace-pre-wrap font-mono bg-white p-3 rounded leading-normal border border-slate-150 shadow-sm">{email.body}</pre>
                  </div>
                ))}
                {emails.length === 0 && <p className="text-center text-slate-400 py-6">Brak zarejestrowanych wysyłek e-mail.</p>}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Booking Management Detail Modal */}
      {selectedBookingDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/65 backdrop-blur-sm p-4">
          <div className="w-full max-w-xl bg-white border border-slate-100 rounded-2xl p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto animate-scale-up">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-slate-800 uppercase tracking-wider">Zarządzaj rezerwacją {selectedBookingDetails.id}</h3>
              <button onClick={() => setSelectedBookingDetails(null)} className="px-2.5 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-100 rounded text-[10px] text-slate-500 hover:text-slate-800">Zamknij</button>
            </div>
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-slate-50 rounded border border-slate-100">
                  <p className="text-slate-400">Klient:</p>
                  <p className="font-bold text-slate-800 mt-0.5">{selectedBookingDetails.customer.firstName} {selectedBookingDetails.customer.lastName}</p>
                  <p className="text-slate-500">{selectedBookingDetails.customer.email}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded border border-slate-100">
                  <p className="text-slate-400">Pojazd:</p>
                  <p className="font-bold text-slate-800 mt-0.5">{selectedBookingDetails.car.brand} {selectedBookingDetails.car.model}</p>
                </div>
              </div>
              <div className="p-3 bg-slate-50 rounded border border-slate-100 space-y-1">
                <p className="text-slate-400">Terminy:</p>
                <p>Odbiór: <strong>{selectedBookingDetails.dates.pickupDate}</strong></p>
                <p>Zwrot: <strong>{selectedBookingDetails.dates.returnDate}</strong></p>
                <p className="text-brand-red font-bold">Czas najmu: {selectedBookingDetails.pricing.days} dni</p>
              </div>
              <div className="p-3 bg-slate-50 rounded border border-slate-100 flex justify-between items-center text-sm">
                <span className="text-slate-500 font-bold">Całkowity koszt:</span>
                <strong className="text-brand-red text-base font-black">PLN {selectedBookingDetails.pricing.total}</strong>
              </div>
              <div className="border-t border-slate-100 pt-4 flex flex-col sm:flex-row justify-between items-center gap-3">
                <div className="flex items-center space-x-1">
                  <span>Aktualny Status:</span>
                  <span className="font-extrabold text-slate-800 uppercase">{selectedBookingDetails.status}</span>
                </div>
                <div className="flex space-x-2 w-full sm:w-auto">
                  {selectedBookingDetails.status !== "confirmed" && (
                    <button onClick={() => { handleBookingConfirm(selectedBookingDetails.id); setSelectedBookingDetails(null); }} className="flex-1 px-4 py-2 bg-green-700 hover:bg-green-600 text-white font-bold rounded transition">ZATWIERDŹ</button>
                  )}
                  {selectedBookingDetails.status !== "cancelled" && (
                    <button onClick={() => { handleBookingCancel(selectedBookingDetails.id); setSelectedBookingDetails(null); }} className="flex-1 px-4 py-2 bg-red-700 hover:bg-red-600 text-white font-bold rounded transition">ANULUJ</button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}