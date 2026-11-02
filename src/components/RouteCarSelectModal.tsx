import React, { useState } from 'react';
import { 
  X, ArrowRight, ShieldCheck, CheckCircle2, 
  Clock, MapPin, Calendar, Phone, User, CreditCard, 
  QrCode, Sparkles, ChevronRight, Tag, Edit3, Upload, 
  Image as ImageIcon, Check, Percent, Trash2, Crosshair
} from 'lucide-react';
import { useTravelStore } from '../context/TravelStoreContext';
import { Vehicle, BookingDetails, TripType } from '../types';

interface RouteCarSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'en' | 'te';
  route: {
    from: string;
    to: string;
    distanceKm: number;
    durationHours?: string;
    startingPrice?: number;
  } | null;
  initialTripType?: TripType;
  initialPickupDate?: string;
  initialPickupTime?: string;
  onBookingComplete: (booking: BookingDetails) => void;
}

// Fallback SVG Car Visual
const CarVisual: React.FC<{ category: string; className?: string }> = ({ category, className = "w-28 h-20" }) => {
  if (category === 'hatchback') {
    return (
      <svg viewBox="0 0 160 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <rect x="25" y="42" width="110" height="35" rx="10" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="2"/>
        <path d="M40 42L55 22H105L125 42H40Z" fill="#CBD5E1" stroke="#94A3B8" strokeWidth="2"/>
        <path d="M58 26H80V40H48L58 26Z" fill="#93C5FD" opacity="0.8"/>
        <path d="M85 26H102L116 40H85V26Z" fill="#93C5FD" opacity="0.8"/>
        <circle cx="48" cy="77" r="14" fill="#1E293B" stroke="#475569" strokeWidth="3"/>
        <circle cx="48" cy="77" r="6" fill="#94A3B8"/>
        <circle cx="112" cy="77" r="14" fill="#1E293B" stroke="#475569" strokeWidth="3"/>
        <circle cx="112" cy="77" r="6" fill="#94A3B8"/>
      </svg>
    );
  }
  if (category === 'sedan') {
    return (
      <svg viewBox="0 0 180 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <rect x="20" y="45" width="140" height="32" rx="8" fill="#F1F5F9" stroke="#94A3B8" strokeWidth="2"/>
        <path d="M48 45L65 24H125L145 45H48Z" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="2"/>
        <path d="M68 28H92V43H56L68 28Z" fill="#93C5FD" opacity="0.85"/>
        <path d="M96 28H122L136 43H96V28Z" fill="#93C5FD" opacity="0.85"/>
        <circle cx="50" cy="77" r="14" fill="#1E293B" stroke="#475569" strokeWidth="3"/>
        <circle cx="50" cy="77" r="6" fill="#CBD5E1"/>
        <circle cx="130" cy="77" r="14" fill="#1E293B" stroke="#475569" strokeWidth="3"/>
        <circle cx="130" cy="77" r="6" fill="#CBD5E1"/>
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 190 105" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect x="20" y="42" width="150" height="38" rx="10" fill="#F8FAFC" stroke="#64748B" strokeWidth="2"/>
      <path d="M42 42L60 18H148L160 42H42Z" fill="#E2E8F0" stroke="#64748B" strokeWidth="2"/>
      <circle cx="54" cy="80" r="16" fill="#0F172A" stroke="#475569" strokeWidth="4"/>
      <circle cx="138" cy="80" r="16" fill="#0F172A" stroke="#475569" strokeWidth="4"/>
    </svg>
  );
};

export const RouteCarSelectModal: React.FC<RouteCarSelectModalProps> = ({
  isOpen,
  onClose,
  lang,
  route,
  initialTripType = 'one_way',
  initialPickupDate,
  initialPickupTime,
  onBookingComplete
}) => {
  const { vehicles, settings, coupons, addBooking, updateVehicle, isAdmin } = useTravelStore();

  const [tripType, setTripType] = useState<TripType>(initialTripType);
  const [pickupDate, setPickupDate] = useState(
    initialPickupDate || new Date(Date.now() + 86400000).toISOString().split('T')[0]
  );
  const [pickupTime, setPickupTime] = useState(initialPickupTime || '06:00');
  const [returnDate, setReturnDate] = useState(
    new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0]
  );

  // Selection step: 'cars' -> 'details_and_payment'
  const [step, setStep] = useState<'cars' | 'details_and_payment'>('cars');
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle>(vehicles[0] || {} as Vehicle);

  // Customer form inputs
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [pickupAddress, setPickupAddress] = useState('');
  const [passengerCount, setPassengerCount] = useState(2);
  const [specialRequests, setSpecialRequests] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'upi_qr' | 'gpay' | 'phonepe' | 'card'>('upi_qr');
  const [utrInput, setUtrInput] = useState('');
  const [tripPhoto, setTripPhoto] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Coupon / Promo Code State
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discountAmount: number; description: string } | null>(null);
  const [couponFeedback, setCouponFeedback] = useState<{ message: string; isError: boolean } | null>(null);

  // Owner Vehicle Edit Modal State
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [editForm, setEditForm] = useState<{
    name: string;
    models: string;
    ratePerKm: number;
    driverAllowancePerDay: number;
    imageUrl: string;
  }>({
    name: '',
    models: '',
    ratePerKm: 12,
    driverAllowancePerDay: 400,
    imageUrl: ''
  });

  if (!isOpen || !route) return null;

  // Calculate km based on one-way or round trip
  const multiplier = tripType === 'outstation_round' ? 2 : 1;
  const effectiveKm = route.distanceKm * multiplier;

  // Calculate base pricing before coupon
  const calculateBaseFare = (v: Vehicle) => {
    const minDayKm = tripType === 'outstation_round' ? v.minKmPerDay * 2 : Math.max(route.distanceKm, 200);
    const billableKm = Math.max(effectiveKm, minDayKm);
    const baseFare = billableKm * v.ratePerKm;
    const bata = tripType === 'outstation_round' ? v.driverAllowancePerDay * 2 : v.driverAllowancePerDay;
    const grossFare = baseFare + bata;
    const originalFare = Math.round(grossFare * 1.15); // Strikethrough comparison

    return { grossFare, billableKm, originalFare };
  };

  // Pricing with coupon discount
  const calculateFinalPricing = (v: Vehicle) => {
    const { grossFare, billableKm, originalFare } = calculateBaseFare(v);
    const discount = appliedCoupon ? appliedCoupon.discountAmount : 0;
    const totalFare = Math.max(grossFare - discount, 0);
    const advance25 = Math.round(totalFare * 0.25);
    const balance75 = totalFare - advance25;

    return { grossFare, totalFare, discount, advance25, balance75, originalFare, billableKm };
  };

  const handleSelectCar = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setStep('details_and_payment');
  };

  const [locatingAddress, setLocatingAddress] = useState(false);

  const handleGetCurrentLocationForAddress = () => {
    if (!navigator.geolocation) {
      alert(lang === 'en' ? 'Geolocation is not supported.' : 'మీ బ్రౌజర్‌లో జియోలొకేషన్ సపోర్ట్ లేదు.');
      return;
    }
    setLocatingAddress(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        let detected = 'Current Location, Hyderabad';
        if (latitude > 17.5 && latitude < 17.9 && longitude > 83.1 && longitude < 83.5) {
          detected = 'Current Location, Visakhapatnam';
        } else if (latitude > 16.3 && latitude < 16.7 && longitude > 80.4 && longitude < 80.9) {
          detected = 'Current Location, Vijayawada';
        } else if (latitude > 16.8 && latitude < 17.2 && longitude > 81.6 && longitude < 82.1) {
          detected = 'Current Location, Rajahmundry';
        } else if (latitude > 13.4 && latitude < 13.9 && longitude > 79.2 && longitude < 79.7) {
          detected = 'Current Location, Tirupati';
        } else {
          detected = `Current GPS Coordinates (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`;
        }
        setPickupAddress(detected);
        setLocatingAddress(false);
      },
      (err) => {
        console.warn('Geolocation error:', err);
        setPickupAddress('Doorstep Pickup (Current Location)');
        setLocatingAddress(false);
      },
      { timeout: 8000 }
    );
  };

  // Apply Coupon Logic with dynamic coupons and valid date check
  const handleApplyCoupon = (codeToApply?: string) => {
    const code = (codeToApply || couponInput).trim().toUpperCase();
    if (!code) return;

    const { grossFare } = calculateBaseFare(selectedVehicle);

    const coupon = coupons.find(c => c.code.toUpperCase() === code);
    if (!coupon) {
      setCouponFeedback({ 
        message: lang === 'en' ? `Invalid coupon "${code}". Try available coupons below.` : `చెల్లని కూపన్ "${code}". క్రింద ఉన్న కూపన్లు వాడండి.`, 
        isError: true 
      });
      return;
    }

    if (!coupon.isActive) {
      setCouponFeedback({ 
        message: lang === 'en' ? `Coupon "${code}" is currently disabled.` : `కూపన్ "${code}" ప్రస్తుతం అందుబాటులో లేదు.`, 
        isError: true 
      });
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    if (coupon.validUntil && coupon.validUntil < today) {
      setCouponFeedback({ 
        message: lang === 'en' ? `Coupon "${code}" expired on ${coupon.validUntil}.` : `కూపన్ "${code}" గడువు ${coupon.validUntil} తో ముగిసింది.`, 
        isError: true 
      });
      return;
    }

    if (coupon.minBookingAmount && grossFare < coupon.minBookingAmount) {
      setCouponFeedback({ 
        message: lang === 'en' 
          ? `Min. booking fare of ₹${coupon.minBookingAmount} required for ${code}.` 
          : `${code} కోసం కనీస బుకింగ్ మొత్తం ₹${coupon.minBookingAmount} ఉండాలి.`, 
        isError: true 
      });
      return;
    }

    let discount = 0;
    if (coupon.discountType === 'percentage') {
      discount = Math.round(grossFare * (coupon.discountValue / 100));
    } else {
      discount = Math.min(coupon.discountValue, Math.round(grossFare * 0.5));
    }

    setAppliedCoupon({ 
      code: coupon.code, 
      discountAmount: discount, 
      description: lang === 'en' ? coupon.description : (coupon.descriptionTe || coupon.description) 
    });
    setCouponFeedback({ 
      message: `🎉 ${coupon.code} applied! ₹${discount} saved`, 
      isError: false 
    });
    setCouponInput('');
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponFeedback(null);
  };

  // Trip Photo Upload
  const handleTripPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTripPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Open Vehicle Editor
  const handleOpenEditVehicle = (e: React.MouseEvent, v: Vehicle) => {
    e.stopPropagation();
    setEditingVehicle(v);
    setEditForm({
      name: v.name,
      models: v.models,
      ratePerKm: v.ratePerKm,
      driverAllowancePerDay: v.driverAllowancePerDay,
      imageUrl: v.imageUrl || ''
    });
  };

  const handleSaveVehicleEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingVehicle) return;

    updateVehicle(editingVehicle.id, {
      name: editForm.name,
      models: editForm.models,
      ratePerKm: Number(editForm.ratePerKm),
      driverAllowancePerDay: Number(editForm.driverAllowancePerDay),
      imageUrl: editForm.imageUrl
    });

    if (selectedVehicle.id === editingVehicle.id) {
      setSelectedVehicle({
        ...selectedVehicle,
        name: editForm.name,
        models: editForm.models,
        ratePerKm: Number(editForm.ratePerKm),
        driverAllowancePerDay: Number(editForm.driverAllowancePerDay),
        imageUrl: editForm.imageUrl
      });
    }

    setEditingVehicle(null);
  };

  const handleCarPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditForm(prev => ({ ...prev, imageUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Final Confirmation & Payment
  const handleConfirmAndPay = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerPhone || customerPhone.length < 10) {
      alert(lang === 'en' ? 'Please enter a valid 10-digit mobile number' : 'దయచేసి సరైన 10 అంకెల మొబైల్ నంబర్ నమోదు చేయండి');
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      const { totalFare, advance25, balance75 } = calculateFinalPricing(selectedVehicle);
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      const bookingId = `WOJ-${new Date().getFullYear()}-${randomSuffix}`;
      const generatedUtr = utrInput.trim() || `UPI-TXN-${Date.now().toString().slice(-6)}`;

      const newBooking: BookingDetails = {
        bookingId,
        tripType,
        pickupLocation: pickupAddress ? `${route.from} (${pickupAddress})` : route.from,
        dropLocation: route.to,
        pickupDate,
        pickupTime,
        returnDate: tripType === 'outstation_round' ? returnDate : undefined,
        vehicleId: selectedVehicle.id,
        vehicleName: selectedVehicle.models || selectedVehicle.name,
        passengerCount,
        name: customerName,
        phone: customerPhone,
        specialRequests: appliedCoupon ? `${specialRequests ? specialRequests + ' | ' : ''}Coupon Applied: ${appliedCoupon.code} (-₹${appliedCoupon.discountAmount})` : specialRequests,
        estimatedKm: effectiveKm,
        estimatedFare: totalFare,
        driverAllowance: selectedVehicle.driverAllowancePerDay,
        advanceAmount: advance25,
        remainingAmount: balance75,
        paymentStatus: 'advance_paid',
        paymentMethod: selectedPaymentMethod,
        transactionId: generatedUtr,
        tripPhotoUrl: tripPhoto,
        bookingTime: new Date().toLocaleTimeString(),
        createdAt: new Date().toISOString(),
        status: 'confirmed'
      };

      addBooking(newBooking);
      setIsProcessing(false);
      onClose();
      onBookingComplete(newBooking);
    }, 900);
  };

  const activePricing = calculateFinalPricing(selectedVehicle);
  const upiIntentUri = `upi://pay?pa=${encodeURIComponent(settings.upiId)}&pn=${encodeURIComponent(settings.companyName)}&am=${activePricing.advance25}&cu=INR&tn=${encodeURIComponent(`25% Advance for ${route.from} to ${route.to}`)}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(upiIntentUri)}`;

  const t = {
    en: {
      selectCarHeader: 'Select Car for Your Journey',
      modify: 'Change Route / Time',
      oneWay: 'One Way',
      roundTrip: 'Round Trip',
      zeroCost: 'Book with 25% Advance',
      freeCancel: 'Free Cancellations Upto 2 Hrs',
      support: '24x7 Customer Support',
      driverIncluded: 'Driver allowance included',
      kmsIncluded: 'kms included',
      postLimit: 'Post limit:',
      selectCarBtn: 'SELECT CAR',
      advance25Label: '25% Advance to Lock:',
      balanceLabel: 'Balance on Trip:',
      customerDetails: 'Passenger & Pickup Details',
      fullName: 'Passenger Name *',
      phone: 'Mobile Number (10 Digits) *',
      address: 'Doorstep Pickup Address / Flat / Landmark *',
      passengers: 'Passengers Count',
      notes: 'Special Notes / Luggage Assistance',
      payAdvanceTitle: 'Pay 25% Advance to Confirm Booking',
      totalFare: 'Total Trip Fare:',
      advanceNow: '25% Advance Payable Now:',
      remainingToDriver: '75% Payable directly to Chauffeur on Trip Completion',
      scanQr: 'Scan & Pay with Any UPI App',
      confirmPayBtn: 'Confirm & Pay 25% Advance',
      backToCars: '← Back to Cars Selection',
      tripPhotoLabel: 'Trip / Landmark / Luggage Photo (Optional)',
      couponTitle: 'Have a Coupon or Promo Code?',
      apply: 'APPLY',
      discountTag: 'Discount Applied:',
      editCarBtn: 'Edit Car / Name / Rate'
    },
    te: {
      selectCarHeader: 'మీ ప్రయాణానికి కారును ఎంచుకోండి',
      modify: 'తేదీ/సమయం మార్చండి',
      oneWay: 'వన్ వే',
      roundTrip: 'రౌండ్ ట్రిప్ (రాను-పోను)',
      zeroCost: '25% అడ్వాన్స్‌తో బుక్ చేయండి',
      freeCancel: '2 గంటల ముందు వరకు ఉచిత రద్దు',
      support: '24/7 కస్టమర్ సపోర్ట్',
      driverIncluded: 'డ్రైవర్ బత్తా కలిపి ఉంది',
      kmsIncluded: 'కి.మీ కలిపి ఉన్నాయి',
      postLimit: 'అదనపు కి.మీ కు:',
      selectCarBtn: 'కారు ఎంచుకోండి (SELECT CAR)',
      advance25Label: '25% అడ్వాన్స్ మొత్తం:',
      balanceLabel: 'ప్రయాణంలో ఇవ్వవలసినది:',
      customerDetails: 'ప్రయాణికుడి వివరాలు & పికప్ అడ్రస్',
      fullName: 'ప్రయాణికుడి పూర్తి పేరు *',
      phone: 'మొబైల్ నంబర్ (10 అంకెలు) *',
      address: 'మీ ఇంటి పికప్ అడ్రస్ / ల్యాండ్‌మార్క్ *',
      passengers: 'ప్రయాణికుల సంఖ్య',
      notes: 'ప్రత్యేక అవసరాలు / ఎక్కువ లగేజ్ వివరాలు',
      payAdvanceTitle: 'బుకింగ్ కన్ఫర్మ్ కోసం 25% అడ్వాన్స్ చెల్లించండి',
      totalFare: 'మొత్తం ట్రిప్ ఛార్జ్:',
      advanceNow: 'ఇప్పుడు చెల్లించవలసిన 25% అడ్వాన్స్:',
      remainingToDriver: 'మిగిలిన 75% ప్రయాణం పూర్తయ్యాక డ్రైవర్‌కు ఇవ్వవచ్చు',
      scanQr: 'ఏదైనా UPI యాప్‌తో QR స్కాన్ చేయండి',
      confirmPayBtn: 'ధృవీకరించి 25% అడ్వాన్స్ చెల్లించండి',
      backToCars: '← తిరిగి కార్ల జాబితాకు',
      tripPhotoLabel: 'ట్రిప్ / పికప్ ల్యాండ్‌మార్క్ ఫోటో (ఐచ్ఛికం)',
      couponTitle: 'కూపన్ లేదా ప్రోమో కోడ్ ఉందా?',
      apply: 'వర్తింపజేయండి (APPLY)',
      discountTag: 'డిస్కౌంట్ తగ్గించబడింది:',
      editCarBtn: 'కారు వివరాలు మార్చండి (Edit)'
    }
  }[lang];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-slate-100 rounded-2xl shadow-2xl max-w-4xl w-full my-4 overflow-hidden border border-slate-300 flex flex-col max-h-[94vh]">
        
        {/* Top Header matching Savaari Style */}
        <div className="bg-white border-b border-slate-200 p-4 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-slate-500">
                Way Ora Journeys &gt; <span className="text-slate-900 font-bold">{step === 'cars' ? 'Select Car' : 'Passenger Details & Payment'}</span>
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Route & Trip Header Card */}
          <div className="mt-3 bg-slate-50 p-3 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 font-display text-sm font-bold text-slate-900">
              <span>{route.from}</span>
              <ArrowRight className="w-4 h-4 text-red-600" />
              <span>{route.to}</span>
              <span className="text-slate-500 font-normal font-sans text-xs">({effectiveKm} km)</span>
            </div>

            {/* Trip Type Toggle */}
            <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200">
              <button
                type="button"
                onClick={() => setTripType('one_way')}
                className={`px-2.5 py-1 rounded text-xs font-bold transition-colors ${
                  tripType === 'one_way' ? 'bg-red-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t.oneWay}
              </button>
              <button
                type="button"
                onClick={() => setTripType('outstation_round')}
                className={`px-2.5 py-1 rounded text-xs font-bold transition-colors ${
                  tripType === 'outstation_round' ? 'bg-red-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t.roundTrip}
              </button>
            </div>

            {/* Pickup date & time preview */}
            <div className="flex items-center gap-2 font-mono text-xs text-slate-700">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>{pickupDate}</span>
              <Clock className="w-3.5 h-3.5 text-slate-400 ml-1" />
              <span>{pickupTime}</span>
            </div>
          </div>
        </div>

        {/* Feature Highlights Banner */}
        <div className="bg-sky-50 border-b border-sky-100 px-4 py-2 flex flex-wrap items-center justify-around gap-2 text-xs text-sky-950 font-medium shrink-0">
          <div className="flex items-center gap-1.5">
            <CreditCard className="w-4 h-4 text-emerald-600" />
            <span className="font-bold">{t.zeroCost}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-sky-700" />
            <span>{lang === 'en' ? 'Verified Driver & Sanitized AC Cab' : 'వెరిఫైడ్ డ్రైవర్ & పరిశుభ్రమైన ఏసీ కారు'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Phone className="w-4 h-4 text-slate-700" />
            <span>{t.support} ({settings.phone})</span>
          </div>
        </div>

        {/* STEP 1: CAR SELECTION LIST (With Realistic Car Photos & Edit Option) */}
        {step === 'cars' ? (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            
            {vehicles.map((v) => {
              const { grossFare, advance25, balance75, originalFare, billableKm } = calculateFinalPricing(v);

              return (
                <div
                  key={v.id}
                  className="bg-white rounded-2xl border border-slate-200 hover:border-red-500/40 hover:shadow-lg transition-all overflow-hidden p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-5 relative group"
                >
                  {/* Left: Car Realistic Photo & Specs */}
                  <div className="flex items-center gap-4 w-full md:w-auto">
                    
                    {/* Realistic Car Photo Container */}
                    <div className="w-32 sm:w-40 h-24 bg-white rounded-xl flex items-center justify-center p-1.5 border border-slate-200 shrink-0 overflow-hidden shadow-xs">
                      {v.imageUrl ? (
                        <img 
                          src={v.imageUrl} 
                          alt={v.models || v.name} 
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            // Fallback to visual if image link fails
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        <CarVisual category={v.category} className="w-full h-full object-contain" />
                      )}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-bold text-slate-900 font-display">
                          {v.models || v.name}
                        </h4>
                        <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                          ★ 4.8
                        </span>

                        {/* Owner Quick Edit Button */}
                        <button
                          type="button"
                          onClick={(e) => handleOpenEditVehicle(e, v)}
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-red-600 bg-slate-100 hover:bg-red-50 px-2 py-0.5 rounded transition-colors ml-1"
                          title="Edit vehicle name, models, rate, or photo"
                        >
                          <Edit3 className="w-3 h-3 text-red-500" />
                          <span>{t.editCarBtn}</span>
                        </button>
                      </div>

                      <div className="text-xs text-slate-500 font-medium">
                        {v.seats} Seater AC Cab · Clean & Sanitized · {v.name}
                      </div>

                      <div className="space-y-1 pt-1 text-xs text-slate-600">
                        <div className="flex items-center gap-1.5 text-slate-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{t.driverIncluded}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{billableKm} {t.kmsIncluded} | {t.postLimit} ₹{v.ratePerKm}/km</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right: Pricing & SELECT CAR Button */}
                  <div className="w-full md:w-auto flex md:flex-col items-center md:items-end justify-between gap-4 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                    
                    <div className="text-left md:text-right">
                      <div className="flex items-center md:justify-end gap-1.5 text-xs text-emerald-600 font-bold">
                        <span className="bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">15% OFF</span>
                        <span className="line-through text-slate-400 font-mono">₹{originalFare.toLocaleString('en-IN')}</span>
                      </div>
                      
                      <div className="text-2xl font-black text-slate-900 font-mono tracking-tight mt-0.5">
                        ₹{grossFare.toLocaleString('en-IN')}
                      </div>

                      {/* 25% Advance Highlight */}
                      <div className="mt-1 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-lg text-left md:text-right">
                        <span className="text-[10px] uppercase font-bold text-amber-800 block">
                          {t.advance25Label} <span className="text-sm font-black text-red-600 font-mono">₹{advance25.toLocaleString('en-IN')}</span>
                        </span>
                        <span className="text-[10px] text-slate-500 block">
                          {t.balanceLabel} ₹{balance75.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>

                    {/* SELECT CAR Button (styled like Savaari orange/red) */}
                    <button
                      type="button"
                      onClick={() => handleSelectCar(v)}
                      className="px-6 py-3 bg-red-600 hover:bg-red-700 active:scale-95 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shrink-0 flex items-center gap-2"
                    >
                      <span>{t.selectCarBtn}</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>

                  </div>

                </div>
              );
            })}

          </div>
        ) : (
          /* STEP 2: CUSTOMER DETAILS & 25% ADVANCE PAYMENT (WITH COUPONS & TRIP PHOTO) */
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            
            {/* Back Button & Selected Car Summary */}
            <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => setStep('cars')}
                className="text-xs font-bold text-slate-600 hover:text-red-600 flex items-center gap-1 transition-colors"
              >
                {t.backToCars}
              </button>

              <div className="flex items-center gap-3 text-xs">
                <span className="text-slate-500">Selected:</span>
                <span className="font-bold text-slate-900">{selectedVehicle.models || selectedVehicle.name}</span>
                <span className="font-mono font-black text-red-600">₹{activePricing.totalFare.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <form onSubmit={handleConfirmAndPay} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: Passenger & Pickup Details */}
              <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-slate-200 space-y-4">
                <h4 className="text-sm font-bold text-slate-900 border-b pb-2 flex items-center gap-2">
                  <User className="w-4 h-4 text-red-600" />
                  <span>{t.customerDetails}</span>
                </h4>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">{t.fullName}</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">{t.phone}</label>
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        placeholder="e.g. 9848012345"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value.replace(/\D/g, ''))}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-bold mb-1">{t.passengers}</label>
                      <select
                        value={passengerCount}
                        onChange={(e) => setPassengerCount(Number(e.target.value))}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      >
                        {[1, 2, 3, 4, 5, 6, 7].map(num => (
                          <option key={num} value={num}>{num} Passengers</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Pickup Date</label>
                      <input
                        type="date"
                        value={pickupDate}
                        onChange={(e) => setPickupDate(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Pickup Time</label>
                      <input
                        type="time"
                        value={pickupTime}
                        onChange={(e) => setPickupTime(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-slate-700 font-bold">{t.address}</label>
                      <button
                        type="button"
                        onClick={handleGetCurrentLocationForAddress}
                        disabled={locatingAddress}
                        className="text-[11px] font-semibold text-red-600 hover:text-red-700 flex items-center gap-1 transition-colors bg-red-50 hover:bg-red-100 px-2 py-0.5 rounded cursor-pointer"
                        title="Detect current GPS location"
                      >
                        <Crosshair className={`w-3 h-3 ${locatingAddress ? 'animate-spin text-red-600' : ''}`} />
                        <span>{locatingAddress ? (lang === 'en' ? 'Detecting...' : 'గుర్తిస్తోంది...') : (lang === 'en' ? 'Use Current Location' : 'కరెంట్ లొకేషన్')}</span>
                      </button>
                    </div>
                    <textarea
                      rows={2}
                      required
                      placeholder="e.g. Flat 302, Green Meadows, Road No 10, Banjara Hills..."
                      value={pickupAddress}
                      onChange={(e) => setPickupAddress(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>

                  {/* Trip Photo Upload Section */}
                  <div className="pt-1">
                    <label className="block text-slate-700 font-bold mb-1 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <ImageIcon className="w-3.5 h-3.5 text-red-600" />
                        <span>{t.tripPhotoLabel}</span>
                      </span>
                      {tripPhoto && (
                        <button
                          type="button"
                          onClick={() => setTripPhoto('')}
                          className="text-[10px] text-rose-600 hover:underline flex items-center gap-0.5"
                        >
                          <Trash2 className="w-3 h-3" /> Remove
                        </button>
                      )}
                    </label>

                    {!tripPhoto ? (
                      <label className="flex items-center justify-center gap-2 p-3 border-2 border-dashed border-slate-300 hover:border-red-500 rounded-xl cursor-pointer bg-slate-50 transition-colors">
                        <Upload className="w-4 h-4 text-slate-500" />
                        <span className="text-slate-600 font-medium">Click to select trip photo or destination image</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleTripPhotoUpload}
                        />
                      </label>
                    ) : (
                      <div className="flex items-center gap-3 p-2 bg-slate-50 border border-slate-200 rounded-xl">
                        <img 
                          src={tripPhoto} 
                          alt="Trip Photo" 
                          className="w-16 h-12 object-cover rounded-lg border shadow-xs"
                        />
                        <div className="text-xs">
                          <span className="font-bold text-slate-900 block">Photo attached successfully</span>
                          <span className="text-[10px] text-slate-500">Will be printed on your official journey voucher</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">{t.notes}</label>
                    <input
                      type="text"
                      placeholder="e.g. Carrying extra luggage, traveling with parents..."
                      value={specialRequests}
                      onChange={(e) => setSpecialRequests(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                </div>

              </div>

              {/* Right Column: 25% Advance Payment Breakdown, Coupon & UPI QR */}
              <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200 space-y-4 flex flex-col justify-between">
                
                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-slate-900 border-b pb-2 flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-emerald-600" />
                    <span>{t.payAdvanceTitle}</span>
                  </h4>

                  {/* Coupon / Promo Code Section */}
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
                        <Tag className="w-3.5 h-3.5 text-red-600" />
                        <span>{t.couponTitle}</span>
                      </span>
                    </div>

                    {!appliedCoupon ? (
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-1.5">
                          <input
                            type="text"
                            value={couponInput}
                            onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                            placeholder="Enter Code (e.g. WAYORA10)"
                            className="flex-1 px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-mono font-bold uppercase focus:outline-none focus:ring-2 focus:ring-red-500"
                          />
                          <button
                            type="button"
                            onClick={() => handleApplyCoupon()}
                            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-colors"
                          >
                            {t.apply}
                          </button>
                        </div>

                        {/* Quick Dynamic Coupon Chips with Expiry Date & Days Remaining */}
                        <div className="pt-1.5 space-y-1">
                          <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
                            {lang === 'en' ? 'Available Offers & Validity:' : 'అందుబాటులో ఉన్న ఆఫర్లు & వ్యాలిడిటీ:'}
                          </span>
                          <div className="flex flex-wrap items-center gap-1.5">
                            {coupons
                              .filter(c => c.isActive)
                              .map(c => {
                                const todayStr = new Date().toISOString().split('T')[0];
                                const isExpired = Boolean(c.validUntil && c.validUntil < todayStr);
                                const daysLeft = c.validUntil 
                                  ? Math.max(0, Math.ceil((new Date(c.validUntil).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
                                  : null;

                                return (
                                  <button
                                    key={c.id || c.code}
                                    type="button"
                                    onClick={() => handleApplyCoupon(c.code)}
                                    disabled={isExpired}
                                    className={`text-[10px] px-2.5 py-1 rounded-lg border font-bold transition-all flex items-center gap-1 cursor-pointer ${
                                      isExpired
                                        ? 'bg-slate-100 text-slate-400 border-slate-200 line-through cursor-not-allowed'
                                        : 'bg-red-50/80 hover:bg-red-100 text-red-700 border-red-200 hover:border-red-300 shadow-2xs'
                                    }`}
                                    title={c.description}
                                  >
                                    <Tag className="w-2.5 h-2.5" />
                                    <span>{c.code}</span>
                                    <span className="text-slate-500 font-normal">
                                      ({c.discountType === 'percentage' ? `${c.discountValue}% OFF` : `₹${c.discountValue} OFF`})
                                    </span>
                                    {daysLeft !== null && (
                                      <span className={`text-[9px] px-1 py-0.2 rounded font-semibold ${daysLeft <= 3 ? 'bg-amber-100 text-amber-800' : 'bg-slate-200 text-slate-700'}`}>
                                        {daysLeft === 0 ? 'Last Day' : `${daysLeft}d left`}
                                      </span>
                                    )}
                                  </button>
                                );
                              })}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between p-2 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-900">
                        <div className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <div>
                            <span className="font-bold">{appliedCoupon.code}</span>
                            <span className="text-[11px] text-emerald-700 block">(-₹{appliedCoupon.discountAmount} Off applied)</span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={handleRemoveCoupon}
                          className="text-[11px] text-rose-600 hover:underline font-bold"
                        >
                          Remove
                        </button>
                      </div>
                    )}

                    {couponFeedback && (
                      <p className={`text-[11px] font-semibold ${couponFeedback.isError ? 'text-rose-600' : 'text-emerald-700'}`}>
                        {couponFeedback.message}
                      </p>
                    )}
                  </div>

                  {/* Payment Breakdown Box */}
                  <div className="bg-slate-900 text-white p-4 rounded-xl space-y-2 text-xs">
                    <div className="flex items-center justify-between text-slate-300">
                      <span>{t.totalFare}</span>
                      <span className="font-mono text-sm font-bold text-white">
                        ₹{activePricing.grossFare.toLocaleString('en-IN')}
                      </span>
                    </div>

                    {appliedCoupon && (
                      <div className="flex items-center justify-between text-emerald-400 font-semibold text-xs">
                        <span>{t.discountTag} ({appliedCoupon.code})</span>
                        <span className="font-mono">-₹{appliedCoupon.discountAmount.toLocaleString('en-IN')}</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-1 border-t border-slate-800 text-amber-400 font-bold">
                      <span>{t.advanceNow}</span>
                      <span className="font-mono text-lg font-black text-amber-300">
                        ₹{activePricing.advance25.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-400 pt-1">
                      {t.remainingToDriver} (₹{activePricing.balance75.toLocaleString('en-IN')})
                    </div>
                  </div>

                  {/* Payment Method Selector */}
                  <div className="space-y-2">
                    <label className="block text-[11px] font-bold uppercase text-slate-500">
                      Payment Mode (25% Advance):
                    </label>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <button
                        type="button"
                        onClick={() => setSelectedPaymentMethod('upi_qr')}
                        className={`p-2.5 rounded-lg border text-left flex items-center gap-2 transition-all ${
                          selectedPaymentMethod === 'upi_qr'
                            ? 'border-red-600 bg-red-50/50 text-red-950 font-bold ring-1 ring-red-600'
                            : 'border-slate-200 hover:border-slate-300 text-slate-700'
                        }`}
                      >
                        <QrCode className="w-4 h-4 text-red-600" />
                        <span>UPI QR Code</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedPaymentMethod('gpay')}
                        className={`p-2.5 rounded-lg border text-left flex items-center gap-2 transition-all ${
                          selectedPaymentMethod === 'gpay'
                            ? 'border-red-600 bg-red-50/50 text-red-950 font-bold ring-1 ring-red-600'
                            : 'border-slate-200 hover:border-slate-300 text-slate-700'
                        }`}
                      >
                        <CreditCard className="w-4 h-4 text-emerald-600" />
                        <span>GPay / PhonePe</span>
                      </button>
                    </div>
                  </div>

                  {/* UPI QR Display */}
                  {selectedPaymentMethod === 'upi_qr' && (
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-3">
                      <div className="w-20 h-20 bg-white p-1 rounded-lg border shrink-0">
                        <img src={qrCodeUrl} alt="UPI QR" className="w-full h-full object-contain" />
                      </div>
                      <div className="text-xs space-y-1">
                        <span className="font-bold text-slate-900 block">{t.scanQr}</span>
                        <span className="font-mono text-slate-600 block text-[11px]">UPI: {settings.upiId}</span>
                        <input
                          type="text"
                          placeholder="Enter UTR / Ref No. (Optional)"
                          value={utrInput}
                          onChange={(e) => setUtrInput(e.target.value)}
                          className="w-full px-2 py-1 bg-white border border-slate-300 rounded text-[11px] font-mono"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Primary Confirm & Pay Button ONLY (WhatsApp Chat button REMOVED as requested) */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full py-3.5 bg-red-600 hover:bg-red-700 active:scale-98 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    {isProcessing ? (
                      <span>Processing Advance Confirmation...</span>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{t.confirmPayBtn} (₹{activePricing.advance25.toLocaleString('en-IN')})</span>
                      </>
                    )}
                  </button>
                </div>

              </div>

            </form>

          </div>
        )}

      </div>

      {/* QUICK INLINE VEHICLE EDIT MODAL (FOR OWNER/ADMIN TO EDIT CAR NAME, MODELS, RATE, & PHOTO) */}
      {editingVehicle && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-3 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h4 className="text-base font-bold text-slate-900">
                  {lang === 'en' ? 'Edit Vehicle Details' : 'కారు వివరాలు మార్చండి'}
                </h4>
                <p className="text-xs text-slate-500">
                  Update car display name, models list, per-km rate, and car photo.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditingVehicle(null)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveVehicleEdit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Car Models String (Displayed to Customer):
                </label>
                <input
                  type="text"
                  required
                  value={editForm.models}
                  onChange={(e) => setEditForm({ ...editForm, models: e.target.value })}
                  placeholder="e.g. Maruti Suzuki Dzire / Toyota Etios / Honda Amaze"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Category / Internal Label:
                </label>
                <input
                  type="text"
                  required
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  placeholder="e.g. Prime Sedan"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Rate / Km (₹):</label>
                  <input
                    type="number"
                    required
                    min={5}
                    value={editForm.ratePerKm}
                    onChange={(e) => setEditForm({ ...editForm, ratePerKm: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Driver Bata / Day (₹):</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={editForm.driverAllowancePerDay}
                    onChange={(e) => setEditForm({ ...editForm, driverAllowancePerDay: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>

              {/* Car Photo Edit / Upload */}
              <div className="space-y-1.5 pt-1">
                <label className="block font-bold text-slate-700">Car Photo (URL or Upload Image):</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={editForm.imageUrl}
                    onChange={(e) => setEditForm({ ...editForm, imageUrl: e.target.value })}
                    placeholder="/cars/dzire_etios.jpg or image URL"
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono"
                  />
                  <label className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg cursor-pointer font-bold shrink-0 flex items-center gap-1">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleCarPhotoUpload}
                    />
                  </label>
                </div>

                {editForm.imageUrl && (
                  <div className="w-32 h-20 bg-slate-50 border rounded-lg p-1 mt-1 overflow-hidden">
                    <img src={editForm.imageUrl} alt="Car Preview" className="w-full h-full object-contain" />
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setEditingVehicle(null)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-900 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
