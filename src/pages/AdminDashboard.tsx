import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ChevronDown, ChevronUp, ArrowLeft, User, AlertTriangle } from 'lucide-react';
import { admin, AdminWorker, AdminPayout, AdminProspect, Job } from '../lib/api';
import { formatCurrency } from '../lib/utils';
import { toast } from '../hooks/useToast';

function fmtServiceType(s: string) {
  return s.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function fmt(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });
}

function WorkerDetail({ uuid }: { uuid: string }) {
  const { data: jobs, isLoading: jobsLoading } = useQuery({
    queryKey: ['admin', 'worker-jobs', uuid],
    queryFn: () => admin.getWorkerJobs(uuid).then((r) => r.data),
  });
  const { data: payouts, isLoading: payoutsLoading } = useQuery({
    queryKey: ['admin', 'worker-payouts', uuid],
    queryFn: () => admin.getWorkerPayouts(uuid).then((r) => r.data),
  });

  if (jobsLoading || payoutsLoading) {
    return <div className="px-4 py-3 text-sm text-uber-gray-400">Loading...</div>;
  }

  return (
    <div className="border-t border-uber-gray-100 bg-uber-gray-50 px-4 py-4 space-y-4">
      <div>
        <p className="text-xs font-semibold text-uber-gray-400 uppercase tracking-wider mb-2">Jobs ({jobs?.length ?? 0})</p>
        {!jobs?.length ? (
          <p className="text-sm text-uber-gray-400">No jobs yet</p>
        ) : (
          <div className="space-y-1.5">
            {jobs.map((job: Job) => (
              <div key={job.uuid} className="flex items-center justify-between text-sm bg-white rounded-lg px-3 py-2 border border-uber-gray-100">
                <div className="flex items-center gap-3">
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${job.status === 'confirmed' ? 'bg-green-500' : job.status === 'cancelled' ? 'bg-red-400' : 'bg-yellow-400'}`} />
                  <span className="font-medium text-black">{fmtServiceType(job.serviceType === 'bundle' && job.serviceTypes?.length ? job.serviceTypes.map(fmtServiceType).join(' + ') : job.serviceType)}</span>
                  <span className="text-uber-gray-400">{fmt(job.createdAt)}</span>
                </div>
                <div className="flex items-center gap-3 text-right">
                  <span className="text-uber-gray-500 capitalize">{job.status}</span>
                  <span className="font-semibold text-black">{formatCurrency(job.price)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <p className="text-xs font-semibold text-uber-gray-400 uppercase tracking-wider mb-2">Payouts ({payouts?.length ?? 0})</p>
        {!payouts?.length ? (
          <p className="text-sm text-uber-gray-400">No payouts yet</p>
        ) : (
          <div className="space-y-1.5">
            {payouts.map((p: AdminPayout, i: number) => (
              <div key={i} className="flex items-center justify-between text-sm bg-white rounded-lg px-3 py-2 border border-uber-gray-100">
                <div className="flex items-center gap-3">
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${p.status === 'paid' ? 'bg-green-500' : 'bg-yellow-400'}`} />
                  <span className="text-uber-gray-500 capitalize">{p.type} · {p.status}</span>
                  <span className="text-uber-gray-400">{fmt(p.createdAt)}</span>
                </div>
                <div className="text-right">
                  <span className="font-semibold text-black">{formatCurrency(p.baseAmount)}</span>
                  {p.tipAmount > 0 && (
                    <span className="text-uber-gray-400 ml-1">+{formatCurrency(p.tipAmount)} tip</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function WorkerCard({ worker }: { worker: AdminWorker }) {
  const [expanded, setExpanded] = useState(false);
  const queryClient = useQueryClient();

  const patchMutation = useMutation({
    mutationFn: (updates: { isAvailable?: boolean; isApproved?: boolean }) =>
      admin.patchWorker(worker.uuid, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'workers'] });
    },
    onError: () => toast({ title: 'Update failed', variant: 'destructive' }),
  });

  const avatarUrl = worker.profileImageUrl || worker.img;

  return (
    <div className="bg-white rounded-2xl border border-uber-gray-100 shadow-sm overflow-hidden">
      <div className="px-4 py-4">
        <div className="flex items-start gap-3">
          {avatarUrl ? (
            <img src={avatarUrl} alt={worker.name} className="w-12 h-12 rounded-full object-cover flex-shrink-0" />
          ) : (
            <div className="w-12 h-12 rounded-full bg-uber-gray-100 flex items-center justify-center flex-shrink-0">
              <User className="w-5 h-5 text-uber-gray-400" />
            </div>
          )}

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-black text-black text-base">{worker.name}</h3>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${worker.isAvailable ? 'bg-green-100 text-green-700' : 'bg-uber-gray-100 text-uber-gray-500'}`}>
                {worker.isAvailable ? 'Available' : 'Unavailable'}
              </span>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${worker.isApproved ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-600'}`}>
                {worker.isApproved ? 'Approved' : 'Pending'}
              </span>
            </div>
            {worker.bio && <p className="text-sm text-uber-gray-500 mt-0.5 line-clamp-2">{worker.bio}</p>}
            <div className="flex items-center gap-4 mt-2 text-xs text-uber-gray-500">
              <span>{worker.jobCount} jobs</span>
              <span>{formatCurrency(worker.totalEarnings)} earned</span>
              <span>★ {worker.rating.toFixed(1)} ({worker.ratingCount})</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-3 flex-wrap">
          <button
            onClick={() => patchMutation.mutate({ isAvailable: !worker.isAvailable })}
            disabled={patchMutation.isPending}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-uber-gray-200 hover:bg-uber-gray-50 transition-colors disabled:opacity-50"
          >
            {worker.isAvailable ? 'Mark Unavailable' : 'Mark Available'}
          </button>

          {worker.isApproved ? (
            <button
              onClick={() => patchMutation.mutate({ isApproved: false })}
              disabled={patchMutation.isPending}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
            >
              Revoke Approval
            </button>
          ) : (
            <button
              onClick={() => patchMutation.mutate({ isApproved: true })}
              disabled={patchMutation.isPending}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-black text-white hover:bg-uber-gray-800 transition-colors disabled:opacity-50"
            >
              Approve
            </button>
          )}

          <button
            onClick={() => setExpanded((v) => !v)}
            className="ml-auto text-xs font-semibold px-3 py-1.5 rounded-lg border border-uber-gray-200 hover:bg-uber-gray-50 transition-colors flex items-center gap-1"
          >
            {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            {expanded ? 'Hide' : 'Details'}
          </button>
        </div>
      </div>

      {expanded && <WorkerDetail uuid={worker.uuid} />}
    </div>
  );
}

function DisputeCard({ job }: { job: Job }) {
  const [adminResponse, setAdminResponse] = useState('');
  const queryClient = useQueryClient();

  const resolveMutation = useMutation({
    mutationFn: (resolution: 'cancelled' | 'charged') =>
      admin.resolveDispute(job.uuid, job.serviceType, resolution, adminResponse),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'disputes'] });
      toast({ title: 'Dispute resolved' });
    },
    onError: () => toast({ title: 'Resolution failed', variant: 'destructive' }),
  });

  const canResolve = adminResponse.trim().length > 0 && !resolveMutation.isPending;
  const serviceLabel = job.serviceType === 'bundle' && job.serviceTypes?.length
    ? job.serviceTypes.map(fmtServiceType).join(' + ')
    : fmtServiceType(job.serviceType);

  return (
    <div className="bg-white rounded-2xl border border-uber-gray-100 shadow-sm overflow-hidden">
      <div className="px-4 py-4 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />
              <span className="font-black text-black text-base">{serviceLabel}</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-red-100 text-red-600">Disputed</span>
            </div>
            <p className="text-xs text-uber-gray-400 mt-0.5">
              Job #{job.uuid.slice(0, 8).toUpperCase()} · {fmt(job.createdAt)}
            </p>
          </div>
          <span className="font-black text-black text-lg">{formatCurrency(job.price)}</span>
        </div>

        <div className="text-xs text-uber-gray-500 space-y-1">
          <p>
            <span className="font-semibold text-uber-gray-700">Customer:</span> {job.inbound_request.slice(0, 8)}
            {job.dispute?.filedBy === job.inbound_request && (
              <span className="ml-1.5 px-1.5 py-0.5 rounded bg-red-100 text-red-600 font-semibold text-xs">filed</span>
            )}
          </p>
          {job.outbound_request && (
            <p>
              <span className="font-semibold text-uber-gray-700">Worker:</span> {job.outbound_request.slice(0, 8)}
              {job.dispute?.filedBy === job.outbound_request && (
                <span className="ml-1.5 px-1.5 py-0.5 rounded bg-red-100 text-red-600 font-semibold text-xs">filed</span>
              )}
            </p>
          )}
        </div>

        <div className="bg-uber-gray-50 rounded-lg px-3 py-2 space-y-2">
          <div>
            <p className="text-xs font-semibold text-uber-gray-400 uppercase tracking-widest mb-1">Dispute Reason</p>
            <p className="text-sm text-black">
              {job.dispute?.reason ?? <span className="italic text-uber-gray-400">No reason recorded</span>}
            </p>
            {job.dispute?.filedAt && (
              <p className="text-xs text-uber-gray-400 mt-1">Filed {fmt(job.dispute.filedAt)}</p>
            )}
          </div>
          {job.dispute?.customerStatement && (
            <div className="border-t border-uber-gray-200 pt-2">
              <p className="text-xs font-semibold text-uber-gray-400 uppercase tracking-widest mb-1">Customer's Statement</p>
              <p className="text-sm text-black">{job.dispute.customerStatement}</p>
            </div>
          )}
          {job.dispute?.workerStatement && (
            <div className="border-t border-uber-gray-200 pt-2">
              <p className="text-xs font-semibold text-uber-gray-400 uppercase tracking-widest mb-1">Worker's Statement</p>
              <p className="text-sm text-black">{job.dispute.workerStatement}</p>
            </div>
          )}
        </div>

        <div>
          <label className="block text-xs font-bold text-uber-gray-400 uppercase tracking-widest mb-1">
            Admin Response <span className="text-red-500">*</span>
          </label>
          <textarea
            value={adminResponse}
            onChange={(e) => setAdminResponse(e.target.value)}
            placeholder="Explain the resolution to both parties…"
            className="w-full h-24 px-3 py-2 bg-uber-gray-50 rounded-lg text-sm text-black placeholder-uber-gray-400 resize-none outline-none focus:bg-uber-gray-100 transition-colors"
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => resolveMutation.mutate('cancelled')}
            disabled={!canResolve}
            className="flex-1 h-10 bg-uber-gray-100 text-black font-semibold rounded-xl hover:bg-uber-gray-200 transition-colors text-sm disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Cancel Hold
          </button>
          <button
            onClick={() => resolveMutation.mutate('charged')}
            disabled={!canResolve}
            className="flex-1 h-10 bg-black text-white font-semibold rounded-xl hover:bg-uber-gray-800 transition-colors text-sm disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Charge Card
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<'workers' | 'disputes' | 'prospects'>('workers');

  const { data: workers, isLoading: workersLoading, isError: workersError } = useQuery({
    queryKey: ['admin', 'workers'],
    queryFn: () => admin.getWorkers().then((r) => r.data),
  });

  const { data: disputes, isLoading: disputesLoading, isError: disputesError } = useQuery({
    queryKey: ['admin', 'disputes'],
    queryFn: () => admin.getDisputes().then((r) => r.data),
  });

  const { data: prospects, isLoading: prospectsLoading, isError: prospectsError } = useQuery({
    queryKey: ['admin', 'prospects'],
    queryFn: () => admin.getProspects().then((r) => r.data),
  });

  return (
    <div className="min-h-screen bg-uber-gray-50">
      <Helmet>
        <title>Admin Dashboard | Lintel</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs text-uber-gray-400 uppercase tracking-widest font-semibold">Admin</p>
            <h1 className="text-3xl font-black text-black mt-0.5">Dashboard</h1>
          </div>
          <button
            onClick={() => navigate('/worker/dashboard')}
            className="flex items-center gap-1.5 text-sm font-semibold text-uber-gray-500 hover:text-black transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Exit Admin
          </button>
        </div>

        <div className="flex gap-1 mb-6 bg-uber-gray-100 rounded-xl p-1">
          <button
            onClick={() => setTab('workers')}
            className={`flex-1 h-9 rounded-lg text-sm font-semibold transition-colors ${tab === 'workers' ? 'bg-white text-black shadow-sm' : 'text-uber-gray-500 hover:text-black'}`}
          >
            Workers
          </button>
          <button
            onClick={() => setTab('disputes')}
            className={`flex-1 h-9 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-1.5 ${tab === 'disputes' ? 'bg-white text-black shadow-sm' : 'text-uber-gray-500 hover:text-black'}`}
          >
            Disputes
            {disputes && disputes.length > 0 && (
              <span className="w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-black">
                {disputes.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setTab('prospects')}
            className={`flex-1 h-9 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-1.5 ${tab === 'prospects' ? 'bg-white text-black shadow-sm' : 'text-uber-gray-500 hover:text-black'}`}
          >
            Prospects
            {prospects && prospects.filter((p: AdminProspect) => p.status === 'new').length > 0 && (
              <span className="w-5 h-5 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center font-black">
                {prospects.filter((p: AdminProspect) => p.status === 'new').length}
              </span>
            )}
          </button>
        </div>

        {tab === 'workers' && (
          <>
            {workersLoading && <div className="text-center py-16 text-uber-gray-400">Loading workers...</div>}
            {workersError && <div className="text-center py-16 text-red-500">Failed to load workers.</div>}
            {workers && (
              <>
                <p className="text-sm text-uber-gray-500 mb-4">{workers.length} worker{workers.length !== 1 ? 's' : ''}</p>
                <div className="space-y-3">
                  {workers.map((w: AdminWorker) => (
                    <WorkerCard key={w.uuid} worker={w} />
                  ))}
                  {workers.length === 0 && (
                    <div className="text-center py-16 text-uber-gray-400">No workers yet.</div>
                  )}
                </div>
              </>
            )}
          </>
        )}

        {tab === 'disputes' && (
          <>
            {disputesLoading && <div className="text-center py-16 text-uber-gray-400">Loading disputes...</div>}
            {disputesError && <div className="text-center py-16 text-red-500">Failed to load disputes.</div>}
            {disputes && (
              <>
                <p className="text-sm text-uber-gray-500 mb-4">{disputes.length} open dispute{disputes.length !== 1 ? 's' : ''}</p>
                <div className="space-y-3">
                  {disputes.map((job: Job) => (
                    <DisputeCard key={job.uuid} job={job} />
                  ))}
                  {disputes.length === 0 && (
                    <div className="text-center py-16 text-uber-gray-400">No open disputes.</div>
                  )}
                </div>
              </>
            )}
          </>
        )}

        {tab === 'prospects' && (
          <>
            {prospectsLoading && <div className="text-center py-16 text-uber-gray-400">Loading prospects...</div>}
            {prospectsError && <div className="text-center py-16 text-red-500">Failed to load prospects.</div>}
            {prospects && prospects.length === 0 && (
              <div className="text-center py-16 text-uber-gray-400">No prospects yet.</div>
            )}
            {prospects && prospects.length > 0 && (
              <>
                <p className="text-sm text-uber-gray-500 mb-4">{prospects.length} prospect{prospects.length !== 1 ? 's' : ''}</p>
                <div className="space-y-3">
                  {prospects.map((p: AdminProspect) => (
                    <div key={p.uuid} className="bg-white rounded-2xl border border-uber-gray-100 shadow-sm px-4 py-4 space-y-2">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-black text-black text-base">{p.name}</h3>
                            {p.status === 'converted' ? (
                              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-green-100 text-green-700">Converted</span>
                            ) : (
                              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-uber-gray-100 text-uber-gray-500">New</span>
                            )}
                          </div>
                          <p className="text-sm text-uber-gray-500 mt-0.5">{p.email}</p>
                        </div>
                        <p className="text-xs text-uber-gray-400 flex-shrink-0">{fmt(p.createdAt)}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                        <div>
                          <span className="text-uber-gray-400 font-semibold uppercase tracking-wider">Phone</span>
                          <p className="text-black font-medium mt-0.5">{p.phone}</p>
                        </div>
                        <div>
                          <span className="text-uber-gray-400 font-semibold uppercase tracking-wider">Services</span>
                          <p className="text-black font-medium mt-0.5">{p.serviceTypes.map((s) => fmtServiceType(s)).join(', ') || '—'}</p>
                        </div>
                        <div className="col-span-2">
                          <span className="text-uber-gray-400 font-semibold uppercase tracking-wider">Address</span>
                          <p className="text-black font-medium mt-0.5">{p.address || '—'}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
