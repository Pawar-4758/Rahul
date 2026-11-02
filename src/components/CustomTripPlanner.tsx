import React, { useState } from 'react';
import { Plus, Trash2, Compass, MessageSquare, ChevronRight, Check } from 'lucide-react';
import { useTravelStore } from '../context/TravelStoreContext';

interface CustomTripPlannerProps {
  lang: 'en' | 'te';
}

export const CustomTripPlanner: React.FC<CustomTripPlannerProps> = ({ lang }) => {
  const { vehicles, settings } = useTravelStore();
  const [stops, setStops] = useState<string[]>(['Hyderabad', 'Srisailam', 'Tirupati']);
  const [newStop, setNewStop] = useState('');
  const [days, setDays] = useState(3);
  const [selectedCarId, setSelectedCarId] = useState('suv-luxury');
  const [specialAddons, setSpecialAddons] = useState<string[]>(['Telugu/English Chauffeur']);

  const selectedCar = vehicles.find(v => v.id === selectedCarId) || vehicles[0];

  const handleAddStop = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStop.trim()) return;
    setStops([...stops, newStop.trim()]);
    setNewStop('');
  };

  const handleRemoveStop = (idx: number) => {
    if (stops.length <= 2) return;
    setStops(stops.filter((_, i) => i !== idx));
  };

  const estimatedMinKm = days * selectedCar.minKmPerDay;
  const estimatedMinCost = (estimatedMinKm * selectedCar.ratePerKm) + (days * selectedCar.driverAllowancePerDay);

  const handleWhatsAppCustomPlan = () => {
    const cleanNumber = settings.whatsapp.replace(/\D/g, '');
    const text = encodeURIComponent(
      `*CUSTOM MULTI-CITY ROAD TRIP INQUIRY - WAY ORA JOURNEYS*\n\n` +
      `*Planned Stops/Route:* ${stops.join(' ➔ ')}\n` +
      `*Total Days:* ${days} Days\n` +
      `*Preferred Car:* ${selectedCar.name} (${selectedCar.models})\n` +
      `*Add-ons:* ${specialAddons.join(', ')}\n` +
      `*Min Package Km:* ${estimatedMinKm} km\n` +
      `*Est. Base Budget:* ~₹${estimatedMinCost.toLocaleString('en-IN')}\n\n` +
      `Please provide best customized package quote and chauffeur itinerary.`
    );
    window.open(`https://wa.me/${cleanNumber}?text=${text}`, '_blank');
  };

  const t = {
    en: {
      kicker: 'Custom Itinerary Builder',
      title: 'Design Your Multi-City Highway Journey',
      subtitle: 'Planning a wedding entourage, custom temple circuit, or family vacation across multiple cities? Add your stops and get an instant custom quote.',
      routeStops: 'Your Route Stops in Sequence',
      addStop: 'Add Destination / Stop',
      addBtn: 'Add',
      duration: 'Total Trip Duration',
      days: 'Days',
      preferredVehicle: 'Preferred Vehicle',
      driverLanguage: 'Language Preference',
      estimatedBudget: 'Estimated Starting Budget',
      requestQuote: 'Inquire Custom Route on WhatsApp',
      includedSummary: 'Includes sanitized AC car, experienced chauffeur, fuel & daily driver allowance.'
    },
    te: {
      kicker: 'మీకు నచ్చిన విధంగా ప్రయాణ ప్రణాళిక',
      title: 'మీ సొంత రూట్ మరియు రోజుల ప్లాన్ సిద్ధం చేసుకోండి',
      subtitle: 'పెళ్లి బృందాలు, కుటుంబ సభ్యులతో ఎక్కువ పుణ్యక్షేత్రాలు లేదా హిల్ స్టేషన్స్ తిరగాలనుకుంటున్నారా? మీ నగరాల జాబితా నమోదు చేసి వెంటనే కొటేషన్ పొందండి.',
      routeStops: 'మీ ప్రయాణ మార్గంలోని నగరాలు / ఊర్లు',
      addStop: 'మరొక నగరం లేదా స్టాప్ జోడించండి',
      addBtn: 'జోడించు',
      duration: 'మొత్తం ప్రయాణ సమయం (రోజులు)',
      days: 'రోజులు',
      preferredVehicle: 'వాహనం ఎంపిక',
      driverLanguage: 'డ్రైవర్ భాష',
      estimatedBudget: 'అంచనా వేసిన ప్రారంభ బడ్జెట్',
      requestQuote: 'వాట్సాప్‌లో కస్టమ్ కొటేషన్ పొందండి',
      includedSummary: 'ఏసీ కారు, డ్రైవర్, ఇంధనం మరియు రోజువారీ డ్రైవర్ బత్తా కలిపి ఉంటుంది.'
    }
  }[lang];

  return (
    <section className="py-20 bg-slate-900 text-white border-b border-slate-800 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="max-w-3xl mb-12">
          <div className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2 flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-amber-400" />
            <span>{t.kicker}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-display tracking-tight text-balance">
            {t.title}
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-300">
            {t.subtitle}
          </p>
        </div>

        {/* Builder card */}
        <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-6 sm:p-8 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left: Stops sequence & form (col-span-7) */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
                  {t.routeStops}
                </label>
                
                {/* Route stops pills/sequence */}
                <div className="space-y-2">
                  {stops.map((stop, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-700/80 text-sm"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 font-mono text-xs flex items-center justify-center font-bold">
                          {idx + 1}
                        </span>
                        <span className="font-semibold text-white">{stop}</span>
                        {idx === 0 && (
                          <span className="text-[10px] text-slate-400 uppercase tracking-wider">
                            (Origin)
                          </span>
                        )}
                        {idx === stops.length - 1 && idx > 0 && (
                          <span className="text-[10px] text-slate-400 uppercase tracking-wider">
                            (Destination)
                          </span>
                        )}
                      </div>

                      {stops.length > 2 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveStop(idx)}
                          className="p-1 text-slate-400 hover:text-rose-400 transition-colors"
                          title="Remove stop"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Add new stop input */}
                <form onSubmit={handleAddStop} className="mt-3 flex gap-2">
                  <input
                    type="text"
                    value={newStop}
                    onChange={(e) => setNewStop(e.target.value)}
                    placeholder={lang === 'en' ? 'e.g. Lepakshi, Hampi, Madurai...' : 'ఉదా. హంపి, లేపాక్షి, షిరిడి...'}
                    className="flex-1 px-4 py-2 text-sm bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{t.addBtn}</span>
                  </button>
                </form>
              </div>

              {/* Days count & Vehicle selector */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                    {t.duration}
                  </label>
                  <div className="flex items-center gap-2">
                    {[2, 3, 4, 5, 7].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setDays(num)}
                        className={`flex-1 py-2 text-xs font-bold rounded-lg border transition-all ${
                          days === num
                            ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-sm'
                            : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-slate-600'
                        }`}
                      >
                        {num} {t.days}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                    {t.preferredVehicle}
                  </label>
                  <select
                    value={selectedCarId}
                    onChange={(e) => setSelectedCarId(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-900 border border-slate-700 rounded-lg text-white font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    {vehicles.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.name} (₹{v.ratePerKm}/km)
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Right: Summary calculation & WhatsApp dispatch (col-span-5) */}
            <div className="lg:col-span-5 bg-slate-900 border border-slate-700 rounded-xl p-6 flex flex-col justify-between space-y-6">
              <div>
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                  {t.estimatedBudget}
                </span>

                <div className="mt-2 text-3xl sm:text-4xl font-extrabold text-white font-mono tracking-tight">
                  ₹{estimatedMinCost.toLocaleString('en-IN')}
                  <span className="text-xs text-slate-400 font-normal ml-2">
                    ({days} Days · ~{estimatedMinKm} km Package)
                  </span>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-800 space-y-2 text-xs text-slate-300">
                  <div className="flex items-center justify-between">
                    <span>Base Vehicle:</span>
                    <span className="font-semibold text-white">{selectedCar.name}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Per Km Rate:</span>
                    <span className="font-mono text-white">₹{selectedCar.ratePerKm} / km</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Driver Bata Total:</span>
                    <span className="font-mono text-white">₹{days * selectedCar.driverAllowancePerDay}</span>
                  </div>
                </div>

                <p className="mt-4 text-[11px] text-slate-400 leading-relaxed border-t border-slate-800 pt-3">
                  {t.includedSummary}
                </p>
              </div>

              <button
                type="button"
                onClick={handleWhatsAppCustomPlan}
                className="w-full py-3.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 active:scale-98"
              >
                <MessageSquare className="w-4 h-4 text-slate-950" />
                <span>{t.requestQuote}</span>
              </button>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
