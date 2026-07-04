"use client";

import { Check, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CheckoutStep2({ 
  packages, 
  selectedPackage, 
  setSelectedPackage, 
  addons, 
  selectedAddons, 
  handleToggleAddon,
  t 
}) {
  const router = useRouter();

  return (
    <div className="space-y-8">
      {/* Packages Section */}
      <div className="space-y-5">
        <h2 className="text-2xl font-black text-slate-900 pb-3 border-b border-slate-200">
          {t("packageTitle")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {packages.map((pkg) => {
            const isSelected = selectedPackage?.id === pkg.id;
            return (
              <div 
                key={pkg.id} 
                onClick={() => setSelectedPackage(pkg)} 
                className={`relative p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 flex flex-col justify-between shadow-sm ${
                  isSelected 
                    ? "bg-brand-red/5 border-brand-red shadow-lg shadow-brand-red/10" 
                    : "bg-white border-slate-200 hover:border-slate-400 hover:shadow-md"
                }`}
              >
                {isSelected && (
                  <div className="absolute top-4 right-4">
                    <CheckCircle2 className="w-6 h-6 text-brand-red" />
                  </div>
                )}
                <div className="space-y-4">
                  <h3 className="text-base font-black text-slate-900 uppercase">
                    {pkg.name}
                  </h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-slate-900">
                      +PLN {pkg.pricePerDay}
                    </span>
                    <span className="text-xs text-slate-500 font-bold">/doba</span>
                  </div>
                  <ul className="space-y-2 text-xs text-slate-600 leading-relaxed font-semibold pt-4 border-t border-slate-100">
                    {(pkg.featuresPl || []).map((f, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-brand-red flex-shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Addons Section */}
      <div className="space-y-5">
        <h2 className="text-2xl font-black text-slate-900 pb-3 border-b border-slate-200">
          {t("addonsTitle")}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {addons.map((add) => {
            const isChecked = selectedAddons.includes(add.id);
            return (
              <div 
                key={add.id} 
                onClick={() => handleToggleAddon(add.id)} 
                className={`p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 flex items-center justify-between shadow-sm ${
                  isChecked 
                    ? "bg-brand-red/5 border-brand-red shadow-md shadow-brand-red/10" 
                    : "bg-white border-slate-200 hover:border-slate-400 hover:shadow-md"
                }`}
              >
                <div className="space-y-1 text-left flex-1">
                  <p className="text-sm font-black text-slate-900">{add.name}</p>
                  <p className="text-xs text-slate-500 font-medium">{add.descriptionPl || add.description}</p>
                  <p className="text-sm text-brand-red font-black pt-2">
                    PLN {add.price}
                    <span className="text-[10px] text-slate-500 font-bold ml-1">
                      {add.isPerDay ? "/doba" : " (jednorazowo)"}
                    </span>
                  </p>
                </div>
                <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-300 ${
                  isChecked 
                    ? "bg-brand-red border-brand-red text-white" 
                    : "border-slate-300 bg-slate-50"
                }`}>
                  {isChecked && <Check className="w-4 h-4" />}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Continue Button */}
      <div className="flex justify-end pt-4">
        <button 
          onClick={() => router.push("/checkout?step=3")} 
          className="px-8 py-4 bg-brand-red hover:bg-brand-red-hover text-white text-sm font-black rounded-xl shadow-lg shadow-brand-red/20 hover:shadow-brand-red/40 transition-all duration-300 hover:-translate-y-0.5"
        >
          DALEJ / CONTINUE
        </button>
      </div>
    </div>
  );
}   