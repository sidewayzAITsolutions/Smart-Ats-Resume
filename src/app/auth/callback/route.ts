// app/auth/callback/route.ts
import {
  NextRequest,
  NextResponse,
} from 'next/server';

import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { createClient as createServiceClient } from '@supabase/supabase-js';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') || '/templates';
  const error = requestUrl.searchParams.get('error');
  const error_description = requestUrl.searchParams.get('error_description');

  try {
    if (error) {
      console.error('❌ OAuth error:', error, error_description);
      return NextResponse.redirect(
        new URL(`/login?error=${encodeURIComponent(error_description || error)}`, requestUrl.origin)
      );
    }

    if (!code) {
      console.error('❌ No code present in callback URL');
      return NextResponse.redirect(new URL('/login?error=no_code', requestUrl.origin));
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('❌ Missing Supabase environment variables');
      return NextResponse.redirect(
        new URL('/login?error=configuration_error', requestUrl.origin)
      );
    }

    if (!supabaseServiceRoleKey) {
      console.error('❌ Missing SUPABASE_SERVICE_ROLE_KEY');
      return NextResponse.redirect(
        new URL('/login?error=configuration_error', requestUrl.origin)
      );
    }

    // Create redirect URL early
    const redirectUrl = new URL(next, requestUrl.origin);
    
    // Create a mutable response object for cookie handling
    // We'll create the redirect response after setting cookies
    let response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });

    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: CookieOptions }[]) {
          cookiesToSet.forEach(({ name, value, ...options }) => {
            request.cookies.set({ name, value, ...options });
            response.cookies.set({ name, value, ...options });
          });
        },
      },
    });

    // Exchange the code for a session (sets cookies on the response)
    console.log('🔄 Exchanging code for session...');
    const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
    
    if (exchangeError) {
      console.error('❌ Code exchange error:', exchangeError);
      return NextResponse.redirect(
        new URL(`/login?error=${encodeURIComponent(exchangeError.message)}`, requestUrl.origin)
      );
    }

    if (!data.user) {
      console.error('❌ No user data returned from code exchange');
      return NextResponse.redirect(
        new URL('/login?error=no_user_data', requestUrl.origin)
      );
    }

    console.log('✅ Code exchanged successfully for user:', data.user.id, data.user.email);

    // Ensure profile exists - try multiple times with increasing delays
    let profile = null;
    let attempts = 0;
    const maxAttempts = 3;

    while (!profile && attempts < maxAttempts) {
      attempts++;
      const delay = attempts * 500; // 500ms, 1000ms, 1500ms
      
      if (attempts > 1) {
        console.log(`⏳ Waiting ${delay}ms before checking profile (attempt ${attempts}/${maxAttempts})...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }

      // Check if profile was created by the database trigger
      const { data: profileData, error: selectError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .maybeSingle();

      if (selectError) {
        console.error(`❌ Error checking profile (attempt ${attempts}):`, selectError);
      }

      if (profileData) {
        profile = profileData;
        console.log('✅ Profile found for user:', data.user.id);
        break;
      }
    }

    // If profile still doesn't exist, create it with service role
    if (!profile) {
      console.log('⚠️ Profile not found after trigger wait, creating manually with service role...');

      try {
        const supabaseServiceRole = createServiceClient(
          supabaseUrl,
          supabaseServiceRoleKey
        );

        const profileData = {
          id: data.user.id,
          email: data.user.email || '',
          full_name: data.user.user_metadata?.full_name || 
                     data.user.user_metadata?.name || 
                     data.user.user_metadata?.full_name ||
                     '',
          avatar_url: data.user.user_metadata?.avatar_url || 
                     data.user.user_metadata?.picture || 
                     '',
          is_premium: false,
          // subscription_status intentionally omitted for free users (NULL is allowed)
        };

        console.log('📝 Inserting profile with data:', {
          id: profileData.id,
          email: profileData.email,
          full_name: profileData.full_name,
        });

        const { data: insertedProfile, error: insertError } = await supabaseServiceRole
          .from('profiles')
          .insert(profileData)
          .select()
          .single();

        if (insertError) {
          console.error('❌ Failed to create user profile:', insertError);
          console.error('Insert error details:', {
            code: insertError.code,
            message: insertError.message,
            details: insertError.details,
            hint: insertError.hint,
          });
          
          // Check if it's a duplicate key error (profile was created between checks)
          if (insertError.code === '23505') {
            console.log('ℹ️ Profile already exists (duplicate key error), continuing...');
          } else {
            // For other errors, still redirect but log the issue
            console.error('⚠️ Profile creation failed, but continuing with redirect');
          }
        } else {
          console.log('✅ User profile created successfully:', insertedProfile?.id);
          profile = insertedProfile;
        }
      } catch (createError: any) {
        console.error('❌ Exception during profile creation:', createError);
        console.error('Error details:', {
          message: createError.message,
          stack: createError.stack,
        });
        // Continue with redirect even if profile creation fails
      }
    }

    // Verify profile exists one final time
    if (!profile) {
      const { data: finalCheck } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .maybeSingle();
      
      if (finalCheck) {
        console.log('✅ Profile verified on final check');
        profile = finalCheck;
      } else {
        console.error('❌ Profile still does not exist after all attempts');
        // Still redirect - the user can try again or we can handle this on the frontend
      }
    }

    // Create final redirect response with all cookies
    const finalResponse = NextResponse.redirect(redirectUrl);
    
    // Copy all cookies from the session exchange to the redirect response
    response.cookies.getAll().forEach((cookie) => {
      finalResponse.cookies.set(cookie.name, cookie.value, {
        path: cookie.path || '/',
        domain: cookie.domain,
        maxAge: cookie.maxAge,
        httpOnly: cookie.httpOnly,
        secure: cookie.secure ?? true, // Default to secure in production
        sameSite: (cookie.sameSite as 'lax' | 'strict' | 'none' | undefined) || 'lax',
      });
    });

    console.log('✅ Redirecting to:', redirectUrl.toString());
    console.log('✅ Cookies set:', response.cookies.getAll().length, 'cookies');
    return finalResponse;

  } catch (e: any) {
    console.error('❌ Auth callback error:', e);
    console.error('Error details:', {
      message: e.message,
      stack: e.stack,
    });
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(e.message || 'callback_failed')}`, requestUrl.origin)
    );
  }
}

// Remove edge runtime - it doesn't work well with Supabase service role client
// export const runtime = 'edge';
