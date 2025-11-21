import { NextRequest, NextResponse } from 'next/server';

import { createClientFromRequest } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  try {
    const { supabase } = createClientFromRequest(req);

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Ensure admin override is enabled
    if (!process.env.ADMIN_PREMIUM_CODE) {
      console.error('ADMIN_PREMIUM_CODE is not configured');
      return NextResponse.json(
        { error: 'Admin override not configured' },
        { status: 500 }
      );
    }

    const body = await req.json().catch(() => null);

    if (!body || typeof body.adminCode !== 'string') {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    const { adminCode } = body;

    if (adminCode !== process.env.ADMIN_PREMIUM_CODE) {
      return NextResponse.json({ error: 'Invalid admin code' }, { status: 403 });
    }

    const { error } = await supabase
      .from('profiles')
      .update({
        is_premium: true,
        subscription_status: 'admin_override',
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    if (error) {
      console.error('Error applying admin premium override:', error);
      return NextResponse.json(
        { error: 'Failed to update profile' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Unexpected error in admin premium override:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

