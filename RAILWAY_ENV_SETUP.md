# Railway Environment Variables Setup

## 🚨 CRITICAL: Railway 502 Error Fix

The 502 error on Railway is likely due to missing or incorrect environment variables. Here's how to fix it:

## 📋 Required Railway Environment Variables

Go to Railway Dashboard → NextPay Service → Variables tab and add these:

### Database Configuration

```
DATABASE_URL=postgresql://postgres:password@trolley.proxy.rlwy.net:55994/railway
DB_HOST=trolley.proxy.rlwy.net
DB_PORT=55994
DB_USERNAME=postgres
DB_PASSWORD=[Get from Railway PostgreSQL service Variables tab]
DB_NAME=railway
```

### Application Configuration

```
NODE_ENV=production
PORT=3001
FRONTEND_URL=https://web-sachinkr7368s-projects.vercel.app
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
```

### Google OAuth Configuration

```
GOOGLE_CLIENT_ID=1087763012294-vpgp9edg8k1quh8ijbvahc6be9dm47mu.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
GOOGLE_CALLBACK_URL=https://nextpay-production.up.railway.app/api/auth/google/callback
```

### Stripe Configuration

```
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
STRIPE_PRICE_FREE=price_1SI5BJLV9XDn5rbHFxytc0RO
STRIPE_PRICE_PRO=price_1SI58JLV9XDn5rbH7mHIsqWj
STRIPE_PRICE_ENTERPRISE=price_1SI5BRLV9XDn5rbH3yQsOsLs
```

## 🔧 Frontend Environment Variables (Vercel)

Go to Vercel Dashboard → Project Settings → Environment Variables and add:

```
NEXT_PUBLIC_API_URL=https://nextpay-production.up.railway.app/api
```

## 🚀 Steps to Fix

1. **Set Railway Environment Variables** (above)
2. **Set Vercel Environment Variables** (above)
3. **Redeploy both services**
4. **Test the connection**

## 🔍 Debugging Railway 502 Error

If still getting 502:

1. Check Railway logs for specific errors
2. Verify all environment variables are set
3. Check if database connection is working
4. Verify the application starts without errors

## 📝 Important Notes

- Railway URL: `https://nextpay-production.up.railway.app`
- Vercel URL: `https://web-sachinkr7368s-projects.vercel.app`
- Make sure Google OAuth callback URL matches Railway URL
- Database URL should use Railway's provided DATABASE_URL
