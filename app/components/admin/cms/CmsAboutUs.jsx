"use client";

import React, { useState, useEffect, useRef } from "react"; // Added useRef
import api from "@/lib/axios";
import * as yup from "yup";
import { Save, Plus, Trash2, Edit2, X, Upload } from "lucide-react";

const aboutUsSchema = yup.object().shape({
  titlePl: yup.string().required("Title PL is required"),
  titleEn: yup.string().required("Title EN is required"),
  subtitlePl: yup.string().required("Subtitle PL is required"),
  subtitleEn: yup.string().required("Subtitle EN is required"),

  feature1Icon: yup.string().required("Feature 1 icon is required"),
  feature1TitlePl: yup.string().required("Feature 1 title PL is required"),
  feature1TitleEn: yup.string().required("Feature 1 title EN is required"),
  feature1DescPl: yup.string().required("Feature 1 description PL is required"),
  feature1DescEn: yup.string().required("Feature 1 description EN is required"),

  feature2Icon: yup.string().required("Feature 2 icon is required"),
  feature2TitlePl: yup.string().required("Feature 2 title PL is required"),
  feature2TitleEn: yup.string().required("Feature 2 title EN is required"),
  feature2DescPl: yup.string().required("Feature 2 description PL is required"),
  feature2DescEn: yup.string().required("Feature 2 description EN is required"),

  ctaTextPl: yup.string().required("CTA text PL is required"),
  ctaTextEn: yup.string().required("CTA text EN is required"),
  ctaLink: yup.string().required("CTA link is required"),

  image1Url: yup.string().required("Image 1 URL is required"),
  image2Url: yup.string().required("Image 2 URL is required"),
});

