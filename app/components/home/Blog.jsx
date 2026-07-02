"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Calendar, ArrowUpRight } from "lucide-react";
// Adjust this import if your axios instance is exported differently in lib/axios.js
import api from "@/lib/axios"; 

// Helper function to format ISO date to "Month Day, Year"
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export default function BlogSection({ t }) {
  // Initialize with your original hardcoded data to prevent UI flicker/loading states
  const [featuredPost, setFeaturedPost] = useState({
    id: 1,
    title: "Top Tips For Booking Your Car Rental: What You Need To Know",
    date: "August 5, 2024",
    image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80",
    slug: "/blog/1"
  });

  const [recentPosts, setRecentPosts] = useState([
    {
      id: 2,
      title: "Exploring Your Rental Car Options: Sedan, Suv, Or Convertible?",
      date: "August 5, 2024",
      image: "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=600&q=80",
      slug: "/blog/2"
    },
    {
      id: 3,
      title: "The Pros And Cons Of Renting A Car Vs. Using Rideshare Services",
      date: "August 5, 2024",
      image: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=600&q=80",
      slug: "/blog/3"
    },
    {
      id: 4,
      title: "Why You Should Consider Renting A Luxury Car For Your Next Trip",
      date: "August 5, 2024",
      image: "https://images.unsplash.com/photo-1503376763036-066120622c74?auto=format&fit=crop&w=600&q=80",
      slug: "/blog/4"
    }
  ]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        // Fallback to localhost if env variable is missing
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        
        // Fetch 4 blogs: 1 for featured, 3 for recent
        const response = await api.get("/api/blogs", {
          params: { page: 1, limit: 4 },
        });

        // Check if API returned success and has data
        if (response.data.success && response.data.data?.data?.length > 0) {
          const blogs = response.data.data.data;

          // Map API data to match the exact structure your UI expects
          const mappedPosts = blogs.map((blog) => ({
            id: blog.id,
            title: blog.title,
            date: formatDate(blog.date),
            // Prepend backend URL to the relative image path
            image: `${baseUrl}${blog.image}`,
            // Use blog.id to match your existing app/blog/[id] dynamic route folder
            slug: `/blog/${blog.id}`, 
          }));

          // Update state with the first post as featured, and the rest as recent
          setFeaturedPost(mappedPosts[0]);
          setRecentPosts(mappedPosts.slice(1, 4));
        }
      } catch (error) {
        console.error("Failed to fetch blogs:", error);
        // Fails silently, keeping the initial hardcoded UI intact
      }
    };

    fetchBlogs();
  }, []);

  return (
    <section className="py-16 sm:py-24 bg-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808005_1px,transparent_1px),linear-gradient(to_bottom,#80808005_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none" />
      
      <div className="px-4 sm:px-6 container mx-auto relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <span className="text-brand-red font-bold text-sm tracking-wide flex items-center justify-center gap-1 mb-3">
            <span className="text-brand-red">*</span> Latest Articles
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight">
            Stay informed and inspired <br className="hidden sm:block" /> for your next journey
          </h2>
          <div className="w-2 h-2 bg-brand-red rounded-full mx-auto mt-4"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Featured Post */}
          <div className="group relative h-full min-h-[500px] rounded-3xl overflow-hidden">
            <div className="absolute inset-0">
              <img 
                src={featuredPost.image} 
                alt={featuredPost.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent opacity-90"></div>
            </div>
            
            <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-end">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-white/90 text-sm font-medium">
                  <Calendar className="w-4 h-4" />
                  <span>{featuredPost.date}</span>
                </div>
                
                <h3 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
                  {featuredPost.title}
                </h3>
                
                <Link 
                  href={featuredPost.slug}
                  className="inline-flex items-center justify-center w-12 h-12 bg-brand-red hover:bg-brand-red-hover text-white rounded-full transition-all duration-300 hover:scale-110 group-hover:shadow-lg group-hover:shadow-brand-red/40"
                >
                  <ArrowUpRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>

          {/* Recent Posts */}
          <div className="space-y-6">
            {recentPosts.map((post) => (
              <div 
                key={post.id}
                className="group flex gap-4 sm:gap-6 p-4 rounded-2xl hover:bg-slate-50 transition-all duration-300 border border-transparent hover:border-slate-200"
              >
                <div className="w-32 sm:w-40 h-24 sm:h-28 flex-shrink-0 rounded-xl overflow-hidden">
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                
                <div className="flex-1 flex flex-col justify-center">
                  <div className="flex items-center gap-2 text-slate-500 text-xs font-medium mb-2">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{post.date}</span>
                  </div>
                  
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug mb-3 group-hover:text-brand-red transition-colors duration-300">
                    {post.title}
                  </h3>
                  
                  <Link 
                    href={post.slug}
                    className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-red hover:text-brand-red-hover transition-colors duration-300"
                  >
                    Read Story
                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-12">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white hover:bg-slate-50 border-2 border-slate-200 hover:border-brand-red/30 text-sm font-bold text-slate-800 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300"
          >
            <span>VIEW ALL ARTICLES</span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </div>
      </div>
    </section>
  );
}