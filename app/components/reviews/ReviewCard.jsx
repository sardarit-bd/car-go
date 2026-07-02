import { Star } from "lucide-react";

export default function ReviewCard({ rev }) {
  return (
    <div className="p-5 glass-panel rounded-xl flex flex-col justify-between space-y-4 shadow-sm border border-slate-100">
      <div className="space-y-2.5">
        <div className="flex items-center space-x-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < rev.rating ? "text-yellow-500 fill-yellow-500" : "text-slate-200"
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
  );
}