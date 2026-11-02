import React, { useState } from 'react';
import { 
  X, Lock, ShieldCheck, Check, Phone, MessageCircle, 
  Trash2, Edit2, Plus, RefreshCw, Download, Car, Calendar,
  DollarSign, MapPin, Settings, UserCheck, AlertCircle, LogOut,
  TrendingUp, Tag, QrCode, ShieldAlert
} from 'lucide-react';
import { useTravelStore } from '../context/TravelStoreContext';
import { Vehicle, PopularRoute, TourPackage, BookingDetails, Coupon, DriverPartner } from '../types';
import { WayOraLogo } from './WayOraLogo';
import { AdminAnalyticsTab } from './AdminAnalyticsTab';
import { AdminCouponsTab } from './AdminCouponsTab';

interface AdminPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'en' | 'te';
}

export const AdminPortalModal: React.FC<AdminPortalModalProps> = ({ isOpen, onClose, lang }) => {
  const {
    settings,
    vehicles,
    routes,
    packages,
    bookings,
    drivers,
    coupons,
    addCoupon,
    updateCoupon,
    deleteCoupon,
    isAdmin,
    adminLogin,
    adminLogout,
    updateSettings,
    updateVehicle,
    addVehicle,
    deleteVehicle,
    updateRoute,
    addRoute,
    deleteRoute,
    updatePackage,
    addPackage,
    deletePackage,
    updateBookingStatus,
    deleteBooking,
    updateDriverStatus,
    deleteDriver,
    resetToFactoryDefaults
  } = useTravelStore();

  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const [activeTab, setActiveTab] = useState<'bookings' | 'analytics' | 'coupons' | 'fleet' | 'packages' | 'routes' | 'drivers' | 'settings'>('bookings');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Quick UPI ID Edit state
  const [quickUpiInput, setQuickUpiInput] = useState(settings.upiId || 'wayorajourneys@upi');
  const [showUpiModal, setShowUpiModal] = useState(false);

  // Editing state for vehicle
  const [editingVehicleId, setEditingVehicleId] = useState<string | null>(null);
  const [vehicleForm, setVehicleForm] = useState<Partial<Vehicle>>({});

  // Editing state for company settings
  const [settingsForm, setSettingsForm] = useState(settings);

  // New Car state
  const [showAddCarModal, setShowAddCarModal] = useState(false);
  const [newCar, setNewCar] = useState<Partial<Vehicle>>({
    name: '',
    models: '',
    category: 'suv',
    seats: 7,
    luggage: 4,
    ac: true,
    ratePerKm: 18,
    minKmPerDay: 300,
    driverAllowancePerDay: 500,
    hourlyRate: 300,
    features: ['100% AC', 'Clean Interiors', 'Verified Driver'],
    featuresTe: ['100% ఏసీ', 'పరిశుభ్రమైన ఇంటీరియర్', 'వెరిఫైడ్ డ్రైవర్'],
    bestFor: 'Family highway trips',
    bestForTe: 'ఫ్యామిలీ ట్రిప్స్ కోసం'
  });

  // Dispatch booking to driver state
  const [dispatchBooking, setDispatchBooking] = useState<BookingDetails | null>(null);
  const [selectedDriverId, setSelectedDriverId] = useState<string>('');
  const [customDriverPhone, setCustomDriverPhone] = useState<string>('');
  const [customDriverName, setCustomDriverName] = useState<string>('');

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const success = adminLogin(pinInput);
    if (success) {
      setPinError(false);
      setPinInput('');
      setSettingsForm(settings);
    } else {
      setPinError(true);
    }
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(settingsForm);
    showToast(lang === 'en' ? 'Settings saved successfully!' : 'కంపెనీ వివరాలు విజయవంతంగా సేవ్ అయ్యాయి!');
  };

  const handleSendBookingToDriver = (booking: BookingDetails) => {
    let targetPhone = '';
    let targetDriverName = '';
    
    if (selectedDriverId && selectedDriverId !== 'custom') {
      const drv = drivers.find(d => d.id === selectedDriverId);
      if (drv) {
        targetPhone = drv.phone;
        targetDriverName = drv.fullName;
      }
    } else {
      targetPhone = customDriverPhone;
      targetDriverName = customDriverName || 'Driver Partner';
    }

    if (!targetPhone || targetPhone.replace(/\D/g, '').length < 10) {
      alert(lang === 'en' ? 'Please enter or select a valid 10-digit driver mobile number' : 'దయచేసి సరైన 10 అంకెల డ్రైవర్ ఫోన్ నంబర్ నమోదు చేయండి');
      return;
    }

    const cleanNumber = '91' + targetPhone.replace(/\D/g, '').slice(-10);
    const slip = 
      `🚗 *WAY ORA JOURNEYS - OFFICIAL DRIVER DUTY SLIP* 🚗\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `👨‍✈️ *Assigned Driver:* ${targetDriverName}\n` +
      `📌 *Booking ID:* #${booking.bookingId}\n` +
      `📍 *Pickup Location:* ${booking.pickupLocation}\n` +
      `🏁 *Drop Location:* ${booking.dropLocation}\n` +
      `📅 *Trip Date:* ${booking.pickupDate}\n` +
      `⏰ *Reporting Time:* ${booking.pickupTime}\n` +
      (booking.returnDate ? `🔄 *Return Date:* ${booking.returnDate}\n` : '') +
      `👤 *Passenger Name:* ${booking.name}\n` +
      `📞 *Passenger Mobile:* ${booking.phone}\n` +
      `👥 *No. of Passengers:* ${booking.passengerCount} persons\n` +
      `🚘 *Vehicle Required:* ${booking.vehicleName}\n` +
      `🛣️ *Approx Distance:* ${booking.estimatedKm} km\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `💰 *Total Trip Fare:* ₹${booking.estimatedFare.toLocaleString('en-IN')}\n` +
      `✅ *25% Advance Paid Online:* ₹${booking.advanceAmount.toLocaleString('en-IN')}\n` +
      `💵 *CASH TO COLLECT ON TRIP:* ₹${booking.remainingAmount.toLocaleString('en-IN')}\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      (booking.specialRequests ? `📝 *Notes:* ${booking.specialRequests}\n` : '') +
      `*Driver Guidelines:*\n` +
      `1. Please report 15 mins prior to pickup time.\n` +
      `2. Keep AC chilled and car clean & sanitized.\n` +
      `3. Collect ₹${booking.remainingAmount.toLocaleString('en-IN')} balance cash/UPI upon completion.\n\n` +
      `Have a safe trip! Way Ora Journeys (${settings.phone})`;

    window.open(`https://wa.me/${cleanNumber}?text=${encodeURIComponent(slip)}`, '_blank');
    updateBookingStatus(booking.bookingId, 'confirmed');
    setDispatchBooking(null);
    showToast(lang === 'en' ? `Booking duty sent to ${targetDriverName} via WhatsApp!` : `బుకింగ్ డ్రైవర్‌కు వాట్సాప్‌లో పంపబడింది!`);
  };

  const handleStartEditVehicle = (v: Vehicle) => {
    setEditingVehicleId(v.id);
    setVehicleForm(v);
  };

  const handleSaveVehicle = (id: string) => {
    updateVehicle(id, vehicleForm);
    setEditingVehicleId(null);
    showToast(lang === 'en' ? 'Vehicle details updated successfully!' : 'కారు వివరాలు విజయవంతంగా అప్‌డేట్ అయ్యాయి!');
  };

  const handleCreateCar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCar.name || !newCar.ratePerKm) return;
    const id = `custom-car-${Date.now()}`;
    addVehicle({
      id,
      name: newCar.name || 'New Car',
      models: newCar.models || 'Model',
      category: newCar.category || 'suv',
      seats: Number(newCar.seats) || 5,
      luggage: Number(newCar.luggage) || 3,
      ac: true,
      ratePerKm: Number(newCar.ratePerKm) || 16,
      minKmPerDay: Number(newCar.minKmPerDay) || 300,
      driverAllowancePerDay: Number(newCar.driverAllowancePerDay) || 500,
      hourlyRate: Number(newCar.hourlyRate) || 250,
      features: ['Air Conditioning', 'Chauffeured', 'Luggage space'],
      featuresTe: ['ఏసీ సౌకర్యం', 'డ్రైవర్ సర్వీస్', 'లగేజ్ స్పేస్'],
      bestFor: newCar.bestFor || 'Comfortable Travel',
      bestForTe: newCar.bestForTe || 'సౌకర్యవంతమైన ప్రయాణం'
    });
    setShowAddCarModal(false);
    showToast(lang === 'en' ? 'New car added to fleet!' : 'కొత్త కారు ఫ్లీట్‌లో చేర్చబడింది!');
  };

  const handleExportData = () => {
    const data = {
      settings,
      vehicles,
      routes,
      packages,
      bookings,
      exportDate: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `WayOraJourneys_Backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    showToast('Data exported successfully!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-200">
        
        {/* Toast alert */}
        {toastMessage && (
          <div className="absolute top-4 right-4 z-50 bg-emerald-600 text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow-xl flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Top Header */}
        <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold font-display text-white">
                  Way Ora Journeys · {lang === 'en' ? 'Owner Control Center' : 'ఓనర్ కంట్రోల్ ప్యానెల్'}
                </h3>
                {isAdmin && (
                  <span className="text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded">
                    Full A-to-Z Access Active
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400">
                {lang === 'en' 
                  ? 'Manage car prices per km, driver bata, customer bookings, WhatsApp & phone numbers' 
                  : 'కార్ల రేట్లు, డ్రైవర్ బత్తా, బుకింగ్స్, వాట్సాప్ మరియు ఫోన్ నంబర్లు మీరే మార్చుకోవచ్చు'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAdmin && (
              <button
                type="button"
                onClick={adminLogout}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                title="Logout"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Not Logged In: PIN Authentication Screen */}
        {!isAdmin ? (
          <div className="p-8 sm:p-12 max-w-md mx-auto w-full text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center mx-auto shadow-sm">
              <ShieldCheck className="w-8 h-8" />
            </div>

            <div>
              <h4 className="text-xl font-bold text-slate-900 font-display">
                {lang === 'en' ? 'Owner Authentication' : 'ఓనర్ సెక్యూరిటీ లాగిన్'}
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                {lang === 'en' 
                  ? 'Enter your 4-digit security PIN to unlock full administration controls.' 
                  : 'ధరలు మరియు బుకింగ్స్ నిర్వహించడానికి మీ 4-అంకెల సెక్యూరిటీ పిన్ నమోదు చేయండి.'}
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <input
                  type="password"
                  maxLength={6}
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  placeholder="Enter PIN (Default: 1234)"
                  className="w-full text-center text-2xl font-mono tracking-widest py-3 px-4 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                  autoFocus
                />
                {pinError && (
                  <p className="text-xs text-rose-600 mt-1.5 font-medium">
                    {lang === 'en' ? 'Incorrect PIN. Try default: 1234' : 'తప్పుడు పిన్. డిఫాల్ట్ పిన్: 1234 ఉపయోగించండి.'}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow"
              >
                {lang === 'en' ? 'Unlock Control Panel' : 'ప్యానెల్ అన్‌లాక్ చేయండి'}
              </button>
            </form>

            <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-xl text-left text-xs text-amber-900">
              <span className="font-bold block">💡 Owner Note / సమాచారం:</span>
              <span>
                {lang === 'en' 
                  ? 'Default PIN is set to 1234. You can change this to any personal PIN in Settings tab once logged in.'
                  : 'డిఫాల్ట్ పిన్ 1234. మీరు లాగిన్ అయ్యాక సెట్టింగ్స్ లో మీ స్వంత పిన్ మార్చుకోవచ్చు.'}
              </span>
            </div>
          </div>
        ) : (
          /* Authenticated Admin Console */
          <div className="flex-1 flex flex-col overflow-hidden">
            
            {/* Navigation Tabs */}
            <div className="bg-slate-100 border-b border-slate-200 px-4 sm:px-6 flex items-center gap-2 overflow-x-auto text-xs font-semibold shrink-0 py-2">
              <button
                onClick={() => setActiveTab('bookings')}
                className={`px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'bookings'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>📋 {lang === 'en' ? 'Customer Bookings' : 'బుకింగ్స్'}</span>
                <span className="bg-slate-200 text-slate-800 font-mono text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                  {bookings.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('analytics')}
                className={`px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'analytics'
                    ? 'bg-white text-slate-900 shadow-sm font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                <span>📊 {lang === 'en' ? 'Agent Analytics' : 'ఏజెంట్ అనలిటిక్స్'}</span>
                <span className="bg-emerald-100 text-emerald-800 font-mono text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                  Live
                </span>
              </button>

              <button
                onClick={() => setActiveTab('coupons')}
                className={`px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'coupons'
                    ? 'bg-white text-slate-900 shadow-sm font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Tag className="w-3.5 h-3.5 text-red-600" />
                <span>🏷️ {lang === 'en' ? 'Coupons & Offers' : 'కూపన్లు & ఆఫర్లు'}</span>
                <span className="bg-red-100 text-red-800 font-mono text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                  {coupons.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('fleet')}
                className={`px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'fleet'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>🚗 {lang === 'en' ? 'Car Rates & Fleet' : 'కార్ల ధరలు & ఫ్లీట్'}</span>
                <span className="bg-slate-200 text-slate-800 font-mono text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                  {vehicles.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('routes')}
                className={`px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'routes'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>🛣️ {lang === 'en' ? 'Route Tariffs' : 'రూట్స్ & రేట్లు'}</span>
                <span className="bg-slate-200 text-slate-800 font-mono text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                  {routes.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('packages')}
                className={`px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'packages'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>🏖️ {lang === 'en' ? 'Tour Packages' : 'టూర్ ప్యాకేజీలు'}</span>
                <span className="bg-slate-200 text-slate-800 font-mono text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                  {packages.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('drivers')}
                className={`px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'drivers'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>🤝 {lang === 'en' ? 'Drivers & Car Owners' : 'డ్రైవర్లు & కార్ ఓనర్లు'}</span>
                <span className="bg-amber-100 text-amber-800 font-mono text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                  {drivers.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className={`px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'settings'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>⚙️ {lang === 'en' ? 'Settings & UPI' : 'సెట్టింగ్స్ & యూపీఐ'}</span>
              </button>
            </div>

            {/* Tab Contents: Scrollable */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50">
              
              {/* TAB 1: BOOKINGS */}
              {activeTab === 'bookings' && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200">
                    <div>
                      <h4 className="text-base font-bold text-slate-900">
                        {lang === 'en' ? 'Received Customer Inquiries & Bookings' : 'వచ్చిన బుకింగ్స్ & ఎంక్వైరీలు'}
                      </h4>
                      <p className="text-xs text-slate-500">
                        {lang === 'en' 
                          ? 'Call customers immediately, confirm vehicle assignment, or update trip status.' 
                          : 'కస్టమర్లకు వెంటనే కాల్ చేసి కారును కన్ఫర్మ్ చేయండి.'}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 block font-bold uppercase">Total Bookings</span>
                        <span className="text-lg font-mono font-bold text-slate-900">{bookings.length}</span>
                      </div>
                      <div className="text-right border-l pl-3">
                        <span className="text-[10px] text-emerald-600 block font-bold uppercase">Confirmed</span>
                        <span className="text-lg font-mono font-bold text-emerald-700">
                          {bookings.filter(b => b.status === 'confirmed').length}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Bookings List */}
                  {bookings.length === 0 ? (
                    <div className="bg-white p-12 text-center rounded-xl border border-slate-200 text-slate-500 text-sm">
                      No bookings yet. New customer bookings submitted via the website will appear here in real-time.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {bookings.map((booking) => (
                        <div
                          key={booking.bookingId}
                          className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
                        >
                          <div className="space-y-2 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                                {booking.bookingId}
                              </span>
                              <span className="text-xs font-semibold text-slate-700">
                                {booking.tripType.toUpperCase()}
                              </span>
                              <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                                booking.status === 'confirmed'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : booking.status === 'pending'
                                  ? 'bg-amber-100 text-amber-800'
                                  : booking.status === 'completed'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-rose-100 text-rose-800'
                              }`}>
                                {booking.status.toUpperCase()}
                              </span>
                            </div>

                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs text-slate-800">
                              <span className="font-bold text-sm text-slate-900">
                                👤 {booking.name}
                              </span>
                              <span className="font-mono text-slate-600">
                                📞 {booking.phone}
                              </span>
                              <span className="text-slate-500">
                                👥 {booking.passengerCount} Passengers
                              </span>
                            </div>

                            <div className="text-xs text-slate-600 flex flex-wrap items-center gap-x-4 gap-y-1">
                              <span>📍 <strong>Pickup:</strong> {booking.pickupLocation}</span>
                              <span>🏁 <strong>Drop:</strong> {booking.dropLocation}</span>
                              <span>📅 <strong>Date:</strong> {booking.pickupDate} ({booking.pickupTime})</span>
                              {booking.returnDate && <span>🔄 <strong>Return:</strong> {booking.returnDate}</span>}
                            </div>

                            <div className="text-xs text-slate-700 flex items-center gap-3">
                              <span>🚗 <strong>Car:</strong> {booking.vehicleName}</span>
                              <span>💰 <strong>Fare:</strong> <strong className="font-mono text-amber-800 font-bold">₹{booking.estimatedFare.toLocaleString('en-IN')}</strong></span>
                              <span className="text-slate-400 font-mono">({booking.estimatedKm} km)</span>
                            </div>

                            {booking.specialRequests && (
                              <div className="text-xs text-slate-500 bg-slate-50 p-2 rounded border border-slate-100">
                                <strong>Notes:</strong> {booking.specialRequests}
                              </div>
                            )}
                          </div>

                          {/* Quick Actions for this booking */}
                          <div className="flex md:flex-col items-center sm:items-end justify-between gap-2 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100 shrink-0">
                            <div className="flex flex-wrap items-center gap-1.5">
                              {/* Send Duty Slip to Driver on WhatsApp */}
                              <button
                                type="button"
                                onClick={() => {
                                  setDispatchBooking(booking);
                                  setSelectedDriverId(drivers[0]?.id || 'custom');
                                }}
                                className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
                                title="Send Duty Slip to Driver on WhatsApp"
                              >
                                <MessageCircle className="w-3.5 h-3.5 text-white" />
                                <span>{lang === 'en' ? 'Send to Driver' : 'డ్రైవర్‌కు పంపండి'}</span>
                              </button>

                              {/* Direct Call Customer */}
                              <a
                                href={`tel:${booking.phone}`}
                                className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors"
                                title="Call Customer"
                              >
                                <Phone className="w-4 h-4 text-slate-700" />
                              </a>

                              {/* Direct WhatsApp Customer */}
                              <a
                                href={`https://wa.me/91${booking.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hello ${booking.name}! This is Way Ora Journeys regarding your car booking ${booking.bookingId} for ${booking.dropLocation}.`)}`}
                                target="_blank"
                                rel="noreferrer"
                                className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-emerald-800 text-xs font-semibold transition-colors"
                                title="WhatsApp Customer"
                              >
                                <MessageCircle className="w-4 h-4 text-emerald-600" />
                              </a>

                              {/* Delete */}
                              <button
                                type="button"
                                onClick={() => {
                                  if (confirm(`Delete booking ${booking.bookingId}?`)) {
                                    deleteBooking(booking.bookingId);
                                    showToast('Booking deleted');
                                  }
                                }}
                                className="p-2 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>

                            {/* Status Changer dropdown */}
                            <select
                              value={booking.status}
                              onChange={(e) => {
                                updateBookingStatus(booking.bookingId, e.target.value as any);
                                showToast(`Status updated to ${e.target.value}`);
                              }}
                              className="text-xs font-semibold py-1.5 px-2 bg-slate-100 border border-slate-200 rounded-lg text-slate-800 focus:outline-none"
                            >
                              <option value="pending">Mark Pending</option>
                              <option value="confirmed">Mark Confirmed</option>
                              <option value="completed">Mark Completed</option>
                              <option value="cancelled">Mark Cancelled</option>
                            </select>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB: AGENT ANALYTICS */}
              {activeTab === 'analytics' && (
                <AdminAnalyticsTab
                  drivers={drivers}
                  bookings={bookings}
                  settings={settings}
                  lang={lang}
                  onSendDutyToDriver={handleSendBookingToDriver}
                />
              )}

              {/* TAB: PROMOTIONAL COUPONS */}
              {activeTab === 'coupons' && (
                <AdminCouponsTab
                  coupons={coupons}
                  onAddCoupon={addCoupon}
                  onUpdateCoupon={updateCoupon}
                  onDeleteCoupon={deleteCoupon}
                  lang={lang}
                  onToast={showToast}
                />
              )}

              {/* TAB 2: FLEET & CAR RATES */}
              {activeTab === 'fleet' && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200">
                    <div>
                      <h4 className="text-base font-bold text-slate-900">
                        {lang === 'en' ? 'Edit Per-Km Rates & Driver Allowances' : 'కార్ల రేట్లు మరియు డ్రైవర్ బత్తా మార్పులు'}
                      </h4>
                      <p className="text-xs text-slate-500">
                        {lang === 'en' 
                          ? 'Changes made here update the live fare calculator and booking engine immediately.' 
                          : 'ఇక్కడ మార్చిన రేట్లు వెంటనే వెబ్‌సైట్‌లోని క్యాలిక్యులేటర్‌లో అప్‌డేట్ అవుతాయి.'}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowAddCarModal(true)}
                      className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors self-start sm:self-auto"
                    >
                      <Plus className="w-4 h-4" />
                      <span>{lang === 'en' ? 'Add New Car to Fleet' : 'కొత్త కారును చేర్చండి'}</span>
                    </button>
                  </div>

                  {/* Vehicle Rate Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {vehicles.map((v) => {
                      const isEditing = editingVehicleId === v.id;

                      return (
                        <div key={v.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-3">
                              {/* Car Photo Thumbnail */}
                              <div className="w-16 h-12 bg-slate-50 border border-slate-200 rounded-lg p-1 shrink-0 overflow-hidden flex items-center justify-center">
                                {v.imageUrl ? (
                                  <img src={v.imageUrl} alt={v.name} className="w-full h-full object-contain" />
                                ) : (
                                  <Car className="w-6 h-6 text-slate-400" />
                                )}
                              </div>
                              <div>
                                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700">
                                  {v.category.toUpperCase()}
                                </span>
                                <h5 className="text-base font-bold text-slate-900">
                                  {v.name}
                                </h5>
                                <p className="text-xs text-slate-500 font-medium">
                                  {v.models}
                                </p>
                              </div>
                            </div>

                            {!isEditing ? (
                              <button
                                type="button"
                                onClick={() => handleStartEditVehicle(v)}
                                className="px-3 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg flex items-center gap-1 transition-colors shrink-0"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                                <span>Edit Car</span>
                              </button>
                            ) : (
                              <div className="flex items-center gap-1 shrink-0">
                                <button
                                  type="button"
                                  onClick={() => handleSaveVehicle(v.id)}
                                  className="px-3 py-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg flex items-center gap-1"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                  <span>Save</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setEditingVehicleId(null)}
                                  className="px-2 py-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800"
                                >
                                  Cancel
                                </button>
                              </div>
                            )}
                          </div>

                          {/* Editable Name & Models when isEditing */}
                          {isEditing && (
                            <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                              <div>
                                <label className="text-[10px] text-slate-500 font-bold block uppercase">
                                  Car Models (e.g. Maruti Suzuki Dzire / Toyota Etios / Honda Amaze):
                                </label>
                                <input
                                  type="text"
                                  value={vehicleForm.models ?? v.models}
                                  onChange={(e) => setVehicleForm({ ...vehicleForm, models: e.target.value })}
                                  className="w-full mt-1 p-1.5 text-xs bg-white border border-slate-300 rounded font-medium"
                                />
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                <div>
                                  <label className="text-[10px] text-slate-500 font-bold block uppercase">
                                    Display Name / Label:
                                  </label>
                                  <input
                                    type="text"
                                    value={vehicleForm.name ?? v.name}
                                    onChange={(e) => setVehicleForm({ ...vehicleForm, name: e.target.value })}
                                    className="w-full mt-1 p-1.5 text-xs bg-white border border-slate-300 rounded"
                                  />
                                </div>
                                <div>
                                  <label className="text-[10px] text-slate-500 font-bold block uppercase">
                                    Car Photo URL:
                                  </label>
                                  <input
                                    type="text"
                                    value={vehicleForm.imageUrl ?? v.imageUrl ?? ''}
                                    onChange={(e) => setVehicleForm({ ...vehicleForm, imageUrl: e.target.value })}
                                    placeholder="/cars/dzire_etios.jpg or link"
                                    className="w-full mt-1 p-1.5 text-xs font-mono bg-white border border-slate-300 rounded"
                                  />
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Editable Fields */}
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                              <label className="text-[10px] text-slate-500 font-bold block uppercase">
                                Rate / Km
                              </label>
                              {isEditing ? (
                                <input
                                  type="number"
                                  value={vehicleForm.ratePerKm ?? v.ratePerKm}
                                  onChange={(e) => setVehicleForm({ ...vehicleForm, ratePerKm: Number(e.target.value) })}
                                  className="w-full mt-1 p-1 text-sm font-mono font-bold bg-white border border-slate-300 rounded"
                                />
                              ) : (
                                <span className="text-base font-black font-mono text-slate-900">
                                  ₹{v.ratePerKm}
                                </span>
                              )}
                            </div>

                            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                              <label className="text-[10px] text-slate-500 font-bold block uppercase">
                                Driver Bata / Day
                              </label>
                              {isEditing ? (
                                <input
                                  type="number"
                                  value={vehicleForm.driverAllowancePerDay ?? v.driverAllowancePerDay}
                                  onChange={(e) => setVehicleForm({ ...vehicleForm, driverAllowancePerDay: Number(e.target.value) })}
                                  className="w-full mt-1 p-1 text-sm font-mono font-bold bg-white border border-slate-300 rounded"
                                />
                              ) : (
                                <span className="text-base font-black font-mono text-slate-900">
                                  ₹{v.driverAllowancePerDay}
                                </span>
                              )}
                            </div>

                            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                              <label className="text-[10px] text-slate-500 font-bold block uppercase">
                                Min Km / Day
                              </label>
                              {isEditing ? (
                                <input
                                  type="number"
                                  value={vehicleForm.minKmPerDay ?? v.minKmPerDay}
                                  onChange={(e) => setVehicleForm({ ...vehicleForm, minKmPerDay: Number(e.target.value) })}
                                  className="w-full mt-1 p-1 text-sm font-mono font-bold bg-white border border-slate-300 rounded"
                                />
                              ) : (
                                <span className="text-base font-black font-mono text-slate-900">
                                  {v.minKmPerDay} km
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                            <span>Capacity: <strong>{v.seats} Seats</strong> · <strong>{v.luggage} Bags</strong></span>
                            {vehicles.length > 3 && (
                              <button
                                type="button"
                                onClick={() => {
                                  if (confirm(`Delete ${v.name} from fleet?`)) {
                                    deleteVehicle(v.id);
                                    showToast('Car removed');
                                  }
                                }}
                                className="text-rose-600 hover:text-rose-700 text-[11px] font-semibold"
                              >
                                Remove Car
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 3: POPULAR ROUTES */}
              {activeTab === 'routes' && (
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-xl border border-slate-200">
                    <h4 className="text-base font-bold text-slate-900">
                      {lang === 'en' ? 'Manage Highway Routes & Starting Tariffs' : 'ప్రసిద్ధ మార్గాలు మరియు ప్రారంభ ధరలు'}
                    </h4>
                    <p className="text-xs text-slate-500">
                      {lang === 'en' 
                        ? 'Update starting prices displayed on the homepage.' 
                        : 'హోమ్‌పేజీలో కనిపించే ప్రారంభ ఛార్జీలను ఇక్కడ సవరించుకోవచ్చు.'}
                    </p>
                  </div>

                  <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold text-[10px]">
                        <tr>
                          <th className="p-3">Route (From → To)</th>
                          <th className="p-3">Distance (Km)</th>
                          <th className="p-3">Popular Car</th>
                          <th className="p-3">Starting Fare (₹)</th>
                          <th className="p-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {routes.map((route) => (
                          <tr key={route.id} className="hover:bg-slate-50">
                            <td className="p-3 font-bold text-slate-900">
                              {route.from} ➔ {route.to}
                            </td>
                            <td className="p-3 font-mono">{route.distanceKm} km</td>
                            <td className="p-3 text-slate-600">{route.popularCar}</td>
                            <td className="p-3">
                              <input
                                type="number"
                                defaultValue={route.startingPrice}
                                onBlur={(e) => {
                                  const val = Number(e.target.value);
                                  if (val && val !== route.startingPrice) {
                                    updateRoute(route.id, { startingPrice: val });
                                    showToast(`Route fare updated for ${route.to}`);
                                  }
                                }}
                                className="w-24 p-1 font-mono font-bold border border-slate-300 rounded text-slate-900"
                              />
                            </td>
                            <td className="p-3 text-right">
                              <button
                                type="button"
                                onClick={() => {
                                  if (confirm(`Remove route ${route.from} to ${route.to}?`)) {
                                    deleteRoute(route.id);
                                    showToast('Route removed');
                                  }
                                }}
                                className="text-rose-600 hover:text-rose-800 font-semibold"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 4: TOUR PACKAGES */}
              {activeTab === 'packages' && (
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-xl border border-slate-200">
                    <h4 className="text-base font-bold text-slate-900">
                      {lang === 'en' ? 'Tour Packages & Package Pricing' : 'టూర్ ప్యాకేజీలు & ప్యాకేజీ ధరలు'}
                    </h4>
                    <p className="text-xs text-slate-500">
                      {lang === 'en' 
                        ? 'Edit starting prices and durations for all holiday packages.' 
                        : 'అన్ని ప్యాకేజీల ప్రారంభ ధరలను సులభంగా మార్చుకోవచ్చు.'}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {packages.map((pkg) => (
                      <div key={pkg.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="text-[10px] font-bold text-amber-700 uppercase">
                              {pkg.category} · {pkg.duration}
                            </span>
                            <h5 className="text-base font-bold text-slate-900">
                              {pkg.title}
                            </h5>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-xs">
                          <div>
                            <label className="text-[10px] text-slate-500 font-bold block uppercase">
                              Starting Package Fare (₹)
                            </label>
                            <input
                              type="number"
                              defaultValue={pkg.startingPrice}
                              onBlur={(e) => {
                                const val = Number(e.target.value);
                                if (val && val !== pkg.startingPrice) {
                                  updatePackage(pkg.id, { startingPrice: val });
                                  showToast(`Package price updated: ₹${val}`);
                                }
                              }}
                              className="w-full mt-1 p-1.5 font-mono font-bold border border-slate-300 rounded text-slate-900"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] text-slate-500 font-bold block uppercase">
                              Distance (Km)
                            </label>
                            <input
                              type="number"
                              defaultValue={pkg.distanceKm}
                              onBlur={(e) => {
                                const val = Number(e.target.value);
                                if (val && val !== pkg.distanceKm) {
                                  updatePackage(pkg.id, { distanceKm: val });
                                  showToast('Distance updated');
                                }
                              }}
                              className="w-full mt-1 p-1.5 font-mono border border-slate-300 rounded text-slate-900"
                            />
                          </div>
                        </div>

                        <p className="text-xs text-slate-600 line-clamp-2">
                          {pkg.summary}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 5: DRIVER PARTNER REGISTRATIONS */}
              {activeTab === 'drivers' && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200">
                    <div>
                      <h4 className="text-base font-bold text-slate-900">
                        {lang === 'en' ? 'Driver Partner Applications & Attached Cars' : 'డ్రైవర్ భాగస్వాములు & కార్ల అటాచ్‌మెంట్'}
                      </h4>
                      <p className="text-xs text-slate-500">
                        {lang === 'en' 
                          ? 'Review drivers who registered via "Drive With Us". Call or WhatsApp directly to onboard.' 
                          : '"డ్రైవర్ జాయిన్" ద్వారా రిజిస్టర్ అయిన వారి వివరాలు, ఫోటోలు పరిశీలించి సంప్రదించండి.'}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-lg">
                        {drivers.filter(d => d.status === 'applied').length} {lang === 'en' ? 'New Applications' : 'కొత్త దరఖాస్తులు'}
                      </span>
                    </div>
                  </div>

                  {drivers.length === 0 ? (
                    <div className="bg-white p-8 text-center rounded-xl border border-slate-200 text-slate-500 text-xs">
                      {lang === 'en' ? 'No driver partners registered yet.' : 'డ్రైవర్ దరఖాస్తులు ఇంకా లేవు.'}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {drivers.map((drv) => {
                        const statusColors = {
                          applied: 'bg-amber-100 text-amber-800 border-amber-300',
                          verified: 'bg-blue-100 text-blue-800 border-blue-300',
                          active: 'bg-emerald-100 text-emerald-800 border-emerald-300'
                        }[drv.status];

                        const cleanNumber = drv.phone.replace(/\D/g, '');

                        return (
                          <div key={drv.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
                            <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2.5">
                              <div>
                                <div className="flex items-center gap-2">
                                  <h5 className="font-bold text-slate-900 text-sm">
                                    {drv.fullName}
                                  </h5>
                                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                    drv.partnerType === 'car_owner' 
                                      ? 'bg-purple-100 text-purple-800 border border-purple-200' 
                                      : drv.partnerType === 'owner_driver'
                                      ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                      : 'bg-blue-100 text-blue-800 border border-blue-200'
                                  }`}>
                                    {drv.partnerType === 'car_owner' ? '🚗 Car Owner' : drv.partnerType === 'owner_driver' ? '🚗👨‍✈️ Owner-Driver' : '👨‍✈️ Chauffeur'}
                                  </span>
                                </div>
                                <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                                  <span className="flex items-center gap-1">
                                    <MapPin className="w-3 h-3 text-slate-400" />
                                    {drv.city}
                                  </span>
                                  <span>•</span>
                                  <span>{drv.experienceYears} {lang === 'en' ? 'yrs exp' : 'ఏళ్ల అనుభవం'}</span>
                                  {drv.rating && (
                                    <>
                                      <span>•</span>
                                      <span className="text-amber-600 font-bold flex items-center gap-0.5">
                                        ★ {drv.rating}
                                      </span>
                                    </>
                                  )}
                                </div>
                              </div>
                              <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${statusColors}`}>
                                {drv.status}
                              </span>
                            </div>

                            {/* Vehicle, License, RC & Insurance Info */}
                            <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                              <div>
                                <span className="text-[10px] uppercase font-semibold text-slate-400 block">Vehicle Model:</span>
                                <span className="font-bold text-slate-800">{drv.vehicleModel}</span>
                              </div>
                              <div>
                                <span className="text-[10px] uppercase font-semibold text-slate-400 block">Car Plate Number:</span>
                                <span className="font-mono font-bold text-red-600">{drv.vehicleNumber}</span>
                              </div>
                              <div>
                                <span className="text-[10px] uppercase font-semibold text-slate-400 block">📄 RC Validity:</span>
                                <span className={`font-semibold inline-block ${drv.rcStatus === 'expired' ? 'text-rose-600' : 'text-emerald-700'}`}>
                                  {drv.rcStatus ? drv.rcStatus.toUpperCase() : 'VALID'}{drv.rcExpiryDate ? ` (Exp: ${drv.rcExpiryDate})` : ''}
                                </span>
                              </div>
                              <div>
                                <span className="text-[10px] uppercase font-semibold text-slate-400 block">🛡️ Insurance Status:</span>
                                <span className={`font-semibold inline-block ${drv.insuranceStatus === 'expired' ? 'text-rose-600' : 'text-emerald-700'}`}>
                                  {drv.insuranceStatus ? drv.insuranceStatus.toUpperCase() : 'ACTIVE'}{drv.insuranceExpiryDate ? ` (Exp: ${drv.insuranceExpiryDate})` : ''}
                                </span>
                              </div>
                              <div className="col-span-2">
                                <span className="text-[10px] uppercase font-semibold text-slate-400 block">🛡️ Insurance Company:</span>
                                <span className="font-semibold text-slate-800">
                                  {drv.insuranceCompany || 'ICICI Lombard General Insurance'}
                                  {drv.insurancePolicyNumber ? ` · Policy: ${drv.insurancePolicyNumber}` : ''}
                                </span>
                              </div>
                              <div className="col-span-2">
                                <span className="text-[10px] uppercase font-semibold text-slate-400 block">Driving License:</span>
                                <span className="font-mono text-slate-700">{drv.licenseNumber || 'Verified during onboard'}</span>
                              </div>
                            </div>

                            {/* Photos if provided */}
                            {(drv.photoUrl || drv.carPhotoUrl) && (
                              <div className="flex gap-2 pt-1">
                                {drv.photoUrl && (
                                  <div className="w-16 h-16 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 shrink-0">
                                    <img src={drv.photoUrl} alt="Driver" className="w-full h-full object-cover" />
                                  </div>
                                )}
                                {drv.carPhotoUrl && (
                                  <div className="w-20 h-16 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 shrink-0">
                                    <img src={drv.carPhotoUrl} alt="Car" className="w-full h-full object-cover" />
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Actions */}
                            <div className="pt-1 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100">
                              <div className="flex items-center gap-1.5">
                                <a
                                  href={`tel:${drv.phone}`}
                                  className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg flex items-center gap-1 transition-colors"
                                >
                                  <Phone className="w-3 h-3 text-emerald-600" />
                                  <span>{drv.phone}</span>
                                </a>
                                <a
                                  href={`https://wa.me/91${cleanNumber}?text=${encodeURIComponent(`Hello ${drv.fullName}, Way Ora Journeys here regarding your driver partner application for car ${drv.vehicleModel}.`)}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg transition-colors"
                                  title="Chat on WhatsApp"
                                >
                                  <MessageCircle className="w-3.5 h-3.5" />
                                </a>
                              </div>

                              <div className="flex items-center gap-1.5">
                                <select
                                  value={drv.status}
                                  onChange={(e) => {
                                    updateDriverStatus(drv.id, e.target.value as any);
                                    showToast(`Driver status updated to ${e.target.value}`);
                                  }}
                                  className="text-[11px] font-semibold bg-white border border-slate-300 rounded px-2 py-1 text-slate-800 focus:outline-none"
                                >
                                  <option value="applied">Applied (కొత్తది)</option>
                                  <option value="verified">Verified (వెరిఫైడ్)</option>
                                  <option value="active">Active (డ్రైవర్ ఆక్టివ్)</option>
                                </select>

                                <button
                                  type="button"
                                  onClick={() => {
                                    if (confirm(`Remove driver application for ${drv.fullName}?`)) {
                                      deleteDriver(drv.id);
                                      showToast('Driver removed');
                                    }
                                  }}
                                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                                  title="Delete Application"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>

                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 6: BUSINESS SETTINGS & PHONE */}
              {activeTab === 'settings' && (
                <div className="space-y-6">
                  <form onSubmit={handleSaveSettings} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                    <h4 className="text-base font-bold text-slate-900 border-b pb-3">
                      {lang === 'en' ? 'Company Contact Details & Security' : 'కంపెనీ ఫోన్ నంబర్లు & సెక్యూరిటీ'}
                    </h4>

                    {/* Logo Customization Box */}
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="block text-slate-900 font-bold text-xs uppercase tracking-wider">
                            {lang === 'en' ? 'Business Logo (Front Header & Brand)' : 'బిజినెస్ లోగో (ఫ్రంట్ హెడర్ & బ్రాండ్)'}
                          </label>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            {lang === 'en' 
                              ? 'Upload your logo image (.png, .jpg) or keep the built-in precision vector logo.' 
                              : 'మీ లోగో ఇమేజ్ ఫైల్ (.png/.jpg) అప్‌లోడ్ చేయండి లేదా డిఫాల్ట్ వెక్టర్ లోగోను ఉపయోగించండి.'}
                          </p>
                        </div>
                        {settingsForm.logoUrl && (
                          <button
                            type="button"
                            onClick={() => {
                              setSettingsForm({ ...settingsForm, logoUrl: '' });
                              showToast(lang === 'en' ? 'Reverted to precision vector logo' : 'వెక్టర్ లోగోకి మార్చబడింది');
                            }}
                            className="text-xs text-rose-600 hover:text-rose-700 font-semibold"
                          >
                            {lang === 'en' ? 'Use Vector SVG' : 'వెక్టర్ లోగో వాడండి'}
                          </button>
                        )}
                      </div>

                      {/* Current Preview */}
                      <div className="p-3 bg-slate-950 rounded-xl flex items-center justify-between">
                        <span className="text-[10px] text-slate-400 uppercase font-semibold">Active Logo Preview:</span>
                        {settingsForm.logoUrl ? (
                          <img 
                            src={settingsForm.logoUrl} 
                            alt="Logo Preview" 
                            className="h-10 max-w-[200px] object-contain"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <WayOraLogo variant="light" size="sm" showSubtitle={true} />
                        )}
                      </div>

                      {/* Upload File and URL Input */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                        <div>
                          <label className="block text-slate-700 font-semibold mb-1">
                            📁 {lang === 'en' ? 'Upload Image from Phone/PC' : 'మొబైల్/కంప్యూటర్ నుండి లోగో అప్‌లోడ్ చేయండి'}
                          </label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  const result = reader.result as string;
                                  setSettingsForm({ ...settingsForm, logoUrl: result });
                                  showToast(lang === 'en' ? 'Logo image loaded!' : 'లోగో ఇమేజ్ లోడ్ అయ్యింది!');
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                            className="w-full text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-900 file:text-white hover:file:bg-slate-800"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-700 font-semibold mb-1">
                            🔗 {lang === 'en' ? 'Or Paste Logo Image Link' : 'లేదా ఇమేజ్ లింక్ ఇక్కడ పేస్ట్ చేయండి'}
                          </label>
                          <input
                            type="url"
                            placeholder="https://.../logo.png"
                            value={settingsForm.logoUrl || ''}
                            onChange={(e) => setSettingsForm({ ...settingsForm, logoUrl: e.target.value })}
                            className="w-full p-2 border border-slate-300 rounded-lg text-slate-900"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div>
                        <label className="block text-slate-700 font-bold uppercase text-[10px] mb-1">
                          Company Name (కంపెనీ పేరు)
                        </label>
                        <input
                          type="text"
                          required
                          value={settingsForm.companyName}
                          onChange={(e) => setSettingsForm({ ...settingsForm, companyName: e.target.value })}
                          className="w-full p-2 border border-slate-300 rounded-lg text-slate-900 font-semibold"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-700 font-bold uppercase text-[10px] mb-1">
                          Primary Call Phone Number (కాల్ నంబర్)
                        </label>
                        <input
                          type="text"
                          required
                          value={settingsForm.phone}
                          onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                          className="w-full p-2 border border-slate-300 rounded-lg text-slate-900 font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-700 font-bold uppercase text-[10px] mb-1">
                          WhatsApp Booking Number (వాట్సాప్ నంబర్)
                        </label>
                        <input
                          type="text"
                          required
                          value={settingsForm.whatsapp}
                          onChange={(e) => setSettingsForm({ ...settingsForm, whatsapp: e.target.value })}
                          className="w-full p-2 border border-slate-300 rounded-lg text-slate-900 font-mono"
                        />
                        <span className="text-[10px] text-slate-400 mt-0.5 block">
                          Customers booking on WhatsApp will message directly to this number.
                        </span>
                      </div>

                      <div>
                        <label className="block text-slate-700 font-bold uppercase text-[10px] mb-1">
                          Customer Support Email (ఈమెయిల్)
                        </label>
                        <input
                          type="email"
                          value={settingsForm.email}
                          onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })}
                          className="w-full p-2 border border-slate-300 rounded-lg text-slate-900"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-700 font-bold uppercase text-[10px] mb-1">
                          Office Address / Hubs (ఆఫీస్ అడ్రస్)
                        </label>
                        <input
                          type="text"
                          value={settingsForm.officeAddress}
                          onChange={(e) => setSettingsForm({ ...settingsForm, officeAddress: e.target.value })}
                          className="w-full p-2 border border-slate-300 rounded-lg text-slate-900"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-700 font-bold uppercase text-[10px] mb-1">
                          Owner Admin Security PIN (అడ్మిన్ పిన్)
                        </label>
                        <input
                          type="text"
                          maxLength={6}
                          value={settingsForm.adminPin}
                          onChange={(e) => setSettingsForm({ ...settingsForm, adminPin: e.target.value })}
                          className="w-full p-2 border border-slate-300 rounded-lg text-slate-900 font-mono font-bold"
                        />
                        <span className="text-[10px] text-slate-400 mt-0.5 block">
                          Only you will know this PIN to enter this control center.
                        </span>
                      </div>
                    </div>

                    {/* UPI PAYMENT ID CONFIGURATION CARD (Requested: upi id change) */}
                    <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <QrCode className="w-5 h-5 text-emerald-700" />
                          <div>
                            <label className="block text-emerald-950 font-bold text-xs uppercase tracking-wider">
                              {lang === 'en' ? 'Business UPI ID for 25% Online Advance' : '25% ఆన్‌లైన్ అడ్వాన్స్ స్వీకరించడానికి UPI ID'}
                            </label>
                            <p className="text-[11px] text-emerald-800">
                              {lang === 'en' 
                                ? 'All customers scanning QR or using GPay/PhonePe will pay directly to this UPI address.' 
                                : 'కస్టమర్లు 25% అడ్వాన్స్ పేమెంట్ చేసే సమయంలో క్యూఆర్ కోడ్ ఈ యూపీఐ ఐడీతోనే పనిచేస్తుంది.'}
                            </p>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-300">
                          Active & Verified
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                        <div className="sm:col-span-2">
                          <label className="block text-slate-700 font-bold uppercase text-[10px] mb-1">
                            {lang === 'en' ? 'Enter Your Business UPI ID *' : 'మీ వ్యాపార UPI ID నమోదు చేయండి *'}
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. 9182471876@upi, wayorajourneys@okaxis, wayora@ybl"
                            value={settingsForm.upiId}
                            onChange={(e) => setSettingsForm({ ...settingsForm, upiId: e.target.value.trim().toLowerCase() })}
                            className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 font-mono font-bold text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          />
                          <span className="text-[10px] text-slate-500 mt-0.5 block">
                            Examples: PhonePe (9182471876@ybl), Google Pay (name@okaxis, name@okhdfcbank), Paytm (number@paytm)
                          </span>
                        </div>

                        <div>
                          <label className="block text-slate-700 font-bold uppercase text-[10px] mb-1">
                            {lang === 'en' ? 'Advance Percentage' : 'అడ్వాన్స్ శాతం'}
                          </label>
                          <select
                            value={settingsForm.advancePercentage || 25}
                            onChange={(e) => setSettingsForm({ ...settingsForm, advancePercentage: Number(e.target.value) })}
                            className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 font-bold text-xs"
                          >
                            <option value={20}>20% Advance</option>
                            <option value={25}>25% Advance (Standard)</option>
                            <option value={30}>30% Advance</option>
                            <option value={50}>50% Advance</option>
                          </select>
                        </div>
                      </div>

                      {/* Live QR Code Preview */}
                      <div className="p-3 bg-white border border-emerald-200 rounded-lg flex items-center gap-4">
                        <div className="w-16 h-16 bg-white p-1 rounded-lg border border-slate-200 shrink-0">
                          <img 
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(`upi://pay?pa=${settingsForm.upiId || 'wayorajourneys@upi'}&pn=Way+Ora+Journeys&am=500`)}`}
                            alt="Live UPI QR"
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="text-xs">
                          <span className="font-bold text-slate-900 block">
                            Live UPI QR: {settingsForm.upiId || 'wayorajourneys@upi'}
                          </span>
                          <span className="text-[11px] text-slate-500 block">
                            Instant test scan available. Payments hit your bank account directly without aggregator commissions.
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-colors shadow-sm"
                      >
                        Save Company Changes
                      </button>
                    </div>
                  </form>

                  {/* Data Export & Reset Card */}
                  <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-4">
                    <h4 className="text-sm font-bold text-slate-900">
                      {lang === 'en' ? 'Data Backup & Factory Reset' : 'డేటా బ్యాకప్ & రీసెట్'}
                    </h4>
                    
                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        type="button"
                        onClick={handleExportData}
                        className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Export All Data (JSON Backup)</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          if (confirm('Are you sure you want to reset all rates, routes, and fleet to factory defaults?')) {
                            resetToFactoryDefaults();
                            showToast('Reset to factory defaults');
                          }
                        }}
                        className="px-4 py-2 border border-rose-300 hover:bg-rose-50 text-rose-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Reset to Factory Defaults</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </div>

          </div>
        )}

      </div>

      {/* Add New Car Modal */}
      {showAddCarModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/70">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 space-y-4 border border-slate-200">
            <div className="flex items-center justify-between border-b pb-3">
              <h4 className="text-base font-bold text-slate-900">
                Add New Car to Fleet
              </h4>
              <button
                type="button"
                onClick={() => setShowAddCarModal(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCar} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Car Display Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Luxury Innova Hycross"
                  value={newCar.name}
                  onChange={(e) => setNewCar({ ...newCar, name: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Model Names *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Toyota Innova Hycross Hybrid"
                  value={newCar.models}
                  onChange={(e) => setNewCar({ ...newCar, models: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Rate Per Km (₹) *</label>
                  <input
                    type="number"
                    required
                    value={newCar.ratePerKm}
                    onChange={(e) => setNewCar({ ...newCar, ratePerKm: Number(e.target.value) })}
                    className="w-full p-2 border border-slate-300 rounded font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Driver Bata / Day (₹)</label>
                  <input
                    type="number"
                    value={newCar.driverAllowancePerDay}
                    onChange={(e) => setNewCar({ ...newCar, driverAllowancePerDay: Number(e.target.value) })}
                    className="w-full p-2 border border-slate-300 rounded font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Seats Count</label>
                  <input
                    type="number"
                    value={newCar.seats}
                    onChange={(e) => setNewCar({ ...newCar, seats: Number(e.target.value) })}
                    className="w-full p-2 border border-slate-300 rounded font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Luggage Bags</label>
                  <input
                    type="number"
                    value={newCar.luggage}
                    onChange={(e) => setNewCar({ ...newCar, luggage: Number(e.target.value) })}
                    className="w-full p-2 border border-slate-300 rounded font-mono"
                  />
                </div>
              </div>

              <div className="pt-3 flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setShowAddCarModal(false)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded font-bold"
                >
                  Add Car
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DRIVER DUTY DISPATCH MODAL (ONE-CLICK WHATSAPP DISPATCH TO DRIVER) */}
      {dispatchBooking && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <MessageCircle className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-900">
                    {lang === 'en' ? 'Dispatch Booking to Driver' : 'డ్రైవర్‌కు డ్యూటీ పంపండి'}
                  </h4>
                  <p className="text-xs text-slate-500">
                    Booking #{dispatchBooking.bookingId} · {dispatchBooking.vehicleName}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setDispatchBooking(null)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Select Driver Partner or Enter Custom Number */}
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  {lang === 'en' ? 'Select Driver Partner:' : 'డ్రైవర్‌ను ఎంచుకోండి:'}
                </label>
                <select
                  value={selectedDriverId}
                  onChange={(e) => setSelectedDriverId(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-lg bg-white text-slate-900 font-medium focus:ring-2 focus:ring-emerald-500"
                >
                  {drivers.map(drv => (
                    <option key={drv.id} value={drv.id}>
                      {drv.fullName} — {drv.phone} ({drv.vehicleModel} · {drv.vehicleNumber})
                    </option>
                  ))}
                  <option value="custom">✏️ Enter Another Driver Mobile Number...</option>
                </select>
              </div>

              {selectedDriverId === 'custom' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Driver Name:</label>
                    <input
                      type="text"
                      placeholder="e.g. Suresh Kumar"
                      value={customDriverName}
                      onChange={(e) => setCustomDriverName(e.target.value)}
                      className="w-full p-2 border border-slate-300 rounded bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Driver WhatsApp (10 Digits):</label>
                    <input
                      type="tel"
                      maxLength={10}
                      placeholder="e.g. 9848012345"
                      value={customDriverPhone}
                      onChange={(e) => setCustomDriverPhone(e.target.value.replace(/\D/g, ''))}
                      className="w-full p-2 border border-slate-300 rounded bg-white font-mono"
                    />
                  </div>
                </div>
              )}

              {/* Duty Slip Preview Box */}
              <div className="bg-slate-900 text-slate-200 p-3.5 rounded-xl font-mono text-[11px] space-y-1 max-h-48 overflow-y-auto border border-slate-800">
                <div className="text-emerald-400 font-bold pb-1 border-b border-slate-800">
                  📋 PREVIEW OF WHATSAPP DUTY SLIP
                </div>
                <div>📍 Pickup: {dispatchBooking.pickupLocation}</div>
                <div>🏁 Drop: {dispatchBooking.dropLocation}</div>
                <div>📅 Date & Time: {dispatchBooking.pickupDate} at {dispatchBooking.pickupTime}</div>
                <div>👤 Passenger: {dispatchBooking.name} (📞 {dispatchBooking.phone})</div>
                <div>🚘 Car Required: {dispatchBooking.vehicleName}</div>
                <div className="text-amber-400">💰 Total Fare: ₹{dispatchBooking.estimatedFare.toLocaleString('en-IN')}</div>
                <div className="text-emerald-400">✅ 25% Advance Paid Online: ₹{dispatchBooking.advanceAmount.toLocaleString('en-IN')}</div>
                <div className="text-red-400 font-bold">💵 Cash to Collect: ₹{dispatchBooking.remainingAmount.toLocaleString('en-IN')}</div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t">
              <button
                type="button"
                onClick={() => setDispatchBooking(null)}
                className="px-4 py-2 text-slate-600 hover:text-slate-900 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleSendBookingToDriver(dispatchBooking)}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md transition-all active:scale-95"
              >
                <MessageCircle className="w-4 h-4 text-white" />
                <span>{lang === 'en' ? 'Open WhatsApp & Send Duty Slip' : 'వాట్సాప్‌లో డ్యూటీ స్లిప్ పంపండి'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
