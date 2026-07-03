"use client";

import React, { useState, useEffect } from "react";
import api from "@/lib/axios";

export default function BookingsTab({ setSelectedBookingDetails }) {
  const [bookings, setBookings] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchBookings = async (page = 1, limit = 10) => {
    try {
      setLoading(true);
      const response = await api.get(`/api/reservations?page=${page}&limit=${limit}`);
      const backendData = response.data.data;
      
      setBookings(backendData.data);
      setPagination(backendData.pagination);
    } catch (error) {
      console.error("Failed to fetch bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings(pagination.page, pagination.limit);
  }, [pagination.page]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination((prev) => ({ ...prev, page: newPage }));
    }
  };

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
      <h2 className="text-base font-extrabold text-slate-800 border-b border-slate-100 pb-3 uppercase tracking-wider">
        Lista Rezerwacji / Bookings Database ({pagination.total})
      </h2>

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
                      Brak zgłoszonych rezerwacji.
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