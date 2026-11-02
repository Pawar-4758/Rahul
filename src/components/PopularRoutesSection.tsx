import React from 'react';
import { ArrowRight, Clock, Navigation, Check } from 'lucide-react';
import { POPULAR_ROUTES } from '../data/travelData';
import { PopularRoute } from '../types';
import { useTravelStore } from '../context/TravelStoreContext';

interface PopularRoutesSectionProps {
  lang: 'en' | 'te';
  onSelectRoute: (route: PopularRoute) => void;
}

export const PopularRoutesSection: React.FC<PopularRoutesSectionProps> = ({
  lang,
  onSelectRoute
}) => {
  const { routes } = useTravelStore();
  const t = {
    en: {
      kicker: 'Transparent Intercity Tariffs',
      title: 'Popular Highway Routes & Starting Rates',
      subtitle: 'Flat per-km rates with zero surge pricing during peak hours. Select any route below to calculate exact fare or book right away.',
      startingFrom: 'One-Way from',
      bookThisRoute: 'BOOK NOW',
      distance: 'Distance',
      estTime: 'Avg Time'
    },
    te: {
      kicker: 'పారదర్శక ధరల జాబితా',
      title: 'ప్రసిద్ధ హైవే ప్రయాణ మార్గాలు మరియు ప్రారంభ ధరలు',
      subtitle: 'ఎటువంటి దాపరికం లేని రేట్లు. మీ ప్రయాణ మార్గాన్ని ఎంచుకుని వెంటనే బుక్ చేసుకోండి.',
      startingFrom: 'వన్-వే ప్రారంభ ధర',
      bookThisRoute: 'బుక్ చేయండి (BOOK NOW)',
      distance: 'దూరం',
      estTime: 'సమయం'
    }
  }[lang];

  return (
    <section id="routes" className="py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-3xl mb-12">
          <div className="text-xs font-bold uppercase tracking-wider text-red-600 mb-2">
            {t.kicker}
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-display tracking-tight text-balance">
            {t.title}
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600">
            {t.subtitle}
          </p>
        </div>

        {/* Routes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {routes.map((route) => (
            <div
              key={route.id}
              className="bg-white rounded-2xl border border-slate-200 hover:border-red-500/50 hover:shadow-lg transition-all duration-200 p-5 flex flex-col justify-between"
            >
              <div>
                {/* From -> To */}
                <div className="flex items-center gap-2 text-sm font-bold text-slate-900 mb-2">
                  <span className="truncate">{route.from}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-red-600 shrink-0" />
                  <span className="truncate">{route.to}</span>
                </div>

                {/* Distance & Travel time */}
                <div className="flex items-center gap-3 text-xs text-slate-500 py-1 font-mono">
                  <span>{route.distanceKm} km</span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    {route.durationHours}
                  </span>
                </div>

                {/* Popular car recommendation */}
                <div className="mt-2 text-[11px] text-slate-600">
                  <span className="text-slate-400">Cab: </span>
                  <span className="font-medium text-slate-700">{route.popularCar}</span>
                </div>
              </div>

              {/* Price & Action */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-slate-500 uppercase font-semibold">
                    {t.startingFrom}
                  </div>
                  <div className="text-lg font-black text-slate-900 font-mono tabular-nums">
                    ₹{route.startingPrice.toLocaleString('en-IN')}
                  </div>
                </div>

                <button
                  onClick={() => onSelectRoute(route)}
                  className="px-3.5 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 active:scale-95 rounded-xl transition-all shadow-sm flex items-center gap-1.5"
                >
                  <span>{t.bookThisRoute}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
