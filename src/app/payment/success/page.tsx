'use client';

import {
  Suspense,
  useEffect,
  useState,
} from 'react';

import {
  CheckCircle,
  Loader2,
  XCircle,
} from 'lucide-react'; // Assuming lucide-react for icons
import {
  useRouter,
  useSearchParams,
} from 'next/navigation';

import { Button } from '@/components/ui/Button';
import { createClient } from '@/lib/supabase/client';

function PaymentSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const session_id = searchParams.get('session_id');
  const [paymentStatus, setPaymentStatus] = useState<'loading' | 'success' | 'failed'>('loading');
  const [message, setMessage] = useState('Verifying your payment...');
  const supabase = createClient();

  useEffect(() => {
    const verifyPayment = async () => {
      if (!session_id) {
        setPaymentStatus('failed');
        setMessage('Payment session ID is missing.');
        return;
      }

      try {
        // We rely on the Stripe webhook to update the user's premium status in the database.
        // This page primarily confirms the session and provides user feedback.
        // A simple GET request to an API route could fetch the user's *current* premium status
        // from the database if needed for immediate UI update, but the webhook is the source of truth.

        // For demonstration, we'll simulate a check. In a real app, you might
        // have a /api/check-premium-status route that queries your database.
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setPaymentStatus('failed');
          setMessage('User not authenticated. Please log in.');
          return;
        }

        // Simulate fetching user's premium status after a short delay
        // In a real application, you would fetch from your database.
        const { data: userData, error: userError } = await supabase
          .from('profiles')
          .select('is_premium')
          .eq('id', user.id)
          .single();

        if (userError || !userData) {
          console.error('Error fetching user premium status:', userError);
          setPaymentStatus('failed');
          setMessage('Failed to retrieve premium status. Please contact support.');
          return;
        }

        if (userData.is_premium) {
          setPaymentStatus('success');
          setMessage('Payment successful! Your account has been upgraded to Premium.');
        } else {
          setPaymentStatus('failed');
          setMessage('Payment verification failed. Please try again or contact support.');
        }

      } catch (error) {
        console.error('Error verifying payment:', error);
        setPaymentStatus('failed');
        setMessage('An unexpected error occurred during payment verification.');
      }
    };

    verifyPayment();
  }, [session_id, router, supabase]);

  const handleGoToDashboard = () => {
    router.push('/templates'); // Redirect to templates page after successful payment
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl text-center max-w-md w-full">
        {paymentStatus === 'loading' && (
          <>
            <Loader2 className="animate-spin text-blue-500 mx-auto mb-4" size={48} />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Processing Payment...</h2>
            <p className="text-gray-600 dark:text-gray-400">{message}</p>
          </>
        )}
        {paymentStatus === 'success' && (
          <>
            <CheckCircle className="text-green-500 mx-auto mb-4" size={48} />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Payment Successful!</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{message}</p>
            <Button
              onClick={handleGoToDashboard}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out"
            >
              Continue to Templates
            </Button>
          </>
        )}
        {paymentStatus === 'failed' && (
          <>
            <XCircle className="text-red-500 mx-auto mb-4" size={48} />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Payment Failed</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{message}</p>
            <Button
              onClick={() => router.push('/pricing')}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out"
            >
              Try Again
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin mx-auto mb-4" size={48} />
          <p className="text-gray-600 dark:text-gray-400">Loading payment status...</p>
        </div>
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
}
