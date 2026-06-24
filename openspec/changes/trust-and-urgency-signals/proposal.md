## Why

The site currently reads as a SaaS product rather than a local service business — no externally-verifiable review platform badges, no urgency signals, and no clear incentive to book now versus later. Adding trust badges, platform-attributed reviews, time-based urgency copy, and a first-booking discount gives visitors concrete social proof and an immediate reason to fill out the form.

## What Changes

- **Trust badge strip** added to homepage (below hero) and each service page (below hero): Google, Yelp, and Nextdoor badges showing star ratings and review counts, each linking to the real profile
- **Testimonial cards** on the homepage gain a Google or Yelp icon so reviews feel externally attributed rather than self-published
- **Time-based urgency line** added near the hero CTA (homepage) and sidebar CTA (service pages): Mon–Tue = "Good availability this week", Wed–Thu = "Filling up fast this week", Fri–Sun = "Limited slots remaining"
- **"$20 off your first booking"** promo banner displayed near the hero CTA (homepage) and sidebar CTA (service pages) — display-only, no backend enforcement
- **Phone number** added to the homepage hero area (currently only visible on service pages)
- **ServiceQuoteCTA** sidebar widget gains a compact Google/Yelp review badge near its header

## Capabilities

### New Capabilities

- `trust-badge-strip`: Reusable badge strip component showing Google, Yelp, and Nextdoor ratings with links to real profiles
- `urgency-signal`: Time-based availability copy and first-booking promo displayed near CTAs

### Modified Capabilities

<!-- none — no existing spec-level behavior is changing -->

## Impact

- `webapp/src/pages/LandingPage.tsx` — add badge strip, phone in hero, platform attribution on testimonials, urgency + promo near CTA
- `webapp/src/pages/ServiceGutterCleaning.tsx` — add badge strip below hero
- `webapp/src/pages/ServiceWindowCleaning.tsx` — add badge strip below hero
- `webapp/src/pages/ServicePressureWashing.tsx` — add badge strip below hero
- `webapp/src/components/ServiceQuoteCTA.tsx` — add review badge and urgency/promo copy
- New component: `webapp/src/components/TrustBadgeStrip.tsx`
- No backend changes, no new dependencies
