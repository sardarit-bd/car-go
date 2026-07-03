"use client";

import React, { useState } from "react";
import { useApp } from "@/app/context/AppContext";
import { ShieldAlert, Trash2, MapPin, Phone, Building2, Globe } from "lucide-react";
import * as Yup from "yup";

export default function LocationsTab() {
  const { isOwner, locations, addLocation, deleteLocation } = useApp();
  
  const [formValues, setFormValues] = useState({
    name: "",
    address: "",
    city: "",
    country: "",
    phone: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Yup Validation Schema
  const locationSchema = Yup.object().shape({
    name: Yup.string().required("Nazwa jest wymagana"),
    address: Yup.string().required("Adres jest wymagany"),
    city: Yup.string().required("Miasto jest wymagane"),
    country: Yup.string().required("Kraj jest wymagany"),
    phone: Yup.string().required("Telefon jest wymagany"),
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
    // Clear error on change
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleAddLocation = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFormErrors({});

    try {
      // Validate with Yup
      await locationSchema.validate(formValues, { abortEarly: false });
      
      // Send to backend
      const result = await addLocation(formValues);
      if (result.success) {
        setFormValues({ name: "", address: "", city: "", country: "", phone: "" });
        alert("Lokalizacja dodana pomyślnie!");
      } else {
        alert("Błąd dodawania: " + (result.message || "Spróbuj ponownie"));
      }
    } catch (err) {
      if (err.inner) {
        // Map Yup errors to state
        const errors = {};
        err.inner.forEach((e) => {
          errors[e.path] = e.message;
        });
        setFormErrors(errors);
      } else {
        alert("Błąd walidacji lub serwera.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteLocation = async (locId) => {
    if (confirm("Czy na pewno chcesz usunąć tę lokalizację?")) {
      const loc = locations.find((l) => l.id === locId);
      const backendId = loc?.backendId || locId;
      const result = await deleteLocation(backendId);
      if (result.success) alert("Lokalizacja usunięta.");
      else alert("Błąd usuwania lokalizacji.");
    }
  };

  if (!isOwner) {
    return (
      <div className="p-6 border border-brand-red/30 bg-brand-red/5 text-brand-red rounded-xl flex items-center space-x-2 text-sm font-bold">
        <ShieldAlert className="w-5 h-5 flex-shrink-0" />
        <span>
          Brak uprawnień. Sekcja dostępna wyłącznie dla Właściciela (Owner).
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Add Location Form */}
      <div className="glass-panel p-6 rounded-2xl space-y-4">
        <h2 className="text-base font-extrabold text-slate-800 border-b border-slate-100 pb-2.5 uppercase tracking-wider">
          Dodaj Nowy Punkt Odbioru / Add Location
        </h2>
        <form
          onSubmit={handleAddLocation}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-bold text-slate-500"
        >
          <div>
            <label className="block mb-1.5">Nazwa lokalizacji / Name *</label>
            <input
              type="text"
              name="name"
              placeholder="np. JFK Airport Branch"
              value={formValues.name}
              onChange={handleChange}
              className={`w-full px-3 py-2.5 bg-white border rounded text-slate-800 focus:outline-none focus:border-brand-red ${formErrors.name ? 'border-red-500' : 'border-slate-200'}`}
            />
            {formErrors.name && <p className="text-red-500 text-[10px] mt-1">{formErrors.name}</p>}
          </div>

          <div>
            <label className="block mb-1.5">Adres / Address *</label>
            <input
              type="text"
              name="address"
              placeholder="np. Terminal 4"
              value={formValues.address}
              onChange={handleChange}
              className={`w-full px-3 py-2.5 bg-white border rounded text-slate-800 focus:outline-none focus:border-brand-red ${formErrors.address ? 'border-red-500' : 'border-slate-200'}`}
            />
            {formErrors.address && <p className="text-red-500 text-[10px] mt-1">{formErrors.address}</p>}
          </div>

          <div>
            <label className="block mb-1.5">Miasto / City *</label>
            <input
              type="text"
              name="city"
              placeholder="np. Skarbimierz-Osiedle"
              value={formValues.city}
              onChange={handleChange}
              className={`w-full px-3 py-2.5 bg-white border rounded text-slate-800 focus:outline-none focus:border-brand-red ${formErrors.city ? 'border-red-500' : 'border-slate-200'}`}
            />
            {formErrors.city && <p className="text-red-500 text-[10px] mt-1">{formErrors.city}</p>}
          </div>

          <div>
            <label className="block mb-1.5">Kraj / Country *</label>
            <input
              type="text"
              name="country"
              placeholder="np. Polska"
              value={formValues.country}
              onChange={handleChange}
              className={`w-full px-3 py-2.5 bg-white border rounded text-slate-800 focus:outline-none focus:border-brand-red ${formErrors.country ? 'border-red-500' : 'border-slate-200'}`}
            />
            {formErrors.country && <p className="text-red-500 text-[10px] mt-1">{formErrors.country}</p>}
          </div>

          <div className="md:col-span-2">
            <label className="block mb-1.5">Telefon / Phone *</label>
            <input
              type="text"
              name="phone"
              placeholder="np. +48 123 456 789"
              value={formValues.phone}
              onChange={handleChange}
              className={`w-full px-3 py-2.5 bg-white border rounded text-slate-800 focus:outline-none focus:border-brand-red ${formErrors.phone ? 'border-red-500' : 'border-slate-200'}`}
            />
            {formErrors.phone && <p className="text-red-500 text-[10px] mt-1">{formErrors.phone}</p>}
          </div>

          <div className="md:col-span-2 pt-2">
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2.5 bg-brand-red hover:bg-brand-red-hover text-white font-bold rounded transition ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? "DODAWANIE..." : "DODAJ PUNKT / ADD LOCATION"}
            </button>
          </div>
        </form>
      </div>

      {/* Locations List */}
      <div className="glass-panel p-6 rounded-2xl space-y-4">
        <h2 className="text-base font-extrabold text-slate-800 border-b border-slate-100 pb-2.5 uppercase tracking-wider">
          Zdefiniowane Lokalizacje ({locations.length})
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {locations.map((loc) => (
            <div
              key={loc.id}
              className="p-4 bg-white border border-slate-200/60 rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div className="space-y-2 mb-4">
                <h3 className="text-base font-black text-slate-800 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-brand-red" />
                  {loc.name}
                </h3>
                <div className="grid grid-cols-1 gap-1.5 text-xs text-slate-600">
                  <p className="flex items-center gap-2">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-semibold text-slate-500">Adres:</span> {loc.address || "Brak danych"}
                  </p>
                  <p className="flex items-center gap-2">
                    <Globe className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-semibold text-slate-500">Miasto / Kraj:</span> {loc.city || "-"}, {loc.country || "-"}
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-semibold text-slate-500">Telefon:</span> {loc.phone || "Brak danych"}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end">
                {!loc.isCustomAddress && loc.id !== "skarbimierz" ? (
                  <button
                    onClick={() => handleDeleteLocation(loc.id)}
                    className="p-2 border border-brand-red/30 hover:border-brand-red text-brand-red bg-brand-red/5 hover:bg-brand-red/10 rounded-lg transition flex items-center gap-1.5 text-xs font-bold"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Usuń
                  </button>
                ) : (
                  <span className="text-[10px] text-slate-400 italic font-bold uppercase tracking-wider px-2 py-1 bg-slate-50 rounded">
                    Baza Systemowa
                  </span>
                )}
              </div>
            </div>
          ))}
          {locations.length === 0 && (
            <p className="text-center text-slate-400 col-span-2 py-8">
              Brak zdefiniowanych lokalizacji. Dodaj pierwszą powyżej.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}