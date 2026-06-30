"use client";

import { Star, Quote } from "lucide-react";
import Link from "next/link";

export default function ReviewsSection({ reviews, approvedReviews, t }) {
  return (
    <section className="px-4 sm:px-6 container mx-auto py-16 sm:py-24">

      <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
          {t("reviewsTitle")}
        </h2>
        <p className="text-sm sm:text-base text-slate-500 font-medium leading-relaxed">
          Co o nas sądzą osoby, które skorzystały już z naszych samochodów?
        </p>
      </div>


      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {approvedReviews.map((rev) => (
          <div
            key={rev.id}
            className="group relative bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-slate-200 transition-all duration-300 flex flex-col"
          >
       
            <div className="absolute top-5 right-5 text-slate-100 group-hover:text-slate-200 transition-colors duration-300">
              <Quote className="w-8 h-8" />
            </div>


            <div className="flex items-center gap-1 mb-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < rev.rating
                      ? "text-yellow-500 fill-yellow-500"
                      : "text-slate-200"
                  }`}
                />
              ))}
            </div>

  
            <p className="text-sm text-slate-600 leading-relaxed flex-grow mb-6 relative z-10">
              "{rev.text}"
            </p>

     
            <div className="flex items-center gap-3 pt-5 border-t border-slate-100">
  
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-sm font-bold text-slate-600 shrink-0">
                {rev.name.charAt(0).toUpperCase()}
              </div>
              

              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-900 truncate">
                  {rev.name}
                </p>
                <p className="text-xs text-slate-500 truncate">
                  Pojazd: {rev.car} • {rev.date}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Link */}
      <div className="text-center mt-12">
        <Link
          href="/reviews"
          className="inline-flex items-center gap-2 text-sm font-bold text-brand-red hover:opacity-80 transition-opacity group"
        >
          Zobacz wszystkie opinie / View all reviews ({reviews.length})
          <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
        </Link>
      </div>
    </section>
  );
}