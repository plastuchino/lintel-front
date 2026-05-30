import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Shield, Clock, CheckCircle, ChevronRight, ArrowRight, Star } from 'lucide-react';
import { Turnstile } from '@marsidev/react-turnstile';
import { useAuthStore } from '../store/authStore';
import { useBookingStore } from '../store/bookingStore';

const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY as string;

import { AddressSearch } from '../components/AddressSearch';
import logo from '../assets/logo.jpeg';

import image_1 from "../assets/worker_1.jpeg"
import image_2 from "../assets/worker_2.jpg"


const SERVICES = [
  { id: 'gutter-cleaning',         code: 'LNT-001', name: 'Gutter Cleaning',   desc: 'Clear out leaves, debris, and blockages so water drains away from your home — not into it.',  price: '$89',  icon: GutterIcon },
  { id: 'window-cleaning',         code: 'LNT-002', name: 'Window Cleaning',   desc: 'Streak-free windows, inside and out. We bring the supplies — you just enjoy the view.',       price: '$119', icon: WindowIcon },
  { id: 'pressure-washing',        code: 'LNT-003', name: 'Pressure Washing',  desc: 'Blast years of grime off your driveway, patio, deck, or siding. Results you can see.',        price: '$149', icon: PressureIcon },
  { id: 'house-cleaning-standard', code: 'LNT-004', name: 'House Cleaning',    desc: 'A thorough clean of every room — floors, surfaces, bathrooms, and kitchen. Top-to-bottom.',   price: '$129', icon: HouseIcon, disabled: true },
  { id: 'house-cleaning-deep',     code: 'LNT-005', name: 'Deep Clean',        desc: 'Our most thorough package. Perfect for move-ins, move-outs, or a full seasonal reset.',       price: '$229', icon: DeepIcon, disabled: true },
  { id: 'lawn-mowing',             code: 'LNT-006', name: 'Lawn Mowing',       desc: 'A neatly cut, edged lawn without lifting a finger. Consistent results every visit.',           price: '$99',  icon: LawnIcon, disabled: true },
];

const TESTIMONIALS = [
  {
    name: 'Carlos Hernandez',
    role: 'Homeowner · Bethesda, MD',
    rating: 5,
    quote: '"I never really expected a good job done for this cheap by a couple of teenagers, but I am pretty happy. Would recommend."',
  },
  {
    name: 'Cecile Lorillou',
    role: 'Homeowner · Bethesda, MD',
    rating: 5,
    quote: '"Got my windows cleaned nice and quick. They let me inspect before payment. Very professional"',
  },
  {
    name: 'Google Review',
    role: 'Homeowner · Rockville, MD',
    rating: 4,
    quote: '"Left my driveway and patio looking great! definitely will be calling them again"',
  },
];

const STATS = [
  { value: '99+',  label: 'Homes Completed' },
  { value: '4.9★', label: 'Average Rating' },
  { value: '$1M',  label: 'Liability Coverage' },
  { value: '100%', label: 'Background Checked' },
];

// TODO: Replace placeholder data with real worker names, schools, grades, services, and stats
const TEAM = [
  {
    // TODO: Replace 'Add photo' image slot — import worker photo and use it as `src` below
    name: 'Sebastian',
    school: 'Walter Johnson High School',
    grade: 'Grade 12',
    services: ['Gutters', 'Windows', 'Pressure Wash'],
    jobs: '14',
    rating: '4.85',
    src: image_1
  },
  {
    name: 'Alban',
    school: 'Walter Johnson High School',
    grade: 'Grade 12',
    services: ['Windows', 'Pressure Wash', 'Gutters'],
    jobs: '15',
    rating: '4.92',
    src: image_2
  },
  
];

