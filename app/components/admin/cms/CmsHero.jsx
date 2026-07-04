"use client";

import React, { useState, useEffect } from "react";
import api from "@/lib/axios";
import * as yup from "yup";
import { Save, Plus, Trash2, Edit2, X } from "lucide-react";

const heroSchema = yup.object().shape({
  taglinePl: yup.string(),
  taglineEn: yup.string(),
  titlePl: yup.string().required("Title PL is required"),
  titleEn: yup.string().required("Title EN is required"),
  subtitlePl: yup.string().required("Subtitle PL is required"),
  subtitleEn: yup.string().required("Subtitle EN is required"),
});

const featureSchema = yup.object().shape({
  textPl: yup.string().required("Feature text PL is required"),
  textEn: yup.string().required("Feature text EN is required"),
  order: yup.number().required("Order is required").min(0),
  isActive: yup.boolean().required(),
});

export default function CmsHero() {
  const [hero, setHero] = useState({ taglinePl: "", taglineEn: "", titlePl: "", titleEn: "", subtitlePl: "", subtitleEn: "" });
  const [heroId, setHeroId] = useState(null);
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [editingFeature, setEditingFeature] = useState(null);
  const [featureForm, setFeatureForm] = useState({ textPl: "", textEn: "", order: 0, isActive: true });

  useEffect(() => {
    fetchHero();
    fetchFeatures();
  }, []);

  const fetchHero = async () => {
    try {
      const res = await api.get("/api/admin/cms/hero");
      if (res.data.data) {
        setHero({
          taglinePl: res.data.data.taglinePl || "",
          taglineEn: res.data.data.taglineEn || "",
          titlePl: res.data.data.titlePl || "",
          titleEn: res.data.data.titleEn || "",
          subtitlePl: res.data.data.subtitlePl || "",
          subtitleEn: res.data.data.subtitleEn || "",
        });
        setHeroId(res.data.data.id);
      }
    } catch (err) { console.error(err); }
  };

  const fetchFeatures = async () => {
    try {
      const res = await api.get("/api/admin/cms/hero-feature");
      setFeatures(res.data.data || res.data);
    } catch (err) { console.error(err); }
  };

  const handleSaveHero = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    try {
      await heroSchema.validate(hero, { abortEarly: false });
      setLoading(true);
      if (heroId) {
        await api.put(`/api/admin/cms/hero/${heroId}`, hero);
      } else {
        await api.post("/api/admin/cms/hero", hero);
      }
      setSuccess("Hero section updated successfully!");
      fetchHero();
    } catch (err) {
      if (err.name === "ValidationError") setError(err.inner.map(e => e.message).join(", "));
      else setError("Failed to save hero section.");
    } finally { setLoading(false); }
  };

  const handleSaveFeature = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    try {
      await featureSchema.validate(featureForm, { abortEarly: false });
      setLoading(true);
      if (editingFeature) {
        await api.put(`/api/admin/cms/hero-feature/${editingFeature.id}`, featureForm);
      } else {
        await api.post("/api/admin/cms/hero-feature", featureForm);
      }
      setSuccess("Feature saved successfully!");
      setEditingFeature(null);
      setFeatureForm({ textPl: "", textEn: "", order: features.length, isActive: true });
      fetchFeatures();
    } catch (err) {
      if (err.name === "ValidationError") setError(err.inner.map(e => e.message).join(", "));
      else setError("Failed to save feature.");
    } finally { setLoading(false); }
  };

  const handleDeleteFeature = async (id) => {
    if (confirm("Delete this feature?")) {
      try {
        await api.delete(`/api/admin/cms/hero-feature/${id}`);
        fetchFeatures();
      } catch (err) { setError("Failed to delete feature."); }
    }
  };

  const startEditFeature = (f) => {
    setEditingFeature(f);
    setFeatureForm({ textPl: f.textPl || "", textEn: f.textEn || "", order: f.order, isActive: f.isActive });
  };

  const cancelEditFeature = () => {
    setEditingFeature(null);
    setFeatureForm({ textPl: "", textEn: "", order: features.length, isActive: true });
  };

  return (
    <div className="space-y-6">
      {/* Hero Section Form */}
      <div className="glass-panel p-6 rounded-2xl space-y-4">
        <h2 className="text-base font-extrabold text-slate-800 border-b border-slate-100 pb-2.5 uppercase tracking-wider">
          Hero Section
        </h2>
        {error && <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm font-bold">{error}</div>}
        {success && <div className="p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm font-bold">{success}</div>}
        
        <form onSubmit={handleSaveHero} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-bold text-slate-500">
          <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1">Tagline (PL)</label>
              <input type="text" value={hero.taglinePl} onChange={(e) => setHero({...hero, taglinePl: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-200 rounded text-slate-800 focus:outline-none focus:border-brand-red" />
            </div>
            <div>
              <label className="block mb-1">Tagline (EN)</label>
              <input type="text" value={hero.taglineEn} onChange={(e) => setHero({...hero, taglineEn: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-200 rounded text-slate-800 focus:outline-none focus:border-brand-red" />
            </div>
          </div>
          <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1">Title (PL) *</label>
              <input type="text" value={hero.titlePl} onChange={(e) => setHero({...hero, titlePl: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-200 rounded text-slate-800 focus:outline-none focus:border-brand-red" />
            </div>
            <div>
              <label className="block mb-1">Title (EN) *</label>
              <input type="text" value={hero.titleEn} onChange={(e) => setHero({...hero, titleEn: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-200 rounded text-slate-800 focus:outline-none focus:border-brand-red" />
            </div>
          </div>
          <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1">Subtitle (PL) *</label>
              <textarea value={hero.subtitlePl} onChange={(e) => setHero({...hero, subtitlePl: e.target.value})} rows="2" className="w-full px-3 py-2 bg-white border border-slate-200 rounded text-slate-800 focus:outline-none focus:border-brand-red resize-none" />
            </div>
            <div>
              <label className="block mb-1">Subtitle (EN) *</label>
              <textarea value={hero.subtitleEn} onChange={(e) => setHero({...hero, subtitleEn: e.target.value})} rows="2" className="w-full px-3 py-2 bg-white border border-slate-200 rounded text-slate-800 focus:outline-none focus:border-brand-red resize-none" />
            </div>
          </div>
          <div className="md:col-span-2 pt-2">
            <button type="submit" disabled={loading} className="w-full py-3 bg-brand-red hover:bg-brand-red-hover text-white font-bold rounded transition flex items-center justify-center gap-2">
              {loading ? "Saving..." : <><Save className="w-4 h-4" /> Save Hero</>}
            </button>
          </div>
        </form>
      </div>

      {/* Hero Features */}
      <div className="glass-panel p-6 rounded-2xl space-y-4">
        <h2 className="text-base font-extrabold text-slate-800 border-b border-slate-100 pb-2.5 uppercase tracking-wider">
          Hero Features
        </h2>
        
        <form onSubmit={handleSaveFeature} className="grid grid-cols-1 md:grid-cols-12 gap-4 text-xs font-bold text-slate-500 items-end">
          <div className="md:col-span-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1">Text (PL) *</label>
              <input type="text" value={featureForm.textPl} onChange={(e) => setFeatureForm({...featureForm, textPl: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-200 rounded text-slate-800 focus:outline-none focus:border-brand-red" />
            </div>
            <div>
              <label className="block mb-1">Text (EN) *</label>
              <input type="text" value={featureForm.textEn} onChange={(e) => setFeatureForm({...featureForm, textEn: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-200 rounded text-slate-800 focus:outline-none focus:border-brand-red" />
            </div>
          </div>
          <div className="md:col-span-2">
            <label className="block mb-1">Order</label>
            <input type="number" value={featureForm.order} onChange={(e) => setFeatureForm({...featureForm, order: parseInt(e.target.value) || 0})} className="w-full px-3 py-2 bg-white border border-slate-200 rounded text-slate-800 focus:outline-none focus:border-brand-red" />
          </div>
          <div className="md:col-span-2 flex items-center gap-2 h-[38px]">
            <input type="checkbox" checked={featureForm.isActive} onChange={(e) => setFeatureForm({...featureForm, isActive: e.target.checked})} className="w-4 h-4 accent-brand-red" />
            <span>Active</span>
          </div>
          <div className="md:col-span-2 flex gap-2">
            <button type="submit" className="flex-1 py-2 bg-brand-red hover:bg-brand-red-hover text-white font-bold rounded transition flex items-center justify-center gap-1">
              {editingFeature ? "Update" : <><Plus className="w-4 h-4" /> Add</>}
            </button>
            {editingFeature && (
              <button type="button" onClick={cancelEditFeature} className="py-2 px-3 bg-slate-200 text-slate-700 font-bold rounded transition">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </form>

        <div className="space-y-2 mt-4">
          {features.length === 0 ? (
            <p className="text-center py-4 text-slate-400 text-sm">No features added yet.</p>
          ) : (
            [...features].sort((a,b) => a.order - b.order).map((f) => (
              <div key={f.id} className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-lg">
                <div className="flex-1 pr-4 grid grid-cols-2 gap-x-4">
                  <div>
                    <span className="text-[10px] font-bold text-blue-600">PL:</span>
                    <p className="text-slate-800 font-bold text-sm truncate">{f.textPl}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-green-600">EN:</span>
                    <p className="text-slate-800 font-bold text-sm truncate">{f.textEn}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${f.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {f.isActive ? 'ACTIVE' : 'INACTIVE'}
                  </span>
                  <button onClick={() => startEditFeature(f)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition"><Edit2 className="w-4 h-4" /></button>
                  <button onClick={() => handleDeleteFeature(f.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded transition"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}