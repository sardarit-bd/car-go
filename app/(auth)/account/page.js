"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/app/context/AppContext";
import { Phone, Eye, Download, CheckCircle } from "lucide-react";

export default function CustomerPanel() {
  const router = useRouter();
  const {
    lang,
    currentUser,
    bookings,
    updateProfile,
    addReview,
    logoutUser,
    t,
  } = useApp();
  console.log(bookings);
  const [phone, setPhone] = useState(currentUser?.phone || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Reviews state
  const [reviewCar, setReviewCar] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState("");

  // Modals state
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  const myBookings = bookings.filter((b) => {
    console.log(b?.customer?.email);
    const isSameUser =
      b?.customer?.email?.toLowerCase() === currentUser?.email?.toLowerCase();
    const isConfirmed = b?.status?.toLowerCase() === "confirmed";

    if (isSameUser) {
      console.log("Found booking for user:", {
        id: b.id,
        status: b.status,
        isConfirmed: isConfirmed,
        email: b.customer.email,
      });
    }

    return isSameUser && isConfirmed;
  });

  // Extract unique cars from confirmed bookings for the review dropdown
  const bookedCars = myBookings.map((b) => `${b.car.brand} ${b.car.model}`);
  const uniqueBookedCars = [...new Set(bookedCars)];

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    setSaveSuccess(false);

    if (password && password !== confirmPassword) {
      alert(t("passwordsMismatch"));
      return;
    }

    updateProfile(phone, password || null);
    setSaveSuccess(true);
    setPassword("");
    setConfirmPassword("");

    setTimeout(() => {
      setSaveSuccess(false);
    }, 4000);
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (reviewText.trim() && reviewCar) {
      addReview({
        id: "rev_" + Math.random().toString(36).substr(2, 9),
        name: currentUser?.firstName || currentUser?.email,
        rating: reviewRating,
        car: reviewCar,
        text: reviewText,
        date: new Date().toISOString().split("T")[0],
        approved: false, // awaits admin moderation
      });

      setReviewSuccess(true);
      setReviewText("");
      setReviewCar("");
      setTimeout(() => {
        setReviewSuccess(false);
      }, 4000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (!currentUser) {
    return null; // Or redirect to login
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-12 animate-fade-in print:bg-white print:text-black">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 pb-6 gap-4 print:hidden">
        <div>
          <h1 className="text-3xl font-black text-slate-800 uppercase">
            {t("navMyAccount")}
          </h1>
          <p className="text-xs text-slate-500">
            {lang === "pl"
              ? "Zarządzaj swoimi danymi kontaktowymi, historią rezerwacji i dodawaj opinie."
              : "Manage your contact details, booking history, and submit reviews."}
          </p>
        </div>
        <button
          onClick={() => {
            logoutUser();
            router.push("/");
          }}
          className="px-5 py-2 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 text-xs font-bold rounded-lg text-slate-600 transition"
        >
          {t("navLogout")}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 print:block">
        {/* Left Side: Profile Information Form */}
        <div className="lg:col-span-5 space-y-6 print:hidden">
          <div className="glass-panel p-6 rounded-2xl space-y-5">
            <h2 className="text-base font-extrabold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2.5">
              {t("profileInfoTitle")}
            </h2>

            {saveSuccess && (
              <div className="p-3 bg-green-950/20 border border-green-800/30 text-green-500 text-xs font-bold rounded-lg flex items-center space-x-2">
                <CheckCircle className="w-4 h-4" />
                <span>{t("profileUpdateSuccess")}</span>
              </div>
            )}

            <form
              onSubmit={handleUpdateProfile}
              className="space-y-4 text-xs font-bold text-slate-500"
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1.5">{t("firstName")}</label>
                  <input
                    type="text"
                    disabled
                    value={currentUser?.firstName || ""}
                    className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded text-slate-400 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block mb-1.5">{t("lastName")}</label>
                  <input
                    type="text"
                    disabled
                    value={currentUser?.lastName || ""}
                    className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded text-slate-400 cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1.5">{t("email")} (Login)</label>
                <input
                  type="email"
                  disabled
                  value={currentUser?.email || ""}
                  className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded text-slate-400 cursor-not-allowed font-mono"
                />
              </div>

              <div>
                <label className="block mb-1.5 flex items-center space-x-1">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{t("phone")}</span>
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 focus:border-brand-red text-slate-800 rounded focus:outline-none"
                />
              </div>

              <div className="border-t border-slate-100 pt-4 mt-2 space-y-3">
                <p className="text-[10px] text-slate-400 uppercase font-extrabold tracking-wider">
                  {t("changePasswordTitle")}
                </p>
                <div>
                  <input
                    type="password"
                    placeholder={t("newPasswordPlaceholder")}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 focus:border-brand-red text-slate-800 rounded text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <input
                    type="password"
                    placeholder={t("confirmPasswordPlaceholder")}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 focus:border-brand-red text-slate-800 rounded text-xs focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-brand-red hover:bg-brand-red-hover text-white text-xs font-extrabold rounded transition shadow"
              >
                {t("saveChangesBtn")}
              </button>
            </form>
          </div>
        </div>

        {/* Right Side: Reservation History */}
        <div className="lg:col-span-7 space-y-6 print:w-full">
          {/* Reservation List */}
          <div className="glass-panel p-6 rounded-2xl space-y-5 print:border-none print:bg-white print:text-black">
            <h2 className="text-base font-extrabold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2.5 print:text-black print:border-black">
              {t("bookingsHistoryTitle")}
            </h2>

            {myBookings.length > 0 ? (
              <div className="space-y-4 print:space-y-6">
                {myBookings.map((b) => {
                  const statusColors = {
                    awaiting_confirmation: "bg-yellow-600 text-white",
                    confirmed: "bg-green-700 text-white",
                    cancelled: "bg-red-700 text-white",
                  };

                  const payColors = {
                    paid_online: "text-green-600",
                    payment_upon_pickup: "text-blue-600",
                    awaiting_payment: "text-yellow-600",
                  };

                  return (
                    <div
                      key={b.id}
                      className="p-4 bg-slate-50 border border-slate-200/60 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 print:border-black print:bg-white"
                    >
                      <div className="space-y-1 text-xs font-semibold">
                        <div className="flex items-center space-x-2">
                          <span className="font-mono text-sm font-extrabold text-slate-800 print:text-black">
                            {b.id}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${statusColors[b.status] || "bg-slate-400"}`}
                          >
                            {b.status === "confirmed"
                              ? t("statusConfirmed")
                              : b.status === "cancelled"
                                ? t("statusCancelled")
                                : t("statusAwaiting")}
                          </span>
                        </div>
                        <p className="text-slate-500 print:text-black">
                          {b.dates.pickupDate} - {b.dates.returnDate} |{" "}
                          <strong className="text-slate-800 print:text-black">
                            {b.car.brand} {b.car.model}
                          </strong>
                        </p>
                        <p className="text-[10px] text-slate-400 flex items-center space-x-1">
                          <span>{t("paymentStatusLabel")}</span>
                          <strong
                            className={
                              payColors[b.paymentStatus] || "text-slate-600"
                            }
                          >
                            {b.paymentStatus === "paid_online"
                              ? t("payStatusPaid")
                              : b.paymentStatus === "payment_upon_pickup"
                                ? t("payStatusPickup")
                                : t("payStatusAwaiting")}
                          </strong>
                        </p>
                      </div>

                      <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto text-xs font-bold gap-2 print:hidden">
                        <span className="text-slate-800 text-sm font-extrabold">
                          {b.pricing.total === "Individual Price"
                            ? t("individualPriceText")
                            : `PLN ${b.pricing.total.toFixed(2)}`}
                        </span>
                        <button
                          onClick={() => setSelectedBooking(b)}
                          className="px-3.5 py-1.5 bg-white border border-slate-200 hover:border-slate-300 text-[10px] text-slate-600 rounded transition flex items-center space-x-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>{t("detailsBtn")}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-8 border border-slate-200 rounded-xl bg-slate-50/50 text-center text-xs text-slate-500">
                {t("noBookingsMessage")}
              </div>
            )}
          </div>

          {/* Add Review Panel */}
          <div className="glass-panel p-6 rounded-2xl space-y-5 print:hidden">
            <h2 className="text-base font-extrabold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2.5">
              {t("submitReviewTitle")}
            </h2>

            {reviewSuccess && (
              <div className="p-3 bg-green-950/20 border border-green-800/30 text-green-500 text-xs font-bold rounded-lg flex items-center space-x-2">
                <CheckCircle className="w-4 h-4" />
                <span>{t("reviewSuccessMessage")}</span>
              </div>
            )}

            <form
              onSubmit={handleSubmitReview}
              className="space-y-4 text-xs font-bold text-slate-500"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1.5">
                    {t("selectVehicleLabel")} *
                  </label>
                  {uniqueBookedCars.length > 0 ? (
                    <select
                      value={reviewCar}
                      onChange={(e) => setReviewCar(e.target.value)}
                      className="w-full bg-white border border-slate-200 text-slate-800 px-3 py-2 rounded focus:outline-none"
                      required
                    >
                      <option value="">{t("selectVehiclePlaceholder")}</option>
                      {uniqueBookedCars.map((carName, idx) => (
                        <option key={idx} value={carName}>
                          {carName}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded text-yellow-800 text-xs font-semibold">
                      {t("noVehiclesToReview")}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block mb-1.5">{t("ratingLabel")} *</label>
                  <select
                    value={reviewRating}
                    onChange={(e) => setReviewRating(parseInt(e.target.value))}
                    className="w-full bg-white border border-slate-200 text-slate-800 px-3 py-2 rounded focus:outline-none text-yellow-500"
                    required
                  >
                    <option value={5}>★★★★★ (5/5)</option>
                    <option value={4}>★★★★☆ (4/5)</option>
                    <option value={3}>★★★☆☆ (3/5)</option>
                    <option value={2}>★★☆☆☆ (2/5)</option>
                    <option value={1}>★☆☆☆☆ (1/5)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block mb-1.5">{t("reviewTextLabel")} *</label>
                <textarea
                  rows={4}
                  required
                  placeholder={t("reviewPlaceholder")}
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 focus:border-brand-red text-slate-800 text-xs rounded focus:outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={uniqueBookedCars.length === 0}
                className="w-full py-2.5 bg-brand-red hover:bg-brand-red-hover text-white text-xs font-extrabold rounded transition shadow disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t("submitReviewBtn")}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Details Modal (Printable) */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/65 backdrop-blur-sm p-4 print:relative print:bg-white print:text-black print:inset-0 print:p-0">
          <div className="w-full max-w-2xl bg-white border border-slate-100 rounded-2xl p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto animate-scale-up print:border-none print:bg-white print:text-black print:max-h-full print:shadow-none print:p-0">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4 print:hidden">
              <h3 className="text-base font-extrabold text-slate-800 uppercase tracking-wider">
                {t("bookingDetailsTitle")}
              </h3>
              <button
                onClick={() => setSelectedBooking(null)}
                className="px-3 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-100 rounded text-[10px] text-slate-500 hover:text-slate-800"
              >
                {t("closeBtn")}
              </button>
            </div>

            {/* Print Layout details block */}
            <div className="space-y-6 text-sm text-slate-600 print:text-black">
              <div className="flex justify-between items-baseline border-b border-slate-100 pb-4">
                <div>
                  <h4 className="text-xl font-black text-slate-800 font-mono print:text-black">
                    {selectedBooking.id}
                  </h4>
                  <p className="text-xs text-slate-500">
                    {t("bookingDateLabel")} {selectedBooking.date}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">
                    {t("statusLabel")}
                  </span>
                  <p className="font-extrabold text-brand-red print:text-black">
                    {selectedBooking.status === "confirmed"
                      ? t("confirmedStatus")
                      : selectedBooking.status === "cancelled"
                        ? t("cancelledStatus")
                        : t("awaitingStatus")}
                  </p>
                </div>
              </div>

              {/* Rented Car details */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5 p-3.5 bg-slate-50/50 border border-slate-100 rounded-xl print:border-black">
                  <h5 className="text-xs text-slate-400 uppercase font-bold">
                    {t("vehicleLabel")}
                  </h5>
                  <p className="font-extrabold text-slate-800 print:text-black">
                    {selectedBooking.car.brand} {selectedBooking.car.model}
                  </p>
                  <p className="text-xs text-slate-500">
                    {t("classLabel")}: {selectedBooking.car.class} |{" "}
                    {t("fuelLabel")}: {selectedBooking.car.fuel}
                  </p>
                </div>
                <div className="space-y-1.5 p-3.5 bg-slate-50/50 border border-slate-100 rounded-xl print:border-black">
                  <h5 className="text-xs text-slate-400 uppercase font-bold">
                    {t("protectionPackageLabel")}
                  </h5>
                  <p className="font-extrabold text-slate-800 print:text-black">
                    {selectedBooking.package?.name?.split(" / ")[0] || "N/A"}
                  </p>
                  <p className="text-xs text-slate-500">
                    {t("priceLabel")}: +PLN{" "}
                    {selectedBooking.pricing.packageCost}
                  </p>
                </div>
              </div>

              {/* Rental periods and locations */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-100 pt-4">
                <div className="space-y-1.5">
                  <h5 className="text-xs text-slate-400 uppercase font-bold">
                    {t("datesLabel")}
                  </h5>
                  <p>
                    {t("pickupLabel")}:{" "}
                    <strong className="text-slate-800 print:text-black">
                      {selectedBooking.dates.pickupDate}
                    </strong>{" "}
                    {t("timeLabel")} {selectedBooking.dates.pickupTime}
                  </p>
                  <p>
                    {t("returnLabel")}:{" "}
                    <strong className="text-slate-800 print:text-black">
                      {selectedBooking.dates.returnDate}
                    </strong>{" "}
                    {t("timeLabel")} {selectedBooking.dates.returnTime}
                  </p>
                  <p className="text-xs text-slate-500">
                    {t("rentalDaysLabel")}: {selectedBooking.pricing.days} d.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <h5 className="text-xs text-slate-400 uppercase font-bold">
                    {t("locationsLabel")}
                  </h5>
                  <p>
                    {t("pickupPointLabel")}:{" "}
                    <strong className="text-slate-800 print:text-black">
                      {selectedBooking.dates.pickupLocation}
                    </strong>
                  </p>
                  <p>
                    {t("returnPointLabel")}:{" "}
                    <strong className="text-slate-800 print:text-black">
                      {selectedBooking.dates.returnLocation}
                    </strong>
                  </p>
                </div>
              </div>

              {/* Addons selected */}
              {selectedBooking.addons?.length > 0 && (
                <div className="border-t border-slate-100 pt-4 space-y-1.5">
                  <h5 className="text-xs text-slate-400 uppercase font-bold">
                    {t("extrasLabel")}
                  </h5>
                  <ul className="list-disc pl-5 text-xs text-slate-600 space-y-0.5 print:text-black">
                    {selectedBooking.addons.map((addName, idx) => (
                      <li key={idx}>{addName.split(" / ")[0]}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Pricing overview */}
              <div className="border-t border-slate-100 pt-4 space-y-3.5">
                <h5 className="text-xs text-slate-400 uppercase font-bold">
                  {t("pricingBreakdownLabel")}
                </h5>
                <div className="text-xs font-semibold text-slate-500 space-y-1 text-left">
                  <div className="flex justify-between">
                    <span>
                      {t("carRentalLabel")} ({selectedBooking.pricing.days}{" "}
                      {t("daysUnit")}):
                    </span>
                    <span className="text-slate-800 print:text-black">
                      PLN {selectedBooking.pricing.carCost.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t("protectionPackageCostLabel")}:</span>
                    <span className="text-slate-800 print:text-black">
                      PLN {selectedBooking.pricing.packageCost.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t("addonsCostLabel")}:</span>
                    <span className="text-slate-800 print:text-black">
                      PLN {selectedBooking.pricing.addonsCost.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between text-base font-black text-slate-800 pt-2.5 border-t border-slate-100 print:text-black print:border-black">
                    <span>{t("totalGrossCostLabel")}:</span>
                    <span className="text-brand-red print:text-black">
                      {selectedBooking.pricing.total === "Individual Price"
                        ? t("individualPriceText")
                        : `PLN ${selectedBooking.pricing.total.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="text-right text-[10px] text-slate-400">
                    {t("depositLabel")}: PLN {selectedBooking.car.deposit}
                  </div>
                </div>
              </div>
            </div>

            {/* Print and Download Actions */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100 print:hidden">
              <button
                onClick={handlePrint}
                className="px-5 py-2 bg-brand-red hover:bg-brand-red-hover text-white text-xs font-bold rounded-lg flex items-center space-x-1.5 shadow"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{t("printConfirmationBtn")}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
