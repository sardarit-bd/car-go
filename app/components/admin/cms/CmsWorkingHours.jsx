"use client";

import React, { useState, useEffect } from "react";
import api from "@/lib/axios";
import { Save, Clock } from "lucide-react";

const DAYS = [
  { key: "mon", labelPl: "Poniedziałek", labelEn: "Monday" },
  { key: "tue", labelPl: "Wtorek", labelEn: "Tuesday" },
  { key: "wed", labelPl: "Środa", labelEn: "Wednesday" },
  { key: "thu", labelPl: "Czwartek", labelEn: "Thursday" },
  { key: "fri", labelPl: "Piątek", labelEn: "Friday" },
  { key: "sat", labelPl: "Sobota", labelEn: "Saturday" },
  { key: "sun", labelPl: "Niedziela", labelEn: "Sunday" },
];

const defaultHours = () =>
  DAYS.reduce((acc, day) => {
    acc[day.key] = { open: "08:00", close: "22:00", closed: false };
    return acc;
  }, {});

export default function CmsWorkingHours() {
  const [contactId, setContactId] = useState(null);
  const [hours, setHours] = useState(defaultHours());
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
          setHours({ ...defaultHours(), ...parsed });
        } catch (e) {
          console.error("Failed to parse working hours JSON:", e);
          setHours(defaultHours());
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleTimeChange = (dayKey, field, val) => {
    setHours((prev) => ({
      ...prev,
      [dayKey]: { ...prev[dayKey], [field]: val },
    }));
  };

  const handleClosedToggle = (dayKey) => {
    setHours((prev) => ({
      ...prev,
      [dayKey]: { ...prev[dayKey], closed: !prev[dayKey].closed },
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    for (const day of DAYS) {
      const d = hours[day.key];
      if (!d.closed && d.open >= d.close) {
        setError(
          `Invalid hours for ${day.labelEn}: opening time must be before closing time.`,
        );
        return;
      }
    }

    try {
      setLoading(true);
      await api.post("/api/admin/cms/contact", {
        type: "HOURS",
        value: JSON.stringify(hours),
      });
      setSuccess("Working hours updated!");
      fetchHours();
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

        <form onSubmit={handleSave} className="space-y-3">
          {DAYS.map((day) => {
            const d = hours[day.key];
            return (
              <div
                key={day.key}
                className="grid grid-cols-1 sm:grid-cols-[140px_1fr_1fr_auto] gap-3 items-center p-3 bg-white border border-slate-200 rounded-lg"
              >
                <span className="text-xs font-bold text-slate-700">
                  {day.labelPl} / {day.labelEn}
                </span>

                <div>
                  <label className="block mb-1 text-[10px] font-bold text-slate-400 uppercase">
                    Open
                  </label>
                  <input
                    type="time"
                    value={d.open}
                    disabled={d.closed}
                    onChange={(e) =>
                      handleTimeChange(day.key, "open", e.target.value)
                    }
                    className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded text-xs text-slate-800 focus:outline-none focus:border-brand-red disabled:bg-slate-50 disabled:text-slate-300"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-[10px] font-bold text-slate-400 uppercase">
                    Close
                  </label>
                  <input
                    type="time"
                    value={d.close}
                    disabled={d.closed}
                    onChange={(e) =>
                      handleTimeChange(day.key, "close", e.target.value)
                    }
                    className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded text-xs text-slate-800 focus:outline-none focus:border-brand-red disabled:bg-slate-50 disabled:text-slate-300"
                  />
                </div>

                <label className="flex items-center gap-1.5 text-[11px] font-bold text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={d.closed}
                    onChange={() => handleClosedToggle(day.key)}
                    className="w-3.5 h-3.5"
                  />
                  Closed
                </label>
              </div>
            );
          })}

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
