import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

let stripe: Stripe | null = null;

/**
 * Create a Supabase admin client using the service role key.
 * Webhook requests come from Stripe's servers (no browser cookies),
 * so a cookie-based client would have zero auth context and all
 * RLS-protected writes would silently fail.
 */
function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error(
      'Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY – webhook cannot update the database.'
    );
  }

  return createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export async function POST(req: NextRequest) {
  // Build a service-role Supabase client (bypasses RLS).
  let supabase: ReturnType<typeof createClient>;
  try {
    supabase = getSupabaseAdmin();
  } catch (err: any) {
    console.error('❌ Webhook DB client error:', err.message);
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
  }

  // Ensure Stripe is configured and initialize lazily
  if (!process.env.STRIPE_SECRET_KEY) {
    console.error('STRIPE_SECRET_KEY is not configured');
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 });
  }
  
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!endpointSecret) {
    console.error('STRIPE_WEBHOOK_SECRET is not configured');
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });
  }
  
  if (!stripe) {
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2025-08-27.basil',
    });
  }

  const body = await req.text();
  const sig = req.headers.get('stripe-signature');
  
  if (!sig) {
    console.error('Missing stripe-signature header');
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 });
  }

  console.log('Received Stripe webhook event:', event.type);

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session, supabase);
        break;

      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object as Stripe.Subscription, supabase);
        break;

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription, supabase);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription, supabase);
        break;

      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object as Stripe.Invoice, supabase);
        break;

      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.Invoice, supabase);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session, supabase: any) {
  console.log('Processing checkout session completed:', session.id);

  const userId = session.metadata?.userId || session.client_reference_id;
  if (!userId) {
    console.error('No userId found in session metadata or client_reference_id');
    // Last-resort: try to find user by customer email
    if (session.customer_email || session.customer_details?.email) {
      const email = session.customer_email || session.customer_details?.email;
      console.log('Attempting to find user by email:', email);
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email)
        .single();
      if (profile?.id) {
        console.log('Found user by email:', profile.id);
        return upgradeUserToPremium(profile.id, session, supabase);
      }
    }
    console.error('Could not resolve any user for this checkout session');
    return;
  }

  return upgradeUserToPremium(userId, session, supabase);
}

async function upgradeUserToPremium(userId: string, session: Stripe.Checkout.Session, supabase: any) {
  // Update user profile to premium
  const { error } = await supabase
    .from('profiles')
    .update({
      is_premium: true,
      subscription_status: 'active',
      stripe_customer_id: session.customer as string,
      stripe_session_id: session.id,
      updated_at: new Date().toISOString()
    })
    .eq('id', userId);

  if (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }

  console.log(`✅ User ${userId} upgraded to premium via session ${session.id}`);
}

async function resolveUserIdFromSubscription(subscription: Stripe.Subscription, supabase: any): Promise<string | null> {
  // 1. Try metadata (set during checkout creation)
  if (subscription.metadata?.userId) return subscription.metadata.userId;

  // 2. Fallback: look up the user by stripe_customer_id
  const customerId = typeof subscription.customer === 'string' ? subscription.customer : (subscription.customer as any)?.id;
  if (customerId) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('stripe_customer_id', customerId)
      .single();
    if (profile?.id) {
      console.log(`Resolved userId ${profile.id} from stripe_customer_id ${customerId}`);
      return profile.id;
    }
  }

  console.error('Could not resolve userId for subscription:', subscription.id);
  return null;
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription, supabase: any) {
  console.log('Processing subscription created:', subscription.id);

  const userId = await resolveUserIdFromSubscription(subscription, supabase);
  if (!userId) return;

  // Update user profile
  const { error } = await supabase
    .from('profiles')
    .update({
      is_premium: true,
      subscription_status: subscription.status,
      stripe_subscription_id: subscription.id,
      stripe_customer_id: subscription.customer as string,
      updated_at: new Date().toISOString()
    })
    .eq('id', userId);

  if (error) {
    console.error('Error updating user subscription:', error);
    throw error;
  }

  console.log(`✅ Subscription created for user ${userId}`);
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription, supabase: any) {
  console.log('Processing subscription updated:', subscription.id);

  const userId = await resolveUserIdFromSubscription(subscription, supabase);
  if (!userId) return;

  // Update subscription status
  const { error } = await supabase
    .from('profiles')
    .update({
      is_premium: subscription.status === 'active',
      subscription_status: subscription.status,
      updated_at: new Date().toISOString()
    })
    .eq('id', userId);

  if (error) {
    console.error('Error updating subscription status:', error);
    throw error;
  }

  console.log(`✅ Subscription updated for user ${userId}: ${subscription.status}`);
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription, supabase: any) {
  console.log('Processing subscription deleted:', subscription.id);

  const userId = await resolveUserIdFromSubscription(subscription, supabase);
  if (!userId) return;

  // Downgrade user to free
  const { error } = await supabase
    .from('profiles')
    .update({
      is_premium: false,
      subscription_status: 'canceled',
      updated_at: new Date().toISOString()
    })
    .eq('id', userId);

  if (error) {
    console.error('Error downgrading user:', error);
    throw error;
  }

  console.log(`✅ User ${userId} downgraded to free`);
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice, supabase: any) {
  console.log('Processing payment succeeded:', invoice.id);

  // Type assertion for subscription property which exists at runtime
  const invoiceWithSub = invoice as any;
  const subscriptionId = typeof invoiceWithSub.subscription === 'string'
    ? invoiceWithSub.subscription
    : invoiceWithSub.subscription?.id;

  if (subscriptionId && stripe) {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const userId = subscription.metadata?.userId;

    if (userId) {
      // Ensure user is marked as premium
      const { error } = await supabase
        .from('profiles')
        .update({
          is_premium: true,
          subscription_status: 'active',
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) {
        console.error('Error updating user after payment:', error);
        throw error;
      }

      console.log(`✅ Payment succeeded for user ${userId}`);
    }
  }
}

async function handlePaymentFailed(invoice: Stripe.Invoice, supabase: any) {
  console.log('Processing payment failed:', invoice.id);

  // Type assertion for subscription property which exists at runtime
  const invoiceWithSub = invoice as any;
  const subscriptionId = typeof invoiceWithSub.subscription === 'string'
    ? invoiceWithSub.subscription
    : invoiceWithSub.subscription?.id;

  if (subscriptionId && stripe) {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const userId = subscription.metadata?.userId;

    if (userId) {
      // Mark subscription as past_due but don't immediately downgrade
      const { error } = await supabase
        .from('profiles')
        .update({
          subscription_status: 'past_due',
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) {
        console.error('Error updating user after payment failure:', error);
        throw error;
      }

      console.log(`⚠️ Payment failed for user ${userId}`);
    }
  }
}
