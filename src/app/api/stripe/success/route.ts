import {
  NextRequest,
  NextResponse,
} from 'next/server';

import { createClientFromRequest } from '@/lib/supabase/server';

const Stripe = require('stripe');


export async function GET(req: NextRequest) {
  console.log('Stripe success API route called');

  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
      console.error('No session_id provided');
      return NextResponse.redirect(new URL('/pricing?error=no_session', req.url));
    }

    console.log('Processing session:', sessionId);

    // Ensure Stripe is configured and retrieve the checkout session
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('STRIPE_SECRET_KEY is not configured');
      return NextResponse.redirect(new URL('/pricing?error=stripe_not_configured', req.url));
    }
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (!session) {
      console.error('Session not found:', sessionId);
      return NextResponse.redirect(new URL('/pricing?error=session_not_found', req.url));
    }

    console.log('Session status:', session.payment_status);

    // Check if payment was successful
    if (session.payment_status !== 'paid') {
      console.error('Payment not completed:', session.payment_status);
      return NextResponse.redirect(new URL('/pricing?error=payment_failed', req.url));
    }

    // Get user ID from session metadata
    const userId = session.metadata?.userId || session.client_reference_id;
    
    if (!userId) {
      console.error('No user ID found in session metadata');
      return NextResponse.redirect(new URL('/pricing?error=no_user', req.url));
    }

    console.log('Updating user premium status for:', userId);

    // Update user premium status
    const { supabase } = createClientFromRequest(req);
    
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        is_premium: true,
        subscription_status: 'active',
        stripe_customer_id: session.customer as string,
        stripe_session_id: sessionId,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);

    if (updateError) {
      console.error('Error updating user profile:', updateError);
      return NextResponse.redirect(new URL('/pricing?error=update_failed', req.url));
    }

    console.log('✅ User premium status updated successfully');

    // Redirect to success page
    return NextResponse.redirect(new URL('/payment/success?session_id=' + sessionId, req.url));

  } catch (error: any) {
    console.error('Error in Stripe success handler:', error);
    return NextResponse.redirect(new URL('/pricing?error=server_error', req.url));
  }
}
