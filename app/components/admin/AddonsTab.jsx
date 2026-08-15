"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useApp } from "@/app/context/AppContext";
import {
  Trash2,
  Edit2,
  Plus,
  X,
  Image as ImageIcon,
  AlertCircle,
} from "lucide-react";
import * as Yup from "yup";
import api from "@/lib/axios";

export default function AddonsTab() {
  const { isOwner, t, lang } = useApp();
  const [addons, setAddons] = useState([]);
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
  const [backendError, setBackendError] = useState("");

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const addonSchema = useMemo(
    () =>
      Yup.object().shape({
        nameEn: Yup.string().required(t("addonNameRequired") + " (EN)"),
        namePl: Yup.string().required(t("addonNameRequired") + " (PL)"),
        descriptionEn: Yup.string().required(t("addonDescRequired") + " (EN)"),
        descriptionPl: Yup.string().required(t("addonDescRequired") + " (PL)"),
        price: Yup.number()
          .required(t("addonPriceRequired"))
          .positive(t("addonPricePositive"))
          .typeError(t("addonPriceNumber")),
      }),
    [t, lang],
  );

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

  useEffect(() => {
    fetchAddons();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) setFormErrors((prev) => ({ ...prev, [name]: "" }));
    if (backendError) setBackendError("");
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      if (backendError) setBackendError("");
    }
  };

  const handleAddOrUpdate = async (e) => {
    e.preventDefault();
    setBackendError("");
    setFormErrors({});

    try {
      await addonSchema.validate(formValues, { abortEarly: false });

      const formData = new FormData();
      formData.append("nameEn", formValues.nameEn);
      formData.append("namePl", formValues.namePl);
      formData.append("descriptionEn", formValues.descriptionEn);
      formData.append("descriptionPl", formValues.descriptionPl);
      formData.append("price", parseFloat(formValues.price));
      if (imageFile) {
        formData.append("image", imageFile);
      }

      if (editingId) {
        await api.patch(`/api/addons/${editingId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setEditingId(null);
      } else {
        await api.post("/api/addons/", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      setFormValues({
        nameEn: "",
        namePl: "",
        descriptionEn: "",
        descriptionPl: "",
        price: "",
      });
      setImageFile(null);
      setImagePreview(null);
      await fetchAddons();
    } catch (err) {
      if (err.inner) {
        const errors = {};
        err.inner.forEach((e) => {
          errors[e.path] = e.message;
        });
        setFormErrors(errors);
      } else if (err.response && err.response.data) {
        const errorMsg =
          err.response.data.message ||
          err.response.data.error ||
          t("saveError");
        setBackendError(errorMsg);
        alert(errorMsg);
      } else {
        const errorMsg = t("networkError");
        setBackendError(errorMsg);
        alert(errorMsg);
      }
    }
  };

  const handleEdit = (addon) => {
    setEditingId(addon.id);
    setFormValues({
      nameEn: addon.nameEn || addon.name || "",
      namePl: addon.namePl || addon.name || "",
      descriptionEn: addon.descriptionEn || addon.description || "",
      descriptionPl: addon.descriptionPl || addon.description || "",
      price: addon.price.toString(),
    });
    if (addon.image) {
      setImagePreview(
        `${process.env.NEXT_PUBLIC_API_URL}/uploads/${addon.image}`,
      );
    } else {
      setImagePreview(null);
    }
    setImageFile(null);
    setBackendError("");
    setFormErrors({});
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
    setBackendError("");
    setImageFile(null);
    setImagePreview(null);
  };

  const handleDelete = async (id) => {
    if (confirm(t("addonDeleteConfirm"))) {
      try {
        await api.delete(`/api/addons/${id}`);
        await fetchAddons();
      } catch (err) {
        const errorMsg = err.response?.data?.message || t("addonDeleteError");
        setBackendError(errorMsg);
        alert(errorMsg);
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
        <h2 className="text-base font-extrabold text-slate-800 border-b border-slate-100 pb-2.5 uppercase tracking-wider flex items-center gap-2">
          <Plus className="w-5 h-5" />
          {editingId ? t("addonEditTitle") : t("addonAddTitle")}
        </h2>

        {backendError && (
          <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-semibold">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{backendError}</span>
          </div>
        )}

        <form
          onSubmit={handleAddOrUpdate}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-bold text-slate-500"
        >
          <div>
            <label className="block mb-1.5">{t("addonNameLabel")} (EN) *</label>
            <input
              name="nameEn"
              value={formValues.nameEn}
              onChange={handleChange}
              disabled={!!editingId}
              className={`w-full px-3 py-2.5 bg-white border rounded text-slate-800 focus:outline-none focus:border-brand-red ${formErrors.nameEn ? "border-red-500" : "border-slate-200"} ${editingId ? "bg-slate-100" : ""}`}
            />
            {formErrors.nameEn && (
              <p className="text-red-500 text-[10px] mt-1">
                {formErrors.nameEn}
              </p>
            )}
          </div>
          <div>
            <label className="block mb-1.5">{t("addonNameLabel")} (PL) *</label>
            <input
              name="namePl"
              value={formValues.namePl}
              onChange={handleChange}
              disabled={!!editingId}
              className={`w-full px-3 py-2.5 bg-white border rounded text-slate-800 focus:outline-none focus:border-brand-red ${formErrors.namePl ? "border-red-500" : "border-slate-200"} ${editingId ? "bg-slate-100" : ""}`}
            />
            {formErrors.namePl && (
              <p className="text-red-500 text-[10px] mt-1">
                {formErrors.namePl}
              </p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block mb-1.5">{t("addonDescLabel")} (EN) *</label>
            <input
              name="descriptionEn"
              value={formValues.descriptionEn}
              onChange={handleChange}
              className={`w-full px-3 py-2.5 bg-white border rounded text-slate-800 focus:outline-none focus:border-brand-red ${formErrors.descriptionEn ? "border-red-500" : "border-slate-200"}`}
            />
            {formErrors.descriptionEn && (
              <p className="text-red-500 text-[10px] mt-1">
                {formErrors.descriptionEn}
              </p>
            )}
          </div>
          <div className="md:col-span-2">
            <label className="block mb-1.5">{t("addonDescLabel")} (PL) *</label>
            <input
              name="descriptionPl"
              value={formValues.descriptionPl}
              onChange={handleChange}
              className={`w-full px-3 py-2.5 bg-white border rounded text-slate-800 focus:outline-none focus:border-brand-red ${formErrors.descriptionPl ? "border-red-500" : "border-slate-200"}`}
            />
            {formErrors.descriptionPl && (
              <p className="text-red-500 text-[10px] mt-1">
                {formErrors.descriptionPl}
              </p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block mb-1.5">{t("addonPriceLabel")} *</label>
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

          <div className="md:col-span-2">
            <label className="block mb-1.5">
              {t("addonImageLabel")} ({t("optional")})
            </label>
            <div className="flex items-center gap-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded text-slate-800 focus:outline-none focus:border-brand-red file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-xs file:font-bold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200"
              />
              {imagePreview && (
                <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-slate-200 flex-shrink-0">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="md:col-span-2 flex gap-2 pt-2">
            <button
              type="submit"
              className="flex-1 py-2.5 bg-brand-red hover:bg-brand-red-hover text-white font-bold rounded transition"
            >
              {editingId ? t("addonUpdateBtn") : t("addonAddBtn")}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="px-6 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded transition flex items-center gap-1"
              >
                <X className="w-4 h-4" /> {t("addonCancelBtn")}
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="glass-panel p-6 rounded-2xl space-y-4">
        <h2 className="text-base font-extrabold text-slate-800 border-b border-slate-100 pb-2.5 uppercase tracking-wider">
          {t("addonAvailableTitle")} ({addons.length})
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addons.map((addon) => (
            <div
              key={addon.id}
              className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm flex justify-between items-start gap-4"
            >
              <div className="w-16 h-16 rounded-lg bg-slate-100 flex-shrink-0 overflow-hidden border border-slate-200 flex items-center justify-center">
                {addon.image ? (
                  <img
                    src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${addon.image}`}
                    alt={addon.nameEn}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ImageIcon className="w-6 h-6 text-slate-400" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-black text-slate-800 truncate">
                  {lang === "pl"
                    ? addon.namePl || addon.name
                    : addon.nameEn || addon.name}
                </h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                  {lang === "pl"
                    ? addon.descriptionPl || addon.description
                    : addon.descriptionEn || addon.description}
                </p>
                <p className="text-brand-red font-bold mt-2">
                  {parseFloat(addon.price).toFixed(2)} PLN
                </p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button
                  onClick={() => handleEdit(addon)}
                  className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(addon.id)}
                  className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
                >
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
