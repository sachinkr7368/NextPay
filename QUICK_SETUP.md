# ⚡ Quick Setup - Copy & Paste Guide

## 🎯 What You Need

### From Stripe Dashboard (https://dashboard.stripe.com)

1. **API Keys** (Dashboard → Developers → API keys)

   ```
   Publishable key: pk_test_________________
   Secret key:      sk_test_________________
   ```

2. **Create Pro Plan** (Dashboard → Products → Add product)

   ```
   Name: Pro Plan
   Price: $15/month
   → Save → Copy Price ID: price_________________
   ```

3. **Create Enterprise Plan** (Dashboard → Products → Add product)

   ```
   Name: Enterprise Plan
   Price: $25/month
   → Save → Copy Price ID: price_________________
   ```

4. **Webhook** (Dashboard → Developers → Webhooks → Add endpoint)
   ```
   URL: http://localhost:3001/api/payments/webhook
   Events: checkout.session.completed,
           customer.subscription.updated,
           customer.subscription.deleted
   → Save → Copy Signing secret: whsec_________________
   ```

---

### From Google Cloud Console (https://console.cloud.google.com)

1. **Create Project** → "NextPay"

2. **OAuth Consent Screen**

   ```
   App name: NextPay
   Email: your-email@example.com
   ```

3. **Create Credentials** (APIs & Services → Credentials → Create → OAuth client ID)

   ```
   Type: Web application
   Name: NextPay Web Client

   Authorized origins:
   - http://localhost:3000
   - http://localhost:3001

   Redirect URIs:
   - http://localhost:3001/api/auth/google/callback

   → Create → Copy:
   Client ID:     _________________.apps.googleusercontent.com
   Client Secret: GOCSPX-_________________
   ```

---

## 📝 Fill in Your .env Files

### Frontend: `apps/web/.env`

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_test_________________
NEXT_PUBLIC_GOOGLE_CLIENT_ID=_________________.apps.googleusercontent.com
```

### Backend: `apps/api/.env`

```env
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:3000

DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=nextpay

JWT_SECRET=change-this-to-a-long-random-string
JWT_EXPIRES_IN=7d

GOOGLE_CLIENT_ID=_________________.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-_________________
GOOGLE_CALLBACK_URL=http://localhost:3001/api/auth/google/callback

STRIPE_SECRET_KEY=sk_test_________________
STRIPE_WEBHOOK_SECRET=whsec_________________
STRIPE_PRICE_PRO=price_________________
STRIPE_PRICE_ENTERPRISE=price_________________
```

---

## 🚀 Start the App

```bash
# 1. Start PostgreSQL (if not running)
docker run --name nextpay-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=nextpay \
  -p 5432:5432 -d postgres:15-alpine

# 2. Start dev servers
npm run dev

# 3. Open browser
# Frontend: http://localhost:3000
# API Docs: http://localhost:3001/api/docs
```

---

## 🧪 Test Cards

**Successful Payment:**

```
4242 4242 4242 4242
12/25
123
```

**Declined:**

```
4000 0000 0000 0002
12/25
123
```

---

## ✅ Checklist

- [ ] Copied Stripe publishable key → frontend .env
- [ ] Copied Stripe secret key → backend .env
- [ ] Created Pro plan → copied price ID → backend .env
- [ ] Created Enterprise plan → copied price ID → backend .env
- [ ] Created webhook → copied signing secret → backend .env
- [ ] Created Google OAuth client → copied client ID → both .env files
- [ ] Copied Google client secret → backend .env
- [ ] PostgreSQL is running
- [ ] Started `npm run dev`
- [ ] Can access http://localhost:3000

---

## 🆘 Need Help?

See [SETUP_GUIDE.md](./SETUP_GUIDE.md) for detailed instructions with screenshots.
