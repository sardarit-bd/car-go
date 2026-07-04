"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useApp } from "@/app/context/AppContext";

export default function FAQSection({ t }) {
  const [openIndex, setOpenIndex] = useState(null);
  const { lang, cmsFaqs } = useApp();

  // Map dynamic CMS FAQs to current language
  const dynamicFaqs = (cmsFaqs || [])
    .filter((f) => f.isActive)
    .sort((a, b) => a.order - b.order)
    .map((f) => ({
      question: lang === "pl" ? f.questionPl : f.questionEn,    
      answer: lang === "pl" ? f.answerPl : f.answerEn,
    }));



  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="px-4 sm:px-6 py-16 sm:py-24">
      <div className="container mx-auto rounded-[3rem] overflow-hidden border border-slate-100/50">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-0 items-center">
          
          <div className="relative h-[500px] lg:h-[650px] overflow-hidden order-2 lg:order-1 bg-gradient-to-br from-brand-red/5 via-white to-slate-100">
            <img 
              src="https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=810&w=1970&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
              alt="Black Sedan" 
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>

          <div className="p-8 sm:p-12 lg:p-16 order-1 lg:order-2">
            <div className="mb-10">
              <span className="text-brand-red font-bold text-sm tracking-wide flex items-center gap-1 mb-3">
                <span className="text-brand-red">*</span> Frequently Asked Questions
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight">
                Everything you need to <br className="hidden sm:block" /> know about <span className="relative inline-block">our services<span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-2 h-2 bg-brand-red rounded-full"></span></span>
              </h2>
            </div>

            <div className="space-y-0">
              {dynamicFaqs.map((faq, index) => (
                <div key={index} className="border-b border-slate-200 last:border-0">
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full py-6 flex items-center justify-between text-left group focus:outline-none"
                  >
                    <span className={`text-lg font-bold transition-colors duration-300 ${openIndex === index ? 'text-brand-red' : 'text-slate-900 group-hover:text-brand-red'}`}>
                      {faq.question}
                    </span>
                    <ChevronDown 
                      className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${openIndex === index ? 'rotate-180 text-brand-red' : ''}`} 
                    />
                  </button>
                  
                  <div 
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${openIndex === index ? 'max-h-40 opacity-100 pb-6' : 'max-h-0 opacity-0'}`}
                  >
                    <p className="text-slate-500 text-sm leading-relaxed pr-8">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}