"use client";

import React, { useState, useEffect } from "react";
import api from "@/lib/axios";
import { Save, Clock } from "lucide-react";
import {
  DAYS,
  formatCompactHours,
  hoursToSingleRange,
  singleRangeToHours,
} from "@/app/lib/workingHours";
import { useApp } from "@/app/context/AppContext";

const defaultRange = () => ({
  startIdx: 0,
  endIdx: 4,
  open: "08:00",
  close: "22:00",
  closed: false,
});

export default function CmsWorkingHours() {
  const { fetchCmsContacts } = useApp();
  const [contactId, setContactId] = useState(null);
  const [range, setRange] = useState(defaultRange());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchHours();
  }, []);

  const fetchHours = async () => {
    try {
      const res = await api.get("/api/admin/cms/contact");
      const data = res.data.data || res.data;
      const hoursEntry = data.find((c) => c.type === "HOURS");
      if (hoursEntry) {
        setContactId(hoursEntry.id);
        try {
          const parsed = JSON.parse(hoursEntry.value);
          setRange(hoursToSingleRange(parsed));
        } catch (e) {
          console.error("Failed to parse working hours JSON:", e);
          setRange(defaultRange());
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const updateRange = (field, value) => {
    setRange((prev) => ({ ...prev, [field]: value }));
  };

  const previewHours = singleRangeToHours(range);

  const handleSave = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!range.closed && range.open >= range.close) {
      setError("Opening time must be before closing time.");
      return;
    }

    try {
      setLoading(true);
      const hours = singleRangeToHours(range);
      await api.post("/api/admin/cms/contact", {
        type: "HOURS",
        value: JSON.stringify(hours),
      });
      setSuccess("Working hours updated!");
      fetchHours();

      fetchCmsContacts();
    } catch (err) {
      console.error(err);
      setError("Failed to save working hours.");
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
        <h2 className="text-base font-extrabold text-slate-800 border-b border-slate-100 pb-2.5 uppercase tracking-wider flex items-center gap-2">
          <Clock className="w-4 h-4" />
          Working Hours
        </h2>

        <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-4 text-[11px] font-bold text-slate-500 bg-slate-50 border border-slate-200 rounded-lg p-3">
          <span className="text-slate-400 uppercase tracking-wider">
            Preview:
          </span>
          <span>PL: {formatCompactHours(previewHours, "pl")}</span>
          <span>EN: {formatCompactHours(previewHours, "en")}</span>
        </div>

        <form onSubmit={handleSave} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_1fr_1fr_auto] gap-3 items-center p-3 bg-white border border-slate-200 rounded-lg">
            <div>
              <label className="block mb-1 text-[10px] font-bold text-slate-400 uppercase">
                From Day
              </label>
              <select
                value={range.startIdx}
                onChange={(e) =>
                  updateRange("startIdx", Number(e.target.value))
                }
                className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded text-xs text-slate-800 focus:outline-none focus:border-brand-red"
              >
                {DAYS.map((d, idx) => (
                  <option key={d.key} value={idx}>
                    {d.labelEn}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-1 text-[10px] font-bold text-slate-400 uppercase">
                To Day
              </label>
              <select
                value={range.endIdx}
                onChange={(e) => updateRange("endIdx", Number(e.target.value))}
                className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded text-xs text-slate-800 focus:outline-none focus:border-brand-red"
              >
                {DAYS.map((d, idx) => (
                  <option key={d.key} value={idx}>
                    {d.labelEn}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-1 text-[10px] font-bold text-slate-400 uppercase">
                Open
              </label>
              <input
                type="time"
                value={range.open}
                disabled={range.closed}
                onChange={(e) => updateRange("open", e.target.value)}
                className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded text-xs text-slate-800 focus:outline-none focus:border-brand-red disabled:bg-slate-50 disabled:text-slate-300"
              />
            </div>

            <div>
              <label className="block mb-1 text-[10px] font-bold text-slate-400 uppercase">
                Close
              </label>
              <input
                type="time"
                value={range.close}
                disabled={range.closed}
                onChange={(e) => updateRange("close", e.target.value)}
                className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded text-xs text-slate-800 focus:outline-none focus:border-brand-red disabled:bg-slate-50 disabled:text-slate-300"
              />
            </div>

            <label className="flex items-center gap-1.5 text-[11px] font-bold text-slate-600 cursor-pointer whitespace-nowrap">
              <input
                type="checkbox"
                checked={range.closed}
                onChange={(e) => updateRange("closed", e.target.checked)}
                className="w-3.5 h-3.5"
              />
              Closed all week
            </label>
          </div>

          <p className="text-[11px] text-slate-400 font-medium px-1">
            Days outside this range are automatically shown as closed. Ranges
            that wrap past Sunday (e.g. Friday to Monday) are supported.
          </p>

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
                  <Save className="w-4 h-4" /> Save Working Hours
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
