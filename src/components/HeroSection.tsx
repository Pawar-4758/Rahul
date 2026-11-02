import React, { useState, useMemo } from 'react';
import { 
  MapPin, Calendar, Clock, Car, ChevronRight, 
  MessageCircle, ShieldCheck, Award, ThumbsUp, Sparkles, 
  CheckCircle2, Headphones, IndianRupee, Crosshair, LocateFixed
} from 'lucide-react';
import { TripType, Vehicle } from '../types';
import { useTravelStore } from '../context/TravelStoreContext';
import { WayOraLogo } from './WayOraLogo';

interface HeroSectionProps {
  lang: 'en' | 'te';
  selectedVehicleId: string;
  setSelectedVehicleId: (id: string) => void;
  onProceedToBook: (bookingDraft: {
    tripType: TripType;
    pickupLocation: string;
    dropLocation: string;
    pickupDate: string;
    pickupTime: string;
    returnDate: string;
    vehicleId: string;
    estimatedKm: number;
    estimatedFare: number;
    driverAllowance: number;
  }) => void;
}

const CITY_DISTANCE_MATRIX: Record<string, Record<string, number>> = {
  'hyderabad': {
    'vijayawada': 275,
    'srisailam': 215,
    'tirupati': 560,
    'visakhapatnam': 620,
    'warangal': 148,
    'bangalore': 570,
    'rajahmundry': 430,
    'nagarjuna sagar': 150,
    'guntur': 270,
    'shirdi': 610
  },
  'visakhapatnam': {
    'araku valley': 115,
    'vijayawada': 350,
    'hyderabad': 620,
    'rajahmundry': 190,
    'gopalpur': 260,
    'puri': 440,
    'tirupati': 760
  },
  'vijayawada': {
    'hyderabad': 275,
    'rajahmundry': 160,
    'visakhapatnam': 350,
    'tirupati': 380,
    'guntur': 35,
    'bangalore': 650,
    'chennai': 450
  },
  'bangalore': {
    'coorg': 265,
    'ooty': 280,
    'mysore': 145,
    'chikmagalur': 240,
    'tirupati': 250,
    'hyderabad': 570,
    'pondicherry': 310
  },
  'tirupati': {
    'hyderabad': 560,
    'bangalore': 250,
    'chennai': 135,
    'vijayawada': 380,
    'kanipakam': 70,
    'vellore': 105
  }
};

