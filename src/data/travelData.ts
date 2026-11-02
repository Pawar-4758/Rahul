import { Vehicle, PopularRoute, TourPackage, Testimonial } from '../types';

export const VEHICLES: Vehicle[] = [
  {
    id: 'hatchback-wagonr',
    name: 'WagonR / Compact AC',
    category: 'hatchback',
    models: 'Maruti Suzuki WagonR / Celerio',
    seats: 4,
    luggage: 2,
    ac: true,
    ratePerKm: 10,
    minKmPerDay: 250,
    driverAllowancePerDay: 350,
    hourlyRate: 180,
    baseKmHourly: 10,
    imageUrl: '/cars/wagonr.jpg',
    features: ['Chilled Air Conditioning', 'Tall Boy High Headroom', 'City & Short Highway Travel', 'Verified Polite Chauffeur'],
    featuresTe: ['చల్లని ఎయిర్ కండిషనింగ్', 'విశాలమైన హెడ్‌రూమ్', 'సిటీ & అవుట్‌స్టేషన్ ప్రయాణాలు', 'మర్యాదపూర్వక డ్రైవర్'],
    bestFor: 'Solo, Couples & Budget Travelers (Up to 4 people)',
    bestForTe: 'బడ్జెట్ ప్రయాణాలు, ఇద్దరు లేదా ముగ్గురు ప్రయాణికులకు సరసమైన ఎంపిక',
    popular: true
  },
  {
    id: 'sedan-prime',
    name: 'Prime Sedan',
    category: 'sedan',
    models: 'Maruti Suzuki Dzire / Toyota Etios / Honda Amaze',
    seats: 4,
    luggage: 2,
    ac: true,
    ratePerKm: 12,
    minKmPerDay: 300,
    driverAllowancePerDay: 400,
    hourlyRate: 220,
    baseKmHourly: 10,
    imageUrl: '/cars/dzire_etios.jpg',
    features: ['Clean Air Conditioning', 'Bluetooth Audio & USB Charger', 'Comfortable Rear Legroom', 'Experienced Chauffeur'],
    featuresTe: ['క్లీన్ ఎయిర్ కండిషనింగ్', 'బ్లూటూత్ ఆడియో & మొబైల్ ఛార్జర్', 'సౌకర్యవంతమైన లెగ్రూమ్', 'అనుభవజ్ఞుడైన డ్రైవర్'],
    bestFor: 'Couples, Solo Travelers & Small Families (Up to 4 people)',
    bestForTe: 'చిన్న కుటుంబాలు మరియు ఇద్దరు-ముగ్గురు ప్రయాణికులకు అనుకూలం',
    popular: true
  },
  {
    id: 'mpv-family',
    name: 'Family MPV',
    category: 'suv',
    models: 'Maruti Suzuki Ertiga / Kia Carens',
    seats: 6,
    luggage: 3,
    ac: true,
    ratePerKm: 15,
    minKmPerDay: 300,
    driverAllowancePerDay: 450,
    hourlyRate: 280,
    baseKmHourly: 10,
    imageUrl: '/cars/ertiga.jpg',
    features: ['Dual AC Vents for all 3 Rows', 'Foldable Seats for extra luggage', 'Smooth Highway Ride', 'Professional Highway Driver'],
    featuresTe: ['అన్ని సీట్లకు డ్యూయల్ ఏసీ', 'ఎక్కువ లగేజ్ కోసం ఫోల్డబుల్ సీట్లు', 'హైవేలో సాఫీగా సాగే ప్రయాణం', 'ప్రొఫెషనల్ హైవే డ్రైవర్'],
    bestFor: 'Families of 5-6, Long Highway Outstation Trips',
    bestForTe: '5 నుండి 6 మంది కుటుంబ సభ్యులకు మరియు సుదూర ప్రయాణాలకు ఉత్తమం',
    popular: true
  },
  {
    id: 'suv-luxury',
    name: 'Executive SUV (Innova Crysta)',
    category: 'suv',
    models: 'Toyota Innova Crysta / Hycross',
    seats: 7,
    luggage: 4,
    ac: true,
    ratePerKm: 19,
    minKmPerDay: 300,
    driverAllowancePerDay: 500,
    hourlyRate: 350,
    baseKmHourly: 10,
    imageUrl: '/cars/innova.jpg',
    features: ['Captain Recliner Seats', 'Superior Highway Suspension', 'Massive Boot Space', 'Senior Highway Specialist Driver'],
    featuresTe: ['కెప్టెన్ రెక్లైనింగ్ సీట్లు', 'అద్భుతమైన సస్పెన్షన్ సౌకర్యం', 'విశాలమైన బూట్ స్పేస్', 'సీనియర్ హైవే నిపుణులైన డ్రైవర్'],
    bestFor: 'VIP Business, Family Vacations & Hill Station Trips',
    bestForTe: 'వీఐపీ ప్రయాణాలు, కుటుంబ విహారయాత్రలు, ఘాట్ రోడ్ ప్రయాణాలకు ది బెస్ట్',
    popular: true
  },
  {
    id: 'luxury-premium',
    name: 'Royal SUV (Toyota Fortuner)',
    category: 'luxury',
    models: 'Toyota Fortuner 4x4 / Legender',
    seats: 7,
    luggage: 4,
    ac: true,
    ratePerKm: 34,
    minKmPerDay: 300,
    driverAllowancePerDay: 700,
    hourlyRate: 650,
    baseKmHourly: 10,
    imageUrl: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80',
    features: ['All-Terrain Dominance', 'Ultra-Premium Leather Interiors', 'VIP Road Presence', 'Elite Uniformed Chauffeur'],
    featuresTe: ['రాయల్ లుక్ & ఆధునిక లగ్జరీ', 'ప్రీమియం లెదర్ ఇంటీరియర్స్', 'వీఐపీ ప్రోటోకాల్ అనుభవం', 'యూనిఫాం ధరించిన ప్రొఫెషనల్ డ్రైవర్'],
    bestFor: 'Weddings, VIP Delegations & Luxury Road Escapes',
    bestForTe: 'పెళ్లిళ్లు, వీఐపీ ప్రముఖుల ప్రయాణాలు, లగ్జరీ అనుభవం కోసం'
  },
  {
    id: 'tempo-traveller',
    name: 'Force Urbania / Luxury Tempo',
    category: 'tempo',
    models: 'Force Urbania / Luxury Traveller 12-17 Seater',
    seats: 14,
    luggage: 10,
    ac: true,
    ratePerKm: 26,
    minKmPerDay: 350,
    driverAllowancePerDay: 700,
    hourlyRate: 550,
    baseKmHourly: 10,
    imageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
    features: ['Pushback Reclining Seats', 'Individual AC Vents & Ambient Lighting', 'Big Screen LED TV & Sound System', 'Large Luggage Compartment'],
    featuresTe: ['పుష్‌బ్యాక్ లగ్జరీ సీట్లు', 'ప్రతి సీటుకు విడి ఏసీ వెంట్స్', 'ఎల్ఈడీ టీవీ మరియు ప్రీమియం సౌండ్ సిస్టమ్', 'విశాలమైన లగేజ్ డిక్కీ'],
    bestFor: 'Group Tours, Pilgrimages, Wedding Parties & Corporate Offsites',
    bestForTe: 'తీర్థయాత్రల బృందాలు, వివాహ బృందాలు, ఆఫీస్ టూర్లకు ప్రత్యేకమైనది'
  }
];

