# Railway Backend Deployment Guide

## Quick Deploy to Railway

### Step 1: Create Railway Account

1. Go to [Railway.app](https://railway.app)
2. Sign up with your GitHub account
3. Verify your account

### Step 2: Deploy Backend from GitHub

1. **Click "New Project"** on Railway dashboard
2. **Select "Deploy from GitHub repo"**
3. **Choose your repository**: `sachinkr7368/NextPay`
4. **Railway will detect the Dockerfile** automatically

### Step 3: Configure Service Settings

1. **Set Root Directory** (Important!):
   - Go to Settings → Service Settings
   - Set **Root Directory** to: `apps/api`
   - This tells Railway where to find the Dockerfile

2. **Configure Build Settings**:
   - Builder: `Dockerfile`
   - Dockerfile Path: `Dockerfile`

### Step 4: Add PostgreSQL Database

1. In your Railway project, click **"+ New"**
2. Select **"Database"** → **"Add PostgreSQL"**
3. Railway will automatically create a PostgreSQL instance
4. Copy the **DATABASE_URL** from the database service

### Step 5: Set Environment Variables

Go to your backend service → **Variables** tab and add:

```env
# Database
DATABASE_URL=${{Postgres.DATABASE_URL}}

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=https://your-api-url.railway.app/api/auth/google/callback

# Stripe
STRIPE_SECRET_KEY=sk_test_your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret

# Frontend URL (for CORS)
FRONTEND_URL=https://web-sachinkr7368s-projects.vercel.app

# Port
PORT=8080
```

**Note**: Railway automatically injects `DATABASE_URL` when you reference the Postgres service using `${{Postgres.DATABASE_URL}}`

### Step 6: Deploy

1. Click **"Deploy"** button
2. Wait for the build to complete (2-3 minutes)
3. Once deployed, Railway will provide you with a public URL

### Step 7: Get Your API URL

1. Go to **Settings** → **Networking**
2. Click **"Generate Domain"**
3. Your API will be available at: `https://your-app-name.railway.app`

---

## Alternative: Use Railway CLI

If you prefer using the CLI:

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Initialize project
cd /Users/sachin/Desktop/NextPay/apps/api
railway init

# Link to your project (if already created)
railway link

# Add PostgreSQL
railway add --database postgresql

# Set environment variables
railway variables set JWT_SECRET=your-jwt-secret
railway variables set GOOGLE_CLIENT_ID=your-client-id
railway variables set GOOGLE_CLIENT_SECRET=your-client-secret
railway variables set STRIPE_SECRET_KEY=your-stripe-key
railway variables set FRONTEND_URL=https://web-sachinkr7368s-projects.vercel.app

# Deploy
railway up
```

---

## Environment Variables Reference

### Required Variables:

| Variable                | Description                  | Example                                            |
| ----------------------- | ---------------------------- | -------------------------------------------------- |
| `DATABASE_URL`          | PostgreSQL connection string | `postgresql://user:pass@host:5432/db`              |
| `JWT_SECRET`            | Secret key for JWT tokens    | `your-super-secret-key`                            |
| `GOOGLE_CLIENT_ID`      | Google OAuth Client ID       | `xxx.apps.googleusercontent.com`                   |
| `GOOGLE_CLIENT_SECRET`  | Google OAuth Secret          | `GOCSPX-xxxxx`                                     |
| `GOOGLE_CALLBACK_URL`   | OAuth redirect URL           | `https://api.railway.app/api/auth/google/callback` |
| `STRIPE_SECRET_KEY`     | Stripe secret key            | `sk_test_xxxxx`                                    |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook secret        | `whsec_xxxxx`                                      |
| `FRONTEND_URL`          | Frontend URL for CORS        | `https://web-sachinkr7368s-projects.vercel.app`    |
| `PORT`                  | Server port                  | `8080`                                             |

---

## After Deployment

Once your backend is deployed, you'll get a URL like:
**`https://nextpay-production.railway.app`**

Use this URL to configure:

### 1. **Stripe Webhook URL**

- Dashboard → Developers → Webhooks → Add endpoint
- URL: `https://your-api-url.railway.app/api/payments/webhook`
- Events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`

### 2. **Google OAuth Redirect URI**

- Google Cloud Console → Credentials → OAuth 2.0 Client
- Authorized redirect URIs: `https://your-api-url.railway.app/api/auth/google/callback`

### 3. **Update Frontend Environment Variables**

On Vercel, update:

```env
NEXT_PUBLIC_API_URL=https://your-api-url.railway.app
```

---

## Troubleshooting

### Build Fails

- Check that Root Directory is set to `apps/api`
- Verify Dockerfile exists in `apps/api/Dockerfile`

### Database Connection Issues

- Ensure `DATABASE_URL` is set to `${{Postgres.DATABASE_URL}}`
- Check PostgreSQL service is running

### CORS Errors

- Verify `FRONTEND_URL` matches your Vercel URL exactly
- Check CORS configuration in `main.ts`

### Port Issues

- Railway automatically sets PORT=8080
- Make sure your app listens on `process.env.PORT`

---

## Monitoring

- **Logs**: Click on your service → View Logs
- **Metrics**: Go to Metrics tab for CPU/Memory usage
- **Database**: Access PostgreSQL metrics from database service

---

## Costs

- **Starter Plan**: $5/month includes:
  - 500 hours of usage
  - 100 GB bandwidth
  - PostgreSQL database included
- **Trial**: $5 free credit for new users
