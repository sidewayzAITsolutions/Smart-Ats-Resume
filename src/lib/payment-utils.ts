import toast from 'react-hot-toast';
import { createClient } from '@/lib/supabase/client';

export interface CheckoutSessionData {
  successUrl?: string;
  cancelUrl?: string;
  priceId?: string;
  addOn?: string;
}

export interface CheckoutResponse {
  url: string;
  sessionId: string;
}

/**
 * Checks if user is authenticated
 * @returns Promise<boolean> - true if authenticated, false otherwise
 */
export const checkAuthStatus = async () => {
  try {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    return { isAuthenticated: !!session };
  } catch (error) {
    console.error('Error checking auth status:', error);
    return { isAuthenticated: false };
  }
};

/**
 * Redirects to sign in page with callback URL
 * @param callbackUrl - URL to return to after sign in
 */
export const redirectToSignIn = (callbackUrl: string): void => {
  const encodedCallback = encodeURIComponent(callbackUrl);
  window.location.href = `/auth/signin?callbackUrl=${encodedCallback}`;
};

/**
 * Creates a Stripe checkout session and redirects to checkout
 * @param data - Checkout session configuration
 * @returns Promise that resolves when checkout is initiated
 */
export const createCheckoutSession = async (data?: CheckoutSessionData): Promise<void> => {
  try {
    console.log('Creating checkout session');

    // Check authentication before making API call
    const isAuthenticated = await checkAuthStatus();
    if (!isAuthenticated.isAuthenticated) {
      toast.error('Please sign in to continue with your purchase');
      redirectToSignIn('/pricing');
      return;
    }

    // Allow caller to supply a specific priceId (e.g., Sprint Pass) or fall back to env
    const priceId = data?.priceId || process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID;
    if (!priceId) {
      toast.error('Payment configuration error. Please contact support.');
      throw new Error('No Stripe price ID configured');
    }

    // Create checkout session
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        priceId: priceId,
        addOn: data?.addOn,
        successUrl: data?.successUrl || `${window.location.origin}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: data?.cancelUrl || `${window.location.origin}/pricing?canceled=true`,
      }),
    });

    const responseData = await response.json();

    if (!response.ok) {
      console.error('Checkout session error:', responseData.error);

      // Handle authentication errors specifically
      if (response.status === 401) {
        toast.error('Please sign in to continue with your purchase');
        redirectToSignIn('/pricing');
        return;
      }

      throw new Error(responseData.error || 'Failed to create checkout session');
    }

    if (!responseData.url) {
      throw new Error('No checkout URL received');
    }

    console.log('Checkout session created successfully');
    console.log('Redirecting to:', responseData.url);

    // Redirect to Stripe Checkout
    window.location.href = responseData.url;

  } catch (error: any) {
    console.error('Error creating checkout session:', error);
    toast.error(error.message || 'Failed to start checkout process');
    throw error;
  }
};

/**
 * Handles Pro plan checkout with predefined settings
 * @param planName - Name of the plan for loading state
 * @param setLoading - Loading state setter
 * @param setSelectedPlan - Selected plan state setter
 */
export const handleProPlanCheckout = async (
  planName: string,
  setLoading: (loading: boolean) => void,
  setSelectedPlan: (plan: string) => void
): Promise<void> => {
  setLoading(true);
  setSelectedPlan(planName);

  try {
    // Check authentication first
    const isAuthenticated = await checkAuthStatus();
    if (!isAuthenticated.isAuthenticated) {
      toast.error('Please sign in to upgrade to Pro');
      redirectToSignIn('/pricing');
      setLoading(false);
      setSelectedPlan('');
      return;
    }

    await createCheckoutSession({
      successUrl: `${window.location.origin}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${window.location.origin}/pricing?canceled=true`,
    });

  } catch (error) {
    // Error handling is done in createCheckoutSession
    setLoading(false);
    setSelectedPlan('');
  }
};

/**
 * Handles free plan selection
 * @param router - Next.js router instance
 */
export const handleFreePlan = async (router: any): Promise<void> => {
  // Check if user is authenticated for free plan
  const isAuthenticated = await checkAuthStatus();
  if (!isAuthenticated.isAuthenticated) {
    toast('Please sign in to get started with the free plan');
    redirectToSignIn('/builder');
    return;
  }

  toast.success('Free plan selected!');
  router.push('/builder');
};

/**
 * Generic plan selection handler
 * @param planName - Name of the selected plan
 * @param router - Next.js router instance
 * @param setLoading - Loading state setter
 * @param setSelectedPlan - Selected plan state setter
 */
export const handlePlanSelection = async (
  planName: string,
  router: any,
  setLoading: (loading: boolean) => void,
  setSelectedPlan: (plan: string) => void
): Promise<void> => {
  switch (planName) {
    case 'Free':
      await handleFreePlan(router);
      break;
    case 'Pro':
      await handleProPlanCheckout(planName, setLoading, setSelectedPlan);
      break;
    default:
      console.warn(`Unknown plan: ${planName}`);
      toast.error('Unknown plan selected');
  }
};

/**
 * Validates environment variables for Stripe integration
 */
export const validateStripeConfig = (): boolean => {
  const priceId = process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID;

  if (!priceId) {
    console.error('NEXT_PUBLIC_STRIPE_PRO_PRICE_ID is not configured');
    toast.error('Payment configuration error. Please contact support.');
    return false;
  }

  return true;
};
