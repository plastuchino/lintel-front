## ADDED Requirements

### Requirement: Time-based availability message near CTAs
The system SHALL derive an availability message from the current day of week (client-side, `new Date().getDay()`) and display it near each primary CTA on the homepage and on each service page sidebar.

Day mapping:
- Monday (1) and Tuesday (2): "Good availability this week"
- Wednesday (3) and Thursday (4): "Filling up fast this week"
- Friday (5), Saturday (6), and Sunday (0): "Limited slots remaining"

#### Scenario: Monday renders "Good availability" message
- **WHEN** a user visits the site on a Monday
- **THEN** the urgency line reads "Good availability this week" near the CTA

#### Scenario: Wednesday renders "Filling up fast" message
- **WHEN** a user visits the site on a Wednesday
- **THEN** the urgency line reads "Filling up fast this week" near the CTA

#### Scenario: Friday renders "Limited slots" message
- **WHEN** a user visits the site on a Friday
- **THEN** the urgency line reads "Limited slots remaining" near the CTA

### Requirement: "$20 off first booking" promo displayed near CTAs
The system SHALL display a promotional banner reading "$20 OFF YOUR FIRST BOOKING" (or similar) near the primary CTA on the homepage hero and within the `ServiceQuoteCTA` sidebar widget. The banner SHALL be display-only with no backend enforcement.

#### Scenario: Homepage hero shows promo offer
- **WHEN** a user loads the homepage
- **THEN** a visually distinct "$20 off your first booking" banner is visible near the address input / CTA button

#### Scenario: Service page sidebar shows promo offer
- **WHEN** a user views a service page on desktop
- **THEN** the `ServiceQuoteCTA` sidebar displays the "$20 off" promo near the booking CTA

### Requirement: Phone number visible in homepage hero
The homepage hero section SHALL display a clickable phone number link (`tel:12403660377`) so users can call directly without scrolling to a service page.

#### Scenario: Phone number appears in homepage hero
- **WHEN** a user loads the homepage
- **THEN** a phone number "(240) 366-0377" is visible in the hero area as a `tel:` link
