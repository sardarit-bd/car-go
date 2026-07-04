import ReviewCard from "./ReviewCard";
import { useApp } from "@/app/context/AppContext";

export default function ReviewsList({ filteredReviews, isLoading }) {
  const { lang } = useApp();

  // Loading Skeleton for API integration
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-5 glass-panel rounded-xl h-48 animate-pulse bg-slate-100/50 border border-slate-100" />
        ))}
      </div>
    );
  }

  if (filteredReviews.length === 0) {
    return (
      <div className="text-center py-12 border border-slate-200/60 rounded-2xl bg-slate-50/50 text-slate-500">
        <p>{lang === "pl" ? "Brak opinii o tej ocenie." : "No reviews match this rating."}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {filteredReviews.map((rev) => (
        <ReviewCard key={rev.id} rev={rev} />
      ))}
    </div>
  );
}