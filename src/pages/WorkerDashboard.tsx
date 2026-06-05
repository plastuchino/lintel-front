import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { MapPin, CheckCircle, Loader2, Tag, KeyRound, AlertTriangle, X, Calendar, FileText, Clock, History, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { jobs, workers } from '../lib/api';
import type { Job, ServiceType } from '../lib/api';
import { formatCurrency } from '../lib/utils';
import { DisputeModal } from '../components/DisputeModal';
import { WorkerLayout } from '../components/WorkerLayout';
import { useAuthStore } from '../store/authStore';
import { toast } from '../hooks/useToast';

function fmtServiceType(s: string) {
  return s.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function getBundleLabel(job: Job) {
  if (job.serviceType === 'bundle' && job.serviceTypes?.length) {
    return job.serviceTypes.map(fmtServiceType).join(' + ');
  }
  return fmtServiceType(job.serviceType);
}

function fmt(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric',
    hour: 'numeric', minute: '2-digit',
  });
}

function JobDetailModal({ job, onAccept, accepting, onClose }: {
  job: Job;
  onAccept?: () => void;
  accepting?: boolean;
  onClose: () => void;
}) {
  const serviceLabel = getBundleLabel(job);
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-uber-gray-100">
          <div>
            <p className="text-xs text-uber-gray-400 uppercase tracking-widest">Job Details</p>
            <h3 className="font-black text-black text-xl mt-0.5">{serviceLabel}</h3>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-uber-gray-100 rounded-lg transition-colors">
            <X className="w-4 h-4 text-uber-gray-400" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          <div className="flex items-start gap-3">
            <MapPin className="w-4 h-4 text-uber-gray-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs text-uber-gray-400">Location</p>
              <p className="text-sm font-semibold text-black">{job.address}</p>
            </div>
          </div>

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
                <p className="text-xs text-uber-gray-400">Customer notes</p>
                <p className="text-sm text-black">{job.notes}</p>
              </div>
            </div>
          )}

          <div className="border-t border-uber-gray-100 pt-3 flex items-center justify-between">
            <div>
              <p className="text-xs text-uber-gray-400">Your payout</p>
              <p className="font-black text-black text-xl">{formatCurrency(job.price * 0.4)}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-uber-gray-400">Total price</p>
              <p className="text-sm font-semibold text-uber-gray-500">{formatCurrency(job.price)}</p>
            </div>
          </div>
        </div>

        {onAccept && (
          <div className="px-6 pb-6">
            <button
              onClick={onAccept}
              disabled={accepting}
              className="w-full h-12 bg-black text-white font-bold rounded-xl hover:bg-uber-gray-800 transition-colors disabled:opacity-40 flex items-center justify-center gap-2"
            >
              {accepting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Accept job'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function PreviousPayoutsModal({ onClose }: { onClose: () => void }) {
  const { data, isLoading } = useQuery({
    queryKey: ['worker-prev-payouts'],
    queryFn: () => workers.prevPayouts().then((r) => r.data),
  });

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-uber-gray-100">
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-uber-gray-400" />
            <h3 className="font-black text-black text-xl">Previous Payouts</h3>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-uber-gray-100 rounded-lg transition-colors">
            <X className="w-4 h-4 text-uber-gray-400" />
          </button>
        </div>
        <div className="px-6 py-4 max-h-80 overflow-y-auto">
          {isLoading ? (
            <div className="flex justify-center py-8"><Loader2 className="w-5 h-5 animate-spin text-uber-gray-300" /></div>
          ) : !data?.length ? (
            <p className="text-center text-uber-gray-400 text-sm py-8">No payouts yet</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[10px] font-bold uppercase tracking-widest text-uber-gray-400 border-b border-uber-gray-100">
                  <th className="pb-2">Date</th>
                  <th className="pb-2 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {data.map((p, i) => (
                  <tr key={i} className="border-b border-uber-gray-50 last:border-0">
                    <td className="py-2.5 text-uber-gray-600">{fmtDate(p.paidAt)}</td>
                    <td className="py-2.5 text-right font-black text-black">{formatCurrency(p.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

function PreviousJobsModal({ onClose }: { onClose: () => void }) {
  const { data, isLoading } = useQuery({
    queryKey: ['worker-prev-jobs'],
    queryFn: () => workers.prevJobs().then((r) => r.data),
  });

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-uber-gray-100">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-uber-gray-400" />
            <h3 className="font-black text-black text-xl">Previous Jobs</h3>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-uber-gray-100 rounded-lg transition-colors">
            <X className="w-4 h-4 text-uber-gray-400" />
          </button>
        </div>
        <div className="px-6 py-4 max-h-80 overflow-y-auto">
          {isLoading ? (
            <div className="flex justify-center py-8"><Loader2 className="w-5 h-5 animate-spin text-uber-gray-300" /></div>
          ) : !data?.length ? (
            <p className="text-center text-uber-gray-400 text-sm py-8">No completed jobs yet</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[10px] font-bold uppercase tracking-widest text-uber-gray-400 border-b border-uber-gray-100">
                  <th className="pb-2">Customer</th>
                  <th className="pb-2">Service</th>
                  <th className="pb-2 text-right">Earned</th>
                </tr>
              </thead>
              <tbody>
                {data.map((j) => {
                  const serviceLabel = j.serviceType === 'bundle' && j.serviceTypes?.length
                    ? j.serviceTypes.map((s) => fmtServiceType(s)).join(' + ')
                    : fmtServiceType(j.serviceType);
                  return (
                    <tr key={j.uuid} className="border-b border-uber-gray-50 last:border-0">
                      <td className="py-2.5 text-uber-gray-500 text-xs font-mono">{j.customerLabel}</td>
                      <td className="py-2.5 text-uber-gray-600 capitalize text-xs">{serviceLabel}</td>
                      <td className="py-2.5 text-right font-black text-black">{formatCurrency(j.price)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default function WorkerDashboard() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [detailJob, setDetailJob] = useState<Job | null>(null);
  const [showComplete, setShowComplete] = useState(false);
  const [showPayoutsModal, setShowPayoutsModal] = useState(false);
  const [showJobsModal, setShowJobsModal] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState('');
  const [showDispute, setShowDispute] = useState(false);

  const { data: openJobs, isLoading: openLoading } = useQuery({
    queryKey: ['jobs', 'open'],
    queryFn: () => jobs.getOpen().then((r) => r.data),
    refetchInterval: 10000,
  });
  const { data: myJobs } = useQuery({
    queryKey: ['jobs', 'mine'],
    queryFn: () => jobs.list().then((r) => r.data),
    refetchInterval: 10000,
  });
  const { data: profile } = useQuery({
    queryKey: ['worker-profile'],
    queryFn: () => workers.profile().then((r) => r.data),
  });

  const acceptMutation = useMutation({
    mutationFn: ({ jobId, serviceType }: { jobId: string; serviceType: ServiceType | 'bundle' }) =>
      jobs.accept(jobId, serviceType),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      setDetailJob(null);
      toast({ title: 'Job accepted!' });
    },
    onError: () => toast({ title: 'Job no longer available', variant: 'destructive' }),
  });

  const completeMutation = useMutation({
    mutationFn: ({ jobId, serviceType }: { jobId: string; serviceType: ServiceType | 'bundle' }) =>
      jobs.complete(jobId, serviceType),
    onSuccess: (res) => {
      setConfirmationCode(res.data.confirmationCode);
      setShowComplete(true);
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    },
    onError: () => toast({ title: 'Error completing job', variant: 'destructive' }),
  });

  const regenerateCodeMutation = useMutation({
    mutationFn: ({ jobId, serviceType }: { jobId: string; serviceType: ServiceType | 'bundle' }) =>
      jobs.regenerateCode(jobId, serviceType),
    onSuccess: (res) => {
      setConfirmationCode(res.data.confirmationCode);
      setShowComplete(true);
    },
    onError: () => toast({ title: 'Error retrieving code', variant: 'destructive' }),
  });

  const activeJobs = myJobs?.filter((j) => ['accepted', 'in-progress'].includes(j.status)) ?? [];
  const awaitingConfirmation = myJobs?.filter((j) => j.status === 'completed') ?? [];
  const completedJobs = myJobs?.filter((j) => j.status === 'confirmed') ?? [];
  const totalEarnings = completedJobs.reduce((s, j) => s + j.price * 0.4 + (j.tipAmount ?? 0), 0);

  return (
    <WorkerLayout>
      <Helmet>
        <title>Worker Dashboard | Lintel</title>
        <meta name="description" content="Manage your Lintel home service jobs. View open jobs, accept new bookings, mark work complete, and track your earnings — all in one place." />
      </Helmet>
    <div className="max-w-2xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-black text-black">Hey, {user?.name?.split(' ')[0] ?? 'Pro'}</h1>
            <p className="text-uber-gray-500 mt-1">Here's what's happening today</p>
          </div>
          {user?.isAdmin && (
            <button
              onClick={() => navigate('/admin')}
              className="text-xs font-semibold bg-black text-white px-3 py-1.5 rounded-lg hover:bg-uber-gray-800 transition-colors"
            >
              Go to Admin Mode
            </button>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="border border-uber-gray-200 rounded-xl p-4 flex flex-col gap-2">
            <div>
              <p className="text-xl font-black text-black">{formatCurrency(totalEarnings)}</p>
              <p className="text-xs text-uber-gray-400 mt-0.5">Total earned</p>
            </div>
            <button
              onClick={() => setShowPayoutsModal(true)}
              className="text-[10px] font-bold uppercase tracking-widest text-uber-gray-500 hover:text-black transition-colors text-left"
            >
              View Previous payouts →
            </button>
          </div>
          <div className="border border-uber-gray-200 rounded-xl p-4 flex flex-col gap-2">
            <div>
              <p className="text-xl font-black text-black">{String(completedJobs.length)}</p>
              <p className="text-xs text-uber-gray-400 mt-0.5">Jobs done</p>
            </div>
            <button
              onClick={() => setShowJobsModal(true)}
              className="text-[10px] font-bold uppercase tracking-widest text-uber-gray-500 hover:text-black transition-colors text-left"
            >
              View Previous jobs →
            </button>
          </div>
          <div className="border border-uber-gray-200 rounded-xl p-4">
            <p className="text-xl font-black text-black">{profile?.rating?.toFixed(1) ?? '5.0'} ★</p>
            <p className="text-xs text-uber-gray-400 mt-0.5">Rating</p>
          </div>
        </div>

        {/* Promo code */}
        {profile?.promoCode && (
          <div className="flex items-center gap-3 border border-uber-gray-200 rounded-xl p-4 mb-6">
            <div className="w-10 h-10 bg-uber-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <Tag className="w-5 h-5 text-black" />
            </div>
            <div>
              <p className="text-xs text-uber-gray-400 uppercase tracking-widest">Your promo code</p>
              <p className="font-black text-black text-lg font-mono">{profile.promoCode}</p>
            </div>
            <p className="text-xs text-uber-gray-400 ml-auto">Share to earn</p>
          </div>
        )}

        {/* Active jobs */}
        {activeJobs.map((job) => (
          <div key={job.uuid} className="border-2 border-black rounded-xl p-5 mb-6">
            <p className="text-xs font-bold text-uber-gray-400 uppercase tracking-widest mb-3">Active job</p>
            <p className="font-black text-black text-xl capitalize mb-1">{getBundleLabel(job)}</p>
            <p className="text-sm text-uber-gray-500 flex items-center gap-1 mb-1">
              <MapPin className="w-3.5 h-3.5" />{job.address}
            </p>
            {job.scheduledAt && (
              <p className="text-xs text-uber-gray-400 mb-1">📅 Scheduled: {fmt(job.scheduledAt)}</p>
            )}
            {job.notes && (
              <p className="text-xs text-uber-gray-500 mb-2 italic">"{job.notes}"</p>
            )}
            <p className="text-2xl font-black text-black mb-4">{formatCurrency(job.price * 0.4)} <span className="text-sm font-normal text-uber-gray-400">your payout</span></p>
            <button
              onClick={() => completeMutation.mutate({ jobId: job.uuid, serviceType: job.serviceType })}
              disabled={completeMutation.isPending}
              className="w-full h-12 bg-black text-white font-bold rounded-xl hover:bg-uber-gray-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-40"
            >
              {completeMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <><CheckCircle className="w-4 h-4" /> Mark complete</>}
            </button>
          </div>
        ))}

        {/* Awaiting customer confirmation */}
        {awaitingConfirmation.map((job) => (
          <div key={job.uuid} className="border-2 border-orange-400 rounded-xl p-5 mb-6">
            <p className="text-xs font-bold text-orange-500 uppercase tracking-widest mb-3">Awaiting confirmation</p>
            <p className="font-black text-black text-xl capitalize mb-1">{getBundleLabel(job)}</p>
            <p className="text-sm text-uber-gray-500 flex items-center gap-1 mb-1">
              <MapPin className="w-3.5 h-3.5" />{job.address}
            </p>
            <p className="text-2xl font-black text-black mb-1">{formatCurrency(job.price * 0.4)} <span className="text-sm font-normal text-uber-gray-400">your payout</span></p>
            <p className="text-xs text-uber-gray-400 mb-4">Customer needs to enter your 6-digit code to release payment.</p>
            <div className="flex gap-2">
              <button
                onClick={() => regenerateCodeMutation.mutate({ jobId: job.uuid, serviceType: job.serviceType })}
                disabled={regenerateCodeMutation.isPending}
                className="flex-1 h-12 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-40"
              >
                {regenerateCodeMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <><KeyRound className="w-4 h-4" /> Show confirmation code</>}
              </button>
              <button
                onClick={() => { setSelectedJob(job); setShowDispute(true); }}
                className="px-4 h-12 border border-uber-red text-uber-red font-semibold rounded-xl hover:bg-red-50 transition-colors"
              >
                <AlertTriangle className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

        {/* Open jobs */}
        <div>
          <p className="text-xs font-bold text-uber-gray-400 uppercase tracking-widest mb-3">Available jobs</p>
          {openLoading ? (
            <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-uber-gray-300" /></div>
          ) : !openJobs?.length ? (
            <div className="text-center py-16 border border-uber-gray-100 rounded-xl">
              <p className="text-uber-gray-300 text-3xl mb-3">🔍</p>
              <p className="font-semibold text-uber-gray-400">No open jobs right now</p>
              <p className="text-sm text-uber-gray-300 mt-1">Check back soon</p>
            </div>
          ) : (
            <div className="space-y-2">
              {openJobs.map((job) => (
                <button
                  key={job.uuid}
                  onClick={() => setDetailJob(job)}
                  className="w-full border border-uber-gray-200 rounded-xl p-4 hover:border-uber-gray-400 transition-colors text-left"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-black text-black capitalize">{getBundleLabel(job)}</p>
                      <p className="text-sm text-uber-gray-500 mt-0.5 flex items-center gap-1 truncate">
                        <MapPin className="w-3 h-3 flex-shrink-0" />{job.address}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0 ml-4">
                      <p className="font-black text-black text-lg">{formatCurrency(job.price * 0.4)}</p>
                      <p className="text-xs text-uber-gray-400">your payout</p>
                    </div>
                  </div>
                  {job.scheduledAt && (
                    <p className="text-xs text-uber-gray-400 mb-2">📅 {fmt(job.scheduledAt)}</p>
                  )}
                  {job.notes && (
                    <p className="text-xs text-uber-gray-500 italic truncate mb-2">"{job.notes}"</p>
                  )}
                  <p className="text-xs text-uber-gray-400 font-semibold">Tap to view details & accept →</p>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Confirmation code modal */}
      {showComplete && confirmationCode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm bg-white rounded-2xl p-8 text-center shadow-2xl">
            <div className="w-14 h-14 bg-uber-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <KeyRound className="w-6 h-6 text-black" />
            </div>
            <h2 className="font-black text-black text-2xl mb-2">Job complete!</h2>
            <p className="text-uber-gray-500 text-sm mb-6">Show the customer this code. Payment is released only after they confirm.</p>
            <div className="bg-uber-gray-50 rounded-xl p-5 mb-6">
              <p className="text-5xl font-black font-mono text-black tracking-widest">{confirmationCode}</p>
            </div>
            <button
              onClick={() => { setShowComplete(false); setConfirmationCode(''); }}
              className="w-full h-12 bg-black text-white font-bold rounded-xl hover:bg-uber-gray-800 transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {detailJob && (
        <JobDetailModal
          job={detailJob}
          onAccept={() => acceptMutation.mutate({ jobId: detailJob.uuid, serviceType: detailJob.serviceType })}
          accepting={acceptMutation.isPending}
          onClose={() => setDetailJob(null)}
        />
      )}

      {showDispute && selectedJob && (
        <DisputeModal jobId={selectedJob.uuid} serviceType={selectedJob.serviceType} onClose={() => { setShowDispute(false); setSelectedJob(null); }} />
      )}

      {showPayoutsModal && <PreviousPayoutsModal onClose={() => setShowPayoutsModal(false)} />}
      {showJobsModal && <PreviousJobsModal onClose={() => setShowJobsModal(false)} />}
    </WorkerLayout>
  );
}
