import React from 'react';
import { 
  X, Printer, MessageCircle, ShieldCheck, 
  MapPin, Calendar, Clock, Car, User, Phone, CheckCircle2, CreditCard, Sparkles 
} from 'lucide-react';
import { BookingDetails } from '../types';
import { useTravelStore } from '../context/TravelStoreContext';
import { WayOraLogo } from './WayOraLogo';

interface TravelVoucherModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'en' | 'te';
  booking: BookingDetails | null;
  onPayAdvance?: (booking: BookingDetails) => void;
}

export const TravelVoucherModal: React.FC<TravelVoucherModalProps> = ({
  isOpen,
  onClose,
  lang,
  booking,
  onPayAdvance
}) => {
  const { settings, vehicles } = useTravelStore();

  if (!isOpen || !booking) return null;

  const vehicle = vehicles.find(v => v.id === booking.vehicleId) || vehicles[0];
  const advanceAmount = booking.advanceAmount || Math.round(booking.estimatedFare * 0.25);
  const remainingAmount = booking.remainingAmount || (booking.estimatedFare - advanceAmount);
  const isAdvancePaid = booking.paymentStatus === 'advance_paid';

  const handlePrint = () => {
    window.print();
  };

  const handleShareWhatsApp = () => {
    const cleanNumber = settings.whatsapp.replace(/\D/g, '');
    const msg = encodeURIComponent(
      `*WAY ORA JOURNEYS - TRIP VOUCHER*\n` +
      `Booking ID: ${booking.bookingId}\n` +
      `Status: ${booking.status.toUpperCase()} (${isAdvancePaid ? '25% Advance Paid' : 'Advance Pending'})\n\n` +
      `*Passenger:* ${booking.name} (${booking.phone})\n` +
      `*Pickup:* ${booking.pickupLocation}\n` +
      `*Destination:* ${booking.dropLocation}\n` +
      `*Date & Time:* ${booking.pickupDate} at ${booking.pickupTime}\n` +
      (booking.returnDate ? `*Return Date:* ${booking.returnDate}\n` : '') +
      `*Vehicle:* ${booking.vehicleName}\n` +
      `*Total Fare:* ₹${booking.estimatedFare.toLocaleString('en-IN')}\n` +
      `*25% Advance:* ₹${advanceAmount.toLocaleString('en-IN')}\n` +
      `*Remaining Balance:* ₹${remainingAmount.toLocaleString('en-IN')}\n` +
      (booking.transactionId ? `*Transaction UTR:* ${booking.transactionId}\n` : '') +
      `\nOfficial booking with Way Ora Journeys.`
    );
    window.open(`https://wa.me/${cleanNumber}?text=${msg}`, '_blank');
  };

  const t = {
    en: {
      voucherTitle: 'Official Trip Confirmation Voucher',
      companySub: 'Way Ora Journeys · Reliable Travel. Professional Service.',
      bookingRef: 'Booking ID',
      tripStatus: 'Trip Status',
      confirmed: 'Confirmed',
      pending: 'Pending',
      cancelled: 'Cancelled',
      tripDetails: 'Trip & Vehicle Details',
      route: 'Route',
      pickup: 'Pickup Address',
      destination: 'Destination',
      schedule: 'Schedule',
      vehicle: 'Assigned Vehicle',
      passenger: 'Passenger Name & Phone',
      fareBreakdown: 'Fare & 25% Advance Breakdown',
      totalFare: 'Total Trip Fare',
      advance25: '25% Advance Payable',
      balance75: '75% Balance on Journey',
      advancePaidTag: '25% Advance Received',
      advancePendingTag: '25% Advance Pending',
      payAdvanceBtn: 'Pay 25% Advance Online Now',
      driverNotice: 'Chauffeur name, contact number, and vehicle registration plate details will be sent via SMS & WhatsApp 2 hours prior to pickup.',
      printBtn: 'Print / Download PDF Voucher',
      shareWhatsApp: 'Send Voucher to WhatsApp',
      closeBtn: 'Close'
    },
    te: {
      voucherTitle: 'ట్రిప్ అధికారిక బుకింగ్ రశీదు (Voucher)',
      companySub: 'వే ఓరా జర్నీస్ · నమ్మకమైన ప్రయాణం, ప్రొఫెషనల్ సర్వీస్',
      bookingRef: 'బుకింగ్ ఐడీ (ID)',
      tripStatus: 'ట్రిప్ స్టేటస్',
      confirmed: 'కన్ఫర్మ్ చేయబడింది',
      pending: 'పెండింగ్',
      cancelled: 'రద్దు చేయబడింది',
      tripDetails: 'ప్రయాణ & కారు వివరాలు',
      route: 'ప్రయాణ మార్గం',
      pickup: 'పికప్ అడ్రస్',
      destination: 'గమ్యస్థానం',
      schedule: 'ప్రయాణ తేదీ & సమయం',
      vehicle: 'ఎంచుకున్న కారు',
      passenger: 'ప్రయాణికుడి పేరు & ఫోన్',
      fareBreakdown: 'ఛార్జీ & 25% అడ్వాన్స్ వివరాలు',
      totalFare: 'మొత్తం ఛార్జ్',
      advance25: '25% అడ్వాన్స్ మొత్తం',
      balance75: 'ప్రయాణంలో డ్రైవర్‌కు ఇవ్వాల్సిన 75%',
      advancePaidTag: '25% అడ్వాన్స్ చెల్లించబడింది',
      advancePendingTag: '25% అడ్వాన్స్ చెల్లించవలసి ఉంది',
      payAdvanceBtn: '25% అడ్వాన్స్ ఆన్‌లైన్ పేమెంట్ చేయండి',
      driverNotice: 'ప్రయాణానికి 2 గంటల ముందు డ్రైవర్ పేరు, ఫోన్ నంబర్ మరియు కారు నంబర్ మీ వాట్సాప్ మరియు SMS కు పంపబడతాయి.',
      printBtn: 'రశీదు ప్రింట్ / PDF డౌన్‌లోడ్',
      shareWhatsApp: 'వాట్సాప్‌లో షేర్ చేయండి',
      closeBtn: 'మూసివేయి'
    }
  }[lang];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full my-6 overflow-hidden border border-slate-200">
        
        {/* Modal Top Bar */}
        <div className="p-4 bg-slate-950 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-red-600/20 text-red-500 flex items-center justify-center font-bold text-xs">
              WO
            </div>
            <div>
              <h3 className="text-sm font-bold font-display text-white">
                {t.voucherTitle}
              </h3>
              <p className="text-[11px] text-slate-400">
                {booking.bookingId} · Way Ora Journeys
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Voucher Paper */}
        <div className="p-6 space-y-5 print:p-0">
          
          <div className="border border-slate-300 rounded-xl p-5 bg-white space-y-4 shadow-sm print:border-none print:shadow-none">
            
            {/* Header: Brand & Voucher No */}
            <div className="flex items-start justify-between border-b border-slate-200 pb-4">
              <div className="space-y-1">
                <WayOraLogo className="h-10" />
                <p className="text-[10px] text-slate-500 font-medium">
                  Hotline: {settings.phone} · Support: {settings.email}
                </p>
              </div>
              <div className="text-right space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  {t.bookingRef}
                </span>
                <span className="font-mono text-base font-black text-red-600 block">
                  {booking.bookingId}
                </span>
                <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                  booking.status === 'confirmed' 
                    ? 'bg-emerald-100 text-emerald-800' 
                    : 'bg-amber-100 text-amber-800'
                }`}>
                  {booking.status}
                </span>
              </div>
            </div>

            {/* Passenger & Vehicle Info */}
            <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3.5 rounded-xl border border-slate-100">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">{t.passenger}</span>
                <span className="font-bold text-slate-900 block">{booking.name}</span>
                <span className="font-mono text-slate-600">{booking.phone}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">{t.vehicle}</span>
                <span className="font-bold text-slate-900 block">{booking.vehicleName}</span>
                <span className="text-slate-500 text-[11px]">{vehicle.models} ({booking.passengerCount} Passengers)</span>
              </div>
            </div>

            {/* Journey Details */}
            <div className="space-y-2 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 bg-white border border-slate-200 rounded-lg">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-red-600" /> {t.pickup}
                  </span>
                  <p className="font-medium text-slate-900 mt-0.5">{booking.pickupLocation}</p>
                </div>
                <div className="p-3 bg-white border border-slate-200 rounded-lg">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-emerald-600" /> {t.destination}
                  </span>
                  <p className="font-medium text-slate-900 mt-0.5">{booking.dropLocation}</p>
                </div>
              </div>

              <div className="p-3 bg-white border border-slate-200 rounded-lg flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Departure Date & Time:</span>
                  <span className="font-bold text-slate-900">{booking.pickupDate} at {booking.pickupTime}</span>
                </div>
                {booking.returnDate && (
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Return Date:</span>
                    <span className="font-bold text-slate-900">{booking.returnDate}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Financials & 25% Advance Slip */}
            <div className="p-4 bg-slate-950 text-white rounded-xl space-y-2.5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs text-slate-300 font-semibold">{t.totalFare}</span>
                <span className="font-mono text-base font-black text-white">
                  ₹{booking.estimatedFare.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="text-amber-400 font-bold">{t.advance25} (25%):</span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                    isAdvancePaid ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-300'
                  }`}>
                    {isAdvancePaid ? `✓ ${t.advancePaidTag}` : t.advancePendingTag}
                  </span>
                </div>
                <span className="font-mono font-bold text-amber-400">
                  ₹{advanceAmount.toLocaleString('en-IN')}
                </span>
              </div>

              {booking.transactionId && (
                <div className="text-[11px] text-slate-400 font-mono flex items-center justify-between pt-1">
                  <span>Transaction UTR:</span>
                  <span className="text-emerald-400 font-semibold">{booking.transactionId}</span>
                </div>
              )}

              <div className="flex items-center justify-between text-xs border-t border-slate-800 pt-2 text-slate-300">
                <span>{t.balance75}:</span>
                <span className="font-mono font-bold text-white">
                  ₹{remainingAmount.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Trip Photo Preview if present */}
            {booking.tripPhotoUrl && (
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Trip Memory / Destination Photo:</span>
                <img 
                  src={booking.tripPhotoUrl} 
                  alt="Trip Memory" 
                  className="w-full h-36 object-cover rounded-xl border border-slate-200"
                />
              </div>
            )}

            {/* Terms and driver dispatch notice */}
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-[11px] flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <span>{t.driverNotice}</span>
            </div>

          </div>

          {/* Action Buttons */}
          <div className="space-y-2 no-print">
            {!isAdvancePaid && onPayAdvance && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onPayAdvance(booking);
                }}
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2"
              >
                <CreditCard className="w-4 h-4" />
                <span>{t.payAdvanceBtn} (₹{advanceAmount.toLocaleString('en-IN')})</span>
              </button>
            )}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={handlePrint}
                className="flex-1 py-2.5 px-3 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-800 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>{t.printBtn}</span>
              </button>

              <button
                type="button"
                onClick={handleShareWhatsApp}
                className="flex-1 py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>{t.shareWhatsApp}</span>
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-2 text-center text-xs text-slate-500 hover:text-slate-800 font-medium"
            >
              {t.closeBtn}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
