# 🚀 Deployment Fixes for Railway and Vercel

## 🛠️ Issues Fixed

### 1. Railway Deployment (Backend API)
**Problem**: `Dockerfile 'Dockerfile' does not exist`

**Solutions Applied**:
- ✅ Verified Dockerfile exists in `apps/api/Dockerfile`
- ✅ Created `.dockerignore` file to optimize build
- ✅ Updated `railway.json` start command to `node dist/main.js`
- ✅ Railway service configured for `apps/api` root directory

### 2. Vercel Deployment (Frontend Web)
**Problem**: Build failures during deployment

**Solutions Applied**:
- ✅ Created `.vercelignore` file to exclude unnecessary files
- ✅ Verified `vercel.json` configuration
- ✅ Confirmed package.json build scripts are correct
- ✅ No TypeScript/linting errors found

---

## 📋 Railway Configuration

### Service Settings
- **Root Directory**: `apps/api`
- **Build Command**: Uses Dockerfile
- **Start Command**: `node dist/main.js`
- **Port**: 3001

### Environment Variables Needed
```bash
# Database
DATABASE_URL=your_postgresql_url
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_password
POSTGRES_DB=nextpay

# JWT
JWT_SECRET=your-jwt-secret
JWT_EXPIRES_IN=7d

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=https://your-api-domain.com/api/auth/google/callback

# Stripe
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=your-webhook-secret
STRIPE_PRICE_FREE=your-free-price-id
STRIPE_PRICE_PRO=your-pro-price-id
STRIPE_PRICE_ENTERPRISE=your-enterprise-price-id

# App
FRONTEND_URL=https://your-frontend-domain.vercel.app
PORT=3001
```

---

## 📋 Vercel Configuration

### Project Settings
- **Framework**: Next.js
- **Root Directory**: `apps/web`
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install --legacy-peer-deps`

### Environment Variables Needed
```bash
# API Configuration
NEXT_PUBLIC_API_URL=https://your-api-domain.railway.app/api

# Google OAuth
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id

# App URL
NEXT_PUBLIC_APP_URL=https://your-frontend-domain.vercel.app

# Stripe Public Key
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_test_your-stripe-public-key
```

---

## 🔧 Manual Deployment Steps

### For Railway (Backend):
1. Go to Railway dashboard
2. Select your "NextPay" service
3. Go to Settings → Source
4. Verify Root Directory is set to `apps/api`
5. Go to Variables and add all required environment variables
6. Trigger a new deployment

### For Vercel (Frontend):
1. Go to Vercel dashboard
2. Select your "web" project
3. Go to Settings → General
4. Verify Root Directory is set to `apps/web`
5. Go to Environment Variables and add all required variables
6. Trigger a new deployment

---

## 🚨 Common Issues & Solutions

### Railway Issues:
1. **Dockerfile not found**: Ensure Railway service root directory is `apps/api`
2. **Build fails**: Check environment variables are set
3. **Database connection**: Verify DATABASE_URL is correct
4. **Port issues**: Railway assigns port via PORT environment variable

### Vercel Issues:
1. **Build fails**: Check for TypeScript errors
2. **Environment variables**: Ensure all NEXT_PUBLIC_ variables are set
3. **API connection**: Verify NEXT_PUBLIC_API_URL points to Railway API
4. **OAuth redirects**: Update Google OAuth redirect URLs

---

## 🔗 URLs After Deployment

### Production URLs:
- **Frontend**: `https://your-project.vercel.app`
- **Backend API**: `https://your-project.railway.app`
- **API Docs**: `https://your-project.railway.app/api/docs`

### Important Updates Needed:
1. **Google OAuth**: Update redirect URLs in Google Console
2. **Stripe**: Update webhook URLs in Stripe Dashboard
3. **CORS**: Backend should allow frontend domain

---

## ✅ Verification Checklist

### Railway (Backend):
- [ ] Service builds successfully
- [ ] API endpoints respond (check `/api/docs`)
- [ ] Database connection works
- [ ] Authentication endpoints work
- [ ] Payment endpoints work

### Vercel (Frontend):
- [ ] Build completes successfully
- [ ] Frontend loads without errors
- [ ] Authentication flow works
- [ ] API calls work (check browser network tab)
- [ ] Payment integration works

---

## 📞 Support

If issues persist:
1. Check Railway logs for backend errors
2. Check Vercel build logs for frontend errors
3. Verify all environment variables are set correctly
4. Ensure domains and URLs are properly configured

**Next Steps**: Commit these changes and trigger new deployments on both platforms.