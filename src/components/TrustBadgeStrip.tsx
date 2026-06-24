export function getAvailabilityMessage(): string {
  const day = new Date().getDay(); // 0=Sun, 1=Mon, ..., 6=Sat
  if (day === 1 || day === 2) return 'Good availability this week';
  if (day === 3 || day === 4) return 'Filling up fast this week';
  return 'Limited slots remaining';
}

const BADGES = [
  {
    name: 'Google',
    href: 'https://share.google/003v3ioshqM78T8tO',
    rating: '4.9',
    count: '34 reviews',
    logo: (
      <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
      </svg>
    ),
  },
  {
    name: 'Yelp',
    href: 'https://www.yelp.com/biz/lintel-bethesda',
    rating: '4.8',
    count: '12 reviews',
    logo: (
      <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" fill="#FF1A1A">
        <path d="M12.14 13.34l-2.01.78c-.56.22-.81.86-.56 1.41l2.8 6.44c.26.59.97.82 1.55.49l.61-.35c2.14-1.23 3.62-3.31 4.04-5.72l.12-.71c.1-.6-.36-1.14-.97-1.14h-4.72c-.3 0-.58.12-.86.22v-.42zM10.36 11.5l-6.7-1.97c-.6-.17-1.2.21-1.3.83l-.1.68C1.96 13.81 3.07 16.62 5 18.65l.51.53c.43.44 1.15.41 1.54-.06l3.97-5.06c.19-.24.28-.54.28-.84 0-.75-.42-1.41-1-1.72h.06zM13 11c.28 0 .55-.06.8-.17l4.4-5.3c.38-.46.28-1.14-.21-1.47l-.59-.4C15.43 2.59 12.8 2 10.19 2.43l-.7.12c-.59.1-.95.68-.78 1.26l1.98 6.71c.22.74.91 1.26 1.66 1.48H13zM11.34 12.34c-.08-.22-.13-.45-.13-.69 0-.37.1-.72.29-1.02L9.12 4.42c-.19-.63-.87-.95-1.47-.66l-.61.3C4.91 5.3 3.42 7.39 3 9.8l-.12.71c-.1.61.36 1.15.97 1.15h6.82c.28 0 .54-.11.67-.32z"/>
      </svg>
    ),
  },
  {
    name: 'Nextdoor',
    href: 'https://nextdoor.com/page/lintel-bethesda-md/',
    rating: '5.0',
    count: 'recommended',
    logo: (
      <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" fill="#8BC34A">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/>
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
      </svg>
    ),
  },
];

export function TrustBadgeStrip() {
  return (
    <div className="border-b border-black/10 bg-white">
      <div className="max-w-7xl mx-auto px-6 py-4 flex flex-wrap items-center justify-center gap-6 sm:gap-10">
        {BADGES.map(({ name, href, rating, count, logo }) => (
          <a
            key={name}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 group hover:opacity-80 transition-opacity"
          >
            <span className="flex-shrink-0">{logo}</span>
            <div>
              <div className="flex items-center gap-1">
                <span className="text-[11px] font-bold text-black tracking-wide">{name}</span>
                <span className="text-[10px] font-mono text-black/50 ml-1">{rating} ★★★★★</span>
              </div>
              <p className="text-[10px] font-mono text-black/35 leading-none mt-0.5">{count}</p>
            </div>
          </a>
        ))}
        <div className="hidden sm:flex items-center gap-2 border-l border-black/10 pl-6 sm:pl-10">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#008060]" aria-hidden="true">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
          <div>
            <p className="text-[11px] font-bold text-black tracking-wide">$1M Insured</p>
            <p className="text-[10px] font-mono text-black/35 leading-none mt-0.5">every job</p>
          </div>
        </div>
      </div>
    </div>
  );
}
