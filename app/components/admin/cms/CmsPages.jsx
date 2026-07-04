"use client";

import React, { useState, useEffect } from "react";
import api from "@/lib/axios";
import * as yup from "yup";
import { Save } from "lucide-react";

const pageSchema = yup.object().shape({
  content: yup.string().required("Content is required"),
});

export default function CmsPages() {
  const [privacyForm, setPrivacyForm] = useState({ id: null, content: "" });
  const [termsForm, setTermsForm] = useState({ id: null, content: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => { fetchPages(); }, []);

  const fetchPages = async () => {
    try {
      const res = await api.get("/api/admin/cms/page");
      const pages = res.data.data || res.data;
      const privacy = pages.find(p => p.type === 'PRIVACY_POLICY');
      const terms = pages.find(p => p.type === 'TERMS_CONDITIONS');
      if (privacy) setPrivacyForm({ id: privacy.id, content: privacy.content });
      if (terms) setTermsForm({ id: terms.id, content: terms.content });
    } catch (err) { console.error(err); }
  };

  const handleSavePrivacy = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    try {
      await pageSchema.validate({ content: privacyForm.content }, { abortEarly: false });
      setLoading(true);
      if (privacyForm.id) {
        await api.put(`/api/admin/cms/page/${privacyForm.id}`, { content: privacyForm.content });
      } else {
        await api.post("/api/admin/cms/page", { type: 'PRIVACY_POLICY', content: privacyForm.content });
      }
      setSuccess("Privacy Policy updated!");
      fetchPages();
    } catch (err) {
      if (err.name === "ValidationError") setError(err.inner.map(e => e.message).join(", "));
      else setError("Failed to save Privacy Policy.");
    } finally { setLoading(false); }
  };

  const handleSaveTerms = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    try {
      await pageSchema.validate({ content: termsForm.content }, { abortEarly: false });
      setLoading(true);
      if (termsForm.id) {
        await api.put(`/api/admin/cms/page/${termsForm.id}`, { content: termsForm.content });
      } else {
        await api.post("/api/admin/cms/page", { type: 'TERMS_CONDITIONS', content: termsForm.content });
      }
      setSuccess("Terms & Conditions updated!");
      fetchPages();
    } catch (err) {
      if (err.name === "ValidationError") setError(err.inner.map(e => e.message).join(", "));
      else setError("Failed to save Terms.");
    } finally { setLoading(false); }
  };

  return (
    <div className="space-y-6">
      {error && <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm font-bold">{error}</div>}
      {success && <div className="p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm font-bold">{success}</div>}

      <div className="glass-panel p-6 rounded-2xl space-y-4">
        <h2 className="text-base font-extrabold text-slate-800 border-b border-slate-100 pb-2.5 uppercase tracking-wider">
          Privacy Policy
        </h2>
        <form onSubmit={handleSavePrivacy} className="space-y-4 text-xs font-bold text-slate-500">
          <textarea 
            value={privacyForm.content} 
            onChange={(e) => setPrivacyForm({...privacyForm, content: e.target.value})} 
            rows="10" 
            className="w-full px-3 py-2 bg-white border border-slate-200 rounded text-slate-800 focus:outline-none focus:border-brand-red resize-none font-mono text-[11px]" 
            placeholder="Privacy policy content..."
          />
          <button type="submit" disabled={loading} className="w-full py-3 bg-brand-red hover:bg-brand-red-hover text-white font-bold rounded transition flex items-center justify-center gap-2">
            {loading ? "Saving..." : <><Save className="w-4 h-4" /> Save Privacy Policy</>}
          </button>
        </form>
      </div>

      <div className="glass-panel p-6 rounded-2xl space-y-4">
        <h2 className="text-base font-extrabold text-slate-800 border-b border-slate-100 pb-2.5 uppercase tracking-wider">
          Terms & Conditions
        </h2>
        <form onSubmit={handleSaveTerms} className="space-y-4 text-xs font-bold text-slate-500">
          <textarea 
            value={termsForm.content} 
            onChange={(e) => setTermsForm({...termsForm, content: e.target.value})} 
            rows="10" 
            className="w-full px-3 py-2 bg-white border border-slate-200 rounded text-slate-800 focus:outline-none focus:border-brand-red resize-none font-mono text-[11px]" 
            placeholder="Terms and conditions content..."
          />
          <button type="submit" disabled={loading} className="w-full py-3 bg-brand-red hover:bg-brand-red-hover text-white font-bold rounded transition flex items-center justify-center gap-2">
            {loading ? "Saving..." : <><Save className="w-4 h-4" /> Save Terms & Conditions</>}
          </button>
        </form>
      </div>
    </div>
  );
}