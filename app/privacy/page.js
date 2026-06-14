"use client";

import React from "react";
import { useApp } from "@/app/context/AppContext";

export default function PrivacyPolicy() {
  const { lang } = useApp();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8 animate-fade-in text-sm text-slate-600 leading-relaxed">
      
      {/* Title */}
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-extrabold text-slate-800 uppercase">Polityka Prywatności / Privacy Policy</h1>
        <p className="text-sm text-slate-500">
          Zasady przetwarzania danych osobowych oraz plików cookies w serwisie CAR-GO.PL.
        </p>
      </div>

      <div className="glass-panel p-6 sm:p-8 rounded-2xl space-y-6">
        
        {lang === "pl" ? (
          <>
            <section className="space-y-2.5">
              <h2 className="text-base font-bold text-slate-800 uppercase tracking-wider">1. Administrator Danych</h2>
              <p>Administratorem danych osobowych zbieranych za pośrednictwem serwisu car-go.pl jest firma CAR-GO.PL Adam Rybiński z siedzibą w Skarbimierzu-Osiedlu.</p>
              <p>W sprawach związanych z przetwarzaniem danych można kontaktować się pod adresem e-mail: reservations@car-go.pl.</p>
            </section>

            <section className="space-y-2.5">
              <h2 className="text-base font-bold text-slate-800 uppercase tracking-wider">2. Cele przetwarzania danych</h2>
              <p>Dane osobowe użytkowników (imię, nazwisko, telefon, e-mail, dane adresowe oraz NIP) przetwarzane są w celach:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Realizacji procesu rezerwacji pojazdu i zawarcia umowy najmu,</li>
                <li>Obsługi zgłoszeń i zapytań wysyłanych przez formularz kontaktowy,</li>
                <li>Zakładania i prowadzenia konta klienta w panelu "Moje Konto",</li>
                <li>Simulacji transakcji płatniczych oraz wystawiania faktur VAT,</li>
                <li>Marketingowych (wyłącznie w przypadku wyrażenia opcjonalnej zgody).</li>
              </ul>
            </section>

            <section className="space-y-2.5">
              <h2 className="text-base font-bold text-slate-800 uppercase tracking-wider">3. Prawa użytkownika</h2>
              <p>Każdej osobie, której dane dotyczą, przysługuje prawo dostępu do swoich danych, ich sprostowania, usunięcia ("prawo do bycia zapomnianym"), ograniczenia przetwarzania, przenoszenia danych oraz wniesienia sprzeciwu.</p>
            </section>

            <section className="space-y-2.5">
              <h2 className="text-base font-bold text-slate-800 uppercase tracking-wider">4. Pliki Cookies (Ciasteczka)</h2>
              <p>Serwis car-go.pl używa plików cookies w celu zapamiętywania sesji zalogowanego użytkownika, wybranej wersji językowej oraz koszyka rezerwacji w toku sesji najmu.</p>
            </section>
          </>
        ) : (
          <>
            <section className="space-y-2.5">
              <h2 className="text-base font-bold text-slate-800 uppercase tracking-wider">1. Data Controller</h2>
              <p>The controller of personal data collected through the car-go.pl website is CAR-GO.PL Adam Rybiński based in Skarbimierz-Osiedle.</p>
              <p>For inquiries regarding data processing, please contact: reservations@car-go.pl.</p>
            </section>

            <section className="space-y-2.5">
              <h2 className="text-base font-bold text-slate-800 uppercase tracking-wider">2. Purposes of Data Processing</h2>
              <p>Personal data of users (first name, last name, phone, email, address details, and NIP) are processed for:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Processing vehicle reservations and concluding the rental agreement,</li>
                <li>Handling inquiries submitted via the contact form,</li>
                <li>Creating and managing customer accounts in the "My Account" dashboard,</li>
                <li>Processing payment details and issuing invoices,</li>
                <li>Marketing purposes (subject to explicit optional consent).</li>
              </ul>
            </section>

            <section className="space-y-2.5">
              <h2 className="text-base font-bold text-slate-800 uppercase tracking-wider">3. User Rights</h2>
              <p>Every data subject has the right to access, rectify, erase ("right to be forgotten"), restrict processing, port data, and object to the processing of their personal data.</p>
            </section>

            <section className="space-y-2.5">
              <h2 className="text-base font-bold text-slate-800 uppercase tracking-wider">4. Cookie Policy</h2>
              <p>The car-go.pl website uses cookie files to remember logged-in user sessions, active language, and reservation progress state variables.</p>
            </section>
          </>
        )}

      </div>

    </div>
  );
}
