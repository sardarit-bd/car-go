"use client";

import SidebarCTA from "@/app/components/SidebarCTA";
import { useApp } from "@/app/context/AppContext";
import { Award, MessageSquare, Star } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function Reviews() {
  const { lang, reviews, t } = useApp();
  const [ratingFilter, setRatingFilter] = useState("all");

  const approvedReviews = reviews.filter((r) => r.approved);

  const filteredReviews = approvedReviews.filter((r) => {
    return ratingFilter === "all" || r.rating === parseInt(ratingFilter);
  });

  const getAverageRating = () => {
    if (approvedReviews.length === 0) return 0;
    const sum = approvedReviews.reduce((acc, curr) => acc + curr.rating, 0);
    return (sum / approvedReviews.length).toFixed(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10 animate-fade-in">

      {/* Title */}
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-extrabold text-slate-800 uppercase">{t("navReviews")}</h1>
        <p className="text-sm font-semibold text-slate-500">
          {lang === "pl"
            ? "Przeczytaj opinie zweryfikowanych kierowców, którzy skorzystali z usług naszej wypożyczalni."
            : "Read reviews from verified drivers who have used our car rental services."}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Sticky Left Sidebar CTA Panel */}
        <div className="lg:col-span-4 sticky top-36 hidden lg:block">
          <SidebarCTA />
        </div>

        {/* Right Content */}
        <div className="lg:col-span-8 space-y-8">
          {/* Stats Summary Panel */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="glass-panel p-6 rounded-2xl flex flex-col items-center justify-center text-center">
              <Award className="w-8 h-8 text-brand-red mb-2" />
              <span className="text-2xl font-black text-slate-800">{getAverageRating()} / 5.0</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">Średnia Ocena / Avg Rating</span>
            </div>

            <div className="glass-panel p-6 rounded-2xl flex flex-col items-center justify-center text-center">
              <MessageSquare className="w-8 h-8 text-slate-400 mb-2" />
              <span className="text-2xl font-black text-slate-800">{approvedReviews.length}</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">Opinie zweryfikowane / Reviews</span>
            </div>

            <div className="glass-panel p-6 rounded-2xl flex flex-col items-center justify-center text-center">
              <div className="flex items-center space-x-1 mb-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                ))}
              </div>
              <span className="text-sm font-extrabold text-slate-800">{lang === "pl" ? "100% Zadowolenia" : "100% Satisfaction"}</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">Gwarancja jakości CAR-GO</span>
            </div>
          </div>

          {/* Ratings Filters */}
          <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 pb-4 text-xs font-bold text-slate-400">
            <span>Filtruj oceny:</span>
            {["all", "5", "4", "3"].map((star) => (
              <button
                key={star}
                onClick={() => setRatingFilter(star)}
                className={`px-3 py-1.5 rounded-full border transition ${ratingFilter === star
                    ? "bg-brand-red border-brand-red text-white"
                    : "bg-white border-slate-200 text-slate-600 hover:border-slate-350"
                  }`}
              >
                {star === "all" ? "Wszystkie / All" : `${star} ★`}
              </button>
            ))}
          </div>

          {/* Reviews list */}
          {filteredReviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredReviews.map((rev) => (
                <div
                  key={rev.id}
                  className="p-5 glass-panel rounded-xl flex flex-col justify-between space-y-4 shadow-sm border border-slate-100"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center space-x-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${i < rev.rating ? "text-yellow-500 fill-yellow-500" : "text-slate-200"
                            }`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-slate-650 italic leading-relaxed font-semibold">
                      "{rev.text}"
                    </p>
                  </div>

                  <div className="flex justify-between items-center text-[10px] text-slate-450 pt-3 border-t border-slate-100 font-bold">
                    <span className="text-slate-500 font-extrabold">{rev.name}</span>
                    <span>Wynajęty pojazd: <strong className="text-slate-500">{rev.car}</strong></span>
                    <span>{rev.date}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border border-slate-200/60 rounded-2xl bg-slate-50/50 text-slate-500">
              <p>{lang === "pl" ? "Brak opinii o tej ocenie." : "No reviews match this rating."}</p>
            </div>
          )}

          {/* Promo banner redirecting to lookup or contact */}
          <div className="p-6 bg-slate-50 border border-slate-200/60 rounded-2xl text-center space-y-3 font-semibold text-xs text-slate-600">
            <p>{lang === "pl" ? "Skorzystałeś z naszych usług? Podziel się swoją opinią logując się na swoje konto klienta." : "Have you used our services? Login to your account to write a review."}</p>
            <Link
              href="/account/login"
              className="inline-block px-5 py-2 bg-brand-red hover:bg-brand-red-hover text-white text-xs font-black tracking-widest uppercase rounded-lg shadow transition"
            >
              ZALOGUJ SIĘ I DODAJ OPINIĘ / LOGIN & SUBMIT REVIEW
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}
