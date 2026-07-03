import type { CommercialClient } from '../data/commercialClients';

interface TrustedByCarouselProps {
  clients: CommercialClient[];
  className?: string;
}

function ClientChip({ client }: { client: CommercialClient }) {
  return (
    <div className="flex-shrink-0 flex items-center justify-center h-16 px-10">
      {client.logo ? (
        <img src={client.logo} alt={client.name} className="max-h-10 w-auto object-contain opacity-70" />
      ) : (
        <span className="text-black/40 text-xl font-black uppercase tracking-wide whitespace-nowrap">{client.name}</span>
      )}
    </div>
  );
}

export function TrustedByCarousel({ clients, className }: TrustedByCarouselProps) {
  if (clients.length === 0) return null;

  return (
    <div className={`border-y border-black/10 bg-white overflow-hidden ${className ?? ''}`}>
      <div className="max-w-7xl mx-auto px-6 py-6">
        <p className="text-center text-[10px] font-mono text-black/35 tracking-[0.2em] uppercase mb-4">Trusted By</p>
        <div className="trusted-by-marquee-viewport overflow-hidden">
          <div className="trusted-by-marquee-track flex items-center">
            {clients.map((client, i) => (
              <ClientChip key={`${client.name}-a-${i}`} client={client} />
            ))}
            {clients.map((client, i) => (
              <ClientChip key={`${client.name}-b-${i}`} client={client} />
            ))}
          </div>
        </div>
      </div>
      <style>{`
        .trusted-by-marquee-track {
          width: max-content;
          animation: trusted-by-scroll 24s linear infinite;
        }
        .trusted-by-marquee-viewport:hover .trusted-by-marquee-track,
        .trusted-by-marquee-viewport:focus-within .trusted-by-marquee-track {
          animation-play-state: paused;
        }
        @keyframes trusted-by-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .trusted-by-marquee-track { animation: none; }
        }
      `}</style>
    </div>
  );
}
