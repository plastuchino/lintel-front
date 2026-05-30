import { useState } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { CreditCard } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { users } from '../lib/api';
import type { SavedCard } from '../lib/api';
import { StripePayment } from './StripePayment';
import { stripePromise } from '../lib/stripe';

const APPEARANCE = {
  theme: 'stripe' as const,
  variables: { colorPrimary: '#000000', fontFamily: 'Inter, system-ui, sans-serif' },
};

interface PaymentPanelProps {
  amount: number;
  label: string;
  loading?: boolean;
  disabled?: boolean;
  // undefined = charge saved card server-side; string = new card paymentMethodId
  onPay: (paymentMethodId?: string) => Promise<void>;
  onError: (error: string) => void;
}

export function PaymentPanel({ amount, label, loading, disabled, onPay, onError }: PaymentPanelProps) {
  const [useNewCard, setUseNewCard] = useState(false);
  const [paying, setPaying] = useState(false);

  const { data: savedCardData } = useQuery({
    queryKey: ['saved-card'],
    queryFn: () => users.getSavedCard().then((r) => r.data.card),
  });

  const savedCard: SavedCard | null = savedCardData ?? null;
  const showForm = useNewCard || !savedCard;
  const isLoading = loading || paying;
  const isDisabled = isLoading || disabled;

  const call = async (paymentMethodId?: string) => {
    setPaying(true);
    try {
      await onPay(paymentMethodId);
    } catch (err: unknown) {
      const data = (err as { response?: { data?: { error?: string; message?: string } } })?.response?.data;
      if (data?.error === 'card_expired') {
        setUseNewCard(true);
        onError(data.message ?? 'Your saved card has expired. Please add a new card.');
      } else {
        onError(data?.message ?? 'Payment failed. Please try again.');
      }
    } finally {
      setPaying(false);
    }
  };

  if (!showForm && savedCard) {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-3 bg-uber-gray-50 rounded-xl px-4 h-14">
          <CreditCard className="w-5 h-5 text-uber-gray-400 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-black capitalize">
              {savedCard.brand} •••• {savedCard.last4}
            </p>
            <p className="text-xs text-uber-gray-400">
              Expires {savedCard.exp_month}/{savedCard.exp_year}
            </p>
          </div>
        </div>
        <button
          onClick={() => call()}
          disabled={isDisabled}
          className="w-full h-14 bg-black text-white font-bold text-base rounded-xl flex items-center justify-center hover:bg-uber-gray-800 transition-colors disabled:bg-uber-gray-200 disabled:text-uber-gray-400 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Processing...' : label}
        </button>
        {/* <p className='text-center text-sm'>Not charged until the service is complete</p> */}
        <button
          onClick={() => setUseNewCard(true)}
          className="w-full text-sm text-uber-gray-500 hover:text-black transition-colors py-1"
        >
          Use a different card
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {savedCard && (
        <button
          onClick={() => setUseNewCard(false)}
          className="text-sm text-uber-gray-500 hover:text-black transition-colors"
        >
          ← Use saved card
        </button>
      )}
      <Elements
        stripe={stripePromise}
        options={{
          mode: 'payment',
          amount: Math.round(amount * 100),
          currency: 'usd',
          paymentMethodCreation: 'manual',
          appearance: APPEARANCE,
        }}
      >
        <StripePayment
          amount={amount}
          onSuccess={(pmId) => call(pmId)}
          onError={onError}
          submitLabel={isLoading ? 'Processing...' : label}
        />
      </Elements>
    </div>
  );
}
