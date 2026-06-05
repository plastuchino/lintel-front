import { create } from 'zustand';
import type { ServiceType } from '../lib/api';

interface BookingStore {
  selectedServices: ServiceType[];
  address: string;
  confirmedAddress: string;
  coordinates: { lat: number; lng: number } | null;
  scheduledAt: string | null;
  notes: string;
  promoCode: string;
  recurringInterval: null | 3 | 6 | 12;
  currentJobId: string | null;
  quotes: Partial<Record<ServiceType, number>>;
  quotesReady: boolean;
  /** Pre-warmed Turnstile token from the landing page (not persisted). */
  captchaToken: string | undefined;
  /** Timestamp (ms) when captchaToken was received. */
  captchaTokenAt: number | undefined;
  toggleService: (service: ServiceType) => void;
  setSelectedServices: (services: ServiceType[]) => void;
  setAddress: (address: string, confirmed?: boolean) => void;
  setCoordinates: (coords: { lat: number; lng: number }) => void;
  setScheduledAt: (date: string | null) => void;
  setNotes: (notes: string) => void;
  setPromoCode: (code: string) => void;
  setRecurringInterval: (interval: null | 3 | 6 | 12) => void;
  setCurrentJobId: (id: string) => void;
  setQuotes: (quotes: Partial<Record<ServiceType, number>>) => void;
  setQuotesReady: (ready: boolean) => void;
  setCaptchaToken: (token: string) => void;
  clearCaptchaToken: () => void;
  reset: () => void;
}

export const useBookingStore = create<BookingStore>((set) => ({
  selectedServices: [],
  address: '',
  confirmedAddress: '',
  coordinates: null,
  scheduledAt: null,
  notes: '',
  promoCode: '',
  recurringInterval: null,
  currentJobId: null,
  quotes: {},
  quotesReady: false,
  captchaToken: undefined,
  captchaTokenAt: undefined,
  toggleService: (service) =>
    set((state) => ({
      selectedServices: state.selectedServices.includes(service)
        ? state.selectedServices.filter((s) => s !== service)
        : [...state.selectedServices, service],
    })),
  setSelectedServices: (services) => set({ selectedServices: services }),
  setAddress: (address, confirmed) =>
    set({ address, confirmedAddress: confirmed ? address : '' }),
  setCoordinates: (coords) => set({ coordinates: coords }),
  setScheduledAt: (date) => set({ scheduledAt: date }),
  setNotes: (notes) => set({ notes }),
  setPromoCode: (code) => set({ promoCode: code }),
  setRecurringInterval: (interval) => set({ recurringInterval: interval }),
  setCurrentJobId: (id) => set({ currentJobId: id }),
  setQuotes: (quotes) => set({ quotes, quotesReady: true }),
  setQuotesReady: (ready) => set({ quotesReady: ready }),
  setCaptchaToken: (token) => set({ captchaToken: token, captchaTokenAt: Date.now() }),
  clearCaptchaToken: () => set({ captchaToken: undefined, captchaTokenAt: undefined }),
  reset: () =>
    set({
      selectedServices: [],
      address: '',
      confirmedAddress: '',
      coordinates: null,
      scheduledAt: null,
      notes: '',
      promoCode: '',
      recurringInterval: null,
      currentJobId: null,
      quotes: {},
      quotesReady: false,
    }),
}));
