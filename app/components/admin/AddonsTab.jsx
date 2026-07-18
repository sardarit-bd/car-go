"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/app/context/AppContext";
import {
  ShieldAlert,
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
  const { isOwner } = useApp();
  const [addons, setAddons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formValues, setFormValues] = useState({
    name: "",
    description: "",
    price: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [backendError, setBackendError] = useState(""); // Added: State for backend errors

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const addonSchema = Yup.object().shape({
    name: Yup.string().required("Nazwa jest wymagana"),
    description: Yup.string().required("Opis jest wymagany"),
    price: Yup.number()
      .required("Cena jest wymagana")
      .positive("Cena musi być dodatnia")
      .typeError("Cena musi być liczbą"),
  });

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
    if (backendError) setBackendError(""); // Clear backend error when user types
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
    setBackendError(""); // Clear previous backend errors
    setFormErrors({}); // Clear previous form errors

    try {
      await addonSchema.validate(formValues, { abortEarly: false });

      const formData = new FormData();
      formData.append("name", formValues.name);
      formData.append("description", formValues.description);
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

      setFormValues({ name: "", description: "", price: "" });
      setImageFile(null);
      setImagePreview(null);
      await fetchAddons();
    } catch (err) {
      if (err.inner) {
        // Frontend Yup validation error
        const errors = {};
        err.inner.forEach((e) => {
          errors[e.path] = e.message;
        });
        setFormErrors(errors);
      } else if (err.response && err.response.data) {
        // Backend API error (validation, server error, etc.)
        const errorMsg =
          err.response.data.message ||
          err.response.data.error ||
          "Wystąpił błąd podczas zapisywania. Sprawdź dane i spróbuj ponownie.";
        setBackendError(errorMsg);
        alert(errorMsg); // Fallback to ensure user sees it immediately
      } else {
        // Network or unexpected error
        const errorMsg = "Błąd sieci. Sprawdź połączenie z serwerem.";
        setBackendError(errorMsg);
        alert(errorMsg);
      }
    }
  };

  const handleEdit = (addon) => {
    setEditingId(addon.id);
    setFormValues({
      name: addon.name,
      description: addon.description,
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
    setFormValues({ name: "", description: "", price: "" });
    setFormErrors({});
    setBackendError("");
    setImageFile(null);
    setImagePreview(null);
  };

  const handleDelete = async (id) => {
    if (confirm("Czy na pewno chcesz usunąć ten dodatek?")) {
      try {
        await api.delete(`/api/addons/${id}`);
        await fetchAddons();
      } catch (err) {
        const errorMsg = err.response?.data?.message || "Błąd usuwania.";
        setBackendError(errorMsg);
        alert(errorMsg);
      }
    }
  };

  if (!isOwner)
    return <div className="p-6 text-brand-red font-bold">Brak uprawnień.</div>;

  return (
    <div className="space-y-6">
      <div className="glass-panel p-6 rounded-2xl space-y-4">
        <h2 className="text-base font-extrabold text-slate-800 border-b border-slate-100 pb-2.5 uppercase tracking-wider flex items-center gap-2">
          <Plus className="w-5 h-5" />
          {editingId
            ? "Edytuj Dodatek / Edit Addon"
            : "Dodaj Nowy Dodatek / Add Addon"}
        </h2>

        {/* Added: Backend Error Banner */}
        {backendError && (
          <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-semibold">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{backendError}</span>
          </div>
        )}

        <form
          onSubmit={handleAddOrUpdate}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-bold text-slate-500"
        >
          <div>
            <label className="block mb-1.5">Nazwa / Name *</label>
            <input
              name="name"
              value={formValues.name}
              onChange={handleChange}
              disabled={!!editingId}
              className={`w-full px-3 py-2.5 bg-white border rounded text-slate-800 focus:outline-none focus:border-brand-red ${formErrors.name ? "border-red-500" : "border-slate-200"} ${editingId ? "bg-slate-100" : ""}`}
            />
            {formErrors.name && (
              <p className="text-red-500 text-[10px] mt-1">{formErrors.name}</p>
            )}
          </div>
          <div>
            <label className="block mb-1.5">Opis / Description *</label>
            <input
              name="description"
              value={formValues.description}
              onChange={handleChange}
              className={`w-full px-3 py-2.5 bg-white border rounded text-slate-800 focus:outline-none focus:border-brand-red ${formErrors.description ? "border-red-500" : "border-slate-200"}`}
            />
            {formErrors.description && (
              <p className="text-red-500 text-[10px] mt-1">
                {formErrors.description}
              </p>
            )}
          </div>
          <div>
            <label className="block mb-1.5">Cena (PLN) / Price *</label>
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

          <div className="md:col-span-3">
            <label className="block mb-1.5">
              Obrazek / Image (opcjonalnie)
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

          <div className="md:col-span-3 flex gap-2 pt-2">
            <button
              type="submit"
              className="flex-1 py-2.5 bg-brand-red hover:bg-brand-red-hover text-white font-bold rounded transition"
            >
              {editingId ? "ZAKTUALIZUJ / UPDATE" : "DODAJ DODATEK / ADD ADDON"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="px-6 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded transition flex items-center gap-1"
              >
                <X className="w-4 h-4" /> Anuluj
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="glass-panel p-6 rounded-2xl space-y-4">
        <h2 className="text-base font-extrabold text-slate-800 border-b border-slate-100 pb-2.5 uppercase tracking-wider">
          Dostępne Dodatki ({addons.length})
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
                    alt={addon.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ImageIcon className="w-6 h-6 text-slate-400" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-black text-slate-800 truncate">
                  {addon.name}
                </h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                  {addon.description}
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
