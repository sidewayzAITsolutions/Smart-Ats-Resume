# 🔍 Debugging Vercel Environment Variable Issue

## The Problem

Even though you're not using build cache, `/api/test-stripe` still shows the old price ID. This means **Vercel's environment variable itself still has the old value**.

## Step-by-Step Verification

### Step 1: Check What Vercel Actually Has

1. Go to Vercel Dashboard → Your Project → **Settings** → **Environment Variables**
2. Find `NEXT_PUBLIC_STRIPE_PRO_PRICE_ID`
3. Click the **eye icon** 👁️ to reveal the value
4. **What does it show?**
   - If it shows: `price_1RfIhREXTLOxdWgMKQJGzJzJ` → **This is the problem!**
   - If it shows: `price_1Ro7SxEXTLOxdWgM7s3Qs7ei` → Then there's a different issue

### Step 2: Check Which Environments It's Set For

Look at the environment variable row - which checkboxes are checked?
- ✅ Production
- ✅ Preview  
- ✅ Development

**Make sure ALL THREE are checked!**

### Step 3: Use the Enhanced Debug Endpoint

After deploying the updated code, visit:
```
https://smartatsresume.com/api/test-stripe
```

This will now show:
- The exact value Vercel is providing
- Whether it matches the expected value
- A recommendation on what to do

### Step 4: Nuclear Option - Complete Reset

If the env var still shows the old value:

1. **Delete ALL instances** of `NEXT_PUBLIC_STRIPE_PRO_PRICE_ID`:
   - Delete Production version
   - Delete Preview version  
   - Delete Development version
   - Make sure it's completely gone

2. **Wait 30 seconds**

3. **Add it back fresh**:
   - Click "Add New"
   - Key: `NEXT_PUBLIC_STRIPE_PRO_PRICE_ID`
   - Value: `price_1Ro7SxEXTLOxdWgM7s3Qs7ei`
   - Check ALL THREE boxes: Production, Preview, Development
   - Click Save

4. **Verify it's saved**:
   - Click the eye icon
   - Should show: `price_1Ro7SxEXTLOxdWgM7s3Qs7ei`
   - Should NOT show: `price_1RfIhREXTLOxdWgMKQJGzJzJ`

5. **Deploy** (without cache):
   - Go to Deployments
   - Redeploy
   - Make sure "Use existing Build Cache" is **UNCHECKED**

### Step 5: Verify After Deployment

1. Wait for deployment to complete
2. Visit: `https://smartatsresume.com/api/test-stripe`
3. Check the response - should show:
   ```json
   {
     "config": {
       "stripePriceId": "price_1Ro7SxEXTLOxdWgM7s3Qs7ei",
       "isCorrectPriceId": true,
       "recommendation": "Environment variable is correct!"
     }
   }
   ```

## Common Issues

### Issue 1: Multiple Projects
- Make sure you're editing the **correct Vercel project**
- Check the project name matches your domain
- You might have `smart-ats-resume` and `smartats-resume` as separate projects

### Issue 2: Team/Organization
- Environment variables are per-team
- Make sure you're in the correct team/organization
- Check the team dropdown in Vercel dashboard

### Issue 3: Environment Scope
- The variable might be set for Preview but not Production
- Make sure Production checkbox is checked ✅

### Issue 4: Typo in Value
- Copy directly from Stripe Dashboard
- No extra spaces before/after
- Should be exactly: `price_1Ro7SxEXTLOxdWgM7s3Qs7ei`

## Temporary Solution

I've already added a temporary hardcode fallback in the code, so **your checkout will work regardless**. But we still need to fix the Vercel env var for long-term maintenance.

## Next Steps

1. Check what Vercel actually shows for the env var value
2. Use the enhanced `/api/test-stripe` endpoint to see what's being loaded
3. If it's still wrong, do the "Nuclear Option" reset above
4. Once fixed, we can remove the temporary hardcode

