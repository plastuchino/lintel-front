import { useState } from 'react';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN as string | undefined;

export function useGeoHeadline() {
  const [cityName, setCityName] = useState<string | null>(null);
  const [stateAbbr, setStateAbbr] = useState('MD');
  const [geoResolved, setGeoResolved] = useState(false);

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setGeoResolved(true);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        setGeoResolved(true);
        if (!MAPBOX_TOKEN) return;
        try {
          const { latitude: lat, longitude: lng } = pos.coords;
          const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?types=place&access_token=${MAPBOX_TOKEN}`;
          const res = await fetch(url);
          const data = await res.json();
          const feature = data.features?.[0];
          const city = feature?.text as string | undefined;
          if (city) setCityName(city);
          const region = feature?.context?.find((c: { id: string }) =>
            c.id.startsWith('region.'),
          ) as { short_code?: string } | undefined;
          if (region?.short_code) {
            setStateAbbr(region.short_code.replace(/^US-/, ''));
          }
        } catch {
          // silent fallback
        }
      },
      () => {
        // denied — silent fallback
        setGeoResolved(true);
      },
    );
  };

  return { cityName, stateAbbr, geoResolved, requestLocation };
}
