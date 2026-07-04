"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/app/context/AppContext";
import { ShieldAlert, Trash2, Upload, MapPin, Calendar } from "lucide-react";
import api from "@/lib/axios";

export default function FleetTab() {
  const {
    isOwner,
    vehicles,
    addVehicle,
    deleteVehicle,
    fetchVehicles,
    adminUser,
  } = useApp();

  // Form states
  const [newBrand, setNewBrand] = useState("");
  const [newModel, setNewModel] = useState("");
  const [newClass, setNewClass] = useState("ECONOMY");
  const [newPrice, setNewPrice] = useState(100);
  const [newSeats, setNewSeats] = useState(5);
  const [newDescPl, setNewDescPl] = useState("");
  const [newImage, setNewImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  
  // Backend-driven states
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(""); // Single location dropdown
  
  // UI states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch locations from backend on mount
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await api.get("/api/locations");
        const backendLocations = response.data.data || response.data;
        setLocations(backendLocations);
        // Set default location if available
        if (backendLocations.length > 0) {
          setSelectedLocation(backendLocations[0].id);
        }
      } catch (err) {
        console.error("Failed to fetch locations:", err);
        setError("Nie udało się załadować lokalizacji");
      }
    };
    fetchLocations();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError("Proszę wybrać plik obrazu");
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("Plik jest za duży. Maksymalny rozmiar to 5MB");
        return;
      }
      setNewImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddVehicle = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!newBrand || !newModel) {
      setError("Marka i model są wymagane");
      setLoading(false);
      return;
    }

    if (!selectedLocation) {
      setError("Proszę wybrać lokalizację");
      setLoading(false);
      return;
    }

    // Check if adminUser has id
    // if (!adminUser?.id) {
    //   setError("Błąd autoryzacji - brak ID użytkownika");
    //   setLoading(false);
    //   return;
    // }

    try {
      const formData = new FormData();
      
      // Auto-generate name
      formData.append("name", `${newBrand} ${newModel}`);
      formData.append("brand", newBrand);
      formData.append("model", newModel);
      formData.append("description", newDescPl || "Nowy samochód we flocie.");
      formData.append("class", newClass);
      formData.append("seats", newSeats.toString());
      formData.append("pricePerDay", newPrice.toString());
      
      // Format locations as JSON string (using selected location)
      const selectedLocData = locations.find(loc => loc.id === selectedLocation);
      if (selectedLocData) {
        const locationsArray = [{
          country: selectedLocData.country || "Poland",
          city: selectedLocData.city || selectedLocData.name,
          address: selectedLocData.address || selectedLocData.name
        }];
        formData.append("locations", JSON.stringify(locationsArray));
      }
      
      // Auto-generate availabilities (available from today for 1 year)
      const today = new Date();
      const oneYearLater = new Date();
      oneYearLater.setFullYear(today.getFullYear() + 1);
      
      const availabilitiesArray = [{
        availableFrom: today.toISOString(),
        availableTo: oneYearLater.toISOString()
      }];
      formData.append("availabilities", JSON.stringify(availabilitiesArray));
      
      // Add image if selected
      if (newImage) {
        formData.append("images", newImage);
      }
      
      // Set ownerId from current admin user
      formData.append("ownerId", adminUser.id);

      const response = await api.post("/api/vehicle", formData, {
        headers: { 
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data) {
        // Reset form
        setNewBrand("");
        setNewModel("");
        setNewDescPl("");
        setNewPrice(100);
        setNewSeats(5);
        setNewClass("ECONOMY");
        setNewImage(null);
        setImagePreview(null);
        setSelectedLocation(locations.length > 0 ? locations[0].id : "");
        
        // Refresh vehicles list
        await fetchVehicles();
        
        alert("Pojazd został dodany pomyślnie!");
      }
    } catch (err) {
      console.error("Failed to add vehicle:", err);
      setError(err.response?.data?.message || "Błąd dodawania pojazdu");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteVehicle = async (carId) => {
    if (confirm("Czy na pewno chcesz usunąć ten pojazd?")) {
      try {
        await deleteVehicle(carId);
        alert("Pojazd usunięty.");
      } catch (err) {
        alert("Błąd usuwania pojazdu.");
      }
    }
  };

  const formatPrice = (price) => {
    return parseFloat(price).toFixed(2);
  };

  const getClassLabel = (classValue) => {
    const labels = {
      "ECONOMY": "Economy",
      "COMPACT": "Compact",
      "MEDIUM": "Medium",
      "SUV": "SUV",
      "LUXURY": "Luxury"
    };
    return labels[classValue] || classValue;
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
      {/* Add Vehicle Form */}
      <div className="glass-panel p-6 rounded-2xl space-y-4">
        <h2 className="text-base font-extrabold text-slate-800 border-b border-slate-100 pb-2.5 uppercase tracking-wider">
          Dodaj Nowy Pojazd / Add Vehicle
        </h2>
        
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm font-bold">
            {error}
          </div>
        )}

        <form onSubmit={handleAddVehicle} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-bold text-slate-500">
          {/* Brand & Model */}
          <div>
            <label className="block mb-1">Marka / Brand *</label>
            <input
              type="text"
              required
              value={newBrand}
              onChange={(e) => setNewBrand(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded text-slate-800 focus:outline-none focus:border-brand-red"
              placeholder="np. Tesla"
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
              placeholder="np. Model S"
            />
          </div>

          {/* Class & Seats */}
          <div>
            <label className="block mb-1">Klasa pojazdu / Class</label>
            <select
              value={newClass}
              onChange={(e) => setNewClass(e.target.value)}
              className="w-full bg-white border border-slate-200 text-slate-800 px-3 py-2 rounded focus:outline-none focus:border-brand-red"
            >
              <option value="ECONOMY">Economy (Klasa A)</option>
              <option value="COMPACT">Compact (Klasa B)</option>
              <option value="MEDIUM">Medium (Klasa C)</option>
              <option value="SUV">SUV (Klasa D)</option>
              <option value="LUXURY">Luxury (Klasa E)</option>
            </select>
          </div>
          <div>
            <label className="block mb-1">Miejsca / Seats</label>
            <input
              type="number"
              min="1"
              max="9"
              value={newSeats}
              onChange={(e) => setNewSeats(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded text-slate-800 focus:outline-none focus:border-brand-red"
            />
          </div>

          {/* Price & Description */}
          <div>
            <label className="block mb-1">Stawka dobowa (PLN) *</label>
            <input
              type="number"
              required
              min="0"
              step="0.01"
              value={newPrice}
              onChange={(e) => setNewPrice(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded text-slate-800 focus:outline-none focus:border-brand-red"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block mb-1">Opis / Description</label>
            <textarea
              value={newDescPl}
              onChange={(e) => setNewDescPl(e.target.value)}
              rows="2"
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded text-slate-800 focus:outline-none focus:border-brand-red resize-none"
              placeholder="Opis pojazdu..."
            />
          </div>

          {/* Image Upload */}
          <div className="md:col-span-2">
            <label className="block mb-1">Zdjęcie pojazdu / Vehicle Image</label>
            <div className="flex items-center gap-4">
              <label className="flex-1 flex items-center justify-center px-4 py-3 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-brand-red transition-colors bg-white">
                <Upload className="w-5 h-5 mr-2 text-slate-400" />
                <span className="text-sm font-bold text-slate-600">
                  {newImage ? newImage.name : "Wybierz plik..."}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
              {imagePreview && (
                <div className="w-20 h-20 rounded-lg overflow-hidden border border-slate-200">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>

          {/* Location Dropdown */}
          <div className="md:col-span-2">
            <label className="block mb-2 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-brand-red" />
              Lokalizacja / Location *
            </label>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              required
              className="w-full bg-white border border-slate-200 text-slate-800 px-3 py-2 rounded focus:outline-none focus:border-brand-red"
            >
              <option value="">Wybierz lokalizację...</option>
              {locations.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.name}
                </option>
              ))}
            </select>
            {locations.length === 0 && (
              <p className="text-[10px] text-slate-400 mt-1">
                Ładowanie lokalizacji...
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div className="md:col-span-2 pt-2">
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 bg-brand-red hover:bg-brand-red-hover text-white font-bold rounded transition flex items-center justify-center gap-2 ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Dodawanie...
                </>
              ) : (
                "DODAJ AUTO / SAVE VEHICLE"
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Active Fleet List */}
      <div className="glass-panel p-6 rounded-2xl space-y-4">
        <h2 className="text-base font-extrabold text-slate-800 border-b border-slate-100 pb-2.5 uppercase tracking-wider">
          Aktualna Flota Pojazdów / Active Fleet ({vehicles.length})
        </h2>
        
        {vehicles.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <p className="font-bold">Brak pojazdów we flocie</p>
            <p className="text-sm mt-1">Dodaj pierwszy pojazd używając formularza powyżej</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {vehicles.map((v) => (
              <div
                key={v.id}
                className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow group"
              >
                {/* Card Header with Image */}
                <div className="relative h-40 bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden">
                  {v.image ? (
                    <img
                      src={v.image.startsWith('http') ? v.image : `${process.env.NEXT_PUBLIC_API_URL}${v.image}`}
                      alt={`${v.brand} ${v.model}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                      <span className="text-4xl">🚗</span>
                    </div>
                  )}
                  <div className="absolute top-3 left-3">
                    <span className="px-2 py-1 bg-brand-red/90 text-white text-[10px] font-bold uppercase rounded">
                      {getClassLabel(v.class)}
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="text-lg font-black text-slate-800">
                      {v.brand} {v.model}
                    </h3>
                    {v.description && (
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                        {v.description}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center gap-1 text-slate-600">
                      <span className="font-bold">Miejsca:</span>
                      <span className="text-slate-800 font-bold">{v.seats}</span>
                    </div>
                    <div className="flex items-center gap-1 text-slate-600">
                      <span className="font-bold">Cena:</span>
                      <span className="text-brand-red font-black">{formatPrice(v.price)} PLN</span>
                    </div>
                  </div>

                  {v.locations && v.locations.length > 0 && (
                    <div className="pt-2 border-t border-slate-100">
                      <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Lokalizacje:</p>
                      <div className="flex flex-wrap gap-1">
                        {v.locations.slice(0, 3).map((loc, idx) => (
                          <span key={idx} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold rounded">
                            {loc.city || loc.address}
                          </span>
                        ))}
                        {v.locations.length > 3 && (
                          <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold rounded">
                            +{v.locations.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="pt-3 flex gap-2">
                    <button
                      onClick={() => handleDeleteVehicle(v.id)}
                      className="flex-1 py-2 border border-brand-red/30 hover:border-brand-red text-brand-red bg-brand-red/5 hover:bg-brand-red/10 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      Usuń
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}