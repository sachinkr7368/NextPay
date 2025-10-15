# 🔧 Vercel Environment Variables Configuration

## Required Environment Variables for NextPay Frontend

### 📋 Copy these variables to your Vercel project:

### 1. API Configuration

```
NEXT_PUBLIC_API_URL=https://your-railway-backend.railway.app/api
```

### 2. Google OAuth Configuration

```
NEXT_PUBLIC_GOOGLE_CLIENT_ID=1087763012294-vpgp9edg8k1quh8ijbvahc6be9dm47mu.apps.googleusercontent.com
```

### 3. App Configuration

```
NEXT_PUBLIC_APP_URL=https://your-vercel-app.vercel.app
```

### 4. Stripe Configuration

```
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_test_51RscP5LV9XDn5rbHlvAqULAo5zTZrqtAyjzVRpoCf7QmL3NHh6myfqSmlJzOKohI19iLdghJezhvi67Jy3SNkODM006WRIgxwE
```

---

## 🚀 How to Add These in Vercel Dashboard:

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/dashboard
   - Select your "web" project

2. **Navigate to Environment Variables**
   - Go to Settings → Environment Variables

3. **Add Each Variable**
   - Click "Add New"
   - Add each variable above
   - Set Environment to "Production" (or all environments)
   - Click "Save"

4. **Redeploy**
   - Go to Deployments tab
   - Click "Redeploy" on latest deployment
   - Or trigger new deployment from GitHub

---

## 🔗 Important URLs to Update:

### After deployment, update these URLs:

1. **Google OAuth Console**
   - Add redirect URI: `https://your-vercel-app.vercel.app/auth/callback`

2. **Railway Backend CORS**
   - Update FRONTEND_URL: `https://your-vercel-app.vercel.app`

3. **Stripe Webhook**
   - Update webhook URL: `https://your-railway-backend.railway.app/api/payments/webhook`

---

## ✅ Verification Steps:

1. **Frontend loads**: Visit your Vercel URL
2. **Authentication works**: Try signing up/signing in
3. **API calls work**: Check browser network tab for API requests
4. **Payments work**: Test subscription flow
5. **Documentation accessible**: Visit `/docs` page

---

## 🆘 Troubleshooting:

### Common Issues:

- **API not connecting**: Check NEXT_PUBLIC_API_URL is correct
- **OAuth not working**: Verify Google Client ID and redirect URLs
- **Payments failing**: Check Stripe public key and backend webhook
- **Build failing**: Ensure all required env vars are set

### Quick Fixes:

- Redeploy after adding environment variables
- Check Vercel function logs for errors
- Verify Railway backend is running
- Test API endpoints directly
