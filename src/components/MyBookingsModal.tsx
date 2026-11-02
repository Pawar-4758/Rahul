import React, { useState } from 'react';
import { 
  X, Calendar, MapPin, Car, Phone, User, CheckCircle2, 
  Clock, AlertCircle, FileText, Download, Printer, Camera, 
  CreditCard, Search, ChevronRight, MessageCircle, ArrowRight
} from 'lucide-react';
import { useTravelStore } from '../context/TravelStoreContext';
import { BookingDetails } from '../types';

interface MyBookingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'en' | 'te';
  onViewVoucher: (booking: BookingDetails) => void;
  onPayAdvance: (booking: BookingDetails) => void;
}

export const MyBookingsModal: React.FC<MyBookingsModalProps> = ({
  isOpen,
  onClose,
  lang,
  onViewVoucher,
  onPayAdvance
}) => {
  const { bookings, settings, updateBookingPhoto, isAdmin } = useTravelStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'confirmed' | 'pending'>('all');
  const [photoUploadingId, setPhotoUploadingId] = useState<string | null>(null);

  if (!isOpen) return null;

  const filteredBookings = bookings.filter(b => {
    const matchesFilter = activeFilter === 'all' || b.status === activeFilter;
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch = !query || 
      b.bookingId.toLowerCase().includes(query) ||
      b.name.toLowerCase().includes(query) ||
      b.phone.includes(query) ||
      b.pickupLocation.toLowerCase().includes(query) ||
      b.dropLocation.toLowerCase().includes(query);
    return matchesFilter && matchesSearch;
  });

  const handlePhotoUpload = (bookingId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        updateBookingPhoto(bookingId, result);
        setPhotoUploadingId(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const t = {
    en: {
      modalTitle: 'My Travel Bookings & Itineraries',
      subtitle: 'View upcoming trips, 25% advance payment status, and download travel vouchers',
      searchPlaceholder: 'Search by Booking ID, Phone, or City...',
      all: 'All Trips',
      confirmed: 'Confirmed',
      pending: 'Pending',
      noBookings: 'No bookings found matching your search.',
      viewVoucher: 'View Travel Voucher',
      payAdvance: 'Pay 25% Advance Online',
      advancePaid: '25% Advance Paid',
      balanceDue: 'Balance to Driver',
      totalFare: 'Total Fare',
      uploadPhoto: 'Add Trip Photo',
      photoAttached: 'Trip Photo Added',
      contactSupport: 'Trip Assistance'
    },
    te: {
      modalTitle: 'నా బుకింగ్స్ & ప్రయాణ వివరాలు',
      subtitle: 'మీ గత మరియు రాబోయే ట్రిప్పులు, 25% అడ్వాన్స్ పేమెంట్ స్థితి మరియు రశీదులను ఇక్కడ చూడండి',
      searchPlaceholder: 'బుకింగ్ ఐడీ, ఫోన్ నంబర్ లేదా నగరం ద్వారా వెతకండి...',
      all: 'అన్ని ట్రిప్స్',
      confirmed: 'కన్ఫర్మ్ అయినవి',
      pending: 'పెండింగ్',
      noBookings: 'ఎలాంటి బుకింగ్స్ లభించలేదు.',
      viewVoucher: 'వోచర్ / రశీదు చూడండి',
      payAdvance: '25% అడ్వాన్స్ ఆన్‌లైన్ పేమెంట్',
      advancePaid: '25% అడ్వాన్స్ చెల్లించబడింది',
      balanceDue: 'డ్రైవర్‌కు ఇవ్వవలసిన మిగిలిన మొత్తం',
      totalFare: 'మొత్తం ఛార్జ్',
      uploadPhoto: 'ట్రిప్ ఫోటో జోడించండి',
      photoAttached: 'ట్రిప్ ఫోటో ఉంది',
      contactSupport: 'సహాయం కోసం సంప్రదించండి'
    }
  }[lang];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="p-5 sm:p-6 bg-slate-950 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-600/20 text-red-500 flex items-center justify-center font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-display text-white">
                {t.modalTitle}
              </h3>
              <p className="text-xs text-slate-400">
                {t.subtitle}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div className="flex items-center gap-1.5 self-start sm:self-auto">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeFilter === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.all} ({bookings.length})
            </button>
            <button
              onClick={() => setActiveFilter('confirmed')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeFilter === 'confirmed'
                  ? 'bg-slate-900 text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.confirmed} ({bookings.filter(b => b.status === 'confirmed').length})
            </button>
            <button
              onClick={() => setActiveFilter('pending')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeFilter === 'pending'
                  ? 'bg-slate-900 text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.pending} ({bookings.filter(b => b.status === 'pending').length})
            </button>
          </div>
        </div>

        {/* Bookings List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {filteredBookings.length === 0 ? (
            <div className="py-16 text-center text-slate-500 space-y-3">
              <Car className="w-12 h-12 text-slate-300 mx-auto" />
              <p className="text-sm font-medium">{t.noBookings}</p>
            </div>
          ) : (
            filteredBookings.map((booking) => {
              const isAdvancePaid = booking.paymentStatus === 'advance_paid';
              const advanceReq = booking.advanceAmount || Math.round(booking.estimatedFare * 0.25);
              const balanceRemaining = booking.remainingAmount || (booking.estimatedFare - advanceReq);

              return (
                <div
                  key={booking.bookingId}
                  className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden p-5 sm:p-6 space-y-4"
                >
                  {/* Top Bar of card */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-black text-slate-900 bg-slate-100 px-2.5 py-1 rounded-md">
                        {booking.bookingId}
                      </span>
                      <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                        {booking.tripType.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                        booking.status === 'confirmed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : booking.status === 'pending'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-800'
                      }`}>
                        {booking.status === 'confirmed' && <CheckCircle2 className="w-3.5 h-3.5" />}
                        {booking.status.toUpperCase()}
                      </span>

                      {/* Payment Status Badge */}
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                        isAdvancePaid
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}>
                        {isAdvancePaid ? `✓ ${t.advancePaid}` : 'Advance Pending'}
                      </span>
                    </div>
                  </div>

                  {/* Route & Vehicle details */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    
                    {/* Origin -> Destination */}
                    <div className="space-y-1">
                      <span className="text-[10px] text-slate-400 uppercase font-bold">Route:</span>
                      <div className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                        <span className="truncate">{booking.pickupLocation.split('(')[0]}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-red-600 shrink-0" />
                        <span className="truncate">{booking.dropLocation}</span>
                      </div>
                      <div className="text-slate-500 font-mono text-[11px] flex items-center gap-2 pt-0.5">
                        <span>📅 {booking.pickupDate} ({booking.pickupTime})</span>
                        {booking.returnDate && <span>🔄 {booking.returnDate}</span>}
                      </div>
                    </div>

                    {/* Car & Passenger */}
                    <div className="space-y-1">
                      <span className="text-[10px] text-slate-400 uppercase font-bold">Assigned Cab:</span>
                      <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                        <Car className="w-4 h-4 text-slate-500" />
                        <span>{booking.vehicleName}</span>
                      </div>
                      <div className="text-slate-500 text-[11px]">
                        👤 {booking.name} · 📞 {booking.phone} ({booking.passengerCount} Passengers)
                      </div>
                    </div>

                    {/* Fare & 25% Advance Breakdown */}
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex flex-col justify-between">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">{t.totalFare}:</span>
                        <span className="font-mono font-black text-slate-900 text-sm">
                          ₹{booking.estimatedFare.toLocaleString('en-IN')}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-emerald-700 font-semibold pt-1">
                        <span>25% Advance:</span>
                        <span className="font-mono">₹{advanceReq.toLocaleString('en-IN')}</span>
                      </div>

                      <div className="flex items-center justify-between text-slate-600 text-[11px] pt-1 border-t border-slate-200/60 mt-1">
                        <span>{t.balanceDue}:</span>
                        <span className="font-mono font-bold text-slate-800">
                          ₹{balanceRemaining.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>

                  </div>

                  {/* Trip Photo Preview if attached */}
                  {booking.tripPhotoUrl && (
                    <div className="flex items-center gap-3 p-2 bg-slate-50 rounded-xl border border-slate-200">
                      <img 
                        src={booking.tripPhotoUrl} 
                        alt="Trip Photo" 
                        className="w-16 h-12 object-cover rounded-lg shrink-0 border"
                      />
                      <div className="text-xs">
                        <span className="font-bold text-slate-900 block">Trip Memory Photo Attached</span>
                        <span className="text-[11px] text-slate-500">Visible on your official travel voucher</span>
                      </div>
                    </div>
                  )}

                  {/* Actions Footer on card */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
                    
                    {/* Left: Add Trip photo button */}
                    <div className="flex items-center gap-2">
                      <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors">
                        <Camera className="w-3.5 h-3.5 text-slate-500" />
                        <span>{booking.tripPhotoUrl ? t.photoAttached : t.uploadPhoto}</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handlePhotoUpload(booking.bookingId, e)}
                        />
                      </label>
                    </div>

                    {/* Right: View Voucher, Send to Driver & Online Payment */}
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          const slip = 
                            `🚗 *WAY ORA JOURNEYS - TRIP DUTY SLIP* 🚗\n` +
                            `━━━━━━━━━━━━━━━━━━━━\n` +
                            `📌 *Booking ID:* #${booking.bookingId}\n` +
                            `📍 *Pickup:* ${booking.pickupLocation}\n` +
                            `🏁 *Drop:* ${booking.dropLocation}\n` +
                            `📅 *Date & Time:* ${booking.pickupDate} at ${booking.pickupTime}\n` +
                            `👤 *Passenger:* ${booking.name} (📞 ${booking.phone})\n` +
                            `🚘 *Vehicle:* ${booking.vehicleName}\n` +
                            `💰 *Total Fare:* ₹${booking.estimatedFare.toLocaleString('en-IN')}\n` +
                            `✅ *25% Advance Paid Online:* ₹${booking.advanceAmount.toLocaleString('en-IN')}\n` +
                            `💵 *CASH TO COLLECT ON TRIP:* ₹${booking.remainingAmount.toLocaleString('en-IN')}\n` +
                            `━━━━━━━━━━━━━━━━━━━━\n` +
                            `Way Ora Journeys Helpline: ${settings.phone}`;
                          window.open(`https://wa.me/?text=${encodeURIComponent(slip)}`, '_blank');
                        }}
                        className="px-3 py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
                        title="Share booking duty slip to driver on WhatsApp"
                      >
                        <MessageCircle className="w-3.5 h-3.5 text-white" />
                        <span>{lang === 'en' ? 'Duty to Driver' : 'డ్రైవర్‌కు డ్యూటీ'}</span>
                      </button>

                      {!isAdvancePaid && (
                        <button
                          type="button"
                          onClick={() => onPayAdvance(booking)}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
                        >
                          <CreditCard className="w-3.5 h-3.5" />
                          <span>{t.payAdvance} (₹{advanceReq.toLocaleString('en-IN')})</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => onViewVoucher(booking)}
                        className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>{t.viewVoucher}</span>
                      </button>
                    </div>

                  </div>

                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
};
