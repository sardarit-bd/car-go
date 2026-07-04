"use client";

import Link from "next/link";
import { ArrowUpRight, Smartphone, Car } from "lucide-react";

export default function LongTermPromo({ t }) {
  return (
    <section className="px-4 sm:px-6 container mx-auto py-10 sm:py-24 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        

        <div className="relative flex justify-center lg:justify-start">
          <div className="relative w-full max-w-lg aspect-square">

            <div className="absolute top-0 left-0 w-[75%] h-[75%] rounded-[2.5rem] overflow-hidden shadow-xl z-10">
              <img 
                src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80" 
                alt="Woman driving car" 
                className="w-full h-full object-cover"
              />
            </div>
            

            <div className="absolute bottom-0 right-0 w-[75%] h-[75%] rounded-[2.5rem] overflow-hidden shadow-xl border-[6px] border-white z-20">
              <img 
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80" 
                alt="Woman standing by car" 
                className="w-full h-full object-cover"
              />
            </div>


            <div className="absolute top-[10%] right-[15%] text-brand-red text-4xl font-black z-30 select-none">*</div>
            <div className="absolute top-[20%] right-[5%] w-2.5 h-2.5 bg-brand-red rounded-full z-30"></div>

          </div>
        </div>


        <div className="space-y-6">

          <span className="text-brand-red font-bold text-sm tracking-wide flex items-center gap-1">
            <span className="text-brand-red">*</span> About Us
          </span>


          <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-extrabold text-slate-900 leading-tight">
            Your trusted partner in <br className="hidden sm:block" /> reliable car rental
          </h2>


          <p className="text-slate-500 text-sm sm:text-base leading-relaxed max-w-lg">
            Aquestic Optio Amet A Ququam Saepe Aliquid Voluate Dicta Fuga Dolor Saerror Sed Earum A Magni Soluta Quam Minus Dolor Dolor
          </p>


          <div className="space-y-6 pt-4">

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-brand-red/10 flex items-center justify-center shrink-0">
                <Smartphone className="w-6 h-6 text-brand-red" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-base mb-1">Easy Booking Process</h4>
                <p className="text-slate-500 text-sm leading-relaxed">
                  We Have Optimized The Booking Process So That Our Clients Can Experience The Easiest And The Safest Service
                </p>
              </div>
            </div>


            <div className="border-b border-slate-100"></div>


            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-brand-red/10 flex items-center justify-center shrink-0">
                <Car className="w-6 h-6 text-brand-red" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-base mb-1">Convenient Pick-Up & Return Process</h4>
                <p className="text-slate-500 text-sm leading-relaxed">
                  We Have Optimized The Booking Process So That Our Clients Can Experience The Easiest And The Safest Service
                </p>
              </div>
            </div>
          </div>


          <div className="flex items-center gap-3 pt-4">
            <Link 
              href="/contact" 
              className="inline-flex items-center justify-center px-7 py-3.5 bg-brand-red hover:bg-brand-red-hover text-white text-sm font-bold rounded-full transition-colors duration-200"
            >
              Contact Us
            </Link>
            <Link 
              href="/contact" 
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