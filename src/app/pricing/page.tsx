// src/app/pricing/page.tsx
'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import UnifiedNavigation from '@/components/UnifiedNavigation';
import {
  Check, X, ArrowRight, Crown,
  FileText, Building, Loader2
} from 'lucide-react';
import toast from 'react-hot-toast';

const PricingPage = () => {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('');
  const [showContactModal, setShowContactModal] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [userLoading, setUserLoading] = useState(true);
  const [contactData, setContactData] = useState({
    companyName: '',
    fullName: '',
    email: '',
    phone: '',
    employees: '',
    message: ''
  });

  // Check user authentication and get user data
  useEffect(() => {
    const checkUserData = async () => {
      try {
        setUserLoading(true);
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError) {
          console.error('Auth error:', authError);
          // Don't redirect, allow viewing pricing page
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
          // Fallback to basic user data
          setUserData({
            email: user.email || "",
            name: user.user_metadata?.full_name || "User",
            isPremium: false
          });
        } else {
          // Set complete user data
          setUserData({
            email: profile?.email || user.email || "",
            name: profile?.full_name || user.user_metadata?.full_name || "User",
            isPremium: profile?.is_premium || false,
            user: user // Include full user object for UserDropdown
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
      icon: FileText,
      description: 'Perfect for getting started',
      features: [
        'Basic resume builder',
        'ATS score checker',
        '3 basic templates',
        'PDF download',
        'Basic keyword optimization'
      ],
      notIncluded: [
        'Premium templates',
        'AI-powered suggestions',
        'Unlimited downloads',
        'Priority support'
      ],
      highlighted: false,
      buttonText: 'Get Started Free'
    },
    {
      name: 'Pro',
      price: 22,
      period: 'month',
      icon: Crown,
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
      notIncluded: [],
      highlighted: true,
      buttonText: 'Start Pro Trial'
    },
    {
      name: 'Enterprise',
      price: 99.99,
      period: 'month',
      icon: Building,
      description: 'For teams and agencies',
      features: [
        'Everything in Pro',
        'Team collaboration',
        'Brand customization',
        'Bulk resume creation',
        'Advanced analytics',
        'Phone support',
        'Custom integrations',
        'Account manager',
        'API access',
        '99.9% SLA guarantee'
      ],
      notIncluded: [],
      highlighted: false,
      buttonText: 'Contact Sales'
    }
  ];

  const validateStripeConfig = (): boolean => {
    const priceId = process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID;
    
    if (!priceId) {
      console.error('NEXT_PUBLIC_STRIPE_PRO_PRICE_ID is not configured');
      toast.error('Payment configuration error. Please contact support.');
      return false;
    }

    return true;
  };

  const createCheckoutSession = async (priceId: string): Promise<void> => {
    try {
      console.log('Creating checkout session with priceId:', priceId);

      // Check if user is authenticated first
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        toast.error('Please sign in to continue with your purchase.');
        router.push('/login?redirectTo=/pricing');
        return;
      }

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

  const handlePlanSelect = async (planName: string) => {
    // Check if user is authenticated for paid plans
    if (planName === 'Pro' && !userData) {
      toast.error('Please sign in to subscribe to Pro plan.');
      router.push('/login?redirectTo=/pricing');
      return;
    }

    if (planName === 'Pro' && !validateStripeConfig()) {
      return;
    }

    setLoading(true);
    setSelectedPlan(planName);

    try {
      switch (planName) {
        case 'Enterprise':
          setShowContactModal(true);
          break;
        case 'Free':
          toast.success('Free plan selected!');
          router.push('/builder');
          break;
        case 'Pro':
          const priceId = process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID || 'price_1234567890';
          await createCheckoutSession(priceId);
          break;
        default:
          console.warn(`Unknown plan: ${planName}`);
          toast.error('Unknown plan selected');
      }
    } catch (error) {
      // Error handling is done in createCheckoutSession
    } finally {
      setLoading(false);
      setSelectedPlan('');
    }
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/enterprise-inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactData)
      });

      if (response.ok) {
        toast.success('Thank you! Our enterprise team will contact you within 24 hours.');
        setShowContactModal(false);
        setContactData({
          companyName: '',
          fullName: '',
          email: '',
          phone: '',
          employees: '',
          message: ''
        });
      } else {
        throw new Error('Failed to submit');
      }
    } catch (error) {
      toast.error('Failed to submit inquiry. Please email us directly.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <UnifiedNavigation userData={userData} />

      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-300 to-purple-200 bg-clip-text text-transparent">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Get the perfect plan for your career goals. Start free and upgrade when you're ready.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {pricingTiers.map((tier) => {
            const Icon = tier.icon;
            const isHighlighted = tier.highlighted;
            return (
              <div
                key={tier.name}
                className={`relative rounded-2xl p-8 ${
                  isHighlighted
                    ? 'bg-gradient-to-br from-blue-400/20 to-purple-400/20 border-2 border-blue-500'
                    : tier.name === 'Enterprise'
                    ? 'bg-gradient-to-br from-amber-900/20 to-orange-900/20 border-2 border-amber-600'
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

                <div className="text-center mb-8">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-xl mb-4 ${
                    tier.name === 'Enterprise'
                      ? 'bg-gradient-to-br from-amber-600 to-orange-600'
                      : 'bg-gradient-to-br from-blue-600 to-purple-600'
                  }`}>
                    <Icon className="w-8 h-8 text-white" />
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
                  onClick={() => handlePlanSelect(tier.name)}
                  disabled={loading && selectedPlan === tier.name}
                  className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 mb-8 ${
                    isHighlighted
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg hover:scale-105'
                      : tier.name === 'Enterprise'
                      ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white hover:shadow-lg hover:scale-105'
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
                  {tier.notIncluded.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <X className="w-5 h-5 text-gray-500 flex-shrink-0" />
                      <span className="text-gray-500 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Contact Modal for Enterprise */}
        {showContactModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-xl p-8 max-w-md w-full">
              <h3 className="text-2xl font-bold text-white mb-6">Contact Enterprise Sales</h3>
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="Company Name"
                  value={contactData.companyName}
                  onChange={(e) => setContactData({...contactData, companyName: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
                  required
                />
                <input
                  type="text"
                  placeholder="Full Name"
                  value={contactData.fullName}
                  onChange={(e) => setContactData({...contactData, fullName: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
                  required
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={contactData.email}
                  onChange={(e) => setContactData({...contactData, email: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
                  required
                />
                <input
                  type="tel"
                  placeholder="Phone"
                  value={contactData.phone}
                  onChange={(e) => setContactData({...contactData, phone: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
                />
                <select
                  value={contactData.employees}
                  onChange={(e) => setContactData({...contactData, employees: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
                  required
                >
                  <option value="">Number of Employees</option>
                  <option value="1-10">1-10</option>
                  <option value="11-50">11-50</option>
                  <option value="51-200">51-200</option>
                  <option value="201-1000">201-1000</option>
                  <option value="1000+">1000+</option>
                </select>
                <textarea
                  placeholder="Message"
                  value={contactData.message}
                  onChange={(e) => setContactData({...contactData, message: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white h-24"
                  rows={3}
                />
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setShowContactModal(false)}
                    className="flex-1 px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-4 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50"
                  >
                    {loading ? 'Submitting...' : 'Submit'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PricingPage;
