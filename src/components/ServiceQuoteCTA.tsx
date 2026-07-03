import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Shield, Star, CreditCard, Users, Phone, CheckCircle } from 'lucide-react';
import { AddressSearch } from './AddressSearch';
import { getAvailabilityMessage } from './TrustBadgeStrip';
import { prospects } from '../lib/api';
import type { ServiceType } from '../lib/api';

const SEALS = [
  { icon: Shield,     primary: '$1M',        secondary: 'Insured' },
  { icon: Star,       primary: '4.9★',        secondary: 'Avg Rating' },
  { icon: CreditCard, primary: 'Pay After',   secondary: 'Job Done' },
  { icon: Users,      primary: 'Background',  secondary: 'Verified' },
];

const LOADING_MESSAGES = [
  'Getting you the best price for your home…',
  'Checking what services your area supports…',
  'Almost there — this one\'s worth the wait…',
  'Pulling together your personalized quote…',
];

const SERVICE_LABELS: Record<string, string> = {
  'gutter-cleaning': 'Gutter Cleaning',
  'pressure-washing': 'Pressure Washing',
  'window-cleaning': 'Window Cleaning',
  'interior-window-cleaning': 'Interior Window Cleaning',
};

interface ServiceQuoteCTAProps {
  serviceType: ServiceType;
  className?: string;
}

type Phase = 'form' | 'loading' | 'result' | 'error';

