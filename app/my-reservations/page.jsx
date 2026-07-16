"use client";

import SidebarCTA from "@/app/components/SidebarCTA";
import { useApp } from "@/app/context/AppContext";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import MyReservationsHeader from "@/app/components/reservations/MyReservationsHeader";
import MyReservationsSearchForm from "@/app/components/reservations/MyReservationsSearchForm";
import MyReservationsVoucher from "@/app/components/reservations/MyReservationsVoucher";
import MyReservationsUserBookings from "@/app/components/reservations/MyReservationsUserBookings";
import MyReservationsHelpInfo from "@/app/components/reservations/MyReservationsHelpInfo";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

function mapApiBookingToVoucherShape(item) {
  const pickupDate = new Date(item.pickupDate);
  const returnDate = new Date(item.returnDate);
  const days = Math.max(
    1,
    Math.round(
      (returnDate.getTime() - pickupDate.getTime()) / (1000 * 60 * 60 * 24),
    ),
  );

  const carCost = item.vehicle?.pricePerDay
    ? parseFloat(item.vehicle.pricePerDay) * days
    : 0;
  const packageCost = item.packageData?.price
    ? parseFloat(item.packageData.price)
    : 0;
  const addonsCost = Array.isArray(item.addonsData)
    ? item.addonsData.reduce((sum, a) => sum + (parseFloat(a.price) || 0), 0)
    : 0;

  const total = item.totalPrice
    ? parseFloat(item.totalPrice)
    : carCost + packageCost + addonsCost;

  const fmtDate = (d) => d.toLocaleDateString("pl-PL");
  const fmtTime = (d) =>
    d.toLocaleTimeString("pl-PL", { hour: "2-digit", minute: "2-digit" });

  const addonsList =
    Array.isArray(item.addonsData) && item.addonsData.length > 0
      ? item.addonsData.map((a) => a.name).join(", ")
      : "Brak / None";

  // FIX: Properly extract location names from nested objects
  let pickupLocationName = "Do ustalenia / TBD";
  let returnLocationName = "Do ustalenia / TBD";

  if (item.pickupLocation) {
    if (typeof item.pickupLocation === "object" && item.pickupLocation.name) {
      pickupLocationName = item.pickupLocation.name;
    } else if (typeof item.pickupLocation === "string") {
      pickupLocationName = item.pickupLocation;
    } else if (item.pickupLocationId) {
      pickupLocationName = item.pickupLocationId;
    }
  }

  if (item.returnLocation) {
    if (typeof item.returnLocation === "object" && item.returnLocation.name) {
      returnLocationName = item.returnLocation.name;
    } else if (typeof item.returnLocation === "string") {
      returnLocationName = item.returnLocation;
    } else if (item.returnLocationId) {
      returnLocationName = item.returnLocationId;
    }
  }

  // FIX: ONLY use vehicle brand and model - NOT description
  const vehicleName =
    `${item.vehicle?.brand || ""} ${item.vehicle?.model || ""}`.trim();

  // FIX: Handle payment method properly
  const paymentStatus = (item.paymentStatus || "").toUpperCase();
  const paymentMethod =
    paymentStatus === "PAID" || paymentStatus === "PAID_ONLINE"
      ? "Online (Stripe)"
      : "Przy odbiorze / Upon Pickup";

  return {
    id: item.id,
    status: item.status ? item.status.toLowerCase() : "pending",
    paymentMethod: paymentMethod,
    customer: {
      firstName: item.customerFirstName,
      lastName: item.customerLastName,
      email: item.customerEmail,
      phone: item.phoneNumber,
    },
    dates: {
      pickupDate: fmtDate(pickupDate),
      pickupTime: fmtTime(pickupDate),
      returnDate: fmtDate(returnDate),
      returnTime: fmtTime(returnDate),
      pickupLocation: pickupLocationName,
      returnLocation: returnLocationName,
    },
    car: {
      name: vehicleName || "Pojazd / Vehicle",
    },
    package: {
      name: item.packageData?.name || "Podstawowy / Basic",
    },
    addons: addonsList,
    pricing: {
      total: total || 0,
      days,
      carCost: carCost || 0,
      packageCost: packageCost || 0,
      addonsCost: addonsCost || 0,
    },
  };
}
function MyReservationsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { lang, bookings, currentUser, t } = useApp();

  const [queryReservationNumber, setQueryReservationNumber] = useState("");
  const [activeBooking, setActiveBooking] = useState(null);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const urlReservationNumber = searchParams.get("reservationNumber");

  useEffect(() => {
    if (!urlReservationNumber) return;

    setQueryReservationNumber(urlReservationNumber);
    setActiveBooking(null);
    setErrorMsg("");
    setLoading(true);
    setSearched(true);

    const fetchReservation = async () => {
      try {
        console.log(
          `${API_BASE}/api/reservations/${encodeURIComponent(urlReservationNumber)}`,
        );
        const res = await fetch(
          `${API_BASE}/api/reservations/${encodeURIComponent(urlReservationNumber)}`,
        );
        const json = await res.json();
        console.log(json);
        if (!res.ok || !json.success || !json.data) {
          setErrorMsg(t("lookupNotFound"));
          return;
        }

        const mapped = mapApiBookingToVoucherShape(json.data);
        setActiveBooking(mapped);
      } catch (err) {
        setErrorMsg(
          lang === "pl"
            ? "Nie udało się połączyć z serwerem. Spróbuj ponownie."
            : "Could not connect to the server. Please try again.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchReservation();
  }, [urlReservationNumber, lang, t]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    console.log(queryReservationNumber);
    if (!queryReservationNumber.trim()) return;
    const params = new URLSearchParams();
    params.set("reservationNumber", queryReservationNumber.trim());
    router.push(`/my-reservations?${params.toString()}`);
  };

  const handlePrint = () => {
    window.print();
  };

  const resetSearch = () => {
    setSearched(false);
    setActiveBooking(null);
    setQueryReservationNumber("");
    router.push("/my-reservations");
  };

  const isLoggedIn = !!currentUser;

  return (
    <div className="relative">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808005_1px,transparent_1px),linear-gradient(to_bottom,#80808005_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16 relative z-10">
        <MyReservationsHeader t={t} lang={lang} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-4 sticky top-36 hidden lg:block no-print">
            <SidebarCTA />
          </div>

          <div className="lg:col-span-8 space-y-6 print:w-full print:col-span-12">
            {searched && activeBooking ? (
              <MyReservationsVoucher
                activeBooking={activeBooking}
                onReset={resetSearch}
                onPrint={handlePrint}
                isLoggedIn={isLoggedIn}
                t={t}
                lang={lang}
              />
            ) : (
              <div className="space-y-6">
                <MyReservationsSearchForm
                  queryReservationNumber={queryReservationNumber}
                  setQueryReservationNumber={setQueryReservationNumber}
                  loading={loading}
                  errorMsg={errorMsg}
                  onSubmit={handleSearchSubmit}
                  t={t}
                  lang={lang}
                />

                {isLoggedIn && (
                  <MyReservationsUserBookings
                    myBookings={bookings.filter(
                      (b) =>
                        b.customer.email.toLowerCase() ===
                        currentUser.email.toLowerCase(),
                    )}
                    currentUser={currentUser}
                    lang={lang}
                  />
                )}

                <MyReservationsHelpInfo />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MyReservations() {
  return (
    <React.Suspense
      fallback={
        <div className="text-center py-12">
          <p className="text-slate-500 font-bold">Ładowanie / Loading...</p>
        </div>
      }
    >
      <MyReservationsContent />
    </React.Suspense>
  );
}
