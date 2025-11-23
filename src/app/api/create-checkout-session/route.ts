import { NextRequest, NextResponse } from 'next/server';
import { createClientFromRequest } from '@/lib/supabase/server';
import Stripe from 'stripe';

export async function POST(req: NextRequest) {
  console.log('Create checkout session endpoint called');

  try {
    // Check if Stripe secret key is configured
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('STRIPE_SECRET_KEY is not configured');
      return NextResponse.json(
        { error: 'Stripe is not configured. Please contact support.' },
        { status: 500 }
      );
    }

    // Check if price ID is configured
    const priceId = process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID;
    if (!priceId) {
      console.error('NEXT_PUBLIC_STRIPE_PRO_PRICE_ID is not configured');
      return NextResponse.json(
        { error: 'Payment configuration error. Please contact support.' },
        { status: 500 }
      );
    }

    // Validate priceId format
    if (!priceId.startsWith('price_')) {
      console.error('Invalid priceId format:', priceId);
      return NextResponse.json(
        { error: 'Invalid price ID format' },
        { status: 400 }
      );
    }

    // Determine app origin for redirect URLs
    const origin = process.env.NEXT_PUBLIC_APP_URL || new URL(req.url).origin;

    // Parse request body
    const body = await req.json();
    const { successUrl: customSuccessUrl, cancelUrl: customCancelUrl } = body;

    // Use price ID from environment variable (ignore any priceId from body for security)
    console.log('Using price ID from environment:', priceId);

    // Get authenticated user
    const { supabase } = createClientFromRequest(req);
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    console.log('Auth check - User ID:', user?.id);

    if (authError) {
      console.error('Auth error:', authError);
      return NextResponse.json(
        { error: 'Authentication error: ' + authError.message },
        { status: 401 }
      );
    }

    if (!user) {
      console.error('No authenticated user found');
      return NextResponse.json(
        { error: 'Authentication required. Please sign in.' },
        { status: 401 }
      );
    }

    // Get user profile for customer info
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.error('Profile error:', profileError);
    }

    // Set URLs
    const successUrl = customSuccessUrl || `${origin}/payment/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = customCancelUrl || `${origin}/pricing`;

    // Initialize Stripe
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2025-08-27.basil',
    });

    // Retrieve the price to determine if it's a subscription
    const price = await stripe.prices.retrieve(priceId);
    const isSubscription = !!price?.recurring;

    console.log('Price details:', {
      id: price.id,
      amount: price.unit_amount,
      currency: price.currency,
      recurring: price.recurring,
      isSubscription
    });

    // Create checkout session
    const sessionConfig: Stripe.Checkout.SessionCreateParams = {
      mode: isSubscription ? 'subscription' : 'payment',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer_email: user.email || undefined,
      client_reference_id: user.id,
      metadata: {
        userId: user.id,
        userEmail: user.email || ''
      },
      payment_method_types: ['card'],
    };

    if (isSubscription) {
      sessionConfig.subscription_data = { 
        metadata: { userId: user.id } 
      };
    }

    console.log('Creating Stripe session with config:', {
      mode: sessionConfig.mode,
      priceId: priceId,
      success_url: sessionConfig.success_url,
      cancel_url: sessionConfig.cancel_url
    });

    const session = await stripe.checkout.sessions.create(sessionConfig);

    console.log('Checkout session created:', session.id);

    return NextResponse.json({
      url: session.url,
      sessionId: session.id
    });
  } catch (error: any) {
    console.error('Error creating checkout session:', error);

    // Provide more helpful error messages for common issues
    let errorMessage = error.message || 'Failed to create checkout session';

    if (error.type === 'StripeInvalidRequestError') {
      if (error.message?.includes('No such price')) {
        errorMessage = `Invalid price ID: ${process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID}. Please check your NEXT_PUBLIC_STRIPE_PRO_PRICE_ID environment variable and ensure the price exists in your Stripe account.`;
      } else if (error.message?.includes('Invalid API Key')) {
        errorMessage = 'Invalid Stripe API key. Please check your STRIPE_SECRET_KEY environment variable.';
      }
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
