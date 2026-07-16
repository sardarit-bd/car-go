"use client";

import { ArrowUpRight, Phone } from "lucide-react";
import Link from "next/link";

export default function ServiceCallout({ t }) {
  const services = [
    { name: "Engine Service", href: "/services/engine" },
    { name: "Tune-Up", href: "/services/tune-up" },
    { name: "Car Paint", href: "/services/car-paint" },
    { name: "Wheel Adjustment", href: "/services/wheel-adjustment" },
    { name: "Brake Service", href: "/services/brake" },
    { name: "Other", href: "/services" },
  ];

  return (
    <section className="px-4 sm:px-6 container mx-auto py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        <div className="space-y-6">
          <div className="flex items-center space-x-2 text-teal-700 font-bold text-sm">
            <Phone className="w-4 h-4" />
            <span>+12 345 6789 0</span>
          </div>

          <div className="flex items-start gap-4">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
              Any problem with
              <br />
              your autos?
              <br />
              Just call us!
            </h2>
            <div className="hidden sm:block w-12 h-[2px] bg-teal-700 mt-5" />
          </div>

          <p className="text-sm text-slate-500 font-medium max-w-sm">
            We take call services to locations around our auto shop with
            excellent services and appropriate prices
          </p>

          <div className="flex items-center gap-5 pt-1">
            <Link
              href="/contact"
              className="px-6 py-2.5 bg-teal-700 hover:bg-teal-800 text-white text-sm font-bold rounded-full shadow-sm transition duration-200"
            >
              Book Service
            </Link>
            <Link
              href="/services"
              className="flex items-center gap-1.5 text-sm font-bold text-slate-800 underline underline-offset-4 decoration-1 hover:text-teal-700 transition"
            >
              <span>Learn More</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="pt-4 space-y-3">
            <h3 className="text-lg font-extrabold text-slate-900">Services</h3>
            <div className="grid grid-cols-3 gap-x-6 gap-y-2 max-w-md">
              {services.map((s) => (
                <Link
                  key={s.name}
                  href={s.href}
                  className="flex items-center gap-1 text-xs font-bold text-teal-700 hover:text-teal-900 transition"
                >
                  <span>{s.name}</span>
                  <ArrowUpRight className="w-3 h-3" />
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <img
            src="/service-1.jpg"
            alt="Car in garage"
            className="w-full h-44 sm:h-52 object-cover rounded-xl"
          />
          <img
            src="/service-2.jpg"
            alt="Mechanic checking engine"
            className="w-full h-44 sm:h-52 object-cover rounded-xl mt-8"
          />
          <img
            src="/service-3.jpg"
            alt="Brake disc and wheel"
            className="w-full h-44 sm:h-52 object-cover rounded-xl -mt-8"
          />
          <img
            src="/service-4.jpg"
            alt="Speedometer close-up"
            className="w-full h-44 sm:h-52 object-cover rounded-xl"
          />
        </div>
      </div>
    </section>
  );
}
