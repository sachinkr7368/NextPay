# 🚀 NextPay Deployment URLs & Configuration Guide

## 📋 Current Deployment Status

### ✅ Frontend (Vercel)

**Production URL**: `https://web-sachinkr7368s-projects.vercel.app`

**Alternative URLs**:

- `https://web-git-main-sachinkr7368s-projects.vercel.app`
- `https://web-dun-seven-62.vercel.app`

### ⏳ Backend (Railway) - To Be Deployed

**Follow the Railway deployment guide** in `RAILWAY_DEPLOYMENT.md`

After deployment, you'll get a URL like:

- `https://nextpay-production.railway.app` (example)

---

## 🔧 Configuration URLs Needed

### 1. **Stripe Webhook Configuration**

Once your Railway backend is deployed:

1. **Go to**: [Stripe Dashboard → Developers → Webhooks](https://dashboard.stripe.com/webhooks)

2. **Click**: "Add endpoint"

3. **Endpoint URL**:

   ```
   https://YOUR-RAILWAY-URL.railway.app/api/payments/webhook
   ```

   _(Replace `YOUR-RAILWAY-URL` with your actual Railway domain)_

4. **Select events to listen to**:
   - ✅ `checkout.session.completed`
   - ✅ `customer.subscription.created`
   - ✅ `customer.subscription.updated`
   - ✅ `customer.subscription.deleted`
   - ✅ `invoice.payment_succeeded`
   - ✅ `invoice.payment_failed`

5. **Click**: "Add endpoint"

6. **Copy the Webhook Secret** (starts with `whsec_...`)
   - Add this to Railway environment variables as `STRIPE_WEBHOOK_SECRET`

---

### 2. **Google OAuth Redirect URI Configuration**

Once your Railway backend is deployed:

1. **Go to**: [Google Cloud Console → Credentials](https://console.cloud.google.com/apis/credentials)

2. **Click on your OAuth 2.0 Client ID**

3. **Add Authorized Redirect URIs**:

   ```
   https://YOUR-RAILWAY-URL.railway.app/api/auth/google/callback
   ```

   _(Replace `YOUR-RAILWAY-URL` with your actual Railway domain)_

4. **Also add** (for local development):

   ```
   http://localhost:3001/api/auth/google/callback
   ```

5. **Click**: "Save"

---

## 🌐 Environment Variables Setup

### Frontend (Vercel)

Go to: [Vercel Dashboard → Your Project → Settings → Environment Variables](https://vercel.com/sachinkr7368s-projects/web/settings/environment-variables)

Add these variables:

```env
# API Configuration
NEXT_PUBLIC_API_URL=https://YOUR-RAILWAY-URL.railway.app

# Stripe Public Key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key

# Google OAuth (for frontend)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
```

**After adding, redeploy**:

```bash
cd /Users/sachin/Desktop/NextPay/apps/web
npx vercel --prod
```

---

### Backend (Railway)

Go to: Railway Dashboard → Your Backend Service → Variables

Add these variables:

```env
# Database (auto-configured when you add PostgreSQL)
DATABASE_URL=${{Postgres.DATABASE_URL}}

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production-min-32-chars

# Google OAuth
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-your-client-secret
GOOGLE_CALLBACK_URL=https://YOUR-RAILWAY-URL.railway.app/api/auth/google/callback

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_from_stripe

# CORS Configuration
FRONTEND_URL=https://web-sachinkr7368s-projects.vercel.app

# Server Configuration
PORT=8080
NODE_ENV=production
```

---

## 📝 Step-by-Step Deployment Checklist

### Step 1: Deploy Backend to Railway ✅

1. [ ] Go to [Railway.app](https://railway.app)
2. [ ] Create new project from GitHub repo: `sachinkr7368/NextPay`
3. [ ] Set Root Directory to: `apps/api`
4. [ ] Add PostgreSQL database
5. [ ] Configure environment variables (see above)
6. [ ] Generate domain and note the URL
7. [ ] Wait for deployment to complete

### Step 2: Configure Stripe Webhook ✅

1. [ ] Copy your Railway backend URL
2. [ ] Go to [Stripe Webhooks](https://dashboard.stripe.com/webhooks)
3. [ ] Add endpoint: `https://YOUR-RAILWAY-URL/api/payments/webhook`
4. [ ] Select required events (listed above)
5. [ ] Copy webhook secret (`whsec_...`)
6. [ ] Add to Railway env vars as `STRIPE_WEBHOOK_SECRET`
7. [ ] Redeploy backend service

### Step 3: Configure Google OAuth ✅

1. [ ] Copy your Railway backend URL
2. [ ] Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
3. [ ] Edit OAuth 2.0 Client
4. [ ] Add redirect URI: `https://YOUR-RAILWAY-URL/api/auth/google/callback`
5. [ ] Save changes

### Step 4: Update Frontend Environment Variables ✅

1. [ ] Go to Vercel project settings
2. [ ] Add `NEXT_PUBLIC_API_URL` with Railway URL
3. [ ] Add Stripe publishable key
4. [ ] Add Google Client ID
5. [ ] Redeploy frontend

### Step 5: Test the Integration ✅

1. [ ] Visit your frontend: `https://web-sachinkr7368s-projects.vercel.app`
2. [ ] Test Google OAuth login
3. [ ] Test Stripe checkout flow
4. [ ] Verify webhook is receiving events
5. [ ] Check Railway logs for any errors

---

## 🧪 Testing URLs

### Test Stripe Integration

- Webhook test: [Stripe CLI](https://stripe.com/docs/stripe-cli) or Dashboard
- Use test cards: [Stripe Test Cards](https://stripe.com/docs/testing#cards)

### Test Google OAuth

- Visit: `https://web-sachinkr7368s-projects.vercel.app/auth/signin`
- Click "Sign in with Google"
- Should redirect through Google and back to your app

### API Health Check

- Visit: `https://YOUR-RAILWAY-URL.railway.app/api/health`
- Should return: `{"status": "ok"}`

---

## 🔍 Quick Reference

### Your Current URLs:

| Service                   | URL                                                             |
| ------------------------- | --------------------------------------------------------------- |
| **Frontend**              | `https://web-sachinkr7368s-projects.vercel.app`                 |
| **Backend**               | `https://YOUR-RAILWAY-URL.railway.app` (after deployment)       |
| **Stripe Webhook**        | `https://YOUR-RAILWAY-URL.railway.app/api/payments/webhook`     |
| **Google OAuth Callback** | `https://YOUR-RAILWAY-URL.railway.app/api/auth/google/callback` |
| **GitHub Repo**           | `https://github.com/sachinkr7368/NextPay`                       |

---

## 📞 Support Links

- [Vercel Documentation](https://vercel.com/docs)
- [Railway Documentation](https://docs.railway.app)
- [Stripe Webhooks Guide](https://stripe.com/docs/webhooks)
- [Google OAuth Setup](https://developers.google.com/identity/protocols/oauth2)

---

## 🐛 Common Issues

### Issue: CORS Errors

**Solution**: Ensure `FRONTEND_URL` in Railway matches your Vercel URL exactly

### Issue: Stripe Webhook Fails

**Solution**: Check webhook secret is correctly set in Railway env vars

### Issue: Google OAuth Redirect Error

**Solution**: Verify redirect URI in Google Console matches Railway URL exactly

### Issue: Database Connection Failed

**Solution**: Ensure `DATABASE_URL` uses `${{Postgres.DATABASE_URL}}` syntax in Railway

---

## 🎉 Next Steps After Deployment

1. ✅ Test all features end-to-end
2. ✅ Set up custom domains (optional)
3. ✅ Configure production environment variables
4. ✅ Enable monitoring and logging
5. ✅ Set up automated backups for database
6. ✅ Configure CI/CD for automatic deployments

---

**Need Help?** Check the detailed guides:

- `RAILWAY_DEPLOYMENT.md` - Backend deployment guide
- `SETUP_GUIDE.md` - Stripe & Google OAuth setup
- `DEPLOYMENT.md` - General deployment guide
