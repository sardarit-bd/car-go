"use client";

import React, { useState, useEffect } from "react";
import api from "@/lib/axios";
import { Save } from "lucide-react";

// Helper to get the correct HTML input type based on contact type
const getInputType = (type) => {
  if (type === "EMAIL") return "email";
  if (type === "PHONE") return "tel";
  return "text";
};

export default function CmsContact() {
  const [contacts, setContacts] = useState({
    EMAIL: { id: null, value: "" },
    PHONE: { id: null, value: "" },
    ADDRESS: { id: null, value: "" },
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const res = await api.get("/api/admin/cms/contact");
      const data = res.data.data || res.data;
      const grouped = {
        EMAIL: { id: null, value: "" },
        PHONE: { id: null, value: "" },
        ADDRESS: { id: null, value: "" },
      };
      data.forEach((c) => {
        if (grouped[c.type]) {
          grouped[c.type] = { id: c.id, value: c.value };
        }
      });
      setContacts(grouped);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (type, val) => {
    setContacts({ ...contacts, [type]: { ...contacts[type], value: val } });
  };

  const handleSaveAll = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validate all three fields before sending
    const emailVal = contacts.EMAIL.value;
    const phoneVal = contacts.PHONE.value;
    const addressVal = contacts.ADDRESS.value;

    if (!emailVal || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
      setError("Please enter a valid email address (e.g., info@example.com).");
      return;
    }
    if (!phoneVal || !/^\+?[0-9\s\-()]{7,20}$/.test(phoneVal)) {
      setError("Please enter a valid phone number (e.g., +1234567890).");
      return;
    }
    if (!addressVal) {
      setError("Address is required.");
      return;
    }

    try {
      setLoading(true);
      await Promise.all([
        api.post("/api/admin/cms/contact", { type: "EMAIL", value: emailVal }),
        api.post("/api/admin/cms/contact", { type: "PHONE", value: phoneVal }),
        api.post("/api/admin/cms/contact", {
          type: "ADDRESS",
          value: addressVal,
        }),
      ]);
      setSuccess("Contact information updated!");
      fetchContacts();
    } catch (err) {
      console.error(err);
      setError("Failed to save contact information.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm font-bold">
          {error}
        </div>
      )}
      {success && (
        <div className="p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm font-bold">
          {success}
        </div>
      )}

      <div className="glass-panel p-6 rounded-2xl space-y-4">
        <h2 className="text-base font-extrabold text-slate-800 border-b border-slate-100 pb-2.5 uppercase tracking-wider">
          Contact Information
        </h2>
        <form
          onSubmit={handleSaveAll}
          className="grid grid-cols-1 gap-4 text-xs font-bold text-slate-500"
        >
          <div>
            <label className="block mb-1">Email Address</label>
            <input
              type={getInputType("EMAIL")}
              value={contacts.EMAIL.value}
              onChange={(e) => handleChange("EMAIL", e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded text-slate-800 focus:outline-none focus:border-brand-red"
              placeholder="info@example.com"
            />
          </div>
          <div>
            <label className="block mb-1">Phone Number</label>
            <input
              type={getInputType("PHONE")}
              value={contacts.PHONE.value}
              onChange={(e) => handleChange("PHONE", e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded text-slate-800 focus:outline-none focus:border-brand-red"
              placeholder="+48 123 456 789"
            />
          </div>
          <div>
            <label className="block mb-1">Physical Address / Location</label>
            <input
              type={getInputType("ADDRESS")}
              value={contacts.ADDRESS.value}
              onChange={(e) => handleChange("ADDRESS", e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded text-slate-800 focus:outline-none focus:border-brand-red"
              placeholder="123 Main St, City"
            />
          </div>
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-brand-red hover:bg-brand-red-hover text-white font-bold rounded transition flex items-center justify-center gap-2"
            >
              {loading ? (
                "Saving..."
              ) : (
                <>
                  <Save className="w-4 h-4" /> Save Contact Information
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
