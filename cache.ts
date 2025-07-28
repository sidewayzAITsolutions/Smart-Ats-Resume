// lib/cache.ts
import { unstable_cache } from 'next/cache';

import { createServerClient } from '@supabase/ssr';

export const getCachedTemplates = unstable_cache(
  async () => {
    // Create a simple client for public data (no cookies needed)
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get: () => undefined,
          set: () => {},
          remove: () => {},
        },
      }
    );
    const { data } = await supabase.from('templates').select('*');
    return data;
  },
  ['templates'],
  { revalidate: 3600 } // 1 hour
);
