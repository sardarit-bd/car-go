"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/app/context/AppContext";
import { ShieldAlert } from "lucide-react";

export default function ContentTab() {
  const { isOwner, cmsTexts, updateCmsText } = useApp();
  const [cmsHeaderPl, setCmsHeaderPl] = useState("");
  const [cmsHeaderEn, setCmsHeaderEn] = useState("");
  const [cmsSubheaderPl, setCmsSubheaderPl] = useState("");
  const [cmsSubheaderEn, setCmsSubheaderEn] = useState("");

  useEffect(() => {
    if (cmsTexts.homeHeader) {
      setCmsHeaderPl(cmsTexts.homeHeader.pl || "");
      setCmsHeaderEn(cmsTexts.homeHeader.en || "");
    }
    if (cmsTexts.homeSubheader) {
      setCmsSubheaderPl(cmsTexts.homeSubheader.pl || "");
      setCmsSubheaderEn(cmsTexts.homeSubheader.en || "");
    }
  }, [cmsTexts]);

  const handleSaveCmsTexts = (e) => {
    e.preventDefault();
    updateCmsText("homeHeader", cmsHeaderPl, cmsHeaderEn);
    updateCmsText("homeSubheader", cmsSubheaderPl, cmsSubheaderEn);
    alert("Treści CMS zaktualizowane pomyślnie!");
  };

  if (!isOwner) {
    return (
      <div className="p-6 border border-brand-red/30 bg-brand-red/5 text-brand-red rounded-xl flex items-center space-x-2 text-sm font-bold">
        <ShieldAlert className="w-5 h-5 flex-shrink-0" />
        <span>
          Brak uprawnień. Sekcja dostępna wyłącznie dla Właściciela
          (Owner).
        </span>
      </div>
    );
  }

  return (
    <div className="glass-panel p-6 rounded-2xl space-y-5">
      <h2 className="text-base font-extrabold text-slate-800 border-b border-slate-100 pb-3 uppercase tracking-wider">
        Edycja Pól Tekstowych Strony / Website Content Editor
      </h2>
      <form
        onSubmit={handleSaveCmsTexts}
        className="space-y-5 text-xs font-bold text-slate-500"
      >
        <div className="space-y-2 border-b border-slate-100 pb-4">
          <p className="text-sm font-extrabold text-slate-800">
            1. Nagłówek Główny (Hero Headline)
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1">Po polsku (PL)</label>
              <input
                type="text"
                value={cmsHeaderPl}
                onChange={(e) => setCmsHeaderPl(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded text-slate-800 focus:outline-none focus:border-brand-red"
              />
            </div>
            <div>
              <label className="block mb-1">Po angielsku (EN)</label>
              <input
                type="text"
                value={cmsHeaderEn}
                onChange={(e) => setCmsHeaderEn(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded text-slate-800 focus:outline-none focus:border-brand-red"
              />
            </div>
          </div>
        </div>
        <button
          type="submit"
          className="w-full py-2.5 bg-brand-red hover:bg-brand-red-hover text-white font-extrabold rounded transition shadow"
        >
          ZAPISZ TEKSTY / PUBLISH CMS CHANGES
        </button>
      </form>
    </div>
  );
}