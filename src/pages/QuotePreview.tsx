import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, ChevronRight } from 'lucide-react';
import { useBookingStore } from '../store/bookingStore';
import { AddressSearch } from '../components/AddressSearch';
import logo from '../assets/logo.jpeg';

// Prices mirror backend/src/data/services.ts — keep in sync if prices change
const SERVICES = [
  {
    id: 'gutter-cleaning',
    name: 'Gutter Cleaning',
    code: 'LNT-001',
    desc: 'Full gutter clearing, downspout flush, and debris removal.',
    duration: '2–3 hrs',
    price: 149,
  },
  {
    id: 'window-cleaning',
    name: 'Exterior Window Cleaning',
    code: 'LNT-002',
    desc: 'Exterior window cleaning with purified water, streak-free finish.',
    duration: '1–2 hrs',
    price: 250,
  },
  {
    id: 'window-cleaning-interior',
    name: 'Interior Window Cleaning',
    code: 'LNT-003',
    desc: 'Interior window cleaning, streak-free finish from the inside.',
    duration: '1–2 hrs',
    price: 175,
  },
  {
    id: 'pressure-washing',
    name: 'Pressure Washing',
    code: 'LNT-004',
    desc: 'Driveway, walkway, patio, and siding pressure wash.',
    duration: '2–3 hrs',
    price: 179,
  },
];

const TOTAL = SERVICES.reduce((s, svc) => s + svc.price, 0);

function BlurredPrice({ value }: { value: string }) {
  return (
    <span
      className="font-bold text-black text-sm tracking-wide tabular-nums"
      style={{ filter: 'blur(5px)', userSelect: 'none' }}
      aria-hidden="true"
    >
      {value}
    </span>
  );
}


