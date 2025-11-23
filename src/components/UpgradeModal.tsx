'use client';


import React, { useState } from 'react';
import toast from 'react-hot-toast';

import { X } from 'lucide-react'; // Assuming lucide-react for icons

import { Button } from '@/components/ui/Button';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const UpgradeModal: React.FC<UpgradeModalProps> = ({ isOpen, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [promoCode, setPromoCode] = useState('');
  const [redeeming, setRedeeming] = useState(false);

  if (!isOpen) return null;

  const handleUpgradeClick = async () => {
    // Use environment variable or fallback to default price ID
    const envPriceId = process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID;
    const DEFAULT_PRICE_ID = 'price_1SWVxVEXTLOxdWgMLE1igHr4';
    const OLD_PRICE_IDS = ['price_1RfIhREXTLOxdWgMKQJGzJzJ', 'price_1Ro7SxEXTLOxdWgM7s3Qs7ei'];
    
    const priceId = envPriceId && !OLD_PRICE_IDS.includes(envPriceId)
      ? envPriceId 
      : DEFAULT_PRICE_ID; // Fallback to default price ID
    
    console.log('🔍 DEBUG UpgradeModal: Env price ID:', envPriceId);
    console.log('🔍 DEBUG UpgradeModal: Using price ID:', priceId);

    if (!priceId) {
      setError('Payment configuration error. Please contact support.');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ priceId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create checkout session.');
      }

      const { url } = await response.json();
      if (url) {
        // Redirect to Stripe Checkout
        window.location.href = url;
      } else {
        throw new Error('No checkout URL received.');
      }
    } catch (err: any) {
      console.error('Stripe checkout error:', err);
      setError(`Payment initiation failed: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRedeem = async () => {
    if (!promoCode.trim()) {
      toast.error('Enter a code first');
      return;
    }
    setRedeeming(true);
    setError(null);
    try {
      const res = await fetch('/api/redeem-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: promoCode.trim() })
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Invalid or expired code');
      }
      toast.success('✅ Premium unlocked via code');
      // Trigger cross-tab refresh
      localStorage.setItem('premium_status_updated', Date.now().toString());
      onClose();
    } catch (e:any) {
      console.error('Redeem error:', e);
      setError(e.message);
      toast.error(e.message);
    } finally {
      setRedeeming(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4 relative dark:bg-gray-900">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
          <X size={24} />
        </button>
        <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center dark:text-white">Upgrade to Premium</h2>
        <p className="text-gray-700 mb-6 text-center dark:text-gray-300">Unlock all powerful AI features and advanced templates!</p>

        <div className="space-y-6">
          <div className="border border-blue-200 rounded-lg p-4 bg-blue-50 dark:bg-blue-950 dark:border-blue-800">
            <h3 className="text-xl font-semibold text-blue-800 dark:text-blue-200">Premium Plan</h3>
            <p className="text-gray-700 dark:text-gray-300">Access to unlimited AI suggestions, premium templates, and advanced analytics.</p>
            <p className="text-2xl font-bold text-blue-600 mt-2 dark:text-blue-400">$9.99 / month</p>
            <Button
              onClick={handleUpgradeClick}
              disabled={isLoading}
              className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out"
            >
              {isLoading ? 'Processing...' : 'Go Premium'}
            </Button>
          </div>
          <div className="border border-teal-200 rounded-lg p-4 bg-teal-50 dark:bg-teal-950 dark:border-teal-800">
            <h3 className="text-lg font-semibold text-teal-800 dark:text-teal-200">Have a Promo / Access Code?</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Enter it below to unlock Premium without checkout.</p>
            <div className="flex gap-2">
              <input
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder="ENTER CODE"
                className="flex-1 px-3 py-2 rounded-md border border-teal-300 bg-white dark:bg-gray-800 dark:border-teal-700 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <Button
                onClick={handleRedeem}
                disabled={redeeming}
                className="bg-teal-600 hover:bg-teal-700 text-white font-semibold px-4 py-2 rounded-md"
              >
                {redeeming ? 'Redeeming...' : 'Redeem'}
              </Button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">Codes are single-use and may expire.</p>
          </div>
          {/* You can add more plans here if needed */}
        </div>

        {error && (
          <p className="text-red-500 text-sm mt-4 text-center">{error}</p>
        )}
      </div>
    </div>
  );
};

export default UpgradeModal;
