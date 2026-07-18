"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/app/context/AppContext";
import { Shield, LogOut } from "lucide-react";

// Import admin components
import AdminSidebar from "@/app/components/admin/AdminSidebar";
import BookingsTab from "@/app/components/admin/BookingsTab";
import FleetTab from "@/app/components/admin/FleetTab";
import LocationsTab from "@/app/components/admin/LocationsTab";
import ReviewsTab from "@/app/components/admin/ReviewsTab";
import ContentTab from "@/app/components/admin/ContentTab";
import CmsTab from "@/app/components/admin/CmsTab"; //
// import EmailsTab from "@/app/components/admin/EmailsTab";
import BookingDetailsModal from "@/app/components/admin/BookingDetailsModal";
import AddonsTab from "@/app/components/admin/AddonsTab";
import PackagesTab from "@/app/components/admin/PackagesTab";
import BlogTab from "@/app/components/admin/BlogTab";
import ContactTab from "@/app/components/admin/ContactTab";
import axios from "axios";
import api from "@/lib/axios";
export default function AdminDashboard() {
  const router = useRouter();
  const {
    lang,
    adminUser,
    logoutAdmin,
    updateBookingStatus,
    isOwner: checkIsOwner,
  } = useApp();

  const [activeTab, setActiveTab] = useState("bookings");
  const [selectedBookingDetails, setSelectedBookingDetails] = useState(null);

  // useEffect(() => {
  //   if (!adminUser) {
  //     router.push("/account/login");
  //   }
  // }, [adminUser, router]);

  // if (!adminUser) {
  //   return (
  //     <div className="text-center py-20 text-slate-500 font-bold">
  //       Przekierowanie do logowania / Redirecting to login...
  //     </div>
  //   );
  // }

  const isOwner = adminUser?.role === "owner";

  const handleBookingConfirm = async (id) => {
    await updateBookingStatus(id, "confirmed");
    alert("Rezerwacja zatwierdzona!");
  };

  const handleBookingCancel = async (id) => {
    await updateBookingStatus(id, "cancelled");
    alert("Rezerwacja anulowana!");
  };
  const handleBookingComplete = async (bookingId) => {
    try {
      // axios.patch(`/api/reservations/${bookingId}/status`, {
      //   status: "COMPLETED",
      // });
      http: await api.patch(`/api/reservations/${bookingId}/status`, {
        status: "COMPLETED",
      });
    } catch (error) {
      console.error("Failed to complete booking:", error);
    }
  };
  return (
    <div className="container mx-auto px-4 sm:px-6 space-y-8 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 pb-6 gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-brand-red/10 border border-brand-red/30 rounded-xl text-brand-red">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-800 uppercase">
              Panel Zarządzania CMS
            </h1>
            <p className="text-xs text-slate-500">
              Autoryzowana rola:{" "}
              <strong className="text-brand-red uppercase">
                {adminUser?.role === "owner"
                  ? "Właściciel / Owner"
                  : "Pracownik / Employee"}
              </strong>
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            logoutAdmin();
            router.push("/account/login");
          }}
          className="px-5 py-2 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 text-xs font-bold rounded-lg text-slate-600 transition flex items-center space-x-1.5"
        >
          <LogOut className="w-4 h-4" />
          <span>WYLOGUJ / LOGOUT</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <AdminSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          adminUser={adminUser}
          logoutAdmin={logoutAdmin}
          router={router}
        />

        <div className="lg:col-span-9 space-y-6">
          {activeTab === "bookings" && (
            <BookingsTab
              setSelectedBookingDetails={setSelectedBookingDetails}
            />
          )}

          {activeTab === "fleet" && <FleetTab />}
          {activeTab === "locations" && <LocationsTab />}
          {activeTab === "reviews" && <ReviewsTab />}
          {activeTab === "cms" && <CmsTab />}
          {activeTab === "addons" && <AddonsTab />}
          {activeTab === "packages" && <PackagesTab />}
          {activeTab === "blog" && <BlogTab />}
          {activeTab === "contact" && <ContactTab />}
          {/* {activeTab === "emails" && <EmailsTab />} */}
        </div>
      </div>

      <BookingDetailsModal
        selectedBookingDetails={selectedBookingDetails}
        setSelectedBookingDetails={setSelectedBookingDetails}
        handleBookingConfirm={handleBookingConfirm}
        handleBookingCancel={handleBookingCancel}
        handleBookingComplete={handleBookingComplete}
      />
    </div>
  );
}
