import { NextRequest, NextResponse } from 'next/server';

import { createClientFromRequest } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  try {
    const { supabase } = createClientFromRequest(req);
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json().catch(() => null);
    const rawCode: string | undefined = body?.adminCode;
    if (!rawCode) {
      return NextResponse.json({ error: 'Missing adminCode' }, { status: 400 });
    }
    const adminCode = rawCode.trim();

    // Support multiple admin codes separated by comma/space/newline.
    // Accept several possible env var names to reduce production misconfiguration risk.
    const adminCodesRaw =
      process.env.ADMIN_PREMIUM_CODE ||
      process.env.ADMIN_PREMIUM_CODES ||
      process.env.ADMIN_CODES ||
      process.env.PREMIUM_ADMIN_CODE ||
      '';
    const adminCodes = adminCodesRaw.split(/[\n,\s,]+/).filter(Boolean);

    // Also allow any PROMO_CODES value as fallback (multi code list)
    const promoCodesRaw = process.env.PROMO_CODES || process.env.PROMO_CODE || '';
    const promoCodes = promoCodesRaw.split(/[\n,\s,]+/).filter(Boolean);

    if (adminCodes.length === 0 && promoCodes.length === 0) {
      console.error('Configuration error: No admin or promo codes found in environment variables.');
      return NextResponse.json({ error: 'Server not configured with any admin/promo codes', configurationError: true }, { status: 500 });
    }

    const matchAdmin = adminCodes.find(c => c.toLowerCase() === adminCode.toLowerCase());
    const matchPromo = !matchAdmin && promoCodes.find(c => c.toLowerCase() === adminCode.toLowerCase());

    if (!matchAdmin && !matchPromo) {
      return NextResponse.json({ error: 'Invalid admin/promo code', attempted: adminCode }, { status: 403 });
    }

  // Maintain Stripe-style 'active' to satisfy subscription_status constraint
  const subscription_status = 'active';
    const { data: profileCheck, error: selectErr } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', user.id)
      .single();

    if (selectErr) {
      // Attempt to create profile if it doesn't exist (user signed up before initial schema ran)
      console.warn('Profile missing, attempting auto-create for user:', user.id);
      const { error: insertErr } = await supabase
        .from('profiles')
        .insert({ id: user.id, email: user.email, full_name: user.email?.split('@')[0] || 'User' });
      if (insertErr) {
        console.error('Auto-create profile failed:', insertErr);
        return NextResponse.json({ error: 'Profile not found and auto-create failed', detail: insertErr.message }, { status: 500 });
      }
    }

    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        is_premium: true,
        subscription_status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    if (updateError) {
      console.error('Error applying premium override:', updateError);
      return NextResponse.json({ error: 'Failed to update profile', detail: updateError.message, code: updateError.code }, { status: 500 });
    }

  return NextResponse.json({ success: true, method: matchAdmin ? 'admin' : 'promo' });
  } catch (error) {
    console.error('Unexpected error in admin premium override:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

