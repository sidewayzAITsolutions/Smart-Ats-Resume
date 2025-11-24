'use client';
import React, { useEffect, useState } from 'react';
import { ArrowRight, Check, Crown, FileText, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Image from 'next/image';

import GlobalNavigation from '@/components/GlobalNavigation';
import { createClient } from '@/lib/supabase/client';

export const dynamic = 'force-dynamic';

const PricingPage = () => {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('');
  const [userData, setUserData] = useState<any>(null);
  const [userLoading, setUserLoading] = useState(true);

  // Admin premium override
  const [adminCode, setAdminCode] = useState('');
  const [adminLoading, setAdminLoading] = useState(false);

  // Check user authentication and get user data
  useEffect(() => {
    const checkUserData = async () => {
      try {
        setUserLoading(true);
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError) {
          console.error('Auth error:', authError);
          setUserData(null);
          setUserLoading(false);
          return;
        }

        if (!user) {
          console.log("No authenticated user found");
          setUserData(null);
          setUserLoading(false);
          return;
        }

        // Get user profile data
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (profileError) {
          console.error("Error fetching user profile:", profileError);
          setUserData({
            email: user.email || "",
            name: user.user_metadata?.full_name || "User",
            isPremium: false
          });
        } else {
          setUserData({
            email: profile?.email || user.email || "",
            name: profile?.full_name || user.user_metadata?.full_name || "User",
            isPremium: profile?.is_premium || false,
            user: user
          });
        }
        setUserLoading(false);
      } catch (error) {
        console.error("Error checking user status:", error);
        setUserData(null);
        setUserLoading(false);
      }
    };

    checkUserData();
  }, []);

  const pricingTiers = [
    {
      name: 'Free',
      price: 0,
      period: 'forever',
      mascotImage: '/Donkey1.png',
      description: 'Perfect for getting started',
      features: [
        'Basic resume builder',
        'ATS score checker',
        '3 basic templates',
        'PDF download',
        'Basic keyword optimization'
      ],
      highlighted: false,
      buttonText: 'Start Building Now',
      priceId: null
    },
    {
      name: 'Pro Monthly',
      price: 22,
      period: 'month',
      mascotImage: '/Donkey2.png',
      description: 'Most popular for job seekers',
      features: [
        'Everything in Free',
        'All premium templates',
        'AI-powered optimization',
        'Unlimited downloads',
        'Advanced ATS analysis',
        'Job description scanner',
        'Priority email support',
        'Resume analytics'
      ],
      highlighted: true,
      buttonText: 'Start Pro Monthly',
      priceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID
    },
    {
      name: 'Pro Yearly',
      price: 200,
      period: 'year',
      mascotImage: '/Donkey4.png',
      description: 'Best value - Save $64/year',
      features: [
        'Everything in Free',
        'All premium templates',
        'AI-powered optimization',
        'Unlimited downloads',
        'Advanced ATS analysis',
        'Job description scanner',
        'Priority email support',
        'Resume analytics',
        '2 months free compared to monthly'
      ],
      highlighted: false,
      buttonText: 'Start Pro Yearly',
      priceId: process.env.NEXT_PUBLIC_STRIPE_PRO_YEARLY_PRICE_ID,
      savings: 'Save $64'
    }
  ];

  const createCheckoutSession = async (priceId: string): Promise<void> => {
    try {
      // Check if user is authenticated first
      const { data: { user }, error: authError } = await supabase.auth.getUser();

      if (authError || !user) {
        toast.error('Please sign in to continue with your purchase.');
        router.push('/login?redirectTo=/pricing');
        return;
      }

      if (!priceId) {
        console.error('Price ID is not configured');
        toast.error('Payment configuration error. Please contact support.');
        return;
      }

      console.log('Creating checkout session with priceId:', priceId);

      // Create checkout session
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: priceId,
          successUrl: `${window.location.origin}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: `${window.location.origin}/pricing?canceled=true`,
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        console.error('Checkout session error:', responseData.error);

        if (response.status === 401) {
          toast.error('Please sign in to continue with your purchase.');
          router.push('/login?redirectTo=/pricing');
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

  const handlePlanSelect = async (planName: string, priceId: string | null) => {
    // Check if user is authenticated for paid plans
    if ((planName === 'Pro Monthly' || planName === 'Pro Yearly') && !userData) {
      toast.error('Please sign in to subscribe to Pro plan.');
      router.push('/login?redirectTo=/pricing');
      return;
    }

    setLoading(true);
    setSelectedPlan(planName);

    try {
      if (planName === 'Free') {
        toast.success('Free plan selected!');
        router.push('/builder');
      } else if (priceId) {
        await createCheckoutSession(priceId);
      } else {
        console.warn(`No price ID for plan: ${planName}`);
        toast.error('Payment configuration error. Please contact support.');
      }
    } catch (error) {
      // Error handling is done in createCheckoutSession
    } finally {
      setLoading(false);
      setSelectedPlan('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <GlobalNavigation
        userData={userData}
        showBuilderActions={false}
        showMainNav={true}
        showAuthButtons={true}
      />

      <div className="container mx-auto px-4 py-16">
        {/* Hero Section with Mascot */}
        <div className="text-center mb-16 relative">
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-8">
            <div className="relative w-48 h-48 md:w-64 md:h-64">
              <Image
                src="/donkey3.jpeg"
                alt="Smart ATS Resume Mascot"
                fill
                className="object-contain drop-shadow-2xl"
                priority
              />
            </div>
            <div className="flex-1 max-w-2xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-300 to-purple-200 bg-clip-text text-transparent">
                Choose Your Plan
              </h1>
              <p className="text-lg md:text-xl text-gray-300">
                Get the perfect plan for your career goals. Start free and upgrade when you're ready to unlock AI-powered optimization and premium features that deliver results.
              </p>
            </div>
          </div>
        </div>

        {/* Admin Premium Override (hidden helper for site owner) */}
        <div className="max-w-xl mx-auto mb-10">
          <details className="group bg-gray-900/60 border border-dashed border-pink-500/40 rounded-2xl p-4 text-sm text-gray-300">
            <summary className="flex items-center justify-between cursor-pointer list-none">
              <span className="font-semibold text-pink-400 flex items-center gap-2">
                <Crown className="w-4 h-4" />
                Admin Tools
              </span>
              <span className="text-xs text-gray-500 group-open:hidden">(for site owner testing only)</span>
              <span className="text-xs text-gray-500 hidden group-open:inline">Hide admin tools</span>
            </summary>
            <div className="mt-4 space-y-3">
              <p className="text-xs text-gray-400">
                Enter your secret admin code to instantly unlock premium on your account without going through Stripe checkout.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="password"
                  value={adminCode}
                  onChange={(e) => setAdminCode(e.target.value)}
                  className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500/70"
                  placeholder="Enter admin premium code"
                />
                <button
                  type="button"
                  disabled={adminLoading || !adminCode}
                  onClick={async () => {
                    try {
                      setAdminLoading(true);
                      const res = await fetch('/api/admin/upgrade-premium', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ adminCode }),
                      });

                      const data = await res.json();

                      if (!res.ok) {
                        throw new Error(data.error || 'Failed to apply admin override');
                      }

                      toast.success('Premium enabled on your account (admin override).');
                      if (typeof window !== 'undefined') {
                        localStorage.setItem('premium_status_updated', Date.now().toString());
                      }
                    } catch (error: any) {
                      console.error('Admin override failed:', error);
                      toast.error(error.message || 'Invalid admin code');
                    } finally {
                      setAdminLoading(false);
                    }
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-lg text-sm font-semibold hover:shadow-lg hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                >
                  {adminLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Activating...</span>
                    </>
                  ) : (
                    <>
                      <span>Activate Premium</span>
                      <Crown className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </details>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16 max-w-6xl mx-auto">
          {pricingTiers.map((tier) => {
            const isHighlighted = tier.highlighted;
            return (
              <div
                key={tier.name}
                className={`relative rounded-2xl p-8 ${
                  isHighlighted
                    ? 'bg-gradient-to-br from-blue-400/20 to-purple-400/20 border-2 border-blue-500'
                    : 'bg-gray-900 border border-gray-800'
                }`}
              >
                {isHighlighted && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-bold">
                      Most Popular
                    </div>
                  </div>
                )}

                {tier.savings && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-2 rounded-full text-sm font-bold">
                      {tier.savings}
                    </div>
                  </div>
                )}

                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-24 h-24 mb-4">
                    <Image
                      src={tier.mascotImage}
                      alt={`${tier.name} mascot`}
                      width={96}
                      height={96}
                      className="object-contain"
                    />
                  </div>
                  <h3 className="text-2xl text-blue-200 font-bold mb-2">{tier.name}</h3>
                  <p className="text-gray-400 mb-6">{tier.description}</p>

                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-5xl font-bold bg-gradient-to-r from-cyan-500 via-blue-300 to-purple-100 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(59,130,246,0.5)]">
                      ${tier.price}
                    </span>
                    <span className="text-gray-400">/{tier.period}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handlePlanSelect(tier.name, tier.priceId || null)}
                  disabled={loading && selectedPlan === tier.name}
                  className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 mb-8 ${
                    isHighlighted
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg hover:scale-105'
                      : tier.price === 0
                      ? 'bg-white text-gray-900 hover:bg-gray-100'
                      : 'bg-gray-700 text-white hover:bg-gray-600'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {loading && selectedPlan === tier.name ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <span>{tier.buttonText}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                {/* Features List */}
                <div className="space-y-4">
                  {tier.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-300 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
