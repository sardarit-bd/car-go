"use client";

import { useApp } from "@/app/context/AppContext";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import VehicleDetailsHero from "@/app/components/vehicle-details/VehicleDetailsHero";
import VehicleDetailsSpecs from "@/app/components/vehicle-details/VehicleDetailsSpecs";
import VehicleDetailsActions from "@/app/components/vehicle-details/VehicleDetailsActions";
import VehicleDetailsHeader from "@/app/components/vehicle-details/VehicleDetailsHeader";
import SearchForm from "@/app/components/SearchForm"; // <-- ADDED

export default function VehicleDetails() {
  const router = useRouter();
  const { id } = useParams();
  const { lang, vehicles, t, setSearchParams } = useApp(); // <-- ADDED setSearchParams

  const car = vehicles.find((v) => v.id === id);

  if (!car) {
    return (
      <div className="max-w-xl mx-auto text-center py-20 px-4">
        <h2 className="text-xl font-bold text-slate-800 mb-4">
          Pojazd nie został znaleziony / Vehicle Not Found
        </h2>
        <Link
          href="/vehicles"
          className="inline-flex items-center gap-2 text-brand-red hover:underline font-bold text-sm"
        >
          <span>Powrót do katalogu / Return to catalog</span>
        </Link>
      </div>
    );
  }

  // <-- ADDED: Handles the SearchForm submission
  const handleSearch = (searchData) => {
    setSearchParams(searchData);
    // Go to step 2 (Packages & Extras) since the car is already selected
    router.push(`/checkout?step=2&car=${car.id}`);
  };

  return (
    <div className="relative">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808005_1px,transparent_1px),linear-gradient(to_bottom,#80808005_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 relative z-10 animate-fade-in">
        {/* Header Section */}
        <div className="mb-10">
          <VehicleDetailsHeader car={{ ...car, lang }} t={t} />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Image & Specs */}
          <div className="lg:col-span-7 space-y-6">
            <VehicleDetailsHero car={car} t={t} />
            <VehicleDetailsSpecs car={car} lang={lang} t={t} />
          </div>

          {/* Right Column: Search Form & Actions (Sticky on Desktop) */}
          <div className="lg:col-span-5 lg:sticky lg:top-36 space-y-6">
            {/* ADDED: Search Form for Dates and Locations */}
            <SearchForm vertical={true} onSearch={handleSearch} />

            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
              {/* Price Summary */}
              <div className="pb-6 border-b border-slate-100">
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-2">
                  {t("priceFrom")}
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black text-slate-900">
                    {car.price}
                  </span>
                  <span className="text-sm text-slate-500 font-bold">
                    PLN {t("dayUnit")}
                  </span>
                </div>
              </div>

              {/* Actions (Deposit & Guarantee Badges) */}
              <VehicleDetailsActions car={car} t={t} lang={lang} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
