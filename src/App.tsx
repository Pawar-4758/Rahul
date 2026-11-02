/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { PopularRoutesSection } from './components/PopularRoutesSection';
import { FleetShowcase } from './components/FleetShowcase';
import { TourPackagesSection } from './components/TourPackagesSection';
import { CustomTripPlanner } from './components/CustomTripPlanner';
import { WhyChooseUs } from './components/WhyChooseUs';
import { TestimonialsSection } from './components/TestimonialsSection';
import { FAQSection } from './components/FAQSection';
import { Footer } from './components/Footer';
import { BookingModal } from './components/BookingModal';
import { MyBookingsModal } from './components/MyBookingsModal';
import { OnlinePaymentModal } from './components/OnlinePaymentModal';
import { DriverJoinModal } from './components/DriverJoinModal';
import { TravelVoucherModal } from './components/TravelVoucherModal';
import { RouteCarSelectModal } from './components/RouteCarSelectModal';
import { FloatingWhatsAppBar } from './components/FloatingWhatsAppBar';
import { AdminPortalModal } from './components/AdminPortalModal';
import { TravelStoreProvider, useTravelStore } from './context/TravelStoreContext';
import { TripType, TourPackage, PopularRoute, BookingDetails } from './types';
import { Settings, ShieldCheck, Lock } from 'lucide-react';

