## Context

The homepage (`LandingPage.tsx`) and three service pages use a minimal, tech-forward visual style (monospace text, dot grids, uppercase labels) that reads as SaaS. No review platform badges link to external profiles, testimonials lack platform attribution, and there is no urgency signal or first-booking incentive near the CTAs. The sidebar CTA component (`ServiceQuoteCTA.tsx`) is shared across all three service pages — changes there propagate everywhere.

## Goals / Non-Goals

**Goals:**
- Add a reusable `TrustBadgeStrip` component linking to real Google, Yelp, and Nextdoor profiles
- Add time-based urgency copy and a "$20 off" promo display near every primary CTA
- Add platform icons to testimonial cards on the homepage
- Add phone number to homepage hero
- Keep all changes purely in the frontend — zero backend touches

**Non-Goals:**
- Enforcing the $20 discount in the backend or at checkout
- Fetching live review counts from APIs (static counts only)
- Changing the overall visual design system or color palette
- Adding any new npm dependencies

## Decisions

### 1. New `TrustBadgeStrip` component vs. inline markup

**Decision**: Create `webapp/src/components/TrustBadgeStrip.tsx`.

**Rationale**: The strip appears in 4 places (homepage + 3 service pages). Inlining it in each file creates drift. A single component keeps review counts and URLs in one place.

**Alternative considered**: Inline per-page — rejected because updating the Yelp review count later would require edits in 4 files.

### 2. Review counts are static, not fetched

**Decision**: Hardcode counts (e.g., "34 Google reviews", "12 Yelp reviews") in the component.

**Rationale**: Google, Yelp, and Nextdoor don't offer a free unauthenticated review count API. Fetching via unofficial scraping is fragile and violates ToS. Static numbers updated manually when the team checks are accurate enough.

**Alternative considered**: Embedding official widgets — Yelp and Google both offer embeds, but they add external script load, have fixed styling hard to match the design system, and slow page load.

### 3. Urgency copy via `new Date().getDay()` on the client

**Decision**: Compute day of week at render time in a small `getAvailabilityMessage()` utility.

**Rationale**: No server round-trip needed. The copy is inherently approximate ("Filling up fast" on a Wednesday is always somewhat true). SSR is not in use here (Vite SPA), so hydration mismatch is not a concern.

### 4. "$20 off" promo is display-only

**Decision**: Render a styled banner with "NEW CUSTOMER OFFER — $20 OFF YOUR FIRST BOOKING" near each CTA. No promo code, no backend validation.

**Rationale**: The user explicitly requested display-only. Adding code enforcement is a separate backend change. The banner's job is to reduce hesitation, not gate a checkout flow.

### 5. Placement of badge strip on service pages

**Decision**: Insert the strip as a narrow bar immediately below the dark hero section and above the two-column content/sidebar layout.

**Rationale**: It's the first thing visible after the hero — the moment a user scrolls down they see social proof before reading content. Placing it inside the sidebar would hide it on mobile.

## Risks / Trade-offs

- **Static review counts go stale** → Mitigate by noting in a code comment to update the counts quarterly
- **$20 offer creates support requests if not honored** → Display copy says "first booking" which is standard industry practice; team should honor it manually or add a note to the booking confirmation
- **Nextdoor badge less recognized than Google/Yelp** → It's third in the row, so low risk; its "local neighbors" connotation adds value even if users don't click it
