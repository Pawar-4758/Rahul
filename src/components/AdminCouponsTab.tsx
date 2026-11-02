import React, { useState } from 'react';
import { 
  Tag, Plus, Trash2, CheckCircle2, AlertCircle, 
  Clock, Calendar, Percent, IndianRupee, Copy, Check 
} from 'lucide-react';
import { Coupon } from '../types';

interface AdminCouponsTabProps {
  coupons: Coupon[];
  onAddCoupon: (coupon: Coupon) => void;
  onUpdateCoupon: (id: string, updated: Partial<Coupon>) => void;
  onDeleteCoupon: (id: string) => void;
  lang: 'en' | 'te';
  onToast: (msg: string) => void;
}

export const AdminCouponsTab: React.FC<AdminCouponsTabProps> = ({
  coupons,
  onAddCoupon,
  onUpdateCoupon,
  onDeleteCoupon,
  lang,
  onToast
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // How many days to run coupon state
  const [durationPreset, setDurationPreset] = useState<number | 'custom'>(30);
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [discountValue, setDiscountValue] = useState<number>(10);
  const [minBookingAmount, setMinBookingAmount] = useState<number>(1500);
  const [validUntil, setValidUntil] = useState<string>(() => {
    const d = new Date(Date.now() + 30 * 86400000);
    return d.toISOString().split('T')[0];
  });
  const [description, setDescription] = useState('');
  const [descriptionTe, setDescriptionTe] = useState('');

  const handleSelectDays = (days: number) => {
    setDurationPreset(days);
    const targetDate = new Date(Date.now() + days * 86400000);
    setValidUntil(targetDate.toISOString().split('T')[0]);
  };

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = code.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (!cleanCode) {
      alert(lang === 'en' ? 'Please enter a valid coupon code (e.g. WAYORA10)' : 'దయచేసి సరైన కూపన్ కోడ్ నమోదు చేయండి');
      return;
    }

    if (coupons.some(c => c.code.toUpperCase() === cleanCode)) {
      alert(lang === 'en' ? `Coupon "${cleanCode}" already exists!` : `"${cleanCode}" కూపన్ ఇప్పటికే ఉంది!`);
      return;
    }

    const newCouponItem: Coupon = {
      id: `coupon-${Date.now()}`,
      code: cleanCode,
      discountType,
      discountValue: Number(discountValue),
      minBookingAmount: Number(minBookingAmount) || 0,
      validUntil,
      isActive: true,
      description: description.trim() || `${discountType === 'percentage' ? `${discountValue}% OFF` : `₹${discountValue} OFF`} on Outstation Bookings`,
      descriptionTe: descriptionTe.trim() || `${discountType === 'percentage' ? `${discountValue}% తగ్గింపు` : `₹${discountValue} తగ్గింపు`}`,
      usageCount: 0
    };

    onAddCoupon(newCouponItem);
    setShowCreateModal(false);
    setCode('');
    setDescription('');
    setDescriptionTe('');
    onToast(lang === 'en' ? `Coupon ${cleanCode} created successfully!` : `${cleanCode} కూపన్ విజయవంతంగా సృష్టించబడింది!`);
  };

  const handleCopyCode = (couponCode: string) => {
    navigator.clipboard.writeText(couponCode);
    setCopiedCode(couponCode);
    setTimeout(() => setCopiedCode(null), 2000);
    onToast(`Copied ${couponCode} to clipboard!`);
  };

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-6">
      
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center font-bold">
              <Tag className="w-4 h-4" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 font-display">
              {lang === 'en' ? 'Promotional Coupons & Discount Codes' : 'కూపన్లు & ప్రమోషనల్ డిస్కౌంట్లు'}
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {lang === 'en' 
              ? 'Create instant discount codes, set validity duration (number of days), and track redemption' 
              : 'కొత్త కూపన్లు సృష్టించండి, ఎన్ని రోజులు నడవాలో నిర్ణయించండి మరియు చెల్లుబాటు గడువు నిర్వహించండి'}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-sm active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{lang === 'en' ? 'Create New Coupon' : 'కొత్త కూపన్ సృష్టించండి'}</span>
        </button>
      </div>

      {/* Coupons Table / Grid */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            {lang === 'en' ? 'Active & Available Coupons' : 'అందుబాటులో ఉన్న కూపన్లు'} ({coupons.length})
          </span>
          <span className="text-[11px] text-slate-500">
            {lang === 'en' ? 'Customers can apply these during 25% advance booking' : 'బుకింగ్ సమయంలో కస్టమర్లు వీటిని వాడవచ్చు'}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[10px] text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Coupon Code</th>
                <th className="py-3 px-4">Discount Value</th>
                <th className="py-3 px-4">Min. Booking</th>
                <th className="py-3 px-4">Valid Until / Duration</th>
                <th className="py-3 px-4 text-center">Usage Count</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {coupons.map((c) => {
                const isExpired = c.validUntil && c.validUntil < todayStr;
                const daysRemaining = c.validUntil 
                  ? Math.max(0, Math.ceil((new Date(c.validUntil).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
                  : null;

                return (
                  <tr key={c.id || c.code} className="hover:bg-slate-50/60 transition-colors">
                    
                    {/* Code */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs sm:text-sm bg-red-50 text-red-700 border border-red-200 px-2.5 py-1 rounded-lg tracking-wider">
                          {c.code}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopyCode(c.code)}
                          className="text-slate-400 hover:text-slate-700 p-1 rounded"
                          title="Copy Code"
                        >
                          {copiedCode === c.code ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-1 max-w-[220px] truncate">
                        {lang === 'en' ? c.description : (c.descriptionTe || c.description)}
                      </div>
                    </td>

                    {/* Discount Value */}
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {c.discountType === 'percentage' ? (
                        <span className="text-emerald-700 font-mono text-sm">{c.discountValue}% OFF</span>
                      ) : (
                        <span className="text-emerald-700 font-mono text-sm">₹{c.discountValue} FLAT OFF</span>
                      )}
                    </td>

                    {/* Min Booking */}
                    <td className="py-3.5 px-4 font-mono text-slate-600">
                      {c.minBookingAmount ? `₹${c.minBookingAmount.toLocaleString('en-IN')}` : 'No Minimum'}
                    </td>

                    {/* Valid Until / Duration */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 text-xs font-medium text-slate-800">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{c.validUntil}</span>
                      </div>
                      <div className="mt-1">
                        {isExpired ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                            🔴 Expired
                          </span>
                        ) : daysRemaining !== null ? (
                          <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                            daysRemaining <= 3 
                              ? 'bg-amber-50 text-amber-800 border-amber-200' 
                              : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          }`}>
                            <Clock className="w-3 h-3" />
                            <span>{daysRemaining === 0 ? 'Expires Today' : `${daysRemaining} days remaining`}</span>
                          </span>
                        ) : null}
                      </div>
                    </td>

                    {/* Usage Count */}
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-700">
                      {c.usageCount || 0} times
                    </td>

                    {/* Status Toggle */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => onUpdateCoupon(c.id, { isActive: !c.isActive })}
                        className={`text-[11px] font-bold px-2.5 py-1 rounded-full transition-colors cursor-pointer ${
                          c.isActive && !isExpired
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                        }`}
                      >
                        {c.isActive && !isExpired ? 'Active' : 'Disabled'}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(lang === 'en' ? `Delete coupon "${c.code}"?` : `"${c.code}" కూపన్‌ను తొలగించాలా?`)) {
                            onDeleteCoupon(c.id);
                            onToast(`Deleted ${c.code}`);
                          }
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Delete Coupon"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE NEW COUPON MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
            
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-red-500" />
                <h4 className="text-sm font-bold font-display">
                  {lang === 'en' ? 'Create New Discount Coupon' : 'కొత్త డిస్కౌంట్ కూపన్ సృష్టించండి'}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCoupon} className="p-5 space-y-4 text-xs">
              
              {/* Coupon Code */}
              <div>
                <label className="block text-slate-700 font-bold uppercase text-[10px] mb-1">
                  {lang === 'en' ? 'Coupon Code (Promo Code) *' : 'కూపన్ కోడ్ (Promo Code) *'}
                </label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="e.g. WAYORA20, DIWALI500, SUMMERTRIP"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono font-bold uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              {/* Discount Type & Value */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold uppercase text-[10px] mb-1">
                    {lang === 'en' ? 'Discount Type' : 'తగ్గింపు రకం'}
                  </label>
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="percentage">Percentage (% OFF)</option>
                    <option value="fixed">Flat Amount (₹ OFF)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold uppercase text-[10px] mb-1">
                    {discountType === 'percentage' ? 'Percentage (%) *' : 'Flat Discount (₹) *'}
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={discountType === 'percentage' ? 50 : 5000}
                    required
                    value={discountValue}
                    onChange={(e) => setDiscountValue(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>

              {/* Min Booking Amount */}
              <div>
                <label className="block text-slate-700 font-bold uppercase text-[10px] mb-1">
                  {lang === 'en' ? 'Minimum Booking Fare (₹)' : 'కనీస బుకింగ్ మొత్తం (₹)'}
                </label>
                <input
                  type="number"
                  min={0}
                  step={100}
                  value={minBookingAmount}
                  onChange={(e) => setMinBookingAmount(Number(e.target.value))}
                  placeholder="e.g. 1500 (Set 0 for No Minimum)"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              {/* HOW MANY DAYS RUN THE COUPON (Requested Feature) */}
              <div className="p-3.5 bg-red-50/70 border border-red-200/80 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-red-950 font-bold uppercase text-[10px]">
                    ⏱️ {lang === 'en' ? 'How Many Days Should This Coupon Run? *' : 'ఈ కూపన్ ఎన్ని రోజులు అమలులో ఉండాలి? *'}
                  </label>
                  <span className="text-[10px] font-bold text-red-700">Auto Expiry</span>
                </div>

                <div className="grid grid-cols-4 gap-1.5">
                  {[
                    { days: 7, label: '7 Days' },
                    { days: 15, label: '15 Days' },
                    { days: 30, label: '30 Days' },
                    { days: 60, label: '60 Days' }
                  ].map((preset) => (
                    <button
                      key={preset.days}
                      type="button"
                      onClick={() => handleSelectDays(preset.days)}
                      className={`py-1.5 px-2 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                        durationPreset === preset.days
                          ? 'bg-red-600 text-white border-red-600 shadow-2xs'
                          : 'bg-white text-slate-700 border-slate-300 hover:border-slate-400'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>

                <div className="pt-1.5 flex items-center justify-between text-xs">
                  <span className="text-slate-600 font-medium">
                    {lang === 'en' ? 'Exact Expiry Date:' : 'గడువు ముగిసే తేదీ:'}
                  </span>
                  <input
                    type="date"
                    required
                    value={validUntil}
                    onChange={(e) => {
                      setValidUntil(e.target.value);
                      setDurationPreset('custom');
                    }}
                    className="px-2.5 py-1 bg-white border border-slate-300 rounded-lg text-xs font-mono font-bold text-slate-900"
                  />
                </div>
              </div>

              {/* Descriptions */}
              <div className="space-y-2">
                <div>
                  <label className="block text-slate-700 font-bold uppercase text-[10px] mb-1">
                    {lang === 'en' ? 'Offer Description (English)' : 'ఆఫర్ వివరణ (ఇంగ్లీష్)'}
                  </label>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="e.g. 15% OFF on Outstation trips"
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold uppercase text-[10px] mb-1">
                    {lang === 'en' ? 'Offer Description (Telugu - Optional)' : 'ఆఫర్ వివరణ (తెలుగు - ఐచ్ఛికం)'}
                  </label>
                  <input
                    type="text"
                    value={descriptionTe}
                    onChange={(e) => setDescriptionTe(e.target.value)}
                    placeholder="e.g. అవుట్‌స్టేషన్ ట్రిప్పులపై 15% ప్రత్యేక తగ్గింపు"
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                >
                  {lang === 'en' ? 'Publish Coupon' : 'కూపన్ జారీ చేయండి'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
