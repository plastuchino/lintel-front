import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { Helmet } from 'react-helmet-async';
import { Loader2, ExternalLink, CheckCircle } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { Input } from '../components/ui/input';
import { api } from '../lib/api';
import { toast } from '../hooks/useToast';

export default function WorkerRegister() {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const [step, setStep] = useState<'info' | 'stripe'>('info');
  const googleContainerRef = useRef<HTMLDivElement>(null);
  const [googleBtnWidth, setGoogleBtnWidth] = useState(360);
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [idToken, setIdToken] = useState('');
  const [stripeUrl, setStripeUrl] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const el = googleContainerRef.current;
    if (!el) return;
    const observer = new ResizeObserver(() => setGoogleBtnWidth(el.clientWidth));
    observer.observe(el);
    setGoogleBtnWidth(el.clientWidth);
    return () => observer.disconnect();
  }, []);

  const handleGoogleSuccess = (cred: { credential?: string }) => {
    if (!cred.credential) return;
    setIdToken(cred.credential);
  };

  const handleRegister = async () => {
    if (!idToken || !name.trim()) return;
    setLoading(true);
    try {
      const res = await api.post<{ token: string; worker: Record<string, unknown>; stripeOnboardingUrl: string }>(
        '/workers/register', { idToken, name, bio }
      );
      setAuth(res.data.token, res.data.worker as unknown as Parameters<typeof setAuth>[1]);
      setStripeUrl(res.data.stripeOnboardingUrl);
      setStep('stripe');
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { error?: string } } })?.response?.data?.error ?? 'Registration failed';
      toast({ title: 'Error', description: message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  if (step === 'stripe') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <div className="w-full max-w-sm text-center">
          <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-black text-black mb-2">You're in!</h1>
          <p className="text-uber-gray-500 mb-8">Set up Stripe to receive payments for your work.</p>
          <a
            href={stripeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full h-14 bg-black text-white font-bold rounded-xl hover:bg-uber-gray-800 transition-colors mb-3"
          >
            Set up payments <ExternalLink className="w-4 h-4" />
          </a>
          <button onClick={() => navigate('/worker/dashboard')} className="w-full h-12 text-uber-gray-400 text-sm hover:text-black transition-colors">
            Set up later
          </button>
          <p className="text-xs text-uber-gray-300 mt-4">You won't receive payouts until Stripe setup is complete.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <Helmet>
        <title>Become a Home Service Pro | Join Lintel</title>
        <meta name="description" content="Join Lintel as a home service professional. Earn money on your schedule providing gutter cleaning, pressure washing, window cleaning, and more to homeowners in Montgomery County, MD." />
        <meta name="keywords" content="home service jobs montgomery county md, gig work bethesda md, earn money home services, become a home service pro, lintel worker application, flexible work rockville md" />
        <link rel="canonical" href="https://uselintel.pro/worker/register" />
      </Helmet>
      <div className="w-full max-w-sm">
        <Link to="/login" className="text-sm text-uber-gray-400 hover:text-black transition-colors">← Back</Link>
        <h1 className="text-3xl font-black text-black mt-6 mb-1">Join as a Pro</h1>
        <p className="text-uber-gray-500 mb-8">Earn money doing home services on your schedule.</p>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-uber-gray-400 uppercase tracking-widest mb-2">Full Name *</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" />
          </div>

          <div>
            <label className="block text-xs font-bold text-uber-gray-400 uppercase tracking-widest mb-2">Bio <span className="font-normal normal-case">(optional)</span></label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell customers about your experience..."
              className="w-full h-24 px-4 py-3 bg-uber-gray-50 rounded-lg text-sm text-black placeholder-uber-gray-400 resize-none outline-none focus:bg-uber-gray-100 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-uber-gray-400 uppercase tracking-widest mb-2">Google Account *</label>
            {idToken ? (
              <div className="flex items-center gap-2 bg-uber-gray-50 rounded-lg px-4 h-12">
                <CheckCircle className="w-4 h-4 text-uber-green" />
                <span className="text-sm font-semibold text-black">Google account connected</span>
              </div>
            ) : (
              <div ref={googleContainerRef} className="w-full">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => toast({ title: 'Sign-in failed', variant: 'destructive' })}
                  theme="outline"
                  shape="rectangular"
                  size="large"
                  width={googleBtnWidth}
                />
              </div>
            )}
          </div>

          <button
            onClick={handleRegister}
            disabled={!name.trim() || !idToken || loading}
            className="w-full h-14 bg-black text-white font-bold rounded-xl hover:bg-uber-gray-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating account...</> : 'Create worker account'}
          </button>
        </div>

        <p className="mt-6 text-xs text-uber-gray-400 text-center">
          By registering, you agree to our{' '}
          <Link to="/terms" className="underline underline-offset-2 hover:text-black">Terms</Link>
          {' '}and{' '}
          <Link to="/privacy" className="underline underline-offset-2 hover:text-black">Privacy Policy</Link>.
        </p>
      </div>
    </div>
  );
}
