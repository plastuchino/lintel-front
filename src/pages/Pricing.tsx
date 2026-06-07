import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import logo from '../assets/logo.jpeg';

// Rates kept in sync with backend/src/services/quote.ts
const MEASURED_SERVICES = [
  {
    name: 'Gutter Cleaning',
    basis: 'Linear footage of your gutters',
    rate: '$1.50 / linear ft',
    range: '$80 – $350',
    note: 'Most homes fall between 100–200 linear ft of guttering.',
  },
  {
    name: 'Pressure Washing',
    basis: 'Square footage of driveway + patio',
    rate: '$0.20 / sq ft',
    range: '$149 – $750',
    note: 'Standard quote covers driveway and patio combined. Want only the driveway? See customization below.',
  },
  {
    name: 'Window Cleaning (exterior)',
    basis: 'Count and size of your windows',
    rate: 'From $250',
    range: null,
    note: 'Priced from satellite window analysis — larger homes with more windows cost more.',
  },
  {
    name: 'Window Cleaning (interior)',
    basis: 'Same as exterior',
    rate: 'From $175',
    range: null,
    note: 'Interior is priced at roughly 55% of your exterior quote. Book both together for convenience.',
  },
];

const FLAT_RATE_SERVICES = [
  { name: 'Lawn Mowing', price: '$89', duration: '1–2 hours' },
  { name: 'House Cleaning (standard)', price: '$129', duration: '2–3 hours' },
  { name: 'Deep Clean', price: '$229', duration: '4–6 hours' },
];

const CUSTOMIZE_EXAMPLES = [
  'Only want the driveway cleaned, not the patio',
  'Just the front gutters, not the back',
  'Exterior windows on the ground floor only',
  'Add siding to your pressure washing job',
];

