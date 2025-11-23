import {
  NextRequest,
  NextResponse,
} from 'next/server';

import { createClientFromRequest } from '@/lib/supabase/server';

const Stripe = require('stripe');


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

    // Determine app origin for redirect URLs
    const origin = process.env.NEXT_PUBLIC_APP_URL || new URL(req.url).origin;

    // Parse request body
    const body = await req.json();
    let { priceId, successUrl: customSuccessUrl, cancelUrl: customCancelUrl } = body;

    console.log('Received priceId from client:', priceId);

    // Fallback to environment variable or default price ID
    const DEFAULT_PRICE_ID = process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID || 'price_1SWVxVEXTLOxdWgMLE1igHr4';
    const OLD_PRICE_IDS = ['price_1RfIhREXTLOxdWgMKQJGzJzJ', 'price_1Ro7SxEXTLOxdWgM7s3Qs7ei'];
    
    if (priceId && OLD_PRICE_IDS.includes(priceId)) {
      console.warn('⚠️ Detected old price ID from client, overriding with current one');
      console.warn('⚠️ Old:', priceId);
      console.warn('⚠️ Current:', DEFAULT_PRICE_ID);
      priceId = DEFAULT_PRICE_ID;
    }

    // If no priceId provided, use default one as fallback
    if (!priceId) {
      console.warn('⚠️ No priceId provided, using default price ID as fallback');
      priceId = DEFAULT_PRICE_ID;
    }

    // Validate priceId format
    if (!priceId.startsWith('price_')) {
      console.error('Invalid priceId format:', priceId);
      return NextResponse.json(
        { error: 'Invalid price ID format' },
        { status: 400 }
      );
    }

    console.log('✅ Final priceId being used:', priceId);

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

    // Handle Pro plan - use custom URLs if provided, otherwise use computed origin
    let successUrl = customSuccessUrl || `${origin}/payment/success?session_id={CHECKOUT_SESSION_ID}`;
    let cancelUrl = customCancelUrl || `${origin}/pricing`;

    // Determine mode based on the Price object (recurring => subscription)
    // We fetch the Price from Stripe below to decide.

    try {
      // Log the price ID for debugging
      console.log('🔍 SERVER DEBUG: Received priceId from client:', priceId);
      console.log('🔍 SERVER DEBUG: Environment NEXT_PUBLIC_STRIPE_PRO_PRICE_ID:', process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID);
      console.log('Using price ID:', priceId);
      console.log('Creating checkout session for user:', user.email);

      // Determine mode by inspecting the Price on Stripe and create checkout session
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
      const price = await stripe.prices.retrieve(priceId);
      const isSubscription = !!price?.recurring;
      const sessionConfig: any = {
        mode: isSubscription ? 'subscription' : 'payment',
        line_items: [{ price: priceId, quantity: 1 }],
        success_url: successUrl,
        cancel_url: cancelUrl,
        customer_email: user.email,
        client_reference_id: user.id,
        metadata: { userId: user.id, userEmail: user.email || '' },
        automatic_payment_methods: { enabled: true },
      };
      if (isSubscription) {
        sessionConfig.subscription_data = { metadata: { userId: user.id } };
      }

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
      
      // Provide more helpful error messages for common issues
      let errorMessage = stripeError.message || 'Failed to create checkout session';
      
      if (stripeError.type === 'StripeInvalidRequestError') {
        if (stripeError.message?.includes('No such price')) {
          errorMessage = `Invalid price ID: ${priceId}. Please check your NEXT_PUBLIC_STRIPE_PRO_PRICE_ID environment variable and ensure the price exists in your Stripe account.`;
        } else if (stripeError.message?.includes('Invalid API Key')) {
          errorMessage = 'Invalid Stripe API key. Please check your STRIPE_SECRET_KEY environment variable.';
        }
      }
      
      return NextResponse.json(
        { error: errorMessage },
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
