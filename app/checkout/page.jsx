"use client";

import { useApp } from "@/app/context/AppContext";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import api from "@/lib/axios";
import CheckoutSteps from "@/app/components/checkout/CheckoutSteps";
import CheckoutStep1 from "@/app/components/checkout/CheckoutStep1";
import CheckoutStep2 from "@/app/components/checkout/CheckoutStep2";
import CheckoutStep3 from "@/app/components/checkout/CheckoutStep3";
import CheckoutStep4 from "@/app/components/checkout/CheckoutStep4";
import CheckoutSummary from "@/app/components/checkout/CheckoutSummary";

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
    t,
  } = useApp();
  console.log("addons", addons);
  const initialStep = parseInt(searchParams.get("step")) || 1;
  const preSelectedCarId = searchParams.get("car") || "";

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
      if (
        !activeSearch ||
        !activeSearch.pickupDate ||
        !activeSearch.returnDate
      ) {
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

        const fetchedVehicles = response.data.data.vehicles.map((v) => ({
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
          image:
            v.images && v.images.length > 0
              ? `${process.env.NEXT_PUBLIC_API_URL}${v.images[0].imageUrl}`
              : "/fallback-car.png",
          description: v.description,
          descriptionEn: v.description,
          specs: {
            engine: "N/A",
            consumption: "N/A",
            aircon: "Yes",
            year: "N/A",
          },
        }));

        setAvailableVehicles(fetchedVehicles);
      } catch (error) {
        console.error("Failed to fetch available vehicles:", error);
        setAvailableVehicles(vehicles);
      } finally {
        setLoadingVehicles(false);
      }
    };

    fetchAvailableVehicles();
  }, [activeSearch, vehicles]);

  const getDays = () => (activeSearch ? activeSearch.days : 1);
  const getCarCost = () => (selectedCar ? selectedCar.price * getDays() : 0);
  const getPackageCost = () =>
    selectedPackage ? selectedPackage.pricePerDay * getDays() : 0;

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
        pickupLocation: "Skarbimierz-Osiedle",
        returnLocation: "Skarbimierz-Osiedle",
        pickupDate: new Date(Date.now() + 86400000).toISOString().split("T")[0],
        returnDate: new Date(Date.now() + 86400000 * 4)
          .toISOString()
          .split("T")[0],
        pickupTime: "08:00",
        returnTime: "08:00",
        days: 3,
        isCustomPrice: false,
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

    if (!activeSearch) {
      alert(
        lang === "pl"
          ? "Brak danych wyszukiwania. Proszę wybrać pojazd ponownie."
          : "Search data missing. Please select a vehicle again.",
      );
      router.push("/checkout?step=1");
      return;
    }
    if (!consentPrivacy || !consentTerms || !consentData) {
      alert(
        lang === "pl"
          ? "Proszę zaakceptować wymagane zgody!"
          : "Please accept the required consents!",
      );
      return;
    }

    const pickupLoc = locations.find(
      (l) => l.name === activeSearch?.pickupLocation,
    );
    const returnLoc = locations.find(
      (l) => l.name === activeSearch?.returnLocation,
    );

    const payload = {
      vehicleId: selectedCar.id,
      phoneNumber: phone,
      pickupDate: new Date(
        `${activeSearch.pickupDate}T${activeSearch.pickupTime}:00`,
      ).toISOString(),
      returnDate: new Date(
        `${activeSearch.returnDate}T${activeSearch.returnTime}:00`,
      ).toISOString(),
      pickupLocationId: pickupLoc?.id || null,
      returnLocationId: returnLoc?.id || null,
      totalPrice: getTotalGross() === "Individual Price" ? 0 : getTotalGross(),
      customerFirstName: firstName,
      customerLastName: lastName,
      customerEmail: email,
      customerNotes: notes,
      packageData: selectedPackage
        ? {
            id: selectedPackage.id,
            name: selectedPackage.name,
            price: selectedPackage.pricePerDay,
          }
        : null,
      addonsData: selectedAddons.map((id) => {
        const addon = addons.find((a) => a.id === id);
        return {
          id: addon.id,
          name: addon.name,
          price: addon.price,
          image: addon.image,
          isPerDay: addon.isPerDay,
        };
      }),
    };

    setIsSubmitting(true);

    try {
      const response = await api.post("/api/reservations", payload);
      const createdReservation = response.data.data;

      const newBooking = {
        id: createdReservation.id,
        car: selectedCar,
        dates: activeSearch,
        pricing: {
          days: getDays(),
          carCost: getCarCost(),
          packageCost: getPackageCost(),
          addonsCost: getAddonsCost(),
          total: getTotalGross(),
        },
        package: selectedPackage,
        addons: selectedAddons.map(
          (id) => addons.find((a) => a.id === id).name,
        ),
        customer: {
          firstName,
          lastName,
          phone,
          email,
          notes,
          invoice: isInvoice ? { companyName, companyAddress, nip } : null,
        },
        status: createdReservation.status.toLowerCase(),
        paymentMethod: paymentMethod === "online" ? "online" : "pickup",
        paymentStatus:
          paymentMethod === "online"
            ? "awaiting_payment"
            : "payment_upon_pickup",
        date: new Date().toISOString().split("T")[0],
      };

      addBooking(newBooking);
      setCreatedBooking(newBooking);
      router.push(`/checkout?step=4&id=${newBooking.id}`);
    } catch (error) {
      console.error("Reservation creation failed:", error);
      const errMsg =
        error.response?.data?.message ||
        "Failed to create reservation. Please try again.";
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSimulatePayment = async () => {
    if (!createdBooking) return;

    try {
      const response = await api.post(
        `/api/reservations/${createdBooking.id}/checkout-session`,
      );
      const { url } = response.data.data;
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error("Failed to create checkout session:", error);
      alert(
        lang === "pl"
          ? "Nie udało się zainicjować płatności."
          : "Failed to initiate payment. Please try again.",
      );
    }
  };

  return (
    <div className="relative lg:pt-14 ">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808005_1px,transparent_1px),linear-gradient(to_bottom,#80808005_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16 relative z-10 animate-fade-in">
        {/* Steps Indicator */}
        <CheckoutSteps step={step} t={t} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Content */}
          <div className="lg:col-span-8">
            {step === 1 && (
              <CheckoutStep1
                activeSearch={activeSearch}
                loadingVehicles={loadingVehicles}
                availableVehicles={availableVehicles}
                getDays={getDays}
                handleSelectCar={handleSelectCar}
                t={t}
              />
            )}

            {step === 2 && selectedCar && (
              <CheckoutStep2
                packages={packages}
                selectedPackage={selectedPackage}
                setSelectedPackage={setSelectedPackage}
                addons={addons}
                selectedAddons={selectedAddons}
                handleToggleAddon={handleToggleAddon}
                t={t}
              />
            )}

            {step === 3 && selectedCar && (
              <CheckoutStep3
                firstName={firstName}
                setFirstName={setFirstName}
                lastName={lastName}
                setLastName={setLastName}
                phone={phone}
                setPhone={setPhone}
                email={email}
                setEmail={setEmail}
                notes={notes}
                setNotes={setNotes}
                isInvoice={isInvoice}
                setIsInvoice={setIsInvoice}
                companyName={companyName}
                setCompanyName={setCompanyName}
                companyAddress={companyAddress}
                setCompanyAddress={setCompanyAddress}
                nip={nip}
                setNip={setNip}
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
                consentPrivacy={consentPrivacy}
                setConsentPrivacy={setConsentPrivacy}
                consentTerms={consentTerms}
                setConsentTerms={setConsentTerms}
                consentData={consentData}
                setConsentData={setConsentData}
                consentMarketing={consentMarketing}
                setConsentMarketing={setConsentMarketing}
                isSubmitting={isSubmitting}
                handleSubmit={handleSaveDetails}
                t={t}
              />
            )}

            {step === 4 && createdBooking && (
              <CheckoutStep4
                createdBooking={createdBooking}
                paymentCompleted={paymentCompleted}
                handleSimulatePayment={handleSimulatePayment}
                t={t}
              />
            )}
          </div>

          {/* Sidebar Summary */}
          <div className="lg:col-span-4 lg:sticky lg:top-24">
            <CheckoutSummary
              activeSearch={activeSearch}
              selectedCar={selectedCar}
              selectedPackage={selectedPackage}
              selectedAddons={selectedAddons}
              addons={addons}
              getDays={getDays}
              getPackageCost={getPackageCost}
              getTotalGross={getTotalGross}
              t={t}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutFlow() {
  return (
    <React.Suspense
      fallback={
        <div className="text-center py-12">
          <p className="text-slate-500 font-bold">Ładowanie...</p>
        </div>
      }
    >
      <CheckoutFlowContent />
    </React.Suspense>
  );
}
