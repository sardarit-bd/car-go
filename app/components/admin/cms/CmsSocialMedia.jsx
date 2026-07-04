"use client";

import React, { useState, useEffect } from "react";
import api from "@/lib/axios";
import * as yup from "yup";
import { Save, Plus, Trash2, Edit2, X } from "lucide-react";

const socialSchema = yup.object().shape({
  platform: yup.string().required("Platform is required"),
  url: yup.string().url("Must be a valid URL").required("URL is required"),
  order: yup.number().required("Order is required").min(0),
  isActive: yup.boolean().required(),
});

export default function CmsSocialMedia() {
  const [socials, setSocials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [editingSocial, setEditingSocial] = useState(null);
  const [socialForm, setSocialForm] = useState({ platform: "", url: "", order: 0, isActive: true });

  useEffect(() => { fetchSocials(); }, []);

  const fetchSocials = async () => {
    try {
      const res = await api.get("/api/admin/cms/social-media");
      setSocials(res.data.data || res.data);
    } catch (err) { console.error(err); }
  };

  const handleSaveSocial = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    try {
      await socialSchema.validate(socialForm, { abortEarly: false });
      setLoading(true);
      if (editingSocial) {
        await api.put(`/api/admin/cms/social-media/${editingSocial.id}`, socialForm);
      } else {
        await api.post("/api/admin/cms/social-media", socialForm);
      }
      setSuccess("Social media saved!");
      setEditingSocial(null);
      setSocialForm({ platform: "", url: "", order: socials.length, isActive: true });
      fetchSocials();
    } catch (err) {
      if (err.name === "ValidationError") setError(err.inner.map(e => e.message).join(", "));
      else setError("Failed to save social media.");
    } finally { setLoading(false); }
  };

  const handleDeleteSocial = async (id) => {
    if (confirm("Delete this social link?")) {
      try {
        await api.delete(`/api/admin/cms/social-media/${id}`);
        fetchSocials();
      } catch (err) { setError("Failed to delete."); }
    }
  };

  return (
    <div className="glass-panel p-6 rounded-2xl space-y-4">
      <h2 className="text-base font-extrabold text-slate-800 border-b border-slate-100 pb-2.5 uppercase tracking-wider">
        Social Media Links
      </h2>
      {error && <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm font-bold">{error}</div>}
      {success && <div className="p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm font-bold">{success}</div>}

      <form onSubmit={handleSaveSocial} className="grid grid-cols-1 md:grid-cols-12 gap-4 text-xs font-bold text-slate-500 items-end">
        <div className="md:col-span-3">
          <label className="block mb-1">Platform (e.g., Facebook)</label>
          <input type="text" value={socialForm.platform} onChange={(e) => setSocialForm({...socialForm, platform: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-200 rounded text-slate-800 focus:outline-none focus:border-brand-red" />
        </div>
        <div className="md:col-span-5">
          <label className="block mb-1">URL</label>
          <input type="text" value={socialForm.url} onChange={(e) => setSocialForm({...socialForm, url: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-200 rounded text-slate-800 focus:outline-none focus:border-brand-red" />
        </div>
        <div className="md:col-span-1">
          <label className="block mb-1">Order</label>
          <input type="number" value={socialForm.order} onChange={(e) => setSocialForm({...socialForm, order: parseInt(e.target.value) || 0})} className="w-full px-3 py-2 bg-white border border-slate-200 rounded text-slate-800 focus:outline-none focus:border-brand-red" />
        </div>
        <div className="md:col-span-1 flex items-center gap-2 h-[38px]">
          <input type="checkbox" checked={socialForm.isActive} onChange={(e) => setSocialForm({...socialForm, isActive: e.target.checked})} className="w-4 h-4 accent-brand-red" />
        </div>
        <div className="md:col-span-2 flex gap-2">
          <button type="submit" disabled={loading} className="flex-1 py-2 bg-brand-red hover:bg-brand-red-hover text-white font-bold rounded transition flex items-center justify-center gap-1">
            {loading ? "..." : (editingSocial ? "Update" : <><Plus className="w-4 h-4" /> Add</>)}
          </button>
          {editingSocial && (
            <button type="button" onClick={() => setEditingSocial(null)} className="py-2 px-3 bg-slate-200 text-slate-700 font-bold rounded transition">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </form>

      <div className="space-y-2 mt-6">
        {[...socials].sort((a,b) => a.order - b.order).map((s) => (
          <div key={s.id} className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-lg">
            <div className="flex items-center gap-3">
              <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${s.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {s.isActive ? 'ACTIVE' : 'INACTIVE'}
              </span>
              <div>
                <p className="text-slate-800 font-bold text-sm">{s.platform}</p>
                <p className="text-slate-500 text-[10px] truncate max-w-xs">{s.url}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => { setEditingSocial(s); setSocialForm({ platform: s.platform, url: s.url, order: s.order, isActive: s.isActive }); }} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition"><Edit2 className="w-4 h-4" /></button>
              <button onClick={() => handleDeleteSocial(s.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded transition"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}