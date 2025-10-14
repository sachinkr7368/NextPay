# 🚀 Deploy NextPay - Step by Step Guide

## ✅ Repository Status
**Your complete NextPay application is now on GitHub:**
### 🔗 https://github.com/sachinkr7368/NextPay

---

## 📦 What's Included

- ✅ **Frontend** (`apps/web`): Next.js + TypeScript + Tailwind + Shadcn UI
- ✅ **Backend** (`apps/api`): NestJS + TypeScript + PostgreSQL
- ✅ **Docker** configs for local development
- ✅ **CI/CD** pipelines (GitHub Actions)
- ✅ **Complete documentation**

---

## 🎯 Deployment Steps

### STEP 1: Deploy Frontend to Vercel (5 minutes)

#### Option A: Using Vercel Dashboard (Recommended)

1. **Go to** [https://vercel.com/new](https://vercel.com/new)

2. **Import Git Repository**:
   - Click "Import Git Repository"
   - Select your GitHub account
   - Choose: `sachinkr7368/NextPay`

3. **Configure Project**:
   - **Project Name**: `nextpay-frontend` (or any name you prefer)
   - **Framework Preset**: Next.js
   - **Root Directory**: `apps/web` ⚠️ IMPORTANT!
   - **Build Command**: Leave default (`next build`)
   - **Output Directory**: Leave default

4. **Add Environment Variables**:
   Click "Environment Variables" and add:
   
   ```env
   NEXT_PUBLIC_API_URL=https://YOUR-RAILWAY-URL.railway.app
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_id.apps.googleusercontent.com
   ```
   
   **Note**: You'll update `NEXT_PUBLIC_API_URL` after deploying the backend

5. **Click "Deploy"** and wait 2-3 minutes

6. **Copy your frontend URL**: 
   - Example: `https://nextpay-frontend.vercel.app`

#### Option B: Using Vercel CLI

```bash
cd /Users/sachin/Desktop/NextPay/apps/web

# Deploy
vercel deploy --prod

# Follow the prompts and set root directory to apps/web
```

---

### STEP 2: Deploy Backend to Railway (10 minutes)

#### 2.1 Create Railway Account

1. **Go to** [https://railway.app](https://railway.app)
2. **Sign in with GitHub**
3. Verify your account

#### 2.2 Deploy from GitHub

1. **Click "New Project"**

2. **Select "Deploy from GitHub repo"**

3. **Choose repository**: `sachinkr7368/NextPay`

4. **Railway will start deploying** - STOP IT! We need to configure first

#### 2.3 Configure Service

1. **Go to Settings** → **Service**

2. **Set Root Directory**: `apps/api` ⚠️ CRITICAL!

3. **Builder**: Should auto-detect Dockerfile

4. **Save Changes**

#### 2.4 Add PostgreSQL Database

1. **Click "+ New"** in your project

2. **Select "Database"** → **"Add PostgreSQL"**

3. **Railway creates the database automatically**

#### 2.5 Add Environment Variables

Click on your **API service** → **Variables** tab

Add these variables:

```env
# Database (auto-linked)
DATABASE_URL=${{Postgres.DATABASE_URL}}

# JWT Secret (generate a random 32+ character string)
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long-please

# Google OAuth (from Google Cloud Console)
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-your-client-secret
GOOGLE_CALLBACK_URL=${{RAILWAY_PUBLIC_DOMAIN}}/api/auth/google/callback

# Stripe (from Stripe Dashboard)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_placeholder_will_update_after_webhook_setup

# CORS (use your Vercel frontend URL)
FRONTEND_URL=https://nextpay-frontend.vercel.app

# Server Config
PORT=8080
NODE_ENV=production
```

**Note**: Railway provides `RAILWAY_PUBLIC_DOMAIN` variable automatically

#### 2.6 Generate Domain

1. **Go to Settings** → **Networking**

2. **Click "Generate Domain"**

3. **Copy the URL**: Example: `https://nextpay-production.railway.app`

4. **Save this URL** - you'll need it for Stripe and Google OAuth!

#### 2.7 Deploy

Click **"Deploy"** and wait 3-5 minutes for build to complete

---

### STEP 3: Update Frontend with Backend URL

1. **Go back to Vercel** → Your Project → **Settings** → **Environment Variables**

2. **Update** `NEXT_PUBLIC_API_URL`:
   ```
   NEXT_PUBLIC_API_URL=https://nextpay-production.railway.app
   ```
   (Use your actual Railway URL)

3. **Redeploy**:
   - Go to Deployments
   - Click "..." on latest deployment
   - Click "Redeploy"

---

### STEP 4: Configure Stripe Webhook

1. **Go to** [Stripe Dashboard → Webhooks](https://dashboard.stripe.com/webhooks)

2. **Click "Add endpoint"**

3. **Endpoint URL**:
   ```
   https://nextpay-production.railway.app/api/payments/webhook
   ```
   (Replace with your Railway URL)

4. **Select events**:
   - ✅ `checkout.session.completed`
   - ✅ `customer.subscription.created`
   - ✅ `customer.subscription.updated`
   - ✅ `customer.subscription.deleted`
   - ✅ `invoice.payment_succeeded`
   - ✅ `invoice.payment_failed`

5. **Click "Add endpoint"**

6. **Copy the Signing Secret** (starts with `whsec_...`)

7. **Update Railway Environment Variable**:
   - Go to Railway → Your API service → Variables
   - Update `STRIPE_WEBHOOK_SECRET` with the webhook secret
   - Service will auto-redeploy

---

### STEP 5: Configure Google OAuth

1. **Go to** [Google Cloud Console → Credentials](https://console.cloud.google.com/apis/credentials)

2. **Click on your OAuth 2.0 Client ID**

3. **Add Authorized Redirect URIs**:
   ```
   https://nextpay-production.railway.app/api/auth/google/callback
   ```
   (Replace with your Railway URL)

4. **Also add for local development**:
   ```
   http://localhost:3001/api/auth/google/callback
   ```

5. **Click "Save"**

---

## ✨ Your Deployment URLs

After completing all steps:

| Service | URL | Purpose |
|---------|-----|---------|
| **Frontend** | `https://nextpay-frontend.vercel.app` | Your SaaS app |
| **Backend API** | `https://nextpay-production.railway.app` | REST API |
| **Stripe Webhook** | `https://nextpay-production.railway.app/api/payments/webhook` | Payment events |
| **Google OAuth Callback** | `https://nextpay-production.railway.app/api/auth/google/callback` | Authentication |
| **GitHub Repo** | `https://github.com/sachinkr7368/NextPay` | Source code |

---

## 🧪 Test Your Deployment

### 1. Test Frontend
Visit your Vercel URL: `https://nextpay-frontend.vercel.app`

### 2. Test Backend Health
Visit: `https://nextpay-production.railway.app/api/health`

Should return: `{"status":"ok","timestamp":"..."}`

### 3. Test Google OAuth
1. Go to: `https://nextpay-frontend.vercel.app/auth/signin`
2. Click "Sign in with Google"
3. Complete OAuth flow
4. Should redirect back to dashboard

### 4. Test Stripe Checkout
1. Go to Pricing page
2. Click "Subscribe" on Pro plan
3. Use test card: `4242 4242 4242 4242`
4. Complete checkout
5. Check Stripe Dashboard for webhook events

---

## 🔧 Stripe Test Cards

| Card Number | Type | Result |
|-------------|------|--------|
| `4242 4242 4242 4242` | Visa | ✅ Success |
| `4000 0025 0000 3155` | Visa | 🔒 Requires 3D Secure |
| `4000 0000 0000 9995` | Visa | ❌ Declined |

**Expiry**: Any future date (e.g., 12/25)  
**CVC**: Any 3 digits (e.g., 123)  
**ZIP**: Any 5 digits (e.g., 12345)

---

## 📊 Monitor Your Deployments

### Vercel
- **Dashboard**: [vercel.com/dashboard](https://vercel.com/dashboard)
- **Logs**: Click your project → Deployments → View Logs
- **Analytics**: Click your project → Analytics

### Railway
- **Dashboard**: [railway.app/dashboard](https://railway.app/dashboard)
- **Logs**: Click your service → View Logs
- **Metrics**: Click your service → Metrics tab

---

## 🐛 Troubleshooting

### Issue: Frontend can't connect to backend
**Solution**: 
- Check `NEXT_PUBLIC_API_URL` in Vercel matches Railway URL exactly
- Ensure Railway backend is deployed and running
- Check Railway logs for errors

### Issue: Stripe webhook not working
**Solution**:
- Verify webhook URL in Stripe Dashboard
- Check `STRIPE_WEBHOOK_SECRET` in Railway
- Look for webhook events in Stripe Dashboard
- Check Railway logs for webhook errors

### Issue: Google OAuth fails
**Solution**:
- Verify redirect URI in Google Console matches Railway URL
- Check `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in Railway
- Ensure OAuth consent screen is configured

### Issue: Database connection error
**Solution**:
- Check PostgreSQL service is running in Railway
- Verify `DATABASE_URL` is set to `${{Postgres.DATABASE_URL}}`
- Check Railway logs for database errors

### Issue: Build fails on Railway
**Solution**:
- Ensure Root Directory is set to `apps/api`
- Check Dockerfile exists in `apps/api/`
- Verify all dependencies are in `package.json`

---

## 📝 Quick Checklist

- [ ] ✅ Pushed complete repo to GitHub
- [ ] ✅ Deployed frontend to Vercel
- [ ] ✅ Set Vercel root directory to `apps/web`
- [ ] ✅ Deployed backend to Railway
- [ ] ✅ Set Railway root directory to `apps/api`
- [ ] ✅ Added PostgreSQL to Railway
- [ ] ✅ Configured all environment variables
- [ ] ✅ Generated Railway domain
- [ ] ✅ Updated Vercel with backend URL
- [ ] ✅ Configured Stripe webhook
- [ ] ✅ Configured Google OAuth redirect URI
- [ ] ✅ Tested all features

---

## 🎉 You're Done!

Your complete SaaS application is now deployed and live!

**Frontend**: Production-ready Next.js app on Vercel  
**Backend**: Scalable NestJS API on Railway  
**Database**: Managed PostgreSQL on Railway  
**Payments**: Stripe integration with webhooks  
**Auth**: Google OAuth + JWT authentication  

---

## 📚 Additional Resources

- [RAILWAY_DEPLOYMENT.md](./RAILWAY_DEPLOYMENT.md) - Detailed Railway guide
- [SETUP_GUIDE.md](./SETUP_GUIDE.md) - Stripe & Google OAuth setup
- [DEPLOYMENT_URLS.md](./DEPLOYMENT_URLS.md) - URL configuration
- [QUICK_START.md](./QUICK_START.md) - Quick reference
- [README.md](./README.md) - Main documentation

---

**Need help?** Check the documentation files above or open an issue on GitHub!

