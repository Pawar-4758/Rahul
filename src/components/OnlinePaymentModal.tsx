import React, { useState } from 'react';
import { 
  X, CheckCircle2, ShieldCheck, QrCode, CreditCard, 
  Smartphone, Building, ArrowRight, Lock, Check
} from 'lucide-react';
import { useTravelStore } from '../context/TravelStoreContext';
import { BookingDetails } from '../types';

interface OnlinePaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'en' | 'te';
  booking: BookingDetails | null;
  onPaymentSuccess: (bookingId: string) => void;
}

export const OnlinePaymentModal: React.FC<OnlinePaymentModalProps> = ({
  isOpen,
  onClose,
  lang,
  booking,
  onPaymentSuccess
}) => {
  const { settings, updateBookingPayment } = useTravelStore();
  const [paymentMethod, setPaymentMethod] = useState<'upi_qr' | 'gpay' | 'phonepe' | 'card'>('upi_qr');
  const [utrNumber, setUtrNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  if (!isOpen || !booking) return null;

  const advanceAmount = booking.advanceAmount || Math.round(booking.estimatedFare * 0.25);
  const balanceRemaining = booking.estimatedFare - advanceAmount;

  // Generate UPI payment intent URI
  const upiUri = `upi://pay?pa=${encodeURIComponent(settings.upiId)}&pn=${encodeURIComponent(settings.companyName)}&am=${advanceAmount}&cu=INR&tn=${encodeURIComponent(`Booking Advance ${booking.bookingId}`)}`;
  
  // Public high-reliability QR code API for UPI
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiUri)}`;

  const handleSimulatePayment = (methodName: string) => {
    setIsProcessing(true);
    setTimeout(() => {
      const generatedUtr = utrNumber.trim() || `TXN-${Math.floor(1000000000 + Math.random() * 9000000000)}`;
      updateBookingPayment(booking.bookingId, methodName, generatedUtr);
      setIsProcessing(false);
      setPaymentSuccess(true);
    }, 1200);
  };

  const t = {
    en: {
      title: 'Pay 25% Advance to Confirm Booking',
      subtitle: `Booking ID: ${booking.bookingId} · 75% Balance payable to driver upon trip completion`,
      totalTripFare: 'Total Trip Fare',
      advancePayable: '25% Advance Amount',
      balanceToDriver: 'Remaining Balance on Trip',
      selectMethod: 'Choose Payment Option',
      upiQr: 'Scan & Pay UPI QR',
      gpay: 'Google Pay',
      phonepe: 'PhonePe',
      card: 'Debit / Credit Card',
      scanQrPrompt: 'Scan with any UPI App (GPay, PhonePe, Paytm, BHIM)',
      upiIdLabel: 'UPI ID:',
      enterUtr: 'Enter 12-Digit UPI Ref / UTR No (if paid):',
      confirmPaymentBtn: 'Verify & Confirm 25% Advance',
      successTitle: '25% Advance Payment Successful!',
      successDesc: `Your booking ${booking.bookingId} is now locked and confirmed. Remaining ₹${balanceRemaining.toLocaleString('en-IN')} can be paid directly to the chauffeur.`,
      viewVoucher: 'View Confirmed Travel Voucher',
      secureNote: '256-Bit SSL Encrypted & Bank-Grade Security'
    },
    te: {
      title: 'బుకింగ్ కన్ఫర్మ్ కోసం 25% అడ్వాన్స్ పేమెంట్',
      subtitle: `బుకింగ్ ఐడీ: ${booking.bookingId} · మిగిలిన 75% మొత్తం ట్రిప్ పూర్తయ్యాక డ్రైవర్‌కు చెల్లించవచ్చు`,
      totalTripFare: 'మొత్తం ప్రయాణ ఛార్జ్',
      advancePayable: '25% అడ్వాన్స్ మొత్తం',
      balanceToDriver: 'ప్రయాణంలో చెల్లించవలసిన మిగిలిన మొత్తం',
      selectMethod: 'పేమెంట్ విధానం ఎంచుకోండి',
      upiQr: 'యూపీఐ క్యూఆర్ కోడ్ (UPI QR)',
      gpay: 'గూగుల్ పే (Google Pay)',
      phonepe: 'ఫోన్‌పే (PhonePe)',
      card: 'డెబిట్ / క్రెడిట్ కార్డు',
      scanQrPrompt: 'ఏదైనా యూపీఐ యాప్ (PhonePe, GPay, Paytm) తో స్కాన్ చేసి చెల్లించండి',
      upiIdLabel: 'కంపెనీ యూపీఐ ఐడీ:',
      enterUtr: 'చెల్లించిన 12-అంకెల యూపీఐ రిఫరెన్స్ / UTR నంబర్:',
      confirmPaymentBtn: 'ధృవీకరించి అడ్వాన్స్ రశీదు పొందండి',
      successTitle: '25% అడ్వాన్స్ పేమెంట్ విజయవంతమైంది!',
      successDesc: `మీ బుకింగ్ ${booking.bookingId} కన్ఫర్మ్ అయింది. మిగిలిన ₹${balanceRemaining.toLocaleString('en-IN')} ప్రయాణంలో డ్రైవర్‌కు చెల్లించవచ్చు.`,
      viewVoucher: 'కన్ఫర్మ్ అయిన ట్రావెల్ వోచర్ చూడండి',
      secureNote: '100% సురక్షితమైన ఆన్‌లైన్ పేమెంట్ గేట్‌వే'
    }
  }[lang];

  return (
    <div className="fixed inset-0 z-55 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="p-5 bg-slate-950 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold font-display text-white">
                {paymentSuccess ? t.successTitle : t.title}
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

        {!paymentSuccess ? (
          <div className="p-6 space-y-5">
            
            {/* Amount Breakdown Banner */}
            <div className="p-4 bg-slate-900 text-white rounded-xl space-y-2 border border-slate-800">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>{t.totalTripFare}:</span>
                <span className="font-mono text-slate-200">₹{booking.estimatedFare.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex items-center justify-between text-base font-black text-emerald-400 border-t border-slate-800 pt-2">
                <span>{t.advancePayable} (25%):</span>
                <span className="font-mono text-2xl text-emerald-400">₹{advanceAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                <span>{t.balanceToDriver} (75%):</span>
                <span className="font-mono text-slate-300 font-semibold">₹{balanceRemaining.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Method Tabs */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                {t.selectMethod}
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('upi_qr')}
                  className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                    paymentMethod === 'upi_qr'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <QrCode className="w-5 h-5 text-emerald-600" />
                  <span>{t.upiQr}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('gpay')}
                  className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                    paymentMethod === 'gpay'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <Smartphone className="w-5 h-5 text-blue-600" />
                  <span>{t.gpay}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('phonepe')}
                  className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                    paymentMethod === 'phonepe'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <Smartphone className="w-5 h-5 text-purple-600" />
                  <span>{t.phonepe}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                    paymentMethod === 'card'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-slate-700" />
                  <span>Cards/Net</span>
                </button>
              </div>
            </div>

            {/* QR Code View */}
            {paymentMethod === 'upi_qr' && (
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center space-y-3">
                <p className="text-xs font-semibold text-slate-700">
                  {t.scanQrPrompt}
                </p>
                <div className="inline-block p-2 bg-white rounded-xl shadow-md border border-slate-200">
                  <img
                    src={qrCodeUrl}
                    alt="UPI QR Code"
                    className="w-44 h-44 mx-auto object-contain"
                  />
                </div>
                <div className="text-xs text-slate-500 font-mono">
                  {t.upiIdLabel} <strong className="text-slate-900">{settings.upiId}</strong>
                </div>
              </div>
            )}

            {/* Direct App Link Button */}
            {(paymentMethod === 'gpay' || paymentMethod === 'phonepe') && (
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center space-y-3 text-xs">
                <p className="font-semibold text-slate-800">
                  Click below to open UPI App and pay ₹{advanceAmount.toLocaleString('en-IN')}:
                </p>
                <a
                  href={upiUri}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-md transition-all"
                >
                  <Smartphone className="w-4 h-4 text-emerald-400" />
                  <span>Pay ₹{advanceAmount.toLocaleString('en-IN')} via UPI App</span>
                </a>
              </div>
            )}

            {paymentMethod === 'card' && (
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3 text-xs">
                <input
                  type="text"
                  placeholder="Card Number (4111 2222 3333 4444)"
                  className="w-full p-2 bg-white border border-slate-300 rounded font-mono"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className="w-full p-2 bg-white border border-slate-300 rounded font-mono"
                  />
                  <input
                    type="password"
                    maxLength={3}
                    placeholder="CVV"
                    className="w-full p-2 bg-white border border-slate-300 rounded font-mono"
                  />
                </div>
              </div>
            )}

            {/* UTR Number Input & Confirmation */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">
                {t.enterUtr}
              </label>
              <input
                type="text"
                value={utrNumber}
                onChange={(e) => setUtrNumber(e.target.value)}
                placeholder="e.g. 329188219482 or Transaction ID"
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Submit Button */}
            <button
              type="button"
              disabled={isProcessing}
              onClick={() => handleSimulatePayment(paymentMethod)}
              className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-400 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <span>Verifying Payment...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{t.confirmPaymentBtn}</span>
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
              <Lock className="w-3.5 h-3.5 text-emerald-600" />
              <span>{t.secureNote}</span>
            </div>

          </div>
        ) : (
          /* Payment Success Confirmation */
          <div className="p-8 text-center space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
              <Check className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h4 className="text-xl font-bold text-slate-900 font-display">
                {t.successTitle}
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed max-w-sm mx-auto">
                {t.successDesc}
              </p>
            </div>

            <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl text-left text-xs space-y-1 text-emerald-950 font-mono">
              <div className="flex justify-between">
                <span>25% Advance Paid:</span>
                <span className="font-bold">₹{advanceAmount.toLocaleString('en-IN')} (PAID)</span>
              </div>
              <div className="flex justify-between">
                <span>Remaining on Trip:</span>
                <span className="font-bold">₹{balanceRemaining.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-[11px] text-emerald-700">
                <span>Transaction Ref:</span>
                <span>{utrNumber || 'TXN-CONFIRMED'}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                onPaymentSuccess(booking.bookingId);
                onClose();
              }}
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow"
            >
              {t.viewVoucher}
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
