import { useApp } from "@/app/context/AppContext";

export default function ReviewsHeader() {
  const { lang, t } = useApp();
  
  return (
    <div className="text-center space-y-3">
      <h1 className="text-3xl font-extrabold text-slate-800 uppercase">{t("navReviews")}</h1>
      <p className="text-sm font-semibold text-slate-500">
        {lang === "pl"
          ? "Przeczytaj opinie zweryfikowanych kierowców, którzy skorzystali z usług naszej wypożyczalni."
          : "Read reviews from verified drivers who have used our car rental services."}
      </p>
    </div>
  );
}