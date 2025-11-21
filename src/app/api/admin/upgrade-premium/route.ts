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

    // Support multiple admin codes separated by comma/space/newline
    const adminCodesRaw = process.env.ADMIN_PREMIUM_CODE || '';
    const adminCodes = adminCodesRaw.split(/[\n,\s]+/).filter(Boolean);

    // Also allow any PROMO_CODES value as fallback (multi code list)
    const promoCodesRaw = process.env.PROMO_CODES || '';
    const promoCodes = promoCodesRaw.split(/[\n,\s,]+/).filter(Boolean);

    const matchAdmin = adminCodes.find(c => c.toLowerCase() === adminCode.toLowerCase());
    const matchPromo = !matchAdmin && promoCodes.find(c => c.toLowerCase() === adminCode.toLowerCase());

    if (!matchAdmin && !matchPromo) {
      return NextResponse.json({ error: 'Invalid admin/promo code' }, { status: 403 });
    }

    const subscription_status = matchAdmin ? 'admin_override' : 'promo';
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
      return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
    }

    return NextResponse.json({ success: true, method: subscription_status });
  } catch (error) {
    console.error('Unexpected error in admin premium override:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

