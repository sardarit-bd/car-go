"use client";

import React, { useState, useEffect } from "react";
import api from "@/lib/axios";
import * as yup from "yup";
import { Save, Plus, Trash2, Edit2, X } from "lucide-react";

const faqSchema = yup.object().shape({
  question: yup.string().required("Question is required"),
  answer: yup.string().required("Answer is required"),
  order: yup.number().required("Order is required").min(0),
  isActive: yup.boolean().required(),
});

export default function CmsFaq() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [editingFaq, setEditingFaq] = useState(null);
  const [faqForm, setFaqForm] = useState({ question: "", answer: "", order: 0, isActive: true });

  useEffect(() => { fetchFaqs(); }, []);

  const fetchFaqs = async () => {
    try {
      const res = await api.get("/api/admin/cms/faq");
      setFaqs(res.data.data || res.data);
    } catch (err) { console.error(err); }
  };

  const handleSaveFaq = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    try {
      await faqSchema.validate(faqForm, { abortEarly: false });
      setLoading(true);
      if (editingFaq) {
        await api.put(`/api/admin/cms/faq/${editingFaq.id}`, faqForm);
      } else {
        await api.post("/api/admin/cms/faq", faqForm);
      }
      setSuccess("FAQ saved!");
      setEditingFaq(null);
      setFaqForm({ question: "", answer: "", order: faqs.length, isActive: true });
      fetchFaqs();
    } catch (err) {
      if (err.name === "ValidationError") setError(err.inner.map(e => e.message).join(", "));
      else setError("Failed to save FAQ.");
    } finally { setLoading(false); }
  };

  const handleDeleteFaq = async (id) => {
    if (confirm("Delete this FAQ?")) {
      try {
        await api.delete(`/api/admin/cms/faq/${id}`);
        fetchFaqs();
      } catch (err) { setError("Failed to delete FAQ."); }
    }
  };

  return (
    <div className="glass-panel p-6 rounded-2xl space-y-4">
      <h2 className="text-base font-extrabold text-slate-800 border-b border-slate-100 pb-2.5 uppercase tracking-wider">
        FAQ Management
      </h2>
      {error && <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm font-bold">{error}</div>}
      {success && <div className="p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm font-bold">{success}</div>}

      <form onSubmit={handleSaveFaq} className="grid grid-cols-1 md:grid-cols-12 gap-4 text-xs font-bold text-slate-500 items-end">
        <div className="md:col-span-5">
          <label className="block mb-1">Question</label>
          <input type="text" value={faqForm.question} onChange={(e) => setFaqForm({...faqForm, question: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-200 rounded text-slate-800 focus:outline-none focus:border-brand-red" />
        </div>
        <div className="md:col-span-5">
          <label className="block mb-1">Answer</label>
          <input type="text" value={faqForm.answer} onChange={(e) => setFaqForm({...faqForm, answer: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-200 rounded text-slate-800 focus:outline-none focus:border-brand-red" />
        </div>
        <div className="md:col-span-1">
          <label className="block mb-1">Order</label>
          <input type="number" value={faqForm.order} onChange={(e) => setFaqForm({...faqForm, order: parseInt(e.target.value) || 0})} className="w-full px-3 py-2 bg-white border border-slate-200 rounded text-slate-800 focus:outline-none focus:border-brand-red" />
        </div>
        <div className="md:col-span-1 flex items-center gap-2 h-[38px]">
          <input type="checkbox" checked={faqForm.isActive} onChange={(e) => setFaqForm({...faqForm, isActive: e.target.checked})} className="w-4 h-4 accent-brand-red" />
        </div>
        <div className="md:col-span-12 flex gap-2">
          <button type="submit" disabled={loading} className="flex-1 py-2 bg-brand-red hover:bg-brand-red-hover text-white font-bold rounded transition flex items-center justify-center gap-1">
            {loading ? "Saving..." : (editingFaq ? "Update FAQ" : <><Plus className="w-4 h-4" /> Add FAQ</>)}
          </button>
          {editingFaq && (
            <button type="button" onClick={() => setEditingFaq(null)} className="py-2 px-4 bg-slate-200 text-slate-700 font-bold rounded transition">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </form>

      <div className="space-y-2 mt-6">
        {[...faqs].sort((a,b) => a.order - b.order).map((f) => (
          <div key={f.id} className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-lg">
            <div className="flex-1 pr-4">
              <p className="text-slate-800 font-bold text-sm">{f.question}</p>
              <p className="text-slate-500 text-xs mt-1">{f.answer}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => { setEditingFaq(f); setFaqForm({ question: f.question, answer: f.answer, order: f.order, isActive: f.isActive }); }} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition"><Edit2 className="w-4 h-4" /></button>
              <button onClick={() => handleDeleteFaq(f.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded transition"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}