"use client";

import React from "react";
import {
  BookOpen,
  Car,
  MapPin,
  Tag,
  MessageSquare,
  Edit3,
  Mail,
  LogOut,
  Shield,
  Layout,
  Blocks,
  Boxes,
  PanelTop,
  Contact,  
} from "lucide-react";

export default function AdminSidebar({ activeTab, setActiveTab, adminUser, logoutAdmin, router }) {
  return (
    <div className="lg:col-span-3 glass-panel rounded-xl p-3 flex flex-col space-y-1.5 text-xs font-bold text-slate-500">
      <button
        onClick={() => setActiveTab("bookings")}
        className={`w-full text-left px-4 py-2.5 rounded-lg transition flex items-center space-x-2.5 ${
          activeTab === "bookings"
            ? "bg-brand-red text-white"
            : "hover:bg-slate-50 hover:text-slate-800"
        }`}
      >
        <BookOpen className="w-4 h-4" /> <span>Rezerwacje / Bookings</span>
      </button>
      <button
        onClick={() => setActiveTab("fleet")}
        className={`w-full text-left px-4 py-2.5 rounded-lg transition flex items-center space-x-2.5 ${
          activeTab === "fleet"
            ? "bg-brand-red text-white"
            : "hover:bg-slate-50 hover:text-slate-800"
        }`}
      >
        <Car className="w-4 h-4" /> <span>Flota Pojazdów / Fleet</span>
      </button>
      <button
        onClick={() => setActiveTab("locations")}
        className={`w-full text-left px-4 py-2.5 rounded-lg transition flex items-center space-x-2.5 ${
          activeTab === "locations"
            ? "bg-brand-red text-white"
            : "hover:bg-slate-50 hover:text-slate-800"
        }`}
      >
        <MapPin className="w-4 h-4" />{" "}
        <span>Punkty Odbioru / Locations</span>
      </button>
      <button
        onClick={() => setActiveTab("reviews")}
        className={`w-full text-left px-4 py-2.5 rounded-lg transition flex items-center space-x-2.5 ${
          activeTab === "reviews"
            ? "bg-brand-red text-white"
            : "hover:bg-slate-50 hover:text-slate-800"
        }`}
      >
        <MessageSquare className="w-4 h-4" />{" "}
        <span>Moderacja Opinii / Reviews</span>
      </button>
      <button
        onClick={() => setActiveTab("cms")}
        className={`w-full text-left px-4 py-2.5 rounded-lg transition flex items-center space-x-2.5 ${
          activeTab === "cms" ? "bg-brand-red text-white" : "hover:bg-slate-50 hover:text-slate-800"
        }`}
      >
        <Layout className="w-4 h-4" /> <span>Zarządzanie CMS / CMS Manager</span>
      </button>

      <button
        onClick={() => setActiveTab("addons")}
        className={`w-full text-left px-4 py-2.5 rounded-lg transition flex items-center space-x-2.5 ${
          activeTab === "addons"
            ? "bg-brand-red text-white"
            : "hover:bg-slate-50 hover:text-slate-800"
        }`}
      >
        <Blocks className="w-4 h-4" /> <span>Dodatki / Add-ons</span>
      </button>
            <button
        onClick={() => setActiveTab("packages")}
        className={`w-full text-left px-4 py-2.5 rounded-lg transition flex items-center space-x-2.5 ${
          activeTab === "packages"
            ? "bg-brand-red text-white"
            : "hover:bg-slate-50 hover:text-slate-800"
        }`}
      >
        <Boxes className="w-4 h-4" /> <span>Pakiety Ochrony / Packages</span>
      </button>
                  <button
        onClick={() => setActiveTab("blog")}
        className={`w-full text-left px-4 py-2.5 rounded-lg transition flex items-center space-x-2.5 ${
          activeTab === "blog"
            ? "bg-brand-red text-white"
            : "hover:bg-slate-50 hover:text-slate-800"
        }`}
      >
        <PanelTop className="w-4 h-4" /> <span>Blog / Artykuły</span>
      </button>
                  <button
        onClick={() => setActiveTab("contact")}
        className={`w-full text-left px-4 py-2.5 rounded-lg transition flex items-center space-x-2.5 ${
          activeTab === "contact"
            ? "bg-brand-red text-white"
            : "hover:bg-slate-50 hover:text-slate-800"
        }`}
      >
        <Contact className="w-4 h-4" /> <span>Wiadomości / Contact</span>
      </button>
      <button
        onClick={() => setActiveTab("emails")}
        className={`w-full text-left px-4 py-2.5 rounded-lg transition flex items-center space-x-2.5 ${
          activeTab === "emails"
            ? "bg-brand-red text-white"
            : "hover:bg-slate-50 hover:text-slate-800"
        }`}
      >
        <Mail className="w-4 h-4" /> <span>Poczta i Logi / Email logs</span>
      </button>
    </div>
  );
}