export default function Pricing() {
  return (
    <>
      <Helmet>
        <title>How We Price — Lintel</title>
        <meta name="description" content="Lintel prices are calculated from real property measurements, not generic estimates. See exactly how we price each service — per square foot, per linear foot, or flat rate." />
      </Helmet>

      {/* Nav */}
      <div className="sticky top-0 z-10 bg-white border-b border-black/8 flex items-center px-6 h-14 gap-4">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="Lintel" className="h-6 w-6 rounded-full object-cover" />
          <span className="text-sm font-bold tracking-[0.15em] uppercase text-black">LINTEL</span>
        </Link>
      </div>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 pt-16 pb-12 border-b border-black/10">
        <p className="text-[10px] font-mono text-black/35 tracking-[0.2em] uppercase mb-3">Pricing</p>
        <h1 className="text-4xl md:text-5xl font-black text-black tracking-tight uppercase leading-tight mb-5">
          Prices built for<br />your home, not a guess.
        </h1>
        <p className="text-base text-black/55 leading-relaxed max-w-2xl">
          When you enter your address, we look up your property — measuring your gutters, driveway, patio, and windows from satellite and GIS data. Your price reflects your actual home, not an average.
        </p>
      </section>

      {/* How it works */}
      <section className="max-w-4xl mx-auto px-6 py-12 border-b border-black/10">
        <p className="text-[10px] font-mono text-black/35 tracking-[0.2em] uppercase mb-6">How Instant Pricing Works</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-black/10">
          {[
            { step: '01', title: 'Enter your address', desc: 'We use your address to retrieve your property data — lot size, gutter length, paved surfaces, and window count.' },
            { step: '02', title: 'We measure your property', desc: 'Our system calculates the specific dimensions of your home using satellite imagery and GIS data. No estimating.' },
            { step: '03', title: 'You see your real price', desc: 'The price shown is calculated for your property — not a neighborhood average. No phone call, no haggling.' },
          ].map(({ step, title, desc }) => (
            <div key={step} className="bg-white p-6">
              <p className="text-[10px] font-mono text-black/25 tracking-[0.2em] mb-3">{step}</p>
              <p className="text-sm font-bold text-black mb-2">{title}</p>
              <p className="text-xs text-black/45 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Measured services */}
      <section className="max-w-4xl mx-auto px-6 py-12 border-b border-black/10">
        <p className="text-[10px] font-mono text-black/35 tracking-[0.2em] uppercase mb-2">Property-Measured Services</p>
        <p className="text-xs text-black/40 mb-8">Priced per square foot or linear foot based on your actual property dimensions.</p>

        <div className="space-y-4">
          {MEASURED_SERVICES.map((svc) => (
            <div key={svc.name} className="border border-black/10 p-5">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 mb-3">
                <div>
                  <p className="text-sm font-bold text-black mb-0.5">{svc.name}</p>
                  <p className="text-xs text-black/45">{svc.basis}</p>
                </div>
                <div className="md:text-right flex-shrink-0">
                  <p className="text-base font-black text-black">{svc.rate}</p>
                  {svc.range && (
                    <p className="text-[11px] text-black/40 font-mono">{svc.range}</p>
                  )}
                </div>
              </div>
              <p className="text-xs text-black/40 leading-relaxed border-t border-black/8 pt-3">{svc.note}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Flat rate services */}
      <section className="max-w-4xl mx-auto px-6 py-12 border-b border-black/10">
        <p className="text-[10px] font-mono text-black/35 tracking-[0.2em] uppercase mb-2">Flat-Rate Services</p>
        <p className="text-xs text-black/40 mb-8">Same price for every home — no measuring needed.</p>

        <div className="border border-black/10 overflow-hidden">
          <div className="grid grid-cols-3 bg-black text-white">
            <div className="px-5 py-3 text-[11px] font-bold tracking-[0.1em] uppercase">Service</div>
            <div className="px-5 py-3 text-[11px] font-bold tracking-[0.1em] uppercase">Price</div>
            <div className="px-5 py-3 text-[11px] font-bold tracking-[0.1em] uppercase">Typical Time</div>
          </div>
          {FLAT_RATE_SERVICES.map((svc, i) => (
            <div key={svc.name} className={`grid grid-cols-3 border-t border-black/10 ${i % 2 === 1 ? 'bg-black/[0.02]' : ''}`}>
              <div className="px-5 py-3 text-sm text-black">{svc.name}</div>
              <div className="px-5 py-3 text-sm font-bold text-black">{svc.price}</div>
              <div className="px-5 py-3 text-sm text-black/60">{svc.duration}</div>
            </div>
          ))}
        </div>
        <p className="text-xs text-black/35 mt-3 font-mono">Final price is confirmed before you complete booking. No surprises.</p>
      </section>

      {/* Customization */}
      <section className="max-w-4xl mx-auto px-6 py-12 border-b border-black/10">
        <p className="text-[10px] font-mono text-black/35 tracking-[0.2em] uppercase mb-2">Need Something Custom?</p>
        <h2 className="text-xl font-black uppercase text-black mb-4">Only want part of the job done?</h2>
        <p className="text-sm text-black/55 leading-relaxed mb-6 max-w-2xl">
          Our instant quote covers the full standard scope for each service. But if you need a different scope — fewer surfaces, specific areas only, or an add-on — just reach out before booking and we'll adjust your price.
        </p>

        <div className="bg-black/[0.03] border border-black/8 p-5 mb-6">
          <p className="text-xs font-bold text-black/60 uppercase tracking-widest mb-3 font-mono">Common customizations</p>
          <ul className="space-y-2">
            {CUSTOMIZE_EXAMPLES.map((ex) => (
              <li key={ex} className="flex items-start gap-2.5">
                <div className="w-1.5 h-1.5 bg-[#008060] rounded-full mt-1.5 flex-shrink-0" />
                <p className="text-sm text-black/65">{ex}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center gap-4">
          <a
            href="tel:+13012727224"
            className="inline-flex items-center gap-2 px-5 h-11 bg-black text-white text-sm font-bold rounded-xl hover:bg-black/80 transition-colors"
          >
            Call or text (301) 272-7224
          </a>
          <span className="text-xs text-black/35">We typically respond within minutes.</span>
        </div>
      </section>

      {/* CTA — matches blog post CTA */}
      <section className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-black rounded-3xl p-8">
          <p className="text-white text-2xl font-black mb-2">Ready to book?</p>
          <p className="text-white/50 text-sm mb-6">Enter your address and get started in under 2 minutes.</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 h-11 bg-white text-black text-sm font-bold rounded-xl hover:bg-white/90 transition-colors"
          >
            See prices in my area
          </Link>
        </div>
      </section>
    </>
  );
}
