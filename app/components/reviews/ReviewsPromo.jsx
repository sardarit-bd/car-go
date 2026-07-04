import Link from "next/link";
import { useApp } from "@/app/context/AppContext";

export default function ReviewsPromo() {
  const { lang } = useApp();
  
  return (
    <div className="p-6 bg-slate-50 border border-slate-200/60 rounded-2xl text-center space-y-3 font-semibold text-xs text-slate-600">
      <p>{lang === "pl" ? "Skorzystałeś z naszych usług? Podziel się swoją opinią logując się na swoje konto klienta." : "Have you used our services? Login to your account to write a review."}</p>
      <Link
        href="/account/login"
        className="inline-block px-5 py-2 bg-brand-red hover:bg-brand-red-hover text-white text-xs font-black tracking-widest uppercase rounded-lg shadow transition"
      >
        ZALOGUJ SIĘ I DODAJ OPINIĘ / LOGIN & SUBMIT REVIEW
      </Link>
    </div>
  );
}