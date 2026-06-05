import type { ServiceType } from './api';

const CACHE_KEY = 'lintel_preview_quote';
const TTL_MS = 48 * 60 * 60 * 1000;

interface PreviewCache {
  address: string;
  quotes: Record<ServiceType, number>;
  coords: { lat: number; lng: number };
  expiresAt: number;
}

export function getPreviewCache(address: string): PreviewCache | null {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as PreviewCache;
    if (data.address !== address || data.expiresAt <= Date.now()) {
      sessionStorage.removeItem(CACHE_KEY);
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

export function setPreviewCache(
  address: string,
  quotes: Record<ServiceType, number>,
  coords: { lat: number; lng: number },
): number {
  const expiresAt = Date.now() + TTL_MS;
  const data: PreviewCache = { address, quotes, coords, expiresAt };
  sessionStorage.setItem(CACHE_KEY, JSON.stringify(data));
  return expiresAt;
}

export function clearPreviewCache(): void {
  sessionStorage.removeItem(CACHE_KEY);
}
