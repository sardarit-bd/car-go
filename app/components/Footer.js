"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useApp } from "@/app/context/AppContext";
import { Mail, Phone, MapPin, Facebook, Instagram, Send, Check } from "lucide-react";

export default function Footer() {
  const { lang, t, logEmail } = useApp();
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formMsg, setFormMsg] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formName && formEmail && formMsg) {
      // Create a simulated log in emails database
      logEmail({
        id: "contact_" + Math.random().toString(36).substr(2, 9),
        to: "reservations@car-go.pl",
        subject: `[CAR-GO.PL Contact Form] Message from ${formName}`,
        body: `
Sender Name: ${formName}
Sender Email: ${formEmail}

Message:
${formMsg}
        `,
        date: new Date().toLocaleString()
      });

      setSent(true);
      setFormName("");
      setFormEmail("");
      setFormMsg("");

      setTimeout(() => {
        setSent(false);
      }, 5000);
    }
  };

  return (
    <footer className="bg-brand-dark/90 border-t border-brand-accent mt-auto pt-12 pb-6 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
        
        {/* Company & Info Column */}
        <div className="space-y-4">
          <Link href="/" className="flex items-center group">
            <div className="relative flex items-center justify-center">
              <img
                src="/logo-footer.png"
                alt="CAR-GO.PL"
                className="h-32 w-32 object-cover rounded-full block border-2 border-brand-red shadow-lg"
                onError={(e) => {
                  e.target.style.display = "none";
                  const fallback = e.target.nextSibling;
                  if (fallback) fallback.style.display = "flex";
                }}
              />
              <div style={{ display: "none" }} className="items-center space-x-6">
                <div className="relative w-32 h-32 bg-slate-800 border-2 border-brand-red rounded-full flex items-center justify-center p-5 shadow-lg">
                  <svg className="w-full h-full text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 8.5c.3 0 .5.2.5.5v1.5c0 .3-.2.5-.5.5h-1v-2h1z" fill="#FF0000" />
                    <path d="M21 11.5l-1.5-3.5c-.3-.7-1-1.2-1.8-1.2H7.3c-.8 0-1.5.5-1.8 1.2L4 11.5c-.5.3-.8.8-.8 1.4v2.6c0 .8.7 1.5 1.5 1.5h.7c.3-.8 1.1-1.3 2-1.3.9 0 1.7.5 2 1.3h5.2c.3-.8 1.1-1.3 2-1.3.9 0 1.7.5 2 1.3h.7c.8 0 1.5-.7 1.5-1.5v-2.6c0-.6-.3-1.1-.8-1.4zM7 16c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1zm10 0c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1z" />
                  </svg>
                </div>
                <span className="text-4xl font-black tracking-tight select-none">
                  <span className="italic text-white">CAR</span>
                  <span className="italic text-brand-red">-GO</span>
                  <span className="text-base text-gray-500 font-normal ml-1">.PL</span>
                </span>
              </div>
            </div>
          </Link>
          <p className="text-xs text-gray-400 leading-relaxed">
            {t("aboutText").slice(0, 140)}...
          </p>
          <div className="space-y-2 text-xs text-gray-300">
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-brand-red" />
              <span>Skarbimierz-Osiedle, Polska</span>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4 text-gray-500" />
              <span>+48 789 200 100</span>
            </div>
            <div className="flex items-center space-x-2">
              <Mail className="w-4 h-4 text-gray-500" />
              <span>reservations@car-go.pl</span>
            </div>
          </div>
        </div>

        {/* Navigation & Policies Column */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider">{t("navTerms")} & Info</h4>
          <ul className="space-y-2 text-xs text-gray-400">
            <li>
              <Link href="/faq" className="hover:text-brand-red transition">FAQ - Najczęściej Zadawane Pytania</Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-brand-red transition">{t("navTerms")}</Link>
            </li>
            <li>
              <Link href="/privacy" className="hover:text-brand-red transition">Polityka Prywatności</Link>
            </li>
            <li>
              <Link href="/privacy" className="hover:text-brand-red transition">Polityka Cookies (Ciasteczka)</Link>
            </li>
          </ul>
          <h4 className="text-xs font-bold text-white uppercase tracking-wider pt-2">Lokalizacje / Locations</h4>
          <p className="text-[11px] text-gray-400 leading-relaxed">
            Skarbimierz-Osiedle, Brzeg, Oława, Grodków, Dostawa pod wskazany adres (Custom Address).
          </p>
        </div>

        {/* Payment & Social Media Column */}
        <div className="space-y-4">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider">Płatności / Payments</h4>
          <div className="grid grid-cols-3 gap-2 max-w-[180px]">
            <div className="bg-brand-accent/40 border border-brand-accent rounded p-1 flex items-center justify-center text-[10px] text-gray-400 font-bold" title="BLIK">
              BLIK
            </div>
            <div className="bg-brand-accent/40 border border-brand-accent rounded p-1 flex items-center justify-center text-[10px] text-gray-400 font-bold" title="Przelewy24">
              P24
            </div>
            <div className="bg-brand-accent/40 border border-brand-accent rounded p-1 flex items-center justify-center text-[10px] text-gray-400 font-bold" title="Autopay">
              Autopay
            </div>
            <div className="bg-brand-accent/40 border border-brand-accent rounded p-1 flex items-center justify-center text-[10px] text-gray-400 font-bold col-span-3" title="Cash / Card at Pickup">
              Cash / Card at Pickup
            </div>
          </div>

          <h4 className="text-sm font-bold text-white uppercase tracking-wider pt-2">Social Media</h4>
          <div className="flex space-x-3">
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full border border-brand-accent flex items-center justify-center text-gray-400 hover:text-white hover:border-brand-red hover:bg-brand-red/10 transition">
              <Facebook className="w-4 h-4" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full border border-brand-accent flex items-center justify-center text-gray-400 hover:text-white hover:border-brand-red hover:bg-brand-red/10 transition">
              <Instagram className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Direct Contact Form Column */}
        <div className="space-y-4">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider">{t("contactFormTitle")}</h4>
          <form onSubmit={handleSubmit} className="space-y-2.5">
            <div>
              <input
                type="text"
                required
                placeholder={t("contactName")}
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                className="w-full px-3 py-1.5 bg-brand-accent/30 border border-brand-accent focus:border-brand-red rounded focus:outline-none text-xs text-white placeholder-gray-500"
              />
            </div>
            <div>
              <input
                type="email"
                required
                placeholder={t("contactEmail")}
                value={formEmail}
                onChange={(e) => setFormEmail(e.target.value)}
                className="w-full px-3 py-1.5 bg-brand-accent/30 border border-brand-accent focus:border-brand-red rounded focus:outline-none text-xs text-white placeholder-gray-500"
              />
            </div>
            <div>
              <textarea
                rows={3}
                required
                placeholder={t("contactMessage")}
                value={formMsg}
                onChange={(e) => setFormMsg(e.target.value)}
                className="w-full px-3 py-1.5 bg-brand-accent/30 border border-brand-accent focus:border-brand-red rounded focus:outline-none text-xs text-white placeholder-gray-500 resize-none"
              />
            </div>
            <button
              type="submit"
              disabled={sent}
              className={`w-full py-2 flex items-center justify-center space-x-1.5 text-xs font-bold rounded transition text-white ${
                sent ? "bg-green-600 cursor-default" : "bg-brand-red hover:bg-brand-red-hover"
              }`}
            >
              {sent ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Wysłano / Sent!</span>
                </>
              ) : (
                <>
                  <Send className="w-3 h-3" />
                  <span>{t("contactSubmit")}</span>
                </>
              )}
            </button>
          </form>
        </div>

      </div>

      {/* Copyright Bar */}
      <div className="border-t border-brand-accent/40 pt-6 flex flex-col sm:flex-row justify-between items-center text-xs text-gray-500 max-w-7xl mx-auto space-y-2.5 sm:space-y-0">
        <div>
          © {new Date().getFullYear()} CAR-GO.PL. All rights reserved.
        </div>
        <div className="flex space-x-4">
          <span>Obsługa techniczna: Hostinger</span>
          <span>Domena ważna do: 12.08.2026</span>
        </div>
      </div>
    </footer>
  );
}
