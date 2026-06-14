"use client";

import React from "react";
import { useApp } from "@/app/context/AppContext";

export default function RentalTerms() {
  const { lang, t } = useApp();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8 animate-fade-in text-sm text-slate-600 leading-relaxed">
      
      {/* Title */}
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-extrabold text-slate-800 uppercase">{t("navTerms")}</h1>
        <p className="text-sm text-slate-500">
          Regulamin świadczenia usług wynajmu pojazdów przez CAR-GO.PL.
        </p>
      </div>

      <div className="glass-panel p-6 sm:p-8 rounded-2xl space-y-6">
        
        {lang === "pl" ? (
          <>
            <section className="space-y-2.5">
              <h2 className="text-base font-bold text-slate-800 uppercase tracking-wider">§ 1. Postanowienia ogólne</h2>
              <p>Niniejszy regulamin określa warunki wynajmu samochodów osobowych przez firmę CAR-GO.PL na rzecz klientów indywidualnych oraz biznesowych.</p>
              <p>Wypożyczalnia zobowiązuje się przekazać najemcy pojazd w stanie zdatnym do eksploatacji, a najemca zobowiązuje się używać pojazd zgodnie z jego przeznaczeniem i uiszczać opłaty zgodnie z cennikiem.</p>
            </section>

            <section className="space-y-2.5">
              <h2 className="text-base font-bold text-slate-800 uppercase tracking-wider">§ 2. Wymagania wobec kierowcy</h2>
              <p>Najemcą pojazdu może być osoba, która ukończyła 21 lat, posiada ważny dowód osobisty lub paszport oraz ważne prawo jazdy kategorii B posiadane przez okres co najmniej 1 roku.</p>
              <p>Pojazd nie może być udostępniany osobom trzecim bez uprzedniej pisemnej zgody wypożyczalni wpisanej w umowie najmu jako dodatkowy kierowca.</p>
            </section>

            <section className="space-y-2.5">
              <h2 className="text-base font-bold text-slate-800 uppercase tracking-wider">§ 3. Kaucja i ubezpieczenie</h2>
              <p>W momencie wydania pojazdu pobierana jest kaucja zabezpieczająca (depozyt) w wysokości określonej w cenniku. Wysokość kaucji ulega zmniejszeniu w zależności od wybranego pakietu ochrony (Złoty/Platynowy).</p>
              <p>Pojazd posiada pełne ubezpieczenie OC. W przypadku wyboru pakietu Podstawowego najemca ponosi odpowiedzialność za szkody (udział własny) do kwoty 5000 PLN. Pakiet Platynowy znosi całkowicie udział własny najemcy (0 PLN).</p>
            </section>

            <section className="space-y-2.5">
              <h2 className="text-base font-bold text-slate-800 uppercase tracking-wider">§ 4. Zasady użytkowania pojazdu</h2>
              <p>W pojeździe obowiązuje całkowity zakaz palenia tytoniu, e-papierosów oraz przewożenia zwierząt bez specjalnych transporterów.</p>
              <p>Pojazd jest wydawany z pełnym zbiornikiem paliwa i musi zostać zwrócony również zatankowany do pełna. W przypadku zwrotu niezatankowanego auta, najemca zostanie obciążony kosztem paliwa oraz opłatą serwisową.</p>
            </section>
          </>
        ) : (
          <>
            <section className="space-y-2.5">
              <h2 className="text-base font-bold text-slate-800 uppercase tracking-wider">§ 1. General Provisions</h2>
              <p>These terms and conditions define the rules for renting passenger cars by CAR-GO.PL to individual and corporate clients.</p>
              <p>The rental agency undertakes to deliver the vehicle to the renter in a roadworthy condition, and the renter undertakes to use the vehicle in accordance with its purpose and pay all fees in accordance with the price list.</p>
            </section>

            <section className="space-y-2.5">
              <h2 className="text-base font-bold text-slate-800 uppercase tracking-wider">§ 2. Driver Requirements</h2>
              <p>The renter of the vehicle must be at least 21 years old, possess a valid ID card or passport, and have held a valid category B driving license for at least 1 year.</p>
              <p>The vehicle must not be shared with third parties without the prior written consent of the rental agency entered in the rental agreement as an additional driver.</p>
            </section>

            <section className="space-y-2.5">
              <h2 className="text-base font-bold text-slate-800 uppercase tracking-wider">§ 3. Deposit and Insurance</h2>
              <p>A security deposit is authorized on the card when collecting the vehicle. The amount of the deposit is reduced depending on the selected protection package (Gold/Platinum).</p>
              <p>The vehicle has third-party liability insurance (OC). In the Basic protection package, the renter bears liability for damages (deductible) up to 5000 PLN. The Platinum package entirely eliminates renter liability (0 PLN).</p>
            </section>

            <section className="space-y-2.5">
              <h2 className="text-base font-bold text-slate-800 uppercase tracking-wider">§ 4. Usage Policies</h2>
              <p>Smoking tobacco, e-cigarettes, and carrying pets without specialized cages are strictly prohibited inside the vehicle.</p>
              <p>The vehicle is handed over with a full tank of fuel and must be returned fully refueled. If returned unrefueled, the renter will be charged for fuel and service fees.</p>
            </section>
          </>
        )}

      </div>

    </div>
  );
}
