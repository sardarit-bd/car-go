"use client";

import { Car, MapPin, Headphones, ShieldCheck } from "lucide-react";
import { useApp } from "@/app/context/AppContext";

export default function AboutCompany({ t }) {
  const { lang, cmsWhyChooseUs, cmsWhyChooseUsFeatures } = useApp();
  console.log("cmsWhyChooseUsFeatures:", cmsWhyChooseUsFeatures);
  const icons = [Car, Headphones, MapPin, ShieldCheck];

  // Map dynamic CMS features to current language and assign icons by index
  const dynamicFeatures = (cmsWhyChooseUsFeatures || [])
    .filter((f) => f.isActive)
    .sort((a, b) => a.order - b.order)
    .map((f, index) => ({
      icon: icons[index] || Car,
      title: lang === "pl" ? f.titlePl : f.titleEn,
      description: lang === "pl" ? f.descriptionPl : f.descriptionEn,
    }));

  // Fallback to hardcoded features if CMS data is not loaded
  const features = dynamicFeatures.length > 0 ? dynamicFeatures : [
    { icon: Car, title: "Extensive Fleet Options", description: "Quisque Sollicitudin Feugiat Risus, Eu Posuere Ex Euismod Eu. Phasellus Hendrerit, Massa" },
    { icon: Headphones, title: "Exceptional Customer Service", description: "Quisque Sollicitudin Feugiat Risus, Eu Posuere Ex Euismod Eu. Phasellus Hendrerit, Massa" },
    { icon: MapPin, title: "Convenient Locations", description: "Quisque Sollicitudin Feugiat Risus, Eu Posuere Ex Euismod Eu. Phasellus Hendrerit, Massa" },
    { icon: ShieldCheck, title: "Reliability And Safety", description: "Quisque Sollicitudin Feugiat Risus, Eu Posuere Ex Euismod Eu. Phasellus Hendrerit, Massa" }
  ];

  const displaySubtitle = (lang === "pl" ? cmsWhyChooseUs?.subtitlePl : cmsWhyChooseUs?.subtitleEn) || "Why Choose Us";
  const displayTitle = (lang === "pl" ? cmsWhyChooseUs?.titlePl : cmsWhyChooseUs?.titleEn) || "Unmatched quality and service for your needs";
  
  // Handle image URL (prepend API URL if it's a relative path from uploads)
  const rawImage = cmsWhyChooseUs?.mainImage;
  const displayImage = rawImage 
    ? (rawImage.startsWith("http") ? rawImage : `${process.env.NEXT_PUBLIC_API_URL}${rawImage}`)
    : "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&w=800&q=80";

  return (
    <section className="py-16 sm:py-24 bg-white relative overflow-hidden">
      <div className="absolute left-0 top-1/2 -translate-y-1/2 opacity-30 pointer-events-none">
        <div className="space-y-3">
          <div className="w-12 h-12 rounded-full border-2 border-brand-red/20"></div>
          <div className="w-3 h-3 rounded-full bg-brand-red"></div>
          <div className="w-6 h-6 rounded-full border-2 border-slate-200"></div>
        </div>
      </div>

      <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-30 pointer-events-none">
        <div className="space-y-3 text-right">
          <div className="w-6 h-6 rounded-full border-2 border-slate-200 ml-auto"></div>
          <div className="w-3 h-3 rounded-full bg-brand-red ml-auto"></div>
          <div className="w-12 h-12 rounded-full border-2 border-brand-red/20 ml-auto"></div>
        </div>
      </div>

      <div className="px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="text-center mb-12 sm:mb-16">
          <span className="text-brand-red font-bold text-sm tracking-wide flex items-center justify-center gap-1 mb-3">
            <span className="text-brand-red">*</span> {displaySubtitle}
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight max-w-3xl mx-auto">
            {displayTitle}
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-center">
          <div className="space-y-8 lg:space-y-12 order-2 lg:order-1">
            {features.slice(0, 2).map((feature, index) => (
              <div key={index} className="flex items-start gap-4 group">
                <div className="w-14 h-14 rounded-full bg-brand-red/10 flex items-center justify-center shrink-0 group-hover:bg-brand-red/20 transition-colors duration-300">
                  <feature.icon className="w-6 h-6 text-brand-red" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-slate-900 text-lg mb-2">{feature.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="relative flex justify-center order-1 lg:order-2">
            <div className="relative w-full max-w-md aspect-square">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden">
                <img src={displayImage} alt="Car" className="w-full h-full object-cover" />
              </div>
              <div className="absolute top-4 right-8 w-3 h-3 bg-brand-red rounded-full"></div>
            </div>
          </div>

          <div className="space-y-8 lg:space-y-12 order-3">
            {features.slice(2, 4).map((feature, index) => (
              <div key={index} className="flex items-start gap-4 group">
                <div className="w-14 h-14 rounded-full bg-brand-red/10 flex items-center justify-center shrink-0 group-hover:bg-brand-red/20 transition-colors duration-300">
                  <feature.icon className="w-6 h-6 text-brand-red" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-slate-900 text-lg mb-2">{feature.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}