"use client";

// import SidebarCTA from "@/app/components/SidebarCTA";
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
        const API_URL =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

        const response = await fetch(`${API_URL}/api/contacts`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name,
            email: email,
            message: msg,
            captchaToken: "dummy_token_for_testing",
          }),
        });

        if (!response.ok) {
          throw new Error(`API Error: ${response.status}`);
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
            ? "Wystąpił błąd podczas wysyłania wiadomości. Spróbuj ponownie."
            : "An error occurred while sending the message. Please try again.",
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
                      Skontaktujemy się z Tobą wkrótce.
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
