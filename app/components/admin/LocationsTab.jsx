"use client";

import React, { useState } from "react";
import { useApp } from "@/app/context/AppContext";
import { ShieldAlert, Trash2 } from "lucide-react";

export default function LocationsTab() {
  const { isOwner, locations, addLocation, deleteLocation } = useApp();
  const [newLocName, setNewLocName] = useState("");
  const [newLocMinDays, setNewLocMinDays] = useState(1);

  const handleAddLocation = async (e) => {
    e.preventDefault();
    if (newLocName) {
      const result = await addLocation({
        name: newLocName,
        minDays: parseInt(newLocMinDays),
      });
      if (result.success) {
        setNewLocName("");
        setNewLocMinDays(1);
        alert("Lokalizacja dodana!");
      } else alert("Błąd dodawania lokalizacji.");
    }
  };

  const handleDeleteLocation = async (locId) => {
    if (confirm("Usunąć lokalizację?")) {
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
          Brak uprawnień. Sekcja dostępna wyłącznie dla Właściciela
          (Owner).
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="glass-panel p-6 rounded-2xl space-y-4">
        <h2 className="text-base font-extrabold text-slate-800 border-b border-slate-100 pb-2.5 uppercase tracking-wider">
          Dodaj Nowy Punkt Odbioru / Add Location
        </h2>
        <form
          onSubmit={handleAddLocation}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-bold text-slate-500 items-end"
        >
          <div>
            <label className="block mb-1.5">
              Nazwa lokalizacji / City Name *
            </label>
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
            <button
              type="submit"
              className="w-full py-2.5 bg-brand-red hover:bg-brand-red-hover text-white font-bold rounded transition"
            >
              DODAJ PUNKT
            </button>
          </div>
        </form>
      </div>
      <div className="glass-panel p-6 rounded-2xl space-y-4">
        <h2 className="text-base font-extrabold text-slate-800 border-b border-slate-100 pb-2.5 uppercase tracking-wider">
          Zdefiniowane Lokalizacje ({locations.length})
        </h2>
        <div className="space-y-2">
          {locations.map((loc) => (
            <div
              key={loc.id}
              className="p-3 bg-slate-50 border border-slate-200/60 rounded-xl flex items-center justify-between gap-4 text-xs font-semibold"
            >
              <div>
                <p className="text-sm font-extrabold text-slate-800">
                  {loc.name}
                </p>
              </div>
              {!loc.isCustomAddress && loc.id !== "skarbimierz" ? (
                <button
                  onClick={() => handleDeleteLocation(loc.id)}
                  className="p-1.5 border border-brand-red/30 hover:border-brand-red text-brand-red bg-brand-red/5 rounded transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              ) : (
                <span className="text-[10px] text-slate-400 italic">
                  Baza Systemowa
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}