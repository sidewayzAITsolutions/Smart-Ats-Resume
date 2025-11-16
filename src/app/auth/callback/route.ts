// app/auth/callback/route.ts
import {
  NextRequest,
  NextResponse,
} from 'next/server';

import {
  type CookieOptions,
  createServerClient,
} from '@supabase/ssr';

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
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          response.cookies.set({ name, value: '', ...options });
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
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .maybeSingle();

      if (!profile) {
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            email: data.user.email,
            full_name: data.user.user_metadata?.full_name || data.user.user_metadata?.name || '',
            avatar_url: data.user.user_metadata?.avatar_url || data.user.user_metadata?.picture || '',
            is_premium: false,
            subscription_status: 'free',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });
        if (insertError) {
          console.warn('Failed to create user profile:', insertError);
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
