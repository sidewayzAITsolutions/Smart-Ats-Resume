// app/auth/callback/route.ts
import {
  NextRequest,
  NextResponse,
} from 'next/server';

import { createServerClient } from '@supabase/ssr';
import { createClient as createServiceClient } from '@supabase/supabase-js';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') || '/templates';
  const error = requestUrl.searchParams.get('error');
  const error_description = requestUrl.searchParams.get('error_description');

  // Prepare response early so we can set cookies on it
  const redirectUrl = error
    ? new URL(`/login?error=${encodeURIComponent(error_description || error)}`, requestUrl.origin)
    : new URL(next, requestUrl.origin);
  const response = NextResponse.redirect(redirectUrl);

  try {
    if (error) {
      console.error('OAuth error:', error, error_description);
      return response;
    }

    if (!code) {
      console.log('No code present, redirecting to login');
      return NextResponse.redirect(new URL('/login?error=no_code', requestUrl.origin));
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, ...options }) => {
            response.cookies.set({ name, value, ...options });
          });
        },
      },
    });

    // Exchange the code for a session (sets cookies on the response)
    const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
    if (exchangeError) {
      console.error('Code exchange error:', exchangeError);
      return NextResponse.redirect(
        new URL(`/login?error=${encodeURIComponent(exchangeError.message)}`, requestUrl.origin)
      );
    }

    if (data.user) {
      // Ensure the user profile exists
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .maybeSingle();

      if (!profile) {
        // Use service role key to bypass RLS for profile creation
        const supabaseServiceRole = createServiceClient(
          supabaseUrl,
          process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        const { error: insertError } = await supabaseServiceRole
          .from('profiles')
          .insert({
            id: data.user.id,
            email: data.user.email,
            full_name: data.user.user_metadata?.full_name || data.user.user_metadata?.name || '',
            avatar_url: data.user.user_metadata?.avatar_url || data.user.user_metadata?.picture || '',
            is_premium: false,
            // subscription_status intentionally omitted for free users (NULL is allowed)
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });
        if (insertError) {
          console.error('Failed to create user profile:', insertError);
          // Log more details to help debug
          console.error('Insert error details:', {
            code: insertError.code,
            message: insertError.message,
            details: insertError.details,
          });
        } else {
          console.log('✅ User profile created successfully for:', data.user.id);
        }
      }
    }

    // Redirect with cookies set
    return response;
  } catch (e) {
    console.error('Auth callback error:', e);
    return NextResponse.redirect(new URL('/login?error=callback_failed', requestUrl.origin));
  }
}

export const runtime = 'edge';
