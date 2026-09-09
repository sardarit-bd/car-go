"use client";
import React, { useState, useEffect } from "react";
import axios from "@/lib/axios";
import { useApp } from "@/app/context/AppContext";

export default function EmailsTab() {
  const { t } = useApp();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  
  const [settings, setSettings] = useState({
    logoUrl: "",
    primaryColor: "#dc2626",
    companyPhone: "+48 459 111 828",
    companyEmail: "rezerwacje@car-go.pl",
    website: "www.car-go.pl",
    signature: "Z poważaniem,<br>Zespół CAR-GO",
    facebookUrl: "",
    instagramUrl: "",
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await axios.get("/cms/email-settings");
      if (res.data.success && res.data.data) {
        setSettings(prev => ({ ...prev, ...res.data.data }));
      }
    } catch (error) {
      console.error("Failed to fetch email settings", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: "", text: "" });
    try {
      const res = await axios.put("/cms/email-settings", settings);
      if (res.data.success) {
        setMessage({ type: "success", text: "Email settings saved successfully!" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Failed to save settings. Please try again." });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500">Loading email settings...</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-xl font-extrabold text-slate-800 mb-6 uppercase tracking-wide">Email Settings</h2>
      
      {message.text && (
        <div className={`p-3 mb-4 rounded-lg text-sm font-bold ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-5 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1">Logo URL</label>
          <input type="text" name="logoUrl" value={settings.logoUrl} onChange={handleChange} placeholder="https://car-go.pl/logo.png" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-red focus:border-transparent" />
        </div>
        
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1">Primary Brand Color</label>
          <div className="flex items-center gap-3">
            <input type="color" name="primaryColor" value={settings.primaryColor} onChange={handleChange} className="w-12 h-10 border border-slate-300 rounded cursor-pointer" />
            <span className="text-sm text-slate-500 font-mono">{settings.primaryColor}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Company Phone</label>
            <input type="text" name="companyPhone" value={settings.companyPhone} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Company Email</label>
            <input type="email" name="companyEmail" value={settings.companyEmail} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1">Website URL</label>
          <input type="text" name="website" value={settings.website} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" />
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1">Email Signature (HTML allowed)</label>
          <textarea name="signature" value={settings.signature} onChange={handleChange} rows="3" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Facebook URL</label>
            <input type="text" name="facebookUrl" value={settings.facebookUrl} onChange={handleChange} placeholder="https://facebook.com/..." className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Instagram URL</label>
            <input type="text" name="instagramUrl" value={settings.instagramUrl} onChange={handleChange} placeholder="https://instagram.com/..." className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" />
          </div>
        </div>

        <button type="submit" disabled={saving} className="w-full bg-brand-red hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition disabled:opacity-50 uppercase tracking-wide text-sm">
          {saving ? "Saving..." : "Save Email Settings"}
        </button>
      </form>
    </div>
  );
}