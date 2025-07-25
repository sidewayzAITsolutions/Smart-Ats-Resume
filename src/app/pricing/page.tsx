'use client';
import React, {
  useEffect,
  useState,
} from 'react';

import {
  ArrowRight,
  Building,
  Check,
  Crown,
  FileText,
  Shield,
  X,
} from 'lucide-react';
import {
  useRouter,
  useSearchParams,
} from 'next/navigation';
import toast from 'react-hot-toast';

import UnifiedNavigation from '@/components/UnifiedNavigation';
import {
  handlePlanSelection,
  validateStripeConfig,
} from '@/lib/payment-utils';
import { createClient } from '@/lib/supabase/client';

const PricingPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('');
  const [showContactModal, setShowContactModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [contactData, setContactData] = useState({
    companyName: '',
    fullName: '',
    email: '',
    phone: '',
    employees: '',
    message: ''
  });

  // Check for error messages from URL params
  useEffect(() => {
    const error = searchParams.get('error');
    const canceled = searchParams.get('canceled');
    
    if (error) {
      const errorMessages: { [key: string]: string } = {
        'no_session': 'Session not found. Please try again.',
        'session_not_found': 'Checkout session not found.',
        'payment_failed': 'Payment was not completed.',
        'no_user': 'User information not found.',
        'update_failed': 'Failed to update subscription.',
        'server_error': 'Server error occurred. Please try again.',
      };
      
      toast.error(errorMessages[error] || 'An error occurred. Please try again.');
    }
    
    if (canceled === 'true') {
      toast('Checkout was canceled. You can try again anytime.');
    }
  }, [searchParams]);

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setCheckingAuth(true);
        const authStatus = await checkAuthStatus();
        setIsAuthenticated(authStatus.isAuthenticated);
      } catch (error) {
        console.error('Auth check failed:', error);
        setIsAuthenticated(false);
      } finally {
        setCheckingAuth(false);
      }
    };

    checkAuth();
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
      buttonText: isAuthenticated ? 'Get Started Free' : 'Sign In to Start'
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
      buttonText: isAuthenticated ? 'Start Pro Trial' : 'Sign In to Upgrade'
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

  const handlePlanSelect = async (planName: string) => {
    // Validate Stripe configuration before proceeding
    if (planName === 'Pro' && !validateStripeConfig()) {
      return;
    }

    await handlePlanSelection(
      planName,
      router,
      setLoading,
      setSelectedPlan,
      setShowContactModal
    );
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Send to your API endpoint
      const response = await fetch('/api/enterprise-inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactData)
      });

      if (response.ok) {
        toast.success('Thank you! Our enterprise team will contact you within 24 hours.');
        setShowContactModal(false);
        // Reset form
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

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <UnifiedNavigation />

      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-300 to-purple-200 bg-clip-text text-transparent">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Get the perfect plan for your career goals. Start free and upgrade when you're ready.
          </p>
          
          {/* Authentication Status Banner */}
          {!isAuthenticated && (
            <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-blue-900/30 border border-blue-700/50 rounded-lg">
              <Shield className="w-5 h-5 text-blue-400" />
              <span className="text-blue-300 text-sm">
                Sign in to unlock all features and start your journey
              </span>
            </div>
          )}
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
                    ? 'bg-gradient-to-br from-amber-400/10 to-orange-400/10 border border-amber-500/30'
                    : 'bg-gray-800/50 border border-gray-700'
                } transition-all duration-300 hover:scale-105`}
              >
                {isHighlighted && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                      MOST POPULAR
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <Icon className={`w-12 h-12 mx-auto mb-4 ${
                    isHighlighted ? 'text-blue-400' : 'text-gray-400'
                  }`} />
                  <h3 className="text-2xl font-bold text-white mb-2">{tier.name}</h3>
                  <p className="text-gray-400">{tier.description}</p>
                </div>

                <div className="text-center mb-6">
                  <span className="text-4xl font-bold text-white">${tier.price}</span>
                  <span className="text-gray-400">/{tier.period}</span>
                </div>

                {/* Features */}
                <div className="space-y-3 mb-8">
                  {tier.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start">
                      <Check className="w-5 h-5 text-green-400 mt-0.5 mr-3 flex-shrink-0" />
                      <span className="text-gray-300 text-sm">{feature}</span>
                    </div>
                  ))}
                  {tier.notIncluded.map((feature, idx) => (
                    <div key={idx} className="flex items-start opacity-50">
                      <X className="w-5 h-5 text-gray-500 mt-0.5 mr-3 flex-shrink-0" />
                      <span className="text-gray-500 text-sm line-through">{feature}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => handlePlanSelect(tier.name)}
                  disabled={loading && selectedPlan === tier.name}
                  className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center group ${
                    isHighlighted
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white'
                      : tier.name === 'Enterprise'
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white'
                      : 'bg-gray-700 hover:bg-gray-600 text-white'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {loading && selectedPlan === tier.name ? (
                    <span>Processing...</span>
                  ) : (
                    <>
                      <span>{tier.buttonText}</span>
                      <ArrowRight className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* Enterprise Contact Modal */}
        {showContactModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-2xl p-8 max-w-md w-full">
              <h3 className="text-2xl font-bold text-white mb-6">Enterprise Inquiry</h3>
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="Company Name"
                  value={contactData.companyName}
                  onChange={(e) => setContactData({ ...contactData, companyName: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                  required
                />
                <input
                  type="text"
                  placeholder="Full Name"
                  value={contactData.fullName}
                  onChange={(e) => setContactData({ ...contactData, fullName: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                  required
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={contactData.email}
                  onChange={(e) => setContactData({ ...contactData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                  required
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={contactData.phone}
                  onChange={(e) => setContactData({ ...contactData, phone: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                />
                <select
                  value={contactData.employees}
                  onChange={(e) => setContactData({ ...contactData, employees: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                  required
                >
                  <option value="">Number of Employees</option>
                  <option value="1-10">1-10</option>
                  <option value="11-50">11-50</option>
                  <option value="51-200">51-200</option>
                  <option value="201-500">201-500</option>
                  <option value="500+">500+</option>
                </select>
                <textarea
                  placeholder="Tell us about your needs..."
                  value={contactData.message}
                  onChange={(e) => setContactData({ ...contactData, message: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 h-32 resize-none"
                  required
                />
                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-3 px-6 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold rounded-lg transition-all duration-200 disabled:opacity-50"
                  >
                    {loading ? 'Submitting...' : 'Submit Inquiry'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowContactModal(false)}
                    className="flex-1 py-3 px-6 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-all duration-200"
                  >
                    Cancel
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

const checkAuthStatus = async () => {
  try {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    return { isAuthenticated: !!session };
  } catch (error) {
    console.error('Error checking auth status:', error);
    return { isAuthenticated: false };
  }
};

export default PricingPage;