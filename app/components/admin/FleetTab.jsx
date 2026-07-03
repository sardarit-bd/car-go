"use client";

import React, { useState } from "react";
import { useApp } from "@/app/context/AppContext";
import { ShieldAlert, Trash2 } from "lucide-react";

export default function FleetTab() {
  const {
    isOwner,
    vehicles,
    addVehicle,
    deleteVehicle,
  } = useApp();

  const [newBrand, setNewBrand] = useState("");
  const [newModel, setNewModel] = useState("");
  const [newClass, setNewClass] = useState("A (Economy)");
  const [newPrice, setNewPrice] = useState(100);
  const [newSeats, setNewSeats] = useState(5);
  const [newDescPl, setNewDescPl] = useState("");

  const handleAddVehicle = async (e) => {
    e.preventDefault();
    if (newBrand && newModel) {
      const vehicleData = {
        brand: newBrand,
        model: newModel,
        class: newClass,
        seats: parseInt(newSeats),
        price: parseFloat(newPrice),
        description: newDescPl || "Nowy samochód we flocie.",
      };

      const result = await addVehicle(vehicleData);
      if (result.success) {
        setNewBrand("");
        setNewModel("");
        setNewDescPl("");
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

  if (!isOwner) {
    return (
      <div className="p-6 border border-brand-red/30 bg-brand-red/5 text-brand-red rounded-xl flex items-center space-x-2 text-sm font-bold">
        <ShieldAlert className="w-5 h-5 flex-shrink-0" />{" "}
        <span>
          Brak uprawnień. Zarządzanie flotą dostępne jest wyłącznie
          dla Właściciela (Owner).
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="glass-panel p-6 rounded-2xl space-y-4">
        <h2 className="text-base font-extrabold text-slate-800 border-b border-slate-100 pb-2.5 uppercase tracking-wider">
          Dodaj Nowy Pojazd / Add Vehicle
        </h2>
        <form
          onSubmit={handleAddVehicle}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-bold text-slate-500"
        >
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
            <label className="block mb-1">Miejsca / Seats</label>
            <input
              type="number"
              value={newSeats}
              onChange={(e) => setNewSeats(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded text-slate-800 focus:outline-none focus:border-brand-red"
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
      <div className="glass-panel p-6 rounded-2xl space-y-4">
        <h2 className="text-base font-extrabold text-slate-800 border-b border-slate-100 pb-2.5 uppercase tracking-wider">
          Aktualna Flota Pojazdów / Active Fleet ({vehicles.length})
        </h2>
        <div className="space-y-3">
          {vehicles.map((v) => (
            <div
              key={v.id}
              className="p-3 bg-slate-50 border border-slate-200/60 rounded-xl flex items-center justify-between gap-4 text-xs font-semibold"
            >
              <div>
                <p className="text-sm font-extrabold text-slate-800">
                  {v.brand} {v.model}
                </p>
                <p className="text-slate-500 mt-1 font-bold">
                  Cena:{" "}
                  <strong className="text-brand-red">
                    PLN {v.price}/doba
                  </strong>
                </p>
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
    </div>
  );
}