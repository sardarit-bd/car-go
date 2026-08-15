"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useApp } from "@/app/context/AppContext";
import { Trash2, Edit2, Plus, X, Check } from "lucide-react";
import * as Yup from "yup";
import api from "@/lib/axios";

export default function PackagesTab() {
  const { isOwner, t, lang, setLang } = useApp();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formValues, setFormValues] = useState({
    nameEn: "",
    namePl: "",
    descriptionEn: "",
    descriptionPl: "",
    price: "",
  });
  const [formErrors, setFormErrors] = useState({});

  const packageSchema = useMemo(
    () =>
      Yup.object().shape({
        nameEn: Yup.string().required(t("packageNameRequired") + " (EN)"),
        namePl: Yup.string().required(t("packageNameRequired") + " (PL)"),
        descriptionEn: Yup.string().required(
          t("packageDescRequired") + " (EN)",
        ),
        descriptionPl: Yup.string().required(
          t("packageDescRequired") + " (PL)",
        ),
        price: Yup.number()
          .required(t("packagePriceRequired"))
          .min(0, t("packagePriceMin"))
          .typeError(t("packagePriceNumber")),
      }),
    [lang, t],
  );

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

  useEffect(() => {
    fetchPackages();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleAddOrUpdate = async (e) => {
    e.preventDefault();
    try {
      await packageSchema.validate(formValues, { abortEarly: false });

      const descEnArray = formValues.descriptionEn
        .split("\n")
        .filter((line) => line.trim() !== "");
      const descPlArray = formValues.descriptionPl
        .split("\n")
        .filter((line) => line.trim() !== "");

      if (editingId) {
        await api.patch(`/api/packages/${editingId}`, {
          nameEn: formValues.nameEn,
          namePl: formValues.namePl,
          descriptionEn: descEnArray,
          descriptionPl: descPlArray,
          price: parseFloat(formValues.price),
        });
        setEditingId(null);
      } else {
        await api.post("/api/packages/", {
          nameEn: formValues.nameEn,
          namePl: formValues.namePl,
          descriptionEn: descEnArray,
          descriptionPl: descPlArray,
          price: parseFloat(formValues.price),
        });
      }

      setFormValues({
        nameEn: "",
        namePl: "",
        descriptionEn: "",
        descriptionPl: "",
        price: "",
      });
      await fetchPackages();
    } catch (err) {
      if (err.inner) {
        const errors = {};
        err.inner.forEach((e) => {
          errors[e.path] = e.message;
        });
        setFormErrors(errors);
      }
    }
  };

  const handleEdit = (pkg) => {
    setEditingId(pkg.id);
    const descEnString = Array.isArray(pkg.descriptionEn || pkg.description)
      ? (pkg.descriptionEn || pkg.description).join("\n")
      : pkg.descriptionEn || pkg.description || "";

    const descPlString = Array.isArray(pkg.descriptionPl || pkg.description)
      ? (pkg.descriptionPl || pkg.description).join("\n")
      : pkg.descriptionPl || pkg.description || "";

    setFormValues({
      nameEn: pkg.nameEn || pkg.name || "",
      namePl: pkg.namePl || pkg.name || "",
      descriptionEn: descEnString,
      descriptionPl: descPlString,
      price: pkg.price.toString(),
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormValues({
      nameEn: "",
      namePl: "",
      descriptionEn: "",
      descriptionPl: "",
      price: "",
    });
    setFormErrors({});
  };

  const handleDelete = async (id) => {
    if (confirm(t("packageDeleteConfirm"))) {
      try {
        await api.delete(`/api/packages/${id}`);
        await fetchPackages();
      } catch (err) {
        alert(t("packageDeleteError"));
      }
    }
  };

  if (!isOwner)
    return (
      <div className="p-6 text-brand-red font-bold">{t("noPermission")}</div>
    );

  return (
    <div className="space-y-6">
      <div className="glass-panel p-6 rounded-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <h2 className="text-base font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <Plus className="w-5 h-5" />
            {editingId ? t("packageEditTitle") : t("packageAddTitle")}
          </h2>
          <button
            onClick={() => setLang(lang === "pl" ? "en" : "pl")}
            className="text-xs font-bold text-slate-500 hover:text-slate-800 transition px-2 py-1 rounded-md hover:bg-slate-50"
          >
            {lang.toUpperCase()}
          </button>
        </div>

        <form
          onSubmit={handleAddOrUpdate}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-bold text-slate-500"
        >
          <div>
            <label className="block mb-1.5">
              {t("packageNameLabel")} (EN) *
            </label>
            <input
              name="nameEn"
              value={formValues.nameEn}
              onChange={handleChange}
              className={`w-full px-3 py-2.5 bg-white border rounded text-slate-800 focus:outline-none focus:border-brand-red ${formErrors.nameEn ? "border-red-500" : "border-slate-200"}`}
              placeholder={t("packageNamePlaceholder")}
            />
            {formErrors.nameEn && (
              <p className="text-red-500 text-[10px] mt-1">
                {formErrors.nameEn}
              </p>
            )}
          </div>
          <div>
            <label className="block mb-1.5">
              {t("packageNameLabel")} (PL) *
            </label>
            <input
              name="namePl"
              value={formValues.namePl}
              onChange={handleChange}
              className={`w-full px-3 py-2.5 bg-white border rounded text-slate-800 focus:outline-none focus:border-brand-red ${formErrors.namePl ? "border-red-500" : "border-slate-200"}`}
              placeholder={t("packageNamePlaceholder")}
            />
            {formErrors.namePl && (
              <p className="text-red-500 text-[10px] mt-1">
                {formErrors.namePl}
              </p>
            )}
          </div>

          <div>
            <label className="block mb-1.5">
              {t("packageFeaturesLabel")} (EN) {t("packageFeaturesHint")} *
            </label>
            <textarea
              name="descriptionEn"
              rows="3"
              value={formValues.descriptionEn}
              onChange={handleChange}
              className={`w-full px-3 py-2.5 bg-white border rounded text-slate-800 focus:outline-none focus:border-brand-red resize-none ${formErrors.descriptionEn ? "border-red-500" : "border-slate-200"}`}
              placeholder={t("packageFeaturesPlaceholder")}
            />
            {formErrors.descriptionEn && (
              <p className="text-red-500 text-[10px] mt-1">
                {formErrors.descriptionEn}
              </p>
            )}
          </div>
          <div>
            <label className="block mb-1.5">
              {t("packageFeaturesLabel")} (PL) {t("packageFeaturesHint")} *
            </label>
            <textarea
              name="descriptionPl"
              rows="3"
              value={formValues.descriptionPl}
              onChange={handleChange}
              className={`w-full px-3 py-2.5 bg-white border rounded text-slate-800 focus:outline-none focus:border-brand-red resize-none ${formErrors.descriptionPl ? "border-red-500" : "border-slate-200"}`}
              placeholder={t("packageFeaturesPlaceholder")}
            />
            {formErrors.descriptionPl && (
              <p className="text-red-500 text-[10px] mt-1">
                {formErrors.descriptionPl}
              </p>
            )}
          </div>

          <div>
            <label className="block mb-1.5">{t("packagePriceLabel")} *</label>
            <input
              name="price"
              type="number"
              step="0.01"
              value={formValues.price}
              onChange={handleChange}
              className={`w-full px-3 py-2.5 bg-white border rounded text-slate-800 focus:outline-none focus:border-brand-red ${formErrors.price ? "border-red-500" : "border-slate-200"}`}
            />
            {formErrors.price && (
              <p className="text-red-500 text-[10px] mt-1">
                {formErrors.price}
              </p>
            )}
          </div>

          <div className="flex items-end gap-2 pt-4">
            <button
              type="submit"
              className="flex-1 py-2.5 bg-brand-red hover:bg-brand-red-hover text-white font-bold rounded transition"
            >
              {editingId ? t("packageUpdateBtn") : t("packageAddBtn")}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="px-4 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded transition flex items-center gap-1"
              >
                <X className="w-4 h-4" /> {t("packageCancelBtn")}
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="glass-panel p-6 rounded-2xl space-y-4">
        <h2 className="text-base font-extrabold text-slate-800 border-b border-slate-100 pb-2.5 uppercase tracking-wider">
          {t("packageListTitle")} ({packages.length})
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className="p-5 bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col justify-between relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-16 h-16 bg-brand-red/5 rounded-bl-full -mr-8 -mt-8"></div>
              <div>
                <h3 className="font-black text-lg text-slate-800 mb-2">
                  {lang === "pl"
                    ? pkg.namePl || pkg.name
                    : pkg.nameEn || pkg.name}
                </h3>
                <ul className="space-y-1.5 mb-4">
                  {(lang === "pl"
                    ? pkg.descriptionPl || pkg.description
                    : pkg.descriptionEn || pkg.description || []
                  ).map((feat, idx) => (
                    <li
                      key={idx}
                      className="text-xs text-slate-600 flex items-start gap-2"
                    >
                      <Check className="w-3.5 h-3.5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-slate-100">
                <span className="text-brand-red font-black text-lg">
                  {parseFloat(pkg.price).toFixed(2)} PLN
                  <span className="text-[10px] text-slate-400 font-normal">
                    {t("pricePerDay")}
                  </span>
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(pkg)}
                    className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(pkg.id)}
                    className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
                  >
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
