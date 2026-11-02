import React, { useState } from 'react';
import { Users, Briefcase, Wind, Check, ChevronRight, Shield, Award } from 'lucide-react';
import { Vehicle } from '../types';
import { useTravelStore } from '../context/TravelStoreContext';

interface FleetShowcaseProps {
  lang: 'en' | 'te';
  selectedVehicleId: string;
  onSelectVehicle: (vehicleId: string) => void;
}

export const FleetShowcase: React.FC<FleetShowcaseProps> = ({
  lang,
  selectedVehicleId,
  onSelectVehicle
}) => {
  const { vehicles } = useTravelStore();
  const [filter, setFilter] = useState<'all' | 'sedan' | 'suv' | 'luxury' | 'tempo'>('all');

  const filteredVehicles = vehicles.filter(v => {
    if (filter === 'all') return true;
    return v.category === filter;
  });

  const t = {
    en: {
      kicker: 'Way Ora Journeys Fleet',
      title: 'Spotless, Modern Cabs for Every Travel Need',
      subtitle: 'From budget-friendly city drops to high-comfort family SUVs and 16-seater luxury travellers, choose the perfect car for your next road trip.',
      all: 'All Fleets',
      sedans: 'Prime Sedans',
      suvs: 'Family SUVs & MPVs',
      luxury: 'Luxury & VIP',
      tempo: 'Group Travellers',
      seats: 'Seats',
      bags: 'Luggage Bags',
      perKm: '/ km',
      minKm: 'Min. 300 km / day',
      driverBata: 'Driver Allowance',
      bookCar: 'Book This Car',
      selected: 'Selected Car',
      bestForLabel: 'Recommended For:'
    },
    te: {
      kicker: 'వే ఓరా జర్నీస్ కార్లు',
      title: 'ప్రతి ప్రయాణానికి పరిశుభ్రమైన, ఆధునిక వాహనాలు',
      subtitle: 'సిటీ డ్రాప్స్ నుండి ఫ్యామిలీ ట్రిప్స్ వరకు, ఇన్నోవా క్రిస్టా, ఎర్టిగా, డిజైర్ మరియు లగ్జరీ ట్రావెలర్స్ మీ సేవలో సిద్ధంగా ఉన్నాయి.',
      all: 'అన్ని రకాలు',
      sedans: 'ప్రైమ్ సెడాన్లు',
      suvs: 'ఫ్యామిలీ ఎస్‌యూవీలు',
      luxury: 'లగ్జరీ & వీఐపీ',
      tempo: 'గ్రూప్ ట్రావెలర్స్',
      seats: 'సీట్లు',
      bags: 'లగేజ్ బ్యాగులు',
      perKm: '/ కి.మీ',
      minKm: 'కనీసం 300 కి.మీ / రోజుకు',
      driverBata: 'డ్రైవర్ బత్తా',
      bookCar: 'ఈ కారు బుక్ చేయండి',
      selected: 'ఎంపికైంది',
      bestForLabel: 'ప్రత్యేకంగా అనుకూలం:'
    }
  }[lang];

  return (
    <section id="fleet" className="py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-amber-700 mb-2">
              {t.kicker}
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-display tracking-tight text-balance">
              {t.title}
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-2xl">
              {t.subtitle}
            </p>
          </div>

          {/* Interactive Filter Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-white border border-slate-200 rounded-xl overflow-x-auto shadow-sm self-start md:self-auto shrink-0">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                filter === 'all' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.all}
            </button>
            <button
              onClick={() => setFilter('sedan')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                filter === 'sedan' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.sedans}
            </button>
            <button
              onClick={() => setFilter('suv')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                filter === 'suv' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.suvs}
            </button>
            <button
              onClick={() => setFilter('luxury')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                filter === 'luxury' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.luxury}
            </button>
            <button
              onClick={() => setFilter('tempo')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                filter === 'tempo' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.tempo}
            </button>
          </div>
        </div>

        {/* Fleet Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredVehicles.map((vehicle) => {
            const isSelected = selectedVehicleId === vehicle.id;

            return (
              <div
                key={vehicle.id}
                className={`flex flex-col justify-between bg-white rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isSelected
                    ? 'border-amber-600 ring-2 ring-amber-600/30 shadow-lg'
                    : 'border-slate-200 hover:border-slate-300 hover:shadow-md'
                }`}
              >
                {/* Visual Representation Bar with Real Car Image */}
                <div className="h-44 bg-slate-900 p-5 flex flex-col justify-between text-white relative overflow-hidden group">
                  {vehicle.imageUrl ? (
                    <img
                      src={vehicle.imageUrl}
                      alt={vehicle.name}
                      className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none text-8xl font-black uppercase font-display leading-none select-none">
                      {vehicle.category}
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/20 pointer-events-none" />

                  <div className="flex items-center justify-between z-10">
                    <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
                      {vehicle.category === 'sedan' ? 'Executive Sedan' : vehicle.category === 'suv' ? 'Highway SUV' : vehicle.category === 'luxury' ? 'VIP Luxury' : 'Group Tour'}
                    </span>
                    {vehicle.popular && (
                      <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                        Most Popular
                      </span>
                    )}
                  </div>

                  <div className="z-10">
                    <h3 className="text-xl font-bold font-display text-white tracking-tight">
                      {vehicle.name}
                    </h3>
                    <p className="text-xs text-slate-300 mt-0.5">
                      {vehicle.models}
                    </p>
                  </div>
                </div>

                {/* Specs & Pricing Body */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
                  <div>
                    {/* Rate & Bata breakdown */}
                    <div className="flex items-baseline justify-between border-b border-slate-100 pb-4">
                      <div>
                        <span className="text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
                          ₹{vehicle.ratePerKm}
                        </span>
                        <span className="text-xs text-slate-500 font-medium ml-1">
                          {t.perKm}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-slate-500 font-medium">
                          {t.driverBata}
                        </div>
                        <div className="text-xs font-bold text-slate-800 font-mono">
                          ₹{vehicle.driverAllowancePerDay} / day
                        </div>
                      </div>
                    </div>

                    {/* Capacity Specs (No pill boxes, clean typographic layout) */}
                    <div className="grid grid-cols-3 gap-2 py-3 border-b border-slate-100 text-center">
                      <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-slate-50">
                        <Users className="w-4 h-4 text-slate-600 mb-1" />
                        <span className="text-xs font-bold text-slate-900 font-mono">{vehicle.seats}</span>
                        <span className="text-[10px] text-slate-500">{t.seats}</span>
                      </div>
                      <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-slate-50">
                        <Briefcase className="w-4 h-4 text-slate-600 mb-1" />
                        <span className="text-xs font-bold text-slate-900 font-mono">{vehicle.luggage}</span>
                        <span className="text-[10px] text-slate-500">{t.bags}</span>
                      </div>
                      <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-slate-50">
                        <Wind className="w-4 h-4 text-slate-600 mb-1" />
                        <span className="text-xs font-bold text-emerald-700">100% AC</span>
                        <span className="text-[10px] text-slate-500">Chilled</span>
                      </div>
                    </div>

                    {/* Features checklist */}
                    <div className="pt-3 space-y-2">
                      {(lang === 'en' ? vehicle.features : vehicle.featuresTe).map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-slate-600">
                          <Check className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* Best for prompt */}
                    <div className="mt-4 p-3 rounded-lg bg-amber-50/70 border border-amber-200/60 text-xs text-amber-900">
                      <strong className="font-semibold block text-[11px] text-amber-950 uppercase tracking-wide">
                        {t.bestForLabel}
                      </strong>
                      <span className="mt-0.5 block">
                        {lang === 'en' ? vehicle.bestFor : vehicle.bestForTe}
                      </span>
                    </div>
                  </div>

                  {/* Action button */}
                  <button
                    onClick={() => {
                      onSelectVehicle(vehicle.id);
                      const el = document.getElementById('booking');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                      isSelected
                        ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-sm'
                        : 'bg-slate-900 hover:bg-slate-800 text-white shadow-sm'
                    }`}
                  >
                    <span>{isSelected ? t.selected : t.bookCar}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>

                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
