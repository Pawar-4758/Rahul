export type TripType = 'outstation_round' | 'one_way' | 'local_rental' | 'airport';

export interface CompanySettings {
  companyName: string;
  tagline: string;
  phone: string;
  whatsapp: string;
  email: string;
  dispatchHotline: string;
  officeAddress: string;
  upiId: string;
  adminPin: string;
  emergencyPhone: string;
  logoUrl?: string;
  advancePercentage: number; // default 25%
}

export interface Vehicle {
  id: string;
  name: string;
  category: 'sedan' | 'suv' | 'luxury' | 'tempo' | 'hatchback';
  models: string;
  seats: number;
  luggage: number;
  ac: boolean;
  ratePerKm: number;
  minKmPerDay: number;
  driverAllowancePerDay: number;
  hourlyRate?: number;
  baseKmHourly?: number;
  features: string[];
  featuresTe: string[];
  bestFor: string;
  bestForTe: string;
  imageUrl?: string;
  popular?: boolean;
}

export interface PopularRoute {
  id: string;
  from: string;
  to: string;
  distanceKm: number;
  durationHours: string;
  popularCar: string;
  startingPrice: number;
  category: 'outstation' | 'pilgrimage' | 'hills' | 'coastal';
}

export interface TourPackage {
  id: string;
  title: string;
  titleTe: string;
  destination: string;
  destinationTe: string;
  duration: string;
  durationTe: string;
  distanceKm: number;
  startingPrice: number;
  category: 'hills' | 'pilgrimage' | 'coastal' | 'heritage';
  summary: string;
  summaryTe: string;
  inclusions: string[];
  inclusionsTe: string[];
  itinerary: {
    day: number;
    title: string;
    titleTe: string;
    description: string;
    descriptionTe: string;
    spots: string[];
  }[];
  recommendedVehicle: string;
  imageUrl?: string;
}

export interface BookingDetails {
  bookingId: string;
  tripType: TripType;
  pickupLocation: string;
  dropLocation: string;
  pickupDate: string;
  pickupTime: string;
  returnDate?: string;
  vehicleId: string;
  vehicleName: string;
  passengerCount: number;
  name: string;
  phone: string;
  email?: string;
  specialRequests?: string;
  estimatedKm: number;
  estimatedFare: number;
  driverAllowance: number;
  advanceAmount: number; // 25% of estimatedFare
  remainingAmount: number; // 75% balance to pay to driver
  paymentStatus: 'pending' | 'advance_paid' | 'fully_paid';
  paymentMethod?: 'upi' | 'card' | 'netbanking' | 'cash_to_driver' | string;
  transactionId?: string;
  tripPhotoUrl?: string;
  bookingTime: string;
  createdAt: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
}

export interface DriverPartner {
  id: string;
  fullName: string;
  phone: string;
  city: string;
  vehicleModel: string;
  vehicleNumber: string;
  experienceYears: number;
  licenseNumber: string;
  status: 'applied' | 'verified' | 'active';
  appliedDate: string;
  photoUrl?: string;
  carPhotoUrl?: string;
  rating?: number;
  tripsCompleted?: number;
  monthlyRevenue?: number;
  onTimeRate?: number;
  partnerType?: 'car_owner' | 'driver' | 'owner_driver';
  rcStatus?: 'valid' | 'expired' | 'renewing';
  rcExpiryDate?: string;
  rcPhotoUrl?: string;
  insuranceStatus?: 'valid' | 'expired' | 'due_soon';
  insuranceCompany?: string;
  insurancePolicyNumber?: string;
  insuranceExpiryDate?: string;
  insurancePhotoUrl?: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minBookingAmount?: number;
  validUntil: string; // YYYY-MM-DD
  isActive: boolean;
  description: string;
  descriptionTe?: string;
  usageCount?: number;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  city: string;
  route: string;
  rating: number;
  comment: string;
  commentTe: string;
  date: string;
  carUsed: string;
}

