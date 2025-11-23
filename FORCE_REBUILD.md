# 🔧 Force Vercel to Rebuild with New Environment Variables

## The Problem

Even after redeploying, your app is still using the old price ID. This is likely due to **Vercel's build cache**.

## Solution: Force a Clean Rebuild

### Option 1: Clear Build Cache via Vercel Dashboard

1. Go to **Vercel Dashboard** → Your Project
2. Go to **Settings** → **General**
3. Scroll down to find **"Clear Build Cache"** or **"Rebuild"** options
4. Click **"Clear Build Cache"** or **"Rebuild"**
5. Wait for the rebuild to complete

### Option 2: Delete and Re-add Environment Variable

Sometimes Vercel needs the env var to be "touched" to trigger a rebuild:

1. Go to **Settings** → **Environment Variables**
2. Find `NEXT_PUBLIC_STRIPE_PRO_PRICE_ID`
3. Click **Edit**
4. **Delete** the value completely
5. Click **Save**
6. Wait 30 seconds
7. Click **Edit** again
8. **Re-enter**: `price_1Ro7SxEXTLOxdWgM7s3Qs7ei`
9. Click **Save**
10. Go to **Deployments** → **Redeploy** the latest deployment

### Option 3: Add a Dummy Environment Variable

Adding a new env var forces Vercel to rebuild:

1. Go to **Settings** → **Environment Variables**
2. Click **Add New**
3. Name: `FORCE_REBUILD`
4. Value: `1`
5. Click **Save**
6. Go to **Deployments** → **Redeploy**

### Option 4: Make a Code Change

Any code change will force a rebuild:

1. Make a small change to any file (add a comment)
2. Commit and push:
   ```bash
   git commit -m "Force rebuild to pick up updated Stripe price ID"
   git push
   ```

### Option 5: Use Vercel CLI to Deploy

```bash
# Install Vercel CLI if needed
npm i -g vercel

# Deploy with --force flag
vercel --prod --force
```

## 🔍 Verify the Fix

After rebuilding:

1. **Check the build logs:**
   - Go to your deployment → **Build Logs**
   - Look for: `NEXT_PUBLIC_STRIPE_PRO_PRICE_ID`
   - Should see the correct value: `price_1Ro7SxEXTLOxdWgM7s3Qs7ei`

2. **Test the debug endpoint:**
   - Visit: `https://your-domain.com/api/test-stripe`
   - Should show: `"stripePriceId": "price_1Ro7SxEXTLOxdWgM7s3Qs7ei"`

3. **Check browser console:**
   - Open DevTools → Console
   - Go to `/pricing` page
   - Click "Start Pro Trial"
   - Look for: `🔍 DEBUG: Reading price ID from env: price_1Ro7SxEXTLOxdWgM7s3Qs7ei`
   - Should NOT see the old price ID

4. **Clear browser cache:**
   - Hard refresh: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows)
   - Or use incognito/private mode

## 🆘 Still Not Working?

If you're still seeing the old price ID after trying all options:

1. **Check Vercel Environment Variable Settings:**
   - Make sure `NEXT_PUBLIC_STRIPE_PRO_PRICE_ID` is set for **ALL environments**:
     - ✅ Production
     - ✅ Preview  
     - ✅ Development

2. **Verify the Value:**
   - Double-check there are no extra spaces
   - Copy directly from Stripe Dashboard
   - Should be exactly: `price_1Ro7SxEXTLOxdWgM7s3Qs7ei`

3. **Check for Multiple Projects:**
   - Make sure you're updating the correct Vercel project
   - Verify the project name matches

4. **Contact Vercel Support:**
   - If nothing works, there might be a caching issue on Vercel's side
   - They can manually clear the build cache

## 📝 Quick Checklist

- [ ] Cleared Vercel build cache
- [ ] Re-added environment variable
- [ ] Redeployed after env var change
- [ ] Checked build logs show correct value
- [ ] Tested `/api/test-stripe` endpoint
- [ ] Cleared browser cache
- [ ] Verified env var is set for all environments

