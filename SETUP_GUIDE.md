# Complete Setup Guide for NextPay

This guide will walk you through setting up Stripe payments and Google OAuth authentication.

## 📋 Table of Contents

1. [Stripe Setup](#stripe-setup)
2. [Google OAuth Setup](#google-oauth-setup)
3. [Environment Variables](#environment-variables)
4. [Testing](#testing)

---

## 💳 Stripe Setup

### Step 1: Create a Stripe Account

1. Go to https://stripe.com
2. Click "Start now" or "Sign up"
3. Complete the registration
4. Verify your email

### Step 2: Get Your API Keys

1. Go to https://dashboard.stripe.com/test/apikeys
2. You'll see two keys:
   - **Publishable key** (starts with `pk_test_`)
   - **Secret key** (starts with `sk_test_`)
3. Copy both keys - you'll need them for environment variables

### Step 3: Create Products and Prices

#### Create Pro Plan Product

1. Go to https://dashboard.stripe.com/test/products
2. Click "+ Add product"
3. Fill in the details:
   ```
   Name: Pro Plan
   Description: For growing businesses - 10 users, all features, priority support
   ```
4. Under "Pricing":
   ```
   Price: $29.00 USD
   Billing period: Monthly
   ```
5. Click "Save product"
6. **IMPORTANT:** Copy the **Price ID** (starts with `price_`) - you'll need this!

#### Create Enterprise Plan Product

1. Click "+ Add product" again
2. Fill in the details:
   ```
   Name: Enterprise Plan
   Description: For large organizations - unlimited users, 24/7 support, custom integrations
   ```
3. Under "Pricing":
   ```
   Price: $99.00 USD
   Billing period: Monthly
   ```
4. Click "Save product"
5. **IMPORTANT:** Copy the **Price ID** (starts with `price_`) - you'll need this!

### Step 4: Set Up Webhooks

1. Go to https://dashboard.stripe.com/test/webhooks
2. Click "+ Add endpoint"
3. Enter your endpoint URL:

   ```
   http://localhost:3001/api/payments/webhook
   ```

   (For production, use your actual domain: `https://your-api.railway.app/api/payments/webhook`)

4. Click "Select events" and choose these events:
   - ✅ `checkout.session.completed`
   - ✅ `customer.subscription.updated`
   - ✅ `customer.subscription.deleted`

5. Click "Add endpoint"
6. **IMPORTANT:** Copy the **Webhook signing secret** (starts with `whsec_`) - you'll need this!

### Step 5: Test Mode vs Live Mode

- For development, use **Test mode** (toggle in top right)
- Test cards work only in Test mode
- For production, switch to **Live mode** and repeat the above steps with live keys

---

## 🔐 Google OAuth Setup

### Step 1: Create a Google Cloud Project

1. Go to https://console.cloud.google.com
2. Click "Select a project" → "New Project"
3. Enter project details:
   ```
   Project name: NextPay
   ```
4. Click "Create"
5. Wait for project creation (takes a few seconds)

### Step 2: Enable Google+ API

1. In the search bar, type "Google+ API"
2. Click on "Google+ API"
3. Click "Enable"

### Step 3: Configure OAuth Consent Screen

1. Go to "APIs & Services" → "OAuth consent screen"
2. Select "External" (unless you have Google Workspace)
3. Click "Create"
4. Fill in the required fields:
   ```
   App name: NextPay
   User support email: your-email@example.com
   Developer contact information: your-email@example.com
   ```
5. Click "Save and Continue"
6. Skip "Scopes" (click "Save and Continue")
7. Skip "Test users" (click "Save and Continue")
8. Click "Back to Dashboard"

### Step 4: Create OAuth Credentials

1. Go to "APIs & Services" → "Credentials"
2. Click "+ CREATE CREDENTIALS" → "OAuth client ID"
3. Select "Web application"
4. Fill in the details:

   ```
   Name: NextPay Web Client
   ```

5. Add **Authorized JavaScript origins**:

   ```
   http://localhost:3000
   http://localhost:3001
   ```

   (For production, add your actual domains)

6. Add **Authorized redirect URIs**:

   ```
   http://localhost:3001/api/auth/google/callback
   ```

   (For production: `https://your-api.railway.app/api/auth/google/callback`)

7. Click "Create"
8. **IMPORTANT:** Copy both:
   - **Client ID** (looks like: `123456789-abcdef.apps.googleusercontent.com`)
   - **Client Secret** (looks like: `GOCSPX-abc123xyz`)

---

## 🔧 Environment Variables

### Frontend Environment Variables

Create/update `apps/web/.env`:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001/api

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Stripe Public Key (from Stripe Dashboard → API Keys)
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_test_PASTE_YOUR_PUBLISHABLE_KEY_HERE

# Google OAuth Client ID (from Google Cloud Console)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=PASTE_YOUR_GOOGLE_CLIENT_ID_HERE
```

### Backend Environment Variables

Create/update `apps/api/.env`:

```env
# Application
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:3000

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=nextpay

# JWT Secret (generate a random string)
JWT_SECRET=your-super-secret-jwt-key-change-this-to-random-string
JWT_EXPIRES_IN=7d

# Google OAuth (from Google Cloud Console)
GOOGLE_CLIENT_ID=PASTE_YOUR_GOOGLE_CLIENT_ID_HERE
GOOGLE_CLIENT_SECRET=PASTE_YOUR_GOOGLE_CLIENT_SECRET_HERE
GOOGLE_CALLBACK_URL=http://localhost:3001/api/auth/google/callback

# Stripe (from Stripe Dashboard)
STRIPE_SECRET_KEY=sk_test_PASTE_YOUR_SECRET_KEY_HERE
STRIPE_WEBHOOK_SECRET=whsec_PASTE_YOUR_WEBHOOK_SECRET_HERE
STRIPE_PRICE_PRO=price_PASTE_YOUR_PRO_PRICE_ID_HERE
STRIPE_PRICE_ENTERPRISE=price_PASTE_YOUR_ENTERPRISE_PRICE_ID_HERE
```

### Quick Reference - What Goes Where

| Variable                        | Where to Get It                               | Where to Use It     |
| ------------------------------- | --------------------------------------------- | ------------------- |
| `NEXT_PUBLIC_STRIPE_PUBLIC_KEY` | Stripe Dashboard → API Keys                   | Frontend `.env`     |
| `STRIPE_SECRET_KEY`             | Stripe Dashboard → API Keys                   | Backend `.env`      |
| `STRIPE_WEBHOOK_SECRET`         | Stripe Dashboard → Webhooks                   | Backend `.env`      |
| `STRIPE_PRICE_PRO`              | Stripe Dashboard → Products → Pro Plan        | Backend `.env`      |
| `STRIPE_PRICE_ENTERPRISE`       | Stripe Dashboard → Products → Enterprise Plan | Backend `.env`      |
| `GOOGLE_CLIENT_ID`              | Google Cloud Console → Credentials            | Both `.env` files   |
| `GOOGLE_CLIENT_SECRET`          | Google Cloud Console → Credentials            | Backend `.env` only |

---

## 🧪 Testing

### Test Stripe Payments

Use these test card numbers (from Stripe):

✅ **Successful Payment:**

```
Card number: 4242 4242 4242 4242
Expiry: Any future date (e.g., 12/25)
CVC: Any 3 digits (e.g., 123)
```

❌ **Declined Payment:**

```
Card number: 4000 0000 0000 0002
Expiry: Any future date
CVC: Any 3 digits
```

🔐 **3D Secure Authentication:**

```
Card number: 4000 0025 0000 3155
Expiry: Any future date
CVC: Any 3 digits
```

### Test Google OAuth

1. Make sure your Google OAuth consent screen is configured
2. Test users should be added if using "External" app type
3. Click "Sign in with Google" on your app
4. Select your Google account
5. Grant permissions

### Test Webhook Locally

**Option 1: Using Stripe CLI (Recommended)**

1. Install Stripe CLI:

   ```bash
   brew install stripe/stripe-cli/stripe
   ```

2. Login to Stripe:

   ```bash
   stripe login
   ```

3. Forward webhooks to local server:

   ```bash
   stripe listen --forward-to localhost:3001/api/payments/webhook
   ```

4. Copy the webhook signing secret shown and update your `.env`

5. Test a payment - webhooks will be forwarded automatically

**Option 2: Using ngrok**

1. Install ngrok: https://ngrok.com/download
2. Start ngrok:
   ```bash
   ngrok http 3001
   ```
3. Copy the HTTPS URL (e.g., `https://abc123.ngrok.io`)
4. Update Stripe webhook endpoint to: `https://abc123.ngrok.io/api/payments/webhook`

---

## 🚀 Quick Start Checklist

- [ ] Stripe account created
- [ ] Stripe API keys copied
- [ ] Pro plan product created (price ID copied)
- [ ] Enterprise plan product created (price ID copied)
- [ ] Stripe webhook configured (secret copied)
- [ ] Google Cloud project created
- [ ] OAuth consent screen configured
- [ ] Google OAuth credentials created (client ID & secret copied)
- [ ] Frontend `.env` file updated with all values
- [ ] Backend `.env` file updated with all values
- [ ] Database is running (PostgreSQL)
- [ ] Run `npm run dev` to start the app
- [ ] Test a payment with test card
- [ ] Test Google sign-in

---

## 🆘 Troubleshooting

### Stripe Issues

**Problem: "No such price" error**

- Make sure you copied the **Price ID** (not Product ID)
- Price ID starts with `price_`
- Check it's from Test mode if using test keys

**Problem: Webhooks not working**

- Check the webhook URL is correct
- Ensure signing secret is correct
- Use Stripe CLI to test locally

### Google OAuth Issues

**Problem: "redirect_uri_mismatch" error**

- Make sure callback URL in Google Console matches exactly
- Include `http://localhost:3001/api/auth/google/callback`
- No trailing slashes

**Problem: "Access blocked" error**

- Add your email as a test user in OAuth consent screen
- Make sure OAuth consent screen is configured

### General Issues

**Problem: Environment variables not loading**

- Restart the dev server after changing `.env`
- Make sure file is named exactly `.env` (not `.env.txt`)
- Check no extra spaces in variable values

---

## 📝 Production Deployment

When deploying to production:

1. **Switch Stripe to Live Mode:**
   - Get live API keys
   - Create products again in live mode
   - Update webhook URL to production domain
   - Update all `STRIPE_*` variables with live values

2. **Update Google OAuth:**
   - Add production domain to authorized origins
   - Add production callback URL
   - Update `GOOGLE_CALLBACK_URL` to production URL

3. **Update all URLs:**
   - `NEXT_PUBLIC_API_URL` → Your production API URL
   - `NEXT_PUBLIC_APP_URL` → Your production frontend URL
   - `FRONTEND_URL` → Your production frontend URL

4. **Generate new JWT secret:**
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

---

## 🎉 You're All Set!

Once everything is configured, you can:

- Register new users
- Login with Google
- Subscribe to Pro or Enterprise plans
- Manage billing and subscriptions
- View payment history

For more help, check:

- [README.md](./README.md) - General documentation
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Deployment guide
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Technical architecture
