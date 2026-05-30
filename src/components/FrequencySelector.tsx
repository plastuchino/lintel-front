import { cn, formatCurrency } from '../lib/utils';

interface Props {
  basePrice: number;
  value: null | 3 | 6 | 12;
  onChange: (interval: null | 3 | 6 | 12) => void;
}

const OPTIONS = [
  { interval: null,  label: 'One-time',        discount: 0,    badge: null },
  { interval: 3,     label: 'Every 3 months',  discount: 0.25, badge: null },
  { interval: 6,     label: 'Every 6 months',  discount: 0.20, badge: 'Most Popular' },
  { interval: 12,    label: 'Every 12 months', discount: 0.15, badge: null },
] as const;

export function FrequencySelector({ basePrice, value, onChange }: Props) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-semibold text-black">Service frequency</p>
      <div className="grid grid-cols-2 gap-2">
        {OPTIONS.map((opt) => {
          const selected = value === opt.interval;
          const discountedPrice = basePrice * (1 - opt.discount);
          const isMostPopular = opt.badge === 'Most Popular';

          return (
            <button
              key={String(opt.interval)}
              type="button"
              onClick={() => onChange(opt.interval as null | 3 | 6 | 12)}
              className={cn(
                'relative flex flex-col items-start p-3 rounded-xl border-2 text-left transition-all',
                selected
                  ? isMostPopular
                    ? 'border-uber-green bg-green-50'
                    : 'border-black bg-uber-gray-50'
                  : isMostPopular
                    ? 'border-uber-green/40 hover:border-uber-green'
                    : 'border-uber-gray-200 hover:border-uber-gray-400',
              )}
            >
              {isMostPopular && (
                <span className="absolute -top-2.5 left-3 bg-uber-green text-white text-[10px] font-bold px-2 py-0.5 rounded-full tracking-wide">
                  Most Popular
                </span>
              )}

              <span className={cn(
                'text-xs font-semibold leading-tight',
                selected ? 'text-black' : 'text-uber-gray-600',
              )}>
                {opt.label}
              </span>

              {opt.discount > 0 ? (
                <span className={cn(
                  'mt-1 text-[11px] font-bold',
                  selected ? 'text-uber-green' : 'text-uber-green/80',
                )}>
                  {Math.round(opt.discount * 100)}% off — {formatCurrency(discountedPrice)}
                </span>
              ) : (
                <span className={cn(
                  'mt-1 text-[11px]',
                  selected ? 'text-black font-bold' : 'text-uber-gray-500',
                )}>
                  {formatCurrency(basePrice)}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
