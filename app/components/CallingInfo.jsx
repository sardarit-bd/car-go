"use client";

import { useApp } from "@/app/context/AppContext";
import {
  parseHoursFromContacts,
  formatPrimaryHours,
} from "@/app/lib/workingHours";

export default function CallingInfo({ className = "" }) {
  const { lang, cmsContacts } = useApp();
  const phoneContact = cmsContacts?.find((c) => c.type === "PHONE");
  const phoneNumber = phoneContact ? phoneContact.value : "+48 789 200 100";
  const telLink = `tel:${phoneNumber.replace(/[\s\-\(\)]/g, "")}`;
  const workingHours = parseHoursFromContacts(cmsContacts);
  const hoursLabel = workingHours
    ? formatPrimaryHours(workingHours, lang)
    : lang === "pl"
      ? "Pon-Pt: 8:00-22:00"
      : "Mon-Fri: 8:00-22:00";

  return (
    <a
      href={telLink}
      className={`flex items-center space-x-3 group hover:no-underline select-none ${className}`}
    >
      <svg
        className="w-9 h-9 text-brand-red fill-current transform group-hover:-rotate-12 transition-transform duration-350 ease-out flex-shrink-0"
        viewBox="0 0 24 24"
      >
        <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 00-1.01.24l-2.2 2.2a15.045 15.045 0 01-6.59-6.59l2.2-2.21a.96.96 0 00.25-1A11.36 11.36 0 018.5 4c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1 0 9.39 7.61 17 17 17 .55 0 1-.45 1-1v-3.5c0-.55-.45-1-1-1z" />
      </svg>

      <div className="flex flex-col leading-[0px] md:space-y-[-8px]">
        <span className="text-xs md:text-sm font-bold text-slate-500 tracking-wider uppercase leading-none mb-1 group-hover:text-slate-700 transition-colors">
          {lang === "pl" ? `INFOLINIA ${hoursLabel}` : `HOTLINE ${hoursLabel}`}
        </span>
        <span className="text-lg md:text-xl font-black text-slate-800 leading-none group-hover:text-black transition-colors py-0">
          {phoneNumber}
        </span>
      </div>
    </a>
  );
}
