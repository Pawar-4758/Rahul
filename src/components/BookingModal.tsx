import React, { useState } from 'react';
import { 
  X, CheckCircle2, MessageCircle, Printer, Car, 
  Calendar, MapPin, Clock, Phone, User, ShieldCheck, Download,
  CreditCard, Camera, Sparkles
} from 'lucide-react';
import { BookingDetails, TripType, Vehicle } from '../types';
import { useTravelStore } from '../context/TravelStoreContext';

interface BookingModalProps {
  lang: 'en' | 'te';
  isOpen: boolean;
  onClose: () => void;
  initialData: {
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
    packageTitle?: string;
    advanceAmount?: number;
    tripPhotoUrl?: string;
  };
  onOpenOnlinePayment?: (booking: BookingDetails) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  lang,
  isOpen,
  onClose,
  initialData,
  onOpenOnlinePayment
}) => {
  const { vehicles, settings, addBooking } = useTravelStore();
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [doorstepAddress, setDoorstepAddress] = useState('');
  const [passengerCount, setPassengerCount] = useState(2);
  const [specialRequests, setSpecialRequests] = useState('');
  const [tripPhotoUrl, setTripPhotoUrl] = useState(initialData.tripPhotoUrl || '');
  const [confirmedBooking, setConfirmedBooking] = useState<BookingDetails | null>(null);

  if (!isOpen) return null;

  const vehicle = vehicles.find(v => v.id === initialData.vehicleId) || vehicles[0];
  const advanceAmount = initialData.advanceAmount || Math.round(initialData.estimatedFare * 0.25);
  const remainingAmount = initialData.estimatedFare - advanceAmount;

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTripPhotoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerPhone || customerPhone.length < 10) {
      alert(lang === 'en' ? 'Please enter a valid 10-digit mobile number' : 'దయచేసి సరైన 10 అంకెల మొబైల్ నంబర్ నమోదు చేయండి');
      return;
    }

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const bookingId = `WOJ-${new Date().getFullYear()}-${randomSuffix}`;

    const booking: BookingDetails = {
      bookingId,
      tripType: initialData.tripType,
      pickupLocation: doorstepAddress ? `${initialData.pickupLocation} (${doorstepAddress})` : initialData.pickupLocation,
      dropLocation: initialData.dropLocation,
      pickupDate: initialData.pickupDate,
      pickupTime: initialData.pickupTime,
      returnDate: initialData.returnDate,
      vehicleId: vehicle.id,
      vehicleName: vehicle.name,
      passengerCount,
      name: customerName,
      phone: customerPhone,
      email: customerEmail,
      specialRequests,
      estimatedKm: initialData.estimatedKm,
      estimatedFare: initialData.estimatedFare,
      driverAllowance: initialData.driverAllowance,
      advanceAmount,
      remainingAmount,
      paymentStatus: 'pending',
      tripPhotoUrl,
      bookingTime: new Date().toLocaleTimeString(),
      createdAt: new Date().toISOString(),
      status: 'confirmed'
    };

    addBooking(booking);
    setConfirmedBooking(booking);
  };

  const handleSendToWhatsApp = () => {
    if (!confirmedBooking) return;
    const cleanNumber = settings.whatsapp.replace(/\D/g, '');
    const msg = encodeURIComponent(
      `*WAY ORA JOURNEYS - TRIP BOOKING REQUEST*\n` +
      `Booking ID: ${confirmedBooking.bookingId}\n\n` +
      `*Customer:* ${confirmedBooking.name} (${confirmedBooking.phone})\n` +
      `*Trip Type:* ${confirmedBooking.tripType.toUpperCase()}\n` +
      `*Pickup:* ${confirmedBooking.pickupLocation}\n` +
      `*Destination:* ${confirmedBooking.dropLocation}\n` +
      `*Date & Time:* ${confirmedBooking.pickupDate} at ${confirmedBooking.pickupTime}\n` +
      (confirmedBooking.returnDate ? `*Return Date:* ${confirmedBooking.returnDate}\n` : '') +
      `*Vehicle:* ${confirmedBooking.vehicleName} (${vehicle.models})\n` +
      `*Passengers:* ${confirmedBooking.passengerCount}\n` +
      `*Total Fare:* ₹${confirmedBooking.estimatedFare.toLocaleString('en-IN')}\n` +
      `*25% Advance Amount:* ₹${confirmedBooking.advanceAmount.toLocaleString('en-IN')}\n` +
      `*Balance on Trip:* ₹${confirmedBooking.remainingAmount.toLocaleString('en-IN')}\n` +
      (confirmedBooking.specialRequests ? `*Special Notes:* ${confirmedBooking.specialRequests}\n` : '') +
      `\nPlease assign driver and share bank UPI details for 25% advance confirmation.`
    );
    window.open(`https://wa.me/${cleanNumber}?text=${msg}`, '_blank');
  };

  const handlePrint = () => {
    window.print();
  };

  const t = {
    en: {
      modalTitle: 'Complete Your Car Trip Reservation',
      tripSummary: 'Trip Summary',
      passengers: 'Passengers',
      yourName: 'Full Name',
      phone: 'Mobile Number (10 Digits)',
      email: 'Email Address (Optional)',
      address: 'Doorstep Pickup Address / Flat / Landmark',
      notes: 'Special Requests (e.g. child seat, elderly passenger, extra luggage)',
      attachTripPhoto: 'Attach Trip/Destination Photo (Optional)',
      confirmBtn: 'Confirm & View Booking Voucher',
      confirmedTitle: 'Booking Request Confirmed!',
      confirmedDesc: 'Your trip has been registered. You can pay 25% advance online to lock the cab, or pay directly via WhatsApp.',
      bookingRef: 'Booking Reference ID',
      sendWhatsApp: 'Send Booking to WhatsApp Desk',
      payAdvanceBtn: 'Pay 25% Advance Online',
      printVoucher: 'Print / Save Travel Voucher',
      close: 'Close Window',
      totalFareLabel: 'Total Fare:',
      advanceDueLabel: '25% Advance to Lock Cab:',
      balanceDueLabel: '75% Balance on Trip:',
      importantNote: 'Chauffeur and car registration number will be dispatched to your mobile number via SMS and WhatsApp 2 hours prior to journey.'
    },
    te: {
      modalTitle: 'మీ కారు ప్రయాణ వివరాలు నమోదు చేయండి',
      tripSummary: 'ప్రయాణ వివరాలు',
      passengers: 'ప్రయాణికుల సంఖ్య',
      yourName: 'పూర్తి పేరు',
      phone: 'మొబైల్ నంబర్ (10 అంకెలు)',
      email: 'ఈమెయిల్ (ఆప్షనల్)',
      address: 'మీ ఇంటి పికప్ అడ్రస్ / ల్యాండ్‌మార్క్',
      notes: 'ప్రత్యేక అవసరాలు (ఉదా. పిల్లల సీటు, ఎక్కువ లగేజ్ మొదలైనవి)',
      attachTripPhoto: 'ట్రిప్/గమ్యస్థాన ఫోటో జోడించండి (ఆప్షనల్)',
      confirmBtn: 'ధృవీకరించి బుకింగ్ రశీదు పొందండి',
      confirmedTitle: 'మీ బుకింగ్ విజయవంతంగా నమోదైంది!',
      confirmedDesc: 'మీ ట్రిప్ రికార్డ్ చేయబడింది. కారును లాక్ చేసుకోవడానికి 25% అడ్వాన్స్ ఆన్‌లైన్‌లో లేదా వాట్సాప్ ద్వారా చెల్లించవచ్చు.',
      bookingRef: 'బుకింగ్ ఐడీ (Booking ID)',
      sendWhatsApp: 'వాట్సాప్‌కు వివరాలు పంపండి',
      payAdvanceBtn: '25% అడ్వాన్స్ ఆన్‌లైన్ పేమెంట్',
      printVoucher: 'రశీదు ప్రింట్ / సేవ్ చేయండి',
      close: 'మూసివేయి',
      totalFareLabel: 'మొత్తం ఛార్జ్:',
      advanceDueLabel: '25% అడ్వాన్స్ మొత్తం:',
      balanceDueLabel: 'ప్రయాణంలో చెల్లించవలసిన మిగిలిన 75%:',
      importantNote: 'ప్రయాణ సమయానికి 2 గంటల ముందు డ్రైవర్ పేరు, ఫోన్ నంబర్ మరియు కారు నంబర్ మీ మొబైల్‌కు వస్తాయి.'
    }
  }[lang];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full my-6 overflow-hidden border border-slate-200">
        
        {/* Modal Header */}
        <div className="p-5 bg-slate-950 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-red-600/20 text-red-500 flex items-center justify-center font-bold text-sm">
              WO
            </div>
            <div>
              <h3 className="text-base font-bold font-display text-white">
                {confirmedBooking ? t.confirmedTitle : t.modalTitle}
              </h3>
              <p className="text-[11px] text-slate-400">
                Way Ora Journeys · {vehicle.name}
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

        {/* Modal Body */}
        {!confirmedBooking ? (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            
            {/* Quick Trip Summary & 25% Advance Breakdown */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-800 font-semibold">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-red-600" />
                  {initialData.pickupLocation} → {initialData.dropLocation}
                </span>
                <span className="font-mono text-slate-900 font-bold">
                  {initialData.packageTitle || `${initialData.estimatedKm} km`}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200">
                <div className="p-2 bg-white rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">{t.totalFareLabel}</span>
                  <span className="text-base font-black font-mono text-slate-900">
                    ₹{initialData.estimatedFare.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="p-2 bg-emerald-50 rounded-lg border border-emerald-200">
                  <span className="text-[10px] text-emerald-800 uppercase font-bold block">{t.advanceDueLabel}</span>
                  <span className="text-base font-black font-mono text-emerald-700">
                    ₹{advanceAmount.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[10px] text-slate-500 block">
                    Bal: ₹{remainingAmount.toLocaleString('en-IN')} on trip
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4 text-slate-500 pt-1 text-[11px]">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  {initialData.pickupDate} ({initialData.pickupTime})
                </span>
                <span className="flex items-center gap-1">
                  <Car className="w-3.5 h-3.5 text-slate-400" />
                  {vehicle.name}
                </span>
              </div>
            </div>

            {/* Inputs */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  {t.yourName} *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Ramesh Kumar"
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    {t.phone} *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      placeholder="9876543210"
                      className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    {t.passengers}
                  </label>
                  <select
                    value={passengerCount}
                    onChange={(e) => setPassengerCount(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500 font-medium"
                  >
                    {[...Array(vehicle.seats)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1} {i === 0 ? 'Passenger' : 'Passengers'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  {t.address}
                </label>
                <input
                  type="text"
                  value={doorstepAddress}
                  onChange={(e) => setDoorstepAddress(e.target.value)}
                  placeholder="e.g. Flat 302, Green Meadows Apts, Near Metro Station"
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              {/* Trip Photo Upload */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5 text-xs">
                <label className="font-bold text-slate-700 flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5 text-red-600" />
                  <span>{t.attachTripPhoto}</span>
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="w-full text-xs text-slate-500 file:mr-2 file:py-1 file:px-2.5 file:rounded file:border-0 file:text-[11px] file:bg-slate-900 file:text-white"
                />
                {tripPhotoUrl && (
                  <div className="flex items-center gap-2 pt-1 text-[11px] text-emerald-700">
                    <span>✓ Trip photo attached for travel voucher</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  {t.notes}
                </label>
                <textarea
                  rows={2}
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  placeholder="e.g. Need child seat, carrying extra luggage, elderly passenger assistance..."
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md active:scale-98 flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{t.confirmBtn}</span>
              </button>
            </div>

          </form>
        ) : (
          /* Confirmation & Official Voucher View */
          <div className="p-6 space-y-5">
            
            <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
              <div>
                <div className="text-sm font-bold">
                  {t.confirmedTitle}
                </div>
                <div className="text-xs text-emerald-800 mt-0.5">
                  {t.confirmedDesc}
                </div>
              </div>
            </div>

            {/* Official Travel Voucher Card */}
            <div className="border border-slate-300 rounded-xl p-5 bg-white space-y-4 shadow-sm print-area">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div>
                  <div className="text-lg font-black text-slate-900 font-display">
                    Way Ora Journeys
                  </div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider">
                    Official Travel Voucher & 25% Advance Slip
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-slate-500 uppercase font-semibold">
                    {t.bookingRef}
                  </div>
                  <div className="text-sm font-mono font-bold text-red-600">
                    {confirmedBooking.bookingId}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Passenger:</span>
                  <span className="font-semibold text-slate-900">{confirmedBooking.name}</span>
                  <span className="block text-slate-600 font-mono">{confirmedBooking.phone}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Vehicle:</span>
                  <span className="font-semibold text-slate-900">{confirmedBooking.vehicleName}</span>
                  <span className="block text-slate-500">{vehicle.models}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Pickup:</span>
                  <span className="text-slate-800">{confirmedBooking.pickupLocation}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Destination:</span>
                  <span className="text-slate-800">{confirmedBooking.dropLocation}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Date & Time:</span>
                  <span className="font-medium text-slate-900">{confirmedBooking.pickupDate} at {confirmedBooking.pickupTime}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Total Fare:</span>
                  <span className="text-sm font-bold font-mono text-slate-900">
                    ₹{confirmedBooking.estimatedFare.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* 25% Advance & Remaining Balance Strip */}
              <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-lg flex items-center justify-between text-xs font-mono">
                <div>
                  <span className="text-[10px] uppercase font-bold text-emerald-800 block">25% Advance Required:</span>
                  <span className="font-black text-emerald-700 text-sm">₹{confirmedBooking.advanceAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-600 block">Remaining on Trip:</span>
                  <span className="font-bold text-slate-900">₹{confirmedBooking.remainingAmount.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Trip Photo preview on voucher */}
              {confirmedBooking.tripPhotoUrl && (
                <div className="pt-2">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Attached Trip Photo:</span>
                  <img 
                    src={confirmedBooking.tripPhotoUrl} 
                    alt="Trip" 
                    className="w-full h-32 object-cover rounded-lg border border-slate-200"
                  />
                </div>
              )}

              <div className="p-3 bg-slate-50 rounded-lg text-[11px] text-slate-600 border border-slate-100 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{t.importantNote}</span>
              </div>
            </div>

            {/* Action Buttons: Pay Advance, WhatsApp & Print */}
            <div className="space-y-2 pt-1">
              
              {/* Pay 25% Advance Button */}
              {onOpenOnlinePayment && (
                <button
                  type="button"
                  onClick={() => {
                    const b = confirmedBooking;
                    onClose();
                    onOpenOnlinePayment(b);
                  }}
                  className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>{t.payAdvanceBtn} (₹{confirmedBooking.advanceAmount.toLocaleString('en-IN')})</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleSendToWhatsApp}
                className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>{t.sendWhatsApp}</span>
              </button>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="flex-1 py-2 px-3 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>{t.printVoucher}</span>
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
                >
                  {t.close}
                </button>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
