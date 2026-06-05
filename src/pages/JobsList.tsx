import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { jobs, plans } from '../lib/api';
import type { Job, RecurringPlan } from '../lib/api';
import { formatCurrency, cn } from '../lib/utils';
import { ChevronRight, Loader2, Layers, KeyRound, ArrowLeft, RefreshCw } from 'lucide-react';

function fmtServiceType(s: string) {
  return s.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

const STATUS: Record<string, { label: string; dot: string }> = {
  open:             { label: 'Finding a pro',   dot: 'bg-yellow-400' },
  accepted:         { label: 'Assigned',         dot: 'bg-blue-400' },
  'in-progress':    { label: 'In progress',      dot: 'bg-blue-400' },
  completed:        { label: 'Awaiting code',    dot: 'bg-orange-400' },
  confirmed:        { label: 'Completed',        dot: 'bg-uber-green' },
  disputed:         { label: 'Disputed',         dot: 'bg-uber-red' },
  cancelled:        { label: 'Cancelled',        dot: 'bg-uber-gray-300' },
};

function JobRow({ job, onClick }: { job: Job; onClick: () => void }) {
  const s = STATUS[job.status] ?? STATUS.open;
  const isBundle = job.serviceType === 'bundle' && job.serviceTypes?.length;
  const displayName = isBundle
    ? job.serviceTypes!.map(fmtServiceType).join(' + ')
    : fmtServiceType(job.serviceType);

  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-4 px-4 py-4 bg-white border border-uber-gray-200 rounded-xl hover:bg-uber-gray-50 hover:border-uber-gray-300 transition-all text-left"
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          {isBundle && <Layers className="w-3.5 h-3.5 text-uber-green flex-shrink-0" />}
          <p className="font-bold text-black truncate">{displayName}</p>
        </div>
        
        <p className="text-xs text-uber-gray-500 mt-0.5 truncate">{job.address}</p>
        <div className="flex items-center gap-1.5 mt-2">
          <div className={cn('w-2 h-2 rounded-full', s.dot)} />
          <span className="text-xs text-uber-gray-500">{s.label}</span>
        </div>
      </div>
      <div className="flex items-center gap-3 flex-shrink-0">
        <p className="font-black text-black">{formatCurrency(job.price)}</p>
        <ChevronRight className="w-4 h-4 text-uber-gray-300" />
      </div>
    </button>
  );
}

const INTERVAL_LABEL: Record<number, string> = { 3: 'Every 3 months', 6: 'Every 6 months', 12: 'Every 12 months' };

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

