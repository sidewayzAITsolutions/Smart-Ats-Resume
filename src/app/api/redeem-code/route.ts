import { NextRequest, NextResponse } from 'next/server';
import { createClientFromRequest } from '@/lib/supabase/server';

// Simple in-memory validation using environment variable PROMO_CODES
// Format: CODE1,CODE2,CODE3   (each single-use)
// For production: store in a Supabase table with usage counts & expiry.

export async function POST(req: NextRequest) {
  try {
    const { supabase } = createClientFromRequest(req);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json().catch(() => null);
    const code = body?.code?.trim();
    if (!code) {
      return NextResponse.json({ success: false, error: 'No code provided' }, { status: 400 });
    }

    const rawList = process.env.PROMO_CODES || '';
    const codes = rawList.split(/[,\n\s]+/).filter(Boolean);

    if (!codes.length) {
      return NextResponse.json({ success: false, error: 'No promo codes configured' }, { status: 500 });
    }

    // Basic match (case-insensitive)
    const matched = codes.find(c => c.toLowerCase() === code.toLowerCase());
    if (!matched) {
      return NextResponse.json({ success: false, error: 'Invalid or expired code' }, { status: 404 });
    }

    // Ensure profile exists
    const { error: profileErr } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', user.id)
      .single();

    if (profileErr) {
      const { error: insertErr } = await supabase
        .from('profiles')
        .insert({ id: user.id, email: user.email, full_name: user.email?.split('@')[0] || 'User' });
      if (insertErr) {
        console.error('Promo auto-create profile failed:', insertErr);
        return NextResponse.json({ success: false, error: 'Profile create failed' }, { status: 500 });
      }
    }

    // Mark user premium
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ is_premium: true, subscription_status: 'active' })
      .eq('id', user.id);

    if (updateError) {
      console.error('Failed to update profile for promo:', updateError);
      return NextResponse.json({ success: false, error: 'Could not apply promo code' }, { status: 500 });
    }

    // IMPORTANT: Single-use removal logic would go here (Supabase table transaction).
    // Since we use env list, we cannot mutate; implement persistent storage for real system.

    return NextResponse.json({ success: true, code: matched });
  } catch (e: any) {
    console.error('redeem-code error:', e);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
