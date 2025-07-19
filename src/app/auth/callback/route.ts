// app/auth/callback/route.ts
import { createClientFromRequest } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get('code');
    const next = requestUrl.searchParams.get('next') || '/templates';
    const error = requestUrl.searchParams.get('error');
    const error_description = requestUrl.searchParams.get('error_description');

    console.log('Auth callback received: - route.ts:38', { code: !!code, next, error, error_description });

    // Handle errors from OAuth provider
    if (error) {
      console.error('OAuth error: - route.ts:42', error, error_description);
      return NextResponse.redirect(
        new URL(`/login?error=${encodeURIComponent(error_description || error)}`, requestUrl.origin)
      );
    }

    if (code) {
      const { supabase } = createClientFromRequest(request);
      
      // Exchange code for session
      const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
      
      if (exchangeError) {
        console.error('Code exchange error: - route.ts:56', exchangeError);
        return NextResponse.redirect(
          new URL(`/login?error=${encodeURIComponent(exchangeError.message)}`, requestUrl.origin)
        );
      }

      if (data.user) {
        console.log('User authenticated successfully: - route.ts:63', data.user.email);
        
        // Check if user profile exists
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        // If no profile exists, create one
        if (!profile && !profileError) {
          console.log('Creating new user profile... - route.ts:74');
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
              updated_at: new Date().toISOString()
            });

          if (insertError) {
            console.error('Profile creation error: - route.ts:89', insertError);
            // Don't fail the auth flow for profile creation errors
          } else {
            console.log('User profile created successfully - route.ts:92');
          }
        }

        // Successful authentication - redirect to next URL
        console.log('Redirecting to: - route.ts:97', next);
        return NextResponse.redirect(new URL(next, requestUrl.origin));
      }
    }

    // No code present - redirect to login
    console.log('No code present, redirecting to login - route.ts:103');
    return NextResponse.redirect(new URL('/login?error=no_code', requestUrl.origin));
    
  } catch (error) {
    console.error('Auth callback error: - route.ts:107', error);
    return NextResponse.redirect(new URL('/login?error=callback_failed', request.url));
  }
}

export const runtime = 'edge';