export const POPULAR_ROUTES: PopularRoute[] = [
  {
    id: 'hyd-vja',
    from: 'Hyderabad',
    to: 'Vijayawada',
    distanceKm: 275,
    durationHours: '4h 45m',
    popularCar: 'Prime Sedan / Ertiga',
    startingPrice: 3850,
    category: 'outstation'
  },
  {
    id: 'hyd-sri',
    from: 'Hyderabad',
    to: 'Srisailam Temple',
    distanceKm: 215,
    durationHours: '4h 15m',
    popularCar: 'Innova Crysta / Ertiga',
    startingPrice: 3600,
    category: 'pilgrimage'
  },
  {
    id: 'hyd-tpt',
    from: 'Hyderabad',
    to: 'Tirupati Balaji',
    distanceKm: 560,
    durationHours: '9h 30m',
    popularCar: 'Innova Crysta',
    startingPrice: 7800,
    category: 'pilgrimage'
  },
  {
    id: 'vizag-araku',
    from: 'Visakhapatnam',
    to: 'Araku Valley',
    distanceKm: 115,
    durationHours: '3h 15m',
    popularCar: 'Innova Crysta / Dzire',
    startingPrice: 2200,
    category: 'hills'
  },
  {
    id: 'vja-raj',
    from: 'Vijayawada',
    to: 'Rajahmundry',
    distanceKm: 160,
    durationHours: '3h 30m',
    popularCar: 'Prime Sedan',
    startingPrice: 2450,
    category: 'outstation'
  },
  {
    id: 'blr-coorg',
    from: 'Bangalore',
    to: 'Coorg (Madikeri)',
    distanceKm: 265,
    durationHours: '5h 30m',
    popularCar: 'Innova Crysta / Ertiga',
    startingPrice: 4200,
    category: 'hills'
  },
  {
    id: 'blr-ooty',
    from: 'Bangalore',
    to: 'Ooty Hills',
    distanceKm: 280,
    durationHours: '6h 00m',
    popularCar: 'Innova Crysta',
    startingPrice: 4600,
    category: 'hills'
  },
  {
    id: 'hyd-wgl',
    from: 'Hyderabad',
    to: 'Warangal & Ramappa',
    distanceKm: 150,
    durationHours: '2h 45m',
    popularCar: 'Prime Sedan',
    startingPrice: 2300,
    category: 'outstation'
  }
];

