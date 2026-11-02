import React, { useState } from 'react';
import { Phone, MessageCircle, Menu, X, Globe, Lock, FileText, UserCheck, Car } from 'lucide-react';
import { WayOraLogo } from './WayOraLogo';
import { useTravelStore } from '../context/TravelStoreContext';

interface NavbarProps {
  lang: 'en' | 'te';
  setLang: (lang: 'en' | 'te') => void;
  onBookClick: () => void;
  onOpenAdmin: () => void;
  onOpenMyBookings: () => void;
  onOpenDriverJoin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  lang, 
  setLang, 
  onBookClick,
  onOpenAdmin,
  onOpenMyBookings,
  onOpenDriverJoin
}) => {
  const { settings, isAdmin, bookings } = useTravelStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const t = {
    en: {
      fares: 'Fares & Booking',
      fleet: 'Our Fleet',
      packages: 'Tour Packages',
      routes: 'Popular Routes',
      myBookings: 'My Bookings',
      driveWithUs: 'Drive With Us',
      callNow: `Call: ${settings.phone}`,
      whatsAppUs: 'WhatsApp Us',
      ownerPortal: 'Owner Admin'
    },
    te: {
      fares: 'బుకింగ్ & ధరలు',
      fleet: 'మా కార్లు (Fleet)',
      packages: 'టూర్ ప్యాకేజీలు',
      routes: 'ప్రసిద్ధ మార్గాలు',
      myBookings: 'నా బుకింగ్స్',
      driveWithUs: 'డ్రైవర్ జాయిన్',
      callNow: `కాల్: ${settings.phone}`,
      whatsAppUs: 'వాట్సాప్ చేయండి',
      ownerPortal: 'ఓనర్ కంట్రోల్'
    }
  }[lang];

  const handleWhatsApp = () => {
    const cleanNumber = settings.whatsapp.replace(/\D/g, '');
    window.open(`https://wa.me/${cleanNumber}?text=${encodeURIComponent('Hello Way Ora Journeys! I would like to inquire about car booking.')}`, '_blank');
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-md border-b border-slate-800 text-white transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 h-20">
          
          {/* Zone 1: Authentic Business Logo matching user's uploaded branding */}
          <a href="#" className="flex items-center group shrink-0" title="Way Ora Journeys Homepage">
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
          </a>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden xl:flex items-center gap-6 text-sm font-semibold text-slate-300">
            <a href="#booking" className="hover:text-red-500 transition-colors whitespace-nowrap shrink-0">
              {t.fares}
            </a>
            <a href="#packages" className="hover:text-red-500 transition-colors whitespace-nowrap shrink-0">
              {t.packages}
            </a>
            <a href="#fleet" className="hover:text-red-500 transition-colors whitespace-nowrap shrink-0">
              {t.fleet}
            </a>
            <a href="#routes" className="hover:text-red-500 transition-colors whitespace-nowrap shrink-0">
              {t.routes}
            </a>
            <button
              onClick={onOpenDriverJoin}
              className="text-amber-400 hover:text-amber-300 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1 font-bold"
            >
              <span>{t.driveWithUs}</span>
            </button>
          </nav>

          {/* Zone 3: Direct Phone, WhatsApp Button, My Bookings, Language Toggle, and Owner Admin */}
          <div className="flex items-center gap-2.5 shrink-0">
            
            {/* My Bookings Button */}
            <button
              type="button"
              onClick={onOpenMyBookings}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-500 text-slate-200 hover:text-white transition-colors shadow-sm"
              title="View my trips, 25% advance status, and vouchers"
            >
              <FileText className="w-3.5 h-3.5 text-red-500" />
              <span>{t.myBookings}</span>
              {bookings.length > 0 && (
                <span className="w-4 h-4 rounded-full bg-red-600 text-white text-[10px] font-mono flex items-center justify-center font-bold">
                  {bookings.length}
                </span>
              )}
            </button>

            {/* Red WhatsApp CTA matching user's mockup */}
            <button
              onClick={handleWhatsApp}
              className="px-3.5 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-md transition-all hover:scale-105 active:scale-95 whitespace-nowrap shrink-0 flex items-center gap-1.5"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-white" />
              <span className="hidden sm:inline">{t.whatsAppUs}</span>
            </button>

            {/* Language Switcher */}
            <button
              onClick={() => setLang(lang === 'en' ? 'te' : 'en')}
              className="flex items-center gap-1 px-2.5 py-2 text-xs font-semibold rounded-lg border border-slate-700 bg-slate-900 text-slate-300 hover:text-white transition-colors whitespace-nowrap"
              title="Switch Language / భాష మార్చండి"
            >
              <Globe className="w-3.5 h-3.5 text-slate-400" />
              <span>{lang === 'en' ? 'తెలుగు' : 'EN'}</span>
            </button>

            {/* Owner Control Hub Trigger */}
            <button
              onClick={onOpenAdmin}
              className={`p-2 rounded-lg border transition-all flex items-center gap-1 text-xs font-bold ${
                isAdmin
                  ? 'border-amber-500/50 bg-amber-500/20 text-amber-300'
                  : 'border-slate-800 bg-slate-900/80 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
              title={lang === 'en' ? 'Owner Control Center' : 'ఓనర్ కంట్రోల్ ప్యానెల్'}
            >
              <Lock className="w-3.5 h-3.5" />
              <span className="hidden md:inline">{isAdmin ? 'Admin' : 'Owner'}</span>
            </button>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-slate-800 bg-slate-900 px-4 py-5 shadow-2xl space-y-3">
          <nav className="flex flex-col space-y-3">
            <a
              href="#booking"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-semibold text-slate-200 hover:text-red-400 py-1"
            >
              {t.fares}
            </a>
            <a
              href="#packages"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-semibold text-slate-200 hover:text-red-400 py-1"
            >
              {t.packages}
            </a>
            <a
              href="#fleet"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-semibold text-slate-200 hover:text-red-400 py-1"
            >
              {t.fleet}
            </a>
            <a
              href="#routes"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-semibold text-slate-200 hover:text-red-400 py-1"
            >
              {t.routes}
            </a>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenDriverJoin();
              }}
              className="text-sm font-semibold text-amber-400 hover:text-amber-300 py-1 text-left flex items-center gap-2"
            >
              <Car className="w-4 h-4" />
              <span>{t.driveWithUs}</span>
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenMyBookings();
              }}
              className="text-sm font-semibold text-red-400 hover:text-red-300 py-1 text-left flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              <span>{t.myBookings}</span>
            </button>
          </nav>
          
          <div className="pt-3 border-t border-slate-800 flex flex-col gap-2">
            <a
              href={`tel:${settings.phone.replace(/\s+/g, '')}`}
              className="flex items-center justify-center gap-2 py-2 text-sm font-semibold text-white bg-slate-800 rounded-lg"
            >
              <Phone className="w-4 h-4 text-red-500" />
              <span>{settings.phone}</span>
            </a>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="flex items-center justify-center gap-2 py-2 text-xs font-bold text-amber-300 bg-amber-950/40 border border-amber-800/60 rounded-lg"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{t.ownerPortal}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
