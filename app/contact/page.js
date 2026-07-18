"use client";

import { useApp } from "@/app/context/AppContext";
import {
  Clock,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Loader2,
  Lock,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Contact() {
  const { lang, t, logEmail, currentUser } = useApp();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [sent, setSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Pre-fill user data if logged in
  useEffect(() => {
    if (currentUser) {
      setName(
        `${currentUser.firstName || ""} ${currentUser.lastName || ""}`.trim(),
      );
      setEmail(currentUser.email || "");
    }
  }, [currentUser]);

  // AUTHENTICATION GATE: If not logged in, show a prompt to log in
  if (!currentUser) {
    return (
      <div className="container max-lg:py-20 mx-auto px-4 sm:px-6 min-h-[60vh] flex flex-col items-center justify-center text-center animate-fade-in">
        <div className="glass-panel p-8 rounded-2xl max-w-md w-full space-y-4">
          <Lock className="w-12 h-12 text-slate-400 mx-auto" />
          <h1 className="text-2xl font-extrabold text-slate-800 uppercase">
            {lang === "pl" ? "Wymagane Zalogowanie" : "Login Required"}
          </h1>
          <p className="text-sm font-semibold text-slate-500">
            {lang === "pl"
              ? "Aby wysłać wiadomość do naszego zespołu obsługi, musisz być zalogowany na swoje konto."
              : "To send a message to our support team, you must be logged into your account."}
          </p>
          <Link
            href="/account/login"
            className="inline-block w-full py-3 bg-brand-red hover:bg-brand-red-hover text-white text-sm font-bold rounded-lg transition shadow mt-2"
          >
            {lang === "pl" ? "Zaloguj się" : "Log In to Continue"}
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (name && email && msg) {
      setIsLoading(true);

      try {
        const API_URL =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

        const response = await fetch(`${API_URL}/api/contacts`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // If your backend requires auth for this route, uncomment the line below:
            // "Authorization": `Bearer ${typeof window !== 'undefined' ? localStorage.getItem("token") : ""}`
          },
          body: JSON.stringify({
            name: name,
            email: email,
            message: msg,
            // FIX: captchaToken removed as requested to prevent 400 Bad Request
          }),
        });

        if (!response.ok) {
          // Try to get specific error message from backend, fallback to status code
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `API Error: ${response.status}`);
        }

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
          date: new Date().toLocaleString(),
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
        alert(
          lang === "pl"
            ? `Wystąpił błąd: ${error.message}. Spróbuj ponownie.`
            : `An error occurred: ${error.message}. Please try again.`,
        );
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="container max-lg:py-20 mx-auto px-4 sm:px-6 space-y-12 animate-fade-in">
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-extrabold text-slate-800 uppercase">
          {t("navContact")}
        </h1>
        <p className="text-sm font-semibold text-slate-500">
          {lang === "pl"
            ? "Masz dodatkowe pytania? Skontaktuj się z naszą obsługą klienta telefonicznie lub napisz wiadomość."
            : "Have additional questions? Contact our customer support team by phone or write a message."}
        </p>
      </div>

      <div className="max-w-5xl mx-auto space-y-12">
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Left Side: Rental Info */}
            <div className="md:col-span-5 space-y-6">
              <div className="glass-panel p-6 rounded-2xl space-y-6">
                <h2 className="text-base font-extrabold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">
                  Dane Wypożyczalni / Rental Info:
                </h2>

                <div className="space-y-4 text-xs font-semibold text-slate-600">
                  <div className="flex items-start space-x-3.5">
                    <MapPin className="w-5 h-5 text-brand-red flex-shrink-0" />
                    <div>
                      <p className="text-slate-400 font-normal">
                        Siedziba i Baza Floty / Base Address:
                      </p>
                      <p className="text-slate-800 font-extrabold mt-0.5">
                        CAR-GO.PL Adam Rybiński
                      </p>
                      <p className="mt-0.5">
                        ul. Smaków 12, 49-318 Skarbimierz-Osiedle
                      </p>
                      <p className="text-[10px] text-slate-400">
                        Woj. opolskie, Polska
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3.5">
                    <Phone className="w-5 h-5 text-brand-red flex-shrink-0" />
                    <div>
                      <p className="text-slate-400 font-normal">
                        Infolinia rezerwacji / Phone hotline:
                      </p>
                      <p className="text-slate-800 font-extrabold mt-0.5">
                        +48 789 200 100
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3.5">
                    <Mail className="w-5 h-5 text-brand-red flex-shrink-0" />
                    <div>
                      <p className="text-slate-400 font-normal">
                        Kontakt e-mail / Email support:
                      </p>
                      <p className="text-slate-800 font-extrabold mt-0.5">
                        reservations@car-go.pl
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3.5">
                    <Clock className="w-5 h-5 text-slate-400 flex-shrink-0" />
                    <div>
                      <p className="text-slate-400 font-normal">
                        Godziny obsługi / Working Hours:
                      </p>
                      <p className="text-slate-800 mt-0.5">{t("phoneHours")}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side: Contact Form */}
            <div className="md:col-span-7">
              <div className="glass-panel p-6 rounded-2xl space-y-5">
                <h2 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2.5">
                  {t("contactFormTitle")}
                </h2>

                {sent ? (
                  <div className="p-8 border border-green-600/30 bg-green-50/50 rounded-xl text-center space-y-2 text-green-700 animate-fade-in">
                    <ShieldCheck className="w-10 h-10 mx-auto" />
                    <p className="text-sm font-bold">{t("contactSuccess")}</p>
                    <p className="text-xs text-slate-500">
                      {lang === "pl"
                        ? "Skontaktujemy się z Tobą wkrótce."
                        : "We will contact you shortly."}
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1">
                          {t("contactName")} *
                        </label>
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 text-sm focus:outline-none focus:border-brand-red"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1">
                          {t("contactEmail")} *
                        </label>
                        {/* Made readOnly to ensure the message is tied to the verified logged-in account */}
                        <input
                          type="email"
                          required
                          readOnly
                          value={email}
                          className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-600 text-sm cursor-not-allowed"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">
                        {t("contactMessage")} *
                      </label>
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
