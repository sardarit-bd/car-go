"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/app/context/AppContext";
import { ShieldAlert } from "lucide-react";

export default function PricingTab() {
  const { isOwner, packages, addons, updatePackagePrice, updateAddonPrice, fetchPackages, fetchAddons } = useApp();
  
  const [goldPrice, setGoldPrice] = useState(30);
  const [platinumPrice, setPlatinumPrice] = useState(60);
  const [childSeatPrice, setChildSeatPrice] = useState(15);
  const [boosterPrice, setBoosterPrice] = useState(8);
  const [gpsPrice, setGpsPrice] = useState(10);
  const [driverPrice, setDriverPrice] = useState(50);

  useEffect(() => {
    const gold = packages.find((p) => p.id === "gold");
    const plat = packages.find((p) => p.id === "platinum");
    if (gold) setGoldPrice(gold.pricePerDay);
    if (plat) setPlatinumPrice(plat.pricePerDay);

    const cs = addons.find((a) => a.id === "child-seat");
    const bs = addons.find((a) => a.id === "booster");
    const gps = addons.find((a) => a.id === "gps");
    const drv = addons.find((a) => a.id === "extra-driver");
    if (cs) setChildSeatPrice(cs.price);
    if (bs) setBoosterPrice(bs.price);
    if (gps) setGpsPrice(gps.price);
    if (drv) setDriverPrice(drv.price);
  }, [packages, addons]);

  const handleSavePricing = async (e) => {
    e.preventDefault();
    const gold = packages.find((p) => p.id === "gold");
    const plat = packages.find((p) => p.id === "platinum");
    if (gold && gold.backendId)
      await updatePackagePrice(gold.backendId, goldPrice);
    if (plat && plat.backendId)
      await updatePackagePrice(plat.backendId, platinumPrice);

    const cs = addons.find((a) => a.id === "child-seat");
    const bs = addons.find((a) => a.id === "booster");
    const gps = addons.find((a) => a.id === "gps");
    const drv = addons.find((a) => a.id === "extra-driver");
    if (cs && cs.backendId)
      await updateAddonPrice(cs.backendId, childSeatPrice);
    if (bs && bs.backendId) await updateAddonPrice(bs.backendId, boosterPrice);
    if (gps && gps.backendId) await updateAddonPrice(gps.backendId, gpsPrice);
    if (drv && drv.backendId)
      await updateAddonPrice(drv.backendId, driverPrice);

    alert("Cennik pakietów i dodatków został zapisany!");
    fetchPackages();
    fetchAddons();
  };

  if (!isOwner) {
    return (
      <div className="p-6 border border-brand-red/30 bg-brand-red/5 text-brand-red rounded-xl flex items-center space-x-2 text-sm font-bold">
        <ShieldAlert className="w-5 h-5 flex-shrink-0" />
        <span>
          Brak uprawnień. Sekcja dostępna wyłącznie dla Właściciela
          (Owner).
        </span>
      </div>
    );
  }

  return (
    <div className="glass-panel p-6 rounded-2xl space-y-5">
      <h2 className="text-base font-extrabold text-slate-800 border-b border-slate-100 pb-3 uppercase tracking-wider">
        Konfiguracja Cennika / Rates Manager
      </h2>
      <form
        onSubmit={handleSavePricing}
        className="space-y-6 text-xs font-bold text-slate-500"
      >
        <div className="space-y-3.5 border-b border-slate-100 pb-5">
          <p className="text-sm font-extrabold text-slate-800">
            1. Pakiety Ochrony
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1.5">Złoty / Gold Protect</label>
              <input
                type="number"
                required
                min={0}
                value={goldPrice}
                onChange={(e) => setGoldPrice(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded text-slate-800 focus:outline-none focus:border-brand-red"
              />
            </div>
            <div>
              <label className="block mb-1.5">
                Platynowy / Platinum Protect
              </label>
              <input
                type="number"
                required
                min={0}
                value={platinumPrice}
                onChange={(e) => setPlatinumPrice(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded text-slate-800 focus:outline-none focus:border-brand-red"
              />
            </div>
          </div>
        </div>
        <button
          type="submit"
          className="w-full py-2.5 bg-brand-red hover:bg-brand-red-hover text-white font-extrabold rounded transition shadow"
        >
          ZAPISZ CENNIK / SAVE RATES
        </button>
      </form>
    </div>
  );
}