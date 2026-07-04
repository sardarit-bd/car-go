"use client";

import SidebarCTA from "@/app/components/SidebarCTA";
import { useApp } from "@/app/context/AppContext";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import MyReservationsHeader from "@/app/components/reservations/MyReservationsHeader";
import MyReservationsSearchForm from "@/app/components/reservations/MyReservationsSearchForm";
import MyReservationsVoucher from "@/app/components/reservations/MyReservationsVoucher";
import MyReservationsResultsList from "@/app/components/reservations/MyReservationsResultsList";
import MyReservationsUserBookings from "@/app/components/reservations/MyReservationsUserBookings";
import MyReservationsHelpInfo from "@/app/components/reservations/MyReservationsHelpInfo";

const API_BASE = "${process.env.NEXT_PUBLIC_API_URL}";

function mapApiBookingToVoucherShape(item) {
  const pickupDate = new Date(item.pickupDate);
  const returnDate = new Date(item.returnDate);
  const days = Math.max(
    1,
    Math.round((returnDate.getTime() - pickupDate.getTime()) / (1000 * 60 * 60 * 24))
  );

  const carCost = item.vehicle?.pricePerDay
    ? parseFloat(item.vehicle.pricePerDay) * days
    : 0;
  const packageCost = item.packageData?.price ? parseFloat(item.packageData.price) : 0;
  const addonsCost = Array.isArray(item.addonsData)
    ? item.addonsData.reduce((sum, a) => sum + (parseFloat(a.price) || 0), 0)
    : 0;

  const total = item.totalPrice ? parseFloat(item.totalPrice) : carCost + packageCost + addonsCost;

  const fmtDate = (d) => d.toLocaleDateString("pl-PL");
  const fmtTime = (d) => d.toLocaleTimeString("pl-PL", { hour: "2-digit", minute: "2-digit" });

  return {
    id: item.id,
    status: item.status ? item.status.toLowerCase() : "pending",
    paymentStatus: "payment_upon_pickup",
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
      pickupLocation: item.pickupLocationId || "—",
      returnLocation: item.returnLocationId || "—",
    },
    car: {
      brand: item.vehicle?.brand || "",
      model: item.vehicle?.model || "",
      class: item.vehicle?.class || "—",
      transmission: item.vehicle?.transmission || "—",
      fuel: item.vehicle?.fuel || "—",
      deposit: item.vehicle?.deposit ?? "—",
    },
    package: {
      name: item.packageData?.name || "—",
    },
    pricing: {
      total,
      days,
      carCost,
      packageCost,
      addonsCost,
    },
  };
}

function MyReservationsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { lang, bookings, currentUser, t } = useApp();

  const [queryPhone, setQueryPhone] = useState("");
  const [queryEmail, setQueryEmail] = useState("");
  const [results, setResults] = useState([]);
  const [activeBooking, setActiveBooking] = useState(null);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const urlPhone = searchParams.get("phone");
  const urlEmail = searchParams.get("email");

  useEffect(() => {
    if (!urlPhone) return;

    setQueryPhone(urlPhone);
    setQueryEmail(urlEmail || "");
    setActiveBooking(null);
    setResults([]);
    setErrorMsg("");
    setLoading(true);
    setSearched(true);

    const fetchReservations = async () => {
      try {
        const res = await fetch(
          `${API_BASE}/api/reservations/check/${encodeURIComponent(urlPhone)}`
        );
        const json = await res.json();

        if (!json.success || !Array.isArray(json.data) || json.data.length === 0) {
          setErrorMsg(t("lookupNotFound"));
          setResults([]);
          return;
        }

        let matches = json.data;

        if (urlEmail) {
          const filtered = matches.filter(
            (r) => r.customerEmail?.toLowerCase() === urlEmail.toLowerCase().trim()
          );
          if (filtered.length > 0) matches = filtered;
        }

        const mapped = matches.map(mapApiBookingToVoucherShape);

        if (mapped.length === 1) {
          setActiveBooking(mapped[0]);
        } else {
          setResults(mapped);
        }
      } catch (err) {
        setErrorMsg(
          lang === "pl"
            ? "Nie udało się połączyć z serwerem. Spróbuj ponownie."
            : "Could not connect to the server. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, [urlPhone, urlEmail, lang, t]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!queryPhone.trim()) return;
    const params = new URLSearchParams();
    params.set("phone", queryPhone.trim());
    if (queryEmail.trim()) params.set("email", queryEmail.trim());
    router.push(`/my-reservations?${params.toString()}`);
  };

  const handlePrint = () => {
    window.print();
  };

  const resetSearch = () => {
    setSearched(false);
    setActiveBooking(null);
    setResults([]);
    router.push("/my-reservations");
  };

  const myBookings = currentUser
    ? bookings.filter((b) => b.customer.email.toLowerCase() === currentUser.email.toLowerCase())
    : [];

  return (
    <div className="relative">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808005_1px,transparent_1px),linear-gradient(to_bottom,#80808005_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 relative z-10">
        {/* Header */}
        <MyReservationsHeader t={t} lang={lang} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Sidebar */}
          <div className="lg:col-span-4 sticky top-36 hidden lg:block no-print">
            <SidebarCTA />
          </div>

          {/* Right Content */}
          <div className="lg:col-span-8 space-y-6 print:w-full print:col-span-12">
            {/* Voucher Display */}
            {searched && activeBooking ? (
              <MyReservationsVoucher
                activeBooking={activeBooking}
                onReset={resetSearch}
                onPrint={handlePrint}
                t={t}
                lang={lang}
              />
            ) : searched && results.length > 0 ? (
              /* Multiple Results */
              <MyReservationsResultsList
                results={results}
                onSelect={setActiveBooking}
                onReset={resetSearch}
                lang={lang}
              />
            ) : (
              /* Default View */
              <div className="space-y-6">
                <MyReservationsSearchForm
                  queryPhone={queryPhone}
                  setQueryPhone={setQueryPhone}
                  queryEmail={queryEmail}
                  setQueryEmail={setQueryEmail}
                  loading={loading}
                  errorMsg={errorMsg}
                  onSubmit={handleSearchSubmit}
                  t={t}
                  lang={lang}
                />

                <MyReservationsUserBookings
                  myBookings={myBookings}
                  currentUser={currentUser}
                  lang={lang}
                />

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
    <React.Suspense fallback={
      <div className="text-center py-12">
        <p className="text-slate-500 font-bold">Ładowanie / Loading...</p>
      </div>
    }>
      <MyReservationsContent />
    </React.Suspense>
  );
}