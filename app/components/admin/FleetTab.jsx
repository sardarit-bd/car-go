"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/app/context/AppContext";
import { ShieldAlert, Trash2, Upload, MapPin, Calendar } from "lucide-react";
import api from "@/lib/axios";

export default function FleetTab() {
  const {
    isOwner,
    adminVehicles,
    addVehicle,
    deleteVehicle,
    fetchAdminVehicles,
    toggleVehicleActive,
    adminUser,
  } = useApp();

  const [newBrand, setNewBrand] = useState("");
  const [newModel, setNewModel] = useState("");
  const [newClass, setNewClass] = useState("ECONOMY");
  const [newPrice, setNewPrice] = useState(100);
  const [newSeats, setNewSeats] = useState(5);
  const [newDescPl, setNewDescPl] = useState("");
  const [newFuelType, setNewFuelType] = useState("Petrol");
  const [newTransmissionType, setNewTransmissionType] = useState("Manual");
  const [newTrunkCapacity, setNewTrunkCapacity] = useState(0);
  const [newImage, setNewImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);
  const [galleryPreviews, setGalleryPreviews] = useState([]);
  console.log("adminVehicles in FleetTab:", adminVehicles);
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [vehicleClasses, setVehicleClasses] = useState([]);
  const [newClassName, setNewClassName] = useState("");
  const [editingClassId, setEditingClassId] = useState(null);
  const [editingClassName, setEditingClassName] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await api.get("/api/locations");
        const backendLocations = response.data.data || response.data;
        setLocations(backendLocations);
        if (backendLocations.length > 0) {
          setSelectedLocation(backendLocations[0].id);
        }
      } catch (err) {
        console.error("Failed to fetch locations:", err);
        setError("Nie udało się załadować lokalizacji");
      }
    };
    fetchLocations();
    fetchVehicleClasses();
    fetchAdminVehicles();
  }, []);

  const fetchVehicleClasses = async () => {
    try {
      const response = await api.get("/api/vehicle-classes");
      const backendClasses = response.data.data || response.data;
      setVehicleClasses(backendClasses);
      if (backendClasses.length > 0) {
        setNewClass(backendClasses[0].name);
      }
    } catch (err) {
      console.error("Failed to fetch vehicle classes:", err);
    }
  };

  const handleAddClass = async (e) => {
    e.preventDefault();
    if (!newClassName.trim()) return;
    try {
      await api.post("/api/vehicle-classes", { name: newClassName.trim() });
      setNewClassName("");
      await fetchVehicleClasses();
    } catch (err) {
      alert(err.response?.data?.message || "Błąd dodawania klasy");
    }
  };

  const handleStartEditClass = (cls) => {
    setEditingClassId(cls.id);
    setEditingClassName(cls.name);
  };

  const handleSaveEditClass = async (id) => {
    if (!editingClassName.trim()) return;
    try {
      await api.patch(`/api/vehicle-classes/${id}`, {
        name: editingClassName.trim(),
      });
      setEditingClassId(null);
      setEditingClassName("");
      await fetchVehicleClasses();
    } catch (err) {
      alert(err.response?.data?.message || "Błąd edycji klasy");
    }
  };

  const handleDeleteClass = async (id) => {
    if (confirm("Czy na pewno chcesz usunąć tę klasę?")) {
      try {
        await api.delete(`/api/vehicle-classes/${id}`);
        await fetchVehicleClasses();
      } catch (err) {
        alert(err.response?.data?.message || "Błąd usuwania klasy");
      }
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setError("Proszę wybrać plik obrazu");
        return;
      }

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

  const MAX_GALLERY_IMAGES = 5;

  const handleGalleryChange = (e) => {
    const incomingFiles = Array.from(e.target.files);
    e.target.value = ""; // allow re-selecting from the same dialog next time

    const validNewFiles = [];
    for (const file of incomingFiles) {
      if (!file.type.startsWith("image/")) {
        setError("Wszystkie dodatkowe zdjęcia muszą być obrazami");
        continue;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError("Jeden z plików jest za duży. Maksymalny rozmiar to 5MB");
        continue;
      }
      validNewFiles.push(file);
    }

    if (validNewFiles.length === 0) return;

    setGalleryImages((prevFiles) => {
      const combined = [...prevFiles, ...validNewFiles];
      if (combined.length > MAX_GALLERY_IMAGES) {
        setError(
          `Można wybrać maksymalnie ${MAX_GALLERY_IMAGES} dodatkowych zdjęć`,
        );
      }
      const limited = combined.slice(0, MAX_GALLERY_IMAGES);

      // Build previews for the final, limited file list
      const previews = new Array(limited.length).fill(null);
      let loadedCount = 0;
      limited.forEach((file, idx) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          previews[idx] = reader.result;
          loadedCount++;
          if (loadedCount === limited.length) {
            setGalleryPreviews(previews);
          }
        };
        reader.readAsDataURL(file);
      });

      return limited;
    });
  };

  const handleRemoveGalleryImage = (index) => {
    setGalleryImages((prev) => prev.filter((_, i) => i !== index));
    setGalleryPreviews((prev) => prev.filter((_, i) => i !== index));
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

    try {
      const formData = new FormData();

      formData.append("name", `${newBrand} ${newModel}`);
      formData.append("brand", newBrand);
      formData.append("model", newModel);
      formData.append("description", newDescPl || "Nowy samochód we flocie.");
      formData.append("class", newClass);
      formData.append("seats", newSeats.toString());
      formData.append("fuelType", newFuelType);
      formData.append("transmissionType", newTransmissionType);
      formData.append("trunkCapacity", newTrunkCapacity.toString());
      formData.append("pricePerDay", newPrice.toString());

      const selectedLocData = locations.find(
        (loc) => loc.id === selectedLocation,
      );
      if (selectedLocData) {
        const locationsArray = [
          {
            country: selectedLocData.country || "Poland",
            city: selectedLocData.city || selectedLocData.name,
            address: selectedLocData.address || selectedLocData.name,
          },
        ];
        formData.append("locations", JSON.stringify(locationsArray));
      }

      const today = new Date();
      const oneYearLater = new Date();
      oneYearLater.setFullYear(today.getFullYear() + 1);

      const availabilitiesArray = [
        {
          availableFrom: today.toISOString(),
          availableTo: oneYearLater.toISOString(),
        },
      ];
      formData.append("availabilities", JSON.stringify(availabilitiesArray));

      if (newImage) {
        formData.append("mainImage", newImage);
      }

      galleryImages.forEach((file) => {
        formData.append("galleryImages", file);
      });

      formData.append("ownerId", adminUser.id);

      const response = await api.post("/api/vehicle", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data) {
        setNewBrand("");
        setNewModel("");
        setNewDescPl("");
        setNewPrice(100);
        setNewSeats(5);
        setNewClass("ECONOMY");
        setNewFuelType("Petrol");
        setNewTransmissionType("Manual");
        setNewTrunkCapacity(0);
        setNewImage(null);
        setImagePreview(null);
        setGalleryImages([]);
        setGalleryPreviews([]);
        setSelectedLocation(locations.length > 0 ? locations[0].id : "");

        // Refresh vehicles list
        await fetchAdminVehicles();

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

  const handleToggleActive = async (carId, currentlyActive) => {
    const result = await toggleVehicleActive(carId, !currentlyActive);
    if (!result.success) {
      alert("Błąd zmiany statusu dostępności pojazdu.");
    }
  };

  const formatPrice = (price) => {
    return parseFloat(price).toFixed(2);
  };

  const getClassLabel = (classValue) => {
    const labels = {
      ECONOMY: "Economy",
      COMPACT: "Compact",
      MEDIUM: "Medium",
      SUV: "SUV",
      LUXURY: "Luxury",
    };
    return labels[classValue] || classValue;
  };

  if (!isOwner) {
    return (
      <div className="p-6 border border-brand-red/30 bg-brand-red/5 text-brand-red rounded-xl flex items-center space-x-2 text-sm font-bold">
        <ShieldAlert className="w-5 h-5 flex-shrink-0" />{" "}
        <span>
          Brak uprawnień. Zarządzanie flotą dostępne jest wyłącznie dla
          Właściciela (Owner).
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

        <form
          onSubmit={handleAddVehicle}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-bold text-slate-500"
        >
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
              {vehicleClasses.length === 0 && (
                <option value="">Brak zdefiniowanych klas</option>
              )}
              {vehicleClasses.map((cls) => (
                <option key={cls.id} value={cls.name}>
                  {cls.name}
                </option>
              ))}
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

          <div>
            <label className="block mb-1">Paliwo / Fuel Type</label>
            <select
              value={newFuelType}
              onChange={(e) => setNewFuelType(e.target.value)}
              className="w-full bg-white border border-slate-200 text-slate-800 px-3 py-2 rounded focus:outline-none focus:border-brand-red"
            >
              <option value="Petrol">Benzyna / Petrol</option>
              <option value="Diesel">Diesel</option>
            </select>
          </div>
          <div>
            <label className="block mb-1">Skrzynia biegów / Transmission</label>
            <select
              value={newTransmissionType}
              onChange={(e) => setNewTransmissionType(e.target.value)}
              className="w-full bg-white border border-slate-200 text-slate-800 px-3 py-2 rounded focus:outline-none focus:border-brand-red"
            >
              <option value="Manual">Manualna / Manual</option>
              <option value="Automatic">Automatyczna / Automatic</option>
            </select>
          </div>
          <div>
            <label className="block mb-1">
              Pojemność bagażnika (L) / Trunk Capacity
            </label>
            <input
              type="number"
              min="0"
              value={newTrunkCapacity}
              onChange={(e) => setNewTrunkCapacity(e.target.value)}
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

          {/* Main Image Upload */}
          <div className="md:col-span-2">
            <label className="block mb-1">
              Zdjęcie główne / Main Image (widoczne na liście pojazdów)
            </label>
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
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Gallery Images Upload */}
          <div className="md:col-span-2">
            <label className="block mb-1">
              Dodatkowe zdjęcia / Additional Images (widoczne na stronie
              szczegółów, max. {MAX_GALLERY_IMAGES})
            </label>
            <label className="flex items-center justify-center px-4 py-3 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-brand-red transition-colors bg-white">
              <Upload className="w-5 h-5 mr-2 text-slate-400" />
              <span className="text-sm font-bold text-slate-600">
                {galleryImages.length > 0
                  ? `Wybrano ${galleryImages.length} zdjęć`
                  : "Wybierz pliki..."}
              </span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleGalleryChange}
                className="hidden"
              />
            </label>
            {galleryPreviews.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {galleryPreviews.map((src, idx) => (
                  <div
                    key={idx}
                    className="relative w-16 h-16 rounded-lg overflow-hidden border border-slate-200"
                  >
                    <img
                      src={src}
                      alt={`Gallery ${idx}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveGalleryImage(idx)}
                      className="absolute top-0.5 right-0.5 w-4 h-4 bg-slate-900/70 hover:bg-brand-red text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none"
                      title="Usuń"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
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
          Aktualna Flota Pojazdów / Active Fleet ({adminVehicles.length})
        </h2>

        {adminVehicles.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <p className="font-bold">Brak pojazdów we flocie</p>
            <p className="text-sm mt-1">
              Dodaj pierwszy pojazd używając formularza powyżej
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {adminVehicles.map((v) => (
              <div
                key={v.id}
                className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow group"
              >
                {/* Card Header with Image */}
                <div className="relative h-40 bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden">
                  {v.image ? (
                    <img
                      src={
                        v.image.startsWith("http")
                          ? v.image
                          : `${process.env.NEXT_PUBLIC_API_URL}${v.image}`
                      }
                      alt={`${v.brand} ${v.model}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                      <span className="text-4xl">🚗</span>
                    </div>
                  )}
                  <div className="absolute top-3 left-3 flex gap-1">
                    <span className="px-2 py-1 bg-brand-red/90 text-white text-[10px] font-bold uppercase rounded">
                      {getClassLabel(v.class)}
                    </span>
                    {!v.isActive && (
                      <span className="px-2 py-1 bg-slate-700/90 text-white text-[10px] font-bold uppercase rounded">
                        Wyłączony
                      </span>
                    )}
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
                      <span className="text-slate-800 font-bold">
                        {v.seats}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-slate-600">
                      <span className="font-bold">Cena:</span>
                      <span className="text-brand-red font-black">
                        {formatPrice(v.price)} PLN
                      </span>
                    </div>
                  </div>

                  {v.locations && v.locations.length > 0 && (
                    <div className="pt-2 border-t border-slate-100">
                      <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">
                        Lokalizacje:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {v.locations.slice(0, 3).map((loc, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold rounded"
                          >
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
                      onClick={() => handleToggleActive(v.id, v.isActive)}
                      className={`flex-1 py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1 border ${
                        v.isActive
                          ? "border-slate-200 text-slate-600 bg-slate-50 hover:bg-slate-100"
                          : "border-green-200 text-green-700 bg-green-50 hover:bg-green-100"
                      }`}
                    >
                      {v.isActive ? "Wyłącz" : "Włącz"}
                    </button>
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

      {/* Vehicle Class Management */}
      <div className="glass-panel p-6 rounded-2xl space-y-4">
        <h2 className="text-base font-extrabold text-slate-800 border-b border-slate-100 pb-2.5 uppercase tracking-wider">
          Klasy Pojazdów / Vehicle Classes
        </h2>

        <form onSubmit={handleAddClass} className="flex gap-2">
          <input
            type="text"
            value={newClassName}
            onChange={(e) => setNewClassName(e.target.value)}
            placeholder="Nazwa nowej klasy..."
            className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded text-xs font-bold text-slate-800 focus:outline-none focus:border-brand-red"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-brand-red hover:bg-brand-red-hover text-white text-xs font-bold rounded transition"
          >
            Dodaj
          </button>
        </form>

        <div className="space-y-2">
          {vehicleClasses.map((cls) => (
            <div
              key={cls.id}
              className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-lg"
            >
              {editingClassId === cls.id ? (
                <input
                  type="text"
                  value={editingClassName}
                  onChange={(e) => setEditingClassName(e.target.value)}
                  className="flex-1 mr-2 px-2 py-1 bg-slate-50 border border-slate-200 rounded text-xs font-bold text-slate-800 focus:outline-none focus:border-brand-red"
                />
              ) : (
                <span className="text-xs font-bold text-slate-700">
                  {cls.name}
                </span>
              )}

              <div className="flex gap-2">
                {editingClassId === cls.id ? (
                  <button
                    onClick={() => handleSaveEditClass(cls.id)}
                    className="px-3 py-1 bg-green-50 hover:bg-green-100 border border-green-200 text-green-700 rounded text-xs font-bold"
                  >
                    Zapisz
                  </button>
                ) : (
                  <button
                    onClick={() => handleStartEditClass(cls)}
                    className="px-3 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded text-xs font-bold"
                  >
                    Edytuj
                  </button>
                )}
                <button
                  onClick={() => handleDeleteClass(cls.id)}
                  className="px-3 py-1 bg-brand-red/5 hover:bg-brand-red/10 border border-brand-red/30 text-brand-red rounded text-xs font-bold"
                >
                  Usuń
                </button>
              </div>
            </div>
          ))}
          {vehicleClasses.length === 0 && (
            <p className="text-center text-slate-400 text-xs py-4">
              Brak klas. Dodaj pierwszą powyżej.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
