import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { formatCurrency } from '../lib/utils';

interface ContractSignPanelProps {
  amount: number;
  serviceName: string;
  address: string;
  recurringInterval?: 3 | 6 | 12 | null;
  loading: boolean;
  onSign: (signerName: string, agreementVersion: string) => void;
}

function getAgreementVersion(recurringInterval?: 3 | 6 | 12 | null, isBundle?: boolean): string {
  if (isBundle) return '2026-v1-bundle';
  if (recurringInterval) return `2026-v1-recurring-${recurringInterval}mo`;
  return '2026-v1-onetime';
}

export function ContractSignPanel({
  amount,
  serviceName,
  address,
  recurringInterval,
  loading,
  onSign,
}: ContractSignPanelProps) {
  const [name, setName] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [nameError, setNameError] = useState('');
  const [agreeError, setAgreeError] = useState('');

  const isRecurring = !!recurringInterval;
  const agreementVersion = getAgreementVersion(recurringInterval);
  const shortAddress = address.split(',').slice(0, 2).join(',');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let valid = true;
    if (!name.trim()) {
      setNameError('Please enter your full name.');
      valid = false;
    } else {
      setNameError('');
    }
    if (!agreed) {
      setAgreeError('You must agree to the terms before booking.');
      valid = false;
    } else {
      setAgreeError('');
    }
    if (!valid) return;
    onSign(name.trim(), agreementVersion);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Key terms summary */}
      <div className="bg-uber-gray-50 rounded-lg px-4 py-3 space-y-1.5 text-sm">
        <div className="flex justify-between">
          <span className="text-uber-gray-500">Amount due</span>
          <span className="font-bold text-black">
            {formatCurrency(amount)}{isRecurring ? ' / visit' : ''}
          </span>
        </div>
        {isRecurring && (
          <div className="flex justify-between">
            <span className="text-uber-gray-500">Commitment</span>
            <span className="font-bold text-black">12 months minimum</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-uber-gray-500">Same-day cancellation</span>
          <span className="font-bold text-black">$40 fee</span>
        </div>
        <div className="flex justify-between">
          <span className="text-uber-gray-500">Payment method</span>
          <span className="text-black">Cash, check, or Venmo on-site</span>
        </div>
      </div>

      {/* Name field */}
      <div>
        <label className="block text-sm font-semibold text-black mb-1">Your full name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => { setName(e.target.value); if (e.target.value.trim()) setNameError(''); }}
          placeholder="Jane Smith"
          className="w-full h-12 px-4 bg-uber-gray-50 rounded-lg text-sm text-black placeholder-uber-gray-400 outline-none focus:bg-uber-gray-100 transition-colors"
        />
        {nameError && <p className="text-red-500 text-xs mt-1">{nameError}</p>}
      </div>

      {/* Agreement checkbox */}
      <div>
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => { setAgreed(e.target.checked); if (e.target.checked) setAgreeError(''); }}
            className="mt-0.5 h-4 w-4 rounded border-uber-gray-300 accent-black flex-shrink-0"
          />
          <span className="text-sm text-uber-gray-700 leading-snug">
            {isRecurring ? (
              <>
                I agree to pay <strong className="text-black">{formatCurrency(amount)} per visit</strong> for{' '}
                <strong className="text-black">{serviceName}</strong> at <strong className="text-black">{shortAddress}</strong>,
                collected after each visit, for a <strong className="text-black">minimum term of 12 months</strong>.
                Same-day cancellations are subject to a <strong className="text-black">$40 fee</strong>.
                I have read and agree to Lintel's{' '}
                <Link to="/terms" target="_blank" className="underline underline-offset-2 text-black hover:text-uber-gray-600">
                  Terms of Service
                </Link>
                , including the Recurring Service Commitment and Cancellation Policy.
              </>
            ) : (
              <>
                I agree to pay <strong className="text-black">{formatCurrency(amount)}</strong> upon completion of{' '}
                <strong className="text-black">{serviceName}</strong> at <strong className="text-black">{shortAddress}</strong>.
                Same-day cancellations are subject to a <strong className="text-black">$40 fee</strong>.
                I have read and agree to Lintel's{' '}
                <Link to="/terms" target="_blank" className="underline underline-offset-2 text-black hover:text-uber-gray-600">
                  Terms of Service
                </Link>
                .
              </>
            )}
          </span>
        </label>
        {agreeError && <p className="text-red-500 text-xs mt-1 ml-7">{agreeError}</p>}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full h-14 bg-black text-white font-bold text-base rounded-xl flex items-center justify-center gap-2 hover:bg-uber-gray-800 transition-colors disabled:bg-uber-gray-200 disabled:text-uber-gray-400 disabled:cursor-not-allowed"
      >
        {loading ? (
          <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</>
        ) : (
          'Sign & Book →'
        )}
      </button>

      <p className="text-xs text-center text-uber-gray-400">
        Your electronic signature is legally binding under the U.S. E-SIGN Act.
      </p>
    </form>
  );
}
