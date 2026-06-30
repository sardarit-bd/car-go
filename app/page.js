"use client";

import SearchForm from "@/app/components/SearchForm";
import { useApp } from "@/app/context/AppContext";
import { Briefcase, CheckCircle, Settings, Sparkles, Star, Users } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const { lang, vehicles, locations, reviews, cmsTexts, t } = useApp();

  const getCmsText = (key, fallback) => {
    return cmsTexts[key]?.[lang] || fallback;
  };

  const marketingSlogans = [
    t("motto1"),
    t("motto2"),
    t("motto3"),
    t("motto4")
  ];

  const approvedReviews = reviews.filter((r) => r.approved).slice(0, 3);

  const renderCarSvg = () => (
    <svg className="w-full max-w-lg mx-auto opacity-80 drop-shadow-[0_10px_20px_rgba(255,0,0,0.1)]" viewBox="0 0 500 220" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M70 120 C 130 115, 230 115, 270 95 C 310 75, 360 70, 390 90 C 420 110, 440 120, 460 120 C 480 120, 490 135, 490 145 L 490 165 C 490 170, 480 175, 470 175 C 450 175, 430 175, 410 175 C 400 160, 375 160, 365 175 C 320 175, 180 175, 135 175 C 125 160, 100 160, 90 175 C 60 175, 30 170, 20 165 C 15 160, 10 145, 10 135 C 10 128, 30 122, 70 120 Z" fill="#64748b" stroke="#cbd5e1" strokeWidth="2.5" />
      <path d="M120 125 C 170 120, 260 120, 280 105 L 340 105 C 375 120, 390 125, 430 125" stroke="#FF0000" strokeWidth="3.5" strokeLinecap="round" />
      <circle cx="112" cy="175" r="26" fill="#1e293b" stroke="#cbd5e1" strokeWidth="4" />
      <circle cx="112" cy="175" r="14" fill="#334155" />
      <circle cx="382" cy="175" r="26" fill="#1e293b" stroke="#cbd5e1" strokeWidth="4" />
      <circle cx="382" cy="175" r="14" fill="#334155" />
      <path d="M280 102 L 315 72 C 322 65, 335 63, 345 68 L 388 90 C 395 93, 398 100, 395 107 Z" fill="#0f172a" stroke="#cbd5e1" strokeWidth="1.5" />
    </svg>
  );

  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center w-full">
          <div className="lg:col-span-5 space-y-6 text-center lg:text-left animate-slide-up">
            <div className="inline-flex items-center space-x-1 px-3 py-1 bg-brand-red/5 border border-brand-red/15 rounded-full text-xs font-bold text-brand-red">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span>{t("tagline")}</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight">
              <span className="text-gradient block">{getCmsText("homeHeader")}</span>
              <span className="text-gradient block">{lang === "pl" ? "" : "CAR GO"}</span>
            </h1>
            <p className="text-base text-slate-500 max-w-md mx-auto lg:mx-0 font-medium">
              {getCmsText("homeSubheader", "Zawsze na czas, zawsze pod Twój adres w rejonie Skarbimierza-Osiedle, Oławy, Brzegu i Grodkowa.")}
            </p>

            <div className="grid grid-cols-2 gap-3.5 max-w-sm mx-auto lg:mx-0 text-left pt-2 font-semibold text-xs text-slate-600">
              {marketingSlogans.map((slogan, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <CheckCircle className="w-4.5 h-4.5 text-brand-red flex-shrink-0" />
                  <span>{slogan}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7 animate-fade-in animate-delay-200">
            <SearchForm />
          </div>
        </div>

        <div className="absolute top-0 right-0 w-80 h-80 bg-brand-red/5 rounded-full filter blur-[80px] -z-10 pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-slate-200/50 rounded-full filter blur-[100px] -z-10 pointer-events-none" />
      </section>

      {/* Fleet Preview Section */}
      <section className="px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">{t("fleetTitle")}</h2>
          <p className="text-sm font-semibold text-slate-500">{t("fleetSubtitle")}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {vehicles.slice(0, 3).map((car) => (
            <div key={car.id} className="group bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md hover:border-slate-350 transition-all duration-300 hover:translate-y-[-4px]">
              <div className="bg-slate-50/70 p-0 flex justify-center items-center border-b border-slate-100 relative overflow-hidden h-40">
                {car.image ? (
                  <img
                    src={car.image}
                    alt={`${car.brand} ${car.model}`}
                    className="h-full w-full object-contain transition duration-300 group-hover:scale-105"
                  />
                ) : (
                  renderCarSvg()
                )}
                <span className="absolute top-3 left-3 px-2 py-0.5 bg-slate-200/60 text-[10px] text-slate-700 rounded font-bold uppercase border border-slate-200/30">
                  Class {car.class.split(" ")[0]}
                </span>

                <span className={`absolute top-3 right-3 px-2 py-0.5 rounded text-[10px] font-black text-white uppercase ${car.fuel.toLowerCase() === "petrol" ? "bg-green-700" : "bg-slate-800"}`}>
                  {car.fuel === "Petrol" ? t("fuelPetrol") : t("fuelDiesel")}
                </span>
              </div>

              <div className="p-5 space-y-4">
                <div className="flex justify-between items-baseline">
                  <h3 className="text-lg font-black text-slate-800 group-hover:text-brand-red transition">
                    {car.brand} {car.model}
                  </h3>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">{t("priceFrom")}</span>
                    <p className="text-base font-extrabold text-slate-900">
                      PLN {car.price}
                      <span className="text-xs text-slate-500 font-normal">{t("dayUnit")}</span>
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 py-2 border-t border-b border-slate-100 text-xs text-slate-500 font-bold">
                  <span className="flex items-center space-x-1 justify-center">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <span>{car.seats} {t("seatsUnit").slice(0, 1)}</span>
                  </span>
                  <span className="flex items-center space-x-1 justify-center border-l border-slate-100 border-r">
                    <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                    <span>{car.luggage} {t("luggageUnit")}</span>
                  </span>
                  <span className="flex items-center space-x-1 justify-center">
                    <Settings className="w-3.5 h-3.5 text-slate-400" />
                    <span>{car.transmission === "Automatic" ? t("gearAuto").slice(0, 4) : t("gearManual").slice(0, 3)}</span>
                  </span>
                </div>

                <div className="flex space-x-3 pt-1">
                  <Link
                    href={`/vehicles/${car.id}`}
                    className="flex-1 text-center py-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs text-slate-705 font-bold rounded-lg transition"
                  >
                    {t("specifications").toUpperCase()}
                  </Link>
                  <Link
                    href={`/checkout?step=1&car=${car.id}`}
                    className="flex-1 text-center py-2 bg-brand-red hover:bg-brand-red-hover text-xs text-white font-bold rounded-lg transition"
                  >
                    {t("reserveBtn")}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/vehicles"
            className="inline-flex items-center space-x-2 px-6 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-sm font-bold text-slate-800 rounded-lg shadow-sm transition"
          >
            <span>{t("viewAllVehicles").toUpperCase()}</span>
            <span>→</span>
          </Link>
        </div>
      </section>

      {/* About Company Section */}
      <section className="py-12 bg-white border-t border-b border-slate-100">
        <div className="px-4 sm:px-6 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <h2 className="text-2xl font-extrabold text-slate-900 flex items-center space-x-2">
              <CheckCircle className="w-6 h-6 text-brand-red" />
              <span>{t("aboutTitle")}</span>
            </h2>
            <p className="text-sm text-slate-500 leading-relaxed font-semibold">{t("aboutText")}</p>
          </div>
          <div className="relative border border-slate-200 p-8 rounded-2xl bg-slate-50 shadow-sm overflow-hidden">
            <h3 className="text-base font-extrabold text-slate-800 mb-3">📍 Skąd odbierzesz samochód?</h3>
            <ul className="space-y-2.5 text-xs text-slate-700 font-semibold">
              <li className="flex items-start space-x-2">
                <span className="w-1.5 h-1.5 bg-brand-red rounded-full mt-1.5 flex-shrink-0" />
                <span><strong>Skarbimierz-Osiedle (Baza):</strong> Bez limitu dni, darmowy odbiór.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="w-1.5 h-1.5 bg-brand-red rounded-full mt-1.5 flex-shrink-0" />
                <span><strong>Brzeg (Rynek/Dworzec):</strong> Odbiór już od 1 doby wynajmu.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="w-1.5 h-1.5 bg-brand-red rounded-full mt-1.5 flex-shrink-0" />
                <span><strong>Oława / Grodków:</strong> Minimalny okres wypożyczenia to 5 dni.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="w-1.5 h-1.5 bg-brand-red rounded-full mt-1.5 flex-shrink-0" />
                <span><strong>Dostawa pod dom:</strong> Indywidualna wycena (wygodne podstawienie pod wskazany adres).</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Long-Term Rental CTA Promo Banner */}
      <section className="px-4 sm:px-6 max-w-5xl mx-auto animate-fade-in">
        <div className="p-8 bg-brand-dark border border-brand-accent/50 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
          <div className="space-y-2.5 text-left relative z-10">
            <span className="px-2.5 py-1 bg-brand-red/10 border border-brand-red/35 rounded-full text-[10px] font-black uppercase text-brand-red tracking-wider">{t("longTermTitle")}</span>
            <p className="text-base sm:text-lg font-bold text-white leading-relaxed max-w-2xl">{t("longTermText")}</p>
          </div>
          <div className="relative z-10 w-full md:w-auto flex-shrink-0">
            <Link href="/contact" className="w-full sm:w-auto inline-flex justify-center items-center px-6 py-3 bg-brand-red hover:bg-brand-red-hover text-white text-xs font-black tracking-widest uppercase rounded-xl shadow transition-all duration-200 hover:-translate-y-0.5 text-center">
              {t("contactUsBtn")}
            </Link>
          </div>
          <div className="absolute right-0 top-0 w-48 h-48 bg-brand-red/5 rounded-full filter blur-3xl pointer-events-none" />
        </div>
      </section>

      {/* Reviews Section */}
      <section className="px-4 sm:px-6 max-w-7xl mx-auto pb-6">
        <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
          <h2 className="text-2xl font-extrabold text-slate-900">{t("reviewsTitle")}</h2>
          <p className="text-xs font-semibold text-slate-500">Co o nas sądzą osoby, które skorzystały już z naszych samochodów?</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {approvedReviews.map((rev) => (
            <div key={rev.id} className="p-5 bg-white rounded-xl border border-slate-100 shadow-sm space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center space-x-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`w-3.5 h-3.5 ${i < rev.rating ? "text-yellow-500 fill-yellow-500" : "text-slate-300"}`} />
                  ))}
                </div>
                <p className="text-xs text-slate-600 italic leading-relaxed font-semibold">"{rev.text}"</p>
              </div>
              <div className="flex justify-between items-center text-[10px] text-slate-500 pt-3 border-t border-slate-100">
                <span className="font-extrabold text-slate-600">{rev.name}</span>
                <span>Pojazd: <strong className="text-slate-700">{rev.car}</strong></span>
                <span>{rev.date}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link href="/reviews" className="text-xs font-bold text-brand-red hover:underline">
            Zobacz wszystkie opinie / View all reviews ({reviews.length}) →
          </Link>
        </div>
      </section>
    </div>
  );
}