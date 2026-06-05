import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import logo from '../assets/logo.jpeg';
import { ServiceQuoteCTA } from '../components/ServiceQuoteCTA';

const FAQ_ITEMS = [
  {
    q: 'What surfaces do you pressure wash?',
    a: 'We clean driveways (concrete and asphalt), patios and decks (stone, pavers, and wood), siding (vinyl, brick, and fiber cement), and sidewalks and walkways. If you\'re unsure whether a specific surface is included, reach out before booking.',
  },
  {
    q: 'Will pressure washing damage my driveway or deck?',
    a: 'Our pros use commercial-grade equipment with the correct nozzle and PSI settings for each surface type. Soft surfaces like wood decking are cleaned at lower pressure with appropriate detergents — not blasted at driveway settings. We\'ve cleaned hundreds of driveways, patios, and decks across Montgomery County without surface damage.',
  },
  {
    q: 'How long does pressure washing take?',
    a: 'A standard driveway takes 60–90 minutes. A patio or deck of similar size is similar. Combining multiple surfaces in one booking increases time but often reduces overall cost. Your pro will confirm timing when they arrive.',
  },
  {
    q: 'Do I need to be home during the service?',
    a: 'You don\'t need to be present during the work, but you do need to be available to confirm the job when the pro marks it complete — that\'s when your confirmation code is generated and payment is released. Many customers step outside at the end for a quick walkthrough.',
  },
  {
    q: 'When is the best time to pressure wash in Maryland?',
    a: 'Late spring and early fall are ideal in Montgomery County. Spring clears winter grime and prepares outdoor surfaces for the season. Fall removes organic debris — leaves, mold, and algae — before winter sets in. Avoid pressure washing when temps are below 40°F, as water can freeze in cracks and cause damage.',
  },
  {
    q: 'Is Lintel insured for pressure washing?',
    a: 'Yes. Every Lintel job is covered under our $1M general liability policy. If something gets damaged during the service, we handle it — no back-and-forth, no out-of-pocket cost to you.',
  },
];

const FAQ_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ_ITEMS.map(({ q, a }) => ({
    '@type': 'Question',
    name: q,
    acceptedAnswer: { '@type': 'Answer', text: a },
  })),
};