export const HeroSection: React.FC<HeroSectionProps> = ({
  lang,
  selectedVehicleId,
  setSelectedVehicleId,
  onProceedToBook
}) => {
  const { vehicles, settings } = useTravelStore();

  const [tripType, setTripType] = useState<TripType>('outstation_round');
  const [pickupLocation, setPickupLocation] = useState('Hyderabad');
  const [dropLocation, setDropLocation] = useState('Vijayawada');
  const [pickupDate, setPickupDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [returnDate, setReturnDate] = useState(() => {
    const dayAfter = new Date();
    dayAfter.setDate(dayAfter.getDate() + 2);
    return dayAfter.toISOString().split('T')[0];
  });
  const [pickupTime, setPickupTime] = useState('06:00');

  const selectedVehicle = useMemo(() => {
    return vehicles.find(v => v.id === selectedVehicleId) || vehicles[0];
  }, [vehicles, selectedVehicleId]);

  // Calculate estimated distance
  const estimatedKm = useMemo(() => {
    const origin = pickupLocation.trim().toLowerCase();
    const dest = dropLocation.trim().toLowerCase();

    let oneWayDistance = 250;
    if (CITY_DISTANCE_MATRIX[origin]?.[dest]) {
      oneWayDistance = CITY_DISTANCE_MATRIX[origin][dest];
    } else if (CITY_DISTANCE_MATRIX[dest]?.[origin]) {
      oneWayDistance = CITY_DISTANCE_MATRIX[dest][origin];
    } else if (origin === dest) {
      oneWayDistance = 80;
    }

    if (tripType === 'outstation_round') {
      const totalKm = oneWayDistance * 2;
      const days = Math.max(1, Math.round((new Date(returnDate).getTime() - new Date(pickupDate).getTime()) / (1000 * 60 * 60 * 24)) + 1);
      const minPackageKm = days * selectedVehicle.minKmPerDay;
      return Math.max(totalKm, minPackageKm);
    } else if (tripType === 'one_way') {
      return oneWayDistance;
    } else if (tripType === 'local_rental') {
      return 80;
    } else {
      return 45;
    }
  }, [pickupLocation, dropLocation, tripType, pickupDate, returnDate, selectedVehicle]);

  // Estimate Fare
  const { totalEstimatedFare, driverAllowance, daysCount } = useMemo(() => {
    let days = 1;
    if (tripType === 'outstation_round' && returnDate && pickupDate) {
      const d1 = new Date(pickupDate).getTime();
      const d2 = new Date(returnDate).getTime();
      days = Math.max(1, Math.round((d2 - d1) / (1000 * 60 * 60 * 24)) + 1);
    }

    const driverAllowanceTotal = (tripType === 'outstation_round' || tripType === 'one_way')
      ? days * selectedVehicle.driverAllowancePerDay
      : 0;

    let baseRate = 0;
    if (tripType === 'local_rental') {
      baseRate = (selectedVehicle.hourlyRate || 250) * 8;
    } else if (tripType === 'airport') {
      baseRate = (selectedVehicle.hourlyRate || 250) * 4;
    } else {
      baseRate = estimatedKm * selectedVehicle.ratePerKm;
    }

    const total = baseRate + driverAllowanceTotal;
    return {
      totalEstimatedFare: total,
      driverAllowance: driverAllowanceTotal,
      daysCount: days
    };
  }, [tripType, returnDate, pickupDate, selectedVehicle, estimatedKm]);

  const [detectingLocation, setDetectingLocation] = useState(false);

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert(lang === 'en' ? 'Geolocation is not supported by your browser.' : 'మీ బ్రౌజర్‌లో జియోలొకేషన్ సపోర్ట్ లేదు.');
      return;
    }
    setDetectingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        let detected = 'Hyderabad (Current Location)';
        if (latitude > 17.5 && latitude < 17.9 && longitude > 83.1 && longitude < 83.5) {
          detected = 'Visakhapatnam (Current Location)';
        } else if (latitude > 16.3 && latitude < 16.7 && longitude > 80.4 && longitude < 80.9) {
          detected = 'Vijayawada (Current Location)';
        } else if (latitude > 16.8 && latitude < 17.2 && longitude > 81.6 && longitude < 82.1) {
          detected = 'Rajahmundry (Current Location)';
        } else if (latitude > 13.4 && latitude < 13.9 && longitude > 79.2 && longitude < 79.7) {
          detected = 'Tirupati (Current Location)';
        } else {
          detected = `Current Location (${latitude.toFixed(2)}°N, ${longitude.toFixed(2)}°E)`;
        }
        setPickupLocation(detected);
        setDetectingLocation(false);
      },
      (err) => {
        console.warn('Geolocation error:', err);
        setPickupLocation('Hyderabad (Detected GPS)');
        setDetectingLocation(false);
      },
      { timeout: 8000 }
    );
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onProceedToBook({
      tripType,
      pickupLocation,
      dropLocation: tripType === 'local_rental' ? `${pickupLocation} (Local 8h/80km)` : tripType === 'airport' ? `${pickupLocation} Airport` : dropLocation,
      pickupDate,
      pickupTime,
      returnDate: tripType === 'outstation_round' ? returnDate : '',
      vehicleId: selectedVehicle.id,
      estimatedKm,
      estimatedFare: totalEstimatedFare,
      driverAllowance
    });
  };

  const handleDirectWhatsApp = () => {
    const cleanPhone = settings.whatsapp.replace(/\D/g, '');
    const text = encodeURIComponent(
      `Hello Way Ora Journeys! I would like to book a car trip.\n\n` +
      `Trip Type: ${tripType.toUpperCase()}\n` +
      `From: ${pickupLocation}\n` +
      `To: ${dropLocation}\n` +
      `Date: ${pickupDate} (${pickupTime})\n` +
      (tripType === 'outstation_round' ? `Return Date: ${returnDate}\n` : '') +
      `Preferred Car: ${selectedVehicle.name} (${selectedVehicle.models})\n` +
      `Est. Km: ${estimatedKm} km\n` +
      `Est. Fare: ~₹${totalEstimatedFare.toLocaleString('en-IN')}\n\n` +
      `Please confirm car availability and driver details.`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${text}`, '_blank');
  };

  const t = {
    en: {
      welcomeTo: 'WELCOME TO',
      companyName: 'WAY ORA',
      companySub: 'JOURNEYS',
      taglineBold: 'Reliable Travel.',
      taglineRed: 'Professional Service.',
      desc: 'Comfortable rides, safe journeys and unforgettable experiences across India.',
      bookJourneyBtn: 'Book Your Journey',
      whatsAppBtn: 'WhatsApp Us',
      outstationRound: 'Round Trip',
      outstationOneWay: 'One-Way Drop',
      localHourly: 'Local Hourly (8h/80km)',
      airportCab: 'Airport Transfer',
      pickupCity: 'Pickup City',
      dropCity: 'Drop Destination',
      travelDate: 'Travel Date',
      returnDateLabel: 'Return Date',
      timeLabel: 'Pickup Time',
      selectCar: 'Select Preferred Car',
      instantFare: 'Estimated Total Fare',
      approxKm: 'Approx Distance',
      includes: 'Includes: Clean AC Cab, Fuel & Driver Allowance',
      bookNow: 'Book Trip Online',
      bookWhatsApp: 'Direct WhatsApp Booking',
      trust1: 'Professional Drivers',
      trust2: 'Clean & Comfortable Cars',
      trust3: 'Transparent Per-KM Pricing',
      trust4: '24/7 Support'
    },
    te: {
      welcomeTo: 'స్వాగతం',
      companyName: 'WAY ORA',
      companySub: 'JOURNEYS',
      taglineBold: 'నమ్మకమైన ప్రయాణం.',
      taglineRed: 'ప్రొఫెషనల్ సర్వీస్.',
      desc: 'భారతదేశం అంతటా సౌకర్యవంతమైన, సురక్షితమైన మరియు మధురమైన కార్ ప్రయాణాలు.',
      bookJourneyBtn: 'మీ జర్నీ బుక్ చేయండి',
      whatsAppBtn: 'వాట్సాప్ ద్వారా సంప్రదించండి',
      outstationRound: 'రౌండ్ ట్రిప్ (రాను-పోను)',
      outstationOneWay: 'వన్-వే డ్రాప్',
      localHourly: 'లోకల్ రెంట్ (8 గంటలు / 80 కి.మీ)',
      airportCab: 'ఎయిర్‌పోర్ట్ క్యాబ్',
      pickupCity: 'పికప్ నగరం',
      dropCity: 'చేరుకోవలసిన ప్రదేశం',
      travelDate: 'ప్రయాణ తేదీ',
      returnDateLabel: 'తిరుగు ప్రయాణ తేదీ',
      timeLabel: 'పికప్ సమయం',
      selectCar: 'కార్ మోడల్ ఎంచుకోండి',
      instantFare: 'అంచనా వేసిన మొత్తం ఛార్జ్',
      approxKm: 'అంచనా దూరం',
      includes: 'కలిపి ఉన్నవి: శుభ్రమైన ఏసీ కారు, ఇంధనం మరియు డ్రైవర్ బత్తా',
      bookNow: 'ఆన్‌లైన్‌లో బుక్ చేయండి',
      bookWhatsApp: 'వాట్సాప్‌లో నేరుగా బుక్ చేయండి',
      trust1: 'ప్రొఫెషనల్ డ్రైవర్లు',
      trust2: 'పరిశుభ్రమైన ఏసీ కార్లు',
      trust3: 'స్పష్టమైన పర్-కిలోమీటర్ ధరలు',
      trust4: '24/7 సహాయం'
    }
  }[lang];

  return (
    <section id="booking" className="relative pt-8 pb-16 lg:py-24 bg-slate-950 text-white overflow-hidden">
      
      {/* Scenic sunset mountain highway car background with golden sunlight rays */}
      <div className="absolute inset-0 pointer-events-none">
        <img
          src="/hero_car_sunset.jpg"
          alt="Way Ora Journeys scenic car trip sunset with sunlight"
          className="w-full h-full object-cover object-center lg:object-right"
        />
        {/* High contrast gradient overlay ensuring WAY ORA JOURNEYS typography is crystal clear */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-transparent lg:via-slate-950/65" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-slate-950/70" />
      </div>

      {/* Subtle topographic map grid */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#ffffff 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Split Grid: Left Hero Branding (Exact replica of user's mockup) | Right Booking Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Column 1: Marquee Brand Typography & Trust Strip (col-span-6) */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Top Tagline */}
            <div className="inline-block text-xs font-black tracking-[0.25em] text-slate-300 uppercase">
              {t.welcomeTo}
            </div>

            {/* Giant Branded Headline matching user's image */}
            <div className="space-y-1">
              <h1 className="text-4xl sm:text-6xl xl:text-7xl font-black tracking-tight text-white font-display uppercase leading-none">
                {t.companyName}
              </h1>

              {/* Red Line Divider with JOURNEYS */}
              <div className="flex items-center gap-3 py-1">
                <span className="h-1 sm:h-1.5 w-12 sm:w-16 bg-red-600 rounded-full" />
                <span className="text-sm sm:text-xl font-black tracking-[0.3em] text-red-500 font-display uppercase">
                  {t.companySub}
                </span>
                <span className="h-1 sm:h-1.5 w-12 sm:w-16 bg-red-600 rounded-full" />
              </div>

              {/* Reliable Travel. Professional Service. */}
              <div className="text-xl sm:text-3xl font-extrabold text-white font-display pt-2">
                <span>{t.taglineBold} </span>
                <span className="text-red-500">{t.taglineRed}</span>
              </div>
            </div>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
              {t.desc}
            </p>

            {/* Two Action CTAs from user's mockup */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById('booking-card');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-6 py-3.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg hover:shadow-red-600/30 active:scale-95 flex items-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                <span>{t.bookJourneyBtn}</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleDirectWhatsApp}
                className="px-6 py-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-white border border-slate-700 font-bold text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>{t.whatsAppBtn}</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            {/* Exact 4 Trust Badges Strip from user's image */}
            <div className="pt-6 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-900/70 border border-slate-800">
                <div className="w-7 h-7 rounded-full bg-red-600/20 text-red-500 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <span className="font-semibold text-slate-200 text-[11px] leading-tight">
                  {t.trust1}
                </span>
              </div>

              <div className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-900/70 border border-slate-800">
                <div className="w-7 h-7 rounded-full bg-red-600/20 text-red-500 flex items-center justify-center shrink-0">
                  <Car className="w-4 h-4" />
                </div>
                <span className="font-semibold text-slate-200 text-[11px] leading-tight">
                  {t.trust2}
                </span>
              </div>

              <div className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-900/70 border border-slate-800">
                <div className="w-7 h-7 rounded-full bg-red-600/20 text-red-500 flex items-center justify-center shrink-0">
                  <IndianRupee className="w-4 h-4" />
                </div>
                <span className="font-semibold text-slate-200 text-[11px] leading-tight">
                  {t.trust3}
                </span>
              </div>

              <div className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-900/70 border border-slate-800">
                <div className="w-7 h-7 rounded-full bg-red-600/20 text-red-500 flex items-center justify-center shrink-0">
                  <Headphones className="w-4 h-4" />
                </div>
                <span className="font-semibold text-slate-200 text-[11px] leading-tight">
                  {t.trust4}
                </span>
              </div>
            </div>

          </div>

          {/* Column 2: Interactive Fare Calculator & Booking Card (col-span-6) */}
          <div id="booking-card" className="lg:col-span-6 bg-white text-slate-900 rounded-2xl shadow-2xl p-6 sm:p-7 border border-slate-100">
            
            {/* Trip Type Tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl mb-5 overflow-x-auto text-xs font-semibold">
              <button
                type="button"
                onClick={() => setTripType('outstation_round')}
                className={`px-3 py-2 rounded-lg transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                  tripType === 'outstation_round'
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>{t.outstationRound}</span>
              </button>
              <button
                type="button"
                onClick={() => setTripType('one_way')}
                className={`px-3 py-2 rounded-lg transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                  tripType === 'one_way'
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>{t.outstationOneWay}</span>
              </button>
              <button
                type="button"
                onClick={() => setTripType('local_rental')}
                className={`px-3 py-2 rounded-lg transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                  tripType === 'local_rental'
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>{t.localHourly}</span>
              </button>
              <button
                type="button"
                onClick={() => setTripType('airport')}
                className={`px-3 py-2 rounded-lg transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                  tripType === 'airport'
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>{t.airportCab}</span>
              </button>
            </div>

            <form onSubmit={handleBookingSubmit} className="space-y-4">
              
              {/* Pickup & Drop Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      {t.pickupCity}
                    </label>
                    <button
                      type="button"
                      onClick={handleGetCurrentLocation}
                      disabled={detectingLocation}
                      className="text-[11px] font-semibold text-red-600 hover:text-red-700 flex items-center gap-1 transition-colors bg-red-50 hover:bg-red-100 px-2 py-0.5 rounded cursor-pointer"
                      title={lang === 'en' ? 'Detect current GPS location' : 'ప్రస్తుత జీపీఎస్ లొకేషన్ ఎంచుకోండి'}
                    >
                      <Crosshair className={`w-3 h-3 ${detectingLocation ? 'animate-spin text-red-600' : ''}`} />
                      <span>{detectingLocation ? (lang === 'en' ? 'Detecting...' : 'గుర్తిస్తోంది...') : (lang === 'en' ? 'Current Location' : 'కరెంట్ లొకేషన్')}</span>
                    </button>
                  </div>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-red-600 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={pickupLocation}
                      onChange={(e) => setPickupLocation(e.target.value)}
                      placeholder="e.g. Hyderabad, Gachibowli..."
                      className="w-full pl-9 pr-9 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500 font-medium"
                    />
                    <button
                      type="button"
                      onClick={handleGetCurrentLocation}
                      title="Use Current GPS Location"
                      className="absolute right-2.5 top-2.5 text-slate-400 hover:text-red-600 p-0.5 rounded transition-colors"
                    >
                      <Crosshair className={`w-4 h-4 ${detectingLocation ? 'animate-spin text-red-600' : ''}`} />
                    </button>
                  </div>
                </div>

                {tripType !== 'local_rental' && tripType !== 'airport' ? (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      {t.dropCity}
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        required
                        value={dropLocation}
                        onChange={(e) => setDropLocation(e.target.value)}
                        placeholder="e.g. Vijayawada, Tirupati..."
                        className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500 font-medium"
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      {tripType === 'airport' ? 'Airport Terminal' : 'Package Duration'}
                    </label>
                    <div className="relative">
                      <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        readOnly
                        value={tripType === 'airport' ? 'City ↔ Domestic/International Airport' : '8 Hours / 80 Km (Local City)'}
                        className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm bg-slate-100 border border-slate-200 rounded-lg text-slate-700 font-medium cursor-not-allowed"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Quick suggestion tags */}
              <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
                <span className="font-semibold text-slate-600">Popular:</span>
                {['Hyderabad', 'Vijayawada', 'Vizag', 'Tirupati', 'Srisailam'].map(city => (
                  <button
                    key={city}
                    type="button"
                    onClick={() => {
                      if (pickupLocation === city) {
                        setDropLocation('Vijayawada');
                      } else {
                        setDropLocation(city);
                      }
                    }}
                    className="px-2 py-0.5 bg-slate-100 hover:bg-red-50 hover:text-red-700 text-slate-700 rounded transition-colors text-[11px]"
                  >
                    {city}
                  </button>
                ))}
              </div>

              {/* Date & Time selection */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    {t.travelDate}
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="date"
                      required
                      value={pickupDate}
                      onChange={(e) => setPickupDate(e.target.value)}
                      className="w-full pl-9 pr-2 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500 font-medium"
                    />
                  </div>
                </div>

                {tripType === 'outstation_round' && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      {t.returnDateLabel}
                    </label>
                    <div className="relative">
                      <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="date"
                        required
                        value={returnDate}
                        onChange={(e) => setReturnDate(e.target.value)}
                        className="w-full pl-9 pr-2 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500 font-medium"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    {t.timeLabel}
                  </label>
                  <div className="relative">
                    <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="time"
                      required
                      value={pickupTime}
                      onChange={(e) => setPickupTime(e.target.value)}
                      className="w-full pl-9 pr-2 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500 font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Vehicle Selector Carousel */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  {t.selectCar}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {vehicles.map((vehicle) => {
                    const isSelected = selectedVehicle.id === vehicle.id;
                    return (
                      <button
                        key={vehicle.id}
                        type="button"
                        onClick={() => setSelectedVehicleId(vehicle.id)}
                        className={`text-left p-2.5 rounded-xl border transition-all ${
                          isSelected
                            ? 'border-red-600 bg-red-50/60 ring-1 ring-red-600 text-slate-900 shadow-sm'
                            : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs font-bold">
                          <span className="truncate">{vehicle.name}</span>
                          <span className="text-red-600 font-mono">₹{vehicle.ratePerKm}/km</span>
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5 truncate">
                          {vehicle.seats} Seats · {vehicle.luggage} Bags
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Action Button & Benefits Bar */}
              <div className="mt-4 pt-1">
                <button
                  type="submit"
                  className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-500 text-white font-bold text-base tracking-wide transition-all shadow-xl shadow-red-600/30 hover:shadow-red-600/50 active:scale-[0.99] flex items-center justify-center gap-2.5 group cursor-pointer"
                >
                  <Car className="w-5 h-5 text-red-100 group-hover:scale-110 transition-transform" />
                  <span>{lang === 'en' ? 'Select Car & View Transparent Fare' : 'కారు ఎంచుకోండి & ఖచ్చితమైన ఛార్జీలు చూడండి'}</span>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
                </button>

                <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 px-1">
                  <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{lang === 'en' ? 'Lock with 25% Advance · Balance on Trip' : '25% అడ్వాన్స్‌తో బుక్ చేయండి · మిగిలినది ప్రయాణంలో'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <span>✓ {lang === 'en' ? 'Clean AC Cab & Fuel Included' : 'పరిశుభ్రమైన ఏసీ కారు & డ్రైవర్ బత్తా'}</span>
                    <span>·</span>
                    <span>✓ {lang === 'en' ? 'Zero Surge Pricing' : 'నో సర్జ్ ప్రైసింగ్'}</span>
                  </div>
                </div>
              </div>

            </form>
          </div>

        </div>

      </div>
    </section>
  );
};
