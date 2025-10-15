# Subscription Storage Fix Guide

## 🔍 Problem Fixed

When users upgraded their plan, it kept showing "Free plan" because:

1. **Hardcoded Price IDs**: Frontend had hardcoded Stripe price IDs that might not match backend environment variables
2. **Webhook Dependency**: Subscriptions only saved when webhook fired, but if price IDs didn't match, plan stayed "Free"
3. **No Manual Sync**: No way to manually refresh subscription status
4. **Google OAuth Callback Issue**: Callback page used hardcoded localhost URL instead of production API

## ✅ What Was Fixed

### 1. Google OAuth Callback (Already Fixed)

**File**: `apps/web/app/auth/callback/page.tsx`

- Changed hardcoded `http://localhost:3001/api/users/me` to use `process.env.NEXT_PUBLIC_API_URL`
- Now works in both development and production

### 2. Enhanced Webhook Handling

**File**: `apps/api/src/payments/payments.service.ts`

- Added detailed logging to track price ID comparisons
- Better error messages when price IDs don't match
- Console logs show exactly what's being compared

### 3. Manual Subscription Sync

**New Endpoint**: `POST /api/payments/sync-subscription`

- Users can manually sync their subscription from Stripe
- Checks current Stripe subscription and updates database
- Returns detailed status about what changed

### 4. Dynamic Pricing Plans

**New Endpoint**: `GET /api/payments/plans`

- Returns pricing plans with correct price IDs from environment variables
- No more hardcoded price IDs in frontend

**File**: `apps/web/app/pricing/page.tsx`

- Now fetches plans from backend API
- Uses SWR for caching and automatic revalidation
- Falls back to default plans if API unavailable

### 5. Refresh Button in Billing Page

**File**: `apps/web/app/dashboard/billing/page.tsx`

- Added "Refresh Status" button with spinning icon
- Users can manually sync their subscription anytime
- Shows toast notifications with sync results

## 🚀 Deployment Checklist

### Backend Environment Variables (Railway)

Make sure these are set correctly:

```bash
# Stripe Configuration
STRIPE_SECRET_KEY=sk_live_your_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# CRITICAL: These must match the price IDs used in frontend
STRIPE_PRICE_PRO=price_1SI58JLV9XDn5rbH7mHIsqWj
STRIPE_PRICE_ENTERPRISE=price_1SI5BRLV9XDn5rbH3yQsOsLs
STRIPE_PRICE_FREE=price_1SI5BJLV9XDn5rbHFxytc0RO

# OAuth & Frontend
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-your-secret
GOOGLE_CALLBACK_URL=https://your-api-domain.railway.app/api/auth/google/callback
FRONTEND_URL=https://your-frontend-domain.vercel.app
```

### Frontend Environment Variables (Vercel)

```bash
NEXT_PUBLIC_API_URL=https://your-api-domain.railway.app/api
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
```

### Google Cloud Console

Update **Authorized redirect URIs**:

- `https://your-api-domain.railway.app/api/auth/google/callback`

### Stripe Dashboard

1. **Webhook Configuration**:
   - URL: `https://your-api-domain.railway.app/api/payments/webhook`
   - Events to send:
     - `checkout.session.completed`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`

2. **Price IDs**:
   - Make sure the price IDs in your backend env vars match the actual Stripe price IDs

## 🔧 How to Use the New Features

### For Users Who Already Upgraded But Still Show "Free"

1. Go to the Billing page (`/dashboard/billing`)
2. Click the **"Refresh Status"** button
3. If you have an active Stripe subscription, it will sync automatically
4. Your plan should now show correctly

### Debug Tools

**Check Stripe Configuration**:

```bash
GET /api/payments/debug/config
```

This returns:

- Which environment variables are set
- Whether price IDs exist in Stripe
- Price details (amount, currency, active status)

### Manual Sync via API

```bash
POST /api/payments/sync-subscription
Authorization: Bearer YOUR_JWT_TOKEN
```

Response:

```json
{
  "synced": true,
  "message": "Subscription synced successfully",
  "oldPlan": "free",
  "newPlan": "pro",
  "subscriptionStatus": "active"
}
```

## 🐛 Troubleshooting

### Issue: Plan still shows "Free" after sync

**Solutions**:

1. Check webhook logs in Stripe Dashboard
2. Verify `STRIPE_PRICE_PRO` and `STRIPE_PRICE_ENTERPRISE` match your actual price IDs
3. Run `/api/payments/debug/config` to verify configuration
4. Check backend logs for webhook price comparison

### Issue: Google OAuth keeps looping

**Solutions**:

1. Verify `NEXT_PUBLIC_API_URL` is set correctly in Vercel
2. Check browser console for errors
3. Ensure `FRONTEND_URL` is set in Railway backend
4. Verify Google OAuth redirect URI in Google Cloud Console

### Issue: Webhook not firing

**Solutions**:

1. Check Stripe webhook URL is correct
2. Verify webhook secret matches `STRIPE_WEBHOOK_SECRET`
3. Check Railway logs for webhook errors
4. Test webhook with Stripe CLI: `stripe trigger checkout.session.completed`

## 📝 Testing Steps

1. **Test Price ID Sync**:

   ```bash
   # Check backend has correct price IDs
   curl https://your-api.railway.app/api/payments/plans
   ```

2. **Test Subscription Flow**:
   - Create new user
   - Upgrade to Pro plan
   - Check if plan updates automatically
   - If not, click "Refresh Status"

3. **Test Google OAuth**:
   - Sign out
   - Click "Sign in with Google"
   - Should redirect properly and authenticate

## 🎯 Key Files Changed

### Backend

- `apps/api/src/payments/payments.service.ts` - Added logging, sync method, pricing endpoint
- `apps/api/src/payments/payments.controller.ts` - Added sync and plans endpoints

### Frontend

- `apps/web/app/auth/callback/page.tsx` - Fixed production API URL
- `apps/web/app/pricing/page.tsx` - Now fetches plans from API
- `apps/web/app/dashboard/billing/page.tsx` - Added refresh button

## 🔄 Migration Steps for Existing Users

If you have existing users stuck on "Free" plan:

1. **Option 1**: Have them click "Refresh Status" button
2. **Option 2**: Run this for each affected user:
   ```typescript
   // In your backend console or migration script
   await paymentsService.syncSubscription(userId);
   ```

## 📊 Monitoring

After deployment, monitor:

1. Railway logs for webhook events
2. Stripe Dashboard for successful webhooks
3. User feedback on plan updates
4. Error rates in Sentry/logging service

## 🎉 Summary

All fixes are complete! Your subscription system now:

- ✅ Stores subscriptions reliably via webhooks
- ✅ Has manual sync fallback if webhook fails
- ✅ Uses dynamic pricing from environment variables
- ✅ Works correctly in production for Google OAuth
- ✅ Provides better debugging tools
- ✅ Has comprehensive error handling and logging
