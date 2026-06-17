import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { CheckCircle, Loader2, ChevronRight, Sparkles, Phone, Shield, Star, CreditCard, Users } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../store/authStore';
import { useBookingStore } from '../store/bookingStore';
import { services, users, jobs } from '../lib/api';
import type { ServiceType } from '../lib/api';
import { ServiceCard } from '../components/ServiceCard';
import { UpsellModal } from '../components/UpsellModal';
import { AddressSearch } from '../components/AddressSearch';
import { MapView } from '../components/MapView';
import { ServiceQuoteCTA } from '../components/ServiceQuoteCTA';
import { formatCurrency } from '../lib/utils';
import { toast } from '../hooks/useToast';
import logo from '../assets/logo.jpeg';
import heroImage from '../assets/site_asset_gutter_one.png';

const TRUST_ITEMS = [
  { icon: Shield,     label: '$1M Insured',          desc: 'Every job covered under general liability.' },
  { icon: Star,       label: '4.9★ Average Rating',  desc: 'Rated by real homeowners after every job.' },
  { icon: CreditCard, label: 'Pay After',             desc: 'Your card isn\'t charged until you confirm the work is done.' },
  { icon: Users,      label: 'Background Verified',  desc: 'Every pro passes a full background check and identity verification.' },
];

const SERVICE_CARDS = [
  { to: '/services/gutter-cleaning',  label: 'Gutter Cleaning',   price: 'From $149', desc: 'Vacuum-based debris removal. Downspouts flushed. Fully insured.' },
  { to: '/services/pressure-washing', label: 'Pressure Washing',  price: 'From $200', desc: 'Driveways, patios, decks, siding. Surface-appropriate PSI.' },
  { to: '/services/window-cleaning',  label: 'Window Cleaning',   price: 'From $250', desc: 'Streak-free interior or exterior. Water-fed pole system.' },
];

