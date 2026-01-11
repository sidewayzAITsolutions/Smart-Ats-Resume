// src/lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr';

import { getSupabasePublicEnv } from './env';

export function createClient() {
  const env = getSupabasePublicEnv();

  if (!env) {
    // Do not crash builds in environments without env vars (e.g., CI/static export).
    // Return a minimal no-op client that surfaces configuration errors at runtime only.
    console.warn(
      'Supabase is not configured (missing/invalid NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY); returning a no-op client.'
    );
    const noop = {
      auth: {
        getSession: async () => ({ data: { session: null }, error: { message: 'SUPABASE_NOT_CONFIGURED' } }),
        getUser: async () => ({ data: { user: null }, error: { message: 'SUPABASE_NOT_CONFIGURED' } }),
        signInWithPassword: async () => ({ data: { user: null }, error: { message: 'SUPABASE_NOT_CONFIGURED' } }),
        signUp: async () => ({ data: { user: null }, error: { message: 'SUPABASE_NOT_CONFIGURED' } }),
        signOut: async () => ({ error: { message: 'SUPABASE_NOT_CONFIGURED' } }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      },
      from: () => ({
        select: () => ({ data: null, error: { message: 'SUPABASE_NOT_CONFIGURED' } }),
        update: () => ({ data: null, error: { message: 'SUPABASE_NOT_CONFIGURED' } }),
        insert: () => ({ data: null, error: { message: 'SUPABASE_NOT_CONFIGURED' } }),
        delete: () => ({ data: null, error: { message: 'SUPABASE_NOT_CONFIGURED' } }),
        eq: () => ({ data: null, error: { message: 'SUPABASE_NOT_CONFIGURED' } }),
        single: () => ({ data: null, error: { message: 'SUPABASE_NOT_CONFIGURED' } }),
      }),
    } as any;
    return noop;
  }

  return createBrowserClient(env.url, env.anonKey);
}
