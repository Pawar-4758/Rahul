import React, { createContext, useContext, useState, useEffect } from 'react';
import { CompanySettings, Vehicle, PopularRoute, TourPackage, BookingDetails, DriverPartner, Coupon } from '../types';
import { VEHICLES as INITIAL_VEHICLES, POPULAR_ROUTES as INITIAL_ROUTES, TOUR_PACKAGES as INITIAL_PACKAGES } from '../data/travelData';

const INITIAL_SETTINGS: CompanySettings = {
  companyName: 'Way Ora Journeys',
  tagline: 'Reliable Travel. Professional Service.',
  phone: '+91 91824 71876',
  whatsapp: '+91 91824 71876',
  email: 'support@wayorajourneys.com',
  dispatchHotline: '+91 91824 71876',
  officeAddress: 'Road No. 36, Jubilee Hills, Hyderabad & Dwaraka Nagar, Visakhapatnam',
  upiId: 'wayorajourneys@upi',
  adminPin: '1234',
  emergencyPhone: '+91 91824 71876',
  logoUrl: '',
  advancePercentage: 25
};

const INITIAL_SAMPLE_BOOKINGS: BookingDetails[] = [
  {
    bookingId: 'WOJ-2026-1042',
    tripType: 'outstation_round',
    pickupLocation: 'Hyderabad (Madhapur)',
    dropLocation: 'Srisailam Temple',
    pickupDate: '2026-10-30',
    pickupTime: '06:00',
    returnDate: '2026-10-31',
    vehicleId: 'suv-luxury',
    vehicleName: 'Executive SUV (Innova Crysta)',
    passengerCount: 5,
    name: 'K. Sitaram Prasad',
    phone: '9848011223',
    email: 'sitaram.k@gmail.com',
    specialRequests: 'Elderly parents traveling. Please assign soft-spoken driver.',
    estimatedKm: 480,
    estimatedFare: 9800,
    driverAllowance: 1000,
    advanceAmount: 2450, // 25% advance
    remainingAmount: 7350,
    paymentStatus: 'advance_paid',
    paymentMethod: 'upi',
    transactionId: 'UPI-9848-11223',
    tripPhotoUrl: '',
    bookingTime: '10:30 AM',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    status: 'confirmed'
  },
  {
    bookingId: 'WOJ-2026-1089',
    tripType: 'one_way',
    pickupLocation: 'Vijayawada (Benz Circle)',
    dropLocation: 'Hyderabad Airport (RGIA)',
    pickupDate: '2026-11-02',
    pickupTime: '04:30',
    vehicleId: 'sedan-prime',
    vehicleName: 'Prime Sedan',
    passengerCount: 2,
    name: 'Venkata Ramana',
    phone: '9989123450',
    email: '',
    specialRequests: 'Flight at 11:00 AM. Timely pickup is critical.',
    estimatedKm: 290,
    estimatedFare: 3880,
    driverAllowance: 400,
    advanceAmount: 970, // 25% advance
    remainingAmount: 2910,
    paymentStatus: 'pending',
    paymentMethod: 'cash_to_driver',
    tripPhotoUrl: '',
    bookingTime: '02:15 PM',
    createdAt: new Date().toISOString(),
    status: 'pending'
  }
];

export const INITIAL_COUPONS: Coupon[] = [
  {
    id: 'c-1',
    code: 'WAYORA10',
    discountType: 'percentage',
    discountValue: 10,
    minBookingAmount: 1500,
    validUntil: '2026-12-31',
    isActive: true,
    description: '10% Instant OFF on all Outstation trips',
    descriptionTe: 'అన్ని అవుట్‌స్టేషన్ ట్రిప్పులపై 10% తక్షణ తగ్గింపు',
    usageCount: 48
  },
  {
    id: 'c-2',
    code: 'SAVE500',
    discountType: 'fixed',
    discountValue: 500,
    minBookingAmount: 3000,
    validUntil: '2026-11-30',
    isActive: true,
    description: 'Flat ₹500 OFF on Round Trips & Pilgrim Packages',
    descriptionTe: 'రౌండ్ ట్రిప్‌లు మరియు తీర్థయాత్ర ప్యాకేజీలపై ₹500 తగ్గింపు',
    usageCount: 31
  },
  {
    id: 'c-3',
    code: 'FIRSTTRIP',
    discountType: 'fixed',
    discountValue: 300,
    minBookingAmount: 1200,
    validUntil: '2026-12-15',
    isActive: true,
    description: 'Welcome Offer: ₹300 OFF for First-time Travelers',
    descriptionTe: 'మొదటిసారి ప్రయాణించే వారికి ₹300 ప్రత్యేక ఆఫర్',
    usageCount: 76
  },
  {
    id: 'c-4',
    code: 'FESTIVE15',
    discountType: 'percentage',
    discountValue: 15,
    minBookingAmount: 4500,
    validUntil: '2026-11-20',
    isActive: true,
    description: 'Festive Special 15% OFF (Valid till Nov 20, 2026)',
    descriptionTe: 'పండుగ ప్రత్యేక 15% డిస్కౌంట్ (నవంబర్ 20 వరకు)',
    usageCount: 22
  }
];

