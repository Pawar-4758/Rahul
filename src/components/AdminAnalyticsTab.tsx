import React, { useState } from 'react';
import { 
  ResponsiveContainer, AreaChart, Area, BarChart, Bar, 
  XAxis, YAxis, Tooltip, CartesianGrid, Legend 
} from 'recharts';
import { 
  TrendingUp, Star, Award, IndianRupee, ShieldCheck, 
  Clock, ArrowUpRight, CheckCircle2, MessageCircle, 
  Calendar, Car, UserCheck, Sparkles 
} from 'lucide-react';
import { DriverPartner, BookingDetails, CompanySettings } from '../types';

interface AdminAnalyticsTabProps {
  drivers: DriverPartner[];
  bookings: BookingDetails[];
  settings: CompanySettings;
  lang: 'en' | 'te';
  onSendDutyToDriver?: (booking: BookingDetails) => void;
}

export const AdminAnalyticsTab: React.FC<AdminAnalyticsTabProps> = ({
  drivers,
  bookings,
  settings,
  lang
}) => {
  const [timeRange, setTimeRange] = useState<'30days' | '90days' | 'year'>('30days');

  // Revenue & Trends Data for Recharts
  const monthlyRevenueData = [
    { month: 'Jun 2026', totalRevenue: 385000, advanceCollected: 96250, trips: 142 },
    { month: 'Jul 2026', totalRevenue: 420000, advanceCollected: 105000, trips: 156 },
    { month: 'Aug 2026', totalRevenue: 468000, advanceCollected: 117000, trips: 168 },
    { month: 'Sep 2026', totalRevenue: 512000, advanceCollected: 128000, trips: 184 },
    { month: 'Oct 2026', totalRevenue: 558000, advanceCollected: 139500, trips: 198 }
  ];

  // Top-performing drivers data
  const topDriversData = drivers
    .map(d => ({
      name: d.fullName.split(' ')[0] + ' ' + (d.fullName.split(' ')[1]?.charAt(0) || ''),
      fullName: d.fullName,
      trips: d.tripsCompleted || Math.floor(Math.random() * 80 + 70),
      revenue: d.monthlyRevenue || Math.floor(Math.random() * 50000 + 80000),
      rating: d.rating || 4.85,
      car: d.vehicleModel,
      city: d.city,
      phone: d.phone,
      onTimeRate: d.onTimeRate || 97
    }))
    .sort((a, b) => (b.rating * 100 + b.trips) - (a.rating * 100 + a.trips));

  // Rating distribution data
  const driverRatingsData = [
    { ratingRange: '5 Stars ★', count: 18, percentage: '72%' },
    { ratingRange: '4.8 - 4.9 ★', count: 6, percentage: '24%' },
    { ratingRange: '4.5 - 4.7 ★', count: 1, percentage: '4%' },
    { ratingRange: '< 4.5 ★', count: 0, percentage: '0%' }
  ];

  // Aggregated Metrics
  const totalRevenueGenerated = 558000;
  const totalAdvanceCollected = 139500;
  const totalTripsCount = 748;
  const averageDriverRating = (
    topDriversData.reduce((acc, d) => acc + d.rating, 0) / (topDriversData.length || 1)
  ).toFixed(2);

  return (
    <div className="space-y-6">
      
      {/* Header with Time Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <TrendingUp className="w-4 h-4" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 font-display">
              {lang === 'en' ? 'Agent & Fleet Performance Analytics' : 'ఏజెంట్ & డ్రైవర్ పెర్ఫార్మెన్స్ అనలిటిక్స్'}
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {lang === 'en' 
              ? 'Real-time revenue metrics, top-performing driver partners, ratings and trip distributions' 
              : 'నెలవారీ మొత్తం ఆదాయం, అత్యుత్తమ డ్రైవర్లు, రేటింగ్‌లు మరియు ట్రిప్పుల గణాంకాలు'}
          </p>
        </div>

        <div className="flex items-center gap-1.5 self-start sm:self-auto bg-slate-100 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setTimeRange('30days')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              timeRange === '30days' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {lang === 'en' ? 'Last 30 Days' : 'గత 30 రోజులు'}
          </button>
          <button
            type="button"
            onClick={() => setTimeRange('90days')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              timeRange === '90days' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {lang === 'en' ? 'Quarter (90d)' : 'త్రైమాసికం'}
          </button>
          <button
            type="button"
            onClick={() => setTimeRange('year')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              timeRange === 'year' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {lang === 'en' ? 'Year 2026' : 'ఈ సంవత్సరం'}
          </button>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        
        {/* Total Monthly Revenue */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="font-semibold">{lang === 'en' ? 'Total Monthly Revenue' : 'నెలవారీ మొత్తం ఆదాయం'}</span>
            <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
              <IndianRupee className="w-4 h-4" />
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-black font-display text-slate-900">
            ₹{totalRevenueGenerated.toLocaleString('en-IN')}
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-emerald-600 font-semibold">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+14.8% vs last month</span>
          </div>
        </div>

        {/* 25% Advance Paid Online */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="font-semibold">{lang === 'en' ? '25% Advance Collected' : '25% ఆన్‌లైన్ అడ్వాన్స్'}</span>
            <span className="p-1.5 rounded-lg bg-red-50 text-red-600">
              <ShieldCheck className="w-4 h-4" />
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-black font-display text-slate-900">
            ₹{totalAdvanceCollected.toLocaleString('en-IN')}
          </div>
          <div className="mt-2 text-[11px] text-slate-500">
            {lang === 'en' ? 'Received via UPI QR & GPay' : 'యూపీఐ ద్వారా నేరుగా అందింది'}
          </div>
        </div>

        {/* Total Trips Completed */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="font-semibold">{lang === 'en' ? 'Total Completed Trips' : 'పూర్తయిన ట్రిప్పులు'}</span>
            <span className="p-1.5 rounded-lg bg-sky-50 text-sky-600">
              <Car className="w-4 h-4" />
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-black font-display text-slate-900">
            {totalTripsCount} <span className="text-xs font-normal text-slate-500">trips</span>
          </div>
          <div className="mt-2 text-[11px] text-sky-600 font-semibold">
            ✓ 98.4% on-time completion
          </div>
        </div>

        {/* Average Driver Rating */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="font-semibold">{lang === 'en' ? 'Fleet Average Rating' : 'సగటు డ్రైవర్ రేటింగ్'}</span>
            <span className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
              <Star className="w-4 h-4 fill-amber-400" />
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-black font-display text-amber-600 flex items-center gap-1.5">
            <span>{averageDriverRating}</span>
            <span className="text-xs font-bold text-slate-500">/ 5.0</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500">
            {lang === 'en' ? 'Based on 640+ customer reviews' : '640+ కస్టమర్ రివ్యూల ఆధారంగా'}
          </div>
        </div>

      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        
        {/* CHART 1: Total Monthly Revenue & 25% Advance Trends (Recharts AreaChart) */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-slate-900 font-display flex items-center gap-2">
                <span>📈 {lang === 'en' ? 'Monthly Revenue Growth & Online Advance' : 'నెలవారీ ఆదాయ వృద్ధి & 25% అడ్వాన్స్'}</span>
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {lang === 'en' ? 'Gross booking revenue vs 25% online advance collections' : 'మొత్తం బుకింగ్ వాల్యూ మరియు ఆన్‌లైన్ అడ్వాన్స్'}
              </p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyRevenueData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0.0}/>
                  </linearGradient>
                  <linearGradient id="advanceGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.5}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis 
                  tick={{ fontSize: 10, fill: '#64748b' }} 
                  axisLine={false} 
                  tickLine={false} 
                  tickFormatter={(val) => `₹${val / 1000}k`} 
                />
                <Tooltip 
                  formatter={(val: any) => [`₹${Number(val).toLocaleString('en-IN')}`, '']}
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', color: '#fff', fontSize: '11px', border: 'none' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Area 
                  type="monotone" 
                  dataKey="totalRevenue" 
                  name={lang === 'en' ? 'Total Revenue (₹)' : 'మొత్తం ఆదాయం (₹)'} 
                  stroke="#ef4444" 
                  strokeWidth={2.5} 
                  fillOpacity={1} 
                  fill="url(#revenueGradient)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="advanceCollected" 
                  name={lang === 'en' ? '25% Advance Paid (₹)' : '25% అడ్వాన్స్ (₹)'} 
                  stroke="#10b981" 
                  strokeWidth={2} 
                  fillOpacity={1} 
                  fill="url(#advanceGradient)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CHART 2: Top-Performing Drivers: Trips & Revenue Generated (Recharts BarChart) */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-slate-900 font-display flex items-center gap-2">
                <span>🚗 {lang === 'en' ? 'Top-Performing Drivers (Trips Completed)' : 'అత్యధిక ట్రిప్పులు పూర్తి చేసిన టాప్ డ్రైవర్లు'}</span>
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {lang === 'en' ? 'Number of highway outstation and round trips completed' : 'డ్రైవర్లు విజయవంతంగా పూర్తి చేసిన ప్రయాణాలు'}
              </p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topDriversData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip 
                  formatter={(val: any) => [`${val} Trips`, 'Completed']}
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', color: '#fff', fontSize: '11px', border: 'none' }}
                />
                <Bar 
                  dataKey="trips" 
                  name={lang === 'en' ? 'Trips Completed' : 'పూర్తయిన ట్రిప్పులు'} 
                  fill="#dc2626" 
                  radius={[6, 6, 0, 0]} 
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Driver Quality & Rating Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* Rating Breakdown Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3.5">
          <div className="flex items-center justify-between border-b pb-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              ⭐ {lang === 'en' ? 'Driver Star Rating Breakdown' : 'స్టార్ రేటింగ్ వర్గీకరణ'}
            </h4>
            <span className="text-[10px] font-bold bg-amber-50 text-amber-700 px-2 py-0.5 rounded">
              High Quality
            </span>
          </div>

          <div className="space-y-2.5 text-xs">
            {driverRatingsData.map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-slate-700 font-semibold text-[11px]">
                  <span>{item.ratingRange}</span>
                  <span className="text-slate-500 font-mono">{item.count} drivers ({item.percentage})</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-amber-400 h-2 rounded-full transition-all"
                    style={{ width: item.percentage }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t text-[11px] text-slate-500 flex items-center justify-between">
            <span>Customer Satisfaction</span>
            <span className="font-bold text-emerald-600">99.2% Positive</span>
          </div>
        </div>

        {/* Top-Performing Drivers Leaderboard (Spans 2 Columns) */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between border-b pb-2.5">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-500" />
                <span>{lang === 'en' ? 'Top-Performing Driver Partners' : 'అత్యుత్తమ పనితీరు కనబరిచిన డ్రైవర్లు'}</span>
              </h4>
              <p className="text-[11px] text-slate-500">
                {lang === 'en' ? 'Ranked by customer rating, completed trips & on-time arrival' : 'కస్టమర్ రేటింగ్ మరియు పూర్తి చేసిన ట్రిప్పుల ఆధారంగా'}
              </p>
            </div>
            <span className="text-[11px] font-bold text-slate-500">
              Active Fleet: {topDriversData.length}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] text-slate-500 uppercase tracking-wider">
                  <th className="py-2 px-1">Rank</th>
                  <th className="py-2 px-2">Driver Name</th>
                  <th className="py-2 px-2">Car Model</th>
                  <th className="py-2 px-2 text-center">Rating</th>
                  <th className="py-2 px-2 text-center">Trips</th>
                  <th className="py-2 px-2 text-right">Monthly Revenue</th>
                  <th className="py-2 px-2 text-center">On-Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {topDriversData.map((d, index) => (
                  <tr key={index} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-2.5 px-1 font-bold text-slate-500">
                      {index === 0 ? '🥇 #1' : index === 1 ? '🥈 #2' : index === 2 ? '🥉 #3' : `#${index + 1}`}
                    </td>
                    <td className="py-2.5 px-2">
                      <div className="font-bold text-slate-900">{d.fullName}</div>
                      <div className="text-[10px] text-slate-500">{d.city} · {d.phone}</div>
                    </td>
                    <td className="py-2.5 px-2 text-slate-700">
                      <div className="font-medium truncate max-w-[140px]">{d.car}</div>
                    </td>
                    <td className="py-2.5 px-2 text-center">
                      <div className="inline-flex items-center gap-1 bg-amber-50 border border-amber-200/60 px-1.5 py-0.5 rounded font-bold text-amber-800 text-[11px]">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                        <span>{d.rating}</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-2 text-center font-mono font-bold text-slate-800">
                      {d.trips}
                    </td>
                    <td className="py-2.5 px-2 text-right font-mono font-bold text-emerald-700">
                      ₹{d.revenue.toLocaleString('en-IN')}
                    </td>
                    <td className="py-2.5 px-2 text-center">
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                        {d.onTimeRate}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
};
