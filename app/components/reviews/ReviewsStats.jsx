import { Award, MessageSquare, Star } from "lucide-react";
import { useApp } from "@/app/context/AppContext";

export default function ReviewsStats({ averageRating, totalReviews }) {
  const { lang } = useApp();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="glass-panel p-6 rounded-2xl flex flex-col items-center justify-center text-center">
        <Award className="w-8 h-8 text-brand-red mb-2" />
        <span className="text-2xl font-black text-slate-800">{averageRating} / 5.0</span>
        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">Średnia Ocena / Avg Rating</span>
      </div>

      <div className="glass-panel p-6 rounded-2xl flex flex-col items-center justify-center text-center">
        <MessageSquare className="w-8 h-8 text-slate-400 mb-2" />
        <span className="text-2xl font-black text-slate-800">{totalReviews}</span>
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
  );
}