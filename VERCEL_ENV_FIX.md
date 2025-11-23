# 🚨 URGENT: Vercel Environment Variable Not Updating

## The Problem

Your `/api/test-stripe` endpoint shows:
```json
{
  "stripePriceId": "price_1RfIhREXTLOxdWgMKQJGzJzJ"  // ❌ OLD VALUE
}
```

But it should show:
```json
{
  "stripePriceId": "price_1Ro7SxEXTLOxdWgM7s3Qs7ei"  // ✅ CORRECT VALUE
}
```

This means **Vercel is still using the old environment variable value**, even though you've updated it in the dashboard.

## 🔍 Step-by-Step Fix

### Step 1: Verify You're Editing the Correct Project

1. Go to Vercel Dashboard
2. Make sure you're in the **correct project**: `smart-ats-resume` or `smartats-resume`
3. Check the project URL matches your domain

### Step 2: Delete and Re-create the Environment Variable

**This is critical - just editing might not work:**

1. Go to **Settings** → **Environment Variables**
2. Find `NEXT_PUBLIC_STRIPE_PRO_PRICE_ID`
3. Click the **trash icon** to **DELETE** it completely
4. Click **Save** / **Confirm**
5. Wait 10 seconds
6. Click **"Add New"** button
7. **Key**: `NEXT_PUBLIC_STRIPE_PRO_PRICE_ID`
8. **Value**: `price_1Ro7SxEXTLOxdWgM7s3Qs7ei`
9. **IMPORTANT**: Check ALL these boxes:
   - ✅ **Production**
   - ✅ **Preview**
   - ✅ **Development**
10. Click **Save**

### Step 3: Verify It's Saved Correctly

1. Refresh the Environment Variables page
2. Find `NEXT_PUBLIC_STRIPE_PRO_PRICE_ID`
3. Click the **eye icon** to reveal the value
4. Verify it shows: `price_1Ro7SxEXTLOxdWgM7s3Qs7ei`
5. Verify it's enabled for **Production** ✅

### Step 4: Force a Complete Rebuild

**Option A: Via Dashboard (Recommended)**
1. Go to **Deployments** tab
2. Find your latest deployment
3. Click **⋯** (three dots menu)
4. Select **"Redeploy"**
5. **IMPORTANT**: Check the box **"Use existing Build Cache"** - **UNCHECK IT** ❌
6. Click **Redeploy**
7. Wait for build to complete (2-5 minutes)

**Option B: Via Git Push**
```bash
# Make a small code change to force rebuild
echo "// Force rebuild $(date)" >> src/app/pricing/page.tsx
git add .
git commit -m "Force rebuild to pick up updated Stripe price ID"
git push
```

**Option C: Via Vercel CLI**
```bash
vercel --prod --force
```

### Step 5: Verify the Fix

After rebuild completes:

1. **Wait 2-3 minutes** for CDN cache to clear
2. Visit: `https://smartatsresume.com/api/test-stripe`
3. Should now show:
   ```json
   {
     "stripePriceId": "price_1Ro7SxEXTLOxdWgM7s3Qs7ei"  // ✅ CORRECT!
   }
   ```

4. If it still shows the old value:
   - Wait 5 more minutes (CDN propagation)
   - Try incognito/private browsing mode
   - Check Vercel build logs to verify env var was loaded

### Step 6: Check Build Logs

1. Go to your deployment → **Build Logs**
2. Search for: `NEXT_PUBLIC_STRIPE_PRO_PRICE_ID`
3. Should see the correct value in the build output

## ⚠️ Common Mistakes

1. **Editing instead of deleting/recreating** - Sometimes Vercel caches the old value
2. **Not checking all environment boxes** - Make sure Production is checked ✅
3. **Redeploying with cache** - Uncheck "Use existing Build Cache"
4. **Not waiting for CDN** - Changes can take 2-5 minutes to propagate

## 🆘 If Still Not Working

If after all these steps it still shows the old value:

1. **Check for multiple projects:**
   - You might have `smart-ats-resume` and `smartats-resume` as separate projects
   - Make sure you're updating the one that's actually deployed

2. **Check Vercel team/organization:**
   - Make sure you're in the correct team/organization
   - Environment variables are per-team

3. **Contact Vercel Support:**
   - There might be a caching issue on their side
   - They can manually clear the build cache

4. **Temporary workaround:**
   - We can hardcode the price ID temporarily to verify everything else works
   - Then switch back to env var once Vercel cache clears

## 📋 Verification Checklist

- [ ] Deleted old `NEXT_PUBLIC_STRIPE_PRO_PRICE_ID` env var
- [ ] Created new one with correct value: `price_1Ro7SxEXTLOxdWgM7s3Qs7ei`
- [ ] Enabled for Production ✅
- [ ] Enabled for Preview ✅  
- [ ] Enabled for Development ✅
- [ ] Redeployed WITHOUT build cache
- [ ] Waited 5 minutes for CDN propagation
- [ ] Checked `/api/test-stripe` shows correct value
- [ ] Verified build logs show correct env var

