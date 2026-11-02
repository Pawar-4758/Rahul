import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { FAQS } from '../data/travelData';

interface FAQSectionProps {
  lang: 'en' | 'te';
}

export const FAQSection: React.FC<FAQSectionProps> = ({ lang }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const t = {
    en: {
      kicker: 'Got Questions?',
      title: 'Frequently Asked Questions About Our Car Trips',
      subtitle: 'Clear, transparent answers so you can travel without second thoughts.'
    },
    te: {
      kicker: 'తరచూ అడిగే ప్రశ్నలు',
      title: 'మా కార్ సర్వీసెస్ గురించి ముఖ్యమైన ప్రశ్నలు & సమాధానాలు',
      subtitle: 'ఎటువంటి సందేహాలు లేకుండా ప్రశాంతంగా మీ ప్రయాణాన్ని ప్లాన్ చేసుకోండి.'
    }
  }[lang];

  return (
    <section className="py-20 bg-white border-b border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="text-xs font-bold uppercase tracking-wider text-amber-700 mb-2">
            {t.kicker}
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-display tracking-tight text-balance">
            {t.title}
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-xl mx-auto">
            {t.subtitle}
          </p>
        </div>

        {/* Accordion */}
        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;

            return (
              <div
                key={idx}
                className="border border-slate-200 rounded-xl overflow-hidden transition-all duration-200"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full py-4 px-5 text-left flex items-center justify-between gap-4 bg-white hover:bg-slate-50 transition-colors"
                >
                  <span className="text-sm sm:text-base font-bold text-slate-900">
                    {lang === 'en' ? faq.q : faq.qTe}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-500 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-amber-600' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                    {lang === 'en' ? faq.a : faq.aTe}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