export default function CmsAboutUs() {
  const [aboutUs, setAboutUs] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Added upload states and refs
  const [uploadingImage1, setUploadingImage1] = useState(false);
  const [uploadingImage2, setUploadingImage2] = useState(false);
  const fileInput1Ref = useRef(null);
  const fileInput2Ref = useRef(null);

  const [formData, setFormData] = useState({
    titlePl: "",
    titleEn: "",
    subtitlePl: "",
    subtitleEn: "",

    feature1Icon: "",
    feature1TitlePl: "",
    feature1TitleEn: "",
    feature1DescPl: "",
    feature1DescEn: "",

    feature2Icon: "",
    feature2TitlePl: "",
    feature2TitleEn: "",
    feature2DescPl: "",
    feature2DescEn: "",

    ctaTextPl: "",
    ctaTextEn: "",
    ctaLink: "",

    image1Url: "",
    image2Url: "",
  });

  useEffect(() => {
    fetchAboutUs();
  }, []);

  const fetchAboutUs = async () => {
    try {
      const res = await api.get("/api/admin/cms/about-us");
      const data = res.data.data || res.data;
      setAboutUs(data);
      setFormData({
        titlePl: data.titlePl || "",
        titleEn: data.titleEn || "",
        subtitlePl: data.subtitlePl || "",
        subtitleEn: data.subtitleEn || "",

        feature1Icon: data.feature1Icon || "",
        feature1TitlePl: data.feature1TitlePl || "",
        feature1TitleEn: data.feature1TitleEn || "",
        feature1DescPl: data.feature1DescPl || "",
        feature1DescEn: data.feature1DescEn || "",

        feature2Icon: data.feature2Icon || "",
        feature2TitlePl: data.feature2TitlePl || "",
        feature2TitleEn: data.feature2TitleEn || "",
        feature2DescPl: data.feature2DescPl || "",
        feature2DescEn: data.feature2DescEn || "",

        ctaTextPl: data.ctaTextPl || "",
        ctaTextEn: data.ctaTextEn || "",
        ctaLink: data.ctaLink || "",

        image1Url: data.image1Url || "",
        image2Url: data.image2Url || "",
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      await aboutUsSchema.validate(formData, { abortEarly: false });
      setLoading(true);

      await api.post("/api/admin/cms/about-us", formData);

      setSuccess("About Us section saved successfully!");
      fetchAboutUs();
    } catch (err) {
      if (err.name === "ValidationError") {
        setError(err.inner.map((e) => e.message).join(", "));
      } else {
        setError("Failed to save About Us section.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!aboutUs) return;

    if (confirm("Delete this About Us content?")) {
      try {
        await api.delete(`/api/admin/cms/about-us/${aboutUs.id}`);
        setSuccess("About Us deleted successfully!");
        setAboutUs(null);
        setFormData({
          titlePl: "",
          titleEn: "",
          subtitlePl: "",
          subtitleEn: "",
          feature1Icon: "",
          feature1TitlePl: "",
          feature1TitleEn: "",
          feature1DescPl: "",
          feature1DescEn: "",
          feature2Icon: "",
          feature2TitlePl: "",
          feature2TitleEn: "",
          feature2DescPl: "",
          feature2DescEn: "",
          ctaTextPl: "",
          ctaTextEn: "",
          ctaLink: "",
          image1Url: "",
          image2Url: "",
        });
      } catch (err) {
        setError("Failed to delete About Us.");
      }
    }
  };

  // New Image Upload Handler
  const handleImageUpload = async (e, imageKey, setUploading) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setError("");

    const uploadFormData = new FormData();
    uploadFormData.append("image", file);

    try {
      const res = await api.post(
        "/api/admin/cms/about-us/upload",
        uploadFormData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );

      // Assuming your backend returns the URL in res.data.data.url or res.data.url
      const imageUrl = res.data?.data?.url || res.data?.url;

      if (imageUrl) {
        setFormData((prev) => ({ ...prev, [imageKey]: imageUrl }));
        setSuccess("Image uploaded successfully!");
      } else {
        setError("Failed to get image URL from server.");
      }
    } catch (err) {
      setError("Failed to upload image.");
    } finally {
      setUploading(false);
      // Reset file input so the same file can be selected again if needed
      e.target.value = "";
    }
  };

  return (
    <div className="glass-panel p-6 rounded-2xl space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
        <h2 className="text-base font-extrabold text-slate-800 uppercase tracking-wider">
          About Us Section
        </h2>
        {aboutUs && (
          <button
            onClick={handleDelete}
            className="p-2 text-red-600 hover:bg-red-50 rounded transition"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

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

      <form onSubmit={handleSave} className="space-y-6">
        {/* Main Content */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-700 uppercase">
            Main Content
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 text-xs font-bold text-slate-500">
                Title (PL) *
              </label>
              <input
                type="text"
                value={formData.titlePl}
                onChange={(e) =>
                  setFormData({ ...formData, titlePl: e.target.value })
                }
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded text-slate-800 focus:outline-none focus:border-brand-red text-sm"
              />
            </div>
            <div>
              <label className="block mb-1 text-xs font-bold text-slate-500">
                Title (EN) *
              </label>
              <input
                type="text"
                value={formData.titleEn}
                onChange={(e) =>
                  setFormData({ ...formData, titleEn: e.target.value })
                }
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded text-slate-800 focus:outline-none focus:border-brand-red text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 text-xs font-bold text-slate-500">
                Subtitle (PL) *
              </label>
              <textarea
                value={formData.subtitlePl}
                onChange={(e) =>
                  setFormData({ ...formData, subtitlePl: e.target.value })
                }
                rows="2"
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded text-slate-800 focus:outline-none focus:border-brand-red resize-none text-sm"
              />
            </div>
            <div>
              <label className="block mb-1 text-xs font-bold text-slate-500">
                Subtitle (EN) *
              </label>
              <textarea
                value={formData.subtitleEn}
                onChange={(e) =>
                  setFormData({ ...formData, subtitleEn: e.target.value })
                }
                rows="2"
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded text-slate-800 focus:outline-none focus:border-brand-red resize-none text-sm"
              />
            </div>
          </div>
        </div>

        {/* Feature 1 */}
        <div className="space-y-4 border-t border-slate-200 pt-4">
          <h3 className="text-sm font-bold text-slate-700 uppercase">
            Feature 1
          </h3>
          <div>
            <label className="block mb-1 text-xs font-bold text-slate-500">
              Icon (Lucide icon name) *
            </label>
            <input
              type="text"
              value={formData.feature1Icon}
              onChange={(e) =>
                setFormData({ ...formData, feature1Icon: e.target.value })
              }
              placeholder="e.g., Calendar, Clock, CheckCircle"
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded text-slate-800 focus:outline-none focus:border-brand-red text-sm"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 text-xs font-bold text-slate-500">
                Title (PL) *
              </label>
              <input
                type="text"
                value={formData.feature1TitlePl}
                onChange={(e) =>
                  setFormData({ ...formData, feature1TitlePl: e.target.value })
                }
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded text-slate-800 focus:outline-none focus:border-brand-red text-sm"
              />
            </div>
            <div>
              <label className="block mb-1 text-xs font-bold text-slate-500">
                Title (EN) *
              </label>
              <input
                type="text"
                value={formData.feature1TitleEn}
                onChange={(e) =>
                  setFormData({ ...formData, feature1TitleEn: e.target.value })
                }
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded text-slate-800 focus:outline-none focus:border-brand-red text-sm"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 text-xs font-bold text-slate-500">
                Description (PL) *
              </label>
              <textarea
                value={formData.feature1DescPl}
                onChange={(e) =>
                  setFormData({ ...formData, feature1DescPl: e.target.value })
                }
                rows="2"
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded text-slate-800 focus:outline-none focus:border-brand-red resize-none text-sm"
              />
            </div>
            <div>
              <label className="block mb-1 text-xs font-bold text-slate-500">
                Description (EN) *
              </label>
              <textarea
                value={formData.feature1DescEn}
                onChange={(e) =>
                  setFormData({ ...formData, feature1DescEn: e.target.value })
                }
                rows="2"
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded text-slate-800 focus:outline-none focus:border-brand-red resize-none text-sm"
              />
            </div>
          </div>
        </div>

        {/* Feature 2 */}
        <div className="space-y-4 border-t border-slate-200 pt-4">
          <h3 className="text-sm font-bold text-slate-700 uppercase">
            Feature 2
          </h3>
          <div>
            <label className="block mb-1 text-xs font-bold text-slate-500">
              Icon (Lucide icon name) *
            </label>
            <input
              type="text"
              value={formData.feature2Icon}
              onChange={(e) =>
                setFormData({ ...formData, feature2Icon: e.target.value })
              }
              placeholder="e.g., MapPin, Car, Route"
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded text-slate-800 focus:outline-none focus:border-brand-red text-sm"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 text-xs font-bold text-slate-500">
                Title (PL) *
              </label>
              <input
                type="text"
                value={formData.feature2TitlePl}
                onChange={(e) =>
                  setFormData({ ...formData, feature2TitlePl: e.target.value })
                }
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded text-slate-800 focus:outline-none focus:border-brand-red text-sm"
              />
            </div>
            <div>
              <label className="block mb-1 text-xs font-bold text-slate-500">
                Title (EN) *
              </label>
              <input
                type="text"
                value={formData.feature2TitleEn}
                onChange={(e) =>
                  setFormData({ ...formData, feature2TitleEn: e.target.value })
                }
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded text-slate-800 focus:outline-none focus:border-brand-red text-sm"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 text-xs font-bold text-slate-500">
                Description (PL) *
              </label>
              <textarea
                value={formData.feature2DescPl}
                onChange={(e) =>
                  setFormData({ ...formData, feature2DescPl: e.target.value })
                }
                rows="2"
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded text-slate-800 focus:outline-none focus:border-brand-red resize-none text-sm"
              />
            </div>
            <div>
              <label className="block mb-1 text-xs font-bold text-slate-500">
                Description (EN) *
              </label>
              <textarea
                value={formData.feature2DescEn}
                onChange={(e) =>
                  setFormData({ ...formData, feature2DescEn: e.target.value })
                }
                rows="2"
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded text-slate-800 focus:outline-none focus:border-brand-red resize-none text-sm"
              />
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="space-y-4 border-t border-slate-200 pt-4">
          <h3 className="text-sm font-bold text-slate-700 uppercase">
            CTA Button
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block mb-1 text-xs font-bold text-slate-500">
                Button Text (PL) *
              </label>
              <input
                type="text"
                value={formData.ctaTextPl}
                onChange={(e) =>
                  setFormData({ ...formData, ctaTextPl: e.target.value })
                }
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded text-slate-800 focus:outline-none focus:border-brand-red text-sm"
              />
            </div>
            <div>
              <label className="block mb-1 text-xs font-bold text-slate-500">
                Button Text (EN) *
              </label>
              <input
                type="text"
                value={formData.ctaTextEn}
                onChange={(e) =>
                  setFormData({ ...formData, ctaTextEn: e.target.value })
                }
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded text-slate-800 focus:outline-none focus:border-brand-red text-sm"
              />
            </div>
            <div>
              <label className="block mb-1 text-xs font-bold text-slate-500">
                Button Link *
              </label>
              <input
                type="text"
                value={formData.ctaLink}
                onChange={(e) =>
                  setFormData({ ...formData, ctaLink: e.target.value })
                }
                placeholder="/contact"
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded text-slate-800 focus:outline-none focus:border-brand-red text-sm"
              />
            </div>
          </div>
        </div>

        {/* Images - UPDATED SECTION */}
        <div className="space-y-4 border-t border-slate-200 pt-4">
          <h3 className="text-sm font-bold text-slate-700 uppercase">Images</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 text-xs font-bold text-slate-500">
                Image 1 URL *
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.image1Url}
                  onChange={(e) =>
                    setFormData({ ...formData, image1Url: e.target.value })
                  }
                  className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded text-slate-800 focus:outline-none focus:border-brand-red text-sm"
                />
                <button
                  type="button"
                  onClick={() => fileInput1Ref.current.click()}
                  disabled={uploadingImage1}
                  className="p-2 bg-slate-100 hover:bg-slate-200 rounded transition disabled:opacity-50"
                >
                  <Upload className="w-4 h-4 text-slate-600" />
                </button>
                <input
                  ref={fileInput1Ref}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) =>
                    handleImageUpload(e, "image1Url", setUploadingImage1)
                  }
                />
              </div>
              {formData.image1Url && (
                <img
                  src={formData.image1Url}
                  alt="Preview 1"
                  className="mt-2 w-full h-32 object-cover rounded"
                />
              )}
              {uploadingImage1 && (
                <p className="text-xs text-blue-600 mt-1 font-bold">
                  Uploading...
                </p>
              )}
            </div>

            <div>
              <label className="block mb-1 text-xs font-bold text-slate-500">
                Image 2 URL *
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.image2Url}
                  onChange={(e) =>
                    setFormData({ ...formData, image2Url: e.target.value })
                  }
                  className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded text-slate-800 focus:outline-none focus:border-brand-red text-sm"
                />
                <button
                  type="button"
                  onClick={() => fileInput2Ref.current.click()}
                  disabled={uploadingImage2}
                  className="p-2 bg-slate-100 hover:bg-slate-200 rounded transition disabled:opacity-50"
                >
                  <Upload className="w-4 h-4 text-slate-600" />
                </button>
                <input
                  ref={fileInput2Ref}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) =>
                    handleImageUpload(e, "image2Url", setUploadingImage2)
                  }
                />
              </div>
              {formData.image2Url && (
                <img
                  src={formData.image2Url}
                  alt="Preview 2"
                  className="mt-2 w-full h-32 object-cover rounded"
                />
              )}
              {uploadingImage2 && (
                <p className="text-xs text-blue-600 mt-1 font-bold">
                  Uploading...
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-brand-red hover:bg-brand-red-hover text-white font-bold rounded-lg transition flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              "Saving..."
            ) : (
              <>
                <Save className="w-4 h-4" />
                {aboutUs ? "Update About Us" : "Save About Us"}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
