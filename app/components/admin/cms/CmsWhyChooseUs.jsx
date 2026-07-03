"use client";

import React, { useState, useEffect } from "react";
import api from "@/lib/axios";
import * as yup from "yup";
import { Save, Plus, Trash2, Edit2, X } from "lucide-react";

const whyUsSchema = yup.object().shape({
  subtitle: yup.string().required("Subtitle is required"),
  title: yup.string().required("Title is required"),
  mainImage: yup.string().required("Image path is required"),
});

const featureSchema = yup.object().shape({
  title: yup.string().required("Title is required"),
  description: yup.string().required("Description is required"),
  order: yup.number().required("Order is required").min(0),
  isActive: yup.boolean().required(),
});

export default function CmsWhyChooseUs() {
  const [whyUs, setWhyUs] = useState({ subtitle: "", title: "", mainImage: "" });
  const [whyUsId, setWhyUsId] = useState(null);
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [editingFeature, setEditingFeature] = useState(null);
  const [featureForm, setFeatureForm] = useState({ title: "", description: "", order: 0, isActive: true });

  useEffect(() => {
    fetchWhyUs();
    fetchFeatures();
  }, []);

  const fetchWhyUs = async () => {
    try {
      const res = await api.get("/api/admin/cms/why-choose-us");
      if (res.data.data) {
        setWhyUs(res.data.data);
        setWhyUsId(res.data.data.id);
      }
    } catch (err) { console.error(err); }
  };

  const fetchFeatures = async () => {
    try {
      const res = await api.get("/api/admin/cms/why-choose-us-feature");
      setFeatures(res.data.data || res.data);
    } catch (err) { console.error(err); }
  };

  const handleSaveWhyUs = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    try {
      await whyUsSchema.validate(whyUs, { abortEarly: false });
      setLoading(true);
      // Note: API expects JSON with image path. Ensure image is uploaded via other means or backend supports multipart.
      if (whyUsId) {
        await api.put(`/api/admin/cms/why-choose-us/${whyUsId}`, whyUs);
      } else {
        await api.post("/api/admin/cms/why-choose-us", whyUs);
      }
      setSuccess("Why Choose Us section updated!");
      fetchWhyUs();
    } catch (err) {
      if (err.name === "ValidationError") setError(err.inner.map(e => e.message).join(", "));
      else setError("Failed to save section.");
    } finally { setLoading(false); }
  };

  const handleSaveFeature = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    try {
      await featureSchema.validate(featureForm, { abortEarly: false });
      setLoading(true);
      if (editingFeature) {
        await api.put(`/api/admin/cms/why-choose-us-feature/${editingFeature.id}`, featureForm);
      } else {
        await api.post("/api/admin/cms/why-choose-us-feature", featureForm);
      }
      setSuccess("Feature saved!");
      setEditingFeature(null);
      setFeatureForm({ title: "", description: "", order: features.length, isActive: true });
      fetchFeatures();
    } catch (err) {
      if (err.name === "ValidationError") setError(err.inner.map(e => e.message).join(", "));
      else setError("Failed to save feature.");
    } finally { setLoading(false); }
  };

  const handleDeleteFeature = async (id) => {
    if (confirm("Delete this feature?")) {
      try {
        await api.delete(`/api/admin/cms/why-choose-us-feature/${id}`);
        fetchFeatures();
      } catch (err) { setError("Failed to delete feature."); }
    }
  };

  const startEditFeature = (f) => {
    setEditingFeature(f);
    setFeatureForm({ title: f.title, description: f.description, order: f.order, isActive: f.isActive });
  };

  return (
    <div className="space-y-6">
      <div className="glass-panel p-6 rounded-2xl space-y-4">
        <h2 className="text-base font-extrabold text-slate-800 border-b border-slate-100 pb-2.5 uppercase tracking-wider">
          Why Choose Us Section
        </h2>
        {error && <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm font-bold">{error}</div>}
        {success && <div className="p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm font-bold">{success}</div>}
        
        <form onSubmit={handleSaveWhyUs} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-bold text-slate-500">
          <div className="md:col-span-2">
            <label className="block mb-1">Subtitle</label>
            <input type="text" value={whyUs.subtitle} onChange={(e) => setWhyUs({...whyUs, subtitle: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-200 rounded text-slate-800 focus:outline-none focus:border-brand-red" />
          </div>
          <div className="md:col-span-2">
            <label className="block mb-1">Title</label>
            <input type="text" value={whyUs.title} onChange={(e) => setWhyUs({...whyUs, title: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-200 rounded text-slate-800 focus:outline-none focus:border-brand-red" />
          </div>
          <div className="md:col-span-2">
            <label className="block mb-1">Main Image Path (e.g., /uploads/car.jpg)</label>
            <input type="text" value={whyUs.mainImage} onChange={(e) => setWhyUs({...whyUs, mainImage: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-200 rounded text-slate-800 focus:outline-none focus:border-brand-red" placeholder="/uploads/image.jpg" />
          </div>
          <div className="md:col-span-2 pt-2">
            <button type="submit" disabled={loading} className="w-full py-3 bg-brand-red hover:bg-brand-red-hover text-white font-bold rounded transition flex items-center justify-center gap-2">
              {loading ? "Saving..." : <><Save className="w-4 h-4" /> Save Section</>}
            </button>
          </div>
        </form>
      </div>

      <div className="glass-panel p-6 rounded-2xl space-y-4">
        <h2 className="text-base font-extrabold text-slate-800 border-b border-slate-100 pb-2.5 uppercase tracking-wider">
          Why Choose Us Features
        </h2>
        
        <form onSubmit={handleSaveFeature} className="grid grid-cols-1 md:grid-cols-12 gap-4 text-xs font-bold text-slate-500 items-end">
          <div className="md:col-span-4">
            <label className="block mb-1">Title</label>
            <input type="text" value={featureForm.title} onChange={(e) => setFeatureForm({...featureForm, title: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-200 rounded text-slate-800 focus:outline-none focus:border-brand-red" />
          </div>
          <div className="md:col-span-4">
            <label className="block mb-1">Description</label>
            <input type="text" value={featureForm.description} onChange={(e) => setFeatureForm({...featureForm, description: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-200 rounded text-slate-800 focus:outline-none focus:border-brand-red" />
          </div>
          <div className="md:col-span-1">
            <label className="block mb-1">Order</label>
            <input type="number" value={featureForm.order} onChange={(e) => setFeatureForm({...featureForm, order: parseInt(e.target.value) || 0})} className="w-full px-3 py-2 bg-white border border-slate-200 rounded text-slate-800 focus:outline-none focus:border-brand-red" />
          </div>
          <div className="md:col-span-1 flex items-center gap-2 h-[38px]">
            <input type="checkbox" checked={featureForm.isActive} onChange={(e) => setFeatureForm({...featureForm, isActive: e.target.checked})} className="w-4 h-4 accent-brand-red" />
          </div>
          <div className="md:col-span-2 flex gap-2">
            <button type="submit" className="flex-1 py-2 bg-brand-red hover:bg-brand-red-hover text-white font-bold rounded transition flex items-center justify-center gap-1">
              {editingFeature ? "Update" : <><Plus className="w-4 h-4" /> Add</>}
            </button>
            {editingFeature && (
              <button type="button" onClick={() => setEditingFeature(null)} className="py-2 px-3 bg-slate-200 text-slate-700 font-bold rounded transition">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </form>

        <div className="space-y-2 mt-4">
          {[...features].sort((a,b) => a.order - b.order).map((f) => (
            <div key={f.id} className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-lg">
              <div>
                <p className="text-slate-800 font-bold text-sm">{f.title}</p>
                <p className="text-slate-500 text-xs">{f.description}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => startEditFeature(f)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition"><Edit2 className="w-4 h-4" /></button>
                <button onClick={() => handleDeleteFeature(f.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded transition"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}