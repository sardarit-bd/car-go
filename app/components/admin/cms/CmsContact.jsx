"use client";

import React, { useState, useEffect } from "react";
import api from "@/lib/axios";
import * as yup from "yup";
import { Save } from "lucide-react";

const contactSchema = yup.object().shape({
  value: yup.string().required("Value is required"),
  label: yup.string().required("Label is required"),
});

export default function CmsContact() {
  const [contacts, setContacts] = useState({
    EMAIL: { id: null, value: "", label: "" },
    PHONE: { id: null, value: "", label: "" },
    ADDRESS: { id: null, value: "", label: "" }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => { fetchContacts(); }, []);

  const fetchContacts = async () => {
    try {
      const res = await api.get("/api/admin/cms/contact");
      const data = res.data.data || res.data;
      const grouped = { EMAIL: { id: null, value: "", label: "" }, PHONE: { id: null, value: "", label: "" }, ADDRESS: { id: null, value: "", label: "" } };
      data.forEach(c => {
        if (grouped[c.type]) {
          grouped[c.type] = { id: c.id, value: c.value, label: c.label };
        }
      });
      setContacts(grouped);
    } catch (err) { console.error(err); }
  };

  const handleSaveContact = async (type, e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    const formData = contacts[type];
    try {
      await contactSchema.validate(formData, { abortEarly: false });
      setLoading(true);
      if (formData.id) {
        await api.put(`/api/admin/cms/contact/${formData.id}`, { value: formData.value, label: formData.label });
      } else {
        await api.post("/api/admin/cms/contact", { type, value: formData.value, label: formData.label });
      }
      setSuccess(`${type} updated!`);
      fetchContacts();
    } catch (err) {
      if (err.name === "ValidationError") setError(err.inner.map(e => e.message).join(", "));
      else setError(`Failed to save ${type}.`);
    } finally { setLoading(false); }
  };

  const renderForm = (type, title) => (
    <div className="glass-panel p-6 rounded-2xl space-y-4">
      <h2 className="text-base font-extrabold text-slate-800 border-b border-slate-100 pb-2.5 uppercase tracking-wider">
        {title}
      </h2>
      <form onSubmit={(e) => handleSaveContact(type, e)} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-bold text-slate-500">
        <div>
          <label className="block mb-1">Label (e.g., "Customer Support")</label>
          <input type="text" value={contacts[type].label} onChange={(e) => setContacts({...contacts, [type]: {...contacts[type], label: e.target.value}})} className="w-full px-3 py-2 bg-white border border-slate-200 rounded text-slate-800 focus:outline-none focus:border-brand-red" />
        </div>
        <div>
          <label className="block mb-1">Value</label>
          <input type="text" value={contacts[type].value} onChange={(e) => setContacts({...contacts, [type]: {...contacts[type], value: e.target.value}})} className="w-full px-3 py-2 bg-white border border-slate-200 rounded text-slate-800 focus:outline-none focus:border-brand-red" />
        </div>
        <div className="md:col-span-2 pt-2">
          <button type="submit" disabled={loading} className="w-full py-3 bg-brand-red hover:bg-brand-red-hover text-white font-bold rounded transition flex items-center justify-center gap-2">
            {loading ? "Saving..." : <><Save className="w-4 h-4" /> Save {title}</>}
          </button>
        </div>
      </form>
    </div>
  );

  return (
    <div className="space-y-6">
      {error && <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm font-bold">{error}</div>}
      {success && <div className="p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm font-bold">{success}</div>}
      {renderForm("EMAIL", "Email Address")}
      {renderForm("PHONE", "Phone Number")}
      {renderForm("ADDRESS", "Physical Address / Location")}
    </div>
  );
}