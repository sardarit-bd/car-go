"use client";

import React, { useState, useEffect } from "react";
import api from "@/lib/axios";
import { Save, Plus, Trash2, Edit2, X } from "lucide-react";

export default function CmsWhyChooseUs() {
  const [whyUs, setWhyUs] = useState({ subtitlePl: "", subtitleEn: "", titlePl: "", titleEn: "" });
  const [whyUsId, setWhyUsId] = useState(null);
  
  // New states for image handling
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [fileInputKey, setFileInputKey] = useState(0); // Used to reset the file input visually

  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [editingFeature, setEditingFeature] = useState(null);
  const [featureForm, setFeatureForm] = useState({ titlePl: "", titleEn: "", descriptionPl: "", descriptionEn: "", order: 0, isActive: true });

  useEffect(() => {
    fetchWhyUs();
    fetchFeatures();
  }, []);

  const fetchWhyUs = async () => {
    try {
      const res = await api.get("/api/admin/cms/why-choose-us");
      if (res.data.data) {
        setWhyUs({
          subtitlePl: res.data.data.subtitlePl || "",
          subtitleEn: res.data.data.subtitleEn || "",
          titlePl: res.data.data.titlePl || "",
          titleEn: res.data.data.titleEn || "",
        });
        setWhyUsId(res.data.data.id);
        
        // Set image preview if an image already exists in the database
        if (res.data.data.mainImage) {
          setImagePreview(`${process.env.NEXT_PUBLIC_API_URL}${res.data.data.mainImage}`);
        }
      }
    } catch (err) { console.error(err); }
  };

  const fetchFeatures = async () => {
    try {
      const res = await api.get("/api/admin/cms/why-choose-us-feature");
      setFeatures(res.data.data || res.data);
    } catch (err) { console.error(err); }
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview("");
    setFileInputKey(prev => prev + 1); // Resets the file input element
  };

  const handleSaveWhyUs = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    
    if (!whyUs.titlePl || !whyUs.titleEn) {
      setError("Title PL and Title EN are required.");
      return;
    }

    try {
      setLoading(true);
      
      // Use FormData for multipart/form-data submission
      const formData = new FormData();
      formData.append("subtitlePl", whyUs.subtitlePl);
      formData.append("subtitleEn", whyUs.subtitleEn);
      formData.append("titlePl", whyUs.titlePl);
      formData.append("titleEn", whyUs.titleEn);
      
      if (imageFile) {
        formData.append("mainImage", imageFile);
      }

      if (whyUsId) {
        await api.put(`/api/admin/cms/why-choose-us/${whyUsId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await api.post("/api/admin/cms/why-choose-us", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      
      setSuccess("Why Choose Us section updated!");
      fetchWhyUs();
      clearImage(); // Clear the file input after successful save
    } catch (err) {
      setError("Failed to save section.");
    } finally { setLoading(false); }
  };

  const handleSaveFeature = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    try {
      if (!featureForm.titlePl || !featureForm.titleEn || !featureForm.descriptionPl || !featureForm.descriptionEn) {
        setError("All feature fields (PL and EN) are required.");
        return;
      }
      setLoading(true);
      if (editingFeature) {
        await api.put(`/api/admin/cms/why-choose-us-feature/${editingFeature.id}`, featureForm);
      } else {
        await api.post("/api/admin/cms/why-choose-us-feature", featureForm);
      }
      setSuccess("Feature saved!");
      setEditingFeature(null);
      setFeatureForm({ titlePl: "", titleEn: "", descriptionPl: "", descriptionEn: "", order: features.length, isActive: true });
      fetchFeatures();
    } catch (err) {
      setError("Failed to save feature.");
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
    setFeatureForm({ 
      titlePl: f.titlePl || "", titleEn: f.titleEn || "", 
      descriptionPl: f.descriptionPl || "", descriptionEn: f.descriptionEn || "", 
      order: f.order, isActive: f.isActive 
    });
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
          <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1">Subtitle (PL)</label>
              <input type="text" value={whyUs.subtitlePl} onChange={(e) => setWhyUs({...whyUs, subtitlePl: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-200 rounded text-slate-800 focus:outline-none focus:border-brand-red" />
            </div>
            <div>
              <label className="block mb-1">Subtitle (EN)</label>
              <input type="text" value={whyUs.subtitleEn} onChange={(e) => setWhyUs({...whyUs, subtitleEn: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-200 rounded text-slate-800 focus:outline-none focus:border-brand-red" />
            </div>
          </div>
          <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1">Title (PL) *</label>
              <input type="text" value={whyUs.titlePl} onChange={(e) => setWhyUs({...whyUs, titlePl: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-200 rounded text-slate-800 focus:outline-none focus:border-brand-red" />
            </div>
            <div>
              <label className="block mb-1">Title (EN) *</label>
              <input type="text" value={whyUs.titleEn} onChange={(e) => setWhyUs({...whyUs, titleEn: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-200 rounded text-slate-800 focus:outline-none focus:border-brand-red" />
            </div>
          </div>
          
          {/* IMAGE UPLOAD INPUT */}
          <div className="md:col-span-2">
            <label className="block mb-1">Main Image *</label>
            <input 
              key={fileInputKey}
              type="file" 
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  setImageFile(file);
                  setImagePreview(URL.createObjectURL(file));
                }
              }} 
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded text-slate-800 focus:outline-none focus:border-brand-red file:mr-4 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-brand-red/10 file:text-brand-red hover:file:bg-brand-red/20" 
            />
            {imagePreview && (
              <div className="mt-3 relative w-32 h-32 inline-block">
                <img src={imagePreview} alt="Main Image Preview" className="w-full h-full object-cover rounded border border-slate-200" />
                <button 
                  type="button" 
                  onClick={clearImage} 
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600 shadow-md"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>

          <div className="md:col-span-2 pt-2">
            <button type="submit" disabled={loading} className="w-full py-3 bg-brand-red hover:bg-brand-red-hover text-white font-bold rounded transition flex items-center justify-center gap-2">
              {loading ? "Saving..." : <><Save className="w-4 h-4" /> Save Section</>}
            </button>
          </div>
        </form>
      </div>

      {/* Features Section (Remains exactly the same as before) */}
      <div className="glass-panel p-6 rounded-2xl space-y-4">
        <h2 className="text-base font-extrabold text-slate-800 border-b border-slate-100 pb-2.5 uppercase tracking-wider">
          Why Choose Us Features
        </h2>
        
        <form onSubmit={handleSaveFeature} className="grid grid-cols-1 md:grid-cols-12 gap-4 text-xs font-bold text-slate-500 items-end">
          <div className="md:col-span-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1">Title (PL) *</label>
              <input type="text" value={featureForm.titlePl} onChange={(e) => setFeatureForm({...featureForm, titlePl: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-200 rounded text-slate-800 focus:outline-none focus:border-brand-red" />
            </div>
            <div>
              <label className="block mb-1">Title (EN) *</label>
              <input type="text" value={featureForm.titleEn} onChange={(e) => setFeatureForm({...featureForm, titleEn: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-200 rounded text-slate-800 focus:outline-none focus:border-brand-red" />
            </div>
          </div>
          <div className="md:col-span-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1">Description (PL) *</label>
              <input type="text" value={featureForm.descriptionPl} onChange={(e) => setFeatureForm({...featureForm, descriptionPl: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-200 rounded text-slate-800 focus:outline-none focus:border-brand-red" />
            </div>
            <div>
              <label className="block mb-1">Description (EN) *</label>
              <input type="text" value={featureForm.descriptionEn} onChange={(e) => setFeatureForm({...featureForm, descriptionEn: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-200 rounded text-slate-800 focus:outline-none focus:border-brand-red" />
            </div>
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
              <div className="flex-1 pr-4 grid grid-cols-2 gap-x-4">
                <div>
                  <span className="text-[10px] font-bold text-blue-600">PL:</span>
                  <p className="text-slate-800 font-bold text-sm truncate">{f.titlePl}</p>
                  <p className="text-slate-500 text-xs truncate">{f.descriptionPl}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-green-600">EN:</span>
                  <p className="text-slate-800 font-bold text-sm truncate">{f.titleEn}</p>
                  <p className="text-slate-500 text-xs truncate">{f.descriptionEn}</p>
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
          ))}
        </div>
      </div>
    </div>
  );
}