export function ServiceQuoteCTA({ serviceType, className }: ServiceQuoteCTAProps) {
  const navigate = useNavigate();

  const [address, setLocalAddress] = useState('');
  const [confirmedAddress, setConfirmedAddress] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const [phase, setPhase] = useState<Phase>('form');
  const [progress, setProgress] = useState(0);
  const [msgIndex, setMsgIndex] = useState(0);
  const [quotedPrice, setQuotedPrice] = useState<number | null>(null);
  const [prospectId, setProspectId] = useState<string | null>(null);
  const [followedUp, setFollowedUp] = useState(false);

  const formRef = useRef<HTMLDivElement>(null);

  const isValid = confirmedAddress.trim() && name.trim() && email.trim();

  useEffect(() => {
    if (phase !== 'loading') return;
    const progressInterval = setInterval(() => {
      setProgress((p) => p + (90 - p) * 0.04);
    }, 100);
    const msgInterval = setInterval(() => {
      setMsgIndex((i) => i + 1);
    }, 3000);
    return () => {
      clearInterval(progressInterval);
      clearInterval(msgInterval);
    };
  }, [phase]);

  const handleConfirm = (addr: string) => {
    setConfirmedAddress(addr);
  };

  const handleSubmit = async () => {
    if (!isValid) return;
    setProgress(0);
    setMsgIndex(0);
    setPhase('loading');

    try {
      const res = await prospects.getQuote({
        name: name.trim(),
        email: email.trim(),
        address: confirmedAddress,
        serviceType,
      });
      const price = res.data?.quotes?.[serviceType] ?? null;
      setQuotedPrice(price);
      setProspectId(res.data?.prospectId ?? null);
      setProgress(100);
      setPhase('result');
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'conversion', { send_to: 'AW-18193036616/3ETTCIG0msQcEMjqjuND', value: 10, currency: 'USD', transaction_id: crypto.randomUUID() });
      }
    } catch {
      setProgress(0);
      setPhase('error');
    }
  };

  const handleRetry = () => {
    setPhase('form');
    setProgress(0);
  };

  /* ── Loading phase ──────────────────────────────────────────────────── */
  if (phase === 'loading') {
    return (
      <div ref={formRef} className={`bg-white overflow-hidden shadow-2xl ${className ?? ''}`}>
        <div className="bg-[#008060] px-6 py-4">
          <p className="text-white font-black text-base tracking-wide uppercase">Getting Your Price</p>
          <p className="text-white/65 text-[10px] font-mono tracking-widest mt-0.5">Just a moment…</p>
        </div>
        <div className="px-6 pt-8 pb-8 flex flex-col gap-4">
          <p className="text-sm font-semibold text-black text-center min-h-[40px] flex items-center justify-center">
            {LOADING_MESSAGES[msgIndex % LOADING_MESSAGES.length]}
          </p>
          <div className="h-1.5 bg-black/8 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#008060] rounded-full transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-[11px] text-black/35 font-mono text-center">
            Real price. No credit card required.
          </p>
        </div>
      </div>
    );
  }

  /* ── Result phase ────────────────────────────────────────────────────── */
  if (phase === 'result') {
    const serviceName = SERVICE_LABELS[serviceType] ?? serviceType;
    return (
      <div ref={formRef} className={`bg-white overflow-hidden shadow-2xl ${className ?? ''}`}>
        <div className="bg-[#008060] px-6 py-4">
          <p className="text-white font-black text-base tracking-wide uppercase">Your Free Quote</p>
          <p className="text-white/65 text-[10px] font-mono tracking-widest mt-0.5">Real price. Confirm after the job.</p>
        </div>
        <div className="px-6 pt-6 pb-6 flex flex-col gap-4">
          <div className="bg-[#F0EEEC] px-5 py-5 text-center">
            <p className="text-[10px] font-mono text-black/40 tracking-[0.2em] uppercase mb-1">{serviceName}</p>
            {quotedPrice != null ? (
              <p className="text-5xl font-black text-black leading-none">${Math.round(quotedPrice)}</p>
            ) : (
              <p className="text-base font-black text-black">We'll follow up with your exact price.</p>
            )}
            <p className="text-[11px] font-mono text-black/40 mt-2">Final price shown before you confirm booking.</p>
          </div>

          <div className="flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5 text-[#008060] flex-shrink-0" />
            <p className="text-[12px] text-[#008060] font-semibold">Quote sent to {email.trim()}</p>
          </div>

          <button
            onClick={() => navigate(prospectId ? `/book/q/${prospectId}` : '/login')}
            className="w-full bg-[#008060] text-white font-black text-[12px] tracking-[0.2em] uppercase flex items-center justify-center gap-2 hover:bg-[#006b50] transition-colors py-3.5"
          >
            BOOK NOW <ChevronRight className="w-4 h-4" />
          </button>

          {!followedUp ? (
            <button
              onClick={() => setFollowedUp(true)}
              className="w-full border border-black/15 text-black/60 font-semibold text-[11px] tracking-[0.1em] uppercase py-3 hover:bg-black/3 transition-colors"
            >
              We'll Follow Up in 1 Hour
            </button>
          ) : (
            <p className="text-center text-[12px] text-black/50 font-mono py-2">We'll be in touch shortly.</p>
          )}
        </div>
      </div>
    );
  }

  /* ── Error phase ─────────────────────────────────────────────────────── */
  if (phase === 'error') {
    return (
      <div ref={formRef} className={`bg-white overflow-hidden shadow-2xl ${className ?? ''}`}>
        <div className="bg-[#0d0d0d] px-6 py-4">
          <p className="text-white font-black text-base tracking-wide uppercase">Something Went Wrong</p>
          <p className="text-white/50 text-[10px] font-mono tracking-widest mt-0.5">Don't worry — your address is saved.</p>
        </div>
        <div className="px-6 pt-8 pb-8 flex flex-col gap-4 items-center text-center">
          <p className="text-sm text-black/60">We couldn't fetch your quote. Please try again.</p>
          <button
            onClick={handleRetry}
            className="w-full bg-[#008060] text-white font-black text-[12px] tracking-[0.2em] uppercase flex items-center justify-center gap-2 hover:bg-[#006b50] transition-colors py-3.5"
          >
            Try Again <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  /* ── Form phase ──────────────────────────────────────────────────────── */
  return (
    <div ref={formRef} className={`bg-white overflow-hidden shadow-2xl ${className ?? ''}`}>
      {/* Header */}
      <div className="bg-[#008060] px-6 py-4">
        <p className="text-white font-black text-base tracking-wide uppercase">Get Your Free Quote</p>
        <p className="text-white/65 text-[10px] font-mono tracking-widest mt-0.5">Real price, not an estimate. Confirm after the job.</p>
        <a
          href="https://share.google/003v3ioshqM78T8tO"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 mt-2 bg-white/15 hover:bg-white/25 transition-colors px-2 py-1 rounded-sm"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" aria-hidden="true" className="flex-shrink-0">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          <span className="text-white text-[10px] font-mono">★★★★★ 4.9 · 34 Google reviews</span>
        </a>
      </div>

      <div className="px-6 pt-5 pb-6 flex flex-col gap-3">
        {/* Address */}
        <div>
          <p className="text-[10px] font-mono font-semibold text-black/35 tracking-[0.2em] uppercase mb-1.5">Street Address</p>
          <AddressSearch
            value={address}
            onChange={setLocalAddress}
            onConfirm={handleConfirm}
            placeholder="Enter your home address..."
          />
        </div>

        {/* Name + Email */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-[10px] font-mono font-semibold text-black/35 tracking-[0.2em] uppercase mb-1.5">Full Name</p>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              className="w-full h-11 border border-black/15 px-3 text-sm text-black placeholder-black/30 focus:outline-none focus:border-black/40 bg-white"
            />
          </div>
          <div>
            <p className="text-[10px] font-mono font-semibold text-black/35 tracking-[0.2em] uppercase mb-1.5">Email</p>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john@example.com"
              className="w-full h-11 border border-black/15 px-3 text-sm text-black placeholder-black/30 focus:outline-none focus:border-black/40 bg-white"
            />
          </div>
        </div>

        {/* Social proof */}
        <p className="text-[11px] text-black/45 font-mono text-center">
          340+ homes served in Montgomery County
        </p>

        {/* $20 off promo */}
        <div className="bg-[#008060]/8 border border-[#008060]/20 px-3 py-2.5 flex items-start gap-2">
          <span className="text-[#008060] text-sm font-black flex-shrink-0">$20</span>
          <div>
            <p className="text-[11px] font-black text-black uppercase tracking-wide leading-tight">Off your first booking</p>
            <p className="text-[10px] font-mono text-black/45 leading-tight mt-0.5">New customers only · applied at checkout</p>
          </div>
        </div>
        <p className="text-[10px] font-mono text-black/50 flex items-center gap-1.5 -mt-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#008060] inline-block flex-shrink-0" />
          {getAvailabilityMessage()}
        </p>

        {/* Submit */}
        <div>
          <button
            onClick={handleSubmit}
            disabled={!isValid}
            className="w-full bg-[#008060] text-white font-black text-[12px] tracking-[0.2em] uppercase flex items-center justify-center gap-2 hover:bg-[#006b50] transition-colors disabled:opacity-60 disabled:cursor-not-allowed py-3.5"
          >
            SEE MY PRICE <ChevronRight className="w-4 h-4" />
          </button>
          <p className="mt-2 text-[10px] text-black/30 font-mono text-center">
            No payment until you confirm the job is done.
          </p>
        </div>

        {/* Phone */}
        <a
          href="tel:12403660377"
          className="flex items-center justify-center gap-2 text-black/50 hover:text-black transition-colors text-sm font-semibold"
        >
          <Phone className="w-3.5 h-3.5" />
          (240) 366-0377
        </a>

        {/* Trust seals */}
        <div className="border-t border-black/8 pt-3 flex items-center justify-around">
          {SEALS.map(({ icon: Icon, primary, secondary }) => (
            <div key={primary} className="flex flex-col items-center text-center gap-1">
              <Icon className="w-4 h-4 text-[#008060]" strokeWidth={1.75} />
              <p className="text-[11px] font-black text-black leading-none">{primary}</p>
              <p className="text-[8px] font-mono text-black/35 uppercase tracking-wide leading-tight">{secondary}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
