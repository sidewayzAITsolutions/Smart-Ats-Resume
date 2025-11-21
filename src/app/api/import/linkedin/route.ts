import {
  NextRequest,
  NextResponse,
} from 'next/server';

import { createClientFromRequest } from '@/lib/supabase/server';

// NOTE: This route was previously backed by Proxycurl for LinkedIn URL import.
// That provider is no longer available, so this endpoint intentionally returns
// a 503 error to indicate that URL-based LinkedIn import is disabled.
// The UI now uses PDF-based LinkedIn import via /api/parse-resume instead.
export async function POST(req: NextRequest) {
  const { supabase } = createClientFromRequest(req);
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.json(
    {
      error:
        'LinkedIn URL import is temporarily unavailable. Please export your LinkedIn profile as a PDF and use the LinkedIn PDF import instead.',
    },
    { status: 503 },
  );
}

