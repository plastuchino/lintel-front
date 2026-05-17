import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ChevronRight } from 'lucide-react';
import logo from '../assets/logo.jpeg';

const FAQ_ITEMS = [
  {
    q: 'What surfaces do you pressure wash?',
    a: 'We clean driveways (concrete and asphalt), patios and decks (stone, pavers, and wood), siding (vinyl, brick, and fiber cement), and sidewalks and walkways. If you\'re unsure whether a specific surface is included, reach out before booking.',
  },
  {
    q: 'Will pressure washing damage my driveway or deck?',
    a: 'Our pros use commercial-grade equipment with the correct nozzle and PSI settings for each surface type. Soft surfaces like wood decking are cleaned at lower pressure with appropriate detergents — not blasted at driveway settings. We\'ve cleaned hundreds of driveways, patios, and decks across Bethesda and Rockville without surface damage.',
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
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white text-black" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      <Helmet>
        <title>Pressure Washing in Bethesda &amp; Rockville, MD | Lintel</title>
        <meta name="description" content="Professional pressure washing in Bethesda, Rockville, and Montgomery County, MD. Driveways, patios, decks, siding, and sidewalks. Fully insured, starting at $200. Book online." />
        <link rel="canonical" href="https://uselintel.pro/services/pressure-washing" />
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
      <section className="pt-14 border-b border-black/10">
        <div className="max-w-4xl mx-auto px-6 py-16">
          <p className="text-[10px] font-mono text-black/40 tracking-[0.2em] uppercase mb-3">Pressure Washing · Montgomery County, MD</p>
          <h1 className="text-4xl lg:text-5xl font-black text-black leading-tight uppercase mb-5">
            Pressure Washing in<br />Bethesda &amp; Rockville, MD
          </h1>
          <p className="text-sm text-black/55 leading-relaxed max-w-xl mb-8">
            Years of grime, algae, and mold don't stand a chance. We bring commercial-grade equipment to your driveway, patio, deck, siding, or sidewalk — and leave it looking new. Fully insured, starting at $200.
          </p>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 px-6 h-11 bg-[#008060] text-white font-bold text-[11px] tracking-[0.2em] uppercase hover:bg-[#006b50] transition-colors"
          >
            SEE PRICES IN MY AREA <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>

      {/* Body copy */}
      <section className="max-w-4xl mx-auto px-6 py-14 border-b border-black/10">
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-xl font-black uppercase mb-4">Why Maryland Surfaces Need Regular Cleaning</h2>
            <p className="text-sm text-black/60 leading-relaxed mb-4">
              Montgomery County's humid mid-Atlantic climate creates ideal conditions for algae, mold, and mildew to grow on outdoor surfaces. Concrete driveways, stone patios, and wood decks in Bethesda, Rockville, and Potomac develop black streaking and green slick patches over the course of a season — not just an eyesore, but genuinely slippery and damaging to surfaces over time.
            </p>
            <p className="text-sm text-black/60 leading-relaxed mb-4">
              Siding is equally affected. Vinyl and fiber cement siding on older Bethesda colonials and Rockville townhomes accumulates a grey film of atmospheric dirt and biological growth that no garden hose can remove. A professional pressure wash strips it completely and restores curb appeal before a sale, a party, or just because you're tired of looking at it.
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
          Lintel pros are background-checked students from the Montgomery County area — Bethesda, Rockville, Chevy Chase, Gaithersburg. They operate Lintel-owned commercial equipment and follow service protocols we've developed across hundreds of jobs. You get professional results without the overhead of a large service company.
        </p>
        <p className="text-sm text-black/60 leading-relaxed max-w-xl">
          Every pro carries a 4.5★ minimum rating to stay active on the platform. The network average is 4.9★. After your job, you'll rate the experience — that feedback directly shapes who gets future bookings.
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
      <section className="max-w-4xl mx-auto px-6 py-16">
        <div className="bg-black p-10 text-center">
          <p className="text-[10px] font-mono text-white/40 tracking-[0.2em] uppercase mb-3">Ready to book?</p>
          <h2 className="text-2xl font-black text-white uppercase mb-3">Commercial Equipment. Local Pros. Guaranteed Results.</h2>
          <p className="text-sm text-white/50 mb-8 max-w-sm mx-auto">Enter your address and see exact pricing for your surfaces — takes under 2 minutes.</p>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 px-7 h-11 bg-white text-black font-bold text-[11px] tracking-[0.2em] uppercase hover:bg-white/90 transition-colors"
          >
            SEE MY PRICE <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-white/10 py-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="lintel" className="h-6 w-6 rounded-full object-cover" />
            <span className="text-white text-sm font-black tracking-tight">lintel</span>
          </Link>
          <div className="flex gap-6 text-[11px] font-mono text-white/40">
            <Link to="/services/gutter-cleaning"  className="hover:text-white transition-colors">Gutter Cleaning</Link>
            <Link to="/services/pressure-washing" className="hover:text-white transition-colors">Pressure Washing</Link>
            <Link to="/services/window-cleaning"  className="hover:text-white transition-colors">Window Cleaning</Link>
            <Link to="/blog"                       className="hover:text-white transition-colors">Blog</Link>
          </div>
          <p className="text-white/25 text-[11px] font-mono">© 2026 lintel</p>
        </div>
      </footer>
    </div>
  );
}
