# Google OAuth Debugging Guide

## Current Issue
When signing up with Google, users are redirected back to the homepage with no profile created.

## OAuth Flow Analysis

Based on the network request you provided, the OAuth flow is working correctly up to the Google authentication step:

1. ✅ User clicks "Sign up with Google"
2. ✅ App redirects to Supabase auth endpoint with correct `redirect_to` parameter
3. ✅ Supabase redirects to Google OAuth
4. ⚠️ After Google authentication, callback may not be creating profile

## Potential Issues & Solutions

### 1. Environment Variables in Production

**Check in Vercel Dashboard:**
- Go to your project → Settings → Environment Variables
- Verify these are set for **Production** environment:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY` ⚠️ **CRITICAL - This must be set!**

**To verify:**
```bash
# Check Vercel logs after deployment
# Look for errors like "Missing SUPABASE_SERVICE_ROLE_KEY"
```

### 2. Database Trigger

The database should have a trigger that automatically creates profiles. Verify it exists:

```sql
-- Run this in Supabase SQL Editor
SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';
```

If it doesn't exist, run the migration:
```sql
-- From database/001_initial_schema.sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### 3. RLS Policies

Verify RLS policies allow profile creation:

```sql
-- Check policies
SELECT * FROM pg_policies WHERE tablename = 'profiles';

-- Should have a policy like:
-- "Service role can insert profiles"
```

### 4. Check Vercel Function Logs

After attempting Google signup, check Vercel logs:
1. Go to Vercel Dashboard → Your Project → Deployments
2. Click on the latest deployment
3. Go to "Functions" tab
4. Find `/auth/callback` route
5. Check logs for:
   - `🔄 Exchanging code for session...`
   - `✅ Code exchanged successfully`
   - `✅ Profile found` or `⚠️ Profile not found`
   - `✅ User profile created successfully`

### 5. Test the Callback Route Directly

Create a test endpoint to verify environment variables:

```typescript
// src/app/api/test-callback/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    hasServiceRoleKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 20) + '...',
  });
}
```

Visit: `https://www.smartatsresume.com/api/test-callback`

### 6. Supabase Dashboard Check

1. Go to Supabase Dashboard → Authentication → Users
2. Check if the user was created after Google signup
3. If user exists but no profile:
   - The trigger might be failing
   - Check Supabase logs for errors

### 7. Google Cloud Console Check

Verify redirect URIs in Google Cloud Console:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. APIs & Services → Credentials
3. Find your OAuth 2.0 Client ID
4. Verify authorized redirect URIs include:
   - `https://uxzpopwpbqfhfsbtlvim.supabase.co/auth/v1/callback` ✅ (Supabase callback)
   - Your app callback should NOT be here (Supabase handles it)

## Debugging Steps

1. **Check Vercel Logs:**
   ```bash
   # Install Vercel CLI if needed
   npm i -g vercel
   
   # View logs
   vercel logs --follow
   ```

2. **Test Locally First:**
   - Set up `.env.local` with production values
   - Test Google OAuth locally
   - Check if profile is created

3. **Add Temporary Logging:**
   The callback route now has extensive logging. Check Vercel function logs for:
   - `🔄 Exchanging code for session...`
   - `✅ Code exchanged successfully`
   - `⏳ Waiting...` (profile check retries)
   - `✅ Profile found` or `⚠️ Profile not found`
   - `✅ User profile created successfully`

4. **Manual Profile Creation Test:**
   If profile creation is failing, test manually:
   ```sql
   -- In Supabase SQL Editor
   INSERT INTO profiles (id, email, full_name, is_premium)
   VALUES (
     'test-user-id',
     'test@example.com',
     'Test User',
     false
   );
   ```

## Common Issues & Fixes

### Issue: "Missing SUPABASE_SERVICE_ROLE_KEY"
**Fix:** Add `SUPABASE_SERVICE_ROLE_KEY` to Vercel environment variables

### Issue: Profile creation fails with RLS error
**Fix:** Verify service role policy exists:
```sql
CREATE POLICY "Service role can insert profiles" ON profiles
  FOR INSERT WITH CHECK (auth.role() = 'service_role');
```

### Issue: Callback route times out
**Fix:** The retry logic might be taking too long. Consider reducing retry attempts or delays.

### Issue: User created but no profile
**Fix:** Check if database trigger is enabled and working.

## Next Steps

1. ✅ Code fixes applied (callback route improved)
2. ⏳ Verify environment variables in Vercel
3. ⏳ Check Vercel function logs after next signup attempt
4. ⏳ Verify database trigger exists
5. ⏳ Test the flow end-to-end

## Contact Points

If issues persist:
- Check Vercel function logs for detailed error messages
- Check Supabase logs for database errors
- Verify all environment variables are set correctly
- Test the callback route with a test endpoint

