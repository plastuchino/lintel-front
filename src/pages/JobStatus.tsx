import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { jobs } from '../lib/api';
import { formatCurrency } from '../lib/utils';
import logo from '../assets/logo.jpeg';

const STATUS_LABELS: Record<string, string> = {
  open: 'Waiting for a pro',
  accepted: 'Pro assigned',
  'in-progress': 'In progress',
  in_progress: 'In progress',
  completed: 'Complete — thank you!',
  confirmed: 'Complete — thank you!',
};

const STATUS_COLORS: Record<string, string> = {
  open: 'bg-yellow-100 text-yellow-800',
  accepted: 'bg-blue-100 text-blue-800',
  'in-progress': 'bg-blue-100 text-blue-800',
  in_progress: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  confirmed: 'bg-green-100 text-green-800',
};

export default function JobStatus() {
  const { jobId } = useParams<{ jobId: string }>();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['public-job', jobId],
    queryFn: () => jobs.getPublic(jobId!).then((r) => r.data),
    enabled: !!jobId,
    retry: false,
  });

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Helmet>
        <title>Your Booking | Lintel</title>
      </Helmet>

      <header className="border-b border-uber-gray-100 px-6 py-4">
        <Link to="/" className="flex items-center gap-2.5 w-fit">
          <img src={logo} alt="lintel" className="h-8 w-8 rounded-full object-cover" />
          <span className="text-xl font-black text-black">lintel</span>
        </Link>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {isLoading && (
            <div className="text-center text-uber-gray-400 py-12">Loading your booking…</div>
          )}

          {isError && (
            <div className="text-center py-12">
              <p className="text-xl font-bold text-black mb-2">Booking not found</p>
              <p className="text-uber-gray-500 text-sm">This link may be expired or incorrect.</p>
              <Link to="/" className="mt-6 inline-block text-sm font-semibold underline underline-offset-2 text-black">
                Get a new quote
              </Link>
            </div>
          )}

          {data && (
            <div>
              <div className="flex items-start justify-between mb-6">
                <div>
                  <p className="text-xs font-bold text-uber-gray-400 uppercase tracking-widest mb-1">Your Booking</p>
                  <h1 className="text-2xl font-black text-black">{data.serviceName}</h1>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold mt-1 ${STATUS_COLORS[data.status] ?? 'bg-uber-gray-100 text-uber-gray-600'}`}>
                  {STATUS_LABELS[data.status] ?? data.status}
                </span>
              </div>

              <div className="border border-uber-gray-200 rounded-xl overflow-hidden mb-6">
                <div className="px-5 py-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-uber-gray-500">Price</span>
                    <span className="font-black text-black text-xl">{formatCurrency(data.price)}</span>
                  </div>
                  <div className="flex justify-between items-start gap-4">
                    <span className="text-sm text-uber-gray-500 flex-shrink-0">Address</span>
                    <span className="text-sm text-black text-right">{data.address}</span>
                  </div>
                  {data.scheduledAt && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-uber-gray-500">Scheduled</span>
                      <span className="text-sm text-black">
                        {new Date(data.scheduledAt).toLocaleDateString('en-US', {
                          weekday: 'long', month: 'long', day: 'numeric',
                        })}
                      </span>
                    </div>
                  )}
                </div>

                <div className="border-t border-uber-gray-100 bg-uber-gray-50 px-5 py-4">
                  <p className="text-sm text-uber-gray-600">
                    Payment collected on-site by your pro. Cash, check, or Venmo accepted.
                  </p>
                </div>
              </div>

              <p className="text-center text-sm text-uber-gray-400">
                Questions?{' '}
                <a href="tel:3012727224" className="text-black font-semibold underline underline-offset-2">
                  (301) 272-7224
                </a>
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
