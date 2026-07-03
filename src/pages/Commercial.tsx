import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Phone, MapPin } from 'lucide-react';
import logo from '../assets/logo.jpeg';
import { CommercialQuoteCTA } from '../components/CommercialQuoteCTA';
import { TrustedByCarousel } from '../components/TrustedByCarousel';
import { COMMERCIAL_CLIENTS } from '../data/commercialClients';
import { useGeoHeadline } from '../hooks/useGeoHeadline';
import gutter_image from '../assets/site_asset_gutter_one.png';
import window_image from '../assets/site_asset_window.png';
import pressure_image from '../assets/site_asset_pressure_washing.png';

const SERVICES = [
  { name: 'Gutter Cleaning', href: '/commercial/gutter-cleaning', desc: 'Multi-building and storefront gutter runs, recurring maintenance contracts.', image: gutter_image },
  { name: 'Window Cleaning', href: '/commercial/window-cleaning', desc: 'Storefront, display, and office window cleaning.', image: window_image },
  { name: 'Pressure Washing', href: '/commercial/pressure-washing', desc: 'Parking lots, sidewalks, loading docks, and cart corrals.', image: pressure_image },
];

export default function Commercial() {
  const { cityName, stateAbbr, geoResolved, requestLocation } = useGeoHeadline();
  const h1Location = cityName ? `in ${cityName}, ${stateAbbr}` : 'Near You';

  return (
    <div className="min-h-screen bg-white text-black" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      <Helmet>
        <title>Commercial Services in Montgomery County, MD | Lintel</title>
        <meta name="description" content="Commercial gutter cleaning, window cleaning, and pressure washing for businesses in Montgomery County, MD. Fully insured, subcontracting welcome, pay after the job is done." />
        <link rel="canonical" href="https://uselintel.pro/commercial" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Commercial Services in Montgomery County, MD | Lintel" />
        <meta property="og:description" content="Commercial gutter cleaning, window cleaning, and pressure washing for businesses. Fully insured, subcontracting welcome." />
        <meta property="og:url" content="https://uselintel.pro/commercial" />
      </Helmet>

      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-black/10">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <img src={logo} alt="lintel" className="h-7 w-7 rounded-full object-cover" />
            <span className="text-black text-sm font-bold tracking-[0.15em] uppercase">LINTEL</span>
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            <Link to="/commercial" className="px-4 h-9 flex items-center text-black text-[11px] font-semibold tracking-[0.12em] uppercase border-b-2 border-black">Commercial</Link>
            <Link to="/services/gutter-cleaning" className="px-4 h-9 flex items-center text-black/50 hover:text-black text-[11px] font-semibold tracking-[0.12em] uppercase transition-colors">Residential</Link>
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

      <section className="pt-14 bg-[#0d0d0d] flex flex-col relative overflow-hidden">
        <div className="relative z-10 w-full max-w-6xl mx-auto px-6 py-16 flex flex-col lg:flex-row lg:items-center lg:gap-16">
          <div className="flex-1 mb-8 lg:mb-0">
            <span className="inline-block bg-[#008060] text-white text-[10px] font-bold tracking-[0.2em] uppercase px-3 py-1 mb-5">Commercial</span>
            <h1 className="text-4xl lg:text-5xl font-black text-white leading-tight uppercase mb-4 max-w-xl">
              Facility Cleaning for Businesses {h1Location}
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
              Gutter cleaning, window cleaning, and pressure washing for retail, warehouse, and multi-unit properties. Subcontracting welcome. Payment collected only after the job is confirmed done.
            </p>
          </div>
          <div className="w-full lg:w-[380px] lg:flex-shrink-0">
            <CommercialQuoteCTA />
          </div>
        </div>
      </section>

      <TrustedByCarousel clients={COMMERCIAL_CLIENTS} />

      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-xl font-black uppercase mb-8 text-center">Our Commercial Services</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {SERVICES.map(({ name, href, desc, image }) => (
            <Link key={href} to={href} className="group border border-black/10 hover:border-black/30 transition-colors overflow-hidden">
              <div className="h-40 relative overflow-hidden">
                <img src={image} alt={name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              </div>
              <div className="p-5">
                <p className="text-sm font-black text-black uppercase mb-1">{name}</p>
                <p className="text-xs text-black/50 leading-relaxed">{desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-16 border-t border-black/10">
        <div className="grid md:grid-cols-2 gap-10">
          <div>
            <h2 className="text-lg font-black uppercase mb-3">Pay After the Job, Not Before</h2>
            <p className="text-sm text-black/60 leading-relaxed">
              You're not charged upfront. We complete the work, your team inspects it, and payment is only processed once the job is confirmed done. Recurring contracts get standard net-terms invoicing.
            </p>
          </div>
          <div>
            <h2 className="text-lg font-black uppercase mb-3">Subcontracting Welcome</h2>
            <p className="text-sm text-black/60 leading-relaxed">
              We actively want to work with GCs, property managers, and facilities vendors as a sub across one or multiple properties — COI on request, standard subcontractor agreements.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
