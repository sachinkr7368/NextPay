# 🚀 NextPay - Quick Start Deployment Guide

## ✅ What's Already Done

### Frontend Deployed ✅
**Your live frontend is at**: 
### **`https://web-sachinkr7368s-projects.vercel.app`**

### Backend Ready to Deploy ✅
All configuration files are ready. Follow the simple steps below to deploy.

---

## 📋 Deploy Backend in 5 Minutes

### Step 1: Go to Railway
1. Visit: **[Railway.app](https://railway.app)**
2. Sign in with GitHub

### Step 2: Create New Project
1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Choose: **`sachinkr7368/NextPay`**

### Step 3: Configure Root Directory
1. After project creation, go to **Settings**
2. Find **"Root Directory"**
3. Set it to: **`apps/api`**
4. Save

### Step 4: Add PostgreSQL Database
1. In your project, click **"+ New"**
2. Select **"Database"** → **"Add PostgreSQL"**
3. Done! Railway auto-configures the connection

### Step 5: Add Environment Variables
Click on your **backend service** → **Variables** tab

Add these variables:

```env
DATABASE_URL=${{Postgres.DATABASE_URL}}
JWT_SECRET=super-secret-jwt-key-min-32-characters-long
GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=YOUR_GOOGLE_CLIENT_SECRET
STRIPE_SECRET_KEY=sk_test_YOUR_STRIPE_SECRET_KEY
FRONTEND_URL=https://web-sachinkr7368s-projects.vercel.app
PORT=8080
```

### Step 6: Generate Domain
1. Go to **Settings** → **Networking**
2. Click **"Generate Domain"**
3. **Copy the URL** - you'll need it!

Example: `https://nextpay-production.railway.app`

### Step 7: Deploy
Click **"Deploy"** and wait 2-3 minutes ⏳

---

## 🔧 Configure External Services

### A. Stripe Webhook Setup

1. **Go to**: [Stripe Dashboard → Webhooks](https://dashboard.stripe.com/webhooks)

2. **Click**: "Add endpoint"

3. **Enter URL**:
   ```
   https://YOUR-RAILWAY-URL.railway.app/api/payments/webhook
   ```
   *(Replace with your actual Railway URL)*

4. **Select Events**:
   - ✅ `checkout.session.completed`
   - ✅ `customer.subscription.updated`
   - ✅ `customer.subscription.deleted`
   - ✅ `invoice.payment_succeeded`

5. **Save** and copy the **Webhook Secret** (`whsec_...`)

6. **Add to Railway**:
   - Go back to Railway → Variables
   - Add: `STRIPE_WEBHOOK_SECRET=whsec_your_secret`
   - The service will auto-redeploy

---

### B. Google OAuth Redirect URI

1. **Go to**: [Google Cloud Console → Credentials](https://console.cloud.google.com/apis/credentials)

2. **Click** on your OAuth 2.0 Client ID

3. **Add Authorized Redirect URI**:
   ```
   https://YOUR-RAILWAY-URL.railway.app/api/auth/google/callback
   ```
   *(Replace with your actual Railway URL)*

4. **Save**

---

### C. Update Frontend Environment Variables

1. **Go to**: [Vercel → Your Project → Settings → Environment Variables](https://vercel.com/sachinkr7368s-projects/web/settings/environment-variables)

2. **Add these**:
   ```env
   NEXT_PUBLIC_API_URL=https://YOUR-RAILWAY-URL.railway.app
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_PUBLISHABLE_KEY
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com
   ```

3. **Redeploy Frontend**:
   ```bash
   cd /Users/sachin/Desktop/NextPay/apps/web
   npx vercel --prod
   ```

---

## 🎯 Your URLs Summary

After completing the above steps, you'll have:

| Service | URL |
|---------|-----|
| **Frontend** | `https://web-sachinkr7368s-projects.vercel.app` |
| **Backend API** | `https://YOUR-RAILWAY-URL.railway.app` |
| **Stripe Webhook** | `https://YOUR-RAILWAY-URL.railway.app/api/payments/webhook` |
| **Google OAuth Callback** | `https://YOUR-RAILWAY-URL.railway.app/api/auth/google/callback` |

---

## 🧪 Test Your Deployment

### 1. Test Frontend
Visit: `https://web-sachinkr7368s-projects.vercel.app`

### 2. Test Backend Health
Visit: `https://YOUR-RAILWAY-URL.railway.app/api/health`

Should return: `{"status":"ok"}`

### 3. Test Google OAuth
1. Go to: `https://web-sachinkr7368s-projects.vercel.app/auth/signin`
2. Click "Sign in with Google"
3. Should authenticate and redirect back

### 4. Test Stripe Checkout
1. Go to Pricing page
2. Click "Subscribe" on a plan
3. Use test card: `4242 4242 4242 4242`
4. Check Stripe Dashboard for webhook events

---

## 🎉 What You Get

### ✅ Complete SaaS Application
- 🔐 Authentication (JWT + Google OAuth)
- 💳 Stripe Subscriptions (Free, Pro, Enterprise)
- 👤 User Profile Management
- 📊 Admin Dashboard
- 🎨 Modern UI (Tailwind + Shadcn)
- 📱 Mobile Responsive
- 🔒 Type-safe (TypeScript)
- 🐳 Docker Ready
- 🚀 Production Deployed

### 📚 Documentation Included
- `README.md` - Main documentation
- `DEPLOYMENT_URLS.md` - All URLs and configuration
- `RAILWAY_DEPLOYMENT.md` - Detailed Railway guide
- `SETUP_GUIDE.md` - Stripe & Google OAuth setup
- `QUICK_SETUP.md` - Quick reference checklist
- `ARCHITECTURE.md` - System architecture

---

## 💡 Stripe Test Cards

Use these for testing:

| Card Number | Type | Behavior |
|-------------|------|----------|
| `4242 4242 4242 4242` | Visa | Success |
| `4000 0025 0000 3155` | Visa | 3D Secure |
| `4000 0000 0000 9995` | Visa | Declined |

**Expiry**: Any future date  
**CVC**: Any 3 digits  
**ZIP**: Any 5 digits

[More test cards →](https://stripe.com/docs/testing#cards)

---

## 🐛 Troubleshooting

### "CORS Error" when calling API
- ✅ Check `FRONTEND_URL` in Railway matches Vercel URL exactly
- ✅ Verify CORS config in `apps/api/src/main.ts`

### "Stripe webhook not working"
- ✅ Check webhook secret is added to Railway
- ✅ Verify webhook URL in Stripe Dashboard
- ✅ Check Railway logs for errors

### "Google OAuth redirect error"
- ✅ Verify redirect URI in Google Console matches Railway URL
- ✅ Check Google Client ID and Secret are correct

### "Database connection failed"
- ✅ Ensure PostgreSQL is added to Railway project
- ✅ Check `DATABASE_URL` uses `${{Postgres.DATABASE_URL}}`

---

## 📞 Support & Resources

- **Railway Docs**: [docs.railway.app](https://docs.railway.app)
- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Stripe Docs**: [stripe.com/docs](https://stripe.com/docs)
- **Google OAuth**: [developers.google.com/identity](https://developers.google.com/identity)

---

## 🚀 Next Steps

1. ✅ Deploy backend to Railway (5 min)
2. ✅ Configure Stripe webhook (2 min)
3. ✅ Configure Google OAuth (2 min)
4. ✅ Update Vercel env vars (1 min)
5. ✅ Test everything (5 min)

**Total Time: ~15 minutes** ⏱️

---

**Ready to deploy? Start with Step 1 above!** 🎉

Need detailed instructions? Check `RAILWAY_DEPLOYMENT.md`

