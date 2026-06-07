import { Link } from 'react-router-dom';
import logo from '../assets/logo.jpeg';

export function Footer() {
  return (
    <footer className="bg-black border-t border-white/10 py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row gap-12 mb-14">
          {/* Brand */}
          <div className="md:w-56">
            <div className="flex items-center gap-2.5 mb-4">
              <img src={logo} alt="lintel" className="h-7 w-7 rounded-full object-cover" />
              <span className="text-white text-sm font-bold tracking-[0.15em] uppercase">LINTEL</span>
            </div>
            <p className="text-white/35 text-[12px] leading-relaxed">
              Home services by students. Fully insured, background-checked, and satisfaction guaranteed — every time.
            </p>
          </div>

          {/* Link columns */}
          <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { heading: 'SERVICES', links: [['Gutter Cleaning', '/services/gutter-cleaning'], ['Window Cleaning', '/services/window-cleaning'], ['Pressure Washing', '/services/pressure-washing'], ['House Cleaning', '/login'], ['Lawn Mowing', '/login']] },
              { heading: 'HOMEOWNERS', links: [['How It Works', '#trust'], ['Pricing', '/login'], ['Book a Service', '/login'], ['Track Your Job', '/login']] },
              { heading: 'STUDENTS', links: [['Become a Pro', '/worker/register'], ['How Payouts Work', '/worker/register'], ['Requirements', '/worker/register']] },
              { heading: 'COMPANY', links: [['Blog', '/blog'], ['How We Price', '/pricing'], ['Terms of Use', '/terms'], ['Privacy Policy', '/privacy'], ['Support', '/login']] },
            ].map(({ heading, links }) => (
              <div key={heading}>
                <p className="text-white/40 text-[10px] font-semibold tracking-[0.2em] uppercase mb-4 font-mono">{heading}</p>
                <div className="space-y-2.5">
                  {links.map(([label, href]) => (
                    href.startsWith('/') ? (
                      <Link key={label} to={href} className="block text-white/35 text-[12px] hover:text-white/70 transition-colors">{label}</Link>
                    ) : (
                      <a key={label} href={href} className="block text-white/35 text-[12px] hover:text-white/70 transition-colors">{label}</a>
                    )
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-6 border-t border-white/8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <p className="text-white/20 text-[11px] font-mono">© 2026 LINTEL · ALL RIGHTS RESERVED</p>
          <p className="text-white/15 text-[11px] font-mono">INSURED · BACKGROUND CHECKED · 4.9★ NETWORK</p>
        </div>
      </div>
    </footer>
  );
}
