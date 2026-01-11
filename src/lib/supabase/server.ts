import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextRequest } from 'next/server';

import { getSupabasePublicEnv } from './env';

// Note: createClient is deprecated in favor of createClientFromRequest for API routes
// This function is kept for backward compatibility but should not be used in new code

export function createClientFromRequest(req: NextRequest) {
  const env = getSupabasePublicEnv();
  if (!env) {
    throw new Error(
      'SUPABASE_NOT_CONFIGURED: Set NEXT_PUBLIC_SUPABASE_URL to your full project URL (e.g. https://xxxx.supabase.co) and NEXT_PUBLIC_SUPABASE_ANON_KEY.'
    );
  }

  const supabase = createServerClient(
    env.url,
    env.anonKey,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value;
        },
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        set(_name: string, _value: string, _options: CookieOptions) {
          // For API routes, we can't set cookies directly on the request
          // This is a no-op in API routes
        },
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        remove(_name: string, _options: CookieOptions) {
          // For API routes, we can't remove cookies directly on the request
          // This is a no-op in API routes
        },
      },
    }
  );

  return { supabase };
}

