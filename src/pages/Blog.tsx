import { Link } from 'react-router-dom';
import { ArrowRight, Clock } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import logo from '../assets/logo.jpeg';

export const BLOG_POSTS = [
  {
    slug: 'what-a-pro-does',
    title: 'What a Lintel Pro Actually Does — A Full Breakdown',
    excerpt: 'Thinking about signing up as a Lintel pro? Here\'s exactly what a typical job looks like, how you get paid, and what Lintel handles for you — including all the equipment.',
    readTime: '5 min read',
    date: 'May 1, 2026',
    category: 'For Professionals',
    content: `
## What it means to be a Lintel pro

A Lintel pro is a vetted, independent service worker who picks up on-demand home service jobs — gutter cleaning, pressure washing, window cleaning, and more. You set your own schedule, choose which jobs to accept, and get paid directly after each one.

Think of it like being a rideshare driver, but for home services. You don't need a car full of passengers — just a willingness to work, a driver's license, and a clean background check. Lintel provides all the equipment.

## Your typical job, step by step

### Step 1 — A job appears on your dashboard

When a homeowner books a service in your area, the job shows up in your worker dashboard. You'll see the service type, address, date, and the payout amount — before you accept it.

### Step 2 — You accept the job

Tap "Accept" and the job is yours. The homeowner gets notified that a pro has been assigned. You'll see the full address and any notes from the customer.

### Step 3 — Show up and do the work

Arrive at the scheduled time, introduce yourself, and get to work. Each service type has a clear scope — Lintel defines what's included so there are no awkward conversations about what's "extra."

- **Gutter cleaning**: Remove debris from all accessible gutters using the provided vacuum and blower equipment, flush downspouts, bag and remove waste. All work is ground-level — no ladders.
- **Pressure washing**: Clean the specified surface (driveway, patio, deck, or siding) using Lintel's commercial-grade pressure washer. We provide the machine, detergents, and nozzles — you just operate it.
- **Window cleaning**: Clean all exterior-facing windows (and interior if booked) using the provided water-fed pole system and supplies. Streak-free finish expected.

### Step 4 — Mark the job complete

When you're done, mark the job as complete in the app. This generates a **confirmation code** — a unique code you give to the homeowner.

### Step 5 — Get paid

The homeowner enters your confirmation code in their app to confirm they're satisfied. Once confirmed, your payout is released — typically within 1–2 business days via Stripe. If the homeowner doesn't confirm within 48 hours, the system auto-confirms and pays you.

## How much do you earn?

On every completed job, you keep **40% of the job fee**. Here's what that looks like in practice:

| Service | Job Price | Your Payout |
|---------|-----------|-------------|
| Gutter Cleaning | $89 | $35.60 |
| Window Cleaning | $119 | $47.60 |
| Pressure Washing | $149 | $59.60 |

Tips are added on top — and **100% of every tip goes directly to you**. Lintel takes nothing from tips, ever.

### Our $40/hr minimum commitment

We believe pros should be paid fairly for their time. If your commission on a job works out to less than **$40/hour** based on the expected job duration, we'll increase your split until it does. This isn't a bonus or a promo — it's a standing policy. We'd rather take a smaller cut than have our pros earning less than they deserve.

Top-performing pros who take multiple jobs per day regularly earn **$400–$800/week** working part-time hours.

## What Lintel handles for you

This is the part most people underestimate. Running a home service business on your own means buying equipment, marketing, scheduling, invoicing, handling disputes, and buying insurance. Lintel handles all of that:

- **All equipment and supplies**: We provide everything you need for every job — pressure washers, vacuums, cleaning solutions, water-fed poles, the works. You just show up and do the work.
- **Customer acquisition**: We run ads, SEO, and referral programs. You never have to find your own clients.
- **Scheduling**: The booking system handles availability, time slots, and reminders.
- **Payment processing**: Stripe handles all money movement. You don't send invoices or chase payments.
- **Insurance**: Every job is covered under Lintel's $1M general liability policy. If you accidentally damage something, we handle the claim.
- **Dispute resolution**: If a customer isn't happy, our support team mediates. You don't have to negotiate with angry homeowners.

## What you need to get started

### Requirements
- Must be a current high school student
- Valid driver's license and reliable transportation to get to job sites
- Pass a background check (Lintel runs this — it takes 1–3 business days)

That's it. **Lintel provides all equipment and supplies** for every service type — pressure washers, gutter vacuums, window cleaning systems, detergents, trash bags, everything. You just need to show up ready to work.

## A day in the life

Here's what a realistic Tuesday might look like for an active Lintel pro:

- **8:30 AM** — Check the dashboard over coffee. See two gutter cleaning jobs and a pressure wash available nearby.
- **9:00 AM** — Accept all three. Grab your keys and head out.
- **9:30 AM** — Arrive at first gutter job. 45 minutes of work. Mark complete, hand over the code.
- **10:30 AM** — Drive to second gutter job (12 minutes away). Same process.
- **12:00 PM** — Lunch break.
- **1:00 PM** — Pressure washing job. Takes about 90 minutes for a driveway.
- **3:00 PM** — Done for the day. Three jobs completed, ~$143 earned before tips.

That's a 6-hour workday, on your own terms. No boss. No set hours. No uniform (though a clean, professional appearance is expected).

## How ratings work

After each job, the homeowner rates you on a 5-star scale. Your rating is visible to future customers and affects which jobs you're offered. Here's the system:

- **4.5★ and above**: You're in great standing. You get first access to new jobs in your area.
- **4.0–4.4★**: You're on watch. Maintain quality or risk reduced job access.
- **Below 4.0★**: Your account is paused for review. You may need to complete a quality refresher before reactivating.

The network average is **4.9★** — most pros take pride in their work and ratings reflect that.

## Ready to start?

Signing up takes about 5 minutes. You'll fill out a short application, consent to a background check, and connect your bank account through Stripe. Once approved (usually 1–3 business days), jobs start appearing on your dashboard.

No franchise fees. No startup costs. No equipment to buy. No minimum hours. Just real work for real pay.
    `,
  },
  {
    slug: 'how-it-works',
    title: 'How Lintel Works: Book a Pro in Under 2 Minutes',
    excerpt: 'Enter your address, pick a service, and a vetted professional shows up. No phone calls, no haggling, no surprises — here\'s the full picture.',
    readTime: '3 min read',
    date: 'April 28, 2026',
    category: 'Getting Started',
    content: `
## Book a home service in three steps

Most home service booking involves calling around, waiting for quotes, and hoping the person who shows up is reliable. We built Lintel to eliminate every one of those pain points.

### Step 1 — Enter your address

Type your home address into the search box. This tells us which professionals are available in your area and confirms we serve your location.

### Step 2 — Choose your service

Pick from our menu of services — gutter cleaning, pressure washing, window cleaning, house cleaning, deep cleaning, or lawn mowing. Every service has a flat starting price listed upfront. No surprise quotes after the fact.

### Step 3 — Confirm and relax

Log in with Google (one tap), review the booking, and submit. A vetted pro will arrive at the scheduled time. You'll get a notification when they're on their way and when the job is marked complete.

## How payment works

We don't charge your card when you book. Once the professional marks the job complete, they'll give you a **confirmation code**. You enter that code in the app — that's your signal that you've seen the work and are satisfied. Only then does your payment go through.

Don't like what you see? Don't enter the code. Contact our support team and we'll make it right.

## What about tips?

After confirming a job, you'll have the option to add a tip. 100% of any tip goes directly to the worker. It's entirely optional, but it goes a long way for pros who do great work.

## Rescheduling or canceling

Plans change. You can cancel or reschedule a booking any time before the pro is dispatched, with no charge.
    `,
  },
  {
    slug: 'why-choose-lintel',
    title: 'Why Choose Lintel Over Calling Around',
    excerpt: 'Background-checked pros, transparent pricing, and you only pay after the job is done. Here\'s why thousands of homeowners are switching to on-demand home services.',
    readTime: '4 min read',
    date: 'April 22, 2026',
    category: 'Why Lintel',
    content: `
## The old way is broken

You need your gutters cleaned. So you Google "gutter cleaning near me," call three companies, leave two voicemails, get one callback with a quote that feels too high, and eventually just... put it off.

We've all been there. Lintel exists to fix this.

## Vetted professionals only

Every worker on Lintel is background-checked before they ever receive a job. We also use a live rating system — pros with low ratings stop receiving bookings. You can see a worker's rating and job count before they show up.

This isn't a random freelancer marketplace. It's a curated network of home service professionals who've earned their spot.

## Flat, upfront pricing

No quotes. No "I'll send you an estimate." Every service has a published starting price. You know what you're paying before you book. The only variable is add-ons you explicitly choose.

## Pay after confirmation — not before

This is the biggest differentiator. Your card is authorized when you book (to reserve the slot), but nothing is captured until you confirm the job is complete with a code the pro gives you. If the work isn't satisfactory, you don't enter the code, and you owe nothing while we investigate.

This puts the power where it belongs: with you.

## Satisfaction guaranteed

If you're not happy with the work, we'll send someone back to make it right — at no additional charge. No hoops, no lengthy disputes. Just contact support and we'll handle it.

## Book in under 2 minutes

From landing page to confirmed booking: enter your address, pick a service, log in with Google, confirm. That's it. No account setup, no payment form hunting — your card is saved after the first booking.
    `,
  },
  {
    slug: 'why-not-buy-your-own-machine',
    title: 'Should You Buy Your Own Pressure Washer? (Spoiler: Probably Not)',
    excerpt: 'The math on buying vs. booking a pressure washer — and why the "ownership" option costs far more than the sticker price suggests.',
    readTime: '5 min read',
    date: 'April 15, 2026',
    category: 'Tips & Advice',
    content: `
## The tempting logic of buying your own machine

You need your driveway pressure washed. A quick Amazon search turns up a decent electric pressure washer for $150–$300. You think: "I'll use it every spring. Over a few years I'll come out ahead."

It's a reasonable thought. Let's run the actual numbers.

## The real cost of ownership

### Purchase price
A consumer-grade electric pressure washer: **$150–$300**. A gas-powered unit that actually moves tough grime: **$400–$800**.

### Hose and accessories
The machine rarely comes with a quality hose. Add a surface cleaner attachment for driveways: **$40–$80** more.

### Storage
Where does it live? If you don't have a garage or shed, you're buying a cover or renting space. Even with a garage, it's a bulky item taking up permanent real estate.

### Maintenance
Gas models need oil changes, fresh fuel every season, and carburetor cleaning if stored improperly. Electric models need pump maintenance and o-ring replacements. Budget **$20–$50/year** and 1–2 hours of your time.

### Learning curve and mistakes
Consumer machines run at lower PSI than professional units. More importantly, wrong technique on the wrong surface — wood siding, certain pavers, roof shingles — causes real damage. Professional operators know which nozzle at which distance for each material. Homeowners learn the hard way.

### Actual usage
Most people pressure wash their driveway and maybe a deck once a year. Amortized over 5 years, even a $200 machine plus accessories plus maintenance puts your cost per use at **$60–$100** — before your time.

## What Lintel charges

A professional pressure washing job starts at **$149**. That includes a commercial-grade machine, the right detergents, a trained operator, and a satisfaction guarantee. No storage. No maintenance. No learning curve.

The "buy it yourself" math only works if you're doing multiple surfaces every season. For most homeowners — a driveway or deck once a year — you're better off booking.

## The same logic applies to other services

- **Gutter cleaning**: Commercial-grade vacuums and blowers, plus working safely on a ladder at height, is a professional skill. The equipment alone runs $500+.
- **Window cleaning**: Streak-free results on second-story windows require a water-fed pole system ($300–$800) and purified water.
- **Lawn mowing**: If you already have a mower, this one's closer. But the time and upkeep of mower ownership starts looking expensive once you factor in your Saturday afternoon.

## The honest bottom line

Buy the equipment if you genuinely enjoy doing the work and do it frequently. If you're buying it purely to save money, the math usually doesn't work — and the time and hassle definitely don't.
    `,
  },
  {
    slug: 'gutter-cleaning-cost-bethesda-md',
    title: 'Gutter Cleaning Cost in Bethesda & Rockville, MD',
    excerpt: 'What does gutter cleaning actually cost in Montgomery County? We break down the price by home size, explain what drives the cost, and show you what you\'re paying for.',
    readTime: '4 min read',
    date: 'May 10, 2026',
    category: 'Tips & Advice',
    content: `
## What gutter cleaning costs in Montgomery County

If you've ever searched for gutter cleaning in Bethesda or Rockville and gotten wildly different quotes — $75 from one company, $250 from another — you're not alone. The range is real, and there are legitimate reasons for it. Here's what actually drives the price.

## The honest price range

For a typical single-family home in the Bethesda and Rockville area, professional gutter cleaning costs **$89–$175**. Larger homes, homes with more linear footage of gutters, or gutters that haven't been cleaned in several years will fall toward the higher end.

At Lintel, our pricing starts at **$89 for smaller homes** and scales with property size:

| Home Size | Starting Price |
|-----------|----------------|
| Under 1,500 sq ft | $89 |
| 1,500–2,500 sq ft | $109 |
| 2,500+ sq ft | Custom quote |

These are flat prices — no hidden fees, no "assessment charges," no post-job surprises.

## What drives the cost

### Linear footage of gutters

The biggest variable. A standard ranch home might have 120 linear feet of gutters. A larger colonial in Bethesda or Potomac with dormers and complex rooflines can have 200+ feet. More gutter = more time = higher price.

### How clogged the gutters are

A home cleaned twice a year takes 45 minutes. Gutters that have been ignored for three years — compacted leaves, seedlings growing in the debris, nesting material — can take twice as long. The extra time is real labor.

### Number of downspouts

Downspouts are where blockages hide. A home with 4 downspouts that all need to be flushed and cleared takes longer than one with 2. Homes in Bethesda's older neighborhoods often have original downspout configurations that require extra attention.

### Equipment and method

Ground-level vacuum systems (what Lintel uses) are more efficient and safer than traditional ladder-and-hand-scooping methods. They're also better at removing fine debris that hand cleaning leaves behind. Pricing reflects the equipment investment.

## What you're paying for — and what you're not

A $89–$109 Lintel job includes full debris removal from all accessible gutters, downspout flushing, waste removal from the property, and a satisfaction guarantee. Your card isn't charged until you confirm the job is done.

What you're **not** paying for: repairs, gutter guard removal/reinstallation, or work on rooflines requiring specialty equipment. If we see anything that needs attention during the clean, we'll note it — but that's a separate scope.

## The hidden cost of skipping it

Clogged gutters aren't just an aesthetic issue. In Montgomery County's heavy-rainfall climate, gutters that can't drain properly direct water against your foundation, into your soffit, and behind your fascia boards. Foundation water intrusion and fascia rot are common outcomes of deferred gutter maintenance — both significantly more expensive than a twice-yearly cleaning.

## How often should you clean in the Bethesda area?

Twice a year is the standard recommendation: once in late spring (after pollen and seed pods) and once in late fall (after leaves). Homes under heavy tree canopy — oaks and maples are everywhere in Bethesda, Chevy Chase, and Potomac — often benefit from a third cleaning in early fall.

Ready to see what it costs for your home specifically? Enter your address and get an instant price.
    `,
  },
  {
    slug: 'how-often-clean-gutters-maryland',
    title: 'How Often Should You Clean Your Gutters in Maryland?',
    excerpt: 'The standard advice is "twice a year" — but Maryland\'s tree coverage and climate mean some homes need more. Here\'s how to figure out the right schedule for your property.',
    readTime: '4 min read',
    date: 'May 6, 2026',
    category: 'Tips & Advice',
    content: `
## The answer depends on your trees, not just a calendar

You've probably seen the generic advice: clean your gutters twice a year, spring and fall. That's a good baseline. But in Montgomery County, where tree canopy coverage is among the densest in the mid-Atlantic, the right answer for your specific property might be different.

Here's how to think about it.

## Why Maryland needs more frequent cleaning than most states

Maryland sits in a climate zone with heavy spring pollen seasons, wet summers that accelerate organic growth, and dense fall leaf drop. The tree species common to Bethesda, Rockville, Potomac, and Chevy Chase — oak, maple, tulip poplar, sweetgum — drop at different times and in different forms:

- **Spring**: Oak pollen catkins, maple seed pods (helicopters), and general debris from winter
- **Early fall**: Sweetgum and tulip poplar drop seeds and leaves starting in September
- **Late fall**: Oak and maple drop the heavy leaf loads that most homeowners think of

This means a home with heavy tree coverage may see significant gutter loading three times in a year, not two.

## The twice-a-year baseline

For homes with moderate tree coverage in the Bethesda and Rockville area, two cleanings per year is the right call:

**Spring cleaning (April–May)**: Clears winter debris, pollen, and seed pods before the rainy season. If your downspouts are blocked heading into June, you're directing water against your foundation every time it rains.

**Fall cleaning (November–December)**: After the leaves are down. Wait until the maples and oaks have fully dropped — if you clean too early in October, you're cleaning again in two weeks.

## When to add a third cleaning

Consider scheduling a third cleaning if any of these apply to your property:

- **Your yard has several large oaks or sweetgums**: These species drop seeds and early leaves in September, well before the main fall drop
- **You've had downspout blockages**: A sign your gutters are filling faster than a twice-yearly schedule handles
- **You're under a mature tree canopy**: Especially common in older Bethesda neighborhoods and parts of Chevy Chase where tree coverage is dense
- **You've had water intrusion issues**: If you've had basement seepage or fascia damage, more frequent cleaning is cheap prevention

## Signs your gutters need cleaning now

You don't always have to wait for the schedule. Clean immediately if you notice:

- **Water pouring over the gutter edges** during rain instead of down the downspout
- **Plants growing from the gutter** — a sure sign of soil and debris accumulation
- **Sagging gutters** — debris weight pulling the gutter away from the fascia
- **Staining on siding** below the gutters — indicates overflow
- **Mosquito activity** near the roofline — standing water in clogged gutters is a breeding ground

## The simple rule for Montgomery County

If you're under moderate tree coverage: clean in May and again in November. If you have heavy canopy — especially oaks — add a cleaning in September or early October. If you're not sure, err toward three times. The cost of an extra cleaning is trivial compared to the cost of water damage.

Lintel serves all of Montgomery County: Bethesda, Rockville, Chevy Chase, Potomac, Silver Spring, Gaithersburg, and Germantown. See prices for your home at uselintel.pro.
    `,
  },
  {
    slug: 'pressure-washing-driveway-maryland',
    title: 'Pressure Washing Your Driveway in Maryland: What to Know',
    excerpt: 'Maryland\'s humid climate is unusually good at growing mold and algae on driveways. Here\'s what causes it, when to clean, and what to expect from a professional pressure washing service.',
    readTime: '5 min read',
    date: 'May 3, 2026',
    category: 'Tips & Advice',
    content: `
## Why Maryland driveways get dirtier than you'd expect

If you've noticed your concrete driveway developing a dark grey or greenish tint over the course of a year, you're seeing something specific to the mid-Atlantic climate: a combination of atmospheric soot, organic growth (mold, mildew, and algae), and mineral deposits from rain and sprinklers.

Bethesda and Rockville sit in a humidity corridor that's ideal for biological growth on hard surfaces. Shaded driveways — common in tree-lined neighborhoods throughout Montgomery County — rarely dry completely between rain events, which gives algae the moisture it needs to establish. Once algae takes hold, the surface darkens progressively and becomes genuinely slippery when wet.

## What a professional pressure washing actually removes

A consumer garden hose can't touch most of what builds up on a driveway. Even a consumer-grade electric pressure washer doesn't run at high enough PSI to fully remove compacted organic growth. Here's what professional cleaning removes:

**Organic growth**: Algae, mold, and mildew embedded in the surface texture of the concrete. This is the black and green discoloration. A commercial machine with the right detergent breaks down the biological material and clears it completely.

**Atmospheric soot**: Fine particulate from vehicle traffic, especially on driveways near River Road, Rockville Pike, or Wisconsin Avenue. This accumulates as a grey film.

**Oil stains**: Motor oil, transmission fluid, and tire marks. Requires a pre-treatment with a degreasing detergent, not just water pressure.

**Mineral deposits**: Hard water and sprinkler spray leaves calcium deposits on concrete surfaces. High-pressure hot water removes what regular cleaning cannot.

## Before and after: realistic expectations

Professional pressure washing produces a dramatic visual result on most driveways. The surface after cleaning typically looks 3–5 years newer. Deep oil stains that have been sitting for years may lighten significantly but not disappear entirely — that's a chemistry limitation, not a technique one.

For patios, decks, and stone surfaces, results depend on the material. Pavers and concrete look dramatically different after cleaning. Weathered wood decks lighten noticeably and regain surface texture.

## When to pressure wash in Montgomery County

**Spring (April–May)**: The most common time. Removes winter grime, road salt residue from the January–March season, and biological growth that established during the wet fall. Prepares outdoor surfaces for the summer months.

**Fall (September–October)**: Less common but useful before winter. Removes mold and algae before it goes dormant in the cold — biological growth that's killed in fall doesn't return in spring the way untreated growth does.

**Avoid freezing temperatures**: Water in cracks and surface pores can freeze and expand, which damages concrete. Don't pressure wash if there's a risk of overnight temps below 32°F within 24 hours of the job.

## What surfaces Lintel cleans

We clean driveways, patios and decks, siding (vinyl, brick, and fiber cement), and sidewalks and walkways. Multiple surfaces can be combined in a single booking — bundled jobs are priced accordingly.

All equipment is commercial-grade. We bring the right nozzle and PSI setting for each surface type — something consumer machines often get wrong on softer materials like wood or pavers.

## How it's priced

Pressure washing starts at **$149** for a standard driveway or patio. The final price depends on surface area and type. Lintel shows you the exact price for your home before you confirm the booking — no post-job surprise invoices.

We serve all of Montgomery County: Bethesda, Rockville, Chevy Chase, Potomac, Silver Spring, Gaithersburg, and Germantown.
    `,
  },
  {
    slug: 'signs-gutters-need-cleaning',
    title: '5 Signs Your Gutters Need Cleaning (And What Happens If You Ignore Them)',
    excerpt: 'Most gutter problems are invisible until they become expensive. These five warning signs tell you when it\'s time — and what\'s at stake if you wait.',
    readTime: '4 min read',
    date: 'April 30, 2026',
    category: 'Tips & Advice',
    content: `
## Most gutter problems are invisible until they're expensive

Gutters don't announce themselves when they're failing. Unlike a leaky faucet or a squeaky door, clogged gutters silently redirect water in ways you won't notice until you're dealing with fascia rot, foundation seepage, or basement flooding.

These five signs are your early warning system. Each one means it's time to schedule a cleaning — or you're already overdue.

## Sign 1: Water spills over the gutter edge during rain

This is the most obvious sign and the one people most often dismiss. "The gutters just overflow a little when it really pours" is not a normal condition — it means the gutter is partially or fully blocked and can't carry water to the downspouts.

**What it leads to**: Overflow water lands at the base of your foundation. Over months and years, this is one of the most common causes of basement water intrusion in Bethesda and Rockville's older housing stock. Water that should travel 15 feet away from your house via downspout extensions is instead pooling directly against the foundation wall.

## Sign 2: Plants growing from the gutters

If you can see greenery growing out of your gutters, the debris has been there long enough to accumulate soil, trap moisture, and support plant life. That's at least one full season of accumulation.

**What it leads to**: The organic matter in mature debris is heavy and retains water. A single section of fully clogged gutter with wet debris can weigh 50+ pounds — far beyond what the mounting hardware was designed for. Sagging and detachment from the fascia follows.

## Sign 3: Sagging gutters or visible gaps

If a gutter section is visibly pulling away from the house or sagging in the middle, debris weight is likely the cause. You may also see gaps at the joints where sections connect.

**What it leads to**: A sagging gutter doesn't drain to the downspout — water pools in the low spot, which accelerates corrosion on metal gutters and wood rot on the fascia board behind them. Fascia replacement is significantly more expensive than gutter cleaning.

## Sign 4: Staining or streaking on siding below the gutters

Dark vertical streaks running down your siding from the gutter line indicate that water is regularly overflowing and running down the exterior wall. In Bethesda colonials and Rockville brick fronts, this often appears as a brown or green stain below the roofline.

**What it leads to**: Repeated moisture exposure on siding causes paint failure, wood rot on wood siding, and staining on masonry that requires professional cleaning to remove. More critically, if water is getting behind the siding, it's reaching the sheathing and framing.

## Sign 5: Mosquito activity near the roofline

In summer, if you notice unusual mosquito activity around the upper portion of your house, check the gutters. Standing water in blocked gutters is a productive mosquito breeding environment — a small amount of stagnant water in a clogged section can generate significant populations.

**What it leads to**: Beyond the nuisance factor, this is the most visible sign that water has been sitting in your gutters long enough to be still. That same water is degrading your gutter seals, increasing rust risk in metal gutters, and contributing to the fascia moisture issues described above.

## How to check your gutters without a ladder

You don't need to get on the roof to assess your gutters:

- **After a rain**: Watch the downspouts. If water isn't flowing out within a minute or two of rain starting, a blockage is likely somewhere upstream.
- **From ground level**: Look for any green growth, visible debris overhang, or sagging in the gutter line.
- **Check the downspout outlets**: If there are ground-level cleanout caps, remove and inspect. Compacted debris at the outlet is a common blockage point.

If you see any of the five signs above, schedule a cleaning. Lintel serves all of Montgomery County — Bethesda, Rockville, Chevy Chase, Potomac, Silver Spring, Gaithersburg, and Germantown. Starts at $89.
    `,
  },
  {
    slug: 'window-cleaning-bethesda-md',
    title: 'Window Cleaning in Bethesda, MD: What to Expect and What It Costs',
    excerpt: 'A guide for Bethesda and Montgomery County homeowners — what professional window cleaning includes, how it\'s priced, and why purified water makes a real difference.',
    readTime: '4 min read',
    date: 'April 25, 2026',
    category: 'Tips & Advice',
    content: `
## What professional window cleaning actually involves

If your mental model of window cleaning is someone with a squeegee and a bucket of soapy water, the professional version is meaningfully different — especially for exterior windows.

Modern professional window cleaning uses a **water-fed pole system** with purified (deionized) water. The pole extends up to 35 feet from the ground, eliminating the need for ladders on most 2-story homes. The purified water is the key: when it dries on glass, it leaves nothing behind. No minerals, no residue, no streaks. Regular tap water dries with calcium and magnesium deposits that create the "clean but still hazy" result most homeowners have experienced with DIY cleaning.

For interior windows, the process is more traditional — squeegee technique with professional-grade solution — but done by someone who's cleaned hundreds of windows and knows how to do it without leaving marks.

## Interior vs. exterior: what's the difference?

**Exterior window cleaning** focuses on the outside pane — the surface that accumulates pollen, pollution, bird droppings, and hard water deposits from rain and sprinklers. It's typically done from outside the home using the water-fed pole.

**Interior window cleaning** covers the inside pane and typically includes the window sill and frame wipe-down. It requires access inside the home.

At Lintel, these are **separate bookings** with separate pricing. You can book just exterior, just interior, or both — they're completed in one visit if you book together.

## Why Bethesda windows get dirty faster than you'd expect

A few things specific to Montgomery County:

**Pollen season**: Bethesda and the surrounding area see significant oak and maple pollen loads in April and May. Pollen is sticky and doesn't wash off in normal rain — it accumulates on glass and creates the yellowish haze visible on windows from the inside.

**Hard water**: Montgomery County's water supply has measurable mineral content. Sprinklers, rain, and condensation all leave mineral deposits on exterior glass. These build up over months into a visible haze that standard cleaning products can't fully remove.

**Tree coverage**: Shaded windows in Bethesda's leafy neighborhoods accumulate organic debris — sap, seed pods, decomposed leaf matter — in a way that south-facing or unshaded windows don't.

## How it's priced in the Bethesda and Rockville area

Professional window cleaning in Montgomery County typically runs **$100–$175** for exterior-only on a standard single-family home, and similar for interior-only. Combined interior and exterior bookings run higher.

Lintel's pricing:

| Service | Starting Price |
|---------|----------------|
| Exterior only | $119 |
| Interior only | $119 |
| Exterior + Interior | $219 |

Final pricing is shown before you confirm the booking — based on your address and home size. No surprises.

## What to do before the pro arrives

For exterior cleaning, you just need to make sure the area around the house is accessible — no lawn furniture or equipment directly against the siding.

For interior cleaning, it helps to clear items off window sills and move any furniture that blocks direct window access. You don't need to strip the room — just make sure the pro can stand comfortably in front of each window.

## How often should you clean windows in Montgomery County?

Most Bethesda homeowners clean exterior windows once or twice a year:

- **Spring (April–May)**: After pollen season ends. This is the most popular time — the difference between a pollen-coated window and a just-cleaned one is dramatic.
- **Fall (October–November)**: Before the holiday season and winter months. Interior cleaning is often added at this point.

Homes near high-traffic roads, with heavy tree coverage, or with large glass areas (floor-to-ceiling windows are common in newer Bethesda construction) often benefit from more frequent exterior cleaning.

Lintel pros are background-checked students from the Bethesda, Rockville, and Montgomery County area. Every job is covered under a $1M liability policy, and you confirm the work before payment is released.
    `,
  },
  {
    slug: 'how-our-commission-works',
    title: 'How Lintel\'s Commission Split Works',
    excerpt: 'We believe professionals should earn a fair share. Here\'s exactly how the money moves on every Lintel job — including what happens with promo codes.',
    readTime: '3 min read',
    date: 'April 8, 2026',
    category: 'For Professionals',
    content: `
## Transparency over fine print

A lot of gig platforms bury their fee structures. We'd rather just tell you exactly how it works.

## The standard split

On every completed job, Lintel takes **60%** of the job fee and the worker takes **40%**.

**Example**: A $149 pressure washing job → worker earns **$59.60**.

That 60% covers platform operations, payment processing, insurance, customer support, marketing that fills your calendar, and background check costs. The 40% is a real, immediate transfer to the worker's connected bank account via Stripe — typically within 1–2 business days.

## Why 40%?

Traditional staffing agencies take 40–50% of what a client pays, and the worker sees less. Job boards charge subscription fees. Lintel charges nothing upfront — you pay only when you earn.

More importantly, Lintel handles everything you'd otherwise spend time and money on: customer acquisition, payment processing, dispute resolution, and scheduling infrastructure. The 40% is what you take home after all of that is handled for you.

## What changes with a promo code

When a customer uses a **referral or promo code**, the split adjusts to account for the person whose code it was:

| Party | Standard | With Promo Code |
|-------|----------|-----------------|
| Lintel platform | 60% | 55% |
| Service worker (you) | 40% | 40% |
| Promo code earner | — | 5% |

The **service worker always keeps 40%** — that never changes. The promo adjustment comes out of Lintel's share, not yours.

## Tips are 100% yours

After a job is confirmed, customers can optionally add a tip. Every dollar of every tip goes directly to you. Lintel takes nothing from tips.

## Stripe Connect onboarding

Payouts are processed through Stripe Connect. Before you can receive transfers, you'll need to complete a one-time Stripe onboarding (identity verification and bank account details). This is required by payment regulations — it's not a Lintel policy — and it takes about 5 minutes.

Once onboarded, your earnings transfer automatically after each job is confirmed.

## Questions?

If you have questions about your earnings or a specific payout, contact support through the app. We're transparent about every transaction and can provide a full breakdown for any job.
    `,
  },
];

