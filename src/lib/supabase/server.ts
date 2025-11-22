import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextRequest } from 'next/server';

// Note: createClient is deprecated in favor of createClientFromRequest for API routes
// This function is kept for backward compatibility but should not be used in new code

export function createClientFromRequest(req: NextRequest) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
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