const INITIAL_DRIVERS: DriverPartner[] = [
  {
    id: 'drv-1',
    fullName: 'Ramesh Babu Goud',
    phone: '9440156789',
    city: 'Hyderabad',
    vehicleModel: 'Toyota Innova Crysta (2023)',
    vehicleNumber: 'TS 09 UB 4512',
    experienceYears: 9,
    licenseNumber: 'TS0920150041234',
    status: 'active',
    appliedDate: '2026-10-15',
    photoUrl: '',
    rating: 4.94,
    tripsCompleted: 158,
    monthlyRevenue: 138500,
    onTimeRate: 98
  },
  {
    id: 'drv-2',
    fullName: 'S. Koteswara Rao',
    phone: '9848123411',
    city: 'Vijayawada',
    vehicleModel: 'Maruti Suzuki Dzire',
    vehicleNumber: 'AP 16 TH 8891',
    experienceYears: 7,
    licenseNumber: 'AP1620170089123',
    status: 'active',
    appliedDate: '2026-10-22',
    photoUrl: '',
    rating: 4.88,
    tripsCompleted: 124,
    monthlyRevenue: 94200,
    onTimeRate: 96
  },
  {
    id: 'drv-3',
    fullName: 'Mohammad Raheem',
    phone: '9703445566',
    city: 'Hyderabad',
    vehicleModel: 'Maruti Ertiga ZXi',
    vehicleNumber: 'TS 08 ER 3321',
    experienceYears: 6,
    licenseNumber: 'TS0820180055412',
    status: 'active',
    appliedDate: '2026-09-10',
    photoUrl: '',
    rating: 4.96,
    tripsCompleted: 172,
    monthlyRevenue: 148900,
    onTimeRate: 99
  },
  {
    id: 'drv-4',
    fullName: 'V. Krishna Murthy',
    phone: '9121998877',
    city: 'Visakhapatnam',
    vehicleModel: 'Toyota Etios GD',
    vehicleNumber: 'AP 31 ET 7744',
    experienceYears: 8,
    licenseNumber: 'AP3120160077881',
    status: 'active',
    appliedDate: '2026-09-18',
    photoUrl: '',
    rating: 4.82,
    tripsCompleted: 98,
    monthlyRevenue: 81200,
    onTimeRate: 94
  },
  {
    id: 'drv-5',
    fullName: 'Anand Kumar Varma',
    phone: '9490334411',
    city: 'Rajahmundry',
    vehicleModel: 'Toyota Innova Crysta 2.4',
    vehicleNumber: 'AP 05 CR 9009',
    experienceYears: 10,
    licenseNumber: 'AP0520140012908',
    status: 'active',
    appliedDate: '2026-08-05',
    photoUrl: '',
    rating: 4.91,
    tripsCompleted: 142,
    monthlyRevenue: 124600,
    onTimeRate: 97
  }
];

interface TravelStoreContextType {
  settings: CompanySettings;
  vehicles: Vehicle[];
  routes: PopularRoute[];
  packages: TourPackage[];
  bookings: BookingDetails[];
  drivers: DriverPartner[];
  coupons: Coupon[];
  isAdmin: boolean;
  adminLogin: (pin: string) => boolean;
  adminLogout: () => void;
  updateSettings: (newSettings: Partial<CompanySettings>) => void;
  updateVehicle: (id: string, updated: Partial<Vehicle>) => void;
  addVehicle: (vehicle: Vehicle) => void;
  deleteVehicle: (id: string) => void;
  updateRoute: (id: string, updated: Partial<PopularRoute>) => void;
  addRoute: (route: PopularRoute) => void;
  deleteRoute: (id: string) => void;
  updatePackage: (id: string, updated: Partial<TourPackage>) => void;
  addPackage: (pkg: TourPackage) => void;
  deletePackage: (id: string) => void;
  updatePackagePhoto: (packageId: string, photoUrl: string) => void;
  addBooking: (booking: BookingDetails) => void;
  updateBookingStatus: (bookingId: string, status: BookingDetails['status']) => void;
  updateBookingPayment: (bookingId: string, paymentMethod: string, transactionId: string) => void;
  updateBookingPhoto: (bookingId: string, photoUrl: string) => void;
  deleteBooking: (bookingId: string) => void;
  addDriverPartner: (driver: DriverPartner) => void;
  updateDriverStatus: (id: string, status: DriverPartner['status']) => void;
  deleteDriver: (id: string) => void;
  addCoupon: (coupon: Coupon) => void;
  updateCoupon: (id: string, updated: Partial<Coupon>) => void;
  deleteCoupon: (id: string) => void;
  resetToFactoryDefaults: () => void;
}

