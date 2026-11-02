import React, { useState } from 'react';
import { Phone, Mail, MapPin, MessageCircle, Clock, ShieldCheck, Check, Lock } from 'lucide-react';
import { useTravelStore } from '../context/TravelStoreContext';
import { WayOraLogo } from './WayOraLogo';

interface FooterProps {
  lang: 'en' | 'te';
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ lang, onOpenAdmin }) => {
  const { settings, vehicles } = useTravelStore();
  const [callbackPhone, setCallbackPhone] = useState('');
  const [callbackSent, setCallbackSent] = useState(false);

  const handleCallbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!callbackPhone || callbackPhone.length < 10) return;
    setCallbackSent(true);
    setTimeout(() => {
      setCallbackPhone('');
      setCallbackSent(false);
    }, 4000);
  };

  const t = {
    en: {
      tagline: 'Reliable Travel. Professional Service. Providing verified chauffeur-driven car trips, outstation car rentals, and customized holiday packages with transparent billing.',
      quickLinks: 'Quick Links',
      fleets: 'Fleet Choices',
      contactUs: '24/7 Dispatch Desk',
      callbackTitle: 'Request an Immediate Callback',
      callbackDesc: 'Drop your mobile number. Our travel manager will call within 10 minutes.',
      callbackBtn: 'Request Call',
      callbackDone: 'Callback requested! We will call you shortly.',
      hubs: 'Primary Hubs: Hyderabad · Vijayawada · Visakhapatnam · Tirupati · Bangalore',
      rights: 'All rights reserved. Way Ora Journeys.',
      ownerLink: 'Owner Portal / Admin Login'
    },
    te: {
      tagline: 'నమ్మకమైన ప్రయాణం. ప్రొఫెషనల్ సర్వీస్. తెలంగాణ మరియు ఆంధ్రప్రదేశ్ అంతటా సురక్షితమైన, సౌకర్యవంతమైన కార్ రోడ్ ట్రిప్స్ మరియు హాలిడే ప్యాకేజీలు.',
      quickLinks: 'త్వరిత లింకులు',
      fleets: 'మా వాహనాలు',
      contactUs: '24/7 సంప్రదించండి',
      callbackTitle: 'కాల్‌బ్యాక్ అభ్యర్థించండి',
      callbackDesc: 'మీ మొబైల్ నంబర్ నమోదు చేయండి, 10 నిమిషాల్లో మా మేనేజర్ మీకు కాల్ చేస్తారు.',
      callbackBtn: 'కాల్ చేయండి',
      callbackDone: 'మీ అభ్యర్థన అందింది! త్వరలోనే కాల్ చేస్తాము.',
      hubs: 'ప్రధాన కేంద్రాలు: హైదరాబాద్ · విజయవాడ · విశాఖపట్నం · తిరుపతి · బెంగళూరు',
      rights: 'సర్వ హక్కులు ప్రత్యేకించబడ్డాయి. వే ఓరా జర్నీస్.',
      ownerLink: 'ఓనర్ కంట్రోల్ / అడ్మిన్ లాగిన్'
    }
  }[lang];

  return (
    <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-800">
      
      {/* Callback Strip */}
      <div className="border-b border-slate-800/80 bg-slate-900/60 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h4 className="text-base font-bold text-white font-display">
                {t.callbackTitle}
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                {t.callbackDesc}
              </p>
            </div>

            <form onSubmit={handleCallbackSubmit} className="flex items-center gap-2 max-w-md w-full">
              <input
                type="tel"
                required
                value={callbackPhone}
                onChange={(e) => setCallbackPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                placeholder="Enter 10-digit phone"
                className="flex-1 px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 text-xs focus:outline-none focus:ring-2 focus:ring-red-500 font-mono"
              />
              <button
                type="submit"
                className="px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg transition-colors whitespace-nowrap"
              >
                {callbackSent ? (
                  <span className="flex items-center gap-1 text-white">
                    <Check className="w-3.5 h-3.5" />
                    Sent
                  </span>
                ) : (
                  t.callbackBtn
                )}
              </button>
            </form>
          </div>
          {callbackSent && (
            <div className="mt-2 text-xs text-emerald-400">
              {t.callbackDone}
            </div>
          )}
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center">
              {settings.logoUrl ? (
                <img 
                  src={settings.logoUrl} 
                  alt="Way Ora Journeys" 
                  className="h-12 w-auto object-contain"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <WayOraLogo variant="light" size="md" showSubtitle={true} />
              )}
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {t.tagline}
            </p>
            <div className="text-[11px] text-slate-500">
              {t.hubs}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h5 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              {t.quickLinks}
            </h5>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#booking" className="hover:text-red-400 transition-colors">
                  Fare Estimator & Outstation Drops
                </a>
              </li>
              <li>
                <a href="#packages" className="hover:text-red-400 transition-colors">
                  Pilgrimage & Hill Station Packages
                </a>
              </li>
              <li>
                <a href="#fleet" className="hover:text-red-400 transition-colors">
                  Fleet & Car Specifications
                </a>
              </li>
              <li>
                <a href="#routes" className="hover:text-red-400 transition-colors">
                  Popular Highway Routes & Rates
                </a>
              </li>
              <li>
                <a href="#reviews" className="hover:text-red-400 transition-colors">
                  Customer Testimonials
                </a>
              </li>
            </ul>
          </div>

          {/* Fleet Models */}
          <div>
            <h5 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              {t.fleets}
            </h5>
            <ul className="space-y-2 text-xs">
              {vehicles.slice(0, 5).map((car) => (
                <li key={car.id}>
                  {car.name} ({car.models}) - ₹{car.ratePerKm}/km
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h5 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              {t.contactUs}
            </h5>
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center gap-2 text-white font-mono">
                <Phone className="w-3.5 h-3.5 text-red-500 shrink-0" />
                <a href={`tel:${settings.phone.replace(/\s+/g, '')}`} className="hover:underline">
                  {settings.phone}
                </a>
              </div>
              <div className="flex items-center gap-2 text-white font-mono">
                <MessageCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <a 
                  href={`https://wa.me/${settings.whatsapp.replace(/\D/g, '')}`} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="hover:underline"
                >
                  WhatsApp: {settings.whatsapp}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-red-500 shrink-0" />
                <span>{settings.email}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span>24 Hours · 365 Days Operations</span>
              </div>

              {/* Owner Admin Access Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={onOpenAdmin}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-amber-400 hover:text-amber-300 hover:border-amber-500/40 text-[11px] font-bold transition-colors"
                >
                  <Lock className="w-3 h-3" />
                  <span>{t.ownerLink}</span>
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Quiet Bottom Legal */}
        <div className="mt-12 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            © {new Date().getFullYear()} Way Ora Journeys. {t.rights}
          </div>
          <div className="flex items-center gap-4">
            <span>Verified Commercial Chauffeurs</span>
            <span>·</span>
            <span>Zero Hidden Charges</span>
            <span>·</span>
            <span>Clean Sanitized Cabs</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
