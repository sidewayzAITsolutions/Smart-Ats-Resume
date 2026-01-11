// lib/cache.ts
import { unstable_cache } from 'next/cache';

import { createServerClient } from '@supabase/ssr';

import { getSupabasePublicEnv } from './src/lib/supabase/env';

export const getCachedTemplates = unstable_cache(
  async () => {
    const env = getSupabasePublicEnv();
    if (!env) return [];

    // Create a simple client for public data (no cookies needed)
    const supabase = createServerClient(
      env.url,
      env.anonKey,
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
