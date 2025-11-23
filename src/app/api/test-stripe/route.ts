import { NextResponse } from 'next/server';

// Force dynamic rendering to prevent caching
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    // Check environment variables - read directly from process.env
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    const stripePriceId = process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;
    
    // Show raw env var value for debugging
    const CURRENT_PRICE_ID = 'price_1SWVxVEXTLOxdWgMLE1igHr4';
    const OLD_PRICE_IDS = ['price_1RfIhREXTLOxdWgMKQJGzJzJ', 'price_1Ro7SxEXTLOxdWgM7s3Qs7ei'];
    
    // Get ALL env vars that start with NEXT_PUBLIC_STRIPE to see what's available
    const allStripeEnvVars = Object.keys(process.env)
      .filter(key => key.includes('STRIPE') || key.includes('PRICE'))
      .reduce((acc, key) => {
        acc[key] = process.env[key];
        return acc;
      }, {} as Record<string, string | undefined>);
    
    const isOldPriceId = stripePriceId ? OLD_PRICE_IDS.includes(stripePriceId) : false;
    const isCurrentPriceId = stripePriceId === CURRENT_PRICE_ID;
    
    const config = {
      hasStripeSecretKey: !!stripeSecretKey,
      hasStripePublishableKey: !!stripePublishableKey,
      hasStripePriceId: !!stripePriceId,
      hasAppUrl: !!appUrl,
      stripePriceId: stripePriceId || 'NOT_SET',
      appUrl: appUrl || 'NOT_SET',
      // Debug info
      isOldPriceId: isOldPriceId,
      isCurrentPriceId: isCurrentPriceId,
      rawEnvValue: stripePriceId, // Show exactly what Vercel is providing
      expectedValue: CURRENT_PRICE_ID,
      timestamp: new Date().toISOString(),
      allStripeEnvVars, // Show all Stripe-related env vars
      recommendation: isOldPriceId
        ? 'Serverless function is using cached old value. Try redeploying or wait for function to restart.'
        : isCurrentPriceId
        ? 'Environment variable is correct! ✅'
        : 'Environment variable value is unexpected.'
    };

    console.log('🔍 Stripe Configuration Check:', config);
    console.log('🔍 Raw NEXT_PUBLIC_STRIPE_PRO_PRICE_ID:', stripePriceId);
    console.log('🔍 Expected:', CURRENT_PRICE_ID);
    console.log('🔍 Match?', stripePriceId === CURRENT_PRICE_ID);
    console.log('🔍 All Stripe env vars:', allStripeEnvVars);
    console.log('🔍 Timestamp:', config.timestamp);

    return NextResponse.json({
      success: true,
      config,
      message: 'Stripe configuration check complete',
      debug: {
        rawEnvVar: stripePriceId,
        expected: CURRENT_PRICE_ID,
        matches: stripePriceId === CURRENT_PRICE_ID,
        timestamp: config.timestamp
      }
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });

  } catch (error: any) {
    console.error('Stripe config test error:', error);
    return NextResponse.json(
      { error: 'Failed to check Stripe configuration: ' + error.message },
      { status: 500 }
    );
  }
}
