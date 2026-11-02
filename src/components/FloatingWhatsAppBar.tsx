import React from 'react';
import { MessageCircle, Phone } from 'lucide-react';
import { useTravelStore } from '../context/TravelStoreContext';

interface FloatingWhatsAppBarProps {
  lang: 'en' | 'te';
  onQuickBook: () => void;
}

export const FloatingWhatsAppBar: React.FC<FloatingWhatsAppBarProps> = ({ lang, onQuickBook }) => {
  const { settings } = useTravelStore();

  const handleWhatsApp = () => {
    const cleanNumber = settings.whatsapp.replace(/\D/g, '');
    const text = encodeURIComponent(
      `Hello Way Ora Journeys! I would like to book a car trip. Please share available cars and fare details.`
    );
    window.open(`https://wa.me/${cleanNumber}?text=${text}`, '_blank');
  };

  return (
    <div className="fixed bottom-4 right-4 z-40 flex items-center gap-2.5 no-print">
      {/* Quick Call with dynamic settings phone number */}
      <a
        href={`tel:${settings.phone.replace(/\s+/g, '')}`}
        className="hidden sm:flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-slate-900 text-white text-xs font-bold shadow-lg hover:bg-slate-800 transition-all hover:scale-105 border border-slate-700"
      >
        <Phone className="w-3.5 h-3.5 text-red-500" />
        <span>{lang === 'en' ? `Call: ${settings.phone}` : `కాల్: ${settings.phone}`}</span>
      </a>

      {/* WhatsApp Button */}
      <button
        onClick={handleWhatsApp}
        className="flex items-center gap-2 px-4 py-3 rounded-full bg-red-600 text-white text-xs font-bold shadow-xl hover:bg-red-700 transition-all hover:scale-105 active:scale-95"
        title="Chat on WhatsApp"
        aria-label="Direct WhatsApp Chat"
      >
        <MessageCircle className="w-4 h-4 fill-white" />
        <span className="hidden xs:inline">
          {lang === 'en' ? 'WhatsApp Booking' : 'వాట్సాప్ బుకింగ్'}
        </span>
      </button>
    </div>
  );
};
