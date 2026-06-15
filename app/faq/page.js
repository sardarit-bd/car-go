"use client";

import SidebarCTA from "@/app/components/SidebarCTA";
import { useApp } from "@/app/context/AppContext";
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react";
import { useState } from "react";

export default function FAQ() {
  const { lang, faqs, t } = useApp();
  const [openId, setOpenId] = useState(null);

  const toggleFAQ = (id) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8 animate-fade-in">

      {/* Title */}
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-extrabold text-slate-800 uppercase">{t("faqTitle")}</h1>
        <p className="text-sm font-semibold text-slate-500">
          {lang === "pl"
            ? "Masz pytania dotyczące wynajmu, kaucji lub ubezpieczenia? Sprawdź odpowiedzi na najczęściej zadawane pytania."
            : "Have questions about rental, deposit or insurance? Read the answers to frequently asked questions."}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Sticky Left Sidebar CTA Panel */}
        <div className="lg:col-span-4 sticky top-36 hidden lg:block">
          <SidebarCTA />
        </div>

        {/* Right Content */}
        <div className="lg:col-span-8 space-y-6">
          {/* Accordion list */}
          <div className="space-y-4">
            {faqs.map((faq) => {
              const isOpen = openId === faq.id;
              const question = lang === "pl" ? faq.questionPl : faq.questionEn;
              const answer = lang === "pl" ? faq.answerPl : faq.answerEn;

              return (
                <div
                  key={faq.id}
                  className="glass-panel rounded-xl overflow-hidden shadow-sm border border-slate-100 transition"
                >
                  <button
                    onClick={() => toggleFAQ(faq.id)}
                    className="w-full p-5 flex justify-between items-center text-left hover:bg-slate-50/70 transition focus:outline-none"
                  >
                    <span className="text-sm font-extrabold text-slate-800 flex items-center space-x-3">
                      <HelpCircle className="w-5 h-5 text-brand-red flex-shrink-0" />
                      <span>{question}</span>
                    </span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-brand-red flex-shrink-0 ml-2" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0 ml-2" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1.5 text-xs text-slate-650 leading-relaxed border-t border-slate-100 bg-slate-50/30 animate-fade-in font-medium">
                      <p>{answer}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Footer support prompt */}
          <div className="p-6 bg-slate-50 border border-slate-200/60 rounded-2xl text-center text-xs text-slate-500 leading-relaxed font-semibold">
            <p className="font-bold text-slate-800 mb-1">
              {lang === "pl" ? "Nie znalazłeś odpowiedzi na swoje pytanie?" : "Didn't find what you were looking for?"}
            </p>
            {lang === "pl" ? (
              <span>Skontaktuj się z nami bezpośrednio przez infolinię telefoniczną pod numerem <strong className="text-slate-800">+48 789 200 100</strong> lub napisz za pomocą formularza kontaktowego.</span>
            ) : (
              <span>Contact us directly via our phone hotline at <strong className="text-slate-800">+48 789 200 100</strong> or write to us using our contact form.</span>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
