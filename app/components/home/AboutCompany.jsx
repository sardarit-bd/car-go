"use client";

import { Car, MapPin, Headphones, ShieldCheck } from "lucide-react";

export default function AboutCompany({ t }) {
  const features = [
    {
      icon: Car,
      title: "Extensive Fleet Options",
      description: "Quisque Sollicitudin Feugiat Risus, Eu Posuere Ex Euismod Eu. Phasellus Hendrerit, Massa"
    },
    {
      icon: Headphones,
      title: "Exceptional Customer Service",
      description: "Quisque Sollicitudin Feugiat Risus, Eu Posuere Ex Euismod Eu. Phasellus Hendrerit, Massa"
    },
    {
      icon: MapPin,
      title: "Convenient Locations",
      description: "Quisque Sollicitudin Feugiat Risus, Eu Posuere Ex Euismod Eu. Phasellus Hendrerit, Massa"
    },
    {
      icon: ShieldCheck,
      title: "Reliability And Safety",
      description: "Quisque Sollicitudin Feugiat Risus, Eu Posuere Ex Euismod Eu. Phasellus Hendrerit, Massa"
    }
  ];

  return (
    <section className="py-16 sm:py-24 bg-white relative overflow-hidden">
      {/* Decorative Elements - Left Side */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 opacity-30 pointer-events-none">
        <div className="space-y-3">
          <div className="w-12 h-12 rounded-full border-2 border-brand-red/20"></div>
          <div className="w-3 h-3 rounded-full bg-brand-red"></div>
          <div className="w-6 h-6 rounded-full border-2 border-slate-200"></div>
        </div>
      </div>

      {/* Decorative Elements - Right Side */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-30 pointer-events-none">
        <div className="space-y-3 text-right">
          <div className="w-6 h-6 rounded-full border-2 border-slate-200 ml-auto"></div>
          <div className="w-3 h-3 rounded-full bg-brand-red ml-auto"></div>
          <div className="w-12 h-12 rounded-full border-2 border-brand-red/20 ml-auto"></div>
        </div>
      </div>

      <div className="px-4 sm:px-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <span className="text-brand-red font-bold text-sm tracking-wide flex items-center justify-center gap-1 mb-3">
            <span className="text-brand-red">*</span> Why Choose Us
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight max-w-3xl mx-auto">
            Unmatched quality and service <br className="hidden sm:block" /> for your needs
          </h2>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-center">
          
          {/* Left Column - Features 1 & 2 */}
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

          {/* Center - Car Image */}
          <div className="relative flex justify-center order-1 lg:order-2">
            <div className="relative w-full max-w-md aspect-square">
              {/* Circular Background */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&w=800&q=80" 
                  alt="Red luxury car" 
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Decorative dot */}
              <div className="absolute top-4 right-8 w-3 h-3 bg-brand-red rounded-full"></div>
            </div>
          </div>

          {/* Right Column - Features 3 & 4 */}
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