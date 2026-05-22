import axios from 'axios';

const isLocalhost = typeof window !== 'undefined' && 
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

export const api = axios.create({
  baseURL: isLocalhost ? 'http://localhost:3001/api' : 'https://api.uselintel.pro/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('lintel_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('lintel_token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export type ServiceType =
  | 'gutter-cleaning'
  | 'window-cleaning'
  | 'window-cleaning-interior'
  | 'pressure-washing'
  | 'house-cleaning-standard'
  | 'house-cleaning-deep'
  | 'lawn-mowing';

export interface Service {
  id: ServiceType;
  name: string;
  description: string;
  price: number;
  duration: string;
  icon: string;
}

export interface Job {
  uuid: string;
  address: string;
  serviceType: ServiceType | 'bundle';
  serviceTypes?: ServiceType[];   // populated on bundle jobs
  inbound_request: string;
  outbound_request?: string;
  price: number;
  tipAmount?: number;
  status: 'open' | 'pending_payment' | 'accepted' | 'in-progress' | 'completed' | 'confirmed' | 'disputed' | 'cancelled';
  scheduledAt?: string;
  notes?: string;
  isRated?: boolean;
  is_completed: boolean;
  createdAt: string;
  workerName?: string;
  workerProfileImageUrl?: string;
  workerRating?: number;
  dispute?: {
    reason?: string;
    filedAt?: string;
    filedBy?: string;
    customerStatement?: string;
    workerStatement?: string;
    adminResponse?: string;
    resolvedAt?: string;
    resolution?: 'cancelled' | 'charged';
  };
}

export interface Worker {
  uuid: string;
  name: string;
  rating: number;
  ratingCount: number;
  img?: string;
  profileImageUrl?: string;
  bio?: string;
  promoCode: string;
  isAvailable: boolean;
  stripeOnboardingComplete: boolean;
}

export const services = {
  list: () => api.get<Service[]>('/services'),
};

export const auth = {
  google: (idToken: string) => api.post<{ token: string; user: Record<string, unknown> }>('/auth/google', { idToken }),
  me: () => api.get('/auth/me'),
};

export interface SavedCard {
  id: string;
  last4: string;
  brand: string;
  exp_month: number;
  exp_year: number;
}

export const jobs = {
  getQuotePreview: (address: string, captchaToken: string) =>
    api.post<{ quotes: Record<ServiceType, number>; lat: number; lng: number }>('/jobs/quote/preview', { address, captchaToken }),
  getQuote: (address: string, serviceTypes: ServiceType[]) =>
    api.post<{ quotes: Record<ServiceType, number> }>('/jobs/quote', { address, serviceTypes }),
  create: (data: {
    serviceType: ServiceType;
    address: string;
    scheduledAt?: string;
    notes?: string;
    promoCode?: string;
    paymentMethodId?: string;
  }) => api.post<{ job: Job; clientSecret?: string; requiresAction: boolean }>('/jobs', data),
  createBundle: (data: {
    serviceTypes: ServiceType[];
    address: string;
    scheduledAt?: string;
    notes?: string;
    promoCode?: string;
    paymentMethodId?: string;
  }) => api.post<{ job: Job; clientSecret?: string; requiresAction: boolean }>('/jobs/bundle', data),
  activate: (id: string, serviceType: ServiceType | 'bundle') =>
    api.post<{ success: boolean }>(`/jobs/${id}/activate`, { serviceType }),
  list: () => api.get<Job[]>('/jobs'),
  get: (id: string, serviceType: ServiceType | 'bundle') =>
    api.get<Job>(`/jobs/${id}`, { params: { serviceType } }),
  getOpen: () => api.get<Job[]>('/jobs/open'),
  accept: (id: string, serviceType: ServiceType | 'bundle') =>
    api.post(`/jobs/${id}/accept`, { serviceType }),
  complete: (id: string, serviceType: ServiceType | 'bundle') =>
    api.post<{ confirmationCode: string }>(`/jobs/${id}/complete`, { serviceType }),
  regenerateCode: (id: string, serviceType: ServiceType | 'bundle') =>
    api.post<{ confirmationCode: string }>(`/jobs/${id}/regenerate-code`, { serviceType }),
  confirm: (id: string, serviceType: ServiceType | 'bundle', confirmationCode: string) =>
    api.post(`/jobs/${id}/confirm`, { serviceType, confirmationCode }),
  tip: (id: string, serviceType: ServiceType | 'bundle', tipAmount: number, paymentMethodId?: string) =>
    api.post<{ success: boolean }>(`/jobs/${id}/tip`, { serviceType, tipAmount, paymentMethodId }),
  dispute: (id: string, serviceType: ServiceType | 'bundle', reason: string) =>
    api.post(`/jobs/${id}/dispute`, { serviceType, reason }),
  submitStatement: (id: string, serviceType: ServiceType | 'bundle', statement: string) =>
    api.post<{ success: boolean }>(`/jobs/${id}/dispute/statement`, { serviceType, statement }),
  rate: (id: string, serviceType: ServiceType | 'bundle', rating: number) =>
    api.post<{ success: boolean; newRating: number; ratingCount: number }>(`/jobs/${id}/rate`, { serviceType, rating }),
};

export const workers = {
  profile: () => api.get<Worker>('/workers/profile'),
  updateProfile: (data: FormData) =>
    api.put('/workers/profile', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  uploadProfileImage: (blob: Blob) => {
    const fd = new FormData();
    fd.append('image', blob, 'profile.jpg');
    return api.post<{ profileImageUrl: string }>('/workers/me/profile-image', fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  stripeOnboarding: () => api.get<{ url: string }>('/workers/stripe/onboarding-link'),
  payout: () => api.post<{ jobsPaid: number; totalAmount: number }>('/workers/payout'),
  prevPayouts: () => api.get<{ paidAt: string; amount: number }[]>('/workers/prev_payouts'),
  prevJobs: () =>
    api.get<{ uuid: string; price: number; customerLabel: string; serviceType: string; serviceTypes?: string[] }[]>(
      '/workers/prev_jobs'
    ),
};

export interface AdminWorker {
  uuid: string;
  name: string;
  bio?: string;
  profileImageUrl?: string;
  img?: string;
  rating: number;
  ratingCount: number;
  promoCode: string;
  isAvailable: boolean;
  isApproved: boolean;
  stripeOnboardingComplete: boolean;
  createdAt: string;
  jobCount: number;
  totalEarnings: number;
}

export interface AdminPayout {
  workerUuid: string;
  jobUuid: string;
  serviceType: string;
  baseAmount: number;
  tipAmount: number;
  type: 'service' | 'promo';
  status: 'pending' | 'paid';
  createdAt: string;
  paidAt?: string;
}

export const admin = {
  getWorkers: () => api.get<AdminWorker[]>('/admin/workers'),
  getWorkerJobs: (id: string) => api.get<Job[]>(`/admin/workers/${id}/jobs`),
  getWorkerPayouts: (id: string) => api.get<AdminPayout[]>(`/admin/workers/${id}/payouts`),
  patchWorker: (id: string, updates: { isAvailable?: boolean; isApproved?: boolean }) =>
    api.patch<{ success: boolean }>(`/admin/workers/${id}`, updates),
  getDisputes: () => api.get<Job[]>('/admin/disputes'),
  resolveDispute: (
    jobId: string,
    serviceType: ServiceType | 'bundle',
    resolution: 'cancelled' | 'charged',
    adminResponse: string
  ) => api.post<{ success: boolean }>(`/admin/disputes/${jobId}/resolve`, { serviceType, resolution, adminResponse }),
};

export const users = {
  updateProfile: (data: { address?: string; expoPushToken?: string; webPushSubscription?: string }) =>
    api.put('/users/profile', data),
  getSavedCard: () => api.get<{ card: SavedCard | null }>('/users/saved-card'),
};
