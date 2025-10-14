# 🔧 Deployment Fixes Applied

## ✅ Railway Backend Fix

**Problem**: `Dockerfile 'Dockerfile' does not exist`

**Solution Applied**:

1. ✅ Created `railway.json` in root directory
2. ✅ Updated `railway.toml` with correct paths
3. ✅ Configured Dockerfile path: `apps/api/Dockerfile`

**Next Steps for Railway**:

1. **Go to your Railway project**
2. **Go to Settings → Service**
3. **Set Root Directory to**: `apps/api` ⚠️ **CRITICAL!**
4. **Save changes**
5. **Click "Redeploy"** or wait for auto-deploy

The deployment should now work because Railway will:

- Look in `apps/api/` directory
- Find the Dockerfile there
- Build the NestJS application correctly

---

## ✅ Vercel Frontend Fix

**Problem**: Blank Next.js app showing

**Solution Applied**:

1. ✅ Created `vercel.json` configuration
2. ✅ Added `--legacy-peer-deps` flag for npm install
3. ✅ Configured proper build settings

**Next Steps for Vercel**:

1. **Go to your Vercel project**
2. **Go to Settings → General**
3. **Verify Root Directory is set to**: `apps/web`
4. **Go to Settings → Environment Variables**
5. **Add these variables**:

```env
NEXT_PUBLIC_API_URL=https://your-railway-url.railway.app
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com
```

6. **Redeploy** by going to Deployments → Click "..." → Redeploy

---

## 🚀 Quick Fix Steps

### For Railway (Backend):

1. **Open Railway Dashboard** → Your NextPay project
2. **Click on your service** → **Settings** tab
3. **Find "Root Directory"** → Set to: `apps/api`
4. **Save** → Wait for auto-redeploy
5. **Check deployment logs** - should now succeed

### For Vercel (Frontend):

1. **Open Vercel Dashboard** → Your project
2. **Settings** → **General** → Verify Root Directory: `apps/web`
3. **Settings** → **Environment Variables** → Add the variables above
4. **Deployments** → **Redeploy** latest deployment
5. **Visit your site** - should now show the actual app

---

## 📋 Environment Variables Needed

### Railway (Backend) Variables:

```env
DATABASE_URL=${{Postgres.DATABASE_URL}}
JWT_SECRET=generate-a-32-character-random-string-here
GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX_your_secret
GOOGLE_CALLBACK_URL=${{RAILWAY_PUBLIC_DOMAIN}}/api/auth/google/callback
STRIPE_SECRET_KEY=sk_test_your_stripe_secret
STRIPE_WEBHOOK_SECRET=whsec_placeholder_update_after_webhook
FRONTEND_URL=https://your-vercel-url.vercel.app
PORT=8080
NODE_ENV=production
```

### Vercel (Frontend) Variables:

```env
NEXT_PUBLIC_API_URL=https://your-railway-url.railway.app
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com
```

---

## 🔍 Troubleshooting

### Railway Still Failing?

1. **Check the Root Directory setting** - must be `apps/api`
2. **Look at deployment logs** for specific errors
3. **Ensure PostgreSQL database is added** to the project
4. **Check environment variables** are set correctly

### Vercel Still Blank?

1. **Check Root Directory** is set to `apps/web`
2. **Verify environment variables** are added
3. **Check build logs** for errors
4. **Try redeploying** after adding env vars

### Both Deployments Working?

Once both are working:

1. **Copy Railway URL** (e.g., `https://nextpay-production.railway.app`)
2. **Update Vercel** `NEXT_PUBLIC_API_URL` with Railway URL
3. **Configure Stripe webhook**: `https://your-railway-url/api/payments/webhook`
4. **Configure Google OAuth**: `https://your-railway-url/api/auth/google/callback`

---

## 📞 Support

If you're still having issues:

1. **Check the logs** in both Railway and Vercel dashboards
2. **Verify all settings** match the instructions above
3. **Try redeploying** after making changes
4. **Check the GitHub repository** has the latest changes

The fixes have been applied and pushed to GitHub. Your deployments should work now! 🎉
