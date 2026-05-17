import { Wind, Droplets, Sparkles, Home, Scissors, Check, Loader2 } from 'lucide-react';
import { cn, formatCurrency } from '../lib/utils';
import type { Service, ServiceType } from '../lib/api';

export const SERVICE_ICONS: Record<ServiceType, React.ElementType> = {
  'gutter-cleaning': Wind,
  'window-cleaning': Droplets,
  'window-cleaning-interior': Droplets,
  'pressure-washing': Sparkles,
  'house-cleaning-standard': Home,
  'house-cleaning-deep': Sparkles,
  'lawn-mowing': Scissors,
};

interface ServiceCardProps {
  service: Service;
  selected?: boolean;
  comingSoon?: boolean;
  discountedPrice?: number;
  priceLoading?: boolean;
  onClick: () => void;
}

export function ServiceCard({ service, selected, comingSoon, discountedPrice, priceLoading, onClick }: ServiceCardProps) {
  const Icon = SERVICE_ICONS[service.id] ?? Home;
  const showDiscount = discountedPrice !== undefined && discountedPrice !== service.price;

  return (
    <button
      onClick={onClick}
      disabled={comingSoon}
      className={cn(
        'w-full flex items-center gap-4 px-4 py-4 rounded-xl border-2 text-left transition-all duration-150 relative overflow-hidden',
        comingSoon
          ? 'border-uber-gray-100 bg-uber-gray-50 cursor-not-allowed opacity-60'
          : cn(
            'hover:bg-uber-gray-50 active:scale-[0.99]',
            selected ? 'border-black bg-white' : 'border-uber-gray-200 bg-white'
          )
      )}
    >
      {comingSoon && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <span className="bg-black text-white text-[10px] font-bold uppercase tracking-[0.15em] px-3 py-1.5 rounded-full shadow-lg">
            Coming soon
          </span>
        </div>
      )}
      <div className={cn(
        'w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors relative',
        comingSoon ? 'bg-uber-gray-100' : selected ? 'bg-black' : 'bg-uber-gray-100'
      )}>
        <Icon className={cn('w-6 h-6', !comingSoon && selected ? 'text-white' : 'text-uber-gray-400')} />
        {selected && !comingSoon && (
          <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-uber-green rounded-full flex items-center justify-center shadow-sm">
            <Check className="w-3 h-3 text-white" strokeWidth={3} />
          </span>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-bold text-black text-base leading-tight">{service.name}</p>
        </div>
        <p className="text-uber-gray-500 text-sm mt-0.5 truncate">{service.description}</p>
        <p className="text-uber-gray-400 text-xs mt-1">{service.duration}</p>
      </div>

      <div className="text-right flex-shrink-0 min-w-[64px]">
        {priceLoading ? (
          <Loader2 className="w-4 h-4 animate-spin text-uber-gray-400 ml-auto" />
        ) : showDiscount ? (
          <>
            <p className="text-uber-gray-400 text-sm line-through leading-tight">{formatCurrency(service.price)}</p>
            <p className="font-bold text-uber-green text-lg leading-tight">{formatCurrency(discountedPrice!)}</p>
          </>
        ) : (
          <p className="font-bold text-black text-lg">{formatCurrency(service.price)}</p>
        )}
      </div>
    </button>
  );
}
