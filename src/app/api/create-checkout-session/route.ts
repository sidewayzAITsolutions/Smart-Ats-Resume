import { NextRequest, NextResponse } from 'next/server';
import { createClientFromRequest } from '@/lib/supabase/server';
const Stripe = require('stripe');

// Initialize Stripe with the secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

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

    // Check if app URL is configured
    if (!process.env.NEXT_PUBLIC_APP_URL) {
      console.error('NEXT_PUBLIC_APP_URL is not configured');
      return NextResponse.json(
        { error: 'App URL is not configured. Please contact support.' },
        { status: 500 }
      );
    }

    // Parse request body
    const body = await req.json();
    const { priceId, successUrl: customSuccessUrl, cancelUrl: customCancelUrl } = body;

    console.log('Received priceId:', priceId);

    // Validate priceId
    if (!priceId) {
      console.error('No priceId provided in request');
      return NextResponse.json(
        { error: 'Price ID is required' },
        { status: 400 }
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

    // Handle Pro plan - use custom URLs if provided, otherwise use defaults
    let successUrl = customSuccessUrl || `${process.env.NEXT_PUBLIC_APP_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`;
    let cancelUrl = customCancelUrl || `${process.env.NEXT_PUBLIC_APP_URL}/pricing`;

    // Check if this is a subscription or one-time payment
    const isSubscription = priceId.startsWith('price_'); // Stripe price IDs start with price_

    try {
      // Log the price ID for debugging
      console.log('Using price ID:', priceId);
      console.log('Creating checkout session for user:', user.email);

      // Create checkout session
      const sessionConfig = {
        payment_method_types: ['card'],
        mode: isSubscription ? 'subscription' : 'payment',
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        success_url: successUrl,
        cancel_url: cancelUrl,
        customer_email: user.email,
        client_reference_id: user.id,
        metadata: {
          userId: user.id,
          userEmail: user.email || '',
        },
        // For subscriptions, you might want to enable the customer portal
        ...(isSubscription && {
          subscription_data: {
            metadata: {
              userId: user.id,
            },
          },
        }),
      };

      console.log('Creating Stripe session with config:', {
        ...sessionConfig,
        line_items: sessionConfig.line_items,
        success_url: sessionConfig.success_url,
        cancel_url: sessionConfig.cancel_url
      });

      const session = await stripe.checkout.sessions.create(sessionConfig);

      console.log('Checkout session created:', session.id);

      return NextResponse.json({
        url: session.url,
        sessionId: session.id
      });
    } catch (stripeError: any) {
      console.error('Stripe error:', stripeError);
      return NextResponse.json(
        { error: `Failed to create checkout session: ${stripeError.message}` },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred: ' + error.message },
      { status: 500 }
    );
  }
}
