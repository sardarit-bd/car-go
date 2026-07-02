"use client";

import SidebarCTA from "@/app/components/SidebarCTA";
import { useApp } from "@/app/context/AppContext";
import { Clock, Mail, MapPin, Phone, ShieldCheck, Loader2 } from "lucide-react";
import { useState } from "react";

export default function Contact() {
  const { lang, t, logEmail } = useApp();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [sent, setSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (name && email && msg) {
      setIsLoading(true);
      
      try {
        // Use environment variable for API URL, fallback to localhost for dev
        const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        
        const response = await fetch(`${API_URL}/api/contacts`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name,
            email: email,
            message: msg,
            captchaToken: "dummy_token_for_testing", // Replace with real ReCaptcha/hCaptcha token if you implement one
          }),
        });

        if (!response.ok) {
          throw new Error(`API Error: ${response.status}`);
        }

        // Keep local context logging for UI state/analytics fallback
        logEmail({
          id: "contact_page_" + Math.random().toString(36).substr(2, 9),
          to: "reservations@car-go.pl",
          subject: `[CAR-GO.PL Contact Page] Message from ${name}`,
          body: `
Sender Name: ${name}
Sender Email: ${email}

Message:
${msg}
          `,
          date: new Date().toLocaleString()
        });

        setSent(true);
        setName("");
        setEmail("");
        setMsg("");

        setTimeout(() => {
          setSent(false);
        }, 5000);

      } catch (error) {
        console.error("Error submitting contact form:", error);
        alert(lang === "pl" ? "Wystąpił błąd podczas wysyłania wiadomości. Spróbuj ponownie." : "An error occurred while sending the message. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Modern responsive vector map graphics represent Skarbimierz-Osiedle location area
  const renderMapSvg = () => (
    <svg className="w-full h-full bg-slate-50" viewBox="0 0 400 250" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="250" fill="#f8fafc" />
      <path d="M0 50 H400 M0 120 H400 M0 190 H400 M100 0 V250 M250 0 V250" stroke="#e2e8f0" strokeWidth="2" />
      <path d="M40 90 L180 150 M220 50 L380 210" stroke="#cbd5e1" strokeWidth="4" />
      {/* Rivers/Forest areas mock */}
      <rect x="290" y="20" width="80" height="60" rx="10" fill="#dcfce7" opacity="0.6" />
      {/* Marker pin */}
      <g transform="translate(250, 120)">
        <circle cx="0" cy="0" r="12" fill="#FF0000" opacity="0.2" className="animate-ping" />
        <circle cx="0" cy="0" r="6" fill="#FF0000" />
        <path d="M-6 0 C-6 -8, 6 -8, 6 0 C6 8, 0 16, 0 16 C0 16, -6 8, -6 0 Z" fill="#FF0000" />
        <circle cx="0" cy="-2" r="2.5" fill="#ffffff" />
      </g>
      <text x="210" y="110" fill="#334155" fontSize="10" fontWeight="bold" fontFamily="sans-serif">CAR-GO Baza</text>
    </svg>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12 animate-fade-in">

      {/* Title */}
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-extrabold text-slate-800 uppercase">{t("navContact")}</h1>
        <p className="text-sm font-semibold text-slate-500">
          {lang === "pl"
            ? "Masz dodatkowe pytania? Skontaktuj się z naszą obsługą klienta telefonicznie lub napisz wiadomość."
            : "Have additional questions? Contact our customer support team by phone or write a message."}
        </p>
      </div>

      <div className="max-w-5xl mx-auto space-y-12">
        {/* Contact Page Content */}
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">

            {/* Left Column: Direct Info & Map */}
            <div className="md:col-span-5 space-y-6">
              <div className="glass-panel p-6 rounded-2xl space-y-6">
                <h2 className="text-base font-extrabold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">
                  Dane Wypożyczalni / Rental Info:
                </h2>

                <div className="space-y-4 text-xs font-semibold text-slate-600">
                  <div className="flex items-start space-x-3.5">
                    <MapPin className="w-5 h-5 text-brand-red flex-shrink-0" />
                    <div>
                      <p className="text-slate-400 font-normal">Siedziba i Baza Floty / Base Address:</p>
                      <p className="text-slate-800 font-extrabold mt-0.5">CAR-GO.PL Adam Rybiński</p>
                      <p className="mt-0.5">ul. Smaków 12, 49-318 Skarbimierz-Osiedle</p>
                      <p className="text-[10px] text-slate-400">Woj. opolskie, Polska</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3.5">
                    <Phone className="w-5 h-5 text-brand-red flex-shrink-0" />
                    <div>
                      <p className="text-slate-400 font-normal">Infolinia rezerwacji / Phone hotline:</p>
                      <p className="text-slate-800 font-extrabold mt-0.5">+48 789 200 100</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3.5">
                    <Mail className="w-5 h-5 text-brand-red flex-shrink-0" />
                    <div>
                      <p className="text-slate-400 font-normal">Kontakt e-mail / Email support:</p>
                      <p className="text-slate-800 font-extrabold mt-0.5">reservations@car-go.pl</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3.5">
                    <Clock className="w-5 h-5 text-slate-400 flex-shrink-0" />
                    <div>
                      <p className="text-slate-400 font-normal">Godziny obsługi / Working Hours:</p>
                      <p className="text-slate-800 mt-0.5">{t("phoneHours")}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Contact form */}
            <div className="md:col-span-7">
              <div className="glass-panel p-6 rounded-2xl space-y-5">
                <h2 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2.5">
                  {t("contactFormTitle")}
                </h2>

                {sent ? (
                  <div className="p-8 border border-green-600/30 bg-green-50/50 rounded-xl text-center space-y-2 text-green-700 animate-fade-in">
                    <ShieldCheck className="w-10 h-10 mx-auto" />
                    <p className="text-sm font-bold">{t("contactSuccess")}</p>
                    <p className="text-xs text-slate-500">Skontaktujemy się z Tobą wkrótce.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1">{t("contactName")} *</label>
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 text-sm focus:outline-none focus:border-brand-red"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1">{t("contactEmail")} *</label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 text-sm focus:outline-none focus:border-brand-red"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">{t("contactMessage")} *</label>
                      <textarea
                        rows={5}
                        required
                        value={msg}
                        onChange={(e) => setMsg(e.target.value)}
                        className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 text-sm focus:outline-none focus:border-brand-red resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-3 bg-brand-red hover:bg-brand-red-hover text-white text-sm font-bold rounded-lg transition duration-200 shadow flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        t("contactSubmit")
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
}