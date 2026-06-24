import type { ServiceType } from './api';

const STORAGE_KEY = 'lintel_saved_quotes';
const TTL_MS = 14 * 24 * 60 * 60 * 1000;
const MAX_ENTRIES = 3;

export interface SavedQuote {
  address: string;
  quotes: Record<ServiceType, number>;
  coords: { lat: number; lng: number };
  createdAt: number;
  expiresAt: number;
}

export function getSavedQuotes(): SavedQuote[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const list = JSON.parse(raw) as SavedQuote[];
    return list.filter((q) => q.expiresAt > Date.now());
  } catch {
    return [];
  }
}

export function pushSavedQuote(entry: Omit<SavedQuote, 'expiresAt'> & { expiresAt?: number }): void {
  try {
    const expiresAt = entry.expiresAt ?? Date.now() + TTL_MS;
    const now = Date.now();
    const existing = getSavedQuotes()
      .filter((q) => q.address !== entry.address && q.expiresAt > now);
    const updated: SavedQuote[] = [
      { ...entry, expiresAt },
      ...existing,
    ].slice(0, MAX_ENTRIES);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // silent — localStorage may be unavailable
  }
}
