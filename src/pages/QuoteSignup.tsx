import { useEffect, useRef, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { GoogleLogin } from '@react-oauth/google';
import { Helmet } from 'react-helmet-async';
import { useAuthStore } from '../store/authStore';
import { useBookingStore } from '../store/bookingStore';
import { auth, quotes, jobs } from '../lib/api';
import { formatCurrency } from '../lib/utils';
import { toast } from '../hooks/useToast';
import logo from '../assets/logo.jpeg';

export default function QuoteSignup() {
  const { quoteId } = useParams<{ quoteId: string }>();
  const navigate = useNavigate();
  const { setAuth, user } = useAuthStore();
  const { setSelectedServices, setAddress, setQuotes, setQuotesReady } = useBookingStore();
  const googleContainerRef = useRef<HTMLDivElement>(null);
  const [googleBtnWidth, setGoogleBtnWidth] = useState(360);
  const hydratingRef = useRef(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['public-quote', quoteId],
    queryFn: () => quotes.getPublic(quoteId!).then((r) => r.data),
    enabled: !!quoteId,
    retry: false,
  });

  useEffect(() => {
    const el = googleContainerRef.current;
    if (!el) return;
    const observer = new ResizeObserver(() => setGoogleBtnWidth(el.clientWidth));
    observer.observe(el);
    setGoogleBtnWidth(el.clientWidth);
    return () => observer.disconnect();
  }, []);

  // If already logged in and there's a pending quote, hydrate and go to checkout
  useEffect(() => {
    if (user && data) {
      if (user.role === 'worker') {
        navigate('/worker/dashboard');
        return;
      }
      hydratAndGo(data);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, data]);

  async function hydratAndGo(quoteData: typeof data) {
    if (!quoteData || hydratingRef.current) return;
    hydratingRef.current = true;
    if (quoteData.serviceType) {
      setSelectedServices([quoteData.serviceType as Parameters<typeof setSelectedServices>[0][0]]);
    }
    setAddress(quoteData.address, true);

    // Lock the quote under the authenticated user's key in DynamoDB so the
    // job creation endpoint uses the same price shown here, not a fresh API call.
    let lockedPrice = quoteData.price;
    try {
      const res = await jobs.getQuote(quoteData.address, [quoteData.serviceType as import('../lib/api').ServiceType]);
      const locked = (res.data.quotes as Record<string, number>)[quoteData.serviceType];
      if (locked != null) lockedPrice = locked;
    } catch { /* fall back to prospect price */ }

    if (lockedPrice != null) {
      setQuotes({ [quoteData.serviceType]: lockedPrice } as Parameters<typeof setQuotes>[0]);
    }
    setQuotesReady(true);
    localStorage.removeItem('pendingQuoteId');
    navigate('/checkout');
  }

  const handleGoogleSuccess = async (credentialResponse: { credential?: string }) => {
    if (!credentialResponse.credential) return;
    if (quoteId) localStorage.setItem('pendingQuoteId', quoteId);
    try {
      const res = await auth.google(credentialResponse.credential);
      const { token, user: u } = res.data;
      setAuth(token, u as unknown as Parameters<typeof setAuth>[1]);
      if ((u as unknown as { role: string }).role === 'worker') {
        navigate('/worker/dashboard');
        return;
      }
      await hydratAndGo(data);
    } catch {
      localStorage.removeItem('pendingQuoteId');
      hydratingRef.current = false;
      toast({ title: 'Sign-in failed', description: 'Please try again.', variant: 'destructive' });
    }
  };

  const shortAddress = data?.address.split(',').slice(0, 2).join(',') ?? '';

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Helmet>
        <title>Complete Your Booking | Lintel</title>
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
            <div className="text-center text-uber-gray-400 py-12">Loading your quote…</div>
          )}

          {isError && (
            <div className="text-center py-12">
              <p className="text-xl font-bold text-black mb-2">Quote not found</p>
              <p className="text-uber-gray-500 text-sm mb-6">This link may have expired.</p>
              <Link to="/" className="text-sm font-semibold underline underline-offset-2 text-black">
                Get a new quote
              </Link>
            </div>
          )}

          {data && (
            <>
              <div className="mb-8">
                <p className="text-xs font-bold text-uber-gray-400 uppercase tracking-widest mb-3">Your estimate</p>
                <h1 className="text-3xl font-black text-black mb-1">
                  Complete your booking
                </h1>
                <p className="text-uber-gray-500 text-base">{shortAddress}</p>
              </div>

              {data.price != null && (
                <div className="bg-uber-gray-50 rounded-xl px-5 py-4 mb-6 flex justify-between items-center">
                  <div>
                    <p className="text-xs font-bold text-uber-gray-400 uppercase tracking-widest mb-0.5">Service</p>
                    <p className="font-bold text-black">{data.serviceName}</p>
                  </div>
                  <p className="text-3xl font-black text-black">{formatCurrency(data.price)}</p>
                </div>
              )}

              <p className="text-sm text-uber-gray-500 mb-6">
                Sign in with Google to confirm this booking. No card required — your pro collects payment on-site after the job is done.
              </p>

              <div ref={googleContainerRef} className="w-full mb-4">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => toast({ title: 'Sign-in failed', variant: 'destructive' })}
                  theme="outline"
                  shape="rectangular"
                  size="large"
                  width={googleBtnWidth}
                  text="continue_with"
                />
              </div>

              <p className="text-xs text-center text-uber-gray-400">
                By continuing, you agree to our{' '}
                <Link to="/terms" className="underline underline-offset-2 hover:text-black">Terms</Link>
                {' '}and{' '}
                <Link to="/privacy" className="underline underline-offset-2 hover:text-black">Privacy Policy</Link>.
              </p>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