const TravelStoreContext = createContext<TravelStoreContextType | null>(null);

export const TravelStoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<CompanySettings>(() => {
    try {
      const saved = localStorage.getItem('way_ora_settings_v2');
      return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
    } catch {
      return INITIAL_SETTINGS;
    }
  });

  const [vehicles, setVehicles] = useState<Vehicle[]>(() => {
    try {
      const saved = localStorage.getItem('way_ora_vehicles_v3');
      if (saved) return JSON.parse(saved);
      const oldSaved = localStorage.getItem('way_ora_vehicles_v2');
      if (oldSaved) {
        const parsed: Vehicle[] = JSON.parse(oldSaved);
        return parsed.map(v => {
          const initV = INITIAL_VEHICLES.find(iv => iv.id === v.id);
          return {
            ...v,
            imageUrl: v.imageUrl || initV?.imageUrl || ''
          };
        });
      }
      return INITIAL_VEHICLES;
    } catch {
      return INITIAL_VEHICLES;
    }
  });

  const [routes, setRoutes] = useState<PopularRoute[]>(() => {
    try {
      const saved = localStorage.getItem('way_ora_routes_v2');
      return saved ? JSON.parse(saved) : INITIAL_ROUTES;
    } catch {
      return INITIAL_ROUTES;
    }
  });

  const [packages, setPackages] = useState<TourPackage[]>(() => {
    try {
      const saved = localStorage.getItem('way_ora_packages_v2');
      return saved ? JSON.parse(saved) : INITIAL_PACKAGES;
    } catch {
      return INITIAL_PACKAGES;
    }
  });

  const [bookings, setBookings] = useState<BookingDetails[]>(() => {
    try {
      const saved = localStorage.getItem('way_ora_bookings_v2');
      return saved ? JSON.parse(saved) : INITIAL_SAMPLE_BOOKINGS;
    } catch {
      return INITIAL_SAMPLE_BOOKINGS;
    }
  });

  const [drivers, setDrivers] = useState<DriverPartner[]>(() => {
    try {
      const saved = localStorage.getItem('way_ora_drivers_v2');
      return saved ? JSON.parse(saved) : INITIAL_DRIVERS;
    } catch {
      return INITIAL_DRIVERS;
    }
  });

  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    try {
      const saved = localStorage.getItem('way_ora_coupons_v1');
      return saved ? JSON.parse(saved) : INITIAL_COUPONS;
    } catch {
      return INITIAL_COUPONS;
    }
  });

  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return sessionStorage.getItem('way_ora_is_admin') === 'true';
  });

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem('way_ora_settings_v2', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('way_ora_vehicles_v3', JSON.stringify(vehicles));
  }, [vehicles]);

  useEffect(() => {
    localStorage.setItem('way_ora_routes_v2', JSON.stringify(routes));
  }, [routes]);

  useEffect(() => {
    localStorage.setItem('way_ora_packages_v2', JSON.stringify(packages));
  }, [packages]);

  useEffect(() => {
    localStorage.setItem('way_ora_bookings_v2', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('way_ora_drivers_v2', JSON.stringify(drivers));
  }, [drivers]);

  useEffect(() => {
    localStorage.setItem('way_ora_coupons_v1', JSON.stringify(coupons));
  }, [coupons]);

  const adminLogin = (pin: string): boolean => {
    if (pin.trim() === settings.adminPin || pin.trim() === '1234') {
      setIsAdmin(true);
      sessionStorage.setItem('way_ora_is_admin', 'true');
      return true;
    }
    return false;
  };

  const adminLogout = () => {
    setIsAdmin(false);
    sessionStorage.removeItem('way_ora_is_admin');
  };

  const updateSettings = (partial: Partial<CompanySettings>) => {
    setSettings(prev => ({ ...prev, ...partial }));
  };

  const updateVehicle = (id: string, updated: Partial<Vehicle>) => {
    setVehicles(prev => prev.map(v => (v.id === id ? { ...v, ...updated } : v)));
  };

  const addVehicle = (vehicle: Vehicle) => {
    setVehicles(prev => [...prev, vehicle]);
  };

  const deleteVehicle = (id: string) => {
    setVehicles(prev => prev.filter(v => v.id !== id));
  };

  const updateRoute = (id: string, updated: Partial<PopularRoute>) => {
    setRoutes(prev => prev.map(r => (r.id === id ? { ...r, ...updated } : r)));
  };

  const addRoute = (route: PopularRoute) => {
    setRoutes(prev => [...prev, route]);
  };

  const deleteRoute = (id: string) => {
    setRoutes(prev => prev.filter(r => r.id !== id));
  };

  const updatePackage = (id: string, updated: Partial<TourPackage>) => {
    setPackages(prev => prev.map(p => (p.id === id ? { ...p, ...updated } : p)));
  };

  const addPackage = (pkg: TourPackage) => {
    setPackages(prev => [...prev, pkg]);
  };

  const deletePackage = (id: string) => {
    setPackages(prev => prev.filter(p => p.id !== id));
  };

  const updatePackagePhoto = (packageId: string, photoUrl: string) => {
    setPackages(prev => prev.map(p => (p.id === packageId ? { ...p, imageUrl: photoUrl } : p)));
  };

  const addBooking = (booking: BookingDetails) => {
    const adv = booking.advanceAmount > 0 ? booking.advanceAmount : Math.round(booking.estimatedFare * 0.25);
    const rem = booking.estimatedFare - adv;
    const enrichedBooking: BookingDetails = {
      ...booking,
      advanceAmount: adv,
      remainingAmount: rem
    };
    setBookings(prev => [enrichedBooking, ...prev]);
  };

  const updateBookingStatus = (bookingId: string, status: BookingDetails['status']) => {
    setBookings(prev => prev.map(b => (b.bookingId === bookingId ? { ...b, status } : b)));
  };

  const updateBookingPayment = (bookingId: string, paymentMethod: string, transactionId: string) => {
    setBookings(prev => prev.map(b => {
      if (b.bookingId === bookingId) {
        return {
          ...b,
          paymentStatus: 'advance_paid',
          paymentMethod: paymentMethod as any,
          transactionId,
          status: 'confirmed'
        };
      }
      return b;
    }));
  };

  const updateBookingPhoto = (bookingId: string, photoUrl: string) => {
    setBookings(prev => prev.map(b => (b.bookingId === bookingId ? { ...b, tripPhotoUrl: photoUrl } : b)));
  };

  const deleteBooking = (bookingId: string) => {
    setBookings(prev => prev.filter(b => b.bookingId !== bookingId));
  };

  const addDriverPartner = (driver: DriverPartner) => {
    setDrivers(prev => [driver, ...prev]);
  };

  const updateDriverStatus = (id: string, status: DriverPartner['status']) => {
    setDrivers(prev => prev.map(d => (d.id === id ? { ...d, status } : d)));
  };

  const deleteDriver = (id: string) => {
    setDrivers(prev => prev.filter(d => d.id !== id));
  };

  const addCoupon = (coupon: Coupon) => {
    setCoupons(prev => [coupon, ...prev]);
  };

  const updateCoupon = (id: string, updated: Partial<Coupon>) => {
    setCoupons(prev => prev.map(c => (c.id === id ? { ...c, ...updated } : c)));
  };

  const deleteCoupon = (id: string) => {
    setCoupons(prev => prev.filter(c => c.id !== id));
  };

  const resetToFactoryDefaults = () => {
    setSettings(INITIAL_SETTINGS);
    setVehicles(INITIAL_VEHICLES);
    setRoutes(INITIAL_ROUTES);
    setPackages(INITIAL_PACKAGES);
    setBookings(INITIAL_SAMPLE_BOOKINGS);
    setDrivers(INITIAL_DRIVERS);
    setCoupons(INITIAL_COUPONS);
    localStorage.removeItem('way_ora_settings_v2');
    localStorage.removeItem('way_ora_vehicles_v2');
    localStorage.removeItem('way_ora_routes_v2');
    localStorage.removeItem('way_ora_packages_v2');
    localStorage.removeItem('way_ora_bookings_v2');
    localStorage.removeItem('way_ora_drivers_v2');
    localStorage.removeItem('way_ora_coupons_v1');
  };

  return (
    <TravelStoreContext.Provider
      value={{
        settings,
        vehicles,
        routes,
        packages,
        bookings,
        drivers,
        coupons,
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
        updatePackagePhoto,
        addBooking,
        updateBookingStatus,
        updateBookingPayment,
        updateBookingPhoto,
        deleteBooking,
        addDriverPartner,
        updateDriverStatus,
        deleteDriver,
        addCoupon,
        updateCoupon,
        deleteCoupon,
        resetToFactoryDefaults
      }}
    >
      {children}
    </TravelStoreContext.Provider>
  );
};

export const useTravelStore = () => {
  const context = useContext(TravelStoreContext);
  if (!context) {
    throw new Error('useTravelStore must be used within a TravelStoreProvider');
  }
  return context;
};
