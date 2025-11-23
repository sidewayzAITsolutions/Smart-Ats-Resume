# 🔧 Quick Fix: Update Stripe Price ID

## ✅ Your Correct Price ID
**`price_1Ro7SxEXTLOxdWgM7s3Qs7ei`**

This is the price ID for "Smart ATS Resume PRO" at $22.00/month as shown in your Stripe Dashboard.

---

## 🚀 How to Update

### Option 1: Vercel Dashboard (Production)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project: **smartats-resume**
3. Go to **Settings** → **Environment Variables**
4. Find `NEXT_PUBLIC_STRIPE_PRO_PRICE_ID`
5. Click **Edit** and update the value to:
   ```
   price_1Ro7SxEXTLOxdWgM7s3Qs7ei
   ```
6. **Important:** Make sure it's set for:
   - ✅ Production
   - ✅ Preview (optional but recommended)
   - ✅ Development (optional but recommended)
7. Click **Save**
8. **Redeploy** your application:
   - Go to **Deployments** tab
   - Click the **⋯** menu on the latest deployment
   - Select **Redeploy**

### Option 2: Local Development (.env.local)

Create or update `.env.local` in your project root:

```bash
NEXT_PUBLIC_STRIPE_PRO_PRICE_ID=price_1Ro7SxEXTLOxdWgM7s3Qs7ei
```

Then restart your development server:
```bash
npm run dev
```

---

## ✅ Verify It's Working

After updating:

1. **Test the checkout flow:**
   - Go to `/pricing`
   - Click "Start Pro Trial"
   - Should redirect to Stripe Checkout (no error)

2. **Check browser console:**
   - Should see: `Creating checkout session with priceId: price_1Ro7SxEXTLOxdWgM7s3Qs7ei`
   - Should NOT see: `No such price` error

3. **Check server logs:**
   - Should see successful checkout session creation
   - No Stripe API errors

---

## 📋 Current Configuration

Based on your Stripe Dashboard:
- **Product:** Smart ATS Resume PRO
- **Price:** $22.00 USD / month
- **Price ID:** `price_1Ro7SxEXTLOxdWgM7s3Qs7ei`
- **Type:** Recurring subscription (monthly)
- **Status:** Active

---

## ⚠️ Important Notes

1. **Environment Variable Name:** Must be exactly `NEXT_PUBLIC_STRIPE_PRO_PRICE_ID`
2. **Price ID Format:** Must start with `price_` (yours does ✅)
3. **Case Sensitive:** The price ID is case-sensitive
4. **Redeploy Required:** After updating in Vercel, you must redeploy for changes to take effect
5. **Test vs Live:** Make sure you're using the correct Stripe keys:
   - If using `sk_live_...` → Use live price ID ✅ (you're using live)
   - If using `sk_test_...` → Use test price ID

---

## 🆘 Still Having Issues?

If you still see errors after updating:

1. **Double-check the price ID** - Copy directly from Stripe Dashboard
2. **Verify Stripe keys match** - Live keys with live price ID
3. **Clear browser cache** - Hard refresh (Cmd+Shift+R / Ctrl+Shift+R)
4. **Check Vercel logs** - Look for environment variable loading errors
5. **Verify deployment** - Make sure the latest deployment includes the updated env var

---

## 📞 Quick Reference

- **Stripe Dashboard:** https://dashboard.stripe.com/prices/price_1Ro7SxEXTLOxdWgM7s3Qs7ei
- **Vercel Environment Variables:** Project Settings → Environment Variables
- **Price Details:** $22/month, USD, Monthly recurring

