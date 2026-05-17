import { loadStripe } from '@stripe/stripe-js';

const stripeKey = window.location.hostname === 'localhost'
  ? import.meta.env.VITE_STRIPE_PUBLIC_KEY
  : import.meta.env.VITE_STRIPE_PUBLIC_KEY_PROD;

export const stripePromise = loadStripe(stripeKey ?? '');
