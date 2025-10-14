# ⚡ NextPay - Quick Deployment Checklist

## 📦 Repository
- ✅ **GitHub URL**: https://github.com/sachinkr7368/NextPay
- ✅ **Contains**: Complete frontend + backend monorepo

---

## 🚀 Deployment Steps

### 1️⃣ Deploy Backend to Railway (Do This First!)

**URL**: https://railway.app

- [ ] Sign in with GitHub
- [ ] Click "New Project"
- [ ] Select "Deploy from GitHub repo"
- [ ] Choose: `sachinkr7368/NextPay`
- [ ] Go to Settings → Set **Root Directory**: `apps/api`
- [ ] Click "+ New" → Add PostgreSQL database
- [ ] Go to Variables tab → Add these:

```env
DATABASE_URL=${{Postgres.DATABASE_URL}}
JWT_SECRET=generate-a-32-character-random-string-here
GOOGLE_CLIENT_ID=your-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-your-secret
GOOGLE_CALLBACK_URL=${{RAILWAY_PUBLIC_DOMAIN}}/api/auth/google/callback
STRIPE_SECRET_KEY=sk_test_your_key
STRIPE_WEBHOOK_SECRET=whsec_temporary_will_update_later
FRONTEND_URL=https://your-vercel-url.vercel.app
PORT=8080
NODE_ENV=production
```

- [ ] Settings → Networking → Click "Generate Domain"
- [ ] **COPY YOUR RAILWAY URL** → Example: `https://nextpay-production.railway.app`
- [ ] Wait for deployment to complete (3-5 min)

---

### 2️⃣ Deploy Frontend to Vercel

**URL**: https://vercel.com/new

- [ ] Click "Import Git Repository"
- [ ] Select: `sachinkr7368/NextPay`
- [ ] **IMPORTANT**: Set **Root Directory** to `apps/web`
- [ ] Add Environment Variables:

```env
NEXT_PUBLIC_API_URL=https://your-railway-url.railway.app
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-id.apps.googleusercontent.com
```

- [ ] Click "Deploy"
- [ ] **COPY YOUR VERCEL URL** → Example: `https://nextpay-frontend.vercel.app`

---

### 3️⃣ Update Railway with Frontend URL

- [ ] Go back to Railway → Your API service → Variables
- [ ] Update `FRONTEND_URL` with your Vercel URL
- [ ] Service will auto-redeploy

---

### 4️⃣ Configure Stripe Webhook

**URL**: https://dashboard.stripe.com/webhooks

- [ ] Click "Add endpoint"
- [ ] Endpoint URL: `https://your-railway-url.railway.app/api/payments/webhook`
- [ ] Select events:
  - [x] `checkout.session.completed`
  - [x] `customer.subscription.updated`
  - [x] `customer.subscription.deleted`
  - [x] `invoice.payment_succeeded`
- [ ] Click "Add endpoint"
- [ ] **COPY WEBHOOK SECRET** (starts with `whsec_...`)
- [ ] Go to Railway → Variables → Update `STRIPE_WEBHOOK_SECRET`

---

### 5️⃣ Configure Google OAuth

**URL**: https://console.cloud.google.com/apis/credentials

- [ ] Click on your OAuth 2.0 Client ID
- [ ] Add Authorized Redirect URI:
  - `https://your-railway-url.railway.app/api/auth/google/callback`
  - `http://localhost:3001/api/auth/google/callback` (for local dev)
- [ ] Click "Save"

---

## ✅ Final Checks

- [ ] Visit your frontend URL - should load
- [ ] Visit `https://your-railway-url.railway.app/api/health` - should return `{"status":"ok"}`
- [ ] Test Google OAuth login
- [ ] Test Stripe checkout with card: `4242 4242 4242 4242`
- [ ] Check Stripe Dashboard for webhook events

---

## 📝 Your URLs

| Service | Your URL |
|---------|----------|
| **Frontend** | `https://__________________.vercel.app` |
| **Backend** | `https://__________________.railway.app` |
| **Stripe Webhook** | `https://__________________.railway.app/api/payments/webhook` |
| **Google OAuth** | `https://__________________.railway.app/api/auth/google/callback` |

---

## 🔑 Credentials Needed

### Stripe (from dashboard.stripe.com)
- [ ] Secret Key (sk_test_...)
- [ ] Publishable Key (pk_test_...)
- [ ] Webhook Secret (whsec_...)

### Google OAuth (from console.cloud.google.com)
- [ ] Client ID (...apps.googleusercontent.com)
- [ ] Client Secret (GOCSPX-...)

---

## 🧪 Stripe Test Cards

- **Success**: `4242 4242 4242 4242`
- **3D Secure**: `4000 0025 0000 3155`
- **Declined**: `4000 0000 0000 9995`

**Expiry**: Any future date | **CVC**: Any 3 digits | **ZIP**: Any 5 digits

---

## 📚 Full Documentation

For detailed step-by-step instructions, see: **`DEPLOY_NOW.md`**

---

**Estimated Time**: 15-20 minutes  
**Difficulty**: Beginner-friendly  
**Cost**: Free tier available

🎉 **You've got this!**

