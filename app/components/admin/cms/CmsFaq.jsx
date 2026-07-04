"use client";

import React, { useState, useEffect } from "react";
import api from "@/lib/axios";
import * as yup from "yup";
import { Save, Plus, Trash2, Edit2, X } from "lucide-react";

const faqSchema = yup.object().shape({
  questionPl: yup.string().required("Question PL is required"),
  questionEn: yup.string().required("Question EN is required"),
  answerPl: yup.string().required("Answer PL is required"),
  answerEn: yup.string().required("Answer EN is required"),
  order: yup.number().required("Order is required").min(0),
  isActive: yup.boolean().required(),
});

export default function CmsFaq() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [editingFaq, setEditingFaq] = useState(null);
  const [faqForm, setFaqForm] = useState({ questionPl: "", questionEn: "", answerPl: "", answerEn: "", order: 0, isActive: true });

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
      setFaqForm({ questionPl: "", questionEn: "", answerPl: "", answerEn: "", order: faqs.length, isActive: true });
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

  const startEditFaq = (f) => {
    setEditingFaq(f);
    setFaqForm({ 
      questionPl: f.questionPl || "", 
      questionEn: f.questionEn || "", 
      answerPl: f.answerPl || "", 
      answerEn: f.answerEn || "", 
      order: f.order, 
      isActive: f.isActive 
    });
  };

  return (
    <div className="glass-panel p-6 rounded-2xl space-y-4">
      <h2 className="text-base font-extrabold text-slate-800 border-b border-slate-100 pb-2.5 uppercase tracking-wider">
        FAQ Management
      </h2>
      {error && <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm font-bold">{error}</div>}
      {success && <div className="p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm font-bold">{success}</div>}

      <form onSubmit={handleSaveFaq} className="grid grid-cols-1 md:grid-cols-12 gap-4 text-xs font-bold text-slate-500 items-end">
        <div className="md:col-span-12 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1">Question (PL) *</label>
            <input type="text" value={faqForm.questionPl} onChange={(e) => setFaqForm({...faqForm, questionPl: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-200 rounded text-slate-800 focus:outline-none focus:border-brand-red" />
          </div>
          <div>
            <label className="block mb-1">Question (EN) *</label>
            <input type="text" value={faqForm.questionEn} onChange={(e) => setFaqForm({...faqForm, questionEn: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-200 rounded text-slate-800 focus:outline-none focus:border-brand-red" />
          </div>
        </div>
        <div className="md:col-span-12 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1">Answer (PL) *</label>
            <textarea value={faqForm.answerPl} onChange={(e) => setFaqForm({...faqForm, answerPl: e.target.value})} rows="2" className="w-full px-3 py-2 bg-white border border-slate-200 rounded text-slate-800 focus:outline-none focus:border-brand-red resize-none" />
          </div>
          <div>
            <label className="block mb-1">Answer (EN) *</label>
            <textarea value={faqForm.answerEn} onChange={(e) => setFaqForm({...faqForm, answerEn: e.target.value})} rows="2" className="w-full px-3 py-2 bg-white border border-slate-200 rounded text-slate-800 focus:outline-none focus:border-brand-red resize-none" />
          </div>
        </div>
        
        <div className="md:col-span-10 grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1">Order</label>
            <input type="number" value={faqForm.order} onChange={(e) => setFaqForm({...faqForm, order: parseInt(e.target.value) || 0})} className="w-full px-3 py-2 bg-white border border-slate-200 rounded text-slate-800 focus:outline-none focus:border-brand-red" />
          </div>
          <div className="flex items-center gap-2 h-[38px]">
            <input type="checkbox" checked={faqForm.isActive} onChange={(e) => setFaqForm({...faqForm, isActive: e.target.checked})} className="w-4 h-4 accent-brand-red" />
            <span>Active</span>
          </div>
        </div>
        <div className="md:col-span-2 flex gap-2">
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
            <div className="flex-1 pr-4 grid grid-cols-2 gap-x-4">
              <div>
                <span className="text-[10px] font-bold text-blue-600">PL:</span>
                <p className="text-slate-800 font-bold text-sm truncate">{f.questionPl}</p>
                <p className="text-slate-500 text-xs truncate">{f.answerPl}</p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-green-600">EN:</span>
                <p className="text-slate-800 font-bold text-sm truncate">{f.questionEn}</p>
                <p className="text-slate-500 text-xs truncate">{f.answerEn}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${f.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {f.isActive ? 'ACTIVE' : 'INACTIVE'}
              </span>
              <button onClick={() => startEditFaq(f)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition"><Edit2 className="w-4 h-4" /></button>
              <button onClick={() => handleDeleteFaq(f.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded transition"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}