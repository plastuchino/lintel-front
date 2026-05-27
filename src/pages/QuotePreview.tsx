import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CheckCircle, Loader2, ChevronRight, Lock } from 'lucide-react';
import { Turnstile, type TurnstileInstance } from '@marsidev/react-turnstile';
import { useBookingStore } from '../store/bookingStore';
import { AddressSearch } from '../components/AddressSearch';
import { MapView } from '../components/MapView';
import { ServiceCard } from '../components/ServiceCard';
import { jobs, services } from '../lib/api';
import type { ServiceType, Service } from '../lib/api';
import { getPreviewCache, setPreviewCache, clearPreviewCache } from '../lib/previewCache';
import logo from '../assets/logo.jpeg';

const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY as string;
const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN as string;
const TTL_MS = 30 * 60 * 1000;

async function geocodeAddress(address: string): Promise<{ lat: number; lng: number } | null> {
  if (!MAPBOX_TOKEN) return null;
  try {
    const res = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${MAPBOX_TOKEN}&limit=1`
    );
    const data = await res.json();
    const center = data.features?.[0]?.center as [number, number] | undefined;
    if (!center) return null;
    return { lng: center[0], lat: center[1] };
  } catch {
    return null;
  }
}

function formatCountdown(ms: number): string {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export default function QuotePreview() {
  const navigate = useNavigate();
  const {
    address, setAddress, setCoordinates,
    captchaToken: prewarmedToken,
    captchaTokenAt: prewarmedTokenAt,
    clearCaptchaToken,
  } = useBookingStore();

  const [phase, setPhase] = useState<'input' | 'loading' | 'quote' | 'expired'>('input');
  const [inputVal, setInputVal] = useState(address);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [quotes, setQuotes] = useState<Record<ServiceType, number> | null>(null);
  const [serviceList, setServiceList] = useState<Service[]>([]);
  const [expiresAt, setExpiresAt] = useState<number>(0);
  const [remaining, setRemaining] = useState<number>(TTL_MS);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Turnstile state
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [pendingAddress, setPendingAddress] = useState<string | null>(null);
  const [pendingCoords, setPendingCoords] = useState<{ lat: number; lng: number } | null>(null);
  const turnstileRef = useRef<TurnstileInstance>(undefined);

  // Load service list for card rendering
  useEffect(() => {
    services.list().then((r) => setServiceList(r.data)).catch(() => {});
  }, []);

  // Check sessionStorage cache on mount
  useEffect(() => {
    if (!address) return;
    const cached = getPreviewCache(address);
    if (cached) {
      setCoords(cached.coords);
      setCoordinates(cached.coords);
      setQuotes(cached.quotes as Record<ServiceType, number>);
      setExpiresAt(cached.expiresAt);
      setRemaining(cached.expiresAt - Date.now());
      setPhase('quote');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Countdown ticker
  useEffect(() => {
    if (phase !== 'quote') return;
    const tick = setInterval(() => {
      const left = expiresAt - Date.now();
      if (left <= 0) {
        clearInterval(tick);
        setRemaining(0);
        clearPreviewCache();
        setPhase('expired');
      } else {
        setRemaining(left);
      }
    }, 1000);
    return () => clearInterval(tick);
  }, [phase, expiresAt]);

  const fetchQuote = useCallback(async (addr: string, token: string, geocoords?: { lat: number; lng: number } | null) => {
    setPhase('loading');
    setLoadError(null);
    try {
      const res = await jobs.getQuotePreview(addr, token, geocoords ?? undefined);
      const { quotes: q, lat, lng } = res.data;
      const c = { lat, lng };
      const exp = setPreviewCache(addr, q as Record<ServiceType, number>, c);
      setCoords(c);
      setCoordinates(c);
      setQuotes(q as Record<ServiceType, number>);
      setExpiresAt(exp);
      setRemaining(TTL_MS);
      setPhase('quote');
    } catch (err: unknown) {
      const status = (err as { response?: { status?: number } }).response?.status;
      if (status === 429) {
        setLoadError('Too many requests. Please wait before getting another quote.');
      } else if (status === 400) {
        setLoadError('Verification failed. Please refresh and try again.');
      } else {
        setLoadError('Something went wrong. Please try again.');
      }
      setPhase('input');
      turnstileRef.current?.reset();
      setCaptchaToken(null);
    }
  }, []);

  // Fire API call once we have both address and CAPTCHA token
  useEffect(() => {
    if (pendingAddress && captchaToken) {
      fetchQuote(pendingAddress, captchaToken, pendingCoords);
      setPendingAddress(null);
      setPendingCoords(null);
    }
  }, [pendingAddress, captchaToken, pendingCoords, fetchQuote]);

  const handleConfirm = async (addr: string) => {
    if (!addr.trim()) return;
    setAddress(addr, true);
    setInputVal(addr);

    // Check cache first
    const cached = getPreviewCache(addr);
    if (cached) {
      setCoords(cached.coords);
      setCoordinates(cached.coords);
      setQuotes(cached.quotes as Record<ServiceType, number>);
      setExpiresAt(cached.expiresAt);
      setRemaining(cached.expiresAt - Date.now());
      setPhase('quote');
      return;
    }

    // Geocode client-side to populate MapView and pass coords to backend
    setPhase('loading');
    const clientCoords = await geocodeAddress(addr);
    if (clientCoords) setCoords(clientCoords);
    setPendingCoords(clientCoords);

    // Use pre-warmed token from landing page if fresh (< 4 min old)
    const FOUR_MIN_MS = 4 * 60 * 1000;
    if (prewarmedToken && prewarmedTokenAt && Date.now() - prewarmedTokenAt < FOUR_MIN_MS) {
      clearCaptchaToken();
      setCaptchaToken(prewarmedToken);
      setPendingAddress(addr);
      return;
    }

    // No fresh pre-warmed token — wait for in-page Turnstile widget
    setPendingAddress(addr);
  };

  const handleServiceClick = () => {
    setShowLoginModal(true);
  };

  const toLogin = () => {
    // address is already in bookingStore so /book will pre-populate it
    navigate('/login');
  };

  const handleRefresh = () => {
    clearPreviewCache();
    setQuotes(null);
    setCaptchaToken(null);
    setPhase('input');
    turnstileRef.current?.reset();
  };

  const progressPct = Math.max(0, Math.min(100, (remaining / TTL_MS) * 100));

  /* ── Address input phase ─────────────────────────────────────────────── */
  if (phase === 'input' || phase === 'loading') {
    return (
      <div className="fixed inset-0 flex bg-white" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
        {/* Left panel */}
        <div className="w-full md:w-[500px] md:flex-shrink-0 overflow-y-auto px-8 py-10 md:border-r border-black/10 flex flex-col">
          <header className="mb-10 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2.5">
              <img src={logo} alt="lintel" className="h-7 w-7 rounded-full object-cover" />
              <span className="text-black text-sm font-bold tracking-[0.15em] uppercase">LINTEL</span>
            </Link>
            <button
              onClick={() => navigate('/login')}
              className="px-4 h-8 flex items-center text-black text-[11px] font-semibold tracking-[0.1em] uppercase hover:bg-black/5 transition-colors"
            >
              LOG IN
            </button>
          </header>

          <div className="mb-8">
            <h1 className="text-4xl font-black text-black leading-tight">
              Get your instant quote,{' '}
              <span className="text-uber-gray-400">today.</span>
            </h1>
            <p className="text-uber-gray-400 text-sm mt-2">No sign-up required to see your price.</p>
          </div>

          <div className="mb-6">
            <p className="text-xs font-bold text-uber-gray-400 uppercase tracking-widest mb-2">Service Address</p>
            <div className="relative">
              <div className="absolute left-5 top-6 w-2 h-2 rounded-full bg-black z-10 pointer-events-none" />
              <AddressSearch
                value={inputVal}
                onChange={setInputVal}
                onConfirm={handleConfirm}
                placeholder="Enter your home address…"
                className="pl-4"
              />
            </div>
            {inputVal && (
              <div className="flex items-center gap-1.5 mt-2 ml-1">
                <CheckCircle className="w-3.5 h-3.5 text-uber-green" />
                <span className="text-xs text-uber-green font-semibold">Address confirmed</span>
              </div>
            )}
          </div>

          {loadError && (
            <p className="text-sm text-red-600 mb-4">{loadError}</p>
          )}

          {phase === 'loading' && (
            <div className="mb-6 rounded-xl border border-uber-gray-100 bg-uber-gray-50 overflow-hidden">
              <div className="flex items-center gap-2.5 px-4 pt-3 pb-2">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-black flex-shrink-0" />
                <p className="text-sm font-semibold text-black">
                  {!captchaToken ? 'Verifying…' : 'Analyzing your property…'}
                </p>
              </div>
              <div className="mx-4 mb-3 h-1 bg-uber-gray-200 rounded-full overflow-hidden">
                <div className="h-full w-1/3 bg-black rounded-full animate-progress-slide" />
              </div>
            </div>
          )}

          <button
            onClick={() => handleConfirm(inputVal)}
            disabled={!inputVal.trim() || phase === 'loading'}
            className="w-full h-14 bg-black text-white font-bold text-base rounded-xl flex items-center justify-center gap-2 hover:bg-uber-gray-800 transition-colors disabled:bg-uber-gray-200 disabled:text-uber-gray-400 disabled:cursor-not-allowed"
          >
            {phase === 'loading' ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Get My Quote <ChevronRight className="w-5 h-5" /></>}
          </button>

          {/* Turnstile widget — invisible, fires automatically */}
          <Turnstile
            ref={turnstileRef}
            siteKey={TURNSTILE_SITE_KEY}
            onSuccess={(token) => setCaptchaToken(token)}
            onError={() => { setLoadError('Verification failed. Please try again.'); setPhase('input'); }}
            onExpire={() => { setLoadError('Verification expired. Please try again.'); setPhase('input'); turnstileRef.current?.reset(); setCaptchaToken(null); }}
            options={{ size: 'invisible' }}
            className="mt-4"
          />
        </div>

        {/* Right panel — MapView */}
        <div className="hidden md:block flex-1">
          <MapView coordinates={coords} />
        </div>
      </div>
    );
  }

  /* ── Expired phase ───────────────────────────────────────────────────── */
  if (phase === 'expired') {
    return (
      <div className="fixed inset-0 flex bg-white" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
        <div className="w-full md:w-[500px] md:flex-shrink-0 overflow-y-auto px-8 py-10 md:border-r border-black/10 flex flex-col">
          <header className="mb-10 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2.5">
              <img src={logo} alt="lintel" className="h-7 w-7 rounded-full object-cover" />
              <span className="text-black text-sm font-bold tracking-[0.15em] uppercase">LINTEL</span>
            </Link>
          </header>
          <div className="flex-1 flex flex-col items-center justify-center text-center gap-6">
            <div className="w-14 h-14 rounded-full bg-black/5 flex items-center justify-center">
              <span className="text-2xl">⏱</span>
            </div>
            <div>
              <h2 className="text-xl font-black text-black mb-2">Your quote has expired</h2>
              <p className="text-sm text-uber-gray-400">Quotes are valid for 30 minutes. Get a fresh one below.</p>
            </div>
            <button
              onClick={handleRefresh}
              className="h-12 px-8 bg-black text-white font-bold text-sm rounded-xl hover:bg-uber-gray-800 transition-colors"
            >
              Get a new quote
            </button>
          </div>
        </div>
        <div className="hidden md:block flex-1">
          <MapView coordinates={coords} />
        </div>
      </div>
    );
  }

  /* ── Quote phase ─────────────────────────────────────────────────────── */
  const quotableServices = serviceList.filter(
    (s) => !['house-cleaning-standard', 'house-cleaning-deep', 'lawn-mowing'].includes(s.id)
  );

  return (
    <>
      <div className="fixed inset-0 top-0 flex bg-white" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
        {/* Left panel */}
        <div className="w-full md:w-[500px] md:flex-shrink-0 overflow-y-auto px-8 py-10 md:border-r border-black/10">
          <header className="mb-8 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2.5">
              <img src={logo} alt="lintel" className="h-7 w-7 rounded-full object-cover" />
              <span className="text-black text-sm font-bold tracking-[0.15em] uppercase">LINTEL</span>
            </Link>
            <div className="flex items-center gap-2">
              <button onClick={toLogin} className="px-4 h-8 flex items-center text-black text-[11px] font-semibold tracking-[0.1em] uppercase hover:bg-black/5 transition-colors">
                LOG IN
              </button>
              <button onClick={toLogin} className="px-4 h-8 flex items-center bg-black text-white text-[11px] font-semibold tracking-[0.1em] uppercase hover:bg-black/80 transition-colors">
                SIGN UP
              </button>
            </div>
          </header>

          <div className="mb-6">
            <h1 className="text-4xl font-black text-black leading-tight">
              What needs work,{' '}
              <span className="text-uber-gray-400">partner?</span>
            </h1>
            <p className="text-uber-gray-400 text-sm mt-1">Book a service with lintel.</p>
          </div>

          <div className="mb-6">
            <p className="text-xs font-bold text-uber-gray-400 uppercase tracking-widest mb-1">Service Address</p>
            <div className="flex items-center gap-2 px-4 py-3 border border-uber-gray-100 rounded-xl bg-uber-gray-50">
              <div className="w-2 h-2 rounded-full bg-black flex-shrink-0" />
              <p className="text-sm font-medium text-black truncate">{address}</p>
            </div>
            <div className="flex items-center gap-1.5 mt-1.5 ml-1">
              <CheckCircle className="w-3.5 h-3.5 text-uber-green" />
              <span className="text-xs text-uber-green font-semibold">Address confirmed</span>
            </div>
          </div>

          {/* Countdown timer */}
          <div className="mb-6 rounded-xl border border-uber-gray-100 bg-uber-gray-50 px-4 py-3">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-bold text-uber-gray-400 uppercase tracking-widest">Quote valid for</p>
              <p className="text-sm font-bold text-black tabular-nums">{formatCountdown(remaining)}</p>
            </div>
            <div className="h-1 bg-uber-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-black rounded-full transition-all duration-1000"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <p className="text-[11px] text-uber-gray-400 mt-1.5">Log in to book before this price expires.</p>
          </div>

          {/* Service list */}
          <div className="mb-4">
            <p className="text-xs font-bold text-uber-gray-400 uppercase tracking-widest mb-3">Choose services</p>
            <div className="space-y-2">
              {quotableServices.map((svc) => {
                const price = quotes?.[svc.id] ?? svc.price;
                return (
                  <ServiceCard
                    key={svc.id}
                    service={{ ...svc, price }}
                    selected={false}
                    onClick={handleServiceClick}
                  />
                );
              })}
            </div>
          </div>
        </div>

        {/* Right panel — satellite map */}
        <div className="hidden md:block flex-1">
          <MapView coordinates={coords} />
        </div>
      </div>

      {/* Login modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowLoginModal(false)} />
          <div className="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8 flex flex-col items-center gap-6">
            <div className="w-14 h-14 bg-black rounded-xl flex items-center justify-center">
              <Lock className="w-6 h-6 text-white" strokeWidth={1.5} />
            </div>
            <div className="text-center">
              <h2 className="text-lg font-black text-black mb-2">Log in to book</h2>
              <p className="text-sm text-uber-gray-400 leading-relaxed">
                Your quote is ready. Log in or create an account to confirm your booking at this price.
              </p>
            </div>
            <div className="w-full flex flex-col gap-3">
              <button
                onClick={toLogin}
                className="w-full h-12 bg-black text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2.5 hover:bg-uber-gray-800 transition-colors"
              >
                <GoogleG />
                Continue with Google
              </button>
              <button
                onClick={toLogin}
                className="w-full h-12 border-2 border-black/20 text-black font-bold text-sm rounded-xl hover:border-black transition-colors"
              >
                Create an account
              </button>
            </div>
            <button onClick={() => setShowLoginModal(false)} className="text-xs text-uber-gray-400 hover:text-black transition-colors">
              Back to quote
            </button>
          </div>
        </div>
      )}
    </>
  );
}

function GoogleG() {
  return (
    <svg width="16" height="16" viewBox="0 0 18 18" aria-hidden="true">
      <path fill="#fff" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" />
      <path fill="#fff" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" />
      <path fill="#fff" d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z" />
      <path fill="#fff" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58z" />
    </svg>
  );
}