export default function ServicePressureWashing() {
  return (
    <div className="min-h-screen bg-white text-black" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      <Helmet>
        <title>Pressure Washing in Montgomery County, MD | Lintel</title>
        <meta name="description" content="Professional pressure washing in Montgomery County, MD. Driveways, patios, decks, siding, and sidewalks. Fully insured, starting at $200. Book online." />
        <meta name="keywords" content="pressure washing montgomery county md, pressure washing bethesda, driveway pressure washing rockville md, patio pressure washing maryland, pressure washing service near me, power washing bethesda md" />
        <link rel="canonical" href="https://uselintel.pro/services/pressure-washing" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Pressure Washing in Montgomery County, MD | Lintel" />
        <meta property="og:description" content="Professional pressure washing in Montgomery County, MD. Driveways, patios, decks, siding, and sidewalks. Fully insured. Book online." />
        <meta property="og:url" content="https://uselintel.pro/services/pressure-washing" />
        <meta property="og:image" content="https://uselintel.pro/og-image.png" />
        <meta property="og:site_name" content="Lintel" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Pressure Washing in Montgomery County, MD | Lintel" />
        <meta name="twitter:description" content="Professional pressure washing in Montgomery County, MD. Driveways, patios, decks, and siding. Fully insured. Book online." />
        <meta name="twitter:image" content="https://uselintel.pro/og-image.png" />
      </Helmet>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: 'Pressure Washing',
        description: 'Professional pressure washing for driveways, patios, decks, siding, and sidewalks using commercial-grade equipment with surface-appropriate PSI settings.',
        url: 'https://uselintel.pro/services/pressure-washing',
        provider: { '@type': 'LocalBusiness', name: 'Lintel', url: 'https://uselintel.pro' },
        areaServed: ['Bethesda, MD', 'Rockville, MD', 'Montgomery County, MD', 'Chevy Chase, MD', 'Potomac, MD', 'Silver Spring, MD', 'Gaithersburg, MD', 'Germantown, MD'],
        offers: { '@type': 'Offer', price: '149', priceCurrency: 'USD', description: 'Starting price for standard driveway' },
      }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://uselintel.pro/' },
          { '@type': 'ListItem', position: 2, name: 'Services', item: 'https://uselintel.pro/#services' },
          { '@type': 'ListItem', position: 3, name: 'Pressure Washing', item: 'https://uselintel.pro/services/pressure-washing' },
        ],
      }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        speakable: { '@type': 'SpeakableSpecification', cssSelector: '#faq' },
        url: 'https://uselintel.pro/services/pressure-washing',
      }) }} />

      {/* Nav */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-black/10">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <img src={logo} alt="lintel" className="h-7 w-7 rounded-full object-cover" />
            <span className="text-black text-sm font-bold tracking-[0.15em] uppercase">LINTEL</span>
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            <Link to="/services/gutter-cleaning"  className="px-4 h-9 flex items-center text-black/50 hover:text-black text-[11px] font-semibold tracking-[0.12em] uppercase transition-colors">Gutters</Link>
            <Link to="/services/pressure-washing" className="px-4 h-9 flex items-center text-black text-[11px] font-semibold tracking-[0.12em] uppercase border-b-2 border-black">Pressure Washing</Link>
            <Link to="/services/window-cleaning"  className="px-4 h-9 flex items-center text-black/50 hover:text-black text-[11px] font-semibold tracking-[0.12em] uppercase transition-colors">Windows</Link>
            <Link to="/blog" className="px-4 h-9 flex items-center text-black/50 hover:text-black text-[11px] font-semibold tracking-[0.12em] uppercase transition-colors">Blog</Link>
          </nav>
          <Link to="/login" className="px-4 h-8 flex items-center bg-black text-white text-[11px] font-semibold tracking-[0.1em] uppercase hover:bg-black/80 transition-colors">
            BOOK NOW
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-14 bg-[#0d0d0d] min-h-screen flex flex-col">
        <div className="flex-1 w-full max-w-6xl mx-auto px-6 flex flex-col lg:flex-row lg:items-center gap-10 lg:gap-16 py-12 lg:py-0">
          <div className="lg:flex-shrink-0 lg:max-w-xs">
            <p className="text-[10px] font-mono text-white/35 tracking-[0.2em] uppercase mb-4">Pressure Washing · Montgomery County, MD</p>
            <h1 className="text-4xl lg:text-5xl font-black text-white leading-tight uppercase mb-8">
              Pressure Washing in<br />Montgomery County, MD
            </h1>

          </div>
          <div className="flex-1 flex items-center justify-center lg:justify-end">
            <ServiceQuoteCTA serviceType="pressure-washing" className="w-full max-w-[520px]" />
          </div>
        </div>
      </section>

      {/* Body copy */}
      <section className="max-w-4xl mx-auto px-6 py-14 border-b border-black/10">
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-xl font-black uppercase mb-4">Why Maryland Surfaces Need Regular Cleaning</h2>
            <p className="text-sm text-black/60 leading-relaxed mb-4">
              Montgomery County's humid mid-Atlantic climate creates ideal conditions for algae, mold, and mildew to grow on outdoor surfaces. Concrete driveways, stone patios, and wood decks across Montgomery County develop black streaking and green slick patches over the course of a season — not just an eyesore, but genuinely slippery and damaging to surfaces over time.
            </p>
            <p className="text-sm text-black/60 leading-relaxed mb-4">
              Siding is equally affected. Vinyl and fiber cement siding on Montgomery County homes accumulates a grey film of atmospheric dirt and biological growth that no garden hose can remove. A professional pressure wash strips it completely and restores curb appeal before a sale, a party, or just because you're tired of looking at it.
            </p>
            <p className="text-sm text-black/60 leading-relaxed">
              We serve all of Montgomery County: Bethesda, Rockville, Chevy Chase, Potomac, Silver Spring, Gaithersburg, Germantown, and North Bethesda.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-black uppercase mb-4">What We Clean</h2>
            <div className="space-y-3">
              {[
                ['Driveways', 'Concrete and asphalt. Remove oil stains, tire marks, and biological growth.'],
                ['Patios & Decks', 'Stone, pavers, brick, and wood. Restore surface texture and color.'],
                ['Siding', 'Vinyl, brick, and fiber cement. Remove mold, mildew, and atmospheric grime.'],
                ['Sidewalks & Walkways', 'Front walks, steps, and paths. Safe, non-slip finish.'],
                ['Commercial-grade equipment', 'Not a consumer machine — the right PSI and nozzle for each surface.'],
                ['Fully insured', '$1M general liability on every job.'],
              ].map(([title, desc]) => (
                <div key={title} className="flex gap-3">
                  <div className="w-1.5 h-1.5 bg-[#008060] rounded-full mt-1.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-bold text-black">{title}</p>
                    <p className="text-xs text-black/50 leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="max-w-4xl mx-auto px-6 py-14 border-b border-black/10">
        <h2 className="text-xl font-black uppercase mb-6">Pricing</h2>
        <div className="border border-black/10 overflow-hidden">
          <div className="grid grid-cols-3 bg-black text-white">
            <div className="px-5 py-3 text-[11px] font-bold tracking-[0.1em] uppercase">Surface</div>
            <div className="px-5 py-3 text-[11px] font-bold tracking-[0.1em] uppercase">Starting Price</div>
            <div className="px-5 py-3 text-[11px] font-bold tracking-[0.1em] uppercase">Typical Time</div>
          </div>
          {[
            ['Driveway (standard)', '$200', '60–90 min'],
            ['Patio or Deck', '$200', '60–90 min'],
            ['Siding (per side)', '$99', '45–60 min'],
            ['Multiple surfaces', 'Bundled pricing', '2–3 hrs'],
          ].map(([surface, price, time], i) => (
            <div key={surface} className={`grid grid-cols-3 border-t border-black/10 ${i % 2 === 1 ? 'bg-black/[0.02]' : ''}`}>
              <div className="px-5 py-3 text-sm text-black">{surface}</div>
              <div className="px-5 py-3 text-sm font-bold text-black">{price}</div>
              <div className="px-5 py-3 text-sm text-black/60">{time}</div>
            </div>
          ))}
        </div>
        <p className="text-xs text-black/40 mt-3 font-mono">Final price shown before you confirm booking. No surprises.</p>
      </section>

      {/* Who does the work */}
      <section className="max-w-4xl mx-auto px-6 py-14 border-b border-black/10">
        <h2 className="text-xl font-black uppercase mb-4">Local Students. Professional Results.</h2>
        <p className="text-sm text-black/60 leading-relaxed max-w-xl mb-4">
          Lintel pros are background-checked students from the Montgomery County area. They operate Lintel-owned commercial equipment and follow service protocols we've developed across hundreds of jobs. You get professional results without the overhead of a large service company.
        </p>
        <p className="text-sm text-black/60 leading-relaxed max-w-xl">
          Every pro carries a 4.5★ minimum rating to stay active on the platform. The network average is 4.9★. After your job, you'll rate the experience — that feedback directly shapes who gets future bookings.
        </p>
      </section>

      {/* FAQ */}
      <section id="faq" className="max-w-4xl mx-auto px-6 py-14 border-b border-black/10">
        <h2 className="text-xl font-black uppercase mb-8">Frequently Asked Questions</h2>
        <div className="space-y-0 divide-y divide-black/10 border-y border-black/10">
          {FAQ_ITEMS.map(({ q, a }) => (
            <div key={q} className="py-5">
              <p className="text-sm font-bold text-black mb-2">{q}</p>
              <p className="text-sm text-black/55 leading-relaxed">{a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Related */}
      <section className="max-w-4xl mx-auto px-6 py-14 border-b border-black/10">
        <h2 className="text-xl font-black uppercase mb-6">Related</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <Link to="/services/gutter-cleaning" className="border border-black/10 p-5 hover:border-black/30 transition-colors">
            <p className="text-[10px] font-mono text-black/40 uppercase tracking-widest mb-1">Service</p>
            <p className="text-sm font-bold text-black">Gutter Cleaning</p>
            <p className="text-xs text-black/50 mt-1">Ground-level vacuum cleaning. From $149.</p>
          </Link>
          <Link to="/services/window-cleaning" className="border border-black/10 p-5 hover:border-black/30 transition-colors">
            <p className="text-[10px] font-mono text-black/40 uppercase tracking-widest mb-1">Service</p>
            <p className="text-sm font-bold text-black">Window Cleaning</p>
            <p className="text-xs text-black/50 mt-1">Streak-free interior or exterior. From $250.</p>
          </Link>
          <Link to="/blog/pressure-washing-driveway-maryland" className="border border-black/10 p-5 hover:border-black/30 transition-colors">
            <p className="text-[10px] font-mono text-black/40 uppercase tracking-widest mb-1">Blog</p>
            <p className="text-sm font-bold text-black">Pressure Washing Your Driveway in Maryland</p>
            <p className="text-xs text-black/50 mt-1">What to know before you book.</p>
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#0d0d0d]">
        <div className="max-w-6xl mx-auto px-6 py-16 flex flex-col lg:flex-row lg:items-center gap-10 lg:gap-16">
          <div className="lg:flex-shrink-0 lg:max-w-xs">
            <p className="text-[10px] font-mono text-white/35 tracking-[0.2em] uppercase mb-3">Ready to book?</p>
            <h2 className="text-3xl font-black text-white uppercase mb-8">Commercial Equipment.<br />Local Pros.<br />Guaranteed Results.</h2>

          </div>
          <div className="flex-1 flex items-center justify-center lg:justify-end">
            <ServiceQuoteCTA serviceType="pressure-washing" className="w-full max-w-[520px]" />
          </div>
        </div>
      </section>

    </div>
  );
}
