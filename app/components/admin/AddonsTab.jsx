"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/app/context/AppContext";
import { ShieldAlert, Trash2, Edit2, Plus, X } from "lucide-react";
import * as Yup from "yup";
import api from "@/lib/axios";

export default function AddonsTab() {
  const { isOwner } = useApp();
  const [addons, setAddons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formValues, setFormValues] = useState({ name: "", description: "", price: "" });
  const [formErrors, setFormErrors] = useState({});

  const addonSchema = Yup.object().shape({
    name: Yup.string().required("Nazwa jest wymagana"),
    description: Yup.string().required("Opis jest wymagany"),
    price: Yup.number().required("Cena jest wymagana").positive("Cena musi być dodatnia").typeError("Cena musi być liczbą"),
  });

  const fetchAddons = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/addons/");
      setAddons(res.data.data || res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAddons(); }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) setFormErrors(prev => ({ ...prev, [name]: "" }));
  };

  const handleAddOrUpdate = async (e) => {
    e.preventDefault();
    try {
      await addonSchema.validate(formValues, { abortEarly: false });
      
      if (editingId) {
        await api.patch(`/api/addons/${editingId}`, {
          price: parseFloat(formValues.price),
          description: formValues.description
        });
        setEditingId(null);
      } else {
        await api.post("/api/addons/", {
          name: formValues.name,
          description: formValues.description,
          price: parseFloat(formValues.price)
        });
      }
      
      setFormValues({ name: "", description: "", price: "" });
      await fetchAddons();
    } catch (err) {
      if (err.inner) {
        const errors = {};
        err.inner.forEach(e => { errors[e.path] = e.message; });
        setFormErrors(errors);
      }
    }
  };

  const handleEdit = (addon) => {
    setEditingId(addon.id);
    setFormValues({
      name: addon.name,
      description: addon.description,
      price: addon.price.toString()
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormValues({ name: "", description: "", price: "" });
    setFormErrors({});
  };

  const handleDelete = async (id) => {
    if (confirm("Czy na pewno chcesz usunąć ten dodatek?")) {
      try {
        await api.delete(`/api/addons/${id}`);
        await fetchAddons();
      } catch (err) {
        alert("Błąd usuwania.");
      }
    }
  };

  if (!isOwner) return <div className="p-6 text-brand-red font-bold">Brak uprawnień.</div>;

  return (
    <div className="space-y-6">
      <div className="glass-panel p-6 rounded-2xl space-y-4">
        <h2 className="text-base font-extrabold text-slate-800 border-b border-slate-100 pb-2.5 uppercase tracking-wider flex items-center gap-2">
          <Plus className="w-5 h-5" />
          {editingId ? "Edytuj Dodatek / Edit Addon" : "Dodaj Nowy Dodatek / Add Addon"}
        </h2>
        <form onSubmit={handleAddOrUpdate} className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-bold text-slate-500">
          <div>
            <label className="block mb-1.5">Nazwa / Name *</label>
            <input name="name" value={formValues.name} onChange={handleChange} disabled={!!editingId}
              className={`w-full px-3 py-2.5 bg-white border rounded text-slate-800 focus:outline-none focus:border-brand-red ${formErrors.name ? 'border-red-500' : 'border-slate-200'} ${editingId ? 'bg-slate-100' : ''}`} />
            {formErrors.name && <p className="text-red-500 text-[10px] mt-1">{formErrors.name}</p>}
          </div>
          <div>
            <label className="block mb-1.5">Opis / Description *</label>
            <input name="description" value={formValues.description} onChange={handleChange}
              className={`w-full px-3 py-2.5 bg-white border rounded text-slate-800 focus:outline-none focus:border-brand-red ${formErrors.description ? 'border-red-500' : 'border-slate-200'}`} />
            {formErrors.description && <p className="text-red-500 text-[10px] mt-1">{formErrors.description}</p>}
          </div>
          <div>
            <label className="block mb-1.5">Cena (PLN) / Price *</label>
            <input name="price" type="number" step="0.01" value={formValues.price} onChange={handleChange}
              className={`w-full px-3 py-2.5 bg-white border rounded text-slate-800 focus:outline-none focus:border-brand-red ${formErrors.price ? 'border-red-500' : 'border-slate-200'}`} />
            {formErrors.price && <p className="text-red-500 text-[10px] mt-1">{formErrors.price}</p>}
          </div>
          <div className="md:col-span-3 flex gap-2 pt-2">
            <button type="submit" className="flex-1 py-2.5 bg-brand-red hover:bg-brand-red-hover text-white font-bold rounded transition">
              {editingId ? "ZAKTUALIZUJ / UPDATE" : "DODAJ DODATEK / ADD ADDON"}
            </button>
            {editingId && (
              <button type="button" onClick={handleCancelEdit} className="px-6 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded transition flex items-center gap-1">
                <X className="w-4 h-4" /> Anuluj
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="glass-panel p-6 rounded-2xl space-y-4">
        <h2 className="text-base font-extrabold text-slate-800 border-b border-slate-100 pb-2.5 uppercase tracking-wider">
          Dostępne Dodatki ({addons.length})
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addons.map(addon => (
            <div key={addon.id} className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm flex justify-between items-start">
              <div>
                <h3 className="font-black text-slate-800">{addon.name}</h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">{addon.description}</p>
                <p className="text-brand-red font-bold mt-2">{parseFloat(addon.price).toFixed(2)} PLN</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(addon)} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(addon.id)} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}