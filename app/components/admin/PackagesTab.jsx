"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/app/context/AppContext";
import { ShieldAlert, Trash2, Edit2, Plus, X, Check , } from "lucide-react";
import * as Yup from "yup";
import api from "@/lib/axios";

export default function PackagesTab() {
  const { isOwner } = useApp();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formValues, setFormValues] = useState({ name: "", description: "", price: "" });
  const [formErrors, setFormErrors] = useState({});

  const packageSchema = Yup.object().shape({
    name: Yup.string().required("Nazwa pakietu jest wymagana"),
    description: Yup.string().required("Opis cech jest wymagany (każda cecha w nowej linii)"),
    price: Yup.number().required("Cena jest wymagana").min(0, "Cena nie może być ujemna").typeError("Cena musi być liczbą"),
  });

  const fetchPackages = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/packages/");
      setPackages(res.data.data || res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPackages(); }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) setFormErrors(prev => ({ ...prev, [name]: "" }));
  };

  const handleAddOrUpdate = async (e) => {
    e.preventDefault();
    try {
      await packageSchema.validate(formValues, { abortEarly: false });
      
      const descArray = formValues.description.split('\n').filter(line => line.trim() !== '');

      if (editingId) {
        await api.patch(`/api/packages/${editingId}`, {
          name: formValues.name,
          description: descArray,
          price: parseFloat(formValues.price)
        });
        setEditingId(null);
      } else {
        await api.post("/api/packages/", {
          name: formValues.name,
          description: descArray,
          price: parseFloat(formValues.price)
        });
      }
      
      setFormValues({ name: "", description: "", price: "" });
      await fetchPackages();
    } catch (err) {
      if (err.inner) {
        const errors = {};
        err.inner.forEach(e => { errors[e.path] = e.message; });
        setFormErrors(errors);
      }
    }
  };

  const handleEdit = (pkg) => {
    setEditingId(pkg.id);
    const descString = Array.isArray(pkg.description) ? pkg.description.join('\n') : pkg.description;
    setFormValues({
      name: pkg.name,
      description: descString,
      price: pkg.price.toString()
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormValues({ name: "", description: "", price: "" });
    setFormErrors({});
  };

  const handleDelete = async (id) => {
    if (confirm("Czy na pewno chcesz usunąć ten pakiet?")) {
      try {
        await api.delete(`/api/packages/${id}`);
        await fetchPackages();
      } catch (err) {
        alert("Błąd usuwania lub brak uprawnień do usuwania pakietów.");
      }
    }
  };

  if (!isOwner) return <div className="p-6 text-brand-red font-bold">Brak uprawnień.</div>;

  return (
    <div className="space-y-6">
      <div className="glass-panel p-6 rounded-2xl space-y-4">
        <h2 className="text-base font-extrabold text-slate-800 border-b border-slate-100 pb-2.5 uppercase tracking-wider flex items-center gap-2">
          <Plus className="w-5 h-5" />
          {editingId ? "Edytuj Pakiet / Edit Package" : "Dodaj Nowy Pakiet / Add Package"}
        </h2>
        <form onSubmit={handleAddOrUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-bold text-slate-500">
          <div className="md:col-span-2">
            <label className="block mb-1.5">Nazwa Pakietu / Package Name *</label>
            <input name="name" value={formValues.name} onChange={handleChange}
              className={`w-full px-3 py-2.5 bg-white border rounded text-slate-800 focus:outline-none focus:border-brand-red ${formErrors.name ? 'border-red-500' : 'border-slate-200'}`} 
              placeholder="np. Złoty Pakiet Ochrony" />
            {formErrors.name && <p className="text-red-500 text-[10px] mt-1">{formErrors.name}</p>}
          </div>
          <div className="md:col-span-2">
            <label className="block mb-1.5">Cechy Pakietu / Features (każda w nowej linii) *</label>
            <textarea name="description" rows="3" value={formValues.description} onChange={handleChange}
              className={`w-full px-3 py-2.5 bg-white border rounded text-slate-800 focus:outline-none focus:border-brand-red resize-none ${formErrors.description ? 'border-red-500' : 'border-slate-200'}`} 
              placeholder="Obniżony udział w szkodzie&#10;Pomoc drogowa 24/7" />
            {formErrors.description && <p className="text-red-500 text-[10px] mt-1">{formErrors.description}</p>}
          </div>
          <div>
            <label className="block mb-1.5">Cena za dzień (PLN) / Price per day *</label>
            <input name="price" type="number" step="0.01" value={formValues.price} onChange={handleChange}
              className={`w-full px-3 py-2.5 bg-white border rounded text-slate-800 focus:outline-none focus:border-brand-red ${formErrors.price ? 'border-red-500' : 'border-slate-200'}`} />
            {formErrors.price && <p className="text-red-500 text-[10px] mt-1">{formErrors.price}</p>}
          </div>
          <div className="flex items-end gap-2 pt-4">
             <button type="submit" className="flex-1 py-2.5 bg-brand-red hover:bg-brand-red-hover text-white font-bold rounded transition">
              {editingId ? "ZAKTUALIZUJ / UPDATE" : "DODAJ PAKIET / ADD PACKAGE"}
            </button>
            {editingId && (
              <button type="button" onClick={handleCancelEdit} className="px-4 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded transition">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="glass-panel p-6 rounded-2xl space-y-4">
        <h2 className="text-base font-extrabold text-slate-800 border-b border-slate-100 pb-2.5 uppercase tracking-wider">
          Pakiety Ochrony ({packages.length})
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {packages.map(pkg => (
            <div key={pkg.id} className="p-5 bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-brand-red/5 rounded-bl-full -mr-8 -mt-8"></div>
              <div>
                <h3 className="font-black text-lg text-slate-800 mb-2">{pkg.name}</h3>
                <ul className="space-y-1.5 mb-4">
                  {(Array.isArray(pkg.description) ? pkg.description : [pkg.description]).map((feat, idx) => (
                    <li key={idx} className="text-xs text-slate-600 flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-slate-100">
                <span className="text-brand-red font-black text-lg">{parseFloat(pkg.price).toFixed(2)} PLN<span className="text-[10px] text-slate-400 font-normal">/dzień</span></span>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(pkg)} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(pkg.id)} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}