export default function Blog() {
  return (
    <div className="min-h-screen bg-white pb-20">
      <Helmet>
        <title>Home Service Tips &amp; Guides | Lintel Blog</title>
        <meta name="description" content="Tips, guides, and honest advice for Bethesda and Rockville homeowners. Learn about gutter cleaning, pressure washing, window cleaning costs, and more." />
      </Helmet>

      {/* Nav */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <img src={logo} alt="lintel" className="h-8 w-8 rounded-full object-cover" />
            <span className="text-white text-xl font-black tracking-tight">lintel</span>
          </Link>
          <nav className="hidden md:flex items-center">
            <Link to="/#services"     className="px-4 h-10 flex items-center text-white/70 hover:text-white text-sm font-medium transition-colors">Services</Link>
            <Link to="/#how-it-works" className="px-4 h-10 flex items-center text-white/70 hover:text-white text-sm font-medium transition-colors">How it works</Link>
            <Link to="/worker/register" className="px-4 h-10 flex items-center text-white/70 hover:text-white text-sm font-medium transition-colors">Earn with us</Link>
            <Link to="/blog" className="px-4 h-10 flex items-center text-white text-sm font-medium transition-colors border-b-2 border-white">Blog</Link>
          </nav>
          <div className="flex items-center gap-2">
            <Link to="/login" className="px-4 h-9 flex items-center text-white text-sm font-semibold rounded-full hover:bg-white/10 transition-colors">Log in</Link>
            <Link to="/login" className="px-4 h-9 flex items-center bg-white text-black text-sm font-semibold rounded-full hover:bg-white/90 transition-colors">Sign up</Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <div className="pt-16 bg-black">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <p className="text-uber-gray-400 text-xs font-bold uppercase tracking-widest mb-3">Lintel Blog</p>
          <h1 className="text-5xl font-black text-white leading-tight">
            Tips, guides, and<br />honest advice.
          </h1>
          <p className="text-uber-gray-400 text-lg mt-4 max-w-lg">
            Everything you need to know about home services — from how to book to whether it's worth buying your own equipment.
          </p>
        </div>
      </div>

      {/* Posts grid */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {BLOG_POSTS.map((post) => (
            <Link
              key={post.slug}
              to={`/blog/${post.slug}`}
              className="group bg-uber-gray-50 rounded-3xl p-8 flex flex-col justify-between hover:bg-uber-gray-100 transition-colors"
            >
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-3 h-7 flex items-center bg-black text-white text-xs font-bold rounded-full">
                    {post.category}
                  </span>
                  <span className="flex items-center gap-1.5 text-uber-gray-500 text-xs">
                    <Clock className="w-3.5 h-3.5" />
                    {post.readTime}
                  </span>
                </div>
                <h2 className="text-xl font-black text-black leading-tight mb-3 group-hover:underline underline-offset-2">
                  {post.title}
                </h2>
                <p className="text-uber-gray-500 text-sm leading-relaxed">
                  {post.excerpt}
                </p>
              </div>
              <div className="flex items-center justify-between mt-8">
                <span className="text-uber-gray-400 text-xs">{post.date}</span>
                <span className="flex items-center gap-1.5 text-black text-sm font-semibold">
                  Read more <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

    </div>
  );
}