function MainAppContent() {
  const { isAdmin } = useTravelStore();
  const [lang, setLang] = useState<'en' | 'te'>('en');
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('suv-luxury');
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isAdminPortalOpen, setIsAdminPortalOpen] = useState(false);
  const [isMyBookingsOpen, setIsMyBookingsOpen] = useState(false);
  const [isDriverJoinOpen, setIsDriverJoinOpen] = useState(false);
  const [onlinePaymentBooking, setOnlinePaymentBooking] = useState<BookingDetails | null>(null);
  const [selectedVoucherBooking, setSelectedVoucherBooking] = useState<BookingDetails | null>(null);
  const [activeCarSelectRoute, setActiveCarSelectRoute] = useState<{
    from: string;
    to: string;
    distanceKm: number;
    durationHours?: string;
    startingPrice?: number;
    tripType?: TripType;
    pickupDate?: string;
    pickupTime?: string;
  } | null>(null);

  const [bookingDraft, setBookingDraft] = useState({
    tripType: 'outstation_round' as TripType,
    pickupLocation: 'Hyderabad',
    dropLocation: 'Vijayawada',
    pickupDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    pickupTime: '06:00',
    returnDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    vehicleId: 'suv-luxury',
    estimatedKm: 550,
    estimatedFare: 10450,
    driverAllowance: 1000,
    packageTitle: '',
    advanceAmount: 2613,
    tripPhotoUrl: ''
  });

  const handleProceedToBook = (draft: {
    tripType: TripType;
    pickupLocation: string;
    dropLocation: string;
    pickupDate: string;
    pickupTime: string;
    returnDate: string;
    vehicleId: string;
    estimatedKm: number;
    estimatedFare: number;
    driverAllowance: number;
  }) => {
    setActiveCarSelectRoute({
      from: draft.pickupLocation,
      to: draft.dropLocation,
      distanceKm: draft.estimatedKm,
      tripType: draft.tripType,
      pickupDate: draft.pickupDate,
      pickupTime: draft.pickupTime
    });
  };

  const handleBookPackage = (
    pkg: TourPackage,
    vehicleId: string,
    calculatedPrice: number,
    advanceAmount: number,
    customPhoto?: string
  ) => {
    setBookingDraft({
      tripType: 'outstation_round',
      pickupLocation: 'Your Doorstep City',
      dropLocation: pkg.destination,
      pickupDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      pickupTime: '06:00',
      returnDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
      vehicleId,
      estimatedKm: pkg.distanceKm,
      estimatedFare: calculatedPrice,
      driverAllowance: 1000,
      packageTitle: pkg.title,
      advanceAmount,
      tripPhotoUrl: customPhoto || pkg.imageUrl || ''
    });
    setIsBookingModalOpen(true);
  };

  const handleSelectRoute = (route: PopularRoute) => {
    setActiveCarSelectRoute({
      from: route.from,
      to: route.to,
      distanceKm: route.distanceKm,
      durationHours: route.durationHours,
      startingPrice: route.startingPrice,
      tripType: 'one_way',
      pickupDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      pickupTime: '06:00'
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-red-100 selection:text-red-900">
      
      {/* Admin Mode Bar if Owner is logged in */}
      {isAdmin && (
        <div className="bg-amber-500 text-slate-950 px-4 py-2 text-xs font-bold flex items-center justify-between no-print z-50">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-slate-900" />
            <span>
              {lang === 'en' 
                ? 'Owner Mode Active: You have A-to-Z control over all car rates, bookings & details' 
                : 'ఓనర్ మోడ్ ఆక్టివ్: కార్ల రేట్లు, బుకింగ్స్ & వివరాలను మార్చుకోవచ్చు'}
            </span>
          </div>
          <button
            onClick={() => setIsAdminPortalOpen(true)}
            className="px-3 py-1 bg-slate-950 text-white rounded text-[11px] font-bold hover:bg-slate-800 transition-colors"
          >
            {lang === 'en' ? 'Open Control Panel' : 'కంట్రోల్ ప్యానెల్ తెరవండి'}
          </button>
        </div>
      )}

      {/* Top Navigation */}
      <Navbar
        lang={lang}
        setLang={setLang}
        onBookClick={() => setIsBookingModalOpen(true)}
        onOpenAdmin={() => setIsAdminPortalOpen(true)}
        onOpenMyBookings={() => setIsMyBookingsOpen(true)}
        onOpenDriverJoin={() => setIsDriverJoinOpen(true)}
      />

      <main className="flex-1">
        {/* Hero Section with exact user's uploaded branding, headline, and live calculator */}
        <HeroSection
          lang={lang}
          selectedVehicleId={selectedVehicleId}
          setSelectedVehicleId={setSelectedVehicleId}
          onProceedToBook={handleProceedToBook}
        />

        {/* Popular Highway Routes & Starting Tariffs */}
        <PopularRoutesSection
          lang={lang}
          onSelectRoute={handleSelectRoute}
        />

        {/* Fleet Showcase */}
        <FleetShowcase
          lang={lang}
          selectedVehicleId={selectedVehicleId}
          onSelectVehicle={(id) => {
            setSelectedVehicleId(id);
            setBookingDraft(prev => ({ ...prev, vehicleId: id }));
          }}
        />

        {/* Curated Road Trip Tour Packages */}
        <TourPackagesSection
          lang={lang}
          onBookPackage={handleBookPackage}
        />

        {/* Custom Multi-City Itinerary Planner */}
        <CustomTripPlanner
          lang={lang}
        />

        {/* Why Choose Way Ora Journeys Standards */}
        <WhyChooseUs
          lang={lang}
        />

        {/* Verified Customer Reviews */}
        <TestimonialsSection
          lang={lang}
        />

        {/* Frequently Asked Questions */}
        <FAQSection
          lang={lang}
        />
      </main>

      {/* Footer */}
      <Footer
        lang={lang}
        onOpenAdmin={() => setIsAdminPortalOpen(true)}
      />

      {/* Floating Instant Contact / WhatsApp CTA */}
      <FloatingWhatsAppBar
        lang={lang}
        onQuickBook={() => setIsBookingModalOpen(true)}
      />

      {/* Interactive Booking & Voucher Modal */}
      <BookingModal
        lang={lang}
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        initialData={bookingDraft}
        onOpenOnlinePayment={(booking) => {
          setOnlinePaymentBooking(booking);
        }}
      />

      {/* Customer 'My Bookings' Dashboard Modal */}
      <MyBookingsModal
        isOpen={isMyBookingsOpen}
        onClose={() => setIsMyBookingsOpen(false)}
        lang={lang}
        onViewVoucher={(booking) => {
          setSelectedVoucherBooking(booking);
        }}
        onPayAdvance={(booking) => {
          setOnlinePaymentBooking(booking);
        }}
      />

      {/* Online 25% Advance Payment Modal */}
      <OnlinePaymentModal
        isOpen={!!onlinePaymentBooking}
        onClose={() => setOnlinePaymentBooking(null)}
        lang={lang}
        booking={onlinePaymentBooking}
        onPaymentSuccess={() => {
          // Keep dialog state refreshed
        }}
      />

      {/* Driver Join & Car Attachment Modal */}
      <DriverJoinModal
        isOpen={isDriverJoinOpen}
        onClose={() => setIsDriverJoinOpen(false)}
        lang={lang}
      />

      {/* Savaari-Style Car Selection & 25% Advance Payment Modal */}
      <RouteCarSelectModal
        isOpen={!!activeCarSelectRoute}
        onClose={() => setActiveCarSelectRoute(null)}
        lang={lang}
        route={activeCarSelectRoute}
        initialTripType={activeCarSelectRoute?.tripType || 'one_way'}
        initialPickupDate={activeCarSelectRoute?.pickupDate}
        initialPickupTime={activeCarSelectRoute?.pickupTime}
        onBookingComplete={(booking) => {
          setActiveCarSelectRoute(null);
          setSelectedVoucherBooking(booking);
        }}
      />

      {/* Travel Voucher Details & Print Modal */}
      <TravelVoucherModal
        isOpen={!!selectedVoucherBooking}
        onClose={() => setSelectedVoucherBooking(null)}
        lang={lang}
        booking={selectedVoucherBooking}
        onPayAdvance={(booking) => {
          setSelectedVoucherBooking(null);
          setOnlinePaymentBooking(booking);
        }}
      />

      {/* Owner A-to-Z Control Panel Modal */}
      <AdminPortalModal
        lang={lang}
        isOpen={isAdminPortalOpen}
        onClose={() => setIsAdminPortalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <TravelStoreProvider>
      <MainAppContent />
    </TravelStoreProvider>
  );
}
