"use client";

import React, { useState } from "react";
import { useApp } from "@/app/context/AppContext";
import { ShieldAlert, Layout, HelpCircle, FileText, Phone, Share2, Star } from "lucide-react";

import CmsHero from "./cms/CmsHero";
import CmsFaq from "./cms/CmsFaq";
import CmsPages from "./cms/CmsPages";
import CmsContact from "./cms/CmsContact";
import CmsSocialMedia from "./cms/CmsSocialMedia";
import CmsWhyChooseUs from "./cms/CmsWhyChooseUs";

export default function CmsTab() {
  const { isOwner } = useApp();
  const [activeSection, setActiveSection] = useState("hero");

  if (!isOwner) {
    return (
      <div className="p-6 border border-brand-red/30 bg-brand-red/5 text-brand-red rounded-xl flex items-center space-x-2 text-sm font-bold">
        <ShieldAlert className="w-5 h-5 flex-shrink-0" />
        <span>Brak uprawnień. Sekcja CMS dostępna wyłącznie dla Właściciela (Owner).</span>
      </div>
    );
  }

  const sections = [
    { id: "hero", label: "Hero & Features", icon: Layout },
    { id: "why", label: "Why Choose Us", icon: Star },
    { id: "faq", label: "FAQ", icon: HelpCircle },
    { id: "pages", label: "Pages (Privacy/Terms)", icon: FileText },
    { id: "contact", label: "Contact Info", icon: Phone },
    { id: "social", label: "Social Media", icon: Share2 },
  ];

  return (
    <div className="space-y-6">
      {/* Internal Sub-navigation */}
      <div className="glass-panel p-2 rounded-xl flex flex-wrap gap-2">
        {sections.map((sec) => {
          const Icon = sec.icon;
          return (
            <button
              key={sec.id}
              onClick={() => setActiveSection(sec.id)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center space-x-2 ${
                activeSection === sec.id
                  ? "bg-brand-red text-white"
                  : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{sec.label}</span>
            </button>
          );
        })}
      </div>

      {/* Content Area */}
      {activeSection === "hero" && <CmsHero />}
      {activeSection === "why" && <CmsWhyChooseUs />}
      {activeSection === "faq" && <CmsFaq />}
      {activeSection === "pages" && <CmsPages />}
      {activeSection === "contact" && <CmsContact />}
      {activeSection === "social" && <CmsSocialMedia />}
    </div>
  );
}