function PlanCard({ plan, onCancel }: { plan: RecurringPlan; onCancel: () => void }) {
  const [confirming, setConfirming] = useState(false);
  const discountPct = Math.round(plan.discountRate * 100);

  if (confirming) {
    return (
      <div className="border border-uber-gray-200 rounded-xl p-4 space-y-3">
        <p className="text-sm font-semibold text-black">Cancel recurring {fmtServiceType(plan.serviceType)}?</p>
        <p className="text-xs text-uber-gray-500">Future jobs will no longer be created. Any currently active job is unaffected.</p>
        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className="flex-1 h-9 bg-black text-white text-sm font-semibold rounded-lg hover:bg-uber-gray-800 transition-colors"
          >
            Yes, cancel
          </button>
          <button
            onClick={() => setConfirming(false)}
            className="flex-1 h-9 border border-uber-gray-200 text-sm font-semibold rounded-lg hover:bg-uber-gray-50 transition-colors"
          >
            Keep plan
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-uber-gray-200 rounded-xl p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <RefreshCw className="w-3.5 h-3.5 text-uber-green flex-shrink-0" />
            <p className="font-bold text-black truncate">{fmtServiceType(plan.serviceType)}</p>
          </div>
          <p className="text-xs text-uber-gray-500">{INTERVAL_LABEL[plan.intervalMonths]} &middot; {discountPct}% off</p>
          <p className="text-xs text-uber-gray-400 mt-1">Next: {fmtDate(plan.nextJobDate)}</p>
          <p className="text-xs text-uber-gray-400 truncate mt-0.5">{plan.address}</p>
        </div>
        <button
          onClick={() => setConfirming(true)}
          className="text-xs font-semibold text-uber-gray-500 hover:text-red-500 transition-colors flex-shrink-0 pt-0.5"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default function JobsList() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'jobs' | 'subscriptions'>('jobs');
  const queryClient = useQueryClient();

  const { data: jobList, isLoading } = useQuery({
    queryKey: ['jobs'],
    queryFn: () => jobs.list().then((r) => r.data),
  });

  const { data: planList } = useQuery({
    queryKey: ['plans'],
    queryFn: () => plans.list().then((r) => r.data),
  });

  const cancelPlanMutation = useMutation({
    mutationFn: (id: string) => plans.cancel(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['plans'] }),
  });

  if (isLoading) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <Loader2 className="w-6 h-6 animate-spin text-uber-gray-300" />
    </div>
  );

  const goToJob = (job: Job) => navigate(`/jobs/${job.uuid}?serviceType=${job.serviceType}`);

  const awaitingCode  = jobList?.filter((j) => j.status === 'completed') ?? [];
  const activeJobs    = jobList?.filter((j) => ['open', 'accepted', 'in-progress'].includes(j.status)) ?? [];
  const pastJobs      = jobList?.filter((j) => ['confirmed', 'disputed', 'cancelled'].includes(j.status)) ?? [];

  return (
    <div className="min-h-screen bg-white pt-16">
      <Helmet>
        <title>My Jobs | Lintel</title>
        <meta name="description" content="View and manage your home service bookings on Lintel. Track upcoming jobs, review past services, and manage recurring service plans." />
      </Helmet>
      <div className="max-w-2xl mx-auto px-6 py-10">
        <Link to="/book" className="inline-flex items-center gap-1.5 text-sm font-semibold text-uber-gray-500 hover:text-black transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>
        <h1 className="text-3xl font-black text-black mb-1">My Jobs</h1>
        <p className="text-uber-gray-500 mb-4">Your service history</p>

        {/* Tab switcher */}
        <div className="flex gap-1 p-1 bg-uber-gray-100 rounded-xl mb-8">
          <button
            onClick={() => setActiveTab('jobs')}
            className={cn(
              'flex-1 h-9 text-sm font-semibold rounded-lg transition-colors',
              activeTab === 'jobs' ? 'bg-white text-black shadow-sm' : 'text-uber-gray-500 hover:text-black',
            )}
          >
            Jobs
          </button>
          <button
            onClick={() => setActiveTab('subscriptions')}
            className={cn(
              'flex-1 h-9 text-sm font-semibold rounded-lg transition-colors',
              activeTab === 'subscriptions' ? 'bg-white text-black shadow-sm' : 'text-uber-gray-500 hover:text-black',
            )}
          >
            Active Subscriptions
            {planList && planList.length > 0 && (
              <span className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full bg-uber-green text-white text-[10px] font-bold">
                {planList.length}
              </span>
            )}
          </button>
        </div>

        {activeTab === 'subscriptions' ? (
          <div>
            {!planList?.length ? (
              <div className="text-center py-20">
                <p className="text-4xl mb-4">🔄</p>
                <p className="font-black text-xl text-black mb-2">No active subscriptions</p>
                <p className="text-uber-gray-500 mb-8">Save up to 25% by booking recurring services</p>
                <button
                  onClick={() => navigate('/')}
                  className="h-12 px-8 bg-black text-white font-bold rounded-xl hover:bg-uber-gray-800 transition-colors"
                >
                  Book a service
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {planList.map((plan) => (
                  <PlanCard
                    key={plan.uuid}
                    plan={plan}
                    onCancel={() => cancelPlanMutation.mutate(plan.uuid)}
                  />
                ))}
              </div>
            )}
          </div>
        ) : !jobList?.length ? (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">🏠</p>
            <p className="font-black text-xl text-black mb-2">No jobs yet</p>
            <p className="text-uber-gray-500 mb-8">Book your first home service</p>
            <button
              onClick={() => navigate('/')}
              className="h-12 px-8 bg-black text-white font-bold rounded-xl hover:bg-uber-gray-800 transition-colors"
            >
              Book a service
            </button>
          </div>
        ) : (
          <div className="space-y-8">

            {/* Action required — awaiting confirmation code */}
            {awaitingCode.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <KeyRound className="w-4 h-4 text-orange-500" />
                  <h2 className="text-xs font-bold text-orange-500 uppercase tracking-widest">Action Required</h2>
                </div>
                <div className="rounded-xl border-2 border-orange-400 overflow-hidden">
                  <div className="bg-orange-50 px-4 py-3 border-b border-orange-200">
                    <p className="text-sm font-semibold text-orange-800">
                      Your pro marked the job complete — enter the confirmation code to release payment.
                    </p>
                  </div>
                  <div className="divide-y divide-orange-100">
                    {awaitingCode.map((job) => {
                      const isBundle = job.serviceType === 'bundle' && job.serviceTypes?.length;
                      const displayName = isBundle
                        ? job.serviceTypes!.map(fmtServiceType).join(' + ')
                        : fmtServiceType(job.serviceType);
                      return (
                        <button
                          key={job.uuid}
                          onClick={() => goToJob(job)}
                          className="w-full flex items-center gap-4 px-4 py-4 bg-white hover:bg-orange-50 transition-colors text-left"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              {isBundle && <Layers className="w-3.5 h-3.5 text-uber-green flex-shrink-0" />}
                              <p className="font-bold text-black truncate">{displayName}</p>
                            </div>
                            <p className="text-xs text-uber-gray-500 mt-0.5 truncate">{job.address}</p>
                          </div>
                          <div className="flex items-center gap-3 flex-shrink-0">
                            <p className="font-black text-black">{formatCurrency(job.price)}</p>
                            <span className="text-xs font-bold text-orange-500 bg-orange-100 px-2 py-1 rounded-md">Enter code</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Active jobs */}
            {activeJobs.length > 0 && (
              <div>
                <h2 className="text-xs font-bold text-uber-gray-400 uppercase tracking-widest mb-3">Active</h2>
                <div className="space-y-2">
                  {activeJobs.map((job) => <JobRow key={job.uuid} job={job} onClick={() => goToJob(job)} />)}
                </div>
              </div>
            )}

            {/* Past jobs */}
            {pastJobs.length > 0 && (
              <div>
                <h2 className="text-xs font-bold text-uber-gray-400 uppercase tracking-widest mb-3">Past Jobs</h2>
                <div className="space-y-2">
                  {pastJobs.map((job) => <JobRow key={job.uuid} job={job} onClick={() => goToJob(job)} />)}
                </div>
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  );
}
