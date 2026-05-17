import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Loader2, ChevronRight, Sparkles } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../store/authStore';
import { useBookingStore } from '../store/bookingStore';
import { services, users, jobs } from '../lib/api';
import type { ServiceType } from '../lib/api';
import { ServiceCard } from '../components/ServiceCard';
import { UpsellModal } from '../components/UpsellModal';
import { AddressSearch } from '../components/AddressSearch';
import { MapView } from '../components/MapView';
import { formatCurrency } from '../lib/utils';
import { toast } from '../hooks/useToast';

const COMING_SOON: ServiceType[] = [
  'house-cleaning-standard',
  'house-cleaning-deep',
  'lawn-mowing',
];

const BUNDLE_DISCOUNT = 0.1;

async function geocodeAddress(address: string): Promise<{ lat: number; lng: number } | null> {
  const token = import.meta.env.VITE_MAPBOX_TOKEN as string;
  if (!token) return null;
  try {
    const res = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${token}&limit=1`
    );
    const data = await res.json();
    const center = data.features?.[0]?.center as [number, number] | undefined;
    if (!center) return null;
    return { lng: center[0], lat: center[1] };
  } catch {
    return null;
  }
}

export default function Home() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuthStore();
  const {
    selectedServices, address, confirmedAddress,
    coordinates, toggleService, setAddress, setCoordinates,
    setQuotes, setQuotesReady, quotes,
  } = useBookingStore();

  const [showUpsell, setShowUpsell] = useState(false);
  const [quotesLoading, setQuotesLoading] = useState(false);
  const addressInitializedRef = useRef(false);

  const { data: serviceList, isLoading } = useQuery({
    queryKey: ['services'],
    queryFn: () => services.list().then((r) => r.data),
  });

  useEffect(() => {
    if (user?.address && !addressInitializedRef.current) {
      addressInitializedRef.current = true;
      setAddress(user.address, true);
      geocodeAddress(user.address).then((coords) => {
        if (coords) setCoordinates(coords);
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.address]);

  useEffect(() => {
    if (confirmedAddress && serviceList) {
      fetchQuotes(confirmedAddress, serviceList);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [confirmedAddress, serviceList]);

  const fetchQuotes = useCallback(async (addr: string, svcList: typeof serviceList) => {
    if (!addr || !svcList) return;
    const quotableTypes = svcList
      .filter((s) => !COMING_SOON.includes(s.id))
      .map((s) => s.id);
    if (quotableTypes.length === 0) return;
    setQuotesLoading(true);
    setQuotesReady(false);
    try {
      const res = await jobs.getQuote(addr, quotableTypes);
      setQuotes(res.data.quotes);
      setQuotesLoading(false);
    } catch {
      // silently fall back to static prices
      setQuotesReady(true);
      setQuotesLoading(false);
    }
  }, [setQuotes, setQuotesReady]);

  const handleAddressConfirm = async (addr: string) => {
    setAddress(addr, true);
    try {
      const [coords] = await Promise.all([
        geocodeAddress(addr),
        users.updateProfile({ address: addr }).catch(() => null),
      ]);
      if (coords) setCoordinates(coords);
      updateUser({ address: addr });
    } catch { /* non-critical */ }
    fetchQuotes(addr, serviceList);
  };

  const handleContinue = () => {
    if (!confirmedAddress) {
      toast({ title: 'Address required', description: 'Please enter and confirm your address.', variant: 'destructive' });
      return;
    }
    if (selectedServices.length === 0) {
      toast({ title: 'Select a service', description: 'Choose at least one service.', variant: 'destructive' });
      return;
    }
    if (selectedServices.length === 1) {
      setShowUpsell(true);
      return;
    }
    navigate('/checkout');
  };

  const handleUpsellContinue = () => {
    setShowUpsell(false);
    navigate('/checkout');
  };

  const selectedObjects = (serviceList ?? []).filter((s) => selectedServices.includes(s.id));
  const hasBundle = selectedServices.length > 1;
  const priceFor = (id: ServiceType, base: number) => quotes[id] ?? base;
  const subtotal = selectedObjects.reduce((sum, s) => sum + priceFor(s.id, s.price), 0);
  const savings = hasBundle ? subtotal * BUNDLE_DISCOUNT : 0;

  return (
    <>
      {showUpsell && serviceList && (
        <UpsellModal
          originalServiceId={selectedServices[0]}
          selectedServices={selectedServices}
          allServices={serviceList}
          comingSoonIds={COMING_SOON}
          onToggle={toggleService}
          onContinue={handleUpsellContinue}
          onClose={() => setShowUpsell(false)}
        />
      )}

      <div className="fixed inset-0 top-16 flex bg-white">
        {/* Left Panel */}
        <div className="w-full md:w-[500px] md:flex-shrink-0 overflow-y-auto px-4 md:px-8 py-10 md:border-r border-uber-gray-100">
          {/* Greeting */}
          <div className="mb-8">
            <h1 className="text-4xl font-black text-black leading-tight">
              What needs work,{' '}

              {/* {console.log("this is what user is:", user)} */}
              <span className="text-uber-gray-400">{user?.name?.split(' ')[0] ?? 'partner'}?</span>
            </h1>
            <p className="text-uber-gray-400 text-sm mt-1">Book a service with lintel.</p>
          </div>

          {/* Address */}
          <div className="mb-8">
            <p className="text-xs font-bold text-uber-gray-400 uppercase tracking-widest mb-2">Service Address</p>
            <div className="relative">
              <div className="absolute left-5 top-6 w-2 h-2 rounded-full bg-black z-10 pointer-events-none" />
              <AddressSearch
                value={address}
                onChange={(addr) => setAddress(addr)}
                onConfirm={handleAddressConfirm}
                placeholder="Enter your address"
                className="pl-4"
              />
            </div>

            {confirmedAddress && (
              <div className="flex items-center gap-1.5 mt-2 ml-1">
                <CheckCircle className="w-3.5 h-3.5 text-uber-green" />
                <span className="text-xs text-uber-green font-semibold">Address confirmed</span>
              </div>
            )}

            {address && !confirmedAddress && (
              <p className="mt-2 ml-1 text-xs text-uber-gray-400">Select an address from the suggestions</p>
            )}
          </div>

          {/* Quote loading banner */}
          {quotesLoading && (
            <div className="mb-6 rounded-xl border border-uber-gray-100 bg-uber-gray-50 overflow-hidden">
              <div className="flex items-center gap-2.5 px-4 pt-3 pb-2">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-black flex-shrink-0" />
                <p className="text-sm font-semibold text-black">Finding your quote…</p>
              </div>
              <div className="mx-4 mb-3 h-1 bg-uber-gray-200 rounded-full overflow-hidden">
                <div className="h-full w-1/3 bg-black rounded-full animate-progress-slide" />
              </div>
            </div>
          )}

          {/* Services */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-bold text-uber-gray-400 uppercase tracking-widest">Choose services</p>
              {hasBundle && (
                <span className="text-xs font-bold text-uber-green">Multi-select on</span>
              )}
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="w-6 h-6 animate-spin text-uber-gray-400" />
              </div>
            ) : (
              <div className="space-y-2">
                {serviceList?.map((service) => {
                  const comingSoon = COMING_SOON.includes(service.id);
                  const isSelected = selectedServices.includes(service.id);
                  const effectivePrice = priceFor(service.id, service.price);
                  const discountedPrice = hasBundle && isSelected ? effectivePrice * (1 - BUNDLE_DISCOUNT) : undefined;
                  return (
                    <ServiceCard
                      key={service.id}
                      service={{ ...service, price: effectivePrice }}
                      selected={isSelected}
                      comingSoon={comingSoon}
                      discountedPrice={discountedPrice}
                      priceLoading={quotesLoading && !comingSoon}
                      onClick={() => { if (!comingSoon) toggleService(service.id); }}
                    />
                  );
                })}
              </div>
            )}
          </div>

          {/* Bundle discount banner */}
          {hasBundle && (
            <div className="flex items-center gap-3 bg-uber-green/10 border border-uber-green/20 rounded-xl px-4 py-3 mb-4">
              <Sparkles className="w-4 h-4 text-uber-green flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-bold text-uber-green">10% bundle discount applied</p>
                <p className="text-xs text-uber-green/70 mt-0.5">
                  Saving {formatCurrency(savings)} on this order
                </p>
              </div>
              <p className="text-lg font-black text-uber-green">{formatCurrency(subtotal - savings)}</p>
            </div>
          )}

          {/* CTA */}
          <button
            onClick={handleContinue}
            disabled={selectedServices.length === 0 || !confirmedAddress || quotesLoading}
            className="w-full h-14 bg-black text-white font-bold text-base rounded-xl flex items-center justify-center gap-2 hover:bg-uber-gray-800 transition-colors disabled:bg-uber-gray-200 disabled:text-uber-gray-400 disabled:cursor-not-allowed"
          >
            Continue
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Right Panel - Map (hidden on mobile) */}
        <div className="hidden md:block flex-1">
          <MapView coordinates={coordinates} />
        </div>
      </div>
    </>
  );
}
