## 1. Shared Utilities

- [x] 1.1 Create `webapp/src/components/TrustBadgeStrip.tsx` with Google, Yelp, and Nextdoor badges (static star ratings, review counts, real profile links, opens in new tab)
- [x] 1.2 Add `getAvailabilityMessage()` utility in `TrustBadgeStrip.tsx` or a shared `utils/urgency.ts` that maps `new Date().getDay()` to the three availability strings

## 2. ServiceQuoteCTA Updates

- [x] 2.1 Add compact star/review line ("★★★★★ 4.9 · 46 Google reviews") near the widget header in `ServiceQuoteCTA.tsx`
- [x] 2.2 Add "$20 OFF YOUR FIRST BOOKING" promo banner inside `ServiceQuoteCTA.tsx` above the CTA button
- [x] 2.3 Add time-based urgency line (from `getAvailabilityMessage()`) inside `ServiceQuoteCTA.tsx` below or near the promo banner

## 3. Homepage (LandingPage.tsx)

- [x] 3.1 Add `TrustBadgeStrip` below the hero section (between hero and stats bar)
- [x] 3.2 Add phone number `(240) 366-0377` as a `tel:` link in the homepage hero area
- [x] 3.3 Add "$20 OFF YOUR FIRST BOOKING" promo near the hero address input / CTA button
- [x] 3.4 Add time-based urgency line near the hero CTA (below the promo or below the button)
- [x] 3.5 Add platform attribution icons (Google "G" or Yelp burst) to each testimonial card in the "What Customers Say" section

## 4. Service Pages

- [x] 4.1 Add `TrustBadgeStrip` below the hero section in `ServiceGutterCleaning.tsx`
- [x] 4.2 Add `TrustBadgeStrip` below the hero section in `ServiceWindowCleaning.tsx`
- [x] 4.3 Add `TrustBadgeStrip` below the hero section in `ServicePressureWashing.tsx`
