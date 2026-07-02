"use client";

import SearchForm from "@/app/components/SearchForm";
import { useApp } from "@/app/context/AppContext";
import useVehicles from "@/app/hooks/useVehicles";
import VehicleCard from "@/app/components/vehicles/VehicleCard";
import VehicleFilters from "@/app/components/vehicles/VehicleFilters";
import { LoadingState, ErrorState, EmptyState } from "@/app/components/vehicles/VehicleStates";
import { useState } from "react";

export default function Vehicles() {
const { lang, t, searchParams, setSearchParams } = useApp();

  const initialApiParams = searchParams?.pickupDate ? {
    location: searchParams.pickupLocation,
    pickupDate: searchParams.pickupDate,
    returnDate: searchParams.returnDate,
  } : {};

  const [searchTerm, setSearchTerm] = useState("");
  const [seatsFilter, setSeatsFilter] = useState("all");
  const [transmissionFilter, setTransmissionFilter] = useState("all");

  const { vehicles, loading, error, updateApiParams, updateClientFilters } = useVehicles(initialApiParams);

  const handleSearchFormSubmit = (searchData) => {
    // Update API params for filtering vehicles
    updateApiParams({
      location: searchData.pickupLocation,
      pickupDate: searchData.pickupDate,
      returnDate: searchData.returnDate,
    });
    
    // Update global search params context for checkout
    setSearchParams({
      pickupLocation: searchData.pickupLocation,
      returnLocation: searchData.returnLocation,
      pickupDate: searchData.pickupDate,
      returnDate: searchData.returnDate,
      pickupTime: searchData.pickupTime,
      returnTime: searchData.returnTime,
      days: searchData.days,
      isCustomPrice: searchData.isCustomPrice
    });
  };

  const handleSearchTermChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    updateClientFilters({ searchTerm: value });
  };

  const handleSeatsFilterChange = (e) => {
    const value = e.target.value;
    setSeatsFilter(value);
    updateApiParams({ seats: value === "all" ? undefined : parseInt(value, 10) });
  };

  const handleTransmissionFilterChange = (e) => {
    const value = e.target.value;
    setTransmissionFilter(value);
    updateClientFilters({ transmission: value });
  };

  return (
    <div className="relative">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808005_1px,transparent_1px),linear-gradient(to_bottom,#80808005_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 relative z-10">

        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto mb-12 sm:mb-16">
          <span className="text-brand-red font-bold text-sm tracking-wide flex items-center justify-center gap-1">
            <span className="text-brand-red">*</span> {t("navVehicles")}
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900">
            {lang === "pl" ? "Nasza Flota Pojazdów" : "Our Vehicle Fleet"}
          </h1>
          <p className="text-base sm:text-lg text-slate-500 font-medium leading-relaxed max-w-2xl mx-auto">
            {lang === "pl" 
              ? "Porównaj dostępne modele i wybierz idealny środek transportu. Gwarantujemy przejrzystość cenową." 
              : "Compare available models and select the ideal vehicle. We guarantee price transparency."}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Left Sidebar - Search Form */}
          <div className="lg:col-span-4 lg:sticky top-36   block">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <SearchForm vertical={true} onSearch={handleSearchFormSubmit} />
            </div>
          </div>

          {/* Right Content */}
          <div className="lg:col-span-8 space-y-6">

            {/* Filter Bar */}
            <VehicleFilters
              lang={lang}
              t={t}
              searchTerm={searchTerm}
              onSearchChange={handleSearchTermChange}
              seatsFilter={seatsFilter}
              onSeatsChange={handleSeatsFilterChange}
              transmissionFilter={transmissionFilter}
              onTransmissionChange={handleTransmissionFilterChange}
            />

            {/* Loading State */}
            {loading && <LoadingState lang={lang} />}

            {/* Error State */}
            {error && !loading && <ErrorState lang={lang} />}

            {/* Vehicle List */}
            {!loading && !error && vehicles.length > 0 ? (
              <div className="space-y-5 flex flex-wrap gap-5 justify-center">
                {vehicles.map((car) => (
                  <VehicleCard 
                    key={car.id} 
                    car={car} 
                    lang={lang} 
                    t={t} 
                  />
                ))}
              </div>
            ) : (
              !loading && !error && <EmptyState lang={lang} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}