export const TOUR_PACKAGES: TourPackage[] = [
  {
    id: 'pkg-araku',
    title: 'Araku Valley & Borra Caves Scenic Mountain Getaway',
    titleTe: 'అరకు లోయ మరియు బొర్రా గుహల విహారయాత్ర',
    destination: 'Araku Valley & Visakhapatnam',
    destinationTe: 'అరకు లోయ & విశాఖపట్నం',
    duration: '2 Days / 1 Night',
    durationTe: '2 రోజులు / 1 రాత్రి',
    distanceKm: 320,
    startingPrice: 6499,
    category: 'hills',
    summary: 'Traverse the picturesque Ananthagiri Ghat roads, explore million-year-old Borra caves, scenic coffee plantations, Chaparai water cascades, and Katiki waterfalls with a skilled mountain driver.',
    summaryTe: 'అనంతగిరి ఘాట్ రోడ్లు, ప్రసిద్ధ బొర్రా గుహలు, కాఫీ తోటలు, చాపరాయి జలపాతాలను చూసే అద్భుతమైన టూర్ ప్యాకేజీ.',
    inclusions: [
      'Chauffeured AC car for the complete trip',
      'Driver food & night stay allowance included',
      'All toll gate & parking charges included',
      'Flexible sightseeing stops along ghat route',
      'Clean bottled mineral water on arrival'
    ],
    inclusionsTe: [
      'టూర్ మొత్తం ఏసీ కారు & నిపుణుడైన డ్రైవర్',
      'డ్రైవర్ భోజనం మరియు నైట్ స్టే ఛార్జీలు కలిపి',
      'అన్ని టోల్ గేట్ మరియు పార్కింగ్ ఛార్జీలు కలిపి',
      'మీ ఇష్టానుసారం నచ్చిన ప్రదేశాల్లో ఆగి చూసే వెసులుబాటు',
      'మినరల్ వాటర్ బాటిల్స్ ఉచితం'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Vizag to Araku via Borra Caves',
        titleTe: 'విశాఖ నుండి బొర్రా గుహల మీదుగా అరకు',
        description: 'Morning pickup from Vizag city or railway station. Scenic drive through Eastern Ghats curves. Explore ancient limestone Borra Caves and sample Bamboo Chicken. Visit Tyda Jungle Bells and evening check-in at Araku resort.',
        descriptionTe: 'ఉదయం పికప్, అందమైన ఘాట్ రోడ్ల మీదుగా ప్రయాణం. బొర్రా గుహల సందర్శన, ప్రసిద్ధ బ్యాంబు చికెన్ రుచులు. సాయంత్రం అరకు చేరుకుని రిసార్ట్ లో బస.',
        spots: ['Ananthagiri Coffee Plantations', 'Borra Caves & Katiki Road', 'Tyda Nature Park', 'Tribal Museum Araku']
      },
      {
        day: 2,
        title: 'Araku Sightseeing & Return to Vizag',
        titleTe: 'అరకు లోకల్ సైట్ సీయింగ్ & తిరుగు ప్రయాణం',
        description: 'Sunrise at Padmapuram Botanical Gardens, visit soothing Chaparai Water Cascade, taste freshly roasted Araku Arabica coffee at the Coffee Museum, then scenic descent back to Vizag by dusk.',
        descriptionTe: 'పద్మాపురం గార్డెన్స్, చాపరాయి వాటర్ ఫాల్స్, అరకు కాఫీ మ్యూజియం సందర్శన. సాయంత్రం విశాఖకు క్షేమంగా తిరుగు ప్రయాణం.',
        spots: ['Padmapuram Gardens', 'Chaparai Cascades', 'Coffee House & Museum', 'Eastern Ghats View Point']
      }
    ],
    recommendedVehicle: 'Toyota Innova Crysta or Maruti Ertiga'
  },
  {
    id: 'pkg-tirupati',
    title: 'Tirupati Balaji & Kanipakam Divine Pilgrimage Tour',
    titleTe: 'తిరుపతి బాలాజీ మరియు కాణిపాకం దివ్య క్షేత్ర దర్శనం',
    destination: 'Tirumala, Tirupati & Kanipakam',
    destinationTe: 'తిరుమల, తిరుపతి & కాణిపాకం',
    duration: '3 Days / 2 Nights',
    durationTe: '3 రోజులు / 2 రాత్రులు',
    distanceKm: 1180,
    startingPrice: 14999,
    category: 'pilgrimage',
    summary: 'Hassle-free spiritual car trip from your doorstep directly to Tirupati. Dedicated driver who knows Tirumala gate guidelines, Alipiri checkpost timings, and local temple circuits.',
    summaryTe: 'మీ ఇంటి వద్దనుండి తిరుపతికి నేరుగా సౌకర్యవంతమైన కార్ ప్రయాణం. అలిపిరి, తిరుమల దర్శనం మరియు ఇతర ఆలయాల సందర్శన కోసం అనుభవజ్ఞుడైన డ్రైవర్ సేవలు.',
    inclusions: [
      'Round-trip doorstep pickup & drop in sanitized car',
      'Chauffeur experienced with Tirumala ghat ascent & descent',
      'All Interstate road taxes & Toll plaza fees included',
      'Driver night stay & food allowances covered',
      'Complimentary assistance with local temple schedules'
    ],
    inclusionsTe: [
      'ఇంటి నుండే పికప్ & డ్రాప్ సౌకర్యం',
      'తిరుమల ఘాట్ రోడ్ ప్రయాణంలో నిపుణుడైన డ్రైవర్',
      'అన్ని టోల్ గేట్లు మరియు రోడ్ టాక్స్‌లు కలిపి',
      'డ్రైవర్ అలవెన్సులు పూర్తిగా కలిపి ఉంటాయి',
      'స్థానిక ఆలయాల సమయాలు మరియు మార్గదర్శకత్వం'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Doorstep Departure to Tirupati',
        titleTe: 'తిరుపతికి సౌకర్యవంతమైన హైవే జర్నీ',
        description: 'Early morning departure on smooth national highways. Stop at clean family restaurants for lunch. Check-in at Tirupati foothills hotel by afternoon. Evening visit to Padmavathi Ammavari Temple at Tiruchanur.',
        descriptionTe: 'ఉదయం ప్రయాణం ప్రారంభం. మధ్యాహ్నం తిరుపతి హోటల్ చెకిన్. సాయంత్రం తిరుచానూరు శ్రీ పద్మావతి అమ్మవారి ఆలయ దర్శనం.',
        spots: ['Highway Travel Comfort', 'Tirupati Hotel Check-in', 'Tiruchanur Padmavathi Temple', 'ISKON Tirupati']
      },
      {
        day: 2,
        title: 'Tirumala Balaji Darshan & Sacred Temples',
        titleTe: 'తిరుమల శ్రీవారి దర్శనం & పరిసర పుణ్యక్షేత్రాలు',
        description: 'Scenic morning drive up the Tirumala ghat road. Lord Venkateswara Balaji Darshan, collecting laddu prasadam, visiting Silathoranam rock formation, Papavinasanam falls, and Japali Hanuman Theertham.',
        descriptionTe: 'ఉదయం తిరుమల ఘాట్ రోడ్ మీదుగా కొండపైకి. శ్రీ వేంకటేశ్వర స్వామి దర్శనం, లడ్డూ ప్రసాదం, శిలాతోరణం, జాపాలి హనుమాన్ దర్శనం.',
        spots: ['Tirumala Srivari Temple', 'Silathoranam', 'Papavinasanam', 'Kapila Theertham']
      },
      {
        day: 3,
        title: 'Kanipakam Varasiddhi Vinayaka & Safe Return',
        titleTe: 'కాణిపాకం వినాయక దర్శనం & తిరుగు ప్రయాణం',
        description: 'Morning checkout and drive to Kanipakam to seek blessings of Sri Varasiddhi Vinayaka Swamy. Safe and relaxed return journey back home with memories of a peaceful pilgrimage.',
        descriptionTe: 'కాణిపాకం వరసిద్ధి వినాయక స్వామి దర్శనం. భోజనానంతరం క్షేమంగా తిరుగు ప్రయాణం.',
        spots: ['Kanipakam Temple', 'Highway Return Drive', 'Doorstep Drop']
      }
    ],
    recommendedVehicle: 'Toyota Innova Crysta or Force Urbania for families'
  },
  {
    id: 'pkg-srisailam',
    title: 'Srisailam Mallikarjuna Jyotirlinga & Nallamala Forest Road Trip',
    titleTe: 'శ్రీశైలం మల్లికార్జున జ్యోతిర్లింగ & నల్లమల అడవుల ప్రయాణం',
    destination: 'Srisailam & Nallamala Hills',
    destinationTe: 'శ్రీశైలం & నల్లమల కొండలు',
    duration: '2 Days / 1 Night',
    durationTe: '2 రోజులు / 1 రాత్రి',
    distanceKm: 480,
    startingPrice: 7200,
    category: 'pilgrimage',
    summary: 'Travel through the dense Nallamala Tiger Reserve forest, witness the majestic Srisailam Dam on the Krishna River, and take holy darshan of Mallikarjuna Swamy & Bhramaramba Devi Shakti Peeth.',
    summaryTe: 'దట్టమైన నల్లమల అడవులు, అందమైన శ్రీశైలం డ్యామ్ మరియు శ్రీ భ్రమరాంబ మల్లికార్జున స్వామి వార్ల దర్శనార్థం ప్రశాంతమైన టూర్.',
    inclusions: [
      'Round-trip AC car with forest route experienced driver',
      'Forest checkpost & Toll taxes included',
      'Sightseeing at Srisailam Dam viewpoint & Pathalaganga ropeway base',
      'Zero surge or surprise driver fuel charges'
    ],
    inclusionsTe: [
      'నల్లమల ఘాట్ రోడ్ డ్రైవింగ్ లో అనుభవజ్ఞుడైన డ్రైవర్',
      'అన్ని టోల్ టాక్స్‌లు మరియు ఫారెస్ట్ ఎంట్రీ ఫీజులు కలిపి',
      'శ్రీశైలం డ్యామ్, పాతాళగంగ వ్యూ పాయింట్స్ సందర్శన',
      'ఎలాంటి అదనపు హిడెన్ ఛార్జీలు లేవు'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Nallamala Forest Drive & Evening Aarti',
        titleTe: 'నల్లమల అడవుల గుండా ప్రయాణం & సాయంత్ర దర్శనం',
        description: 'Drive through verdant tiger reserve ghats. Photo stop at Mannanur viewpoint and the majestic Krishna river barrage. Evening Mangala Harathi at Sri Mallikarjuna Swamy Temple.',
        descriptionTe: 'నల్లమల అడవుల గుండా ఉల్లాసకరమైన ప్రయాణం. శ్రీశైలం డ్యామ్ వ్యూ, సాయంత్రం శ్రీ భ్రమరాంబ మల్లికార్జున స్వామి వారి దర్శనం.',
        spots: ['Nallamala Forest Ghats', 'Srisailam Dam View', 'Sri Mallikarjuna Temple', 'Sakshi Ganapathi']
      },
      {
        day: 2,
        title: 'Pathalaganga, Shikharam & Return',
        titleTe: 'పాతాళగంగ, శిఖరేశ్వరం & తిరుగు ప్రయాణం',
        description: 'Morning visit to Pathalaganga holy river steps, Shikharam vantage point where entire temple complex is visible, and Paladhara Panchadhara springs before smooth return home.',
        descriptionTe: 'పాతాళగంగ స్నానం లేదా బోటింగ్, శిఖరేశ్వరం దర్శనం, పాలధార పంచధార సందర్శన అనంతరం తిరుగు ప్రయాణం.',
        spots: ['Pathalaganga', 'Shikhareswaram', 'Paladhara Panchadhara', 'Safe Home Drop']
      }
    ],
    recommendedVehicle: 'Maruti Ertiga or Prime Sedan'
  },
  {
    id: 'pkg-ooty-coorg',
    title: 'Western Ghats Queen: Ooty, Coorg & Mysore Grand Tour',
    titleTe: 'పశ్చిమ కనుమల అందాలు: ఊటీ, కూర్గ్ & మైసూర్ గ్రాండ్ టూర్',
    destination: 'Coorg, Ooty & Mysore',
    destinationTe: 'కూర్గ్, ఊటీ & మైసూర్',
    duration: '4 Days / 3 Nights',
    durationTe: '4 రోజులు / 3 రాత్రులు',
    distanceKm: 980,
    startingPrice: 19500,
    category: 'hills',
    summary: 'The ultimate South India hill retreat. Coffee estates of Coorg, tea gardens & toy train peaks of Ooty, and the grand illuminated palace of Mysore in high luxury comfort.',
    summaryTe: 'కూర్గ్ కాఫీ తోటలు, ఊటీ టీ ఎస్టేట్స్ మరియు మైసూర్ ప్యాలెస్ చూసే లగ్జరీ రోడ్ ట్రిప్.',
    inclusions: [
      'Chauffeured luxury SUV with interstate permits for AP/TS/KA/TN',
      'All hairpin bend & ghat road expert driver',
      'Interstate road tax & Toll charges included',
      'Daily vehicle sanitization & clean upholstery'
    ],
    inclusionsTe: [
      'రాష్ట్రాల పర్మిట్లు కలిగిన లగ్జరీ కారు మరియు డ్రైవర్',
      'హైవే & హెయిర్‌పిన్ బెండ్స్ ఘాట్ రోడ్లలో సురక్షిత డ్రైవింగ్',
      'టోల్ మరియు స్టేట్ టాక్స్‌లు పూర్తిగా ఇంక్లూడెడ్',
      'ప్రతిరోజూ శానిటైజ్ చేయబడిన పరిశుభ్రమైన కారు'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Mysore & Coorg Coffee Estates',
        titleTe: 'మైసూర్ ప్యాలెస్ & కూర్గ్ కాఫీ తోటలు',
        description: 'Drive past lush countryside. Visit Golden Temple Tibetan Monastery at Bylakuppe, Abbey Falls, and Raja’s Seat for sunset in Coorg.',
        descriptionTe: 'బైలకుప్పే గోల్డెన్ టెంపుల్, అబ్బే ఫాల్స్ మరియు రాజాస్ సీట్ సూర్యాస్తమయ దృశ్యాలు.',
        spots: ['Bylakuppe Monastery', 'Abbey Falls', 'Rajas Seat Sunset']
      },
      {
        day: 2,
        title: 'Coorg to Ooty through Bandipur Forest',
        titleTe: 'బందీపూర్ అడవుల గుండా ఊటీ ప్రయాణం',
        description: 'Drive through Bandipur Tiger Reserve safari corridor and climb the 36 hairpin bends of Kalhatty ghat into chilly Ooty. Evening boat ride at Ooty lake.',
        descriptionTe: 'బందీపూర్ ఫారెస్ట్, 36 హెయిర్‌పిన్ బెండ్స్ ఘాట్ రోడ్ గుండా ఊటీ చేరుకుని బోటింగ్.',
        spots: ['Bandipur Reserve Road', 'Kalhatty Ghat', 'Ooty Lake', 'Botanical Gardens']
      },
      {
        day: 3,
        title: 'Coonoor & Doddabetta Peak',
        titleTe: 'కూనూర్ & దొడ్డబెట్ట పీక్',
        description: 'Highest peak of Nilgiris: Doddabetta, aromatic tea factory tour, Sims park in Coonoor, and Dolphins Nose viewpoint.',
        descriptionTe: 'దొడ్డబెట్ట శిఖరం, టీ ఫ్యాక్టరీ టూర్, సిమ్స్ పార్క్ మరియు డాల్ఫిన్స్ నోస్ వ్యూ పాయింట్.',
        spots: ['Doddabetta Peak', 'Tea Museum', 'Sims Park Coonoor', 'Dolphins Nose']
      },
      {
        day: 4,
        title: 'Mysore Palace & Return Journey',
        titleTe: 'మైసూర్ ప్యాలెస్ దర్శనం & తిరుగు ప్రయాణం',
        description: 'Descend to historic Mysore, explore the Royal Amba Vilas Palace, taste authentic Mysore Pak, and return safely home.',
        descriptionTe: 'మైసూర్ మహారాజా ప్యాలెస్ సందర్శన, ప్రసిద్ధ మైసూర్ పాక్ కొనుగోలు మరియు తిరుగు ప్రయాణం.',
        spots: ['Mysore Palace', 'Local Sweets & Handicrafts', 'Safe Drop Home']
      }
    ],
    recommendedVehicle: 'Toyota Innova Crysta'
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 'rev-1',
    name: 'Suresh Varma & Family',
    role: 'Hyderabad to Tirupati Pilgrim',
    city: 'Hyderabad',
    route: 'Hyderabad ↔ Tirupati (Round Trip)',
    rating: 5,
    comment: 'Booked an Innova Crysta with Way Ora Journeys for my elderly parents. The driver Ramesh garu was so respectful, patient at food stops, and drove like a true gentleman on the highway. Zero motion sickness. Best car service!',
    commentTe: 'మా అమ్మానాన్నలతో కలిసి తిరుపతి వెళ్లడానికి ఇన్నోవా బుక్ చేసుకున్నాము. డ్రైవర్ రమేష్ గారు చాలా మర్యాదగా మాట్లాడారు, నిదానంగా సురక్షితంగా డ్రైవ్ చేశారు. మాకు చాలా సంతోషం అనిపించింది. బెస్ట్ ట్రావెల్ సర్వీస్!',
    date: 'October 2026',
    carUsed: 'Toyota Innova Crysta'
  },
  {
    id: 'rev-2',
    name: 'Priyanka Reddy',
    role: 'Corporate Team Outing',
    city: 'Visakhapatnam',
    route: 'Vizag ↔ Araku Valley (2 Days)',
    rating: 5,
    comment: 'We took a weekend car trip to Araku with Way Ora Journeys. The vehicle was spotless, AC was chilled, and the driver knew every secret viewpoint on the ghat road. Fair pricing with no hidden surprises.',
    commentTe: 'వైజాగ్ నుండి అరకు వీకెండ్ ట్రిప్ కోసం కార్ బుక్ చేసాము. కారు చాలా శుభ్రంగా ఉంది, డ్రైవర్ కు ఘాట్ రోడ్ లో మంచి అనుభవం ఉంది. ఎలాంటి దాపరికం లేని సరసమైన ధరలు.',
    date: 'September 2026',
    carUsed: 'Maruti Ertiga'
  },
  {
    id: 'rev-3',
    name: 'K. Venkat Rao',
    role: 'Business Traveler',
    city: 'Vijayawada',
    route: 'Vijayawada ↔ Hyderabad (One Way)',
    rating: 5,
    comment: 'Immediate pickup at 4:30 AM right on time at my gate. Clean Swift Dzire, chilled AC, smooth driving. Reached Hyderabad airport relaxed with time to spare. Truly professional service.',
    commentTe: 'తెల్లవారుజామున 4:30 గంటలకే సమయానికి కార్ నా ఇంటికి వచ్చింది. నీట్ గా ఉన్న కారు, స్మూత్ డ్రైవింగ్. ఎయిర్‌పోర్టుకు సమయానికి చేర్చారు. 100% నమ్మకమైన సర్వీస్.',
    date: 'October 2026',
    carUsed: 'Prime Sedan Dzire'
  }
];

export const FAQS = [
  {
    q: 'How are the trip charges calculated?',
    qTe: 'ట్రిప్ ఛార్జీలు ఎలా లెక్కిస్తారు?',
    a: 'For outstation trips, charges are calculated on a per-km basis subject to a minimum of 300 km per day. The total fare includes vehicle charges, fuel, and standard driver bata (allowance). Toll plazas, state border permits, and parking are transparently billed at actuals or can be bundled into an all-inclusive package.',
    aTe: 'అవుట్‌స్టేషన్ ప్రయాణాలకు రోజుకు కనీసం 300 కి.మీల లెక్కన పర్-కిలోమీటర్ రేటు ప్రకారం ఛార్జ్ చేయబడుతుంది. మొత్తం బిల్లులో కారు ఛార్జ్, ఇంధనం మరియు డ్రైవర్ బత్తా ఉంటాయి. టోల్ గేట్లు మరియు పార్కింగ్ ఛార్జీలు పారదర్శకంగా ఉంటాయి.'
  },
  {
    q: 'Are your drivers trained for ghats and long highway night drives?',
    qTe: 'డ్రైవర్లకు ఘాట్ రోడ్లు మరియు రాత్రి ప్రయాణాల్లో తగిన అనుభవం ఉంటుందా?',
    a: 'Yes, 100%. Every Way Ora Journeys chauffeur has a verified commercial driving license, police background clearance, and minimum 7+ years of interstate highway and ghat road experience (Tirumala, Araku, Srisailam, Ooty). Safety and courteous etiquette are our non-negotiables.',
    aTe: 'ఖచ్చితంగా! మా డ్రైవర్లందరూ పోలీస్ వెరిఫికేషన్ పూర్తయినవారే. ఘాట్ రోడ్లు (శ్రీశైలం, అరకు, తిరుమల) మరియు సుదూర జాతీయ రహదారులపై కనీసం 7+ సంవత్సరాల అనుభవం ఉన్న సీనియర్ డ్రైవర్లే ఉంటారు.'
  },
  {
    q: 'Can I stop for food, coffee, or scenic photos during the road trip?',
    qTe: 'ప్రయాణంలో భోజనం లేదా ఫోటోల కోసం నచ్చిన చోట ఆపవచ్చా?',
    a: 'Absolutely! It is your personal chauffeur-driven car trip. You have complete freedom to pause at hygienic highway food courts, famous tea stalls, scenic photo points, or rest areas at your convenience without any extra waiting penalty on outstation trips.',
    aTe: 'తప్పకుండా! ఇది మీ స్వంత కారు ప్రయాణం లాంటిది. మీకు నచ్చిన రెస్టారెంట్లలో, కాఫీ షాపుల్లో లేదా అందమైన ఫోటో వ్యూ పాయింట్స్ వద్ద ఎటువంటి అభ్యంతరం లేకుండా ఆపుకోవచ్చు.'
  },
  {
    q: 'What is your cancellation and advance booking policy?',
    qTe: 'బుకింగ్ మరియు క్యాన్సిలేషన్ నిబంధనలు ఏమిటి?',
    a: 'You can book online or via WhatsApp with zero hassle. Up to 6 hours before scheduled pickup time, cancellation is 100% free with no cancellation penalties.',
    aTe: 'మీరు వెబ్‌సైట్ లేదా వాట్సాప్ ద్వారా సులభంగా బుక్ చేసుకోవచ్చు. పికప్ సమయానికి 6 గంటల ముందు వరకు ఎటువంటి ఫీజు లేకుండా ఉచితంగా క్యాన్సిల్ చేసుకోవచ్చు.'
  }
];
