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
    const configError = { message: 'SUPABASE_NOT_CONFIGURED' };
    const noopQuery: any = {
      select: () => noopQuery,
      update: () => noopQuery,
      insert: () => noopQuery,
      delete: () => noopQuery,
      eq: () => noopQuery,
      neq: () => noopQuery,
      single: () => noopQuery,
      maybeSingle: () => noopQuery,
      order: () => noopQuery,
      limit: () => noopQuery,
      then: (resolve: any) => resolve({ data: null, error: configError }),
      data: null,
      error: configError,
    };
    const noop = {
      auth: {
        getSession: async () => ({ data: { session: null }, error: configError }),
        getUser: async () => ({ data: { user: null }, error: configError }),
        signInWithOAuth: async () => ({ data: { url: null, provider: 'google' }, error: configError }),
        signInWithPassword: async () => ({ data: { user: null, session: null }, error: configError }),
        signUp: async () => ({ data: { user: null, session: null }, error: configError }),
        signOut: async () => ({ error: configError }),
        onAuthStateChange: (_event: any, _callback: any) => ({ data: { subscription: { unsubscribe: () => {} } } }),
        exchangeCodeForSession: async () => ({ data: { user: null, session: null }, error: configError }),
      },
      from: () => noopQuery,
    } as any;
    return noop;
  }

  return createBrowserClient(env.url, env.anonKey);
}
