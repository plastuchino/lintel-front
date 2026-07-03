import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Phone, MapPin } from 'lucide-react';
import logo from '../assets/logo.jpeg';
import { CommercialQuoteCTA } from '../components/CommercialQuoteCTA';
import { TrustedByCarousel } from '../components/TrustedByCarousel';
import { COMMERCIAL_CLIENTS } from '../data/commercialClients';
import { useGeoHeadline } from '../hooks/useGeoHeadline';
import pressure_image from '../assets/site_asset_pressure_washing.png';

const WHAT_WE_DO = [
  ['Shopping cart corral washing', 'One of our most common commercial requests — corrals accumulate grease, gum, and grime fast in high-traffic lots.'],
  ['Parking lots & sidewalks', 'Full lot and walkway pressure washing, sectioned and sequenced to keep parts of the lot usable during the job.'],
  ['Loading docks & dumpster pads', 'Grease, oil, and grime removal from high-use service areas.'],
  ['Storefront entrances', 'Entryway concrete and pavement kept clean for customer-facing appearance.'],
];

const FAQ_ITEMS = [
  {
    q: 'How does payment work for commercial jobs?',
    a: "You're not charged upfront. We complete the work, you or your site manager inspects it, and payment is only processed once the job is confirmed done to your standard. For recurring contracts, we'll set up standard net-terms invoicing after the first job — no card required to get a quote.",
  },
  {
    q: 'Do you work with general contractors or as a subcontractor?',
    a: "Yes — subcontracting is something we actively want. If you're a GC, property management company, or facilities vendor looking to bring us on as a sub for gutter/window/pressure work across one or multiple properties, we're set up for it: certificate of insurance on request, standard subcontractor agreements, and crews that can work under your site rules and scheduling. Reach out through the quote form below and mention subcontracting in the description field, or call us directly.",
  },
  {
    q: 'Do you clean shopping cart corrals?',
    a: 'Yes — cart corral washing is one of our most common commercial requests. Corrals accumulate grease, gum, and grime fast in high-traffic lots, and we handle that alongside general lot and sidewalk pressure washing.',
  },
  {
    q: 'What surfaces do you pressure wash commercially?',
    a: 'Parking lots, sidewalks, loading docks, dumpster pads, storefront entrances, and cart corrals. If it\'s outdoor concrete or pavement on your property, ask and we\'ll confirm scope.',
  },
  {
    q: 'Can you pressure wash without disrupting parking or customer access?',
    a: 'Yes — we section off and sequence the work so parts of the lot stay usable, and we can schedule around peak hours or overnight if needed.',
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

export default function CommercialPressureWashing() {
  const heroRef = useRef<HTMLElement>(null);
  const { cityName, stateAbbr, geoResolved, requestLocation } = useGeoHeadline();
  const h1Location = cityName ? `in ${cityName}, ${stateAbbr}` : 'Near You';

  return (
    <div className="min-h-screen bg-white text-black pb-16 lg:pb-0" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      <Helmet>
        <title>Commercial Pressure Washing in Montgomery County, MD | Lintel</title>
        <meta name="description" content="Commercial pressure washing for parking lots, sidewalks, loading docks, and cart corrals in Montgomery County, MD. Fully insured, recurring contracts available." />
        <link rel="canonical" href="https://uselintel.pro/commercial/pressure-washing" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Commercial Pressure Washing in Montgomery County, MD | Lintel" />
        <meta property="og:description" content="Commercial pressure washing for parking lots, sidewalks, loading docks, and cart corrals. Fully insured, recurring contracts available." />
        <meta property="og:url" content="https://uselintel.pro/commercial/pressure-washing" />
      </Helmet>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: 'Commercial Pressure Washing',
        description: 'Commercial pressure washing for parking lots, sidewalks, loading docks, dumpster pads, and shopping cart corrals.',
        url: 'https://uselintel.pro/commercial/pressure-washing',
        provider: { '@type': 'LocalBusiness', name: 'Lintel', url: 'https://uselintel.pro' },
        areaServed: ['Bethesda, MD', 'Rockville, MD', 'Montgomery County, MD', 'Chevy Chase, MD', 'Potomac, MD', 'Silver Spring, MD', 'Gaithersburg, MD', 'Germantown, MD'],
      }) }} />

      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-black/10">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <img src={logo} alt="lintel" className="h-7 w-7 rounded-full object-cover" />
            <span className="text-black text-sm font-bold tracking-[0.15em] uppercase">LINTEL</span>
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            <Link to="/commercial/gutter-cleaning" className="px-4 h-9 flex items-center text-black/50 hover:text-black text-[11px] font-semibold tracking-[0.12em] uppercase transition-colors">Gutters</Link>
            <Link to="/commercial/pressure-washing" className="px-4 h-9 flex items-center text-black text-[11px] font-semibold tracking-[0.12em] uppercase border-b-2 border-black">Pressure Washing</Link>
            <Link to="/commercial/window-cleaning" className="px-4 h-9 flex items-center text-black/50 hover:text-black text-[11px] font-semibold tracking-[0.12em] uppercase transition-colors">Windows</Link>
            <Link to="/services/pressure-washing" className="px-4 h-9 flex items-center text-black/50 hover:text-black text-[11px] font-semibold tracking-[0.12em] uppercase transition-colors">Residential</Link>
          </nav>
          <div className="flex items-center gap-3">
            <a href="tel:12403660377" className="hidden md:flex items-center gap-1.5 text-black/60 hover:text-black text-[11px] font-semibold tracking-[0.08em] transition-colors">
              <Phone className="w-3.5 h-3.5" />(240) 366-0377
            </a>
            <a href="tel:12403660377" className="md:hidden flex items-center text-black/60 hover:text-black transition-colors">
              <Phone className="w-4 h-4" />
            </a>
          </div>
        </div>
      </header>

      <section ref={heroRef} className="pt-14 bg-[#0d0d0d] min-h-[60vh] flex flex-col relative overflow-hidden">
        <img src={pressure_image} className="absolute inset-0 w-full h-full object-cover object-center opacity-50" alt="" />
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative z-10 flex-1 w-full max-w-6xl mx-auto px-6 py-12 flex flex-col lg:flex-row lg:items-center lg:gap-16">
          <div className="flex-1 mb-8 lg:mb-0">
            <span className="inline-block bg-[#008060] text-white text-[10px] font-bold tracking-[0.2em] uppercase px-3 py-1 mb-5">Commercial</span>
            <h1 className="text-4xl lg:text-5xl font-black text-white leading-tight uppercase mb-4 max-w-xl">
              Commercial Pressure Washing<br />for Businesses {h1Location}
            </h1>
            {!geoResolved && (
              <button
                onClick={requestLocation}
                className="inline-flex items-center gap-1.5 text-white/60 hover:text-white text-[11px] font-semibold transition-colors mb-4"
              >
                <MapPin className="w-3.5 h-3.5" />📍 Show my location
              </button>
            )}
            <p className="text-white/60 text-sm leading-relaxed max-w-sm">
              Parking lots, sidewalks, loading docks, and cart corrals. Recurring contracts available. Payment collected only after the job is confirmed done.
            </p>
          </div>
          <div className="w-full lg:w-[380px] lg:flex-shrink-0">
            <CommercialQuoteCTA serviceType="pressure-washing" />
          </div>
        </div>
      </section>

      <TrustedByCarousel clients={COMMERCIAL_CLIENTS} />

      <div className="max-w-7xl mx-auto">
        <div className="lg:grid lg:grid-cols-[1fr_380px] lg:items-start">
          <div>
            <section className="px-6 py-14 border-b border-black/10">
              <p className="text-[10px] font-mono text-black/35 tracking-[0.2em] uppercase mb-2">Scope</p>
              <h2 className="text-xl font-black uppercase mb-8">What We Do</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {WHAT_WE_DO.map(([title, desc]) => (
                  <div key={title} className="flex gap-3">
                    <div className="w-1.5 h-1.5 bg-[#008060] rounded-full mt-2 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-bold text-black">{title}</p>
                      <p className="text-xs text-black/50 leading-relaxed mt-1">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section id="faq" className="px-6 py-14 border-b border-black/10">
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

            <section className="px-6 py-14 border-b border-black/10">
              <h2 className="text-xl font-black uppercase mb-6">Related</h2>
              <div className="grid md:grid-cols-3 gap-4">
                <Link to="/commercial/gutter-cleaning" className="border border-black/10 p-5 hover:border-black/30 transition-colors">
                  <p className="text-[10px] font-mono text-black/40 uppercase tracking-widest mb-1">Commercial Service</p>
                  <p className="text-sm font-bold text-black">Gutter Cleaning</p>
                  <p className="text-xs text-black/50 mt-1">Multi-building and storefront gutter runs.</p>
                </Link>
                <Link to="/commercial/window-cleaning" className="border border-black/10 p-5 hover:border-black/30 transition-colors">
                  <p className="text-[10px] font-mono text-black/40 uppercase tracking-widest mb-1">Commercial Service</p>
                  <p className="text-sm font-bold text-black">Window Cleaning</p>
                  <p className="text-xs text-black/50 mt-1">Storefront and office glass.</p>
                </Link>
                <Link to="/commercial" className="border border-black/10 p-5 hover:border-black/30 transition-colors">
                  <p className="text-[10px] font-mono text-black/40 uppercase tracking-widest mb-1">Overview</p>
                  <p className="text-sm font-bold text-black">All Commercial Services</p>
                  <p className="text-xs text-black/50 mt-1">See everything we offer for businesses.</p>
                </Link>
              </div>
            </section>
          </div>

          <div className="hidden lg:block border-l border-black/10">
            <div className="sticky top-14 px-8 py-10">
              <CommercialQuoteCTA serviceType="pressure-washing" className="w-full" />
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden flex border-t border-black/10 bg-white">
        <button
          onClick={() => heroRef.current?.scrollIntoView({ behavior: 'smooth' })}
          className="flex-1 bg-[#008060] text-white font-black text-[11px] tracking-[0.15em] uppercase py-4 hover:bg-[#006b50] transition-colors"
        >
          REQUEST A QUOTE
        </button>
        <a
          href="tel:12403660377"
          className="flex-1 bg-black text-white font-black text-[11px] tracking-[0.15em] uppercase py-4 flex items-center justify-center gap-2 hover:bg-black/80 transition-colors"
        >
          <Phone className="w-3.5 h-3.5" /> CALL NOW
        </a>
      </div>
    </div>
  );
}
