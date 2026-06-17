import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Shield, Star, CreditCard, Users, Phone } from 'lucide-react';
import { AddressSearch } from './AddressSearch';
import { useBookingStore } from '../store/bookingStore';
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
