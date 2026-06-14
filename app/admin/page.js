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
    lang,
    adminUser,
    logoutAdmin,
    bookings,
    updateBookingStatus,
    vehicles,
    setVehicles,
    locations,
    setLocations,
    packages,
    setPackages,
    addons,
    setAddons,
    reviews,
    updateReview,
    deleteReview,
    emails,
    cmsTexts,
    updateCmsText,
    t
  } = useApp();

  const [activeTab, setActiveTab] = useState("bookings");
  const [selectedBookingDetails, setSelectedBookingDetails] = useState(null);
  
  // Custom price input
  const [customPriceInput, setCustomPriceInput] = useState("");

  // Reviews editing state
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editingReviewText, setEditingReviewText] = useState("");

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

  // Redirect to login if not logged in
  useEffect(() => {
    if (!adminUser) {
      router.push("/admin/login");
    } else {
      // Pre-fill CMS inputs
      if (cmsTexts.homeHeader) {
        setCmsHeaderPl(cmsTexts.homeHeader.pl || "");
        setCmsHeaderEn(cmsTexts.homeHeader.en || "");
      }
      if (cmsTexts.homeSubheader) {
        setCmsSubheaderPl(cmsTexts.homeSubheader.pl || "");
        setCmsSubheaderEn(cmsTexts.homeSubheader.en || "");
      }
      // Pre-fill pricing packages & add-ons
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
    return null;
  }

  const isOwner = adminUser.role === "owner";

  // Bookings list
  const handleBookingConfirm = (id) => {
    updateBookingStatus(id, "confirmed");
  };

  const handleBookingCancel = (id) => {
    updateBookingStatus(id, "cancelled");
  };

  const handleBookingCustomPrice = (id) => {
    if (customPriceInput) {
      updateBookingStatus(id, "confirmed", customPriceInput);
      setCustomPriceInput("");
      setSelectedBookingDetails(null);
      alert("Wycena została zapisana, a e-mail wysłany do klienta!");
    }
  };

  // Fleet management operations
  const handleAddVehicle = (e) => {
    e.preventDefault();
    if (newBrand && newModel) {
      const carId = `${newBrand.toLowerCase()}-${newModel.toLowerCase()}-${Math.floor(100 + Math.random() * 900)}`;
      const updated = [
        ...vehicles,
        {
          id: carId,
          brand: newBrand,
          model: newModel,
          class: newClass,
          fuel: newFuel,
          seats: parseInt(newSeats),
          luggage: parseInt(newLuggage),
          transmission: newTransmission,
          price: parseFloat(newPrice),
          deposit: parseFloat(newDeposit),
          description: newDescPl || "Nowy samochód we flocie.",
          descriptionEn: newDescEn || "New car in the fleet.",
          specs: { engine: "1.2 TSI", consumption: "5.5 l/100km", aircon: "Yes", year: "2024" }
        }
      ];
      setVehicles(updated);
      
      // Reset forms
      setNewBrand("");
      setNewModel("");
      setNewDescPl("");
      setNewDescEn("");
      alert("Pojazd został dodany!");
    }
  };

  const handleDeleteVehicle = (carId) => {
    if (confirm("Czy na pewno chcesz usunąć ten pojazd?")) {
      const updated = vehicles.filter((v) => v.id !== carId);
      setVehicles(updated);
    }
  };

  // Locations management operations
  const handleAddLocation = (e) => {
    e.preventDefault();
    if (newLocName) {
      const locId = `loc_${Math.random().toString(36).substr(2, 9)}`;
      const updated = [
        ...locations,
        { id: locId, name: newLocName, minDays: parseInt(newLocMinDays) }
      ];
      setLocations(updated);
      setNewLocName("");
      setNewLocMinDays(1);
      alert("Lokalizacja dodana!");
    }
  };

  const handleDeleteLocation = (locId) => {
    if (confirm("Usunąć lokalizację?")) {
      setLocations(locations.filter((l) => l.id !== locId));
    }
  };

  // Reviews operations
  const handleReviewApprove = (id) => {
    updateReview(id, true);
  };

  const handleReviewReject = (id) => {
    deleteReview(id);
  };

  const handleReviewSaveEdit = (id) => {
    const rev = reviews.find((r) => r.id === id);
    if (rev) {
      updateReview(id, rev.approved, editingReviewText);
      setEditingReviewId(null);
      setEditingReviewText("");
      alert("Opinia została zaktualizowana!");
    }
  };

  // Save texts in CMS
  const handleSaveCmsTexts = (e) => {
    e.preventDefault();
    updateCmsText("homeHeader", cmsHeaderPl, cmsHeaderEn);
    updateCmsText("homeSubheader", cmsSubheaderPl, cmsSubheaderEn);
    alert("Treści CMS zaktualizowane pomyślnie!");
  };

  const handleSavePricing = (e) => {
    e.preventDefault();
    
    // Update packages
    const updatedPkgs = packages.map((pkg) => {
      if (pkg.id === "gold") return { ...pkg, pricePerDay: parseFloat(goldPrice) };
      if (pkg.id === "platinum") return { ...pkg, pricePerDay: parseFloat(platinumPrice) };
      return pkg;
    });
    setPackages(updatedPkgs);

    // Update addons
    const updatedAddons = addons.map((add) => {
      if (add.id === "child-seat") return { ...add, price: parseFloat(childSeatPrice) };
      if (add.id === "booster") return { ...add, price: parseFloat(boosterPrice) };
      if (add.id === "gps") return { ...add, price: parseFloat(gpsPrice) };
      if (add.id === "extra-driver") return { ...add, price: parseFloat(driverPrice) };
      return add;
    });
    setAddons(updatedAddons);

    alert("Cennik pakietów i dodatków został zapisany!");
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
            router.push("/admin/login");
          }}
          className="px-5 py-2 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 text-xs font-bold rounded-lg text-slate-600 transition flex items-center space-x-1.5"
        >
          <LogOut className="w-4 h-4" />
          <span>WYLOGUJ / LOGOUT</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Sidebar Nav */}
        <div className="glass-panel rounded-xl p-3 flex flex-col space-y-1.5 text-xs font-bold text-slate-500">
          <button
            onClick={() => setActiveTab("bookings")}
            className={`w-full text-left px-4 py-2.5 rounded-lg transition flex items-center space-x-2.5 ${
              activeTab === "bookings" ? "bg-brand-red text-white" : "hover:bg-slate-50 hover:text-slate-800"
            }`}
          >
            <BookOpen className="w-4.5 h-4.5" />
            <span>Rezerwacje / Bookings</span>
          </button>

          <button
            onClick={() => setActiveTab("fleet")}
            className={`w-full text-left px-4 py-2.5 rounded-lg transition flex items-center space-x-2.5 ${
              activeTab === "fleet" ? "bg-brand-red text-white" : "hover:bg-slate-50 hover:text-slate-800"
            }`}
          >
            <Car className="w-4.5 h-4.5" />
            <span>Flota Pojazdów / Fleet</span>
          </button>

          <button
            onClick={() => setActiveTab("locations")}
            className={`w-full text-left px-4 py-2.5 rounded-lg transition flex items-center space-x-2.5 ${
              activeTab === "locations" ? "bg-brand-red text-white" : "hover:bg-slate-50 hover:text-slate-800"
            }`}
          >
            <MapPin className="w-4.5 h-4.5" />
            <span>Punkty Odbioru / Locations</span>
          </button>

          <button
            onClick={() => setActiveTab("reviews")}
            className={`w-full text-left px-4 py-2.5 rounded-lg transition flex items-center space-x-2.5 ${
              activeTab === "reviews" ? "bg-brand-red text-white" : "hover:bg-slate-50 hover:text-slate-800"
            }`}
          >
            <MessageSquare className="w-4.5 h-4.5" />
            <span>Moderacja Opinii / Reviews</span>
          </button>

          <button
            onClick={() => setActiveTab("content")}
            className={`w-full text-left px-4 py-2.5 rounded-lg transition flex items-center space-x-2.5 ${
              activeTab === "content" ? "bg-brand-red text-white" : "hover:bg-slate-50 hover:text-slate-800"
            }`}
          >
            <Edit3 className="w-4.5 h-4.5" />
            <span>Edycja Treści / CMS Texts</span>
          </button>

          <button
            onClick={() => setActiveTab("pricing")}
            className={`w-full text-left px-4 py-2.5 rounded-lg transition flex items-center space-x-2.5 ${
              activeTab === "pricing" ? "bg-brand-red text-white" : "hover:bg-slate-50 hover:text-slate-800"
            }`}
          >
            <Tag className="w-4.5 h-4.5" />
            <span>Cennik i Pakiety / Pricing</span>
          </button>

          <button
            onClick={() => setActiveTab("emails")}
            className={`w-full text-left px-4 py-2.5 rounded-lg transition flex items-center space-x-2.5 ${
              activeTab === "emails" ? "bg-brand-red text-white" : "hover:bg-slate-50 hover:text-slate-800"
            }`}
          >
            <Mail className="w-4.5 h-4.5" />
            <span>Poczta i Logi / Email logs</span>
          </button>
        </div>

        {/* Content Panel Area */}
        <div className="lg:col-span-9 space-y-6">
          
          {/* TAB 1: Bookings management (Available to both Owner and Employee) */}
          {activeTab === "bookings" && (
            <div className="glass-panel p-6 rounded-2xl space-y-5">
              <h2 className="text-base font-extrabold text-slate-800 border-b border-slate-100 pb-3 uppercase tracking-wider">
                Lista Rezerwacji / Bookings Database ({bookings.length})
              </h2>

              <div className="overflow-x-auto text-xs">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px]">
                      <th className="pb-3">Nr Rezerwacji</th>
                      <th className="pb-3">Klient</th>
                      <th className="pb-3">Okres Najmu</th>
                      <th className="pb-3">Pojazd</th>
                      <th className="pb-3">Koszt</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3 text-right">Opcje</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-600 font-semibold">
                    {bookings.map((b) => (
                      <tr key={b.id} className="hover:bg-slate-50/50 transition">
                        <td className="py-3.5 font-mono text-slate-800 font-extrabold">{b.id}</td>
                        <td className="py-3.5">{b.customer.firstName} {b.customer.lastName}</td>
                        <td className="py-3.5">{b.dates.pickupDate} - {b.dates.returnDate}</td>
                        <td className="py-3.5">{b.car.brand} {b.car.model}</td>
                        <td className="py-3.5 text-brand-red">
                          {b.pricing.total === "Individual Price" ? "Wycena Indywidualna" : `PLN ${b.pricing.total}`}
                        </td>
                        <td className="py-3.5">
                          <span className={`px-2 py-0.5 rounded text-[9px] uppercase text-white font-bold ${
                            b.status === "confirmed" ? "bg-green-700" :
                            b.status === "cancelled" ? "bg-red-700" : "bg-yellow-600"
                          }`}>
                            {b.status}
                          </span>
                        </td>
                        <td className="py-3.5 text-right">
                          <button
                            onClick={() => setSelectedBookingDetails(b)}
                            className="px-2.5 py-1 bg-white text-slate-600 border border-slate-200 rounded hover:border-slate-300 transition text-[10px]"
                          >
                            Zarządzaj
                          </button>
                        </td>
                      </tr>
                    ))}
                    {bookings.length === 0 && (
                      <tr>
                        <td colSpan={7} className="text-center py-8 text-slate-400">Brak zgłoszonych rezerwacji.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: Fleet management (Owner Only) */}
          {activeTab === "fleet" && (
            <div className="space-y-6">
              {!isOwner ? (
                <div className="p-6 border border-brand-red/30 bg-brand-red/5 text-brand-red rounded-xl flex items-center space-x-2 text-sm font-bold">
                  <ShieldAlert className="w-5 h-5 flex-shrink-0" />
                  <span>Brak uprawnień. Zarządzanie flotą dostępne jest wyłącznie dla Właściciela (Owner).</span>
                </div>
              ) : (
                <>
                  {/* Add vehicle form */}
                  <div className="glass-panel p-6 rounded-2xl space-y-4">
                    <h2 className="text-base font-extrabold text-slate-800 border-b border-slate-100 pb-2.5 uppercase tracking-wider">
                      Dodaj Nowy Pojazd / Add Vehicle
                    </h2>
                    
                    <form onSubmit={handleAddVehicle} className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-bold text-slate-500">
                      <div>
                        <label className="block mb-1">Marka / Brand *</label>
                        <input
                          type="text"
                          required
                          value={newBrand}
                          onChange={(e) => setNewBrand(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded text-slate-800 focus:outline-none focus:border-brand-red"
                        />
                      </div>
                      
                      <div>
                        <label className="block mb-1">Model *</label>
                        <input
                          type="text"
                          required
                          value={newModel}
                          onChange={(e) => setNewModel(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded text-slate-800 focus:outline-none focus:border-brand-red"
                        />
                      </div>

                      <div>
                        <label className="block mb-1">Klasa pojazdu / Class</label>
                        <select
                          value={newClass}
                          onChange={(e) => setNewClass(e.target.value)}
                          className="w-full bg-white border border-slate-200 text-slate-800 px-3 py-2 rounded focus:outline-none"
                        >
                          <option value="A (Economy)">Klasa A (Economy)</option>
                          <option value="B (Compact)">Klasa B (Compact)</option>
                          <option value="C (Medium)">Klasa C (Medium)</option>
                          <option value="D (SUV)">Klasa D (SUV)</option>
                          <option value="E (Premium)">Klasa E (Premium)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block mb-1">Paliwo / Fuel</label>
                        <select
                          value={newFuel}
                          onChange={(e) => setNewFuel(e.target.value)}
                          className="w-full bg-white border border-slate-200 text-slate-800 px-3 py-2 rounded focus:outline-none"
                        >
                          <option value="Petrol">Petrol (Benzyna)</option>
                          <option value="Diesel">Diesel</option>
                        </select>
                      </div>

                      <div>
                        <label className="block mb-1">Skrzynia / Transmission</label>
                        <select
                          value={newTransmission}
                          onChange={(e) => setNewTransmission(e.target.value)}
                          className="w-full bg-white border border-slate-200 text-slate-800 px-3 py-2 rounded focus:outline-none"
                        >
                          <option value="Manual">Manualna</option>
                          <option value="Automatic">Automatyczna</option>
                        </select>
                      </div>

                      <div>
                        <label className="block mb-1">Stawka dobowa (PLN) *</label>
                        <input
                          type="number"
                          required
                          value={newPrice}
                          onChange={(e) => setNewPrice(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded text-slate-800 focus:outline-none focus:border-brand-red"
                        />
                      </div>

                      <div>
                        <label className="block mb-1">Kaucja zabezpieczająca (PLN) *</label>
                        <input
                          type="number"
                          required
                          value={newDeposit}
                          onChange={(e) => setNewDeposit(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded text-slate-800 focus:outline-none focus:border-brand-red"
                        />
                      </div>

                      <div>
                        <label className="block mb-1">Miejsca / Seats</label>
                        <input
                          type="number"
                          value={newSeats}
                          onChange={(e) => setNewSeats(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded text-slate-800 focus:outline-none focus:border-brand-red"
                        />
                      </div>

                      <div>
                        <label className="block mb-1">Bagaż / Luggage</label>
                        <input
                          type="number"
                          value={newLuggage}
                          onChange={(e) => setNewLuggage(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded text-slate-800 focus:outline-none focus:border-brand-red"
                        />
                      </div>

                      <div className="md:col-span-3">
                        <label className="block mb-1">Opis pojazdu (PL)</label>
                        <textarea
                          rows={2}
                          value={newDescPl}
                          onChange={(e) => setNewDescPl(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded text-slate-800 text-xs focus:outline-none focus:border-brand-red resize-none"
                        />
                      </div>

                      <div className="md:col-span-3">
                        <label className="block mb-1">Opis pojazdu (EN)</label>
                        <textarea
                          rows={2}
                          value={newDescEn}
                          onChange={(e) => setNewDescEn(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded text-slate-800 text-xs focus:outline-none focus:border-brand-red resize-none"
                        />
                      </div>

                      <div className="md:col-span-3 pt-2">
                        <button
                          type="submit"
                          className="w-full py-2.5 bg-brand-red hover:bg-brand-red-hover text-white font-bold rounded transition"
                        >
                          DODAJ AUTO / SAVE VEHICLE
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* Fleet List */}
                  <div className="glass-panel p-6 rounded-2xl space-y-4">
                    <h2 className="text-base font-extrabold text-slate-800 border-b border-slate-100 pb-2.5 uppercase tracking-wider">
                      Aktualna Flota Pojazdów / Active Fleet ({vehicles.length})
                    </h2>

                    <div className="space-y-3">
                      {vehicles.map((v) => (
                        <div key={v.id} className="p-3 bg-slate-50 border border-slate-200/60 rounded-xl flex items-center justify-between gap-4 text-xs font-semibold">
                          <div>
                            <p className="text-sm font-extrabold text-slate-800">{v.brand} {v.model}</p>
                            <p className="text-slate-400 font-normal">ID: {v.id} | Klasa: {v.class} | Paliwo: {v.fuel}</p>
                            <p className="text-slate-500 mt-1 font-bold">Cena: <strong className="text-brand-red">PLN {v.price}/doba</strong> | Kaucja: PLN {v.deposit}</p>
                          </div>
                          
                          <button
                            onClick={() => handleDeleteVehicle(v.id)}
                            className="p-2 border border-brand-red/30 hover:border-brand-red text-brand-red bg-brand-red/5 rounded transition"
                            title="Usuń pojazd"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* TAB 3: Locations Settings (Owner Only) */}
          {activeTab === "locations" && (
            <div className="space-y-6">
              {!isOwner ? (
                <div className="p-6 border border-brand-red/30 bg-brand-red/5 text-brand-red rounded-xl flex items-center space-x-2 text-sm font-bold">
                  <ShieldAlert className="w-5 h-5 flex-shrink-0" />
                  <span>Brak uprawnień. Sekcja dostępna wyłącznie dla Właściciela (Owner).</span>
                </div>
              ) : (
                <>
                  {/* Add Location Form */}
                  <div className="glass-panel p-6 rounded-2xl space-y-4">
                    <h2 className="text-base font-extrabold text-slate-800 border-b border-slate-100 pb-2.5 uppercase tracking-wider">
                      Dodaj Nowy Punkt Odbioru / Add Location
                    </h2>
                    
                    <form onSubmit={handleAddLocation} className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-bold text-slate-500 items-end">
                      <div>
                        <label className="block mb-1.5">Nazwa lokalizacji / City Name *</label>
                        <input
                          type="text"
                          required
                          placeholder="np. Wrocław Dworzec"
                          value={newLocName}
                          onChange={(e) => setNewLocName(e.target.value)}
                          className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded text-slate-800 focus:outline-none focus:border-brand-red"
                        />
                      </div>
                      
                      <div>
                        <label className="block mb-1.5">Min. okres najmu (dni) *</label>
                        <input
                          type="number"
                          required
                          min={1}
                          value={newLocMinDays}
                          onChange={(e) => setNewLocMinDays(e.target.value)}
                          className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded text-slate-800 focus:outline-none focus:border-brand-red"
                        />
                      </div>

                      <div>
                        <button
                          type="submit"
                          className="w-full py-2.5 bg-brand-red hover:bg-brand-red-hover text-white font-bold rounded transition"
                        >
                          DODAJ PUNKT
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* Locations List */}
                  <div className="glass-panel p-6 rounded-2xl space-y-4">
                    <h2 className="text-base font-extrabold text-slate-800 border-b border-slate-100 pb-2.5 uppercase tracking-wider">
                      Zdefiniowane Lokalizacje i Reguły Wynajmu ({locations.length})
                    </h2>

                    <div className="space-y-2">
                      {locations.map((loc) => (
                        <div key={loc.id} className="p-3 bg-slate-50 border border-slate-200/60 rounded-xl flex items-center justify-between gap-4 text-xs font-semibold">
                          <div>
                            <p className="text-sm font-extrabold text-slate-800">{loc.name}</p>
                            <p className="text-brand-red">Minimalny okres wynajmu: <strong className="text-slate-800">{loc.minDays} dni</strong></p>
                          </div>
                          
                          {/* Protect critical database elements */}
                          {!loc.isCustomAddress && loc.id !== "skarbimierz" ? (
                            <button
                              onClick={() => handleDeleteLocation(loc.id)}
                              className="p-1.5 border border-brand-red/30 hover:border-brand-red text-brand-red bg-brand-red/5 rounded transition"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
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

          {/* TAB 4: Reviews queue moderation (Owner Only) */}
          {activeTab === "reviews" && (
            <div className="space-y-6">
              {!isOwner ? (
                <div className="p-6 border border-brand-red/30 bg-brand-red/5 text-brand-red rounded-xl flex items-center space-x-2 text-sm font-bold">
                  <ShieldAlert className="w-5 h-5 flex-shrink-0" />
                  <span>Brak uprawnień. Sekcja dostępna wyłącznie dla Właściciela (Owner).</span>
                </div>
              ) : (
                <div className="glass-panel p-6 rounded-2xl space-y-5">
                  <h2 className="text-base font-extrabold text-slate-800 border-b border-slate-100 pb-3 uppercase tracking-wider">
                    Moderacja Opinii Klientów / Reviews Moderation Queue
                  </h2>

                  <div className="space-y-4">
                    {reviews.map((rev) => (
                      <div key={rev.id} className="p-4 bg-slate-50 border border-slate-200/60 rounded-xl space-y-3 text-xs font-semibold">
                        <div className="flex justify-between items-baseline">
                          <div>
                            <span className="font-extrabold text-slate-800">{rev.name}</span>
                            <span className="text-slate-400 font-normal ml-1.5">auto: {rev.car} | {rev.date}</span>
                          </div>
                          <div className="flex items-center space-x-1 text-yellow-500">
                            {Array.from({ length: rev.rating }).map((_, i) => (
                              <span key={i}>★</span>
                            ))}
                          </div>
                        </div>
                        {editingReviewId === rev.id ? (
                          <div className="space-y-2">
                            <textarea
                              value={editingReviewText}
                              onChange={(e) => setEditingReviewText(e.target.value)}
                              className="w-full px-3 py-2 bg-white border border-slate-200 rounded text-slate-800 text-xs font-semibold focus:outline-none"
                              rows={3}
                            />
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleReviewSaveEdit(rev.id)}
                                className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded font-extrabold transition text-[10px]"
                              >
                                Zapisz / Save
                              </button>
                              <button
                                onClick={() => {
                                  setEditingReviewId(null);
                                  setEditingReviewText("");
                                }}
                                className="px-3 py-1 bg-slate-300 hover:bg-slate-400 text-slate-700 rounded font-extrabold transition text-[10px]"
                              >
                                Anuluj / Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <p className="text-slate-600 italic">"{rev.text}"</p>
                            
                            <div className="flex justify-between items-center pt-2 border-t border-slate-100 text-[10px]">
                              <div className="flex items-center space-x-1">
                                <span>Status:</span>
                                {rev.approved ? (
                                  <span className="text-green-600 font-bold">Zatwierdzona i widoczna publicznie</span>
                                ) : (
                                  <span className="text-yellow-600 font-bold flex items-center space-x-0.5">
                                    <AlertTriangle className="w-3.5 h-3.5" />
                                    <span>Oczekuje na akceptację</span>
                                  </span>
                                )}
                              </div>

                              <div className="flex space-x-2">
                                <button
                                  onClick={() => {
                                    setEditingReviewId(rev.id);
                                    setEditingReviewText(rev.text);
                                  }}
                                  className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-extrabold border border-slate-200 transition flex items-center space-x-0.5"
                                >
                                  <span>Edytuj / Edit</span>
                                </button>
                                {!rev.approved && (
                                  <button
                                    onClick={() => handleReviewApprove(rev.id)}
                                    className="px-3 py-1 bg-green-700 hover:bg-green-600 text-white rounded font-extrabold transition flex items-center space-x-1"
                                  >
                                    <Check className="w-3 h-3" />
                                    <span>Zatwierdź</span>
                                  </button>
                                )}
                                <button
                                  onClick={() => handleReviewReject(rev.id)}
                                  className="px-3 py-1 bg-red-700 hover:bg-red-600 text-white rounded font-extrabold transition flex items-center space-x-1"
                                >
                                  <X className="w-3 h-3" />
                                  <span>Usuń</span>
                                </button>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                    {reviews.length === 0 && (
                      <p className="text-center text-slate-400 py-6">Brak opinii w kolejce.</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: CMS content texts (Owner Only) */}
          {activeTab === "content" && (
            <div className="space-y-6">
              {!isOwner ? (
                <div className="p-6 border border-brand-red/30 bg-brand-red/5 text-brand-red rounded-xl flex items-center space-x-2 text-sm font-bold">
                  <ShieldAlert className="w-5 h-5 flex-shrink-0" />
                  <span>Brak uprawnień. Sekcja dostępna wyłącznie dla Właściciela (Owner).</span>
                </div>
              ) : (
                <div className="glass-panel p-6 rounded-2xl space-y-5">
                  <h2 className="text-base font-extrabold text-slate-800 border-b border-slate-100 pb-3 uppercase tracking-wider">
                    Edycja Pól Tekstowych Strony / Website Content Editor
                  </h2>

                  <form onSubmit={handleSaveCmsTexts} className="space-y-5 text-xs font-bold text-slate-500">
                    <div className="space-y-2 border-b border-slate-100 pb-4">
                      <p className="text-sm font-extrabold text-slate-800">1. Nagłówek Główny (Hero Headline)</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block mb-1">Po polsku (PL)</label>
                          <input
                            type="text"
                            value={cmsHeaderPl}
                            onChange={(e) => setCmsHeaderPl(e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded text-slate-800 focus:outline-none focus:border-brand-red"
                          />
                        </div>
                        <div>
                          <label className="block mb-1">Po angielsku (EN)</label>
                          <input
                            type="text"
                            value={cmsHeaderEn}
                            onChange={(e) => setCmsHeaderEn(e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded text-slate-800 focus:outline-none focus:border-brand-red"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 pb-2">
                      <p className="text-sm font-extrabold text-slate-800">2. Podnagłówek Hero (Hero Subtitle)</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block mb-1">Po polsku (PL)</label>
                          <textarea
                            rows={3}
                            value={cmsSubheaderPl}
                            onChange={(e) => setCmsSubheaderPl(e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded text-slate-800 focus:outline-none focus:border-brand-red resize-none"
                          />
                        </div>
                        <div>
                          <label className="block mb-1">Po angielsku (EN)</label>
                          <textarea
                            rows={3}
                            value={cmsSubheaderEn}
                            onChange={(e) => setCmsSubheaderEn(e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded text-slate-800 focus:outline-none focus:border-brand-red resize-none"
                          />
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 bg-brand-red hover:bg-brand-red-hover text-white font-extrabold rounded transition shadow"
                    >
                      ZAPISZ TEKSTY / PUBLISH CMS CHANGES
                    </button>
                  </form>
                </div>
              )}
            </div>
          )}

          {/* TAB 6: Pricing Packages & Add-ons editor (Owner Only) */}
          {activeTab === "pricing" && (
            <div className="space-y-6">
              {!isOwner ? (
                <div className="p-6 border border-brand-red/30 bg-brand-red/5 text-brand-red rounded-xl flex items-center space-x-2 text-sm font-bold">
                  <ShieldAlert className="w-5 h-5 flex-shrink-0" />
                  <span>Brak uprawnień. Sekcja dostępna wyłącznie dla Właściciela (Owner).</span>
                </div>
              ) : (
                <div className="glass-panel p-6 rounded-2xl space-y-5">
                  <h2 className="text-base font-extrabold text-slate-800 border-b border-slate-100 pb-3 uppercase tracking-wider">
                    Konfiguracja Cennika Pakietów Ochrony i Dodatków / Rates Manager
                  </h2>

                  <form onSubmit={handleSavePricing} className="space-y-6 text-xs font-bold text-slate-500">
                    
                    {/* Packages pricing grid */}
                    <div className="space-y-3.5 border-b border-slate-100 pb-5">
                      <p className="text-sm font-extrabold text-slate-800">1. Pakiety Ochrony (Stawka dobowa w PLN / Package Daily Rates)</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block mb-1.5">Złoty / Gold Protect (doba)</label>
                          <input
                            type="number"
                            required
                            min={0}
                            value={goldPrice}
                            onChange={(e) => setGoldPrice(e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded text-slate-800 focus:outline-none focus:border-brand-red"
                          />
                        </div>
                        <div>
                          <label className="block mb-1.5">Platynowy / Platinum Protect (doba)</label>
                          <input
                            type="number"
                            required
                            min={0}
                            value={platinumPrice}
                            onChange={(e) => setPlatinumPrice(e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded text-slate-800 focus:outline-none focus:border-brand-red"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Add-ons pricing grid */}
                    <div className="space-y-3.5">
                      <p className="text-sm font-extrabold text-slate-800">2. Akcesoria i Dodatki (Stawki w PLN / Accessories Rates)</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block mb-1.5">Fotelik dla dziecka / Child Seat (doba)</label>
                          <input
                            type="number"
                            required
                            min={0}
                            value={childSeatPrice}
                            onChange={(e) => setChildSeatPrice(e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded text-slate-800 focus:outline-none focus:border-brand-red"
                          />
                        </div>
                        <div>
                          <label className="block mb-1.5">Podkładka / Booster Seat (doba)</label>
                          <input
                            type="number"
                            required
                            min={0}
                            value={boosterPrice}
                            onChange={(e) => setBoosterPrice(e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded text-slate-800 focus:outline-none focus:border-brand-red"
                          />
                        </div>
                        <div>
                          <label className="block mb-1.5">Nawigacja GPS / GPS Navigation (doba)</label>
                          <input
                            type="number"
                            required
                            min={0}
                            value={gpsPrice}
                            onChange={(e) => setGpsPrice(e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded text-slate-800 focus:outline-none focus:border-brand-red"
                          />
                        </div>
                        <div>
                          <label className="block mb-1.5">Dodatkowy kierowca / Extra Driver (jednorazowo)</label>
                          <input
                            type="number"
                            required
                            min={0}
                            value={driverPrice}
                            onChange={(e) => setDriverPrice(e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded text-slate-800 focus:outline-none focus:border-brand-red"
                          />
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 bg-brand-red hover:bg-brand-red-hover text-white font-extrabold rounded transition shadow"
                    >
                      ZAPISZ CENNIK / SAVE RATES
                    </button>
                  </form>
                </div>
              )}
            </div>
          )}

          {/* TAB 7: Poczta / Email logs viewer (Available to Owner and Employee) */}
          {activeTab === "emails" && (
            <div className="glass-panel p-6 rounded-2xl space-y-5">
              <h2 className="text-base font-extrabold text-slate-800 border-b border-slate-100 pb-3 uppercase tracking-wider flex items-center space-x-2">
                <Mail className="w-5 h-5 text-brand-red animate-pulse" />
                <span>Skrzynka reservations@car-go.pl & Logi Powiadomień ({emails.length})</span>
              </h2>
              
              <div className="p-3 bg-slate-50 border border-slate-200/60 rounded-xl text-xs text-slate-500">
                ℹ️ Poniższy log symuluje serwer pocztowy SMTP wypożyczalni. Monitoruj wysyłane wiadomości aktywacyjne, wyceny oraz potwierdzenia.
              </div>

              <div className="space-y-4">
                {emails.map((email) => (
                  <div key={email.id} className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-2 text-xs font-semibold">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-slate-400 border-b border-slate-100 pb-1.5 text-[10px]">
                      <span>DO / TO: <strong className="text-slate-800">{email.to}</strong></span>
                      <span>WYŚLANO: {email.date}</span>
                    </div>
                    <p className="text-slate-800 font-extrabold text-xs">TEMAT: {email.subject}</p>
                    <pre className="text-[10px] text-slate-600 whitespace-pre-wrap font-mono bg-white p-3 rounded leading-normal border border-slate-150 shadow-sm">
                      {email.body}
                    </pre>

                    {/* Activation simulator shortcut */}
                    {email.subject.includes("Aktywuj") || email.subject.includes("Konto") || email.body.includes("activate") ? (
                      <div className="pt-2 text-right">
                        <a
                          href={`/account/activate?email=${encodeURIComponent(email.to)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center space-x-1.5 px-3 py-1 bg-white border border-slate-200 text-slate-600 hover:border-slate-350 hover:bg-slate-50 text-[10px] font-bold rounded transition"
                        >
                          <Send className="w-3 h-3" />
                          <span>Kliknij link aktywacyjny w imieniu klienta (Test Link)</span>
                        </a>
                      </div>
                    ) : null}
                  </div>
                ))}
                {emails.length === 0 && (
                  <p className="text-center text-slate-400 py-6">Brak zarejestrowanych wysyłek e-mail.</p>
                )}
              </div>
            </div>
          )}

        </div>

      </div>

      {/* Booking Management Detail Modal (Includes pricing entry!) */}
      {selectedBookingDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/65 backdrop-blur-sm p-4">
          <div className="w-full max-w-xl bg-white border border-slate-100 rounded-2xl p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto animate-scale-up">
            
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-slate-800 uppercase tracking-wider">Zarządzaj rezerwacją {selectedBookingDetails.id}</h3>
              <button
                onClick={() => setSelectedBookingDetails(null)}
                className="px-2.5 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-100 rounded text-[10px] text-slate-500 hover:text-slate-800"
              >
                Zamknij
              </button>
            </div>

            {/* Main Info */}
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-slate-50 rounded border border-slate-100">
                  <p className="text-slate-400">Klient:</p>
                  <p className="font-bold text-slate-800 mt-0.5">{selectedBookingDetails.customer.firstName} {selectedBookingDetails.customer.lastName}</p>
                  <p className="text-slate-500">{selectedBookingDetails.customer.email}</p>
                  <p className="text-slate-500">{selectedBookingDetails.customer.phone}</p>
                </div>
                
                <div className="p-3 bg-slate-50 rounded border border-slate-100">
                  <p className="text-slate-400">Pojazd:</p>
                  <p className="font-bold text-slate-800 mt-0.5">{selectedBookingDetails.car.brand} {selectedBookingDetails.car.model}</p>
                  <p className="text-slate-500">Klasa: {selectedBookingDetails.car.class}</p>
                  <p className="text-slate-500">Kaucja: PLN {selectedBookingDetails.car.deposit}</p>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded border border-slate-100 space-y-1">
                <p className="text-slate-400">Terminy i Lokalizacje:</p>
                <p>Odbiór: <strong>{selectedBookingDetails.dates.pickupLocation}</strong> | {selectedBookingDetails.dates.pickupDate} o {selectedBookingDetails.dates.pickupTime}</p>
                <p>Zwrot: <strong>{selectedBookingDetails.dates.returnLocation}</strong> | {selectedBookingDetails.dates.returnDate} o {selectedBookingDetails.dates.returnTime}</p>
                <p className="text-brand-red font-bold">Czas najmu: {selectedBookingDetails.pricing.days} dni</p>
              </div>

              {/* Individual Price handler input form */}
              {selectedBookingDetails.pricing.total === "Individual Price" ? (
                <div className="p-4 bg-brand-red/5 border border-brand-red/20 rounded-xl space-y-3">
                  <p className="font-bold text-slate-800 flex items-center space-x-1.5">
                    <AlertTriangle className="w-4.5 h-4.5 text-brand-red" />
                    <span>Rezerwacja wymaga wyceny (Adres Niestandardowy)</span>
                  </p>
                  <p className="text-slate-500">Wprowadź całkowitą kwotę brutto wynajmu (w tym koszty dostawy i akcesoriów):</p>
                  
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="np. 450"
                      value={customPriceInput}
                      onChange={(e) => setCustomPriceInput(e.target.value)}
                      className="flex-grow px-3 py-2 bg-white border border-slate-200 rounded text-slate-800 focus:outline-none font-bold"
                    />
                    <button
                      onClick={() => handleBookingCustomPrice(selectedBookingDetails.id)}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-extrabold rounded transition"
                    >
                      Zapisz i Wyślij
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-slate-50 rounded border border-slate-100 flex justify-between items-center text-sm">
                  <span className="text-slate-500 font-bold">Całkowity koszt:</span>
                  <strong className="text-brand-red text-base font-black">PLN {selectedBookingDetails.pricing.total.toFixed(2)}</strong>
                </div>
              )}

              {/* Status and Action Buttons */}
              <div className="border-t border-slate-100 pt-4 flex flex-col sm:flex-row justify-between items-center gap-3">
                <div className="flex items-center space-x-1">
                  <span>Aktualny Status:</span>
                  <span className="font-extrabold text-slate-800 uppercase">{selectedBookingDetails.status}</span>
                </div>
                
                <div className="flex space-x-2 w-full sm:w-auto">
                  {selectedBookingDetails.status !== "confirmed" && (
                    <button
                      onClick={() => {
                        handleBookingConfirm(selectedBookingDetails.id);
                        setSelectedBookingDetails(null);
                      }}
                      className="flex-1 px-4 py-2 bg-green-700 hover:bg-green-600 text-white font-bold rounded transition"
                    >
                      ZATWIERDŹ / CONFIRM
                    </button>
                  )}
                  {selectedBookingDetails.status !== "cancelled" && (
                    <button
                      onClick={() => {
                        handleBookingCancel(selectedBookingDetails.id);
                        setSelectedBookingDetails(null);
                      }}
                      className="flex-1 px-4 py-2 bg-red-700 hover:bg-red-600 text-white font-bold rounded transition"
                    >
                      ANULUJ / CANCEL
                    </button>
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
