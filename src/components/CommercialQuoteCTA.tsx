import { useState } from 'react';
import { ChevronRight, CheckCircle, Phone } from 'lucide-react';
import { commercialLeads } from '../lib/api';
import type { CommercialServiceType } from '../lib/api';

const SERVICE_OPTIONS: { value: CommercialServiceType; label: string }[] = [
  { value: 'gutter-cleaning', label: 'Gutter Cleaning' },
  { value: 'window-cleaning', label: 'Window Cleaning' },
  { value: 'pressure-washing', label: 'Pressure Washing' },
];

interface CommercialQuoteCTAProps {
  /** Fixed service type for single-service pages. Omit to show a service dropdown (e.g. on the /commercial hub). */
  serviceType?: CommercialServiceType;
  className?: string;
}

type Phase = 'form' | 'submitting' | 'submitted' | 'error';

export function CommercialQuoteCTA({ serviceType: fixedServiceType, className }: CommercialQuoteCTAProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [area, setArea] = useState('');
  const [description, setDescription] = useState('');
  const [selectedServiceType, setSelectedServiceType] = useState<CommercialServiceType | ''>('');
  const [phase, setPhase] = useState<Phase>('form');

  const serviceType = fixedServiceType ?? (selectedServiceType || undefined);
  const isValid = name.trim() && email.trim() && phone.trim() && serviceType;

  const handleSubmit = async () => {
    if (!isValid || !serviceType) return;
    setPhase('submitting');
    try {
      await commercialLeads.submit({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        area: area.trim() || undefined,
        description: description.trim() || undefined,
        serviceType,
      });
      setPhase('submitted');
    } catch {
      setPhase('error');
    }
  };

  if (phase === 'submitted') {
    return (
      <div className={`bg-white overflow-hidden shadow-2xl ${className ?? ''}`}>
        <div className="bg-[#008060] px-6 py-4">
          <p className="text-white font-black text-base tracking-wide uppercase">Request Received</p>
          <p className="text-white/65 text-[10px] font-mono tracking-widest mt-0.5">We'll follow up shortly.</p>
        </div>
        <div className="px-6 pt-8 pb-8 flex flex-col gap-4 items-center text-center">
          <CheckCircle className="w-8 h-8 text-[#008060]" />
          <p className="text-sm text-black/70">
            Thanks, {name.trim().split(' ')[0]}. A member of our team will reach out to {email.trim()} or {phone.trim()} to discuss your commercial quote.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white overflow-hidden shadow-2xl ${className ?? ''}`}>
      <div className="bg-[#008060] px-6 py-4">
        <p className="text-white font-black text-base tracking-wide uppercase text-center">Request a Free Commercial Quote</p>
        <p className="text-white/65 text-[10px] font-mono tracking-widest mt-0.5 text-center">No payment until the job is confirmed done.</p>
      </div>

      <div className="px-6 pt-5 pb-6 flex flex-col gap-3">
        {!fixedServiceType && (
          <div>
            <p className="text-[10px] font-mono font-semibold text-black/35 tracking-[0.2em] uppercase mb-1.5">Service Needed*</p>
            <select
              value={selectedServiceType}
              onChange={(e) => setSelectedServiceType(e.target.value as CommercialServiceType)}
              className="w-full h-11 border border-black/15 px-3 text-sm text-black bg-white focus:outline-none focus:border-black/40"
            >
              <option value="" disabled>Select a service…</option>
              {SERVICE_OPTIONS.map(({ value, label }) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-[10px] font-mono font-semibold text-black/35 tracking-[0.2em] uppercase mb-1.5">Full Name*</p>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Jane Smith"
              className="w-full h-11 border border-black/15 px-3 text-sm text-black placeholder-black/30 focus:outline-none focus:border-black/40 bg-white"
            />
          </div>
          <div>
            <p className="text-[10px] font-mono font-semibold text-black/35 tracking-[0.2em] uppercase mb-1.5">Email*</p>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jane@company.com"
              className="w-full h-11 border border-black/15 px-3 text-sm text-black placeholder-black/30 focus:outline-none focus:border-black/40 bg-white"
            />
          </div>
        </div>

        <div>
          <p className="text-[10px] font-mono font-semibold text-black/35 tracking-[0.2em] uppercase mb-1.5">Phone*</p>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="(240) 555-0123"
            className="w-full h-11 border border-black/15 px-3 text-sm text-black placeholder-black/30 focus:outline-none focus:border-black/40 bg-white"
          />
        </div>

        <div>
          <p className="text-[10px] font-mono font-semibold text-black/35 tracking-[0.2em] uppercase mb-1.5">Area of Job (optional)</p>
          <input
            type="text"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            placeholder="e.g. 2 buildings, 40,000 sq ft lot"
            className="w-full h-11 border border-black/15 px-3 text-sm text-black placeholder-black/30 focus:outline-none focus:border-black/40 bg-white"
          />
        </div>

        <div>
          <p className="text-[10px] font-mono font-semibold text-black/35 tracking-[0.2em] uppercase mb-1.5">Description of Job (optional)</p>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Tell us about the property and what you need done..."
            rows={3}
            className="w-full border border-black/15 px-3 py-2.5 text-sm text-black placeholder-black/30 focus:outline-none focus:border-black/40 bg-white resize-none"
          />
        </div>

        {phase === 'error' && (
          <p className="text-[12px] text-red-600 font-semibold">Something went wrong submitting your request. Please try again or call us directly.</p>
        )}

        <button
          onClick={handleSubmit}
          disabled={!isValid || phase === 'submitting'}
          className="w-full bg-[#008060] text-white font-black text-[12px] tracking-[0.2em] uppercase flex items-center justify-center gap-2 hover:bg-[#006b50] transition-colors disabled:opacity-60 disabled:cursor-not-allowed py-3.5"
        >
          {phase === 'submitting' ? 'SUBMITTING…' : 'REQUEST A QUOTE'} <ChevronRight className="w-4 h-4" />
        </button>

        <p className="text-[10px] text-black/30 font-mono text-center -mt-1">
          No payment until you confirm the job is done.
        </p>

        <a
          href="tel:12403660377"
          className="flex items-center justify-center gap-2 text-black/50 hover:text-black transition-colors text-sm font-semibold"
        >
          <Phone className="w-3.5 h-3.5" />
          (240) 366-0377
        </a>
      </div>
    </div>
  );
}
