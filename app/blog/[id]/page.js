"use client";

import { useState, useEffect } from "react";
import { useApp } from "@/app/context/AppContext";
import { ArrowLeft, Calendar, Clock, Sparkles } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/axios";

export default function BlogPost() {
  const router = useRouter();
  const { id } = useParams();
  const { lang, t } = useApp();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        let blogData = null;

        // 1. Try fetching the single blog post by ID directly
        try {
          const response = await api.get(`/api/blogs/${id}`);
          if (response.data.success) {
            blogData = response.data.data;
          }
        } catch (err) {
          // 2. Fallback: If GET /:id is not implemented, fetch all and find the match
          const allResponse = await api.get("/api/blogs", { params: { limit: 100 } });
          if (allResponse.data.success && allResponse.data.data?.data) {
            blogData = allResponse.data.data.data.find((b) => b.id === id);
          }
        }

        if (blogData) {
          // Calculate read time (approx 200 words per minute)
          const wordCount = blogData.content ? blogData.content.trim().split(/\s+/).length : 0;
          const readTimeMin = Math.max(1, Math.ceil(wordCount / 200));

          setPost({
            id: blogData.id,
            title: blogData.title,
            content: blogData.content,
            image: `${baseUrl}${blogData.image}`,
            date: blogData.date ? blogData.date.split("T")[0] : "",
            tag: "Blog", // Default tag since API doesn't provide one
            readTimePl: `${readTimeMin} min czytania`,
            readTimeEn: `${readTimeMin} min read`,
          });
        }
      } catch (error) {
        console.error("Failed to fetch blog post:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  // Loading State
  if (loading) {
    return (
      <div className="max-w-xl mx-auto text-center py-20 px-4">
        <h2 className="text-xl font-bold text-slate-800 mb-4">Loading...</h2>
      </div>
    );
  }

  // Not Found State
  if (!post) {
    return (
      <div className="max-w-xl mx-auto text-center py-20 px-4">
        <h2 className="text-xl font-bold text-slate-800 mb-4">Wpis nie został znaleziony / Article Not Found</h2>
        <Link href="/blog" className="inline-flex items-center space-x-1 text-brand-red hover:underline font-bold text-sm">
          <ArrowLeft className="w-4 h-4" />
          <span>Powrót do bloga / Return to blog</span>
        </Link>
      </div>
    );
  }

  const title = post.title;
  const readTime = lang === "pl" ? post.readTimePl : post.readTimeEn;

  return (
    <div className="container mx-auto px-4 sm:px-6 space-y-8 py-12 animate-fade-in">
      {/* Back button */}
      <Link href="/blog" className="inline-flex items-center space-x-2 text-xs font-bold text-slate-505 hover:text-slate-800 transition">
        <ArrowLeft className="w-4 h-4" />
        <span>{lang === "pl" ? "POWRÓT DO LISTY WPISÓW" : "BACK TO BLOG"}</span>
      </Link>

      <div className="container mx-auto space-y-12">
        {/* Main Article Content */}
        <div className="bg-white border border-slate-100 p-6 sm:p-8 rounded-2xl shadow-sm space-y-6">
          {/* Cover */}
          <div className="h-96  overflow-hidden bg-slate-100 rounded-xl relative">
            <img
              src={post.image}
              alt={title}
              className="w-full h-full object-cover"
            />
            <span className="absolute bottom-4 left-4 px-2.5 py-1 bg-brand-red/90 text-[10px] text-white rounded font-black uppercase tracking-wider">
              {post.tag}
            </span>
          </div>

          {/* Metadata */}
          <div className="flex items-center space-x-4 text-xs text-slate-400 font-bold border-b border-slate-100 pb-4">
            <div className="flex items-center space-x-1.5">
              <Calendar className="w-4 h-4 text-slate-350" />
              <span>{t("publishedOn")}: {post.date}</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <Clock className="w-4 h-4 text-slate-350" />
              <span>{readTime}</span>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
            {title}
          </h1>

          {/* Main content body - Dynamically rendered from database string */}
          <div className="pt-2 space-y-4 text-sm text-slate-650 leading-relaxed font-medium">
            {post.content.split(/\n\s*\n/).map((paragraph, index) => (
              <p key={index} className="text-base text-slate-800">
                {paragraph.trim()}
              </p>
            ))}
          </div>

          {/* Contact Box Callout */}
          <div className="p-5 bg-slate-50 border border-slate-200/60 rounded-xl mt-8 space-y-3">
            <p className="text-xs font-black text-slate-800 flex items-center space-x-1.5 uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-brand-red" />
              <span>{lang === "pl" ? "Potrzebujesz wynająć auto?" : "Need a car rental solution?"}</span>
            </p>
            <p className="text-xs text-slate-500 font-semibold leading-relaxed">
              {lang === "pl"
                ? "CAR-GO.PL oferuje nowoczesne i bezpieczne samochody z nielimitowanym przebiegiem. Sprawdź naszą ofertę lub skontaktuj się z nami w celu wyceny indywidualnej dostawy."
                : "CAR-GO.PL offers modern and safe cars with unlimited mileage. Explore our active fleet or contact us for custom address delivery rates."}
            </p>
            <div className="flex space-x-3 pt-1">
              <Link
                href="/vehicles"
                className="px-4 py-2 bg-brand-red hover:bg-brand-red-hover text-white text-[10px] font-black tracking-wider uppercase rounded transition"
              >
                {t("navVehicles").toUpperCase()}
              </Link>
              <Link
                href="/contact"
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-[10px] font-black tracking-wider uppercase rounded transition"
              >
                {t("navContact").toUpperCase()}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}