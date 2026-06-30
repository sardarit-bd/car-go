"use client";

import SearchForm from "@/app/components/SearchForm";
import { useApp } from "@/app/context/AppContext";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";

export default function Hero({ lang, getCmsText, t }) {
  const router = useRouter();
  const { setSearchParams } = useApp();

  const marketingSlogans = [
    t("motto1"),
    t("motto2"),
    t("motto3"),
    t("motto4"),
  ];

  const handleHeroSearch = (searchData) => {
    setSearchParams(searchData);
    router.push("/vehicles");
  };

  return (
    <section className="relative min-h-[85vh] flex items-center px-4 sm:px-6 py-10 md:py-0 overflow-hidden">

      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-red/5 rounded-full filter blur-[120px] -z-0 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-slate-200/40 rounded-full filter blur-[120px] -z-0 pointer-events-none" />

      <div className="container mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">

          <div className="lg:col-span-5 space-y-8 text-center lg:text-left animate-slide-up">
            
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-full shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-red opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-red"></span>
              </span>
              <span className="text-xs font-black uppercase text-slate-700 tracking-wider">
                {t("tagline")}
              </span>
            </div>


            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] text-slate-900">
              {getCmsText("homeHeader")}
              {lang !== "pl" && (
                <span className="block text-brand-red mt-2">CAR GO</span>
              )}
            </h1>


            <p className="text-base sm:text-lg text-slate-500 max-w-lg mx-auto lg:mx-0 leading-relaxed font-medium">
              {getCmsText(
                "homeSubheader",
                "Zawsze na czas, zawsze pod Twój adres w rejonie Skarbimierza-Osiedle, Oławy, Brzegu i Grodkowa."
              )}
            </p>


            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md mx-auto lg:mx-0 pt-2">
              {marketingSlogans.map((slogan, index) => (
                <div 
                  key={index} 
                  className="flex items-center gap-3 p-3 bg-white/60 backdrop-blur-sm border border-slate-100 rounded-xl shadow-sm hover:shadow-md hover:border-brand-red/20 transition-all duration-300"
                >
                  <div className="w-8 h-8 rounded-full bg-brand-red/10 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-brand-red" />
                  </div>
                  <span className="text-sm font-bold text-slate-700 leading-tight">{slogan}</span>
                </div>
              ))}
            </div>
          </div>


          <div className="lg:col-span-7 animate-fade-in animate-delay-200">
            <div className="relative bg-white/90 backdrop-blur-md p-6 sm:p-8 rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">

              <div className="absolute -top-10 -right-10 w-32 h-32 bg-brand-red/5 rounded-full filter blur-2xl pointer-events-none" />
              <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-slate-200/50 rounded-full filter blur-2xl pointer-events-none" />
              
              <div className="relative z-10">
                <SearchForm onSearch={handleHeroSearch} />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}