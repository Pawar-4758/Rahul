import React from 'react';
import { Star, MapPin, Car } from 'lucide-react';
import { TESTIMONIALS } from '../data/travelData';

interface TestimonialsSectionProps {
  lang: 'en' | 'te';
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ lang }) => {
  const t = {
    en: {
      kicker: 'Customer Stories',
      title: 'Loved by Pilgrims, Families & Business Travelers',
      subtitle: 'Read genuine experiences from passengers who traveled across South India with Way Ora Journeys.',
      verifiedTrip: 'Verified Car Journey'
    },
    te: {
      kicker: 'కస్టమర్ల అనుభవాలు',
      title: 'తీర్థయాత్రికులు, కుటుంబాలు మరియు కార్పొరేట్ ప్రయాణికుల నమ్మకం',
      subtitle: 'వే ఓరా జర్నీస్‌తో సురక్షితంగా ప్రయాణించిన మా కస్టమర్ల నిజమైన స్పందనలు.',
      verifiedTrip: 'ధృవీకరించబడిన ప్రయాణం'
    }
  }[lang];

  return (
    <section id="reviews" className="py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-3xl mb-12">
          <div className="text-xs font-bold uppercase tracking-wider text-amber-700 mb-2">
            {t.kicker}
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-display tracking-tight text-balance">
            {t.title}
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600">
            {t.subtitle}
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between shadow-sm hover:shadow transition-shadow"
            >
              <div>
                {/* 5-star rating */}
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                {/* Review comment */}
                <p className="text-sm text-slate-700 leading-relaxed italic">
                  "{lang === 'en' ? review.comment : review.commentTe}"
                </p>

                {/* Route & Car Tag */}
                <div className="mt-4 pt-3 border-t border-slate-100 space-y-1 text-xs text-slate-500">
                  <div className="flex items-center gap-1.5 font-medium text-slate-700">
                    <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>{review.route}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <Car className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{review.carUsed}</span>
                  </div>
                </div>
              </div>

              {/* Author */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">
                    {review.name}
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    {review.role} · {review.city}
                  </p>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">
                  {review.date}
                </span>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
