"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function FAQSection({ t }) {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "What Do I Need To Rent A Car?",
      answer: "You will need a valid driver's license, a credit card in your name, and proof of insurance. International drivers may also need an International Driving Permit."
    },
    {
      question: "How Old Do I Need To Be To Rent A Car?",
      answer: "The minimum age to rent a car is typically 21 years old. Drivers under 25 may be subject to a young driver surcharge."
    },
    {
      question: "Can I Rent A Car With A Debit Card?",
      answer: "Yes, we accept debit cards, but a credit card is often preferred for the security deposit. Please check our specific policy for debit card usage."
    },
    {
      question: "Is there a mileage limit?",
      answer: "Most of our rentals come with unlimited mileage within the country. Cross-border travel may have specific restrictions."
    }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="px-1 sm:px-1 py-10 sm:py-24">
      <div className="max-w-7xl mx-auto bg-[#fdfbf9] rounded-[3rem] overflow-hidden shadow-sm border border-slate-100/50">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-0 items-center">
          

          <div className="p-2 sm:p-2 lg:p-16 order-1 lg:order-2">
            <div className="mb-10">
              <span className="text-brand-red font-bold text-sm tracking-wide flex items-center gap-1 mb-3">
                <span className="text-brand-red">*</span> Frequently Asked Questions
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight">
                Everything you need to <br className="hidden sm:block" /> know about <span className="relative inline-block">our services<span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-2 h-2 bg-brand-red rounded-full"></span></span>
              </h2>
            </div>

            <div className="space-y-0">
              {faqs.map((faq, index) => (
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
                  
                  {/* Answer Content */}
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