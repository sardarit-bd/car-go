"use client";

import Link from "next/link";
import { ArrowUpRight, Smartphone, Car } from "lucide-react";
import { useApp } from "@/app/context/AppContext";

// Map backend icon strings to actual Lucide React components.
// Extend this object as your backend starts sending real icon names (e.g., "Calendar", "MapPin").
const iconMap = {
  Smartphone: Smartphone,
  Car: Car,
};

export default function LongTermPromo({ lang, getCmsText, t }) {
  const { aboutUs } = useApp();

  // 1. Extract text with language switching and getCmsText fallbacks (matching Hero pattern)
  const displayTitle =
    (lang === "pl" ? aboutUs?.titlePl : aboutUs?.titleEn) ||
    getCmsText("aboutTitle", "Your trusted partner in reliable car rental");
  const displaySubtitle =
    (lang === "pl" ? aboutUs?.subtitlePl : aboutUs?.subtitleEn) ||
    getCmsText(
      "aboutSubtitle",
      "We provide the best car rental services tailored to your needs.",
    );

  const feature1Title =
    (lang === "pl" ? aboutUs?.feature1TitlePl : aboutUs?.feature1TitleEn) ||
    getCmsText("feature1Title", "Easy Booking Process");
  const feature1Desc =
    (lang === "pl" ? aboutUs?.feature1DescPl : aboutUs?.feature1DescEn) ||
    getCmsText(
      "feature1Desc",
      "We have optimized the booking process so that our clients can experience the easiest and safest service.",
    );

  const feature2Title =
    (lang === "pl" ? aboutUs?.feature2TitlePl : aboutUs?.feature2TitleEn) ||
    getCmsText("feature2Title", "Convenient Pick-Up & Return Process");
  const feature2Desc =
    (lang === "pl" ? aboutUs?.feature2DescPl : aboutUs?.feature2DescEn) ||
    getCmsText(
      "feature2Desc",
      "Flexible locations and times to make your car rental experience seamless.",
    );

  const displayCtaText =
    (lang === "pl" ? aboutUs?.ctaTextPl : aboutUs?.ctaTextEn) ||
    getCmsText("aboutCta", "Contact Us");

  // 2. Validate CTA Link (fallback to "/contact" if backend sends lorem ipsum or invalid link)
  const rawCtaLink = aboutUs?.ctaLink;
  const displayCtaLink =
    rawCtaLink && (rawCtaLink.startsWith("/") || rawCtaLink.startsWith("http"))
      ? rawCtaLink
      : "/contact";

  // 3. Resolve Images (prepend API URL if the path is relative)
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
  const image1 = aboutUs?.image1Url
    ? `${baseUrl}${aboutUs.image1Url}`
    : "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80";
  const image2 = aboutUs?.image2Url
    ? `${baseUrl}${aboutUs.image2Url}`
    : "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80";

  // 4. Resolve Icons (fallback to default if backend sends dummy text or unknown name)
  const Icon1 =
    aboutUs?.feature1Icon && iconMap[aboutUs.feature1Icon]
      ? iconMap[aboutUs.feature1Icon]
      : Smartphone;
  const Icon2 =
    aboutUs?.feature2Icon && iconMap[aboutUs.feature2Icon]
      ? iconMap[aboutUs.feature2Icon]
      : Car;

  return (
    <section className="px-4 sm:px-6 container mx-auto py-10 sm:py-24 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* Images Section */}
        <div className="relative flex justify-center lg:justify-start">
          <div className="relative w-full max-w-lg aspect-square">
            <div className="absolute top-0 left-0 w-[75%] h-[75%] rounded-[2.5rem] overflow-hidden shadow-xl z-10">
              <img
                src={image1}
                alt="About us image 1"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="absolute bottom-0 right-0 w-[75%] h-[75%] rounded-[2.5rem] overflow-hidden shadow-xl border-[6px] border-white z-20">
              <img
                src={image2}
                alt="About us image 2"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="absolute top-[10%] right-[15%] text-brand-red text-4xl font-black z-30 select-none">
              *
            </div>
            <div className="absolute top-[20%] right-[5%] w-2.5 h-2.5 bg-brand-red rounded-full z-30"></div>
          </div>
        </div>

        {/* Content Section */}
        <div className="space-y-6">
          <span className="text-brand-red font-bold text-sm tracking-wide flex items-center gap-1">
            <span className="text-brand-red">*</span>{" "}
            {lang === "pl" ? "O nas" : "About us"}
          </span>

          <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-extrabold text-slate-900 leading-tight">
            {displayTitle}
          </h2>

          <p className="text-slate-500 text-sm sm:text-base leading-relaxed max-w-lg">
            {displaySubtitle}
          </p>

          <div className="space-y-6 pt-4">
            {/* Feature 1 */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-brand-red/10 flex items-center justify-center shrink-0">
                <Icon1 className="w-6 h-6 text-brand-red" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-base mb-1">
                  {feature1Title}
                </h4>
                <p className="text-slate-500 text-sm leading-relaxed">
                  {feature1Desc}
                </p>
              </div>
            </div>

            <div className="border-b border-slate-100"></div>

            {/* Feature 2 */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-brand-red/10 flex items-center justify-center shrink-0">
                <Icon2 className="w-6 h-6 text-brand-red" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-base mb-1">
                  {feature2Title}
                </h4>
                <p className="text-slate-500 text-sm leading-relaxed">
                  {feature2Desc}
                </p>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex items-center gap-3 pt-4">
            <Link
              href={displayCtaLink}
              className="inline-flex items-center justify-center px-7 py-3.5 bg-brand-red hover:bg-brand-red-hover text-white text-sm font-bold rounded-full transition-colors duration-200"
            >
              {displayCtaText}
            </Link>
            <Link
              href={displayCtaLink}
              className="w-11 h-11 flex items-center justify-center bg-brand-red hover:bg-brand-red-hover text-white rounded-full transition-colors duration-200"
            >
              <ArrowUpRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
