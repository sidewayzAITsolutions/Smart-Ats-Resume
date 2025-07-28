import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

// src/lib/supabase/server.ts
import {
  type CookieOptions,
  createServerClient,
} from '@supabase/ssr';

export function createClient(cookieStore: ReturnType<typeof cookies>) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    // Log a more descriptive error and potentially provide guidance
    console.error('Missing Supabase environment variables: NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY.');
    // In a production app, you might want to throw a specific error or handle this gracefully
    // to prevent the application from crashing in development due to misconfiguration.
    throw new Error('Supabase environment variables are not set. Please check your .env.local file.');
  }

  return createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            // The `cookies().set()` method can throw if used in a Server Component
            // that itself is called from a Client Component.
            // This can be ignored if you only intend to set cookies in a Server Action or Route Handler
            console.warn('Could not set cookie in Server Component:', error);
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options });
          } catch (error) {
            console.warn('Could not remove cookie in Server Component:', error);
          }
        },
      },
    }
  );
}

export function createClientFromRequest(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase environment variables: NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY.');
    throw new Error('Supabase environment variables are not set. Please check your .env.local file.');
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          // For API routes, we can't set cookies in the response here
          // This would need to be handled in the response
          console.warn('Cannot set cookies in API route context');
        },
        remove(name: string, options: CookieOptions) {
          // For API routes, we can't remove cookies in the response here
          // This would need to be handled in the response
          console.warn('Cannot remove cookies in API route context');
        },
      },
    }
  );

  return { supabase };
}
