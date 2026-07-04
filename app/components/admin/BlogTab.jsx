"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/app/context/AppContext";
import { ShieldAlert, Trash2, Edit2, Plus, X, Upload, Search, Calendar } from "lucide-react";
import * as Yup from "yup";
import api from "@/lib/axios";

export default function BlogTab() {
  const { isOwner } = useApp();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [formValues, setFormValues] = useState({ title: "", content: "", date: "", image: null });
  const [formErrors, setFormErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);

  const blogSchema = Yup.object().shape({
    title: Yup.string().required("Tytuł jest wymagany").min(5, "Minimalna długość to 5 znaków"),
    content: Yup.string().required("Treść jest wymagana").min(20, "Minimalna długość to 20 znaków"),
    date: Yup.date().required("Data jest wymagana").typeError("Nieprawidłowa data"),
  });

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/blogs", {
        params: { page, limit: 10, search: searchQuery }
      });

      
      const responseData = res.data.data; 
      const list = responseData.data || [];
      
      setBlogs(list);
      

      if (responseData.totalPages) setTotalPages(responseData.totalPages);
      else if (root.meta?.totalPages) setTotalPages(root.meta.totalPages);
    } catch (err) {
      console.error("Failed to fetch blogs:", err.response?.data || err.message);
      if (err.response?.status === 401) {
        alert("Sesja wygasła. Zaloguj się ponownie.");
      }
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { fetchBlogs(); }, [page, searchQuery]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormValues(prev => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) setFormErrors(prev => ({ ...prev, [name]: "" }));
  };

  const handleAddOrUpdate = async (e) => {
    e.preventDefault();
    try {
      await blogSchema.validate(formValues, { abortEarly: false });
      
      const formData = new FormData();
      formData.append("title", formValues.title);
      formData.append("content", formValues.content);
      // Format date to ISO string if needed, or send as is
      formData.append("date", new Date(formValues.date).toISOString());
      if (formValues.image) {
        formData.append("image", formValues.image);
      }

      if (editingId) {
        await api.patch(`/api/blogs/${editingId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        setEditingId(null);
      } else {
        await api.post("/api/blogs", formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
      }
      
      setFormValues({ title: "", content: "", date: "", image: null });
      setImagePreview(null);
      await fetchBlogs();
    } catch (err) {
      if (err.inner) {
        const errors = {};
        err.inner.forEach(e => { errors[e.path] = e.message; });
        setFormErrors(errors);
      } else {
        alert("Błąd zapisu: " + (err.response?.data?.message || "Spróbuj ponownie"));
      }
    }
  };

  const handleEdit = (blog) => {
    setEditingId(blog.id);
    setFormValues({
      title: blog.title,
      content: blog.content,
      date: blog.date ? blog.date.split('T')[0] : "",
      image: null // Keep existing image if not changed
    });
    setImagePreview(blog.imageUrl ? `${process.env.NEXT_PUBLIC_API_URL}${blog.imageUrl}` : null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormValues({ title: "", content: "", date: "", image: null });
    setImagePreview(null);
    setFormErrors({});
  };

  const handleDelete = async (id) => {
    if (confirm("Czy na pewno chcesz usunąć ten artykuł?")) {
      try {
        await api.delete(`/api/blogs/${id}`);
        await fetchBlogs();
      } catch (err) {
        alert("Błąd usuwania.");
      }
    }
  };

  if (!isOwner) return <div className="p-6 text-brand-red font-bold">Brak uprawnień.</div>;

  return (
    <div className="space-y-6">
      {/* Form Section */}
      <div className="glass-panel p-6 rounded-2xl space-y-4">
        <h2 className="text-base font-extrabold text-slate-800 border-b border-slate-100 pb-2.5 uppercase tracking-wider flex items-center gap-2">
          <Plus className="w-5 h-5" />
          {editingId ? "Edytuj Artykuł / Edit Blog Post" : "Dodaj Nowy Artykuł / Add Blog Post"}
        </h2>
        <form onSubmit={handleAddOrUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-bold text-slate-500">
          <div className="md:col-span-2">
            <label className="block mb-1.5">Tytuł / Title *</label>
            <input name="title" value={formValues.title} onChange={handleChange}
              className={`w-full px-3 py-2.5 bg-white border rounded text-slate-800 focus:outline-none focus:border-brand-red ${formErrors.title ? 'border-red-500' : 'border-slate-200'}`} />
            {formErrors.title && <p className="text-red-500 text-[10px] mt-1">{formErrors.title}</p>}
          </div>
          
          <div className="md:col-span-2">
            <label className="block mb-1.5">Treść / Content *</label>
            <textarea name="content" rows="4" value={formValues.content} onChange={handleChange}
              className={`w-full px-3 py-2.5 bg-white border rounded text-slate-800 focus:outline-none focus:border-brand-red resize-none ${formErrors.content ? 'border-red-500' : 'border-slate-200'}`} />
            {formErrors.content && <p className="text-red-500 text-[10px] mt-1">{formErrors.content}</p>}
          </div>

          <div>
            <label className="block mb-1.5">Data publikacji / Date *</label>
            <input name="date" type="date" value={formValues.date} onChange={handleChange}
              className={`w-full px-3 py-2.5 bg-white border rounded text-slate-800 focus:outline-none focus:border-brand-red ${formErrors.date ? 'border-red-500' : 'border-slate-200'}`} />
            {formErrors.date && <p className="text-red-500 text-[10px] mt-1">{formErrors.date}</p>}
          </div>

          <div>
            <label className="block mb-1.5">Zdjęcie / Image</label>
            <div className="flex items-center gap-4">
              <label className="flex-1 flex items-center justify-center px-4 py-2.5 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-brand-red transition bg-white">
                <Upload className="w-4 h-4 mr-2 text-slate-400" />
                <span className="text-xs font-bold text-slate-600">{formValues.image ? formValues.image.name : "Wybierz plik..."}</span>
                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              </label>
              {imagePreview && (
                <div className="w-16 h-16 rounded-lg overflow-hidden border border-slate-200">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>

          <div className="md:col-span-2 flex gap-2 pt-2">
            <button type="submit" className="flex-1 py-2.5 bg-brand-red hover:bg-brand-red-hover text-white font-bold rounded transition">
              {editingId ? "ZAKTUALIZUJ / UPDATE" : "OPUBLIKUJ / PUBLISH"}
            </button>
            {editingId && (
              <button type="button" onClick={handleCancelEdit} className="px-6 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded transition flex items-center gap-1">
                <X className="w-4 h-4" /> Anuluj
              </button>
            )}
          </div>
        </form>
      </div>

      {/* List Section */}
      <div className="glass-panel p-6 rounded-2xl space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-4">
          <h2 className="text-base font-extrabold text-slate-800 uppercase tracking-wider">
            Artykuły na Blogu ({blogs.length})
          </h2>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Szukaj artykułów..." 
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
              className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 focus:outline-none focus:border-brand-red" 
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {loading ? (
            <div className="col-span-2 text-center py-8 text-slate-400">Ładowanie...</div>
          ) : blogs.length === 0 ? (
            <div className="col-span-2 text-center py-8 text-slate-400">Brak artykułów.</div>
          ) : (
            blogs.map(blog => (
              <div key={blog.id} className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col gap-3">
                <div className="flex gap-3">
                  {blog.imageUrl && (
                    <img src={`${process.env.NEXT_PUBLIC_API_URL}${blog.imageUrl}`} alt={blog.title} className="w-20 h-20 object-cover rounded-lg bg-slate-100" />
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-black text-slate-800 truncate">{blog.title}</h3>
                    <div className="flex items-center gap-1 text-[10px] text-slate-500 mt-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(blog.date).toLocaleDateString("pl-PL")}
                    </div>
                    <p className="text-xs text-slate-500 mt-2 line-clamp-2">{blog.content}</p>
                  </div>
                </div>
                <div className="flex gap-2 pt-2 border-t border-slate-100">
                  <button onClick={() => handleEdit(blog)} className="flex-1 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition flex items-center justify-center gap-1 text-xs font-bold">
                    <Edit2 className="w-3.5 h-3.5" /> Edytuj
                  </button>
                  <button onClick={() => handleDelete(blog.id)} className="flex-1 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition flex items-center justify-center gap-1 text-xs font-bold">
                    <Trash2 className="w-3.5 h-3.5" /> Usuń
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 pt-4 border-t border-slate-100">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-50">Poprzednia</button>
            <span className="px-4 py-2 text-xs font-bold text-slate-500">Strona {page} z {totalPages}</span>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-50">Następna</button>
          </div>
        )}
      </div>
    </div>
  );
}