## ADDED Requirements

### Requirement: TrustBadgeStrip component renders three platform badges
The system SHALL render a horizontal strip containing three badge entries — Google, Yelp, and Nextdoor — each showing the platform logo/name, a star rating, and a review count. Each badge SHALL be an anchor linking to the respective real profile URL and SHALL open in a new tab.

#### Scenario: Badge strip renders all three platforms
- **WHEN** `TrustBadgeStrip` is mounted
- **THEN** three badges are visible: Google, Yelp, and Nextdoor, each with stars and a review count label

#### Scenario: Clicking a badge opens the profile in a new tab
- **WHEN** a user clicks the Google badge
- **THEN** the browser opens `https://share.google/003v3ioshqM78T8tO` (Google Business profile) in a new tab
- **WHEN** a user clicks the Yelp badge
- **THEN** the browser opens `https://www.yelp.com/biz/lintel-bethesda` in a new tab
- **WHEN** a user clicks the Nextdoor badge
- **THEN** the browser opens `https://nextdoor.com/page/lintel-bethesda-md/` in a new tab

### Requirement: TrustBadgeStrip is placed after the hero on all pages
The strip SHALL appear immediately below the hero section on the homepage and on each of the three service pages (`/services/gutter-cleaning`, `/services/pressure-washing`, `/services/window-cleaning`).

#### Scenario: Homepage shows badge strip below hero
- **WHEN** a user loads the homepage
- **THEN** the badge strip is visible between the hero section and the stats bar (or replaces the current position just after the hero)

#### Scenario: Service pages show badge strip below dark hero
- **WHEN** a user loads any service page
- **THEN** the badge strip appears as the first element below the hero image/overlay section

### Requirement: Testimonial cards display platform attribution icon
Each testimonial card on the homepage's "What Customers Say" section SHALL include a small Google or Yelp icon indicating the review source.

#### Scenario: Testimonial shows platform icon
- **WHEN** a testimonial card is rendered
- **THEN** a platform icon (Google "G" or Yelp burst logo, rendered as SVG or text) appears near the reviewer's name or at the bottom of the card

### Requirement: ServiceQuoteCTA sidebar shows compact review badge
The `ServiceQuoteCTA` component SHALL display a compact one-line review badge (e.g., "★★★★★ 4.9 · 46 Google reviews") near its header, above the address input.

#### Scenario: Sidebar CTA shows review count
- **WHEN** `ServiceQuoteCTA` is rendered on a desktop service page
- **THEN** a compact star rating and review count line is visible near the top of the widget
