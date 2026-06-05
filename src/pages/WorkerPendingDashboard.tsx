import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { Building2, CheckCircle, Loader2, Circle, ExternalLink, LogOut } from 'lucide-react';
import { WorkerLayout } from '../components/WorkerLayout';
import { useAuthStore } from '../store/authStore';
import { workers } from '../lib/api';

export default function WorkerPendingDashboard() {
  const { user, logout } = useAuthStore();
  const firstName = user?.name?.split(' ')[0] ?? 'Pro';

  const { data: profile } = useQuery({
    queryKey: ['worker-profile-pending'],
    queryFn: () => workers.profile().then((r) => r.data),
  });

  const { data: stripeLink, isLoading: stripeLoading } = useQuery({
    queryKey: ['stripe-onboarding-link'],
    queryFn: () => workers.stripeOnboarding().then((r) => r.data.url),
    enabled: !profile?.stripeOnboardingComplete,
    staleTime: 60000,
  });

  const stripeReady = profile?.stripeOnboardingComplete;

  const steps = [
    {
      num: '01',
      label: 'ID VERIFICATION',
      sub: 'Verified via Google',
      done: true,
      pending: false,
    },
    {
      num: '02',
      label: 'BACKGROUND CHECK',
      sub: 'Estimated: 3–5 business days',
      done: false,
      pending: false,
    },
    {
      num: '03',
      label: 'PAYMENT GATEWAY',
      sub: stripeReady ? 'Stripe account linked' : 'Pending user action',
      done: stripeReady ?? false,
      pending: true,
    },
  ];

  return (
    <WorkerLayout>
      <Helmet>
        <title>Application Under Review | Lintel</title>
        <meta name="description" content="Your Lintel worker application is under review. Complete your profile setup while we verify your background check and onboard you to the platform." />
      </Helmet>
      <div className="px-8 py-8 max-w-5xl">
        {/* Hero */}
        <p className="text-[10px] font-bold uppercase tracking-widest text-uber-gray-400 mb-3">
          Application Under Review
        </p>
        <h1 className="text-5xl font-black text-black mb-3">Welcome, {firstName}</h1>
        <p className="text-uber-gray-500 text-base mb-8 max-w-lg">
          Your application is currently in the verification phase. Complete the steps below to begin accepting service requests.
        </p>

        {/* Main cards row */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          {/* Background check card */}
          <div className="col-span-2 border border-uber-gray-200 rounded-xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-uber-gray-300" />
                <p className="text-[10px] font-bold uppercase tracking-widest text-uber-gray-400">Verification Status</p>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest border border-uber-gray-300 px-2 py-1 rounded text-uber-gray-600">
                Analysis in Progress
              </span>
            </div>

            <h2 className="text-3xl font-black text-black mb-3">Background Check</h2>
            <p className="text-uber-gray-500 text-sm mb-6 leading-relaxed">
              We are verifying your credentials against security databases. This standard procedure typically requires 3–5 business days for completion.
            </p>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-[10px] font-bold uppercase tracking-widest text-uber-gray-400">Processing Verification</p>
                <p className="text-[10px] font-bold text-uber-gray-500">In Progress</p>
              </div>
              <div className="h-1.5 bg-uber-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-black rounded-full w-2/3 animate-pulse" />
              </div>
            </div>
          </div>

          {/* Financial setup card */}
          <div className="bg-black rounded-xl p-6 flex flex-col">
            <Building2 className="w-8 h-8 text-white/60 mb-4" />
            <h3 className="text-white font-black text-xl mb-2">Financial Setup</h3>
            <p className="text-white/60 text-sm leading-relaxed flex-1">
              Secure your payout channel. A linked Stripe account is required for automated weekly settlements.
            </p>
            <div className="mt-6">
              {stripeReady ? (
                <div className="flex items-center gap-2 text-uber-green">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm font-bold">Stripe Connected</span>
                </div>
              ) : stripeLoading ? (
                <div className="flex items-center gap-2 text-white/60">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Loading...</span>
                </div>
              ) : (
                <a
                  href={stripeLink ?? '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full h-11 bg-white text-black font-bold text-sm rounded-lg hover:bg-uber-gray-100 transition-colors"
                >
                  Link Stripe Account <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
              <p className="text-[9px] text-white/30 uppercase tracking-widest mt-2 text-center">
                Powered by Stripe Connect
              </p>
            </div>
          </div>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          {steps.map((step) => (
            <div key={step.num} className="border border-uber-gray-100 rounded-xl p-5">
              <div className="flex items-start justify-between mb-3">
                <p className="text-[10px] font-bold text-uber-gray-300">{step.num}</p>
                {step.done ? (
                  <CheckCircle className="w-5 h-5 text-uber-green" />
                ) : step.pending ? (
                  <Circle className="w-5 h-5 text-uber-gray-200" />
                ) : (
                  <Loader2 className="w-5 h-5 text-uber-gray-400 animate-spin" />
                )}
              </div>
              <p className="text-xs font-black uppercase tracking-wide text-black mb-0.5">{step.label}</p>
              <p className="text-[11px] text-uber-gray-400">{step.sub}</p>
            </div>
          ))}
        </div>

        {/* Bottom info row */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="border border-uber-gray-100 rounded-xl p-5 flex items-start gap-4">
            <div className="w-10 h-10 bg-uber-gray-50 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-lg">📋</span>
            </div>
            <div>
              <p className="font-black text-black text-sm mb-1">WORKER HANDBOOK</p>
              <p className="text-xs text-uber-gray-400 mb-3 leading-relaxed">
                Review our operational standards and requirements before your first assignment.
              </p>
              <button className="text-xs font-bold text-black underline underline-offset-2 hover:text-uber-gray-600 transition-colors">
                READ GUIDELINES
              </button>
            </div>
          </div>

          <div className="border border-uber-gray-100 rounded-xl p-5 flex items-start gap-4">
            <div className="w-10 h-10 bg-uber-gray-50 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-lg">💬</span>
            </div>
            <div>
              <p className="font-black text-black text-sm mb-1">CONCIERGE SUPPORT</p>
              <p className="text-xs text-uber-gray-400 mb-3 leading-relaxed">
                Our team is available to assist with your onboarding and any questions.
              </p>
              <a
                href="tel:+13012727224"
                className="text-xs font-bold text-black underline underline-offset-2 hover:text-uber-gray-600 transition-colors"
              >
                CONTACT SUPPORT
              </a>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-[9px] font-bold uppercase tracking-widest text-uber-gray-300 border-t border-uber-gray-100 pt-4">
          <span>System Stability: 99.98%</span>
          <button
            onClick={logout}
            className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest text-uber-gray-400 hover:text-black transition-colors"
          >
            <LogOut className="w-3 h-3" />
            Sign Out
          </button>
          <span>Build V1.0.0-Pro</span>
        </div>
      </div>
    </WorkerLayout>
  );
}
