import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import logo from '../assets/logo.jpeg';
import { ServiceQuoteCTA } from '../components/ServiceQuoteCTA';

const FAQ_ITEMS = [
  {
    q: 'Do you clean gutters on 2-story homes?',
    a: 'We use professional-grade ground-level vacuum and blower equipment, which means we clean gutters safely and effectively without ladder work. This approach works on most single-story homes and some ranch-style properties. If your home requires roof access or ladder work, reach out before booking and we\'ll confirm coverage.',
  },
  {
    q: 'What\'s included in a gutter cleaning?',
    a: 'We remove all debris — leaves, twigs, seed pods, and compacted buildup — from your gutters using high-powered vacuum equipment. We also flush downspouts to confirm they\'re clear and bag and remove all waste from the property. The job is complete when water flows freely.',
  },
  {
    q: 'How often should gutters be cleaned in Montgomery County?',
    a: 'Twice a year is the standard recommendation for Montgomery County homes: once in late spring (after tree pollen and seed pods fall) and once in late fall (after the leaves drop). Homes under heavy tree canopy — especially oaks and maples common throughout Montgomery County — may need a third cleaning in early fall.',
  },
  {
    q: 'How long does a gutter cleaning take?',
    a: 'Most single-family homes take 45–90 minutes. Larger properties or gutters that haven\'t been cleaned in over a year may take longer. Your pro will give you an accurate time estimate when they arrive.',
  },
  {
    q: 'What if my gutters are damaged or have guards installed?',
    a: 'We\'ll note any visible damage (cracks, sagging sections, separated joints) and flag it for your attention. We don\'t perform gutter repairs. Gutter guard systems vary — some can be cleaned over the top, others require removal. Contact us before booking if you have gutter guards.',
  },
  {
    q: 'Is Lintel insured for gutter cleaning work?',
    a: 'Yes. Every job is covered under Lintel\'s $1M general liability policy. If any damage occurs during the service, we handle the claim — no out-of-pocket cost to you.',
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

export default function ServiceGutterCleaning() {
  return (
    <div className="min-h-screen bg-white text-black" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      <Helmet>
        <title>Gutter Cleaning in Montgomery County, MD | Lintel</title>
        <meta name="description" content="Professional gutter cleaning in Montgomery County, MD. Ground-level vacuum equipment, fully insured, starting at $149. Book online in minutes." />
        <link rel="canonical" href="https://uselintel.pro/services/gutter-cleaning" />
      </Helmet>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }}
      />

      {/* Nav */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-black/10">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <img src={logo} alt="lintel" className="h-7 w-7 rounded-full object-cover" />
            <span className="text-black text-sm font-bold tracking-[0.15em] uppercase">LINTEL</span>
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            <Link to="/services/gutter-cleaning"  className="px-4 h-9 flex items-center text-black text-[11px] font-semibold tracking-[0.12em] uppercase border-b-2 border-black">Gutters</Link>
            <Link to="/services/pressure-washing" className="px-4 h-9 flex items-center text-black/50 hover:text-black text-[11px] font-semibold tracking-[0.12em] uppercase transition-colors">Pressure Washing</Link>
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
          {/* Left: headline + seals — constrained, smaller */}
          <div className="lg:flex-shrink-0 lg:max-w-xs">
            <p className="text-[10px] font-mono text-white/35 tracking-[0.2em] uppercase mb-4">Gutter Cleaning · Montgomery County, MD</p>
            <h1 className="text-4xl lg:text-5xl font-black text-white leading-tight uppercase mb-8">
              Gutter Cleaning in<br />Montgomery County, MD
            </h1>

          </div>
          {/* Right: quote card — dominant */}
          <div className="flex-1 flex items-center justify-center lg:justify-end">
            <ServiceQuoteCTA serviceType="gutter-cleaning" className="w-full max-w-[520px]" />
          </div>
        </div>
      </section>

      {/* Body copy */}
      <section className="max-w-4xl mx-auto px-6 py-14 border-b border-black/10">
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-xl font-black uppercase mb-4">Why Montgomery County Gutters Clog Fast</h2>
            <p className="text-sm text-black/60 leading-relaxed mb-4">
              Montgomery County's tree canopy is one of its best features — and the main reason gutter cleaning is a twice-a-year necessity. The oak, maple, and tulip poplar trees lining streets throughout the county drop heavy seed loads in spring and dense leaf piles in fall. Without regular cleaning, that organic matter compresses into a wet mass that blocks water flow completely.
            </p>
            <p className="text-sm text-black/60 leading-relaxed mb-4">
              Standing water in clogged gutters is more than a cosmetic issue. It puts direct weight stress on the gutter system, causes wood fascia to rot, and creates the perfect environment for mosquitoes to breed. In winter, blocked gutters contribute to ice dams — a significant cause of roof damage in Maryland homes.
            </p>
            <p className="text-sm text-black/60 leading-relaxed">
              Lintel pros serve all of Montgomery County: Bethesda, Rockville, Chevy Chase, Potomac, Silver Spring, North Bethesda, Gaithersburg, and Germantown. We're familiar with the tree coverage and typical gutter loads across the area.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-black uppercase mb-4">What's Included</h2>
            <div className="space-y-3">
              {[
                ['Full debris removal', 'Leaves, twigs, seed pods, and compacted buildup vacuumed from all accessible gutters.'],
                ['Downspout flush', 'Each downspout is cleared and confirmed flowing before we leave.'],
                ['Ground-level equipment', 'Commercial vacuum and blower — no ladders required on most homes.'],
                ['Waste bagged & removed', 'All debris leaves with the pro. No pile left on your lawn.'],
                ['Fully insured', '$1M general liability on every job.'],
                ['Pay after confirmation', 'You inspect the work first. Your card isn\'t charged until you\'re satisfied.'],
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
            <div className="px-5 py-3 text-[11px] font-bold tracking-[0.1em] uppercase">Property Size</div>
            <div className="px-5 py-3 text-[11px] font-bold tracking-[0.1em] uppercase">Starting Price</div>
            <div className="px-5 py-3 text-[11px] font-bold tracking-[0.1em] uppercase">Typical Time</div>
          </div>
          {[
            ['Small (< 1,500 sq ft)', '$149', '45 min'],
            ['Medium (1,500–2,500 sq ft)', '$169', '60–75 min'],
            ['Large (2,500+ sq ft)', 'Custom quote', '90+ min'],
          ].map(([size, price, time], i) => (
            <div key={size} className={`grid grid-cols-3 border-t border-black/10 ${i % 2 === 1 ? 'bg-black/[0.02]' : ''}`}>
              <div className="px-5 py-3 text-sm text-black">{size}</div>
              <div className="px-5 py-3 text-sm font-bold text-black">{price}</div>
              <div className="px-5 py-3 text-sm text-black/60">{time}</div>
            </div>
          ))}
        </div>
        <p className="text-xs text-black/40 mt-3 font-mono">Final price shown before you confirm booking. No surprises.</p>
      </section>

      {/* Who does the work */}
      <section className="max-w-4xl mx-auto px-6 py-14 border-b border-black/10">
        <h2 className="text-xl font-black uppercase mb-4">Local Students. Real Work.</h2>
        <p className="text-sm text-black/60 leading-relaxed max-w-xl mb-4">
          Every Lintel pro is a vetted, background-checked student from the Montgomery County area. These are your neighbors — high school and college students who want to earn real income on their own schedule. Lintel provides all equipment and insurance; they provide the work ethic.
        </p>
        <p className="text-sm text-black/60 leading-relaxed max-w-xl">
          Before any pro can take a booking, they pass a full background check and identity verification. After every job, homeowners rate the pro — anyone below 4.5★ is paused and reviewed. The network average is 4.9★.
        </p>
      </section>

      {/* FAQ */}
      <section className="max-w-4xl mx-auto px-6 py-14 border-b border-black/10">
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
          <Link to="/services/pressure-washing" className="border border-black/10 p-5 hover:border-black/30 transition-colors">
            <p className="text-[10px] font-mono text-black/40 uppercase tracking-widest mb-1">Service</p>
            <p className="text-sm font-bold text-black">Pressure Washing</p>
            <p className="text-xs text-black/50 mt-1">Driveways, patios, siding & more. From $200.</p>
          </Link>
          <Link to="/services/window-cleaning" className="border border-black/10 p-5 hover:border-black/30 transition-colors">
            <p className="text-[10px] font-mono text-black/40 uppercase tracking-widest mb-1">Service</p>
            <p className="text-sm font-bold text-black">Window Cleaning</p>
            <p className="text-xs text-black/50 mt-1">Streak-free interior or exterior. From $250.</p>
          </Link>
          <Link to="/blog/how-often-clean-gutters-maryland" className="border border-black/10 p-5 hover:border-black/30 transition-colors">
            <p className="text-[10px] font-mono text-black/40 uppercase tracking-widest mb-1">Blog</p>
            <p className="text-sm font-bold text-black">How Often Should You Clean Gutters in Maryland?</p>
            <p className="text-xs text-black/50 mt-1">Seasonal guide for Montgomery County homeowners.</p>
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#0d0d0d]">
        <div className="max-w-6xl mx-auto px-6 py-16 flex flex-col lg:flex-row lg:items-center gap-10 lg:gap-16">
          <div className="lg:flex-shrink-0 lg:max-w-xs">
            <p className="text-[10px] font-mono text-white/35 tracking-[0.2em] uppercase mb-3">Ready to book?</p>
            <h2 className="text-3xl font-black text-white uppercase mb-8">Clear Gutters.<br />No Ladder.<br />Fully Insured.</h2>

          </div>
          <div className="flex-1 flex items-center justify-center lg:justify-end">
            <ServiceQuoteCTA serviceType="gutter-cleaning" className="w-full max-w-[520px]" />
          </div>
        </div>
      </section>

    </div>
  );
}
