export default function ReviewsFilters({ ratingFilter, setRatingFilter }) {
  return (
    <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 pb-4 text-xs font-bold text-slate-400">
      <span>Filtruj oceny:</span>
      {["all", "5", "4", "3"].map((star) => (
        <button
          key={star}
          onClick={() => setRatingFilter(star)}
          className={`px-3 py-1.5 rounded-full border transition ${
            ratingFilter === star
              ? "bg-brand-red border-brand-red text-white"
              : "bg-white border-slate-200 text-slate-600 hover:border-slate-350"
          }`}
        >
          {star === "all" ? "Wszystkie / All" : `${star} ★`}
        </button>
      ))}
    </div>
  );
}