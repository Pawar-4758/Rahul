import React, { useState } from 'react';
import { 
  X, Car, Phone, User, CheckCircle2, ShieldCheck, 
  Camera, MessageCircle, MapPin, Award, Check
} from 'lucide-react';
import { useTravelStore } from '../context/TravelStoreContext';
import { DriverPartner } from '../types';

interface DriverJoinModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'en' | 'te';
}

export const DriverJoinModal: React.FC<DriverJoinModalProps> = ({
  isOpen,
  onClose,
  lang
}) => {
  const { settings, addDriverPartner } = useTravelStore();

  const [partnerType, setPartnerType] = useState<'car_owner' | 'driver' | 'owner_driver'>('car_owner');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Hyderabad');
  const [vehicleModel, setVehicleModel] = useState('Swift Dzire');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [experienceYears, setExperienceYears] = useState(5);
  const [licenseNumber, setLicenseNumber] = useState('');
  const [driverPhoto, setDriverPhoto] = useState('');
  const [carPhoto, setCarPhoto] = useState('');

  // RC & Insurance fields
  const [rcStatus, setRcStatus] = useState<'valid' | 'expired' | 'renewing'>('valid');
  const [rcExpiryDate, setRcExpiryDate] = useState('2028-06-30');
  const [rcPhoto, setRcPhoto] = useState('');

  const [insuranceStatus, setInsuranceStatus] = useState<'valid' | 'expired' | 'due_soon'>('valid');
  const [insuranceCompany, setInsuranceCompany] = useState('ICICI Lombard General Insurance');
  const [customInsuranceCompany, setCustomInsuranceCompany] = useState('');
  const [insuranceExpiryDate, setInsuranceExpiryDate] = useState('2027-10-31');
  const [insurancePolicyNumber, setInsurancePolicyNumber] = useState('');
  const [insurancePhoto, setInsurancePhoto] = useState('');

  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length < 10) {
      alert(lang === 'en' ? 'Please enter a valid 10-digit mobile number' : 'దయచేసి సరైన 10 అంకెల మొబైల్ నంబర్ నమోదు చేయండి');
      return;
    }

    const driver: DriverPartner = {
      id: `partner-${Date.now()}`,
      fullName,
      phone,
      city,
      vehicleModel,
      vehicleNumber: vehicleNumber.toUpperCase(),
      experienceYears: Number(experienceYears),
      licenseNumber: licenseNumber.toUpperCase(),
      status: 'applied',
      appliedDate: new Date().toISOString().split('T')[0],
      photoUrl: driverPhoto,
      carPhotoUrl: carPhoto,
      partnerType,
      rcStatus,
      rcExpiryDate: rcStatus === 'valid' ? rcExpiryDate : '',
      rcPhotoUrl: rcPhoto,
      insuranceStatus,
      insuranceCompany: insuranceCompany === 'Other' ? (customInsuranceCompany || 'Other') : insuranceCompany,
      insurancePolicyNumber: insurancePolicyNumber.toUpperCase(),
      insuranceExpiryDate: insuranceStatus === 'valid' ? insuranceExpiryDate : '',
      insurancePhotoUrl: insurancePhoto
    };

    addDriverPartner(driver);
    setSubmitted(true);
  };

  const handleWhatsAppNotify = () => {
    const cleanNumber = settings.whatsapp.replace(/\D/g, '');
    const chosenCompany = insuranceCompany === 'Other' ? (customInsuranceCompany || 'Other') : insuranceCompany;
    const text = encodeURIComponent(
      `🚗 *CAR ATTACHMENT & DRIVER PARTNER APPLICATION*\n` +
      `*WAY ORA JOURNEYS OPERATIONS DESK*\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `👤 *Name:* ${fullName}\n` +
      `📞 *Phone:* ${phone}\n` +
      `📍 *Operating City:* ${city}\n` +
      `🏷️ *Partner Type:* ${partnerType === 'car_owner' ? 'Car Owner (Attachment)' : partnerType === 'owner_driver' ? 'Owner-cum-Driver' : 'Driver Partner'}\n` +
      `🚘 *Car Model:* ${vehicleModel}\n` +
      `🔢 *Vehicle Plate:* ${vehicleNumber.toUpperCase()}\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `📄 *RC Status:* ${rcStatus.toUpperCase()}${rcStatus === 'valid' ? ` (Exp: ${rcExpiryDate})` : ''}\n` +
      `🛡️ *Insurance Company:* ${chosenCompany}\n` +
      `🛡️ *Insurance Status:* ${insuranceStatus.toUpperCase()}${insuranceStatus === 'valid' ? ` (Exp: ${insuranceExpiryDate})` : ''}\n` +
      (insurancePolicyNumber ? `📋 *Policy No:* ${insurancePolicyNumber.toUpperCase()}\n` : '') +
      `👨‍✈️ *Experience:* ${experienceYears} Years\n` +
      (licenseNumber ? `🪪 *License No:* ${licenseNumber.toUpperCase()}\n` : '') +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `I want to attach my car with Way Ora Journeys. Please verify my details and start duty dispatch.`
    );
    window.open(`https://wa.me/${cleanNumber}?text=${text}`, '_blank');
  };

  const t = {
    en: {
      title: 'Drive With Way Ora Journeys',
      subtitle: 'Attach your car or join our verified chauffeur network with daily assured earnings',
      name: 'Driver Full Name',
      phone: 'Mobile Phone Number',
      city: 'Operating City / Hub',
      vehicleModel: 'Vehicle Model Owned / Driving',
      vehicleNumber: 'Vehicle Registration Plate Number',
      exp: 'Highway Driving Experience (Years)',
      license: 'Commercial Driving License Number',
      driverPhoto: 'Upload Driver Photo',
      carPhoto: 'Upload Car Front/Side Photo',
      submitBtn: 'Submit Driver Application',
      successTitle: 'Application Received Successfully!',
      successDesc: 'Thank you for applying to Way Ora Journeys. Our operations desk will review your driving license and contact you within 2 hours.',
      whatsappMsg: 'Send Application to WhatsApp Operations',
      benefits: [
        'Guaranteed transparent per-km payouts directly to your bank account',
        'Outstation highway trips, family pilgrimage packages & airport drops',
        'Daily driver bata allowances and timely round-trip payments',
        '24/7 Roadside breakdown & dispatch desk support'
      ]
    },
    te: {
      title: 'వే ఓరా జర్నీస్‌తో కలసి డ్రైవ్ చేయండి / కారు అటాచ్ చేయండి',
      subtitle: 'మీ కారును అటాచ్ చేసి లేదా డ్రైవర్‌గా జాయిన్ అయి స్థిరమైన రోజువారీ ఆదాయం పొందండి',
      name: 'డ్రైవర్ పూర్తి పేరు',
      phone: 'మొబైల్ ఫోన్ నంబర్',
      city: 'మీ నగరం / లొకేషన్',
      vehicleModel: 'కారు మోడల్ (Dzire, WagonR, Ertiga, Innova...)',
      vehicleNumber: 'కారు రిజిస్ట్రేషన్ నంబర్ (నంబర్ ప్లేట్)',
      exp: 'హైవే డ్రైవింగ్ అనుభవం (సంవత్సరాలు)',
      license: 'కమర్షియల్ డ్రైవింగ్ లైసెన్స్ నంబర్',
      driverPhoto: 'డ్రైవర్ ఫోటో అప్‌లోడ్',
      carPhoto: 'కారు ఫోటో అప్‌లోడ్',
      submitBtn: 'దరఖాస్తు సమర్పించండి',
      successTitle: 'మీ దరఖాస్తు విజయవంతంగా అందింది!',
      successDesc: 'వే ఓరా జర్నీస్‌లో చేరడానికి ఆసక్తి చూపినందుకు ధన్యవాదాలు. మా ఆపరేషన్స్ మేనేజర్ మీ లైసెన్స్ వివరాలను పరిశీలించి 2 గంటల్లో మీకు కాల్ చేస్తారు.',
      whatsappMsg: 'వాట్సాప్‌కు దరఖాస్తు వివరాలు పంపండి',
      benefits: [
        'సకాలంలో నేరుగా బ్యాంక్ ఖాతాకు పారదర్శక చెల్లింపులు',
        'అవుట్‌స్టేషన్ హైవే ట్రిప్పులు, తీర్థయాత్రలు మరియు ఎయిర్‌పోర్ట్ డ్రాప్స్',
        'రోజువారీ డ్రైవర్ బత్తా అలవెన్స్ మరియు గౌరవప్రదమైన వాతావరణం',
        '24/7 ఆపరేషన్స్ & రోడ్‌సైడ్ హెల్ప్ డెస్క్ మద్దతు'
      ]
    }
  }[lang];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full my-6 overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="p-5 sm:p-6 bg-slate-950 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-600/20 text-red-500 flex items-center justify-center font-bold">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold font-display text-white">
                {submitted ? t.successTitle : t.title}
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

        {!submitted ? (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            
            {/* Benefits Strip */}
            <div className="p-3.5 bg-red-50/70 border border-red-200/60 rounded-xl space-y-1.5 text-xs text-red-950">
              <span className="font-bold block text-[11px] text-red-900 uppercase tracking-wide">
                ⭐ Driver Benefits / డ్రైవర్ ప్రయోజనాలు:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
                {t.benefits.map((b, i) => (
                  <div key={i} className="flex items-start gap-1.5 text-[11px] text-slate-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-red-600 mt-0.5 shrink-0" />
                    <span>{b}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Partner Role Selector */}
            <div className="space-y-1.5">
              <label className="block text-slate-700 font-bold uppercase text-[10px]">
                {lang === 'en' ? 'Select Your Attachment Type / రోల్ ఎంచుకోండి:' : 'మీరు ఏ విధంగా జాయిన్ అవ్వాలనుకుంటున్నారు:'}
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPartnerType('car_owner')}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                    partnerType === 'car_owner'
                      ? 'border-red-600 bg-red-50 text-red-950 font-bold ring-1 ring-red-600 shadow-2xs'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <span className="text-base block mb-0.5">🚗</span>
                  <span className="text-xs font-bold block">{lang === 'en' ? 'Car Owner' : 'కార్ ఓనర్'}</span>
                  <span className="text-[10px] text-slate-500 block truncate">{lang === 'en' ? 'Attach Car' : 'కారు అటాచ్'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPartnerType('owner_driver')}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                    partnerType === 'owner_driver'
                      ? 'border-red-600 bg-red-50 text-red-950 font-bold ring-1 ring-red-600 shadow-2xs'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <span className="text-base block mb-0.5">🚗👨‍✈️</span>
                  <span className="text-xs font-bold block">{lang === 'en' ? 'Owner-Driver' : 'ఓనర్-డ్రైవర్'}</span>
                  <span className="text-[10px] text-slate-500 block truncate">{lang === 'en' ? 'Owns & Drives' : 'స్వంత డ్రైవ్'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPartnerType('driver')}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                    partnerType === 'driver'
                      ? 'border-red-600 bg-red-50 text-red-950 font-bold ring-1 ring-red-600 shadow-2xs'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <span className="text-base block mb-0.5">👨‍✈️</span>
                  <span className="text-xs font-bold block">{lang === 'en' ? 'Chauffeur' : 'డ్రైవర్'}</span>
                  <span className="text-[10px] text-slate-500 block truncate">{lang === 'en' ? 'Driver Only' : 'డ్రైవింగ్'}</span>
                </button>
              </div>
            </div>

            {/* Input Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-bold uppercase text-[10px] mb-1">
                  {partnerType === 'car_owner' ? (lang === 'en' ? 'Car Owner Full Name *' : 'కార్ ఓనర్ పూర్తి పేరు *') : `${t.name} *`}
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Ramesh Kumar"
                    className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold uppercase text-[10px] mb-1">
                  {t.phone} *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="9876543210"
                    className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500 font-mono font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold uppercase text-[10px] mb-1">
                  {t.city} *
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500 font-medium"
                >
                  <option value="Hyderabad">Hyderabad</option>
                  <option value="Vijayawada">Vijayawada</option>
                  <option value="Visakhapatnam">Visakhapatnam</option>
                  <option value="Tirupati">Tirupati</option>
                  <option value="Bangalore">Bangalore</option>
                  <option value="Guntur">Guntur</option>
                  <option value="Rajahmundry">Rajahmundry</option>
                  <option value="Warangal">Warangal</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold uppercase text-[10px] mb-1">
                  {t.vehicleModel} *
                </label>
                <input
                  type="text"
                  required
                  value={vehicleModel}
                  onChange={(e) => setVehicleModel(e.target.value)}
                  placeholder="e.g. Maruti Dzire, WagonR, Ertiga, Innova Crysta..."
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold uppercase text-[10px] mb-1">
                  {t.vehicleNumber} *
                </label>
                <input
                  type="text"
                  required
                  value={vehicleNumber}
                  onChange={(e) => setVehicleNumber(e.target.value.toUpperCase())}
                  placeholder="TS 09 UB 1234"
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500 font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold uppercase text-[10px] mb-1">
                  {t.exp} *
                </label>
                <select
                  value={experienceYears}
                  onChange={(e) => setExperienceYears(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500 font-medium"
                >
                  <option value={2}>2 - 4 Years</option>
                  <option value={5}>5 - 7 Years</option>
                  <option value={8}>8 - 10 Years</option>
                  <option value={12}>10+ Years Highway Experience</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-bold uppercase text-[10px] mb-1">
                {t.license} {partnerType === 'car_owner' ? '(Optional for Fleet Owner)' : '*'}
              </label>
              <input
                type="text"
                required={partnerType !== 'car_owner'}
                value={licenseNumber}
                onChange={(e) => setLicenseNumber(e.target.value.toUpperCase())}
                placeholder="e.g. AP1620180012345"
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500 font-mono"
              />
            </div>

            {/* RC VALIDITY & DETAILS SECTION */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                  📄 {lang === 'en' ? 'RC (Registration Certificate) Status' : 'ఆర్సీ (RC) స్థితి & చెల్లుబాటు'}
                </span>
                <span className="text-[10px] font-semibold text-slate-500">Government Registered</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-slate-600 font-medium text-[11px] mb-1">
                    {lang === 'en' ? 'Is RC Valid?' : 'ఆర్సీ చెల్లుబాటులో ఉందా?'}
                  </label>
                  <div className="flex items-center gap-2">
                    {[
                      { val: 'valid', label: lang === 'en' ? 'Valid' : 'చెల్లుబాటు' },
                      { val: 'expired', label: lang === 'en' ? 'Expired' : 'గడువు ముగిసింది' },
                      { val: 'renewing', label: lang === 'en' ? 'Renewing' : 'రెన్యూవల్' }
                    ].map(st => (
                      <button
                        key={st.val}
                        type="button"
                        onClick={() => setRcStatus(st.val as any)}
                        className={`flex-1 py-1 px-2 rounded-lg text-xs font-semibold border transition-all ${
                          rcStatus === st.val
                            ? st.val === 'valid'
                              ? 'bg-emerald-600 text-white border-emerald-600'
                              : 'bg-amber-600 text-white border-amber-600'
                            : 'bg-white text-slate-700 border-slate-300'
                        }`}
                      >
                        {st.label}
                      </button>
                    ))}
                  </div>
                </div>

                {rcStatus === 'valid' && (
                  <div>
                    <label className="block text-slate-600 font-medium text-[11px] mb-1">
                      {lang === 'en' ? 'RC Expiry Date' : 'ఆర్సీ గడువు తేదీ'}
                    </label>
                    <input
                      type="date"
                      value={rcExpiryDate}
                      onChange={(e) => setRcExpiryDate(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* VEHICLE INSURANCE & COMPANY SECTION */}
            <div className="p-3.5 bg-amber-50/70 border border-amber-200/80 rounded-xl space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-amber-950 text-xs flex items-center gap-1.5">
                  🛡️ {lang === 'en' ? 'Commercial / Comprehensive Insurance' : 'వాహన ఇన్సూరెన్స్ & కంపెనీ వివరాలు'}
                </span>
                <span className="text-[10px] font-semibold text-amber-800">Mandatory for Passenger Trips</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-slate-700 font-medium text-[11px] mb-1">
                    {lang === 'en' ? 'Insurance Status' : 'ఇన్సూరెన్స్ స్టేటస్'}
                  </label>
                  <div className="flex items-center gap-2">
                    {[
                      { val: 'valid', label: lang === 'en' ? 'Valid Active' : 'యాక్టివ్' },
                      { val: 'due_soon', label: lang === 'en' ? 'Due Soon' : 'త్వరలో ముగింపు' },
                      { val: 'expired', label: lang === 'en' ? 'Expired' : 'ముగిసింది' }
                    ].map(ins => (
                      <button
                        key={ins.val}
                        type="button"
                        onClick={() => setInsuranceStatus(ins.val as any)}
                        className={`flex-1 py-1 px-2 rounded-lg text-xs font-semibold border transition-all ${
                          insuranceStatus === ins.val
                            ? ins.val === 'valid'
                              ? 'bg-emerald-600 text-white border-emerald-600'
                              : 'bg-rose-600 text-white border-rose-600'
                            : 'bg-white text-slate-700 border-slate-300'
                        }`}
                      >
                        {ins.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-medium text-[11px] mb-1">
                    {lang === 'en' ? 'Insurance Company Name *' : 'ఇన్సూరెన్స్ కంపెనీ పేరు *'}
                  </label>
                  <select
                    value={insuranceCompany}
                    onChange={(e) => setInsuranceCompany(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500 font-medium"
                  >
                    <option value="ICICI Lombard General Insurance">ICICI Lombard General Insurance</option>
                    <option value="HDFC ERGO General Insurance">HDFC ERGO General Insurance</option>
                    <option value="Go Digit General Insurance">Go Digit General Insurance</option>
                    <option value="Tata AIG General Insurance">Tata AIG General Insurance</option>
                    <option value="The New India Assurance Co.">The New India Assurance Co.</option>
                    <option value="Bajaj Allianz General Insurance">Bajaj Allianz General Insurance</option>
                    <option value="Reliance General Insurance">Reliance General Insurance</option>
                    <option value="Star Health & Allied Insurance">Star Health & Allied Insurance</option>
                    <option value="National Insurance Co.">National Insurance Co.</option>
                    <option value="Cholamandalam MS">Cholamandalam MS</option>
                    <option value="Other">Other Insurance Provider...</option>
                  </select>
                </div>

                {insuranceCompany === 'Other' && (
                  <div className="sm:col-span-2">
                    <label className="block text-slate-700 font-medium text-[11px] mb-1">
                      {lang === 'en' ? 'Enter Insurance Company Name' : 'ఇన్సూరెన్స్ కంపెనీ పేరు నమోదు చేయండి'}
                    </label>
                    <input
                      type="text"
                      value={customInsuranceCompany}
                      onChange={(e) => setCustomInsuranceCompany(e.target.value)}
                      placeholder="e.g. Royal Sundaram, Oriental Insurance..."
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-slate-700 font-medium text-[11px] mb-1">
                    {lang === 'en' ? 'Insurance Expiry Date' : 'ఇన్సూరెన్స్ గడువు తేదీ'}
                  </label>
                  <input
                    type="date"
                    value={insuranceExpiryDate}
                    onChange={(e) => setInsuranceExpiryDate(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-medium text-[11px] mb-1">
                    {lang === 'en' ? 'Policy Number (Optional)' : 'పాలసీ నంబర్ (ఐచ్ఛికం)'}
                  </label>
                  <input
                    type="text"
                    value={insurancePolicyNumber}
                    onChange={(e) => setInsurancePolicyNumber(e.target.value)}
                    placeholder="e.g. POL-9812471876"
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500 font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Photos Upload */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <span className="font-bold text-slate-700 block text-[11px]">{t.driverPhoto}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) {
                      const r = new FileReader();
                      r.onloadend = () => setDriverPhoto(r.result as string);
                      r.readAsDataURL(f);
                    }
                  }}
                  className="w-full text-xs text-slate-500 file:mr-2 file:py-1 file:px-2.5 file:rounded file:border-0 file:text-[11px] file:bg-slate-900 file:text-white"
                />
                {driverPhoto && <span className="text-[10px] text-emerald-600 block">✓ Photo Attached</span>}
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <span className="font-bold text-slate-700 block text-[11px]">{t.carPhoto}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) {
                      const r = new FileReader();
                      r.onloadend = () => setCarPhoto(r.result as string);
                      r.readAsDataURL(f);
                    }
                  }}
                  className="w-full text-xs text-slate-500 file:mr-2 file:py-1 file:px-2.5 file:rounded file:border-0 file:text-[11px] file:bg-slate-900 file:text-white"
                />
                {carPhoto && <span className="text-[10px] text-emerald-600 block">✓ Car Photo Attached</span>}
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all"
              >
                {t.submitBtn}
              </button>
            </div>

          </form>
        ) : (
          /* Confirmation Screen */
          <div className="p-8 text-center space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
              <Check className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h4 className="text-xl font-bold text-slate-900 font-display">
                {t.successTitle}
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed max-w-md mx-auto">
                {t.successDesc}
              </p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-left text-xs space-y-1 text-slate-800 font-mono max-w-sm mx-auto">
              <div><strong>Driver:</strong> {fullName} ({phone})</div>
              <div><strong>Vehicle:</strong> {vehicleModel} ({vehicleNumber})</div>
              <div><strong>City:</strong> {city}</div>
            </div>

            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={handleWhatsAppNotify}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{t.whatsappMsg}</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
              >
                Close Window
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
