"use client";

import React, { useState, useEffect } from "react";
import api from "@/lib/axios";
import { Filter, X } from "lucide-react";

export default function BookingsTab({ setSelectedBookingDetails }) {
  const [bookings, setBookings] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  
  // Filter states
  const [filters, setFilters] = useState({
    status: "",
    pickupDateFrom: "",
    pickupDateTo: "",
    returnDateFrom: "",
    returnDateTo: "",
  });
  const [showFilters, setShowFilters] = useState(false);

  const fetchBookings = async (page = 1, limit = 10, filterParams = {}) => {
    try {
      setLoading(true);
      
      // Build query params
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      // Add filters if they exist
      Object.keys(filterParams).forEach((key) => {
        if (filterParams[key]) {
          params.append(key, filterParams[key]);
        }
      });

      const response = await api.get(`/api/reservations?${params.toString()}`);
      const backendData = response.data.data;
      
      setBookings(backendData.data);
      setPagination(backendData.pagination);
    } catch (error) {
      console.error("Failed to fetch bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch when page changes
  useEffect(() => {
    fetchBookings(pagination.page, pagination.limit, filters);
  }, [pagination.page]);

  // Initial fetch
  useEffect(() => {
    fetchBookings(1, pagination.limit, filters);
  }, []);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination((prev) => ({ ...prev, page: newPage }));
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => {
    setPagination((prev) => ({ ...prev, page: 1 })); // Reset to page 1
    fetchBookings(1, pagination.limit, filters);
    setShowFilters(false);
  };

  const clearFilters = () => {
    setFilters({
      status: "",
      pickupDateFrom: "",
      pickupDateTo: "",
      returnDateFrom: "",
      returnDateTo: "",
    });
    setPagination((prev) => ({ ...prev, page: 1 }));
    fetchBookings(1, pagination.limit, {});
  };

  const hasActiveFilters = Object.values(filters).some((value) => value !== "");

  const formatDate = (dateString) => {
    return new Date(dateString).toISOString().split("T")[0];
  };

  const getStatusColor = (status) => {
    const statusLower = status.toLowerCase();
    if (statusLower === "confirmed") return "bg-green-700";
    if (statusLower === "cancelled") return "bg-red-700";
    return "bg-yellow-600";
  };

  return (
    <div className="glass-panel p-6 rounded-2xl space-y-5">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-3">
        <h2 className="text-base font-extrabold text-slate-800 uppercase tracking-wider">
          Lista Rezerwacji / Bookings Database ({pagination.total})
        </h2>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center space-x-2 ${
            hasActiveFilters
              ? "bg-brand-red text-white"
              : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
          }`}
        >
          <Filter className="w-4 h-4" />
          <span>{hasActiveFilters ? "Filtry Aktywne" : "Filtry"}</span>
        </button>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-4 animate-fade-in">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-extrabold text-slate-800 uppercase">
              Filtruj Rezerwacje
            </h3>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-xs text-brand-red font-bold hover:underline flex items-center space-x-1"
              >
                <X className="w-3 h-3" />
                <span>Wyczyść filtry</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Status Filter */}
            <div>
              <label className="block mb-1.5 text-xs font-bold text-slate-600">
                Status
              </label>
              <select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded text-xs text-slate-800 focus:outline-none focus:border-brand-red"
              >
                <option value="">Wszystkie statusy</option>
                <option value="PENDING">Oczekująca (Pending)</option>
                <option value="CONFIRMED">Potwierdzona (Confirmed)</option>
                <option value="CANCELLED">Anulowana (Cancelled)</option>
              </select>
            </div>

            {/* Pickup Date From */}
            <div>
              <label className="block mb-1.5 text-xs font-bold text-slate-600">
                Od daty odbioru
              </label>
              <input
                type="date"
                name="pickupDateFrom"
                value={filters.pickupDateFrom}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded text-xs text-slate-800 focus:outline-none focus:border-brand-red"
              />
            </div>

            {/* Pickup Date To */}
            <div>
              <label className="block mb-1.5 text-xs font-bold text-slate-600">
                Do daty odbioru
              </label>
              <input
                type="date"
                name="pickupDateTo"
                value={filters.pickupDateTo}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded text-xs text-slate-800 focus:outline-none focus:border-brand-red"
              />
            </div>

            {/* Return Date From */}
            <div>
              <label className="block mb-1.5 text-xs font-bold text-slate-600">
                Od daty zwrotu
              </label>
              <input
                type="date"
                name="returnDateFrom"
                value={filters.returnDateFrom}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded text-xs text-slate-800 focus:outline-none focus:border-brand-red"
              />
            </div>

            {/* Return Date To */}
            <div>
              <label className="block mb-1.5 text-xs font-bold text-slate-600">
                Do daty zwrotu
              </label>
              <input
                type="date"
                name="returnDateTo"
                value={filters.returnDateTo}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded text-xs text-slate-800 focus:outline-none focus:border-brand-red"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <button
              onClick={() => setShowFilters(false)}
              className="px-4 py-2 bg-white border border-slate-200 rounded text-xs font-bold text-slate-600 hover:bg-slate-50 transition"
            >
              Anuluj
            </button>
            <button
              onClick={applyFilters}
              className="px-4 py-2 bg-brand-red hover:bg-brand-red-hover text-white text-xs font-bold rounded transition"
            >
              Zastosuj Filtry
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-8 text-slate-400">Ładowanie...</div>
      ) : (
        <>
          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px]">
                  <th className="pb-3">Nr Rezerwacji</th>
                  <th className="pb-3">Klient</th>
                  <th className="pb-3">Okres Najmu</th>
                  <th className="pb-3">Pojazd</th>
                  <th className="pb-3">Koszt</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Opcje</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600 font-semibold">
                {bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/50 transition">
                    <td className="py-3.5 font-mono text-slate-800 font-extrabold">
                      {b.id}
                    </td>
                    <td className="py-3.5">
                      {b.customerFirstName} {b.customerLastName}
                    </td>
                    <td className="py-3.5">
                      {formatDate(b.pickupDate)} - {formatDate(b.returnDate)}
                    </td>
                    <td className="py-3.5">
                      {b.vehicle?.brand} {b.vehicle?.model}
                    </td>
                    <td className="py-3.5 text-brand-red">
                      PLN {b.totalPrice}
                    </td>
                    <td className="py-3.5">
                      <span
                        className={`px-2 py-0.5 rounded text-[9px] uppercase text-white font-bold ${getStatusColor(
                          b.status
                        )}`}
                      >
                        {b.status}
                      </span>
                    </td>
                    <td className="py-3.5 text-right">
                      <button
                        onClick={() => setSelectedBookingDetails(b)}
                        className="px-2.5 py-1 bg-white text-slate-600 border border-slate-200 rounded hover:border-slate-300 transition text-[10px]"
                      >
                        Zarządzaj
                      </button>
                    </td>
                  </tr>
                ))}
                {bookings.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-slate-400">
                      {hasActiveFilters
                        ? "Brak wyników dla wybranych filtrów."
                        : "Brak zgłoszonych rezerwacji."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center justify-between border-t border-slate-100 pt-4">
            <div className="text-xs text-slate-500 font-semibold">
              Strona {pagination.page} z {pagination.totalPages} (Łącznie:{" "}
              {pagination.total})
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="px-3 py-1.5 bg-white border border-slate-200 rounded text-xs font-bold text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
              >
                Poprzednia
              </button>
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages}
                className="px-3 py-1.5 bg-white border border-slate-200 rounded text-xs font-bold text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
              >
                Następna
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}