import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    // Check environment variables
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    const stripePriceId = process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;
    
    const config = {
      hasStripeSecretKey: !!stripeSecretKey,
      hasStripePublishableKey: !!stripePublishableKey,
      hasStripePriceId: !!stripePriceId,
      hasAppUrl: !!appUrl,
      stripePriceId: stripePriceId || 'NOT_SET',
      appUrl: appUrl || 'NOT_SET'
    };

    console.log('Stripe Configuration Check:', config);

    return NextResponse.json({
      success: true,
      config,
      message: 'Stripe configuration check complete'
    });

  } catch (error: any) {
    console.error('Stripe config test error:', error);
    return NextResponse.json(
      { error: 'Failed to check Stripe configuration: ' + error.message },
      { status: 500 }
    );
  }
}
