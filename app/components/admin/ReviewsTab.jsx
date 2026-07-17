"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/app/context/AppContext";
import {
  ShieldAlert,
  Trash2,
  Star,
  CheckCircle,
  XCircle,
  Clock,
  Filter,
} from "lucide-react";
import api from "@/lib/axios";

export default function ReviewsTab() {
  const { isOwner } = useApp();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });

  // Fetch reviews from backend
  const fetchReviews = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.page,
        limit: 20,
      };
      if (filterStatus !== "ALL") {
        params.status = filterStatus;
      }

      const response = await api.get("/api/reviews/admin", { params });

      // Handle different backend response structures
      const data = response.data.data || response.data;
      const reviewList = Array.isArray(data) ? data : data.reviews || [];

      setReviews(reviewList);

      // Update pagination if backend returns it
      if (data.totalPages)
        setPagination((prev) => ({ ...prev, totalPages: data.totalPages }));
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
      alert("Błąd ładowania opinii", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [filterStatus, pagination.page]);

  const handleStatusUpdate = async (reviewId, newStatus) => {
    const actionText =
      newStatus === "APPROVED"
        ? "zatwierdzić"
        : newStatus === "REJECTED"
          ? "odrzucić"
          : "przywrócić do oczekujących";
    if (!confirm(`Czy na pewno chcesz ${actionText} tę opinię?`)) {
      return;
    }

    try {
      await api.patch(`/api/reviews/${reviewId}/status`, {
        status: newStatus,
      });
      await fetchReviews(); // Refresh list
    } catch (error) {
      console.error("Failed to update status:", error);
      alert(
        "Błąd aktualizacji statusu: " +
          (error.response?.data?.message || "Spróbuj ponownie"),
      );
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!confirm("Czy na pewno chcesz trwale usunąć tę opinię?")) {
      return;
    }

    try {
      await api.delete(`/api/reviews/${reviewId}`);
      await fetchReviews(); // Refresh list
    } catch (error) {
      console.error("Failed to delete review:", error);
      alert("Błąd usuwania opinii");
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      PENDING: {
        color: "bg-yellow-100 text-yellow-800 border-yellow-300",
        icon: Clock,
        label: "Oczekuje",
      },
      APPROVED: {
        color: "bg-green-100 text-green-800 border-green-300",
        icon: CheckCircle,
        label: "Zatwierdzona",
      },
      REJECTED: {
        color: "bg-red-100 text-red-800 border-red-300",
        icon: XCircle,
        label: "Odrzucona",
      },
    };
    const badge = badges[status] || badges.PENDING;
    const Icon = badge.icon;
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${badge.color}`}
      >
        <Icon className="w-3 h-3" />
        {badge.label}
      </span>
    );
  };

  const renderStars = (rating) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-3.5 h-3.5 ${star <= rating ? "text-yellow-400 fill-yellow-400" : "text-slate-300"}`}
          />
        ))}
      </div>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Brak daty";
    return new Date(dateString).toLocaleDateString("pl-PL", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (!isOwner) {
    return (
      <div className="p-6 border border-brand-red/30 bg-brand-red/5 text-brand-red rounded-xl flex items-center space-x-2 text-sm font-bold">
        <ShieldAlert className="w-5 h-5 flex-shrink-0" />
        <span>
          Brak uprawnień. Sekcja dostępna wyłącznie dla Właściciela (Owner).
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header & Filter */}
      <div className="glass-panel p-6 rounded-2xl space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-base font-extrabold text-slate-800 uppercase tracking-wider">
              Moderacja Opinii / Reviews Management
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Zarządzaj opiniami przesłanymi przez klientów. Zatwierdź je, aby
              wyświetlić na stronie głównej.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-slate-200">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value);
                setPagination((prev) => ({ ...prev, page: 1 })); // Reset to page 1 on filter change
              }}
              className="bg-transparent text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
            >
              <option value="ALL">Wszystkie opinie</option>
              <option value="PENDING">Oczekujące na moderację</option>
              <option value="APPROVED">Zatwierdzone</option>
              <option value="REJECTED">Odrzucone</option>
            </select>
          </div>
        </div>

        {/* Reviews List */}
        <div className="space-y-3">
          {loading ? (
            <div className="text-center py-12 text-slate-400">
              <div className="w-6 h-6 border-2 border-brand-red border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              Ładowanie opinii...
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-12 text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              <p className="font-bold">Brak opinii w tej kategorii</p>
              <p className="text-sm mt-1">
                Opinie klientów pojawią się tutaj po przesłaniu przez formularz
                na stronie.
              </p>
            </div>
          ) : (
            reviews.map((review) => (
              <div
                key={review.id}
                className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  {/* Review Content */}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="text-base font-black text-slate-800">
                        {review.name || "Anonim"}
                      </h3>
                      {getStatusBadge(review.status || "PENDING")}
                      <span className="text-[10px] text-slate-400 font-bold">
                        •
                      </span>
                      <span className="text-[10px] text-slate-500 font-semibold">
                        {formatDate(review.createdAt || review.date)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-600">
                      {renderStars(review.rating)}
                      {review.car && (
                        <>
                          <span className="text-slate-300">|</span>
                          <span className="font-semibold text-slate-500">
                            Pojazd:
                          </span>
                          <span className="text-slate-700">{review.car}</span>
                        </>
                      )}
                    </div>

                    <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                      "{review.comment || review.text}"
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex md:flex-col gap-2 shrink-0">
                    {review.status !== "APPROVED" && (
                      <button
                        onClick={() =>
                          handleStatusUpdate(review.id, "APPROVED")
                        }
                        className="flex-1 md:flex-none px-3 py-2 bg-green-50 hover:bg-green-100 border border-green-200 text-green-700 rounded-lg transition flex items-center justify-center gap-1.5 text-xs font-bold"
                        title="Zatwierdź i opublikuj"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        Zatwierdź
                      </button>
                    )}
                    {review.status !== "REJECTED" && (
                      <button
                        onClick={() =>
                          handleStatusUpdate(review.id, "REJECTED")
                        }
                        className="flex-1 md:flex-none px-3 py-2 bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 rounded-lg transition flex items-center justify-center gap-1.5 text-xs font-bold"
                        title="Odrzuć"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        Odrzuć
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteReview(review.id)}
                      className="flex-1 md:flex-none px-3 py-2 border border-brand-red/30 hover:border-brand-red text-brand-red bg-brand-red/5 hover:bg-brand-red/10 rounded-lg transition flex items-center justify-center gap-1.5 text-xs font-bold"
                      title="Usuń trwale"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Usuń
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Simple Pagination Controls */}
        {pagination.totalPages > 1 && (
          <div className="flex justify-center gap-2 pt-4 border-t border-slate-100">
            <button
              onClick={() =>
                setPagination((prev) => ({
                  ...prev,
                  page: Math.max(1, prev.page - 1),
                }))
              }
              disabled={pagination.page === 1}
              className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Poprzednia
            </button>
            <span className="px-4 py-2 text-xs font-bold text-slate-500">
              Strona {pagination.page} z {pagination.totalPages}
            </span>
            <button
              onClick={() =>
                setPagination((prev) => ({
                  ...prev,
                  page: Math.min(pagination.totalPages, prev.page + 1),
                }))
              }
              disabled={pagination.page === pagination.totalPages}
              className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Następna
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
