"use client";

import { useState, useEffect } from "react";
import SidebarCTA from "@/app/components/SidebarCTA";
import { useApp } from "@/app/context/AppContext";
import { ArrowRight, Calendar, Clock } from "lucide-react";
import Link from "next/link";
import api from "@/lib/axios";

export const blogPosts = [
  {
    id: "stress-free-rental-tips",
    titlePl: "5 Porad jak wynająć samochód bez stresu i ukrytych kosztów",
    titleEn: "5 Tips for Stress-Free Car Rental with Zero Hidden Fees",
    summaryPl:
      "Wypożyczenie auta to świetny sposób na niezależność, ale warto pamiętać o kilku ważnych zasadach. Przeczytaj, na co zwrócić uwagę przed odbiorem auta.",
    summaryEn:
      "Renting a car is a great way to stay independent, but it's important to remember a few key rules. Read on to know what to check before pickup.",
    date: "2026-06-01",
    readTimePl: "4 min czytania",
    readTimeEn: "4 min read",
    tag: "Porady / Tips",
    image:
      "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "long-term-vs-short-term",
    titlePl:
      "Wynajem długoterminowy vs krótko- i średnioterminowy. Porównanie korzyści",
    titleEn: "Long-Term vs Short-Term Car Rental. Benefit Comparison",
    summaryPl:
      "Zastanawiasz się, które rozwiązanie finansowe jest korzystniejsze dla Twojej firmy lub wyjazdów prywatnych? Porównujemy koszty ubezpieczenia, serwisu i eksploatacji.",
    summaryEn:
      "Wondering which financial solution is more beneficial for your business or personal travels? We compare the cost of insurance, service, and maintenance.",
    date: "2026-06-10",
    readTimePl: "6 min czytania",
    readTimeEn: "6 min read",
    tag: "Biznes / Business",
    image:
      "https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "discover-lower-silesia-by-car",
    titlePl:
      "Odkryj rejon Oławy, Brzegu i Skarbimierza. Najciekawsze trasy weekendowe",
    titleEn: "Discover Oława, Brzeg and Skarbimierz. Best Weekend Roadtrips",
    summaryPl:
      "Dolny Śląsk i Opolszczyzna kryją wiele niesamowitych zabytków i malowniczych tras. Wybierz jeden z naszych sprawdzonych planów wycieczek i ruszaj w drogę.",
    summaryEn:
      "Lower Silesia and Opole region hide many amazing monuments and scenic roads. Select one of our proven trip plans and hit the road.",
    date: "2026-06-14",
    readTimePl: "5 min czytania",
    readTimeEn: "5 min read",
    tag: "Podróże / Travels",
    image:
      "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=600&auto=format&fit=crop",
  },
];

export default function Blog() {
  const { lang, t } = useApp();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const baseUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

        const response = await api.get("/api/blogs", {
          params: { page: 1, limit: 20 },
        });

        if (response.data.success && response.data.data?.data) {
          const mappedPosts = response.data.data.data.map((blog) => {
            const wordCount = blog.content
              ? blog.content.trim().split(/\s+/).length
              : 0;
            const readTimeMin = Math.max(1, Math.ceil(wordCount / 200));
            const formattedDate = blog.date ? blog.date.split("T")[0] : "";

            return {
              id: blog.id,
              titlePl: blog.title,
              titleEn: blog.title,
              summaryPl: blog.content,
              summaryEn: blog.content,
              date: formattedDate,
              readTimePl: `${readTimeMin} min czytania`,
              readTimeEn: `${readTimeMin} min read`,
              tag: "Blog",
              image: `${baseUrl}${blog.image}`,
            };
          });

          setPosts(mappedPosts);
        }
      } catch (error) {
        console.error("Failed to fetch blogs:", error);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <div className="container mx-auto max-lg:py-20 px-4 sm:px-6 space-y-12">
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-800 uppercase">
          {t("blogTitle")}
        </h1>
        <p className="text-sm font-semibold text-slate-500">
          {t("blogSubtitle")}
        </p>
      </div>

      <div className="max-w-5xl mx-auto space-y-12">
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {posts.map((post) => {
              const title = lang === "pl" ? post.titlePl : post.titleEn;
              const summary = lang === "pl" ? post.summaryPl : post.summaryEn;
              const readTime =
                lang === "pl" ? post.readTimePl : post.readTimeEn;

              return (
                <div
                  key={post.id}
                  className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:border-slate-250 transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="h-48 overflow-hidden bg-slate-100 relative">
                      <img
                        src={post.image}
                        alt={title}
                        className="w-full h-full object-cover transition duration-300 hover:scale-105"
                      />
                      <span className="absolute bottom-3 left-3 px-2 py-0.5 bg-slate-900/75 backdrop-blur-md text-[10px] text-white rounded font-bold uppercase tracking-wider">
                        {post.tag}
                      </span>
                    </div>

                    <div className="px-5 space-y-2.5">
                      <div className="flex items-center space-x-3 text-[10px] text-slate-400 font-bold">
                        <span className="flex items-center space-x-1">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{post.date}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{readTime}</span>
                        </span>
                      </div>

                      <h2 className="text-base font-extrabold text-slate-800 line-clamp-2 leading-snug group-hover:text-brand-red">
                        {title}
                      </h2>

                      <p className="text-xs text-slate-500 font-semibold line-clamp-3 leading-relaxed">
                        {summary}
                      </p>
                    </div>
                  </div>

                  <div className="p-5 pt-0 mt-4">
                    <Link
                      href={`/blog/${post.id}`}
                      className="inline-flex items-center space-x-1.5 text-xs font-bold text-brand-red hover:text-brand-red-hover transition"
                    >
                      <span>{t("readMore")}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA Panel */}
        {/* <div className="max-w-xl mx-auto pt-4">
          <SidebarCTA />
        </div> */}
      </div>
    </div>
  );
}
