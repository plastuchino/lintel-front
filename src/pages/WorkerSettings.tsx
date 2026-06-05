import { useState, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Camera, Loader2, CheckCircle, ExternalLink, LogOut, DollarSign } from 'lucide-react';
import { WorkerLayout } from '../components/WorkerLayout';
import { useAuthStore } from '../store/authStore';
import { workers } from '../lib/api';
import { toast } from '../hooks/useToast';
import { useNavigate } from 'react-router-dom';
import { ImageCropper } from '../components/ImageCropper';

export default function WorkerSettings() {
  const { user, updateUser, logout } = useAuthStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const fileRef = useRef<HTMLInputElement>(null);
  const [cropFile, setCropFile] = useState<File | null>(null);

  const { data: profile } = useQuery({
    queryKey: ['worker-profile-settings'],
    queryFn: () => workers.profile().then((r) => r.data),
  });

  const { data: stripeLink, isLoading: stripeLinkLoading } = useQuery({
    queryKey: ['stripe-onboarding-link-settings'],
    queryFn: () => workers.stripeOnboarding().then((r) => r.data.url),
    enabled: !profile?.stripeOnboardingComplete,
    staleTime: 60000,
  });

  const [name, setName] = useState(user?.name ?? '');
  const [bio, setBio] = useState(profile?.bio ?? '');

  const saveMutation = useMutation({
    mutationFn: async () => {
      const fd = new FormData();
      fd.append('name', name);
      fd.append('bio', bio);
      await workers.updateProfile(fd);
    },
    onSuccess: () => {
      updateUser({ name });
      queryClient.invalidateQueries({ queryKey: ['worker-profile-settings'] });
      toast({ title: 'Profile updated' });
    },
    onError: () => toast({ title: 'Failed to save changes', variant: 'destructive' }),
  });

  const photoMutation = useMutation({
    mutationFn: async (blob: Blob) => {
      const res = await workers.uploadProfileImage(blob);
      return res.data.profileImageUrl;
    },
    onSuccess: (profileImageUrl) => {
      updateUser({ profileImageUrl });
      queryClient.invalidateQueries({ queryKey: ['worker-profile-settings'] });
      toast({ title: 'Photo updated' });
    },
    onError: () => toast({ title: 'Failed to upload photo', variant: 'destructive' }),
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCropFile(file);
      e.target.value = '';
    }
  };

  const handleCrop = (blob: Blob) => {
    setCropFile(null);
    photoMutation.mutate(blob);
  };

  const [payoutResult, setPayoutResult] = useState<{ jobsPaid: number; totalAmount: number } | null>(null);

  const payoutMutation = useMutation({
    mutationFn: () => workers.payout().then((r) => r.data),
    onSuccess: (data) => {
      setPayoutResult(data);
      if (data.jobsPaid === 0) {
        toast({ title: 'No unpaid jobs', description: 'You have no confirmed jobs pending payout.' });
      } else {
        toast({
          title: `Payout initiated`,
          description: `$${data.totalAmount.toFixed(2)} across ${data.jobsPaid} job${data.jobsPaid !== 1 ? 's' : ''} transferred to your account.`,
        });
      }
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.error ?? 'Something went wrong. Please try again.';
      toast({ title: 'Payout failed', description: msg, variant: 'destructive' });
    },
  });

  const workerId = `HP-${user?.uuid?.slice(0, 4).toUpperCase() ?? '0000'}`;

  return (
    <WorkerLayout>
      <Helmet>
        <title>Worker Account Settings | Lintel</title>
        <meta name="description" content="Manage your Lintel worker account settings. Update your profile photo, view your Stripe payout status, and configure your account preferences." />
      </Helmet>
      <div className="max-w-xl px-8 py-8">
        <h1 className="text-2xl font-black text-black mb-1">Settings</h1>
        <p className="text-uber-gray-400 text-sm mb-8">Manage your profile and account preferences.</p>

        {/* Profile photo */}
        <section className="mb-8">
          <p className="text-[10px] font-bold uppercase tracking-widest text-uber-gray-400 mb-4">Profile Photo</p>
          <div className="flex items-center gap-4">
            <div className="relative">
              {profile?.profileImageUrl || user?.profileImageUrl || profile?.img || user?.img ? (
                <img
                  src={profile?.profileImageUrl ?? user?.profileImageUrl ?? profile?.img ?? user?.img}
                  alt={user?.name ?? ''}
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-black flex items-center justify-center text-white text-xl font-black">
                  {user?.name?.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() ?? 'W'}
                </div>
              )}
              {photoMutation.isPending && (
                <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center">
                  <Loader2 className="w-5 h-5 text-white animate-spin" />
                </div>
              )}
            </div>
            <div>
              <button
                onClick={() => fileRef.current?.click()}
                disabled={photoMutation.isPending}
                className="flex items-center gap-2 h-9 px-4 border border-uber-gray-200 rounded-lg text-sm font-semibold text-black hover:border-black transition-colors disabled:opacity-40"
              >
                <Camera className="w-3.5 h-3.5" />
                Change photo
              </button>
              <p className="text-[10px] text-uber-gray-400 mt-1.5">JPG, PNG, or WebP · max 2 MB · cropped to 320×320</p>
            </div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            {cropFile && (
              <ImageCropper file={cropFile} onCrop={handleCrop} onCancel={() => setCropFile(null)} />
            )}
          </div>
        </section>

        {/* Profile info */}
        <section className="mb-8">
          <p className="text-[10px] font-bold uppercase tracking-widest text-uber-gray-400 mb-4">Profile Info</p>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-uber-gray-500 mb-1.5">Full Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-11 px-4 bg-uber-gray-50 rounded-lg text-sm text-black outline-none focus:bg-uber-gray-100 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-uber-gray-500 mb-1.5">Bio</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                placeholder="Tell customers about your experience..."
                className="w-full px-4 py-3 bg-uber-gray-50 rounded-lg text-sm text-black placeholder-uber-gray-300 outline-none focus:bg-uber-gray-100 transition-colors resize-none"
              />
            </div>
            <button
              onClick={() => saveMutation.mutate()}
              disabled={saveMutation.isPending || (!name.trim())}
              className="h-11 px-6 bg-black text-white text-sm font-bold rounded-lg hover:bg-uber-gray-800 transition-colors disabled:opacity-40 flex items-center gap-2"
            >
              {saveMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save changes'}
            </button>
          </div>
        </section>

        {/* Account info */}
        <section className="mb-8">
          <p className="text-[10px] font-bold uppercase tracking-widest text-uber-gray-400 mb-4">Account</p>
          <div className="border border-uber-gray-100 rounded-xl divide-y divide-uber-gray-100">
            <div className="flex items-center justify-between px-4 py-3">
              <p className="text-sm text-uber-gray-500">Email</p>
              <p className="text-sm font-semibold text-black">{user?.email}</p>
            </div>
            <div className="flex items-center justify-between px-4 py-3">
              <p className="text-sm text-uber-gray-500">Worker ID</p>
              <p className="text-sm font-mono font-semibold text-black">{workerId}</p>
            </div>
            <div className="flex items-center justify-between px-4 py-3">
              <p className="text-sm text-uber-gray-500">Promo Code</p>
              <p className="text-sm font-mono font-bold text-black">{profile?.promoCode ?? '—'}</p>
            </div>
            <div className="flex items-center justify-between px-4 py-3">
              <p className="text-sm text-uber-gray-500">Rating</p>
              <p className="text-sm font-semibold text-black">{profile?.rating?.toFixed(1) ?? '5.0'} ★ ({profile?.ratingCount ?? 0} reviews)</p>
            </div>
            <div className="flex items-center justify-between px-4 py-3">
              <p className="text-sm text-uber-gray-500">Status</p>
              <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded ${
                user?.isApproved !== false ? 'bg-uber-green/10 text-uber-green' : 'bg-uber-gray-100 text-uber-gray-500'
              }`}>
                {user?.isApproved !== false ? 'Approved' : 'Pending Review'}
              </span>
            </div>
          </div>
        </section>

        {/* Stripe */}
        <section className="mb-8">
          <p className="text-[10px] font-bold uppercase tracking-widest text-uber-gray-400 mb-4">Payment Setup</p>
          <div className="border border-uber-gray-100 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm font-semibold text-black">Stripe Connect</p>
                <p className="text-xs text-uber-gray-400 mt-0.5">Required to receive payouts</p>
              </div>
              {profile?.stripeOnboardingComplete ? (
                <div className="flex items-center gap-1.5 text-uber-green">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-xs font-bold">Connected</span>
                </div>
              ) : (
                <span className="text-[10px] font-bold uppercase text-uber-gray-400 border border-uber-gray-200 px-2 py-1 rounded">
                  Not set up
                </span>
              )}
            </div>
            {!profile?.stripeOnboardingComplete && (
              stripeLinkLoading ? (
                <div className="flex items-center gap-2 text-uber-gray-400 text-sm">
                  <Loader2 className="w-4 h-4 animate-spin" /> Loading link...
                </div>
              ) : (
                <a
                  href={stripeLink ?? '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 h-10 px-4 bg-black text-white text-sm font-bold rounded-lg hover:bg-uber-gray-800 transition-colors w-fit"
                >
                  Set up Stripe <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )
            )}
          </div>
        </section>

        {/* Earnings */}
        <section className="mb-8">
          <p className="text-[10px] font-bold uppercase tracking-widest text-uber-gray-400 mb-4">Earnings</p>
          <div className="border border-uber-gray-100 rounded-xl p-4">
            <div className="mb-3">
              <p className="text-sm font-semibold text-black">Request Payout</p>
              <p className="text-xs text-uber-gray-400 mt-0.5">Transfer earnings from all confirmed jobs to your Stripe account.</p>
            </div>
            {payoutResult && payoutResult.jobsPaid > 0 && (
              <div className="flex items-center gap-2 mb-3 text-uber-green text-xs font-semibold">
                <CheckCircle className="w-4 h-4" />
                ${payoutResult.totalAmount.toFixed(2)} paid out across {payoutResult.jobsPaid} job{payoutResult.jobsPaid !== 1 ? 's' : ''}
              </div>
            )}
            <button
              onClick={() => { setPayoutResult(null); payoutMutation.mutate(); }}
              disabled={payoutMutation.isPending || !profile?.stripeOnboardingComplete}
              className="flex items-center gap-2 h-10 px-4 bg-black text-white text-sm font-bold rounded-lg hover:bg-uber-gray-800 transition-colors disabled:opacity-40"
            >
              {payoutMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <DollarSign className="w-4 h-4" />
              )}
              {payoutMutation.isPending ? 'Processing…' : 'Pay out earnings'}
            </button>
            {!profile?.stripeOnboardingComplete && (
              <p className="text-xs text-uber-gray-400 mt-2">Complete Stripe Connect setup above before requesting a payout.</p>
            )}
          </div>
        </section>

        {/* Danger zone */}
        <section>
          <p className="text-[10px] font-bold uppercase tracking-widest text-uber-gray-400 mb-4">Session</p>
          <button
            onClick={() => { logout(); navigate('/login'); }}
            className="flex items-center gap-2 h-10 px-4 border border-uber-gray-200 rounded-lg text-sm font-semibold text-uber-gray-600 hover:border-red-300 hover:text-red-600 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        </section>
      </div>
    </WorkerLayout>
  );
}