export default function LandingPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { setAddress, setCaptchaToken } = useBookingStore();
  const [heroAddress, setHeroAddress] = useState('');

  useEffect(() => {
    if (user) navigate(user.role === 'worker' ? '/worker/dashboard' : '/book', { replace: true });
  }, [user, navigate]);

  const handleAddressConfirm = (addr: string) => {
    if (!addr.trim()) return;
    setAddress(addr, true);
    navigate('/quote-preview');
  };

  return (
    <div className="min-h-screen bg-white text-black" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      <Helmet>
        <title>Lintel — On-Demand Home Services | Bethesda &amp; Rockville, MD</title>
        <meta name="description" content="Book vetted home service professionals in Bethesda, Rockville, and Montgomery County, MD. Gutter cleaning, pressure washing, window cleaning — on demand. Pay only after the job is done." />
      </Helmet>

      {/* ── Nav ─────────────────────────────────────────────────────────── */}
      <header className="fixed top-0 left-0 right-0 z-50">
        {/* Announcement banner */}
        <div className="bg-[#008060]">
          <div className="min-h-9 flex items-center justify-center px-4 py-1.5 gap-2">
            <div className="w-1 h-1 bg-white/50 rounded-full flex-shrink-0 hidden sm:block" />
            <span className="text-white text-[9px] sm:text-[10px] font-semibold tracking-[0.15em] sm:tracking-[0.2em] uppercase font-mono text-center leading-tight">
              <span className="sm:hidden">Home Services by Students · MD · Fully Insured</span>
              <span className="hidden sm:inline">Home Services by Students · Montgomery County, MD · Fully Insured</span>
            </span>
            <div className="w-1 h-1 bg-white/50 rounded-full flex-shrink-0 hidden sm:block" />
          </div>
        </div>
        {/* Nav bar */}
        <div className="bg-white border-b border-black/10">
        <div className="max-w-7xl mx-auto sm:px-6 px-2 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <img src={logo} alt="lintel" className="h-7 w-7 rounded-full object-cover" />
            <span className="text-black text-sm font-bold tracking-[0.15em] uppercase">LINTEL</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            <a href="#services" className="px-4 h-9 flex items-center text-black/50 hover:text-black text-[11px] font-semibold tracking-[0.12em] transition-colors uppercase">Services</a>
            <a href="#trust"    className="px-4 h-9 flex items-center text-black/50 hover:text-black text-[11px] font-semibold tracking-[0.12em] transition-colors uppercase">How It Works</a>
            <Link to="/worker/register" className="px-4 h-9 flex items-center text-black/50 hover:text-black text-[11px] font-semibold tracking-[0.12em] transition-colors uppercase">Earn With Us</Link>
            <Link to="/blog/" className="px-4 h-9 flex items-center text-black/50 hover:text-black text-[11px] font-semibold tracking-[0.12em] transition-colors uppercase">Learn about us</Link>
        
          </nav>

          <div className="flex items-center gap-2">
            <Link to="/login" className="px-4 text-nowrap h-8 flex items-center text-black text-[11px] font-semibold tracking-[0.1em] uppercase hover:bg-black/5 transition-colors">
              LOG IN
            </Link>
            <Link to="/login" className="text-nowrap px-4 h-8 flex items-center bg-black text-white text-[11px] font-semibold tracking-[0.1em] uppercase hover:bg-black/80 transition-colors">
              GET QUOTE
            </Link>
          </div>
        </div>
        </div>
      </header>

      {/* ── Hero ────────────────────────────────────────────────────────── */}
      {/* pt accounts for fixed header: 36px banner + 56px nav = 92px */}
      <section className="pt-[92px] min-h-screen flex items-center relative overflow-hidden">
        {/* Dot grid background */}
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle, #00000015 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }} />

        <div className="relative max-w-7xl mx-auto px-6 w-full flex flex-col lg:flex-row items-center gap-8 lg:gap-16 py-8 lg:py-24">

          {/* Left */}
          <div className="flex-1 max-w-xl">
            <div className="inline-flex items-center gap-2 border border-black/20 px-3 py-1 mb-8">
              <div className="w-1.5 h-1.5 bg-[#008060] rounded-full animate-pulse" />
              <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-black/60 font-mono">
                99+ Homes Completed · Fully Insured
              </span>
            </div>

            <h1 className="text-5xl lg:text-6xl font-black text-black leading-[1.08] mb-5 tracking-tight uppercase">
              Home Services<br />By Students.
            </h1>

            <p className="text-base text-black/50 leading-relaxed mb-10 max-w-sm">
              We're a team of dedicated high school students that deliver professional results at low prices. <span className="font-bold"> Find your quote below.</span>
            </p>

            {/* Address input */}
            <div className="border border-[#008060]/40 bg-white max-w-md">
              <div className="p-4 pb-3">
                <p className="text-[10px] font-mono font-semibold text-black/40 tracking-[0.2em] uppercase mb-3">
                  Your Address
                </p>
                <div className="flex items-center gap-2">
                  {/* <MapPin className="w-3.5 h-3.5 text-black/30 flex-shrink-0" /> */}
                  <AddressSearch
                    value={heroAddress}
                    onChange={setHeroAddress}
                    onConfirm={handleAddressConfirm}
                    placeholder="Enter your home address..."
                  />
                </div>
              </div>
              <div className="px-4 pb-4">
                <button
                  onClick={() => handleAddressConfirm(heroAddress)}
                  disabled={!heroAddress.trim()}
                  className="w-full h-11 bg-[#008060] text-white font-bold text-[11px] tracking-[0.2em] uppercase flex items-center justify-center gap-2 hover:bg-[#006b50] transition-colors disabled:bg-black/20 disabled:cursor-not-allowed"
                >
                  SEE PRICES
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <p className="mt-4 text-[12px] text-black/35 font-mono">
              Already have an account?{' '}
              <Link to="/login" className="underline underline-offset-2 hover:text-black/60 transition-colors">Log in</Link>
            </p>
          </div>

          {/* Right — home illustration */}
          <div className="flex-1 flex justify-center lg:justify-end">
            <HomeVisual />
          </div>
        </div>
      </section>

      {/* ── Stats bar ───────────────────────────────────────────────────── */}
      <section className="border-y border-black/10 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-black/10">
            {STATS.map(({ value, label }) => (
              <div key={label} className="px-8 py-7 text-center">
                <p className="text-3xl font-black text-black tracking-tight">{value}</p>
                <p className="text-xs font-mono text-black/40 tracking-[0.12em] uppercase mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Meet the Team ───────────────────────────────────────────────── */}
      <section className="py-20 border-t border-black/10 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-12">
            <p className="text-[10px] font-mono text-black/35 tracking-[0.2em] uppercase mb-1">Who We Are</p>
            <h2 className="text-3xl font-black text-black tracking-tight uppercase">Students Doing Serious Work</h2>
            <p className="text-base text-black/45 max-w-lg mt-3 leading-relaxed">
              We're not a faceless company. We're your neighbors, high school students who show up,
              do the job right, and stand behind our work with a $1M insurance policy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-black/10">
            {TEAM.map(({ name, school, grade, services, jobs, rating, src }, i) => (
              <div key={i} className="bg-white p-8 flex flex-col gap-5">
{/*                 
                  TODO: Replace this placeholder with a real worker photo.
                  Import the image at the top of the file, e.g.:
                    import worker1Photo from '../assets/worker1.jpg';
                  Then replace the gray box below with:
                                   */}

                {/* <img src={src} alt={name} className="w-full aspect-[4/3] object-cover" /> */}

                <div className="w-full rounded-[30px] aspect-[4/3] bg-black/5 border border-black/10 flex flex-col items-center justify-center gap-2">
                  <img src={src} alt={name} className="w-full aspect-[4/3] object-cover rounded-[30px]" />

                  {/* <div className="w-14 h-14 rounded-full bg-black/10 border border-black/15 flex items-center justify-center">
                    <span className="text-black/30 text-lg font-bold">{name[0]}</span>
                  </div>
                  <p className="text-[9px] font-mono text-black/25 tracking-[0.15em] uppercase">Add Photo Here</p> */}
                </div>

                <div>
                  <p className="text-lg font-bold text-black uppercase tracking-wide">{name}</p>
                  <p className="font-mono text-black/40 mt-0.5">{grade} · {school}</p>
                </div>

                <div className="flex gap-1 flex-wrap">
                  {services.map(s => (
                    <span key={s} className="px-2 py-0.5 border border-black/15 text-sm font-mono text-black/50 tracking-[0.1em] uppercase">{s}</span>
                  ))}
                </div>

                <div className="flex gap-6 pt-3 border-t border-black/8">
                  <div>
                    <p className="text-base text-xl font-black text-black">{jobs}</p>
                    <p className="text-sm font-mono text-black/35 uppercase tracking-wider mt-0.5">Jobs Done</p>
                  </div>
                  <div>
                    <p className="text-base text-xl font-black text-black">{rating}★</p>
                    <p className="text-sm font-mono text-black/35 uppercase tracking-wider mt-0.5">Rating</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Trust pillars ───────────────────────────────────────────────── */}
      <section id="trust" className="py-20 bg-white border-t border-black/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-12">
            <p className="text-[10px] font-mono text-black/35 tracking-[0.2em] uppercase mb-1">Why Lintel</p>
            <h2 className="text-3xl font-black text-black tracking-tight uppercase">Built Around Your Peace of Mind</h2>
            <p className="text-base text-black/45 max-w-lg mt-3 leading-relaxed">
              We know "high school students" might raise questions. Here's what we put in place so
              the answer is always: yes, they did an excellent job.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-black/10">
            {[
              {
                Icon: Shield,
                title: 'Fully Insured',
                desc: 'Every job is covered under our $1M general liability policy. If something gets damaged, we make it right — no questions asked.',
              },
              {
                Icon: CheckCircle,
                title: 'Background Verified & Top-Rated',
                desc: 'Every student passes a full identity check and background screen before their first booking. Homeowners rate each visit — workers below 4.5★ are paused and reviewed. We maintain a 4.9★ network average.',
              },
              {
                Icon: Clock,
                title: 'On-Time Guarantee',
                desc: "Your pro shows up in the booked window or your next booking is discounted. We respect your schedule.",
              },
              {
                Icon: CheckCircle,
                title: 'Pay After Confirmation & Satisfaction Guarantee',
                desc: "Your card is only charged once you confirm the job is complete — you hold the code, no code means no charge. Not happy? Message us within 24 hours and we'll send someone back, free of charge.",
              },
            ].map(({ Icon, title, desc }) => (
              <div key={title} className="bg-white p-8">
                <div className="w-9 h-9 border border-black/15 flex items-center justify-center mb-5">
                  <Icon className="w-4 h-4 text-black" strokeWidth={1.5} />
                </div>
                <p className="text-base font-bold text-black mb-2">{title}</p>
                <p className="text-sm text-black/45 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Services ────────────────────────────────────────────────────── */}
      <section id="services" className="py-20 border-t border-black/10 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-[10px] font-mono text-black/35 tracking-[0.2em] uppercase mb-1">What We Offer</p>
              <h2 className="text-3xl font-black text-black tracking-tight uppercase">Our Services</h2>
            </div>
            <div className="text-right hidden md:block">
              <p className="text-[10px] font-mono text-black/25 tracking-wider">ALL WORK INSURED</p>
              <p className="text-[10px] font-mono text-black/25 tracking-wider">6 SERVICES AVAILABLE</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-black/10">
            {SERVICES.map(({ id, code, name, desc, price, icon: ServiceIcon, disabled }) => (
              <div key={id} className="relative group bg-white overflow-hidden flex flex-col">
                {disabled && (
                  <div className="absolute inset-0 flex items-center justify-center z-10">
                    <span className="bg-black text-white text-[8px] font-bold tracking-[0.2em] px-4 py-2 uppercase font-mono shadow-2xl">
                      Coming Soon
                    </span>
                  </div>
                )}
                
                <div className={`sm:p-6 p-1 sm:my-0 my-3 flex flex-col gap-5 flex-1 ${disabled ? 'opacity-30 grayscale pointer-events-none select-none' : ''}`}>
                  <div className="flex items-start justify-between">
                    <div className="w-9 h-9 border border-black/15 flex items-center justify-center">
                      <ServiceIcon />
                    </div>
                    <span className="text-[10px] font-mono text-black/25 tracking-wider">{code}</span>
                  </div>

                  <div className="flex-1">
                    <p className="text-base font-bold text-black mb-1.5">{name}</p>
                    <p className="text-sm text-black/45 leading-relaxed">{desc}</p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-black/8">
                    <span className="text-[11px] font-bold text-black tracking-wider uppercase">
                      From {price}
                    </span>
                    <div className="flex items-center gap-2">
                      {(id === 'gutter-cleaning' || id === 'window-cleaning' || id === 'pressure-washing') && !disabled && (
                        <Link
                          to={`/services/${id}`}
                          className="px-3 h-7 flex text-nowrap items-center border border-black/15 text-[10px] font-bold tracking-[0.12em] uppercase text-black/50 hover:text-black hover:border-black/40 transition-colors"
                        >
                          LEARN MORE
                        </Link>
                      )}
                      <button
                        onClick={() => !disabled && navigate('/quote-preview')}
                        disabled={disabled}
                        className="px-4 text-nowrap h-7 border border-black/20 text-[10px] font-bold tracking-[0.15em] uppercase text-black hover:bg-black hover:text-white transition-colors disabled:cursor-not-allowed"
                      >
                        BOOK NOW
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ────────────────────────────────────────────────── */}
      <section className="py-20 border-t border-black/10 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-12">
            <p className="text-[10px] font-mono text-black/35 tracking-[0.2em] uppercase mb-1">The Process</p>
            <h2 className="text-3xl font-black text-black tracking-tight uppercase">As Easy as Ordering a Ride</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-black/10">
            {[
              { step: '01', title: 'Enter Your Address', desc: 'Tell us where you are. We\'ll show you available services, live pricing, and nearby pros.' },
              { step: '02', title: 'Pick a Time', desc: 'Choose same-day or schedule ahead. Your pro arrives in the booked window — guaranteed.' },
              { step: '03', title: 'Confirm & Pay', desc: 'Approve the completed work with your unique code. Only then is your payment released to the pro.' },
            ].map(({ step, title, desc }) => (
              <div key={step} className="bg-white p-8">
                <p className="text-[10px] font-mono text-black/25 tracking-[0.2em] mb-4">{step}</p>
                <p className="text-base font-bold text-black mb-2">{title}</p>
                <p className="text-sm text-black/45 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ────────────────────────────────────────────────── */}
      <section className="py-20 bg-black border-t border-black/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-[10px] font-mono text-white/30 tracking-[0.2em] uppercase mb-1">Homeowner Reviews</p>
              <h2 className="text-3xl font-black text-white tracking-tight uppercase">What Customers Say</h2>
            </div>
            <div className="hidden md:flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-white/60 fill-white/60" />
              <span className="text-white/50 text-[12px] font-mono">4.9 avg across 50+ jobs</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/10">
            {TESTIMONIALS.map(({ name, role, rating, quote }) => (
              <div key={name} className="bg-black p-8 flex flex-col gap-5">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-white/10 border border-white/15 flex items-center justify-center flex-shrink-0">
                    <span className="text-white/50 text-xs font-bold">{name[0]}</span>
                  </div>
                  <div>
                    <p className="text-white text-xs font-bold tracking-wide">{name.toUpperCase()}</p>
                    <p className="text-white/40 text-[11px] font-mono mt-0.5">{role}</p>
                  </div>
                </div>

                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className={`text-[11px] ${i < rating ? 'text-white' : 'text-white/20'}`}>★</span>
                  ))}
                </div>

                <p className="text-sm text-white/55 leading-relaxed italic flex-1">{quote}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Worker CTA ──────────────────────────────────────────────────── */}
      <section className="py-24 bg-white border-t border-black/10">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-[10px] font-mono text-black/35 tracking-[0.25em] uppercase mb-4">For Students</p>
          <h2 className="text-4xl font-black text-black tracking-tight uppercase mb-4">
            Earn on Your Own Schedule
          </h2>
          <p className="text-base text-black/45 max-w-lg mx-auto leading-relaxed mb-10">
            Turn your free time into real income. Set your own hours, pick the jobs you want,
            and build a reputation in your neighborhood. Top earners make over $800/week.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link
              to="/worker/register"
              className="px-7 h-11 bg-black text-white text-[11px] font-bold tracking-[0.2em] uppercase flex items-center gap-2 hover:bg-black/80 transition-colors"
            >
              GET STARTED AS A PRO
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              to="/blog/what-a-pro-does"
              className="px-7 h-11 border border-black/25 text-black text-[11px] font-bold tracking-[0.2em] uppercase flex items-center hover:border-black transition-colors"
            >
              HOW IT WORKS
            </Link>
          </div>
        </div>
      </section>

      {/* Pre-warm Turnstile token silently so /quote has it ready immediately */}
      <Turnstile
        siteKey={TURNSTILE_SITE_KEY}
        onSuccess={(token) => setCaptchaToken(token)}
        onError={() => { /* silent — QuotePreview falls back to its own widget */ }}
        onExpire={() => { /* silent */ }}
        options={{ size: 'invisible' }}
        style={{ display: 'none' }}
      />
    </div>
  );
}

/* ── Home Visual ──────────────────────────────────────────────────────────── */

function HomeVisual() {
  return (
    <div className="relative w-full max-w-[500px]">
      <svg viewBox="0 0 500 370" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        {/* Dot grid */}
        {Array.from({ length: 14 }).map((_, i) => (
          <line key={`h${i}`} x1="0" y1={i * 28} x2="500" y2={i * 28} stroke="#000" strokeWidth="0.4" opacity="0.06" />
        ))}
        {Array.from({ length: 18 }).map((_, i) => (
          <line key={`v${i}`} x1={i * 28} y1="0" x2={i * 28} y2="370" stroke="#000" strokeWidth="0.4" opacity="0.06" />
        ))}

        {/* Ground */}
        <line x1="30" y1="300" x2="470" y2="300" stroke="#000" strokeWidth="0.8" opacity="0.2" />

        {/* House body */}
        <rect x="120" y="170" width="260" height="130" fill="none" stroke="#000" strokeWidth="1.3" opacity="0.7" />

        {/* Roof */}
        <polyline points="100,172 250,70 400,172" fill="none" stroke="#000" strokeWidth="1.3" opacity="0.7" />
        <line x1="100" y1="172" x2="400" y2="172" stroke="#000" strokeWidth="0.7" opacity="0.3" />

        {/* Chimney */}
        <rect x="300" y="90" width="22" height="50" fill="none" stroke="#000" strokeWidth="1" opacity="0.45" />

        {/* Front door */}
        <rect x="218" y="232" width="64" height="68" fill="none" stroke="#000" strokeWidth="1" opacity="0.6" />
        <line x1="250" y1="232" x2="250" y2="300" stroke="#000" strokeWidth="0.5" opacity="0.3" />
        <circle cx="262" cy="268" r="2.5" fill="#000" opacity="0.4" />

        {/* Left window */}
        <rect x="138" y="192" width="52" height="44" fill="none" stroke="#000" strokeWidth="1" opacity="0.55" />
        <line x1="164" y1="192" x2="164" y2="236" stroke="#000" strokeWidth="0.5" opacity="0.3" />
        <line x1="138" y1="214" x2="190" y2="214" stroke="#000" strokeWidth="0.5" opacity="0.3" />

        {/* Right window */}
        <rect x="310" y="192" width="52" height="44" fill="none" stroke="#000" strokeWidth="1" opacity="0.55" />
        <line x1="336" y1="192" x2="336" y2="236" stroke="#000" strokeWidth="0.5" opacity="0.3" />
        <line x1="310" y1="214" x2="362" y2="214" stroke="#000" strokeWidth="0.5" opacity="0.3" />

        {/* Path to door */}
        <rect x="232" y="300" width="36" height="40" fill="none" stroke="#000" strokeWidth="0.6" opacity="0.2" />

        {/* Left tree */}
        <line x1="72" y1="300" x2="72" y2="214" stroke="#000" strokeWidth="1" opacity="0.3" />
        <ellipse cx="72" cy="196" rx="28" ry="36" fill="none" stroke="#000" strokeWidth="1" opacity="0.3" />
        <ellipse cx="72" cy="184" rx="18" ry="24" fill="none" stroke="#000" strokeWidth="0.6" opacity="0.2" />

        {/* Right tree */}
        <line x1="430" y1="300" x2="430" y2="206" stroke="#000" strokeWidth="1" opacity="0.3" />
        <ellipse cx="430" cy="188" rx="28" ry="36" fill="none" stroke="#000" strokeWidth="1" opacity="0.3" />
        <ellipse cx="430" cy="176" rx="18" ry="24" fill="none" stroke="#000" strokeWidth="0.6" opacity="0.2" />

        {/* Lawn mowing lines */}
        {[315, 330, 345, 360].map(y => (
          <line key={y} x1="120" y1={y} x2="380" y2={y} stroke="#000" strokeWidth="0.5" strokeDasharray="4 6" opacity="0.1" />
        ))}

        {/* Dimension lines */}
        <line x1="120" y1="322" x2="380" y2="322" stroke="#000" strokeWidth="0.5" opacity="0.15" />
        <line x1="120" y1="318" x2="120" y2="326" stroke="#000" strokeWidth="0.5" opacity="0.15" />
        <line x1="380" y1="318" x2="380" y2="326" stroke="#000" strokeWidth="0.5" opacity="0.15" />
        <text x="226" y="338" fontFamily="monospace" fontSize="7.5" fill="#000" opacity="0.2" textAnchor="middle">SERVICE AREA</text>

        {/* Status badge bottom-right */}
        <rect x="295" y="240" width="158" height="50" fill="#000" opacity="0.88" />
        <text x="306" y="258" fontFamily="monospace" fontSize="7.5" fill="white" opacity="0.7">LAST BOOKING: 2h AGO</text>
        <text x="306" y="272" fontFamily="monospace" fontSize="7.5" fill="white" opacity="0.7">SERVICE: GUTTER CLEAN</text>
        <text x="306" y="286" fontFamily="monospace" fontSize="7.5" fill="white" opacity="0.45">RATING: ★★★★★</text>
      </svg>

      {/* Floating badge */}
      <div className="absolute top-4 left-4 bg-white border border-black/15 px-3.5 py-2.5 shadow-sm">
        <p className="text-[10px] font-bold text-black tracking-[0.1em] uppercase">Available Now</p>
        <div className="flex items-center gap-1.5 mt-1">
          <div className="w-1.5 h-1.5 bg-black rounded-full animate-pulse" />
          <p className="text-[10px] font-mono text-black/55">23 PROS NEARBY</p>
        </div>
      </div>
    </div>
  );
}

/* ── Service Icons ───────────────────────────────────────────────────────── */

function GutterIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
      <path d="M2 4h12M2 4v8M14 4v8M2 12h12M6 4v3M10 4v3" opacity="0.7" />
    </svg>
  );
}

function WindowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
      <rect x="2" y="2" width="12" height="12" />
      <line x1="8" y1="2" x2="8" y2="14" />
      <line x1="2" y1="8" x2="14" y2="8" />
    </svg>
  );
}

function PressureIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
      <path d="M3 13l4-4M11 2l-2 2M7 5l2 1 1 2M4 10l1 2M8 4l-1 3 3 1" opacity="0.7" />
      <circle cx="11" cy="3" r="1.5" />
    </svg>
  );
}

function HouseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 7l6-5 6 5v7H2V7z" />
      <path d="M6 14v-5h4v5" />
    </svg>
  );
}

function DeepIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
      <circle cx="8" cy="8" r="5.5" />
      <circle cx="8" cy="8" r="2.5" />
      <line x1="8" y1="1" x2="8" y2="4" />
      <line x1="8" y1="12" x2="8" y2="15" />
      <line x1="1" y1="8" x2="4" y2="8" />
      <line x1="12" y1="8" x2="15" y2="8" />
    </svg>
  );
}

function LawnIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
      <line x1="2" y1="11" x2="14" y2="11" />
      <path d="M4 11V7M6 11V5M8 11V7M10 11V5M12 11V7" />
      <path d="M2 14h12" />
    </svg>
  );
}
