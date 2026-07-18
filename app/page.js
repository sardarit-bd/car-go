"use client";

import Hero from "@/app/components/home/Hero";
import FleetPreview from "@/app/components/home/FleetPreview";
import ServiceCallout from "@/app/components/home/ServiceCallout";
import AboutCompany from "@/app/components/home/AboutCompany";
import LongTermPromo from "@/app/components/home/LongTermPromo";
import ReviewsSection from "@/app/components/home/ReviewsSection";
import Blog from "@/app/components/home/Blog";
import FAQ from "./faq/page";
import { useApp } from "@/app/context/AppContext";

export default function Home() {
  const { lang, vehicles, reviews, cmsTexts, t } = useApp();

  const getCmsText = (key, fallback) => cmsTexts[key]?.[lang] || fallback;
  const approvedReviews = reviews.filter((r) => r.approved).slice(0, 3);

  return (
    <div className="space-y-0">
      <Hero lang={lang} getCmsText={getCmsText} t={t} />
      <FleetPreview vehicles={vehicles} t={t} />
      <AboutCompany lang={lang} t={t} />
      <LongTermPromo lang={lang} getCmsText={getCmsText} t={t} />
      <ReviewsSection
        reviews={reviews}
        approvedReviews={approvedReviews}
        t={t}
      />
      <Blog lang={lang} t={t} />
      <FAQ lang={lang} t={t} />
    </div>
  );
}
