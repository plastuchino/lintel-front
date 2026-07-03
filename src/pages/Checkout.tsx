import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ChevronLeft, Tag, X, Sparkles } from 'lucide-react';
import { useBookingStore } from '../store/bookingStore';
import { useQuery } from '@tanstack/react-query';
import { services, jobs } from '../lib/api';
import { ContractSignPanel } from '../components/ContractSignPanel';
import { FrequencySelector } from '../components/FrequencySelector';
import { Input } from '../components/ui/input';
import { formatCurrency } from '../lib/utils';
import { toast } from '../hooks/useToast';

const BUNDLE_DISCOUNT = 0.1;

function validateLocalScheduledAt(value: string): string | null {
  const date = new Date(value);
  if (date <= new Date()) return 'Scheduled time must be in the future';
  const hour = date.getHours();
  if (hour < 8 || hour >= 18) return 'Scheduling is only available between 8am and 6pm';
  return null;
}

function toEasternIso(localDatetimeString: string): string {
  const date = new Date(localDatetimeString);
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/New_York',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).formatToParts(date);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? '00';
  const offsetParts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    timeZoneName: 'shortOffset',
  }).formatToParts(date);
  const tzName = offsetParts.find((p) => p.type === 'timeZoneName')?.value ?? 'GMT-5';
  const match = tzName.match(/GMT([+-]\d+)/);
  const offsetHours = match ? parseInt(match[1], 10) : -5;
  const sign = offsetHours >= 0 ? '+' : '-';
  const absHours = String(Math.abs(offsetHours)).padStart(2, '0');
  const offset = `${sign}${absHours}:00`;
  return `${get('year')}-${get('month')}-${get('day')}T${get('hour')}:${get('minute')}:${get('second')}${offset}`;
}

