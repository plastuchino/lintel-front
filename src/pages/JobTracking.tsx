import { useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ChevronLeft, CheckCircle, Loader2, KeyRound, AlertTriangle, Calendar, FileText, Clock, ShieldCheck } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { jobs, plans } from '../lib/api';
import type { ServiceType } from '../lib/api';
import { FrequencySelector } from '../components/FrequencySelector';
import { useAuthStore } from '../store/authStore';
import { Layers } from 'lucide-react';
import { TipModal } from '../components/TipModal';
import { DisputeModal } from '../components/DisputeModal';
import { RatingModal } from '../components/RatingModal';
import { formatCurrency, cn } from '../lib/utils';
import { toast } from '../hooks/useToast';

const STEPS = [
  { key: 'open', label: 'Finding a pro' },
  { key: 'accepted', label: 'Pro assigned' },
  { key: 'completed', label: 'Ready for review' },
  { key: 'confirmed', label: 'Confirmed' },
];

const PRO_ASSIGNED_STATUSES = ['accepted', 'in-progress', 'completed', 'confirmed'];

function fmt(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric',
    hour: 'numeric', minute: '2-digit',
  });
}

export default function JobTracking() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const serviceType = searchParams.get('serviceType') as ServiceType | 'bundle';
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { user } = useAuthStore();
  const [confirmCode, setConfirmCode] = useState('');
  const [confirming, setConfirming] = useState(false);
  const [showTip, setShowTip] = useState(false);
  const [showRating, setShowRating] = useState(false);
  const [showDispute, setShowDispute] = useState(false);
  const [statement, setStatement] = useState('');
  const [showRecurringPrompt, setShowRecurringPrompt] = useState(false);
  const [recurringInterval, setRecurringInterval] = useState<null | 3 | 6 | 12>(null);
  const [planCreated, setPlanCreated] = useState(false);

  const { data: job, isLoading } = useQuery({
    queryKey: ['job', id, serviceType],
    queryFn: () => jobs.get(id!, serviceType).then((r) => r.data),
    enabled: !!id && !!serviceType,
    refetchInterval: (q) => ['open', 'accepted'].includes(q.state.data?.status ?? '') ? 5000 : false,
  });

  const statementMutation = useMutation({
    mutationFn: (text: string) => jobs.submitStatement(id!, serviceType, text),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['job', id, serviceType] });
      toast({ title: 'Statement submitted' });
      setStatement('');
    },
    onError: () => toast({ title: 'Failed to submit statement', variant: 'destructive' }),
  });

  const handleConfirm = async () => {
    if (!confirmCode || confirmCode.length !== 6 || !id) return;
    setConfirming(true);
    try {
      await jobs.confirm(id, serviceType, confirmCode);
      queryClient.invalidateQueries({ queryKey: ['job', id, serviceType] });
      toast({ title: 'Job confirmed!', description: 'Please rate your pro.' });
      setShowRating(true);
    } catch {
      toast({ title: 'Invalid code', description: 'Check the code with your pro.', variant: 'destructive' });
    } finally {
      setConfirming(false);
    }
  };

  const handleRatingComplete = () => {
    setShowRating(false);
    queryClient.invalidateQueries({ queryKey: ['job', id, serviceType] });
    toast({ title: 'Would you like to leave a tip?' });
    setShowTip(true);
  };

  const handleRatingSkip = () => {
    setShowRating(false);
    setShowTip(true);
  };

  const handleTipComplete = () => {
    setShowTip(false);
    queryClient.invalidateQueries({ queryKey: ['job', id, serviceType] });
    // Only offer recurring for single-service jobs
    if (serviceType !== 'bundle') {
      setShowRecurringPrompt(true);
    }
  };

  const handleCreatePlan = async () => {
    if (!recurringInterval || !job || serviceType === 'bundle') return;
    try {
      await plans.create({
        serviceType: serviceType as ServiceType,
        address: job.address,
        intervalMonths: recurringInterval,
        basePrice: job.price,
        notes: job.notes,
      });
      setPlanCreated(true);
      toast({ title: 'Recurring plan created!', description: `We'll automatically book your next ${serviceType.replace(/-/g, ' ')} in ${recurringInterval} months.` });
    } catch {
      toast({ title: 'Failed to create plan', variant: 'destructive' });
    }
  };

  if (isLoading) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <Loader2 className="w-6 h-6 animate-spin text-uber-gray-300" />
    </div>
  );

  if (!job) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <p className="text-uber-gray-400">Job not found.</p>
    </div>
  );

  const statusOrder = ['open', 'accepted', 'in-progress', 'completed', 'confirmed'];
  const currentIdx = statusOrder.indexOf(job.status);
  const showProCard = PRO_ASSIGNED_STATUSES.includes(job.status) && !!job.workerName;

  const serviceLabel = job.serviceTypes?.length
    ? job.serviceTypes.map((s) => s.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())).join(' + ')
    : job.serviceType.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <div className="min-h-screen bg-white pt-16">
      <Helmet>
        <title>Track Your Job | Lintel</title>
        <meta name="description" content="Track the status of your home service job on Lintel. See real-time updates, confirm job completion, and release payment to your pro." />
      </Helmet>
      <div className="max-w-5xl mx-auto px-6 py-10">
        <button onClick={() => navigate('/jobs')} className="flex items-center gap-1 text-sm font-semibold text-uber-gray-500 hover:text-black transition-colors mb-8">
          <ChevronLeft className="w-4 h-4" /> My Jobs
        </button>

        {/* Job header — full width above the grid */}
        <div className="mb-8">
          <p className="text-xs text-uber-gray-400 uppercase tracking-widest mb-1">Job #{id?.slice(0, 8).toUpperCase()}</p>
          {job.serviceTypes?.length ? (
            <>
              <div className="flex items-center gap-2 mb-1">
                <Layers className="w-5 h-5 text-uber-green flex-shrink-0" />
                <span className="text-xs font-bold text-uber-green uppercase tracking-widest">Bundle</span>
              </div>
              <h1 className="text-3xl font-black text-black leading-tight">{serviceLabel}</h1>
            </>
          ) : (
            <h1 className="text-3xl font-black text-black capitalize">{serviceLabel}</h1>
          )}
          <p className="text-uber-gray-500 text-sm mt-1">📍 {job.address}</p>
        </div>

        {/* Two-column grid: left = job content, right = pro card */}
        <div className={cn(
          'grid grid-cols-1 gap-8',
          showProCard && 'md:grid-cols-[1fr_340px]'
        )}>
          {/* Left column */}
          <div className="space-y-4">
            {/* Job details card */}
            <div className="border border-uber-gray-200 rounded-xl p-5 space-y-3">
              <p className="text-xs font-bold text-uber-gray-400 uppercase tracking-widest">Job Details</p>

              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-uber-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-uber-gray-400">Requested</p>
                  <p className="text-sm font-semibold text-black">{fmt(job.createdAt)}</p>
                </div>
              </div>

              {job.scheduledAt && (
                <div className="flex items-start gap-3">
                  <Calendar className="w-4 h-4 text-uber-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-uber-gray-400">Scheduled for</p>
                    <p className="text-sm font-semibold text-black">{fmt(job.scheduledAt)}</p>
                  </div>
                </div>
              )}

              {job.notes && (
                <div className="flex items-start gap-3">
                  <FileText className="w-4 h-4 text-uber-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-uber-gray-400">Special instructions</p>
                    <p className="text-sm text-black">{job.notes}</p>
                  </div>
                </div>
              )}

              <div className="pt-2 border-t border-uber-gray-100 flex items-center justify-between">
                <span className="text-xs text-uber-gray-400">Total price</span>
                <span className="font-black text-black">{formatCurrency(job.price)}</span>
              </div>

              {job.status === 'confirmed' && job.isRated && (
                <div className="text-xs text-uber-gray-400 text-center pt-1">⭐ You've already rated this job</div>
              )}
            </div>

            {/* Status stepper */}
            <div className="border border-uber-gray-200 rounded-xl p-5">
              <div className="space-y-4">
                {STEPS.map((step) => {
                  const stepIdx = statusOrder.indexOf(step.key);
                  const done = stepIdx <= currentIdx;
                  const active = step.key === job.status || (step.key === 'accepted' && job.status === 'in-progress');
                  return (
                    <div key={step.key} className="flex items-center gap-3">
                      <div className={cn(
                        'w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all',
                        done ? 'bg-black' : 'bg-uber-gray-100'
                      )}>
                        {done
                          ? <CheckCircle className="w-4 h-4 text-white" />
                          : <div className="w-2 h-2 rounded-full bg-uber-gray-300" />}
                      </div>
                      <span className={cn('text-sm font-semibold', done ? 'text-black' : 'text-uber-gray-300')}>
                        {step.label}
                        {active && <span className="ml-2 text-uber-gray-400 font-normal text-xs">← current</span>}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Status message */}
            <div className="bg-uber-gray-50 rounded-xl p-4">
              <p className="font-semibold text-black text-sm">
                {job.status === 'open' && '🔍 Looking for a pro near you...'}
                {job.status === 'accepted' && '✅ Your pro is on the way!'}
                {job.status === 'in-progress' && '🔧 Work in progress'}
                {job.status === 'completed' && '✅ Work done — enter your confirmation code'}
                {job.status === 'confirmed' && `✅ Complete — ${formatCurrency(job.price)}${job.tipAmount ? ` + ${formatCurrency(job.tipAmount)} tip` : ''}`}
                {job.status === 'disputed' && '⚠️ Dispute under review'}
              </p>
            </div>

            {/* Dispute statement panel */}
            {job.status === 'disputed' && (() => {
              const isCustomer = user?.uuid === job.inbound_request;
              const myStatement = isCustomer ? job.dispute?.customerStatement : job.dispute?.workerStatement;
              const theirStatement = isCustomer ? job.dispute?.workerStatement : job.dispute?.customerStatement;
              const myLabel = isCustomer ? 'Your statement' : 'Your statement';
              const theirLabel = isCustomer ? "Worker's statement" : "Customer's statement";

              return (
                <div className="border border-uber-gray-200 rounded-xl p-4 space-y-4">
                  <p className="text-xs font-bold text-uber-gray-400 uppercase tracking-widest">Dispute Details</p>

                  {job.dispute?.reason && (
                    <div>
                      <p className="text-xs font-semibold text-uber-gray-500 mb-1">Filed reason</p>
                      <p className="text-sm text-black">{job.dispute.reason}</p>
                    </div>
                  )}

                  {theirStatement && (
                    <div className="bg-uber-gray-50 rounded-lg px-3 py-2">
                      <p className="text-xs font-semibold text-uber-gray-500 mb-1">{theirLabel}</p>
                      <p className="text-sm text-black">{theirStatement}</p>
                    </div>
                  )}

                  <div>
                    <p className="text-xs font-semibold text-uber-gray-500 mb-1">{myLabel}</p>
                    {myStatement ? (
                      <p className="text-sm text-black bg-uber-gray-50 rounded-lg px-3 py-2">{myStatement}</p>
                    ) : (
                      <div className="space-y-2">
                        <textarea
                          value={statement}
                          onChange={(e) => setStatement(e.target.value)}
                          placeholder="Share your side of the story…"
                          className="w-full h-24 px-3 py-2 bg-uber-gray-50 rounded-lg text-sm text-black placeholder-uber-gray-400 resize-none outline-none focus:bg-uber-gray-100 transition-colors"
                        />
                        <button
                          onClick={() => statementMutation.mutate(statement)}
                          disabled={!statement.trim() || statementMutation.isPending}
                          className="w-full h-10 bg-black text-white font-semibold rounded-xl hover:bg-uber-gray-800 transition-colors text-sm disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                          {statementMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Submit statement'}
                        </button>
                      </div>
                    )}
                  </div>

                  {job.dispute?.adminResponse && (
                    <div className="border-t border-uber-gray-100 pt-3">
                      <p className="text-xs font-semibold text-uber-gray-500 mb-1">Admin response</p>
                      <p className="text-sm text-black">{job.dispute.adminResponse}</p>
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Confirmation code */}
            {job.status === 'completed' && (
              <div className="border-2 border-black rounded-xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <KeyRound className="w-5 h-5" />
                  <p className="font-black text-black">Enter confirmation code</p>
                </div>
                <p className="text-sm text-uber-gray-500 mb-4">Ask your pro for their 6-digit code. Only enter it if you're satisfied with the work.</p>
                <div className="flex gap-2">
                  <input
                    value={confirmCode}
                    onChange={(e) => setConfirmCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="000000"
                    maxLength={6}
                    className="flex-1 bg-uber-gray-50 rounded-lg px-4 h-12 text-xl font-mono font-black tracking-widest text-center text-black outline-none focus:bg-uber-gray-100 transition-colors"
                  />
                  <button
                    onClick={handleConfirm}
                    disabled={confirmCode.length !== 6 || confirming}
                    className="px-6 h-12 bg-black text-white font-bold rounded-lg hover:bg-uber-gray-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {confirming ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm'}
                  </button>
                </div>
              </div>
            )}

            {/* Rate button for already-confirmed but unrated jobs */}
            {job.status === 'confirmed' && !job.isRated && (
              <button
                onClick={() => setShowRating(true)}
                className="w-full h-12 border-2 border-amber-400 text-amber-600 font-bold rounded-xl hover:bg-amber-50 transition-colors flex items-center justify-center gap-2"
              >
                ⭐ Rate your pro
              </button>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <button onClick={() => navigate('/')} className="flex-1 h-12 bg-uber-gray-100 text-black font-semibold rounded-xl hover:bg-uber-gray-200 transition-colors text-sm">
                Back to Home
              </button>
              {job.status === 'completed' && (
                <button
                  onClick={() => setShowDispute(true)}
                  className="flex items-center gap-2 px-4 h-12 border border-uber-red text-uber-red font-semibold rounded-xl hover:bg-red-50 transition-colors text-sm"
                >
                  <AlertTriangle className="w-4 h-4" />
                  Dispute
                </button>
              )}
            </div>
          </div>

          {/* Right column — Assigned Pro card */}
          {showProCard && (
            <div className="self-start">
              <div className="border border-uber-gray-200 rounded-xl overflow-hidden">
                {/* Card header */}
                <div className="bg-black px-4 py-3 flex items-center justify-between">
                  <span className="text-xs font-bold text-white uppercase tracking-widest">Assigned Pro</span>
                  <ShieldCheck className="w-4 h-4 text-white opacity-80" />
                </div>

                {/* Card body */}
                <div className="p-5">
                  <div className="flex items-center gap-4">
                    {/* Avatar */}
                    {job.workerProfileImageUrl ? (
                      <img
                        src={job.workerProfileImageUrl}
                        alt={job.workerName}
                        className="w-16 h-16 rounded-full object-cover flex-shrink-0"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-black flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xl font-black">
                          {job.workerName!.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}

                    {/* Name and rating */}
                    <div className="min-w-0">
                      <p className="font-black text-black text-lg leading-tight truncate">{job.workerName}</p>
                      {job.workerRating != null && (
                        <p className="text-sm text-uber-gray-500 mt-0.5">
                          <span className="text-amber-500">★</span> {job.workerRating.toFixed(1)}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Background checked badge */}
                  <div className="mt-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-uber-gray-200 text-xs font-semibold text-uber-gray-500 uppercase tracking-wide">
                      <ShieldCheck className="w-3 h-3" />
                      Background Checked
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {showRating && (
        <RatingModal
          jobId={id!}
          serviceType={serviceType}
          onComplete={handleRatingComplete}
          onSkip={handleRatingSkip}
        />
      )}

      {showTip && (
        <TipModal
          jobPrice={job.price}
          workerName="Your Pro"
          jobId={id!}
          serviceType={serviceType}
          onComplete={handleTipComplete}
          onSkip={() => setShowTip(false)}
        />
      )}

      {showDispute && <DisputeModal jobId={id!} serviceType={serviceType} onClose={() => setShowDispute(false)} />}

      {/* Recurring plan prompt — shown after tip/rating flow completes */}
      {showRecurringPrompt && !planCreated && serviceType !== 'bundle' && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 space-y-5">
            <div>
              <p className="font-black text-xl text-black mb-1">Set up recurring service</p>
              <p className="text-sm text-uber-gray-500">Save up to 25% and never think about booking again.</p>
            </div>

            <FrequencySelector
              basePrice={job.price}
              value={recurringInterval}
              onChange={setRecurringInterval}
            />

            <div className="flex gap-3 pt-1">
              <button
                onClick={handleCreatePlan}
                disabled={!recurringInterval}
                className="flex-1 h-12 bg-black text-white font-bold rounded-xl hover:bg-uber-gray-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Set Up Plan
              </button>
              <button
                onClick={() => setShowRecurringPrompt(false)}
                className="flex-1 h-12 border border-uber-gray-200 text-uber-gray-600 font-semibold rounded-xl hover:bg-uber-gray-50 transition-colors"
              >
                No thanks
              </button>
            </div>
          </div>
        </div>
      )}

      {showRecurringPrompt && planCreated && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 text-center space-y-4">
            <CheckCircle className="w-12 h-12 text-uber-green mx-auto" />
            <div>
              <p className="font-black text-xl text-black mb-1">Plan created!</p>
              <p className="text-sm text-uber-gray-500">We'll automatically schedule your next service and notify you when it's booked.</p>
            </div>
            <button
              onClick={() => setShowRecurringPrompt(false)}
              className="w-full h-12 bg-black text-white font-bold rounded-xl hover:bg-uber-gray-800 transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
