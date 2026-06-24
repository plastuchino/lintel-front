import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Shield, Star, CreditCard, Users, Phone } from 'lucide-react';
import { AddressSearch } from './AddressSearch';
import { useBookingStore } from '../store/bookingStore';
import { getAvailabilityMessage } from './TrustBadgeStrip';
import type { ServiceType } from '../lib/api';

const SEALS = [
  { icon: Shield,     primary: '$1M',        secondary: 'Insured' },
  { icon: Star,       primary: '4.9★',        secondary: 'Avg Rating' },
  { icon: CreditCard, primary: 'Pay After',   secondary: 'Job Done' },
  { icon: Users,      primary: 'Background',  secondary: 'Verified' },
];

interface ServiceQuoteCTAProps {
  serviceType: ServiceType;
  className?: string;
}

export function ServiceQuoteCTA({ serviceType, className }: ServiceQuoteCTAProps) {
  const navigate = useNavigate();
  const { setAddress, setSelectedServices } = useBookingStore();
  const [address, setLocalAddress] = useState('');

  const handleConfirm = (addr: string) => {
    if (!addr.trim()) return;
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'conversion', { send_to: 'AW-18193036616', value: 10, currency: 'USD' });
    }
    setSelectedServices([serviceType]);
    setAddress(addr, true);
    navigate('/quote-preview');
  };

  return (
    <div className={`bg-white overflow-hidden shadow-2xl ${className ?? ''}`}>
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

      <div className="px-6 pt-5 pb-6 flex flex-col gap-4">
        {/* Address input */}
        <div>
          <p className="text-[10px] font-mono font-semibold text-black/35 tracking-[0.2em] uppercase mb-2">
            Your Address
          </p>
          <AddressSearch
            value={address}
            onChange={setLocalAddress}
            onConfirm={handleConfirm}
            placeholder="Enter your home address..."
          />
        </div>

        {/* Social proof */}
        <p className="text-[11px] text-black/45 font-mono text-center -mt-1">
          340+ homes served in Montgomery County
        </p>

        {/* Promo + urgency */}
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

        {/* Button */}
        <div>
          <button
            onClick={() => handleConfirm(address)}
            disabled={!address.trim()}
            className="w-full h-13 bg-[#008060] text-white font-black text-[12px] tracking-[0.2em] uppercase flex items-center justify-center gap-2 hover:bg-[#006b50] transition-colors disabled:opacity-60 disabled:cursor-not-allowed py-3.5"
          >
            SEE MY PRICE
            <ChevronRight className="w-4 h-4" />
          </button>
          <p className="mt-2 text-[10px] text-black/30 font-mono text-center">
            No payment until you confirm the job is done.
          </p>
        </div>

        {/* Phone number */}
        <a
          href="tel:12403660377"
          className="flex items-center justify-center gap-2 text-black/50 hover:text-black transition-colors text-sm font-semibold"
        >
          <Phone className="w-3.5 h-3.5" />
          (240) 366-0377
        </a>

        {/* Inline trust row */}
        <div className="border-t border-black/8 pt-4 flex items-center justify-around">
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