function getScheduleMin(): string {
  const now = new Date();
  const today8am = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 8, 0, 0);
  const floor = now > today8am ? now : today8am;
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${floor.getFullYear()}-${pad(floor.getMonth() + 1)}-${pad(floor.getDate())}T${pad(floor.getHours())}:${pad(floor.getMinutes())}`;
}

export default function Checkout() {
  const navigate = useNavigate();
  const {
    selectedServices, confirmedAddress, notes, promoCode, scheduledAt,
    recurringInterval,
    setNotes, setPromoCode, setScheduledAt, setCurrentJobId, setRecurringInterval,
    quotes, quotesReady,
  } = useBookingStore();

  const [creating, setCreating] = useState(false);
  const [promoInput, setPromoInput] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [scheduleError, setScheduleError] = useState<string | null>(null);

  const { data: serviceList } = useQuery({
    queryKey: ['services'],
    queryFn: () => services.list().then((r) => r.data),
    enabled: selectedServices.length > 0,
  });

  if (selectedServices.length === 0 || !confirmedAddress || !quotesReady) return <Navigate to="/book" replace />;
  if (!serviceList) return null;

  const selectedServiceObjects = serviceList.filter((s) => selectedServices.includes(s.id));
  const hasBundle = selectedServiceObjects.length > 1;
  const priceFor = (svc: typeof selectedServiceObjects[number]) => quotes[svc.id] ?? svc.price;
  const subtotal = selectedServiceObjects.reduce((sum, s) => sum + priceFor(s), 0);
  const bundleDiscountAmount = hasBundle ? subtotal * BUNDLE_DISCOUNT : 0;
  const baseTotal = subtotal - bundleDiscountAmount;

  const FIRST_JOB_DISCOUNT_RATE = 0.05;
  const isTestPromo = promoCode === 'TESTSEBANOW';
  const recurringDiscountRate = (!hasBundle && recurringInterval) ? FIRST_JOB_DISCOUNT_RATE : 0;
  const recurringDiscountAmount = baseTotal * recurringDiscountRate;
  const total = isTestPromo ? 1.00 : baseTotal - recurringDiscountAmount;

  const promoRecurringConflict = !!promoCode && !!recurringInterval && !isTestPromo;

  const applyPromo = () => {
    if (!promoInput.trim()) return;
    setPromoCode(promoInput.trim().toUpperCase());
    setPromoApplied(true);
    toast({ title: 'Promo applied!' });
  };

  const handleSign = async (contractSignerName: string, agreementVersion: string) => {
    if (selectedServiceObjects.length === 0 || !confirmedAddress) return;

    if (scheduledAt) {
      const err = validateLocalScheduledAt(scheduledAt);
      if (err) { setScheduleError(err); return; }
    }

    setCreating(true);
    try {
      let jobId: string;

      const scheduledAtEt = scheduledAt ? toEasternIso(scheduledAt) : undefined;

      if (hasBundle) {
        const res = await jobs.createBundle({
          serviceTypes: selectedServices,
          address: confirmedAddress,
          scheduledAt: scheduledAtEt,
          notes: notes || undefined,
          promoCode: promoCode || undefined,
          contractSignerName,
          agreementVersion,
        });
        jobId = res.data.job.uuid;
      } else {
        const res = await jobs.create({
          serviceType: selectedServices[0],
          address: confirmedAddress,
          scheduledAt: scheduledAtEt,
          notes: notes || undefined,
          promoCode: promoCode || undefined,
          contractSignerName,
          agreementVersion,
          recurringInterval: recurringInterval ?? undefined,
        });
        jobId = res.data.job.uuid;
      }

      setCurrentJobId(jobId);
      toast({
        title: 'Booking confirmed!',
        description: hasBundle
          ? `${selectedServices.length} services booked — we're finding a pro for you.`
          : "We're finding a pro for you.",
      });

      if (typeof window.gtag === 'function') {
        window.gtag('event', 'conversion', {
          send_to: 'AW-18193036616/63m8CKPNh7ocEMjqjuND',
          value: total,
          currency: 'USD',
          transaction_id: jobId,
        });
        window.gtag('event', 'conversion', {
          send_to: 'AW-18193036616/3ETTCIG0msQcEMjqjuND',
          value: total,
          currency: 'USD',
          transaction_id: jobId,
        });
      }

      const confirmationState = {
        jobId,
        services: selectedServiceObjects.map((s) => ({
          name: s.name,
          price: hasBundle ? priceFor(s) * (1 - BUNDLE_DISCOUNT) : priceFor(s),
        })),
        address: confirmedAddress,
        scheduledAt: scheduledAt ?? null,
        notes: notes || '',
        hasBundle,
      };

      navigate('/booking-confirmation', { state: confirmationState });
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { error?: string }; status?: number } };
      const status = axiosErr.response?.status;
      const message = axiosErr.response?.data?.error;
      if (status === 403) {
        toast({
          title: 'Account not authorized',
          description: 'This account is registered as a professional. Please sign out and sign in with your customer account.',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Booking failed',
          description: message || 'Something went wrong. Please try again.',
          variant: 'destructive',
        });
      }
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-white pt-16">
      <Helmet>
        <title>Complete Your Booking | Lintel</title>
        <meta name="description" content="Complete your home service booking on Lintel. Securely enter payment details and confirm your service appointment in Montgomery County, MD." />
      </Helmet>
      <div className="max-w-xl mx-auto px-6 py-10">
        <button
          onClick={() => navigate('/book')}
          className="flex items-center gap-1 text-sm font-semibold text-uber-gray-500 hover:text-black transition-colors mb-8"
        >
          <ChevronLeft className="w-4 h-4" /> Back
        </button>

        <h1 className="text-3xl font-black text-black mb-1">Review & pay</h1>
        <p className="text-uber-gray-500 mb-8">Confirm your booking details</p>

        {/* Services summary */}
        <div className="border border-uber-gray-200 rounded-xl overflow-hidden mb-4">
          {selectedServiceObjects.map((svc, i) => (
            <div key={svc.id} className={i > 0 ? 'border-t border-uber-gray-100' : ''}>
              <div className="flex items-start justify-between px-5 py-4">
                <div className="flex-1 min-w-0 pr-4">
                  <p className="font-bold text-black text-base">{svc.name}</p>
                  <p className="text-uber-gray-500 text-sm mt-0.5">{svc.description}</p>
                  <p className="text-uber-gray-400 text-xs mt-1">⏱ {svc.duration}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  {hasBundle ? (
                    <>
                      <p className="text-uber-gray-400 text-sm line-through leading-tight">
                        {formatCurrency(priceFor(svc))}
                      </p>
                      <p className="font-bold text-uber-green text-lg leading-tight">
                        {formatCurrency(priceFor(svc) * (1 - BUNDLE_DISCOUNT))}
                      </p>
                    </>
                  ) : (
                    <p className="font-black text-black text-2xl">{formatCurrency(priceFor(svc))}</p>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Price breakdown */}
          <div className="border-t border-uber-gray-200 bg-uber-gray-50 px-5 py-4 space-y-2">
            {hasBundle && (
              <>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-uber-gray-500">Subtotal</span>
                  <span className="text-uber-gray-500">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1.5 font-semibold text-uber-green">
                    <Sparkles className="w-3.5 h-3.5" />
                    Bundle discount (10%)
                  </span>
                  <span className="font-semibold text-uber-green">−{formatCurrency(bundleDiscountAmount)}</span>
                </div>
              </>
            )}
            {recurringDiscountAmount > 0 && !isTestPromo && (
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-1.5 font-semibold text-uber-green">
                  <Sparkles className="w-3.5 h-3.5" />
                  Recurring discount (5% — first visit)
                </span>
                <span className="font-semibold text-uber-green">−{formatCurrency(recurringDiscountAmount)}</span>
              </div>
            )}
            {isTestPromo && (
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-1.5 font-semibold text-uber-green">
                  <Tag className="w-3.5 h-3.5" />
                  Promo discount
                </span>
                <span className="font-semibold text-uber-green">−{formatCurrency(baseTotal - 1)}</span>
              </div>
            )}
            <div className="flex items-center justify-between pt-1">
              <span className="font-black text-black">Total</span>
              <span className="font-black text-black text-xl">{formatCurrency(total)}</span>
            </div>
          </div>

          {/* Address */}
          <div className="border-t border-uber-gray-100 px-5 py-3">
            <p className="text-sm text-uber-gray-500">📍 {confirmedAddress}</p>
          </div>
        </div>

        {/* Options */}
        <div className="border border-uber-gray-200 rounded-xl p-5 mb-4 space-y-4">
          <div>
            <label className="block text-xs font-bold text-uber-gray-400 uppercase tracking-widest mb-2">Schedule (optional)</label>
            <Input
              type="datetime-local"
              value={scheduledAt ?? ''}
              onChange={(e) => {
                const val = e.target.value || null;
                setScheduledAt(val);
                setScheduleError(val ? validateLocalScheduledAt(val) : null);
              }}
              min={getScheduleMin()}
              className="[color-scheme:light]"
            />
            {scheduleError && (
              <p className="text-sm text-red-500 mt-1">{scheduleError}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-uber-gray-400 uppercase tracking-widest mb-2">Notes (optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Special instructions for your pro..."
              className="w-full h-20 px-4 py-3 bg-uber-gray-50 rounded-lg text-sm text-black placeholder-uber-gray-400 resize-none outline-none focus:bg-uber-gray-100 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-uber-gray-400 uppercase tracking-widest mb-2">Promo code (optional)</label>
            {promoApplied ? (
              <div className="flex items-center gap-2 bg-uber-gray-50 rounded-lg px-4 h-12">
                <Tag className="w-4 h-4 text-uber-green" />
                <span className="font-mono font-bold text-black flex-1">{promoCode}</span>
                <button onClick={() => { setPromoCode(''); setPromoInput(''); setPromoApplied(false); }}>
                  <X className="w-4 h-4 text-uber-gray-400 hover:text-black" />
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Input
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                  placeholder="Enter promo code"
                  className="font-mono uppercase"
                  maxLength={30}
                />
                <button
                  onClick={applyPromo}
                  disabled={!promoInput.trim()}
                  className="px-5 h-12 bg-uber-gray-100 text-black font-semibold rounded-lg hover:bg-uber-gray-200 transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-sm flex-shrink-0"
                >
                  Apply
                </button>
              </div>
            )}
            {promoRecurringConflict && (
              <p className="text-sm text-red-500 mt-2">Promo codes cannot be combined with recurring plans. Remove one to continue.</p>
            )}
          </div>

          {!hasBundle && (
            <FrequencySelector
              basePrice={baseTotal}
              value={recurringInterval}
              onChange={setRecurringInterval}
            />
          )}
        </div>


          <div className="border border-uber-gray-200 rounded-xl overflow-hidden mb-4">
            

          {/* Price breakdown */}
       
          {/* Address */}
        
        </div>


        {/* Contract sign */}
        <div className="border bg-white border-uber-gray-200 rounded-xl p-5 mb-6">
          <p className="text-xs font-bold text-uber-gray-400 uppercase tracking-widest mb-4">Confirm & sign</p>
          <ContractSignPanel
            amount={total}
            serviceName={hasBundle ? `${selectedServiceObjects.length} services` : (selectedServiceObjects[0]?.name ?? '')}
            address={confirmedAddress}
            recurringInterval={recurringInterval}
            loading={creating}
            onSign={handleSign}
          />
        </div>
        <div className="border rounded-lg border-uber-gray-200 px-5 py-4 space-y-2">
          <p className='text-center'>You aren't charged till you are satisified with our work</p>
            
        </div>

      </div>
    </div>
  );
}
