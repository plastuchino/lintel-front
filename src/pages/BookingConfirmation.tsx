import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { CheckCircle, ChevronRight } from 'lucide-react';
import { formatCurrency } from '../lib/utils';
import { useBookingStore } from '../store/bookingStore';

interface ConfirmationState {
  jobId: string;
  services: Array<{ name: string; price: number }>;
  address: string;
  scheduledAt: string | null;
  notes: string;
  hasBundle: boolean;
}

function formatScheduledAt(raw: string): string {
  // raw is a datetime-local string: "YYYY-MM-DDTHH:MM"
  const [datePart, timePart] = raw.split('T');
  const [year, month, day] = datePart.split('-').map(Number);
  const [hour, minute] = timePart.split(':').map(Number);
  const d = new Date(year, month - 1, day, hour, minute);
  return d.toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

export default function BookingConfirmation() {
  const navigate = useNavigate();
  const location = useLocation();
  const reset = useBookingStore((s) => s.reset);
  const state = location.state as ConfirmationState | null;

  useEffect(() => {
    if (!state) {
      navigate('/jobs', { replace: true });
    } else {
      reset();
    }
  }, [state, navigate, reset]);

  if (!state) return null;

  const { services, address, scheduledAt, notes, hasBundle } = state;
  const total = services.reduce((sum, s) => sum + s.price, 0);
  const headline = hasBundle
    ? `You're all set for your ${services.length} services!`
    : `You're all set for your ${services[0]?.name ?? 'service'}!`;

  return (
    <div className="min-h-screen bg-white pt-16">
      <Helmet>
        <title>Booking Confirmed | Lintel</title>
        <meta name="description" content="Your home service booking is confirmed. Track your job status and get ready for your upcoming service appointment with Lintel." />
      </Helmet>
      <div className="max-w-lg mx-auto px-6 py-12">
        {/* Success icon + headline */}
        <div className="flex flex-col items-center text-center mb-10">
          <div className="w-16 h-16 rounded-full bg-uber-green/10 flex items-center justify-center mb-4">
            <CheckCircle className="w-9 h-9 text-uber-green" />
          </div>
          <h1 className="text-3xl font-black text-black leading-tight">{headline}</h1>
          <p className="text-uber-gray-400 text-base mt-2">
            We're matching you with a pro. You'll get a notification when someone accepts.
          </p>
        </div>

        <div className="space-y-3">
          {/* Services */}
          <div className="rounded-2xl border border-uber-gray-100 overflow-hidden">
            <div className="px-5 py-3 border-b border-uber-gray-100 bg-uber-gray-50">
              <p className="text-xs font-bold text-uber-gray-400 uppercase tracking-widest">Services</p>
            </div>
            <div className="px-5 py-4 space-y-3">
              {services.map((svc, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-base font-medium text-black">{svc.name}</span>
                  <span className="text-base font-bold text-black tabular-nums">{formatCurrency(svc.price)}</span>
                </div>
              ))}
              {services.length > 1 && (
                <div className="flex items-center justify-between pt-3 border-t border-uber-gray-100">
                  <span className="text-base font-bold text-black">Total</span>
                  <span className="text-base font-black text-black tabular-nums">{formatCurrency(total)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Appointment */}
          <div className="rounded-2xl border border-uber-gray-100 overflow-hidden">
            <div className="px-5 py-3 border-b border-uber-gray-100 bg-uber-gray-50">
              <p className="text-xs font-bold text-uber-gray-400 uppercase tracking-widest">Appointment</p>
            </div>
            <div className="px-5 py-4">
              <p className="text-base font-medium text-black">
                {scheduledAt ? formatScheduledAt(scheduledAt) : 'As soon as possible'}
              </p>
            </div>
          </div>

          {/* Address */}
          <div className="rounded-2xl border border-uber-gray-100 overflow-hidden">
            <div className="px-5 py-3 border-b border-uber-gray-100 bg-uber-gray-50">
              <p className="text-xs font-bold text-uber-gray-400 uppercase tracking-widest">Address</p>
            </div>
            <div className="px-5 py-4">
              <p className="text-base font-medium text-black">{address}</p>
            </div>
          </div>

          {/* Notes */}
          <div className="rounded-2xl border border-uber-gray-100 overflow-hidden">
            <div className="px-5 py-3 border-b border-uber-gray-100 bg-uber-gray-50">
              <p className="text-xs font-bold text-uber-gray-400 uppercase tracking-widest">Notes</p>
            </div>
            <div className="px-5 py-4">
              <p className={`text-base ${notes ? 'font-medium text-black' : 'text-uber-gray-400 italic'}`}>
                {notes || 'No notes sent'}
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={() => navigate('/jobs')}
          className="mt-8 w-full h-14 bg-black text-white font-bold text-base rounded-xl flex items-center justify-center gap-2 hover:bg-uber-gray-800 transition-colors"
        >
          View your jobs
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
