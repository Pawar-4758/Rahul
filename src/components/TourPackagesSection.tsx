import React, { useState } from 'react';
import { Calendar, MapPin, CheckCircle, ChevronRight, X, Clock, Car, Sparkles, Camera, CreditCard } from 'lucide-react';
import { TourPackage, Vehicle } from '../types';
import { useTravelStore } from '../context/TravelStoreContext';

interface TourPackagesSectionProps {
  lang: 'en' | 'te';
  onBookPackage: (
    pkg: TourPackage, 
    vehicleId: string, 
    calculatedPrice: number, 
    advanceAmount: number,
    customPhoto?: string
  ) => void;
}

export const TourPackagesSection: React.FC<TourPackagesSectionProps> = ({
  lang,
  onBookPackage
}) => {
  const { packages, vehicles, updatePackagePhoto } = useTravelStore();
  const [activeCategory, setActiveCategory] = useState<'all' | 'hills' | 'pilgrimage'>('all');
  const [selectedPackage, setSelectedPackage] = useState<TourPackage | null>(null);

  // Track chosen car for each package
  const [chosenCarMap, setChosenCarMap] = useState<Record<string, string>>({
    'pkg-araku': 'suv-luxury',
    'pkg-tirupati': 'mpv-family',
    'pkg-srisailam': 'sedan-prime',
    'pkg-ooty-coorg': 'suv-luxury'
  });

  const filteredPackages = packages.filter(p => {
    if (activeCategory === 'all') return true;
    return p.category === activeCategory;
  });

  // Calculate dynamic fare based on chosen car
  const getPackageCarPrice = (pkg: TourPackage, vehicleId: string) => {
    const v = vehicles.find(car => car.id === vehicleId) || vehicles[0];
    
    // Estimate days from duration string
    const days = pkg.duration.includes('3') ? 3 : pkg.duration.includes('4') ? 4 : 2;
    const baseDistance = Math.max(pkg.distanceKm, days * v.minKmPerDay);
    const carRate = v.ratePerKm || 12;
    const driverBata = (v.driverAllowancePerDay || 400) * days;
    const total = (baseDistance * carRate) + driverBata;

    const advance25 = Math.round(total * 0.25);
    const balance75 = total - advance25;

    return { total, advance25, balance75, vehicle: v };
  };

  const handlePackagePhotoUpload = (packageId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updatePackagePhoto(packageId, reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const t = {
    en: {
      kicker: 'Curated Road Trip Holidays',
      title: 'Handcrafted Car Tour Packages with Experienced Drivers',
      subtitle: 'Choose your own car (WagonR, Swift Dzire, Ertiga, or Innova Crysta), pay only 25% advance to lock your trip, and add custom travel photos.',
      all: 'All Tours',
      hills: 'Hill Stations & Nature',
      pilgrimage: 'Sacred Pilgrimages',
      chooseCarPrompt: 'Select Car for this Tour:',
      advanceBadge: '25% Advance to Confirm:',
      balanceBadge: 'Remaining on Trip:',
      viewItinerary: 'View Itinerary',
      bookPackage: 'Book This Tour (25% Advance)',
      addTripPhoto: 'Add / Change Trip Photo',
      photoAttached: 'Trip Photo Attached',
      close: 'Close',
      itineraryDay: 'Day',
      inclusionsTitle: 'Package Inclusions'
    },
    te: {
      kicker: 'ప్రత్యేక టూర్ ప్యాకేజీలు',
      title: 'కుటుంబంతో కలసి ఆనందించే అందమైన కార్ టూర్ ప్యాకేజీలు',
      subtitle: 'మీకు నచ్చిన కారు (WagonR, Swift Dzire, Ertiga లేదా Innova) ను ఎంచుకోండి, కేవలం 25% అడ్వాన్స్ చెల్లించి బుకింగ్ చేసుకోండి.',
      all: 'అన్ని టూర్లు',
      hills: 'హిల్ స్టేషన్స్ & నేచర్',
      pilgrimage: 'పుణ్యక్షేత్రాల దర్శనాలు',
      chooseCarPrompt: 'ఈ టూర్ కోసం కారు ఎంచుకోండి:',
      advanceBadge: '25% అడ్వాన్స్ మొత్తం:',
      balanceBadge: 'ప్రయాణంలో ఇవ్వవలసినది:',
      viewItinerary: 'టూర్ వివరాలు',
      bookPackage: 'ఈ టూర్ బుక్ చేయండి (25% అడ్వాన్స్)',
      addTripPhoto: 'ట్రిప్ ఫోటో జోడించండి',
      photoAttached: 'ట్రిప్ ఫోటో ఉంది',
      close: 'మూసివేయి',
      itineraryDay: 'రోజు',
      inclusionsTitle: 'ప్యాకేజీలో కలిపి ఉన్నవి'
    }
  }[lang];

  // Specific 4 cars user requested: WagonR, Dzire, Ertiga, Innova Crysta
  const packageCarOptions = [
    { id: 'hatchback-wagonr', label: 'WagonR AC', subtitle: '4 Seater' },
    { id: 'sedan-prime', label: 'Swift Dzire', subtitle: 'Sedan' },
    { id: 'mpv-family', label: 'Maruti Ertiga', subtitle: '6 Seater' },
    { id: 'suv-luxury', label: 'Innova Crysta', subtitle: '7 Seater' }
  ];

  return (
    <section id="packages" className="py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-red-600 mb-2">
              {t.kicker}
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-display tracking-tight text-balance">
              {t.title}
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-2xl">
              {t.subtitle}
            </p>
          </div>

          {/* Interactive filter tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 border border-slate-200 rounded-xl overflow-x-auto self-start md:self-auto shrink-0">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                activeCategory === 'all' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.all}
            </button>
            <button
              onClick={() => setActiveCategory('hills')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                activeCategory === 'hills' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.hills}
            </button>
            <button
              onClick={() => setActiveCategory('pilgrimage')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                activeCategory === 'pilgrimage' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.pilgrimage}
            </button>
          </div>
        </div>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredPackages.map((pkg) => {
            const currentCarId = chosenCarMap[pkg.id] || 'sedan-prime';
            const { total, advance25, balance75, vehicle } = getPackageCarPrice(pkg, currentCarId);

            return (
              <div
                key={pkg.id}
                className="bg-white rounded-2xl border border-slate-200 hover:border-slate-300 hover:shadow-xl transition-all duration-200 flex flex-col justify-between overflow-hidden"
              >
                {/* Trip Photo Banner (with custom upload support) */}
                <div className="relative h-48 bg-slate-900 overflow-hidden">
                  {pkg.imageUrl ? (
                    <img 
                      src={pkg.imageUrl} 
                      alt={pkg.title} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-tr from-slate-950 via-slate-900 to-red-950/40 p-6 flex flex-col justify-between text-white">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-red-400 uppercase tracking-wider">
                          {pkg.category === 'hills' ? 'Scenic Hill Road Trip' : 'Divine Pilgrimage'}
                        </span>
                        <span className="text-xs font-mono font-bold bg-white/10 px-2.5 py-0.5 rounded-full">
                          {pkg.duration}
                        </span>
                      </div>
                      <div>
                        <h4 className="text-xl font-bold font-display text-white">
                          {lang === 'en' ? pkg.destination : pkg.destinationTe}
                        </h4>
                        <p className="text-xs text-slate-300 mt-1">
                          {pkg.distanceKm} km round trip with experienced chauffeur
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Photo Upload Overlay Button */}
                  <label className="absolute bottom-3 right-3 cursor-pointer bg-slate-900/80 hover:bg-slate-900 text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg backdrop-blur-sm border border-slate-700 flex items-center gap-1.5 transition-colors shadow">
                    <Camera className="w-3.5 h-3.5 text-red-400" />
                    <span>{pkg.imageUrl ? t.photoAttached : t.addTripPhoto}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handlePackagePhotoUpload(pkg.id, e)}
                    />
                  </label>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    {/* Destination & Title */}
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
                      <div className="flex items-center gap-1.5 font-medium text-red-600">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{lang === 'en' ? pkg.destination : pkg.destinationTe}</span>
                      </div>
                      <div className="flex items-center gap-1.5 font-mono text-slate-600">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{lang === 'en' ? pkg.duration : pkg.durationTe}</span>
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-slate-900 font-display tracking-tight">
                      {lang === 'en' ? pkg.title : pkg.titleTe}
                    </h3>

                    <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {lang === 'en' ? pkg.summary : pkg.summaryTe}
                    </p>

                    {/* Interactive Car-as-Own Selector right on the card */}
                    <div className="mt-4 pt-3 border-t border-slate-100">
                      <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2">
                        {t.chooseCarPrompt}
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                        {packageCarOptions.map((opt) => {
                          const isSelected = currentCarId === opt.id;
                          return (
                            <button
                              key={opt.id}
                              type="button"
                              onClick={() => setChosenCarMap(prev => ({ ...prev, [pkg.id]: opt.id }))}
                              className={`p-2 rounded-xl text-left border transition-all ${
                                isSelected
                                  ? 'border-red-600 bg-red-50 text-red-950 ring-1 ring-red-600 shadow-sm'
                                  : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                              }`}
                            >
                              <div className="text-xs font-bold truncate">{opt.label}</div>
                              <div className="text-[10px] text-slate-500">{opt.subtitle}</div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Inclusions list */}
                    <div className="mt-3 space-y-1.5 border-t border-slate-100 pt-3">
                      {(lang === 'en' ? pkg.inclusions.slice(0, 2) : pkg.inclusionsTe.slice(0, 2)).map((item, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-slate-600">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Price & 25% Advance Calculation Footer */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                          Package Total with {vehicle.name}:
                        </div>
                        <div className="text-2xl font-black text-slate-900 font-mono tabular-nums">
                          ₹{total.toLocaleString('en-IN')}
                        </div>
                      </div>

                      <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-right sm:text-right">
                        <div className="text-[10px] text-emerald-800 font-bold uppercase">
                          {t.advanceBadge}
                        </div>
                        <div className="text-lg font-black font-mono text-emerald-700">
                          ₹{advance25.toLocaleString('en-IN')}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          Balance ₹{balance75.toLocaleString('en-IN')} on trip
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setSelectedPackage(pkg)}
                        className="flex-1 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg transition-colors whitespace-nowrap"
                      >
                        {t.viewItinerary}
                      </button>

                      <button
                        type="button"
                        onClick={() => onBookPackage(pkg, currentCarId, total, advance25, pkg.imageUrl)}
                        className="flex-1 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-all whitespace-nowrap flex items-center justify-center gap-1 shadow-md active:scale-95"
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                        <span>{t.bookPackage}</span>
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Itinerary Modal */}
      {selectedPackage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
            
            <div className="p-6 bg-slate-900 text-white flex items-start justify-between">
              <div>
                <span className="text-xs font-bold text-red-400 tracking-wider uppercase">
                  {lang === 'en' ? selectedPackage.destination : selectedPackage.destinationTe} · {lang === 'en' ? selectedPackage.duration : selectedPackage.durationTe}
                </span>
                <h3 className="text-xl font-bold font-display mt-1 text-white">
                  {lang === 'en' ? selectedPackage.title : selectedPackage.titleTe}
                </h3>
              </div>
              <button
                onClick={() => setSelectedPackage(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6">
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">
                  {lang === 'en' ? 'Day-by-Day Road Trip Plan' : 'రోజుల వారీ ప్రయాణ ప్రణాళిక'}
                </h4>
                <div className="space-y-4">
                  {selectedPackage.itinerary.map((day) => (
                    <div key={day.day} className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
                      <div className="flex items-center gap-2 text-xs font-bold text-red-800 mb-1">
                        <span className="bg-red-100 px-2 py-0.5 rounded font-mono">
                          {t.itineraryDay} {day.day}
                        </span>
                        <span className="text-slate-900 font-semibold">
                          {lang === 'en' ? day.title : day.titleTe}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                        {lang === 'en' ? day.description : day.descriptionTe}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {day.spots.map((spot, sIdx) => (
                          <span key={sIdx} className="text-[11px] text-slate-700 bg-white border border-slate-200 px-2 py-0.5 rounded">
                            {spot}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                  {t.inclusionsTitle}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {(lang === 'en' ? selectedPackage.inclusions : selectedPackage.inclusionsTe).map((inc, iIdx) => (
                    <div key={iIdx} className="flex items-start gap-2 text-xs text-slate-700">
                      <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                      <span>{inc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
              <button
                onClick={() => setSelectedPackage(null)}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900"
              >
                {t.close}
              </button>

              <button
                onClick={() => {
                  const pkg = selectedPackage;
                  setSelectedPackage(null);
                  const carId = chosenCarMap[pkg.id] || 'suv-luxury';
                  const { total, advance25 } = getPackageCarPrice(pkg, carId);
                  onBookPackage(pkg, carId, total, advance25, pkg.imageUrl);
                }}
                className="px-5 py-2.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-sm transition-all flex items-center gap-2"
              >
                <CreditCard className="w-4 h-4" />
                <span>{t.bookPackage}</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </section>
  );
};
