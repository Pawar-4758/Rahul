import React from 'react';
import { ShieldCheck, Sparkles, Navigation, HeartHandshake, Award } from 'lucide-react';

interface WhyChooseUsProps {
  lang: 'en' | 'te';
}

export const WhyChooseUs: React.FC<WhyChooseUsProps> = ({ lang }) => {
  const t = {
    en: {
      kicker: 'The Way Ora Standard',
      title: 'Why Thousands of Families & Travelers Trust Us',
      subtitle: 'We are not an anonymous ride-hailing app that leaves you stranded. Every trip is executed with dedicated vehicle care and experienced drivers.',
      features: [
        {
          num: '01',
          title: 'Police-Verified Senior Drivers',
          desc: 'All chauffeurs undergo commercial driving licensing verification, background checks, and highway behavior tests. Polite, punctual, and non-smoking.',
          proof: '100% verified with zero tolerance for rash driving.'
        },
        {
          num: '02',
          title: 'Daily Sanitized & Chilled AC Fleet',
          desc: 'Vehicles receive deep cleaning, vacuuming, and mechanical inspection before every departure. Chilled AC, fresh fragrance, and clean seat covers guaranteed.',
          proof: 'Regular tyre, brake & AC compressor health logs.'
        },
        {
          num: '03',
          title: 'Transparent Per-Km Billing Guarantee',
          desc: 'No arbitrary surge multipliers during holidays or rain. Driver allowance (bata), night travel charges, and per-km rates are declared transparently before the trip starts.',
          proof: 'Clear start/end odometer reading recorded in your presence.'
        },
        {
          num: '04',
          title: '24/7 Journey Support & Emergency Assistance',
          desc: 'Our central dispatch desk monitors highway trips in real time. In the rare event of a mechanical puncture or roadblock, immediate replacement support is provided.',
          proof: 'Dedicated operational hubs across South India.'
        }
      ]
    },
    te: {
      kicker: 'వే ఓరా జర్నీస్ నాణ్యతా ప్రమాణాలు',
      title: 'వేలాది కుటుంబాలు మమ్మల్ని ఎందుకు ఎంచుకుంటాయి?',
      subtitle: 'మేము కేవలం సాధారణ కార్ బుకింగ్ మాత్రమే కాదు; మీ ప్రతి ప్రయాణం సురక్షితంగా, ఆనందంగా సాగేలా బాధ్యత తీసుకుంటాము.',
      features: [
        {
          num: '01',
          title: 'పోలీస్ వెరిఫైడ్ సీనియర్ డ్రైవర్లు',
          desc: 'మర్యాదపూర్వక ప్రవర్తన, జాతీయ రహదారులపై దీర్ఘకాలిక అనుభవం, ఘాట్ రోడ్లలో సురక్షిత డ్రైవింగ్ కలిగిన నమ్మకమైన డ్రైవర్లు మాత్రమే ఉంటారు.',
          proof: 'కుటుంబాలకు, మహిళలకు మరియు వృద్ధులకు 100% భరోసా.'
        },
        {
          num: '02',
          title: 'పరిశుభ్రమైన, శానిటైజ్ చేయబడిన కార్లు',
          desc: 'ప్రతి ట్రిప్‌కు ముందు కారును పూర్తిగా వాష్ చేసి, శానిటైజ్ చేస్తాము. మంచి సువాసన, శుభ్రమైన సీట్ కవర్లు, చల్లని ఏసీ తప్పనిసరి.',
          proof: 'ఎప్పటికప్పుడు మెకానికల్ సర్వీసింగ్ చేయబడిన కార్లు.'
        },
        {
          num: '03',
          title: 'స్పష్టమైన, పారదర్శకమైన బిల్లింగ్',
          desc: 'పండుగలు లేదా వర్షాల సమయంలో అదనపు సర్జ్ ఛార్జీలు ఉండవు. ఓడోమీటర్ కిలోమీటర్లు మరియు డ్రైవర్ బత్తా మీ సమక్షంలోనే పారదర్శకంగా లెక్కిస్తాము.',
          proof: 'ఎలాంటి దాగివున్న హిడెన్ ఛార్జీలు లేవు.'
        },
        {
          num: '04',
          title: '24/7 కస్టమర్ సపోర్ట్ & సహాయం',
          desc: 'మీ ప్రయాణం పూర్తయ్యే వరకు మా టీమ్ అండగా ఉంటుంది. ఏదైనా అత్యవసర పరిస్థితి లేదా బ్రేక్‌డౌన్ ఎదురైతే వెంటనే ప్రత్యామ్నాయ కారు సదుపాయం.',
          proof: 'సౌత్ ఇండియా వ్యాప్తంగా సర్వీస్ నెట్‌వర్క్.'
        }
      ]
    }
  }[lang];

  return (
    <section className="py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-3xl mb-16">
          <div className="text-xs font-bold uppercase tracking-wider text-amber-700 mb-2">
            {t.kicker}
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-display tracking-tight text-balance">
            {t.title}
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600">
            {t.subtitle}
          </p>
        </div>

        {/* Editorial Feature List (No slop, natural editorial numbering) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {t.features.map((item, idx) => (
            <div
              key={idx}
              className="border-t border-slate-200 pt-6 flex flex-col justify-between"
            >
              <div>
                <span className="font-mono text-sm font-bold text-amber-700 tracking-wider">
                  {item.num}.
                </span>
                <h3 className="text-xl font-bold text-slate-900 font-display mt-1">
                  {item.title}
                </h3>
                <p className="mt-2.5 text-sm text-slate-600 leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 text-xs font-medium text-slate-500 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{item.proof}</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
