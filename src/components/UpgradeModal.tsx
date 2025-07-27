import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { X } from 'lucide-react'; // Assuming lucide-react for icons

interface UpgradeModalProps {https://gemini.google.com
  isOpen: boolean;
  onClose: () => void;
}

const UpgradeModal: React.FC<UpgradeModalProps> = ({ isOpen, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleUpgradeClick = async (priceId: string) => {
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4 relative dark:bg-gray-900">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
          <X size={24} />
        </button>
        <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center dark:text-white">Upgrade to Premium</h2>
        <p className="text-gray-700 mb-6 text-center dark:text-gray-300">Unlock all powerful AI features and advanced templates!</p>

        <div className="space-y-4">
          <div className="border border-blue-200 rounded-lg p-4 bg-blue-50 dark:bg-blue-950 dark:border-blue-800">
            <h3 className="text-xl font-semibold text-blue-800 dark:text-blue-200">Premium Plan</h3>
            <p className="text-gray-700 dark:text-gray-300">Access to unlimited AI suggestions, premium templates, and advanced analytics.</p>
            <p className="text-2xl font-bold text-blue-600 mt-2 dark:text-blue-400">$9.99 / month</p>
            <Button
              onClick={() => handleUpgradeClick('price_12345')} // Replace with your actual Stripe Price ID
              disabled={isLoading}
              className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out"
            >
              {isLoading ? 'Processing...' : 'Go Premium'}
            </Button>
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
