"use client";

import { useApp } from "@/app/context/AppContext";
import { Clock, Mail, MapPin, Phone, ShieldCheck, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const DAY_ORDER = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
const DAY_LABELS = {
  mon: { pl: "Pon", en: "Mon" },
  tue: { pl: "Wt", en: "Tue" },
  wed: { pl: "Śr", en: "Wed" },
  thu: { pl: "Czw", en: "Thu" },
  fri: { pl: "Pt", en: "Fri" },
  sat: { pl: "Sob", en: "Sat" },
  sun: { pl: "Ndz", en: "Sun" },
};

export default function Contact() {
  const { lang, t, logEmail, currentUser, cmsContacts } = useApp();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [sent, setSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setName(
        `${currentUser.firstName || ""} ${currentUser.lastName || ""}`.trim(),
      );
      setEmail(currentUser.email || "");
    }
  }, [currentUser]);

  const getContact = (type) => cmsContacts.find((c) => c.type === type);
  const emailContact = getContact("EMAIL");
  const phoneContact = getContact("PHONE");
  const addressContact = getContact("ADDRESS");
  const hoursContact = getContact("HOURS");

  let parsedHours = null;
  if (hoursContact) {
    try {
      parsedHours = JSON.parse(hoursContact.value);
    } catch (e) {
      console.error("Failed to parse working hours:", e);
    }
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
          },
          body: JSON.stringify({
            name: name,
            email: email,
            message: msg,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `API Error: ${response.status}`);
        }

        logEmail({
          id: "contact_page_" + Math.random().toString(36).substr(2, 9),
          to: emailContact ? emailContact.value : "reservations@car-go.pl",
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
        setName(currentUser ? name : "");
        setEmail(currentUser ? email : "");
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
    <div className="container max-lg:py-20 min-h-screen flex justify-center items-center flex-col mx-auto px-4 sm:px-6 space-y-12 animate-fade-in">
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
                        {addressContact
                          ? addressContact.value
                          : "Skarbimierz-Osiedle, Polska"}
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
                        {phoneContact ? phoneContact.value : "+48 789 200 100"}
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
                        {emailContact
                          ? emailContact.value
                          : "reservations@car-go.pl"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3.5">
                    <Clock className="w-5 h-5 text-slate-400 flex-shrink-0" />
                    <div className="w-full">
                      <p className="text-slate-400 font-normal mb-1">
                        Godziny obsługi / Working Hours:
                      </p>
                      {parsedHours ? (
                        <div className="space-y-0.5">
                          {DAY_ORDER.map((dayKey) => {
                            const d = parsedHours[dayKey];
                            if (!d) return null;
                            return (
                              <div
                                key={dayKey}
                                className="flex justify-between text-slate-800"
                              >
                                <span className="text-slate-500">
                                  {
                                    DAY_LABELS[dayKey][
                                      lang === "pl" ? "pl" : "en"
                                    ]
                                  }
                                </span>
                                <span className="font-bold">
                                  {d.closed
                                    ? lang === "pl"
                                      ? "Zamknięte"
                                      : "Closed"
                                    : `${d.open} - ${d.close}`}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="text-slate-800 mt-0.5">
                          {t("phoneHours")}
                        </p>
                      )}
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
                        <input
                          type="email"
                          required
                          readOnly={!!currentUser}
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className={`w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-brand-red ${
                            currentUser
                              ? "bg-slate-50 text-slate-600 cursor-not-allowed"
                              : "bg-white text-slate-800"
                          }`}
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