function MarketingPage() {
  return (
    <div className="min-h-screen bg-white text-black" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      <Helmet>
        <title>Home Services in Montgomery County, MD | Lintel</title>
        <meta name="description" content="Book gutter cleaning, pressure washing, and window cleaning from vetted local pros in Montgomery County, MD. Pay only after the job is done." />
      </Helmet>

      {/* Nav */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-black/10">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <img src={logo} alt="Lintel" className="h-7 w-7 rounded-full object-cover" />
            <span className="text-black text-sm font-bold tracking-[0.15em] uppercase">LINTEL</span>
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            <Link to="/services/gutter-cleaning"  className="px-4 h-9 flex items-center text-black/50 hover:text-black text-[11px] font-semibold tracking-[0.12em] uppercase transition-colors">Gutters</Link>
            <Link to="/services/pressure-washing" className="px-4 h-9 flex items-center text-black/50 hover:text-black text-[11px] font-semibold tracking-[0.12em] uppercase transition-colors">Pressure Washing</Link>
            <Link to="/services/window-cleaning"  className="px-4 h-9 flex items-center text-black/50 hover:text-black text-[11px] font-semibold tracking-[0.12em] uppercase transition-colors">Windows</Link>
          </nav>
          <div className="flex items-center gap-3">
            <a href="tel:12403660377" className="hidden md:flex items-center gap-1.5 text-black/60 hover:text-black text-[11px] font-semibold tracking-[0.08em] transition-colors">
              <Phone className="w-3.5 h-3.5" />(240) 366-0377
            </a>
            <a href="tel:12403660377" className="md:hidden flex items-center text-black/60 hover:text-black transition-colors">
              <Phone className="w-4 h-4" />
            </a>
            <Link to="/login" className="px-4 h-8 flex items-center bg-black text-white text-[11px] font-semibold tracking-[0.1em] uppercase hover:bg-black/80 transition-colors">
              BOOK NOW
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-14 bg-[#0d0d0d] min-h-[80vh] flex flex-col relative overflow-hidden">
        <img src={heroImage} className="absolute inset-0 w-full h-full object-cover object-center opacity-50" alt="" />
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative z-10 flex-1 w-full max-w-6xl mx-auto px-6 py-14 flex flex-col lg:flex-row lg:items-center lg:gap-16">
          <div className="flex-1 mb-10 lg:mb-0">
            <span className="inline-block bg-[#008060] text-white text-[10px] font-bold tracking-[0.2em] uppercase px-3 py-1 mb-6">Montgomery County, MD</span>
            <h1 className="text-4xl lg:text-6xl font-black text-white leading-tight uppercase mb-5 max-w-xl">
              Home services.<br />Vetted pros.<br />Pay after.
            </h1>
            <p className="text-white/60 text-base leading-relaxed max-w-md">
              Gutter cleaning, pressure washing, and window cleaning from background-checked local students. You don't pay until you confirm the job is done.
            </p>
          </div>
          <div className="w-full lg:w-[380px] lg:flex-shrink-0">
            <ServiceQuoteCTA serviceType="gutter-cleaning" />
          </div>
        </div>
      </section>

      {/* Story / Trust */}
      <section className="py-16 border-b border-black/10">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-[10px] font-mono text-black/35 tracking-[0.2em] uppercase mb-2">How Lintel Works</p>
          <h2 className="text-2xl font-black uppercase mb-10">Built different. On purpose.</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {TRUST_ITEMS.map(({ icon: Icon, label, desc }) => (
              <div key={label}>
                <Icon className="w-6 h-6 text-[#008060] mb-3" strokeWidth={1.5} />
                <p className="text-sm font-black text-black uppercase mb-1">{label}</p>
                <p className="text-xs text-black/55 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
          <div className="border-l-4 border-[#008060] pl-6 max-w-2xl">
            <p className="text-lg font-black text-black leading-snug mb-3">"Fast, professional, and honestly way cheaper than I expected."</p>
            <p className="text-[10px] font-mono text-black/40 uppercase tracking-widest">— Debra, Bethesda</p>
          </div>
        </div>
      </section>

      {/* Who does the work */}
      <section className="py-16 bg-black/[0.02] border-b border-black/10">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-[10px] font-mono text-black/35 tracking-[0.2em] uppercase mb-2">Our Pros</p>
            <h2 className="text-2xl font-black uppercase mb-4">Local Students. Real Work.</h2>
            <p className="text-sm text-black/60 leading-relaxed mb-4">
              Every Lintel pro is a vetted, background-checked student from the Montgomery County area. These are your neighbors — high school and college students who want to earn real income on a flexible schedule. Lintel provides all equipment and insurance; they provide the work ethic.
            </p>
            <p className="text-sm text-black/60 leading-relaxed">
              Before any pro can take a booking, they pass a full background check and identity verification. After every job, homeowners rate the pro — anyone below 4.5★ is paused and reviewed. The network average is 4.9★.
            </p>
          </div>
          <div className="space-y-4">
            {[
              ['Get an exact price', 'Enter your address — 30 seconds. Real price, not an estimate.'],
              ['Pick a time', 'We match you with a background-checked local pro.'],
              ['Pay after you confirm', 'You inspect the work. Your card isn\'t charged until you\'re satisfied.'],
            ].map(([title, desc], i) => (
              <div key={title} className="flex gap-4">
                <span className="flex-shrink-0 text-2xl font-black text-[#008060] leading-none w-7">{i + 1}</span>
                <div>
                  <p className="text-sm font-black text-black uppercase mb-0.5">{title}</p>
                  <p className="text-sm text-black/55 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-16 border-b border-black/10">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-[10px] font-mono text-black/35 tracking-[0.2em] uppercase mb-2">Services</p>
          <h2 className="text-2xl font-black uppercase mb-8">What We Do</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {SERVICE_CARDS.map(({ to, label, price, desc }) => (
              <Link key={to} to={to} className="group border border-black/10 p-6 hover:border-black/30 transition-colors block">
                <p className="text-[10px] font-mono text-black/35 uppercase tracking-widest mb-2">{price}</p>
                <p className="text-lg font-black text-black uppercase mb-2 group-hover:text-[#008060] transition-colors">{label}</p>
                <p className="text-sm text-black/50 leading-relaxed mb-4">{desc}</p>
                <span className="text-[11px] font-bold text-[#008060] uppercase tracking-[0.1em]">Get a price →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <span className="font-black tracking-[0.15em] text-sm uppercase">LINTEL</span>
            <p className="text-xs text-black/40 mt-1">Montgomery County, MD · (240) 366-0377</p>
          </div>
          <div className="flex gap-6">
            <Link to="/privacy" className="text-xs text-black/40 hover:text-black transition-colors">Privacy</Link>
            <Link to="/terms"   className="text-xs text-black/40 hover:text-black transition-colors">Terms</Link>
            <Link to="/blog"    className="text-xs text-black/40 hover:text-black transition-colors">Blog</Link>
            <Link to="/login"   className="text-xs text-black/40 hover:text-black transition-colors">Sign in</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

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

  if (!user) return <MarketingPage />;
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
      <Helmet>
        <title>Book a Home Service | Lintel</title>
        <meta name="description" content="Book gutter cleaning, pressure washing, window cleaning, and more from vetted professionals in Montgomery County, MD. Pay only after the job is done." />
      </Helmet>
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

          <p className="text-center mb-4">
            <Link to="/pricing" className="text-xs text-black/40 hover:text-black/60 transition-colors">
              How we price →
            </Link>
          </p>

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
