"use client";

import React from "react";
import { X } from "lucide-react";
import { useApp } from "@/app/context/AppContext";

export default function BookingDetailsModal({
  selectedBookingDetails,
  setSelectedBookingDetails,
  handleBookingConfirm,
  handleBookingCancel,
  handleBookingComplete, // Added: New prop for completing a booking
}) {
  const { t, lang } = useApp();

  if (!selectedBookingDetails) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toISOString().split("T")[0];
  };

  const calculateDays = (pickup, returnD) => {
    const start = new Date(pickup);
    const end = new Date(returnD);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(1, diffDays);
  };

  const days = calculateDays(
    selectedBookingDetails.pickupDate,
    selectedBookingDetails.returnDate,
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/65 backdrop-blur-sm p-4">
      <div className="w-full max-w-xl bg-white border border-slate-100 rounded-2xl p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto animate-scale-up">
        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
          <h3 className="text-base font-extrabold text-slate-800 uppercase tracking-wider">
            {t("manageBookingTitle")} {selectedBookingDetails.id}
          </h3>
          <button
            onClick={() => setSelectedBookingDetails(null)}
            className="p-2 hover:bg-slate-100 rounded transition"
          >
            <X className="w-4 h-4 text-slate-500" />
          </button>
        </div>

        <div className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-slate-50 rounded border border-slate-100">
              <p className="text-slate-400">{t("clientLabel")}</p>
              <p className="font-bold text-slate-800 mt-0.5">
                {selectedBookingDetails.customerFirstName}{" "}
                {selectedBookingDetails.customerLastName}
              </p>
              <p className="text-slate-500">
                {selectedBookingDetails.customerEmail}
              </p>
              <p className="text-slate-500">
                {selectedBookingDetails.phoneNumber}
              </p>
            </div>
            <div className="p-3 bg-slate-50 rounded border border-slate-100">
              <p className="text-slate-400">{t("vehicleLabel")}</p>
              <p className="font-bold text-slate-800 mt-0.5">
                {selectedBookingDetails.vehicle?.brand || "N/A"}{" "}
                {selectedBookingDetails.vehicle?.model || ""}
              </p>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded border border-slate-100 space-y-1">
            <p className="text-slate-400">{t("datesLabel")}</p>
            <p>
              {t("pickupLabel")}:{" "}
              <strong>{formatDate(selectedBookingDetails.pickupDate)}</strong>
            </p>
            <p>
              {t("returnLabel")}:{" "}
              <strong>{formatDate(selectedBookingDetails.returnDate)}</strong>
            </p>
            <p className="text-brand-red font-bold">
              {t("rentalDurationLabel")} {days}{" "}
              {days === 1 ? t("dayUnit") : t("daysUnit")}
            </p>
          </div>

          <div className="p-3 bg-slate-50 rounded border border-slate-100 flex justify-between items-center text-sm">
            <span className="text-slate-500 font-bold">
              {t("totalCostLabel")}
            </span>
            <strong className="text-brand-red text-base font-black">
              PLN {selectedBookingDetails.totalPrice}
            </strong>
          </div>

          <div className="border-t border-slate-100 pt-4 flex flex-col sm:flex-row justify-between items-center gap-3">
            <div className="flex items-center space-x-1">
              <span>{t("currentStatusLabel")}</span>
              <span className="font-extrabold text-slate-800 uppercase">
                {selectedBookingDetails.status}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
              {selectedBookingDetails.status !== "CONFIRMED" &&
                selectedBookingDetails.status !== "COMPLETED" &&
                selectedBookingDetails.status !== "CANCELLED" && (
                  <button
                    onClick={() => {
                      handleBookingConfirm(selectedBookingDetails.id);
                      setSelectedBookingDetails(null);
                    }}
                    className="flex-1 px-4 py-2 bg-green-700 hover:bg-green-600 text-white text-xs font-bold rounded transition"
                  >
                    {t("confirmBtn")}
                  </button>
                )}

              {selectedBookingDetails.status === "CONFIRMED" && (
                <button
                  onClick={() => {
                    handleBookingComplete(selectedBookingDetails.id);
                    setSelectedBookingDetails(null);
                  }}
                  className="flex-1 px-4 py-2 bg-blue-700 hover:bg-blue-600 text-white text-xs font-bold rounded transition"
                >
                  {t("completeBtn")}
                </button>
              )}

              {selectedBookingDetails.status !== "CANCELLED" &&
                selectedBookingDetails.status !== "COMPLETED" && (
                  <button
                    onClick={() => {
                      handleBookingCancel(selectedBookingDetails.id);
                      setSelectedBookingDetails(null);
                    }}
                    className="flex-1 px-4 py-2 bg-red-700 hover:bg-red-600 text-white text-xs font-bold rounded transition"
                  >
                    {t("cancelBtn")}
                  </button>
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
