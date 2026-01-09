import { NextRequest, NextResponse } from 'next/server';
import { createClientFromRequest } from '@/lib/supabase/server';
import Stripe from 'stripe';

let stripe: Stripe | null = null;

export async function POST(req: NextRequest) {
  const { supabase } = createClientFromRequest(req);

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
    return;
  }

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

async function handleSubscriptionCreated(subscription: Stripe.Subscription, supabase: any) {
  console.log('Processing subscription created:', subscription.id);

  const userId = subscription.metadata?.userId;
  if (!userId) {
    console.error('No userId found in subscription metadata');
    return;
  }

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

  const userId = subscription.metadata?.userId;
  if (!userId) {
    console.error('No userId found in subscription metadata');
    return;
  }

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

  const userId = subscription.metadata?.userId;
  if (!userId) {
    console.error('No userId found in subscription metadata');
    return;
  }

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

  if (invoice.subscription && stripe) {
    const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string);
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

  if (invoice.subscription && stripe) {
    const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string);
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
