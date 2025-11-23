# 🔄 Fix: Redeploy to Pick Up Environment Variable

## The Issue

Your environment variable `NEXT_PUBLIC_STRIPE_PRO_PRICE_ID` is correctly set to `price_1Ro7SxEXTLOxdWgM7s3Qs7ei` in Vercel, but you're still seeing errors about the old price ID `price_1RfIhREXTLOxdWgMKQJGzJzJ`.

## Why This Happens

**Next.js environment variables that start with `NEXT_PUBLIC_` are embedded into your JavaScript bundle at BUILD TIME**, not runtime. This means:

- ✅ The environment variable is set correctly in Vercel
- ❌ But your current deployment was built BEFORE you updated it
- ❌ So the old price ID is still baked into the JavaScript

## Solution: Redeploy Your Application

### Option 1: Redeploy via Vercel Dashboard (Recommended)

1. Go to your Vercel Dashboard
2. Navigate to your project: **smart-ats-resume**
3. Go to the **Deployments** tab
4. Find your latest deployment
5. Click the **⋯** (three dots) menu on the deployment
6. Select **Redeploy**
7. Wait for the deployment to complete (usually 2-5 minutes)

### Option 2: Trigger via Git Push

If you have automatic deployments enabled:

```bash
# Make a small change to trigger a rebuild
git commit --allow-empty -m "Redeploy to pick up updated Stripe price ID"
git push
```

### Option 3: Redeploy via Vercel CLI

```bash
vercel --prod
```

## ✅ Verify It's Fixed

After redeployment:

1. **Clear your browser cache** (important!)
   - Hard refresh: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows/Linux)
   - Or use incognito/private browsing mode

2. **Test the checkout flow:**
   - Go to `/pricing`
   - Click "Start Pro Trial"
   - Check browser console - should see: `Creating checkout session with priceId: price_1Ro7SxEXTLOxdWgM7s3Qs7ei`
   - Should NOT see: `No such price: price_1RfIhREXTLOxdWgMKQJGzJzJ`

3. **Check Vercel build logs:**
   - Go to your deployment → **Build Logs**
   - Verify the build completed successfully
   - Check that environment variables were loaded

## 🔍 How to Confirm Environment Variable is Loaded

After redeployment, you can verify by checking the browser console:

1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for logs like: `Using price ID: price_1Ro7SxEXTLOxdWgM7s3Qs7ei`

If you see the old price ID in the logs, the deployment didn't pick up the new environment variable.

## ⚠️ Important Notes

- **Build Time vs Runtime**: `NEXT_PUBLIC_*` vars are baked in at build time
- **Redeploy Required**: Any changes to `NEXT_PUBLIC_*` vars require a new deployment
- **Browser Cache**: Clear cache or use incognito mode to see the new build
- **Build Duration**: Usually takes 2-5 minutes for a full redeploy

## 🆘 Still Not Working?

If after redeployment you still see the old price ID:

1. **Double-check Vercel environment variables:**
   - Settings → Environment Variables
   - Verify `NEXT_PUBLIC_STRIPE_PRO_PRICE_ID` = `price_1Ro7SxEXTLOxdWgM7s3Qs7ei`
   - Make sure it's enabled for "Production" environment

2. **Check build logs:**
   - Look for any errors during build
   - Verify environment variables are being loaded

3. **Verify deployment:**
   - Check that the latest deployment completed successfully
   - Look at the deployment timestamp - should be after you updated the env var

4. **Clear all caches:**
   - Browser cache
   - CDN cache (Vercel should handle this automatically)
   - Try incognito/private browsing mode

