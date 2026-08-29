"use client";

import React from "react";
import { useApp } from "@/app/context/AppContext";
import SidebarCTA from "@/app/components/SidebarCTA";

export default function CookiePolicy() {
  const { lang, cmsPages } = useApp();

  const cookiePage = cmsPages?.find((p) => p.type === "COOKIE_POLICY");

  return (
    <div className="container max-lg:py-20 mx-auto px-4 sm:px-6 space-y-8 animate-fade-in text-sm text-slate-650 leading-relaxed font-medium">
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-extrabold text-slate-800 uppercase">
          {lang === "pl" ? "Polityka Cookies" : "Cookie Policy"}
        </h1>
        <p className="text-sm text-slate-500">
          {lang === "pl"
            ? "Zasady wykorzystania plików cookies w serwisie CAR-GO.PL."
            : "Rules for the use of cookies on the CAR-GO.PL website."}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-4 sticky top-24 hidden lg:block">
          <SidebarCTA />
        </div>

        <div className="lg:col-span-8">
          <div className="glass-panel p-6 sm:p-8 rounded-2xl space-y-6">
            {cookiePage &&
            (lang === "pl" ? cookiePage.contentPl : cookiePage.contentEn) ? (
              <div className="whitespace-pre-wrap text-sm text-slate-600 leading-relaxed font-medium">
                {lang === "pl" ? cookiePage.contentPl : cookiePage.contentEn}
              </div>
            ) : (
              <>
                {lang === "pl" ? (
                  <section className="space-y-2.5">
                    <h2 className="text-base font-bold text-slate-800 uppercase tracking-wider">
                      Czym są pliki cookies
                    </h2>
                    <p>
                      Pliki cookies to małe pliki tekstowe zapisywane na
                      urządzeniu użytkownika, wykorzystywane do zapamiętywania
                      preferencji językowych, sesji logowania oraz statystyk
                      odwiedzin serwisu car-go.pl.
                    </p>
                  </section>
                ) : (
                  <section className="space-y-2.5">
                    <h2 className="text-base font-bold text-slate-800 uppercase tracking-wider">
                      What are cookies
                    </h2>
                    <p>
                      Cookies are small text files stored on your device, used
                      to remember language preference, login sessions, and visit
                      statistics on the car-go.pl website.
                    </p>
                  </section>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
