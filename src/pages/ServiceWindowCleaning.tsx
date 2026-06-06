import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ChevronRight } from 'lucide-react';
import logo from '../assets/logo.jpeg';
import { ServiceQuoteCTA } from '../components/ServiceQuoteCTA';
import window_image from '../assets/site_asset_window.png';

const FAQ_ITEMS = [
  {
    q: 'Does window cleaning include both interior and exterior?',
    a: 'Interior and exterior window cleaning are separate bookings, each with its own price. You can book just exterior, just interior, or both at the same time — they\'ll be completed in one visit. The base price covers one side. Review what\'s included when selecting your service at checkout.',
  },
  {
    q: 'Will my windows be streak-free?',
    a: 'Yes. We use a water-fed pole system with purified water, which dries without leaving mineral deposits or streaks. It\'s the same system used by commercial window cleaning services on office buildings — and it produces noticeably better results than squeegee-only methods on hard water.',
  },
  {
    q: 'Do you clean second-story windows?',
    a: 'We clean exterior windows using an extendable water-fed pole system that reaches up to 35 feet from the ground — covering most 2-story homes without ladder work. For interior second-floor windows, the pro works from inside the home. Contact us for 3-story or specialty window configurations.',
  },
  {
    q: 'How long does window cleaning take?',
    a: 'A typical single-family home (10–15 windows) takes 60–90 minutes for exterior or interior. Homes with more windows, divided lights, or difficult-to-access areas take longer. Your pro will confirm timing when they arrive.',
  },
  {
    q: 'How often should windows be professionally cleaned?',
    a: 'Most Montgomery County homeowners book once or twice a year — typically spring (after winter grime and pollen) and fall (before the holiday season). Homes near high-traffic roads, with heavy tree coverage, or with large glass areas often benefit from quarterly cleanings.',
  },
  {
    q: 'Do I need to move furniture or clear window sills before the pro arrives?',
    a: 'For interior cleaning, it helps to clear items off window sills and move any furniture that blocks direct access. For exterior cleaning, we just need the area around the house to be clear. Your pro will let you know if anything needs to be moved when they arrive.',
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

export default function ServiceWindowCleaning() {
  return (
    <div className="min-h-screen bg-white text-black" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      <Helmet>
        <title>Window Cleaning in Montgomery County, MD | Lintel</title>
        <meta name="description" content="Professional window cleaning in Montgomery County, MD. Interior or exterior, streak-free results, fully insured. Starting at $250. Book online." />
        <meta name="keywords" content="window cleaning montgomery county md, window cleaning bethesda, window cleaning rockville md, residential window cleaning maryland, streak-free window cleaning near me, exterior window cleaning bethesda" />
        <link rel="canonical" href="https://uselintel.pro/services/window-cleaning" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Window Cleaning in Montgomery County, MD | Lintel" />
        <meta property="og:description" content="Professional window cleaning in Montgomery County, MD. Interior or exterior, streak-free results, fully insured. Book online." />
        <meta property="og:url" content="https://uselintel.pro/services/window-cleaning" />
        <meta property="og:image" content="https://uselintel.pro/og-image.png" />
        <meta property="og:site_name" content="Lintel" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Window Cleaning in Montgomery County, MD | Lintel" />
        <meta name="twitter:description" content="Professional window cleaning in Montgomery County, MD. Interior or exterior, streak-free results, fully insured. Book online." />
        <meta name="twitter:image" content="https://uselintel.pro/og-image.png" />
      </Helmet>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: 'Window Cleaning',
        description: 'Professional residential window cleaning, interior and exterior. Streak-free results using professional equipment and solutions.',
        url: 'https://uselintel.pro/services/window-cleaning',
        provider: { '@type': 'LocalBusiness', name: 'Lintel', url: 'https://uselintel.pro' },
        areaServed: ['Bethesda, MD', 'Rockville, MD', 'Montgomery County, MD', 'Chevy Chase, MD', 'Potomac, MD', 'Silver Spring, MD', 'Gaithersburg, MD', 'Germantown, MD'],
        offers: { '@type': 'Offer', price: '119', priceCurrency: 'USD', description: 'Starting price for standard exterior window cleaning' },
      }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://uselintel.pro/' },
          { '@type': 'ListItem', position: 2, name: 'Services', item: 'https://uselintel.pro/#services' },
          { '@type': 'ListItem', position: 3, name: 'Window Cleaning', item: 'https://uselintel.pro/services/window-cleaning' },
        ],
      }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        speakable: { '@type': 'SpeakableSpecification', cssSelector: '#faq' },
        url: 'https://uselintel.pro/services/window-cleaning',
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
            <Link to="/services/pressure-washing" className="px-4 h-9 flex items-center text-black/50 hover:text-black text-[11px] font-semibold tracking-[0.12em] uppercase transition-colors">Pressure Washing</Link>
            <Link to="/services/window-cleaning"  className="px-4 h-9 flex items-center text-black text-[11px] font-semibold tracking-[0.12em] uppercase border-b-2 border-black">Windows</Link>
            <Link to="/blog" className="px-4 h-9 flex items-center text-black/50 hover:text-black text-[11px] font-semibold tracking-[0.12em] uppercase transition-colors">Blog</Link>
          </nav>
          <Link to="/login" className="px-4 h-8 flex items-center bg-black text-white text-[11px] font-semibold tracking-[0.1em] uppercase hover:bg-black/80 transition-colors">
            BOOK NOW
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-14 bg-[#0d0d0d] min-h-screen flex flex-col relative overflow-hidden">
        <img src={window_image} className="absolute inset-0 w-full h-full object-cover object-center opacity-60" alt="" />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 flex-1 w-full max-w-6xl mx-auto px-6 flex flex-col justify-center py-16">
          <p className="text-[10px] font-mono text-white/35 tracking-[0.2em] uppercase mb-4">Window Cleaning · Montgomery County, MD</p>
          <h1 className="text-4xl lg:text-6xl font-black text-white leading-tight uppercase mb-10 max-w-xl">
            Window Cleaning in<br />Montgomery County, MD
          </h1>
          <div className="flex items-center gap-6 flex-wrap">
            <a
              href="#get-a-price"
              className="inline-flex items-center gap-2 px-8 h-12 bg-[#008060] text-white font-black text-[12px] tracking-[0.2em] uppercase hover:bg-[#006b50] transition-colors"
            >
              GET A PRICE
              <ChevronRight className="w-4 h-4" />
            </a>
            <p className="text-[10px] font-mono text-white/35 tracking-[0.15em] uppercase">or scroll to see how it works ↓</p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-4xl mx-auto px-6 py-14 border-b border-black/10">
        <p className="text-[10px] font-mono text-black/35 tracking-[0.2em] uppercase mb-2">Process</p>
        <h2 className="text-xl font-black uppercase mb-10">How It Works</h2>
        <div className="space-y-10">
          <div className="flex gap-6">
            <span className="flex-shrink-0 text-3xl font-black text-[#008060] leading-none w-8">①</span>
            <div>
              <p className="text-sm font-black text-black uppercase mb-1">Enter your address</p>
              <p className="text-sm text-black/60 leading-relaxed">Exact price, not a range. 30 seconds.</p>
            </div>
          </div>
          <div className="flex gap-6">
            <span className="flex-shrink-0 text-3xl font-black text-[#008060] leading-none w-8">②</span>
            <div>
              <p className="text-sm font-black text-black uppercase mb-1">Pick a time</p>
              <p className="text-sm text-black/60 leading-relaxed">We match you with a background-checked local pro.</p>
            </div>
          </div>
          <div className="flex gap-6">
            <span className="flex-shrink-0 text-3xl font-black text-[#008060] leading-none w-8">③</span>
            <div className="flex-1 grid lg:grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-black text-black uppercase mb-1">They do the job</p>
                <p className="text-sm text-black/60 leading-relaxed">Check for streaks. If any pane needs a second pass, the pro handles it before you confirm.</p>
              </div>
              <div className="border-l-2 border-[#008060] pl-5">
                <p className="text-sm text-black/70 leading-relaxed italic mb-3">"I loved that I had to approve the house before confirming. Felt totally in control."</p>
                <p className="text-[10px] font-mono text-black/40 uppercase tracking-widest">— Justin, Bethesda</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Debra pull-quote */}
      <section className="bg-black/[0.02] border-b border-black/10">
        <div className="max-w-4xl mx-auto px-6 py-12 text-center">
          <p className="text-xl lg:text-2xl font-black text-black leading-snug max-w-2xl mx-auto mb-4">"Fast, professional, and honestly way cheaper than I expected."</p>
          <p className="text-[10px] font-mono text-black/40 uppercase tracking-widest">— Debra, Bethesda</p>
        </div>
      </section>

      {/* Anchored quote form */}
      <section id="get-a-price" className="bg-[#0d0d0d]">
        <div className="max-w-6xl mx-auto px-6 py-16 flex flex-col lg:flex-row lg:items-center gap-10 lg:gap-16">
          <div className="lg:flex-shrink-0 lg:max-w-xs">
            <p className="text-[10px] font-mono text-white/35 tracking-[0.2em] uppercase mb-3">Get a price</p>
            <h2 className="text-3xl font-black text-white uppercase mb-8">Exact Price.<br />Not a Range.</h2>
          </div>
          <div className="flex-1 flex items-center justify-center lg:justify-end">
            <ServiceQuoteCTA serviceType="window-cleaning" className="w-full max-w-[520px]" />
          </div>
        </div>
      </section>

      {/* Body copy */}
      <section className="max-w-4xl mx-auto px-6 py-14 border-b border-black/10">
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-xl font-black uppercase mb-4">Why Windows in Montgomery County Get Dirty Fast</h2>
            <p className="text-sm text-black/60 leading-relaxed mb-4">
              Montgomery County's combination of heavy tree coverage, seasonal pollen, and proximity to DC's traffic corridor means windows accumulate a distinctive grey-green film that becomes visible within weeks of cleaning. In spring, oak and maple pollen coats every horizontal surface — windows included. By fall, it's airborne soot and organic debris from leaf drop.
            </p>
            <p className="text-sm text-black/60 leading-relaxed mb-4">
              Hard water is the other culprit. Montgomery County's water supply leaves mineral deposits on glass each time rain dries on the surface. Over months, those deposits build up into a haze that isn't removable with standard household cleaners. Professional cleaning with purified water removes the deposits and prevents new ones from forming immediately.
            </p>
            <p className="text-sm text-black/60 leading-relaxed">
              We serve all of Montgomery County: Bethesda, Rockville, Chevy Chase, Potomac, Silver Spring, Gaithersburg, Germantown, and North Bethesda.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-black uppercase mb-4">How We Clean</h2>
            <div className="space-y-3">
              {[
                ['Purified water system', 'Deionized water dries spot-free — no mineral residue, no streaks.'],
                ['Water-fed pole', 'Extendable up to 35 ft — covers most 2-story homes without ladders.'],
                ['Interior & exterior bookable separately', 'Book one side or both. Priced individually.'],
                ['All window types', 'Double-hung, casement, sliding, picture windows. Screens cleaned on request.'],
                ['Fully insured', '$1M general liability on every job.'],
                ['Pay after confirmation', 'Inspect the results before payment is released.'],
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
            <div className="px-5 py-3 text-[11px] font-bold tracking-[0.1em] uppercase">Service</div>
            <div className="px-5 py-3 text-[11px] font-bold tracking-[0.1em] uppercase">Starting Price</div>
            <div className="px-5 py-3 text-[11px] font-bold tracking-[0.1em] uppercase">Typical Time</div>
          </div>
          {[
            ['Exterior only', '$250', '60–90 min'],
            ['Interior only', '$250', '60–90 min'],
            ['Exterior + Interior', '$450', '2–3 hrs'],
          ].map(([service, price, time], i) => (
            <div key={service} className={`grid grid-cols-3 border-t border-black/10 ${i % 2 === 1 ? 'bg-black/[0.02]' : ''}`}>
              <div className="px-5 py-3 text-sm text-black">{service}</div>
              <div className="px-5 py-3 text-sm font-bold text-black">{price}</div>
              <div className="px-5 py-3 text-sm text-black/60">{time}</div>
            </div>
          ))}
        </div>
        <p className="text-xs text-black/40 mt-3 font-mono">Final price shown before you confirm booking. No surprises.</p>
      </section>

      {/* Who does the work */}
      <section className="max-w-4xl mx-auto px-6 py-14 border-b border-black/10">
        <h2 className="text-xl font-black uppercase mb-4">Montgomery County Students. Spotless Results.</h2>
        <p className="text-sm text-black/60 leading-relaxed max-w-xl mb-4">
          Every Lintel pro is a vetted, background-checked student from the Montgomery County area. They're trained on Lintel's purified water and pole systems and follow a clear service protocol on every job. You get professional results and the satisfaction of supporting local students building real skills.
        </p>
        <p className="text-sm text-black/60 leading-relaxed max-w-xl">
          All pros maintain a 4.5★ minimum rating. After your cleaning, you'll rate the experience — that's how we maintain quality across the network.
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
          <Link to="/services/pressure-washing" className="border border-black/10 p-5 hover:border-black/30 transition-colors">
            <p className="text-[10px] font-mono text-black/40 uppercase tracking-widest mb-1">Service</p>
            <p className="text-sm font-bold text-black">Pressure Washing</p>
            <p className="text-xs text-black/50 mt-1">Driveways, patios, siding & more. From $200.</p>
          </Link>
          <Link to="/blog/window-cleaning-bethesda-md" className="border border-black/10 p-5 hover:border-black/30 transition-colors">
            <p className="text-[10px] font-mono text-black/40 uppercase tracking-widest mb-1">Blog</p>
            <p className="text-sm font-bold text-black">Window Cleaning in Montgomery County, MD</p>
            <p className="text-xs text-black/50 mt-1">What to expect and what it costs.</p>
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#0d0d0d]">
        <div className="max-w-6xl mx-auto px-6 py-16 flex flex-col lg:flex-row lg:items-center gap-10 lg:gap-16">
          <div className="lg:flex-shrink-0 lg:max-w-xs">
            <p className="text-[10px] font-mono text-white/35 tracking-[0.2em] uppercase mb-3">Ready to book?</p>
            <h2 className="text-3xl font-black text-white uppercase mb-8">Streak-Free Windows.<br />Inside or Out.</h2>

          </div>
          <div className="flex-1 flex items-center justify-center lg:justify-end">
            <ServiceQuoteCTA serviceType="window-cleaning" className="w-full max-w-[520px]" />
          </div>
        </div>
      </section>

    </div>
  );
}
