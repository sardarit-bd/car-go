"use client";

import React, { useState, useEffect } from "react";
import api from "@/lib/axios";
import * as yup from "yup";
import { Save } from "lucide-react";

const pageSchema = yup.object().shape({
  contentPl: yup.string().required("Content (PL) is required"),
  contentEn: yup.string().required("Content (EN) is required"),
});

const PAGE_CONFIG = [
  { type: "PRIVACY_POLICY", title: "Privacy Policy" },
  { type: "TERMS_CONDITIONS", title: "Terms & Conditions" },
  { type: "COOKIE_POLICY", title: "Cookie Policy" },
];

const emptyForm = { id: null, contentPl: "", contentEn: "" };

export default function CmsPages() {
  const [forms, setForms] = useState({
    PRIVACY_POLICY: { ...emptyForm },
    TERMS_CONDITIONS: { ...emptyForm },
    COOKIE_POLICY: { ...emptyForm },
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      const res = await api.get("/api/admin/cms/page");
      const pages = res.data.data || res.data;
      setForms((prev) => {
        const next = { ...prev };
        PAGE_CONFIG.forEach(({ type }) => {
          const found = pages.find((p) => p.type === type);
          if (found) {
            next[type] = {
              id: found.id,
              contentPl: found.contentPl || "",
              contentEn: found.contentEn || "",
            };
          }
        });
        return next;
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = (type) => async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    const form = forms[type];
    try {
      await pageSchema.validate(
        { contentPl: form.contentPl, contentEn: form.contentEn },
        { abortEarly: false },
      );
      setLoading(true);

      let res;
      if (form.id) {
        res = await api.put(`/api/admin/cms/page/${form.id}`, {
          contentPl: form.contentPl,
          contentEn: form.contentEn,
        });
      } else {
        res = await api.post("/api/admin/cms/page", {
          type,
          contentPl: form.contentPl,
          contentEn: form.contentEn,
        });
      }

      // Update local state directly from the save response, so the
      // box keeps showing the saved content immediately — not dependent
      // on a follow-up fetch succeeding or matching shape.
      const saved = res.data.data || res.data;
      if (saved) {
        setForms((prev) => ({
          ...prev,
          [type]: {
            id: saved.id,
            contentPl: saved.contentPl ?? form.contentPl,
            contentEn: saved.contentEn ?? form.contentEn,
          },
        }));
      }

      setSuccess(`${PAGE_CONFIG.find((p) => p.type === type)?.title} updated!`);

      // Background sync with the server; local state above already
      // guarantees the visible content is correct even before this resolves.
      fetchPages();
    } catch (err) {
      if (err.name === "ValidationError")
        setError(err.inner.map((e) => e.message).join(", "));
      else setError(`Failed to save ${type}.`);
    } finally {
      setLoading(false);
    }
  };

  const updateField = (type, field, value) => {
    setForms((prev) => ({
      ...prev,
      [type]: { ...prev[type], [field]: value },
    }));
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

      {PAGE_CONFIG.map(({ type, title }) => {
        const form = forms[type];
        return (
          <div key={type} className="glass-panel p-6 rounded-2xl space-y-4">
            <h2 className="text-base font-extrabold text-slate-800 border-b border-slate-100 pb-2.5 uppercase tracking-wider">
              {title}
            </h2>
            <form
              onSubmit={handleSave(type)}
              className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-bold text-slate-500"
            >
              <div>
                <label className="block mb-1">Content (PL) *</label>
                <textarea
                  value={form.contentPl}
                  onChange={(e) =>
                    updateField(type, "contentPl", e.target.value)
                  }
                  rows="10"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded text-slate-800 focus:outline-none focus:border-brand-red resize-none font-mono text-[11px]"
                  placeholder={`${title} content (Polish)...`}
                />
              </div>
              <div>
                <label className="block mb-1">Content (EN) *</label>
                <textarea
                  value={form.contentEn}
                  onChange={(e) =>
                    updateField(type, "contentEn", e.target.value)
                  }
                  rows="10"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded text-slate-800 focus:outline-none focus:border-brand-red resize-none font-mono text-[11px]"
                  placeholder={`${title} content (English)...`}
                />
              </div>
              <div className="md:col-span-2 pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-brand-red hover:bg-brand-red-hover text-white font-bold rounded transition flex items-center justify-center gap-2"
                >
                  {loading ? (
                    "Saving..."
                  ) : (
                    <>
                      <Save className="w-4 h-4" /> Save {title}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        );
      })}
    </div>
  );
}