export default function QuotePreview() {
  const navigate = useNavigate();
  const { address, setAddress } = useBookingStore();

  const [phase, setPhase] = useState<'input' | 'quote'>(address.trim() ? 'quote' : 'input');
  const [inputVal, setInputVal] = useState(address);
  // How many service cards have finished "loading"
  const [loadedCount, setLoadedCount] = useState(0);
  const [showModal, setShowModal] = useState(false);

  // All cards show immediately; content resolves after a beat, then modal appears
  useEffect(() => {
    if (phase !== 'quote') return;
    setLoadedCount(0);
    setShowModal(false);

    const resolveTimer = setTimeout(() => setLoadedCount(SERVICES.length), 1400);
    const modalTimer  = setTimeout(() => setShowModal(true), 1900);

    return () => {
      clearTimeout(resolveTimer);
      clearTimeout(modalTimer);
    };
  }, [phase]);

  const handleConfirm = (addr: string) => {
    if (!addr.trim()) return;
    setAddress(addr, true);
    setInputVal(addr);
    setPhase('quote');
  };

  const toLogin = () => navigate('/login');

  /* ── Phase: address input ─────────────────────────────────────────── */
  if (phase === 'input') {
    return (
      <div className="min-h-screen bg-white flex flex-col" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
        <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-black/10">
          <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2.5">
              <img src={logo} alt="lintel" className="h-7 w-7 rounded-full object-cover" />
              <span className="text-black text-sm font-bold tracking-[0.15em] uppercase">LINTEL</span>
            </Link>
            <button onClick={toLogin} className="px-4 h-8 flex items-center text-black text-[11px] font-semibold tracking-[0.1em] uppercase hover:bg-black/5 transition-colors">
              LOG IN
            </button>
          </div>
        </header>
        <div className="flex-1 flex items-center justify-center pt-14 px-4">
          <div className="w-full max-w-md">
            <div className="border-l-2 border-black pl-4 mb-8">
              <p className="text-[10px] font-mono text-black/35 tracking-[0.2em] uppercase mb-1">Get instant pricing</p>
              <h1 className="text-2xl font-black text-black tracking-tight uppercase">Enter your address</h1>
            </div>
            <p className="text-sm text-black/50 mb-8 leading-relaxed">
              We'll generate a custom quote for your property — no signup required to see your estimate.
            </p>
            <div className="border border-black/20 bg-white p-4">
              <p className="text-[10px] font-mono font-semibold text-black/40 tracking-[0.2em] uppercase mb-3">Your Address</p>
              <AddressSearch
                value={inputVal}
                onChange={setInputVal}
                onConfirm={handleConfirm}
                placeholder="Enter your home address…"
              />
              <button
                onClick={() => handleConfirm(inputVal)}
                disabled={!inputVal.trim()}
                className="mt-3 w-full h-11 bg-black text-white font-bold text-[11px] tracking-[0.2em] uppercase flex items-center justify-center gap-2 hover:bg-black/80 transition-colors disabled:bg-black/20 disabled:cursor-not-allowed"
              >
                GET MY QUOTE
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ── Phase: quote (with staggered lazy load + deferred modal) ─────── */
  const allLoaded = loadedCount >= SERVICES.length;

  return (
    <div className="min-h-screen bg-white text-black relative" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>

      {/* ── Nav ───────────────────────────────────────────────────────── */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-black/10">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
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
        </div>
      </header>

      {/* ── Background content ────────────────────────────────────────── */}
      <div className={`pt-14 transition-all duration-300 ${showModal ? 'pointer-events-none select-none' : ''}`}>
        <div className="max-w-7xl mx-auto px-6 py-16 flex flex-col lg:flex-row gap-16 min-h-[calc(100vh-3.5rem)]">

          {/* ── Left: Quote ─────────────────────────────────────────── */}
          <div className="flex-1 max-w-lg">

            {/* Header — address is here, NOT blurred */}
            <div className="border-l-2 border-black pl-4 mb-10">
              <p className="text-[10px] font-mono text-black/35 tracking-[0.2em] uppercase mb-1">Project at home</p>
              <h1 className="text-xl font-black text-black tracking-tight uppercase mb-3">Quote Preview</h1>
              <p className="text-sm font-semibold text-black">{address}</p>
              <p className="text-[10px] font-mono text-black/35 mt-1">Your property</p>
            </div>

            {/* Service rows — names always visible, desc+price shimmer until resolved */}
            <div className="border-t border-black/10">
              {SERVICES.map((svc) => (
                <div
                  key={svc.id}
                  className="group py-5 border-b border-black/10 flex items-start gap-4 px-1 cursor-pointer hover:bg-black/[0.025] transition-colors"
                >
                  <div className="mt-0.5 w-4 h-4 flex-shrink-0 border border-black/30 group-hover:border-black transition-colors" />

                  <div className="flex-1 min-w-0">
                    {/* Name — always visible */}
                    <div className="flex items-center gap-2 mb-2">
                      <p className="text-[11px] font-bold text-black tracking-[0.1em] uppercase">{svc.name}</p>
                      <span className="text-[9px] font-mono text-black/25 tracking-wider">{svc.code}</span>
                    </div>
                    {/* Description — shimmer until resolved */}
                    {allLoaded ? (
                      <>
                        <p className="text-[11px] text-black/45 leading-relaxed mb-1">{svc.desc}</p>
                        <p className="text-[10px] font-mono text-black/30 tracking-wider">{svc.duration}</p>
                      </>
                    ) : (
                      <div className="space-y-2">
                        <div className="skeleton-shimmer h-3 w-56 rounded-sm" />
                        <div className="skeleton-shimmer h-2.5 w-24 rounded-sm" />
                      </div>
                    )}
                  </div>

                  {/* Price — shimmer until resolved */}
                  <div className="flex flex-col items-end gap-1 flex-shrink-0 mt-0.5">
                    {allLoaded ? (
                      <>
                        <BlurredPrice value={`$${svc.price}.00`} />
                        <span className="text-[9px] font-mono text-black/25 uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
                          Select
                        </span>
                      </>
                    ) : (
                      <div className="skeleton-shimmer h-4 w-20 rounded-sm" />
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Total — shimmer until resolved */}
            <div className="pt-5 px-1 flex items-start justify-between">
              <div>
                <p className="text-[11px] font-bold text-black tracking-[0.1em] uppercase">Total Est.</p>
                <p className="text-[10px] font-mono text-black/30 mt-0.5 max-w-[200px] leading-relaxed">
                  Calculated based on property and selected services
                </p>
              </div>
              {allLoaded ? (
                <BlurredPrice value={`$${TOTAL}.00`} />
              ) : (
                <div className="skeleton-shimmer h-4 w-24 rounded-sm mt-0.5" />
              )}
            </div>
          </div>

          {/* ── Right: Property visual ─────────────────────────────── */}
          <div className="flex-1 flex justify-center lg:justify-end items-start pt-4 opacity-[0.12]">
            <PropertyVisual />
          </div>
        </div>
      </div>

      {/* ── Login-gate modal (appears after all cards load) ───────────── */}
      {showModal && (
        <div className="fixed inset-0 z-40 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-white/65 backdrop-blur-[2px]" />
          <div className="relative z-10 bg-white border border-black/12 shadow-2xl w-full max-w-sm mx-auto p-8 flex flex-col items-center gap-6">
            {/* Lock */}
            <div className="w-14 h-14 bg-black flex items-center justify-center">
              <Lock className="w-6 h-6 text-white" strokeWidth={1.5} />
            </div>

            {/* Headline */}
            <div className="text-center">
              <h2 className="text-sm font-black text-black tracking-[0.08em] uppercase mb-3">
                Log in to see your custom quote
              </h2>
              <p className="text-[12px] text-black/50 leading-relaxed">
                Please take a moment to quickly log in or sign up so we can show you your
                precision quote options.
              </p>
            </div>

            {/* CTAs */}
            <div className="w-full flex flex-col gap-3">
              <button
                onClick={toLogin}
                className="w-full h-12 bg-black text-white text-[11px] font-bold tracking-[0.15em] uppercase flex items-center justify-center gap-2.5 hover:bg-black/80 transition-colors"
              >
                <GoogleG />
                Continue with Google
              </button>

              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-black/10" />
                <span className="text-[10px] font-mono text-black/30 tracking-[0.15em]">OR</span>
                <div className="flex-1 h-px bg-black/10" />
              </div>

              <button
                onClick={toLogin}
                className="w-full h-12 border border-black/25 text-black text-[11px] font-bold tracking-[0.15em] uppercase flex items-center justify-center hover:border-black transition-colors"
              >
                Create an account
              </button>
            </div>

            {/* Fine print */}
            <p className="text-[10px] text-black/30 text-center leading-relaxed font-mono">
              By continuing, you agree to Lintel's{' '}
              <button onClick={toLogin} className="underline underline-offset-2">Terms of Service</button>
              {' '}and{' '}
              <button onClick={toLogin} className="underline underline-offset-2">Privacy Policy</button>.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Google G ─────────────────────────────────────────────────────────────── */
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

/* ── Property visual ──────────────────────────────────────────────────────── */
function PropertyVisual() {
  return (
    <div className="relative w-full max-w-[500px]">
      <svg viewBox="0 0 500 370" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        {Array.from({ length: 14 }).map((_, i) => (
          <line key={`h${i}`} x1="0" y1={i * 28} x2="500" y2={i * 28} stroke="#000" strokeWidth="0.4" opacity="0.3" />
        ))}
        {Array.from({ length: 18 }).map((_, i) => (
          <line key={`v${i}`} x1={i * 28} y1="0" x2={i * 28} y2="370" stroke="#000" strokeWidth="0.4" opacity="0.3" />
        ))}
        <line x1="30" y1="300" x2="470" y2="300" stroke="#000" strokeWidth="0.8" opacity="0.6" />
        <rect x="120" y="170" width="260" height="130" fill="none" stroke="#000" strokeWidth="1.3" opacity="0.8" />
        <polyline points="100,172 250,70 400,172" fill="none" stroke="#000" strokeWidth="1.3" opacity="0.8" />
        <line x1="100" y1="172" x2="400" y2="172" stroke="#000" strokeWidth="0.7" opacity="0.4" />
        <rect x="300" y="90" width="22" height="50" fill="none" stroke="#000" strokeWidth="1" opacity="0.5" />
        <rect x="218" y="232" width="64" height="68" fill="none" stroke="#000" strokeWidth="1" opacity="0.7" />
        <line x1="250" y1="232" x2="250" y2="300" stroke="#000" strokeWidth="0.5" opacity="0.4" />
        <circle cx="262" cy="268" r="2.5" fill="#000" opacity="0.5" />
        <rect x="138" y="192" width="52" height="44" fill="none" stroke="#000" strokeWidth="1" opacity="0.6" />
        <line x1="164" y1="192" x2="164" y2="236" stroke="#000" strokeWidth="0.5" opacity="0.3" />
        <line x1="138" y1="214" x2="190" y2="214" stroke="#000" strokeWidth="0.5" opacity="0.3" />
        <rect x="310" y="192" width="52" height="44" fill="none" stroke="#000" strokeWidth="1" opacity="0.6" />
        <line x1="336" y1="192" x2="336" y2="236" stroke="#000" strokeWidth="0.5" opacity="0.3" />
        <line x1="310" y1="214" x2="362" y2="214" stroke="#000" strokeWidth="0.5" opacity="0.3" />
        <line x1="72" y1="300" x2="72" y2="214" stroke="#000" strokeWidth="1" opacity="0.35" />
        <ellipse cx="72" cy="196" rx="28" ry="36" fill="none" stroke="#000" strokeWidth="1" opacity="0.35" />
        <line x1="430" y1="300" x2="430" y2="206" stroke="#000" strokeWidth="1" opacity="0.35" />
        <ellipse cx="430" cy="188" rx="28" ry="36" fill="none" stroke="#000" strokeWidth="1" opacity="0.35" />
        <text x="250" y="338" fontFamily="monospace" fontSize="7.5" fill="#000" opacity="0.4" textAnchor="middle">STRUCTURAL ANALYSIS</text>
      </svg>
    </div>
  );
}
