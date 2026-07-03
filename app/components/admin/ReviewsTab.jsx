"use client";

import React from "react";
import { useApp } from "@/app/context/AppContext";
import { ShieldAlert, AlertTriangle, Check, X } from "lucide-react";

export default function ReviewsTab() {
  const { isOwner, reviews, updateReview, deleteReview } = useApp();

  const handleReviewApprove = (id) => updateReview(id, true);
  const handleReviewReject = (id) => deleteReview(id);

  if (!isOwner) {
    return (
      <div className="p-6 border border-brand-red/30 bg-brand-red/5 text-brand-red rounded-xl flex items-center space-x-2 text-sm font-bold">
        <ShieldAlert className="w-5 h-5 flex-shrink-0" />
        <span>
          Brak uprawnień. Sekcja dostępna wyłącznie dla Właściciela
          (Owner).
        </span>
      </div>
    );
  }

  return (
    <div className="glass-panel p-6 rounded-2xl space-y-5">
      <h2 className="text-base font-extrabold text-slate-800 border-b border-slate-100 pb-3 uppercase tracking-wider">
        Moderacja Opinii Klientów / Reviews Moderation Queue
      </h2>
      <div className="space-y-4">
        {reviews.map((rev) => (
          <div
            key={rev.id}
            className="p-4 bg-slate-50 border border-slate-200/60 rounded-xl space-y-3 text-xs font-semibold"
          >
            <div className="flex justify-between items-baseline">
              <div>
                <span className="font-extrabold text-slate-800">
                  {rev.name}
                </span>
                <span className="text-slate-400 font-normal ml-1.5">
                  auto: {rev.car} | {rev.date}
                </span>
              </div>
              <div className="flex items-center space-x-1 text-yellow-500">
                {Array.from({ length: rev.rating }).map((_, i) => (
                  <span key={i}>★</span>
                ))}
              </div>
            </div>
            <p className="text-slate-600 italic">"{rev.text}"</p>
            <div className="flex justify-between items-center pt-2 border-t border-slate-100 text-[10px]">
              <div className="flex items-center space-x-1">
                <span>Status:</span>
                {rev.approved ? (
                  <span className="text-green-600 font-bold">
                    Zatwierdzona i widoczna publicznie
                  </span>
                ) : (
                  <span className="text-yellow-600 font-bold flex items-center space-x-0.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Oczekuje na akceptację</span>
                  </span>
                )}
              </div>
              <div className="flex space-x-2">
                {!rev.approved && (
                  <button
                    onClick={() => handleReviewApprove(rev.id)}
                    className="px-3 py-1 bg-green-700 hover:bg-green-600 text-white rounded font-extrabold transition flex items-center space-x-1"
                  >
                    <Check className="w-3 h-3" />
                    <span>Zatwierdź</span>
                  </button>
                )}
                <button
                  onClick={() => handleReviewReject(rev.id)}
                  className="px-3 py-1 bg-red-700 hover:bg-red-600 text-white rounded font-extrabold transition flex items-center space-x-1"
                >
                  <X className="w-3 h-3" />
                  <span>Usuń</span>
                </button>
              </div>
            </div>
          </div>
        ))}
        {reviews.length === 0 && (
          <p className="text-center text-slate-400 py-6">
            Brak opinii w kolejce.
          </p>
        )}
      </div>
    </div>
  );
}