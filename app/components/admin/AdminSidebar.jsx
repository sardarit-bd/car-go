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
        onClick={() => setActiveTab("content")}
        className={`w-full text-left px-4 py-2.5 rounded-lg transition flex items-center space-x-2.5 ${
          activeTab === "content"
            ? "bg-brand-red text-white"
            : "hover:bg-slate-50 hover:text-slate-800"
        }`}
      >
        <Edit3 className="w-4 h-4" /> <span>Edycja Treści / CMS Texts</span>
      </button>
      <button
        onClick={() => setActiveTab("pricing")}
        className={`w-full text-left px-4 py-2.5 rounded-lg transition flex items-center space-x-2.5 ${
          activeTab === "pricing"
            ? "bg-brand-red text-white"
            : "hover:bg-slate-50 hover:text-slate-800"
        }`}
      >
        <Tag className="w-4 h-4" /> <span>Cennik i Pakiety / Pricing</span>
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