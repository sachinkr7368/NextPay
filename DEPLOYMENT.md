# Deployment Guide

This guide covers deploying NextPay to various cloud platforms.

## Table of Contents

- [Vercel (Frontend)](#vercel-frontend)
- [Railway (Backend + Database)](#railway-backend--database)
- [Docker / Self-Hosted](#docker--self-hosted)
- [Environment Variables](#environment-variables)
- [Post-Deployment](#post-deployment)

## Vercel (Frontend)

### Prerequisites

- GitHub account
- Vercel account
- Code pushed to GitHub repository

### Steps

1. **Import Project**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New" → "Project"
   - Import your GitHub repository
   - Select the `apps/web` directory as root

2. **Configure Build Settings**

   ```
   Framework Preset: Next.js
   Root Directory: apps/web
   Build Command: npm run build
   Output Directory: .next
   Install Command: npm install
   ```

3. **Set Environment Variables**

   Go to Project Settings → Environment Variables and add:

   ```
   NEXT_PUBLIC_API_URL=https://your-api.railway.app/api
   NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
   NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_live_your_key
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Your app will be live at `your-app.vercel.app`

### Custom Domain

1. Go to Project Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions
4. Update `NEXT_PUBLIC_APP_URL` environment variable

## Railway (Backend + Database)

### Prerequisites

- Railway account
- GitHub repository

### Steps

1. **Create New Project**
   - Go to [Railway Dashboard](https://railway.app/dashboard)
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Authorize and select your repository

2. **Add PostgreSQL Database**
   - In your project, click "New"
   - Select "Database" → "PostgreSQL"
   - Railway will automatically provision the database
   - Note: `DATABASE_URL` is automatically added to environment

3. **Configure Backend Service**
   - Click "New" → "GitHub Repo"
   - Select your repository
   - Set Root Directory: `apps/api`
   - Railway will auto-detect Node.js and deploy

4. **Set Environment Variables**

   Click on your backend service → Variables tab:

   ```
   NODE_ENV=production
   PORT=3001
   FRONTEND_URL=https://your-app.vercel.app

   # Database (auto-provided by Railway)
   # DATABASE_URL is automatically set
   # Or use individual variables:
   DB_HOST=${{Postgres.PGHOST}}
   DB_PORT=${{Postgres.PGPORT}}
   DB_USERNAME=${{Postgres.PGUSER}}
   DB_PASSWORD=${{Postgres.PGPASSWORD}}
   DB_NAME=${{Postgres.PGDATABASE}}

   # JWT
   JWT_SECRET=your-production-secret-key
   JWT_EXPIRES_IN=7d

   # Google OAuth
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   GOOGLE_CALLBACK_URL=https://your-api.railway.app/api/auth/google/callback

   # Stripe
   STRIPE_SECRET_KEY=sk_live_your_key
   STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
   STRIPE_PRICE_PRO=price_your_pro_id
   STRIPE_PRICE_ENTERPRISE=price_your_enterprise_id
   ```

5. **Deploy**
   - Railway will automatically deploy on push to main branch
   - Monitor logs in the deployment tab
   - Your API will be live at `your-service.railway.app`

### Database Migrations

Railway doesn't run migrations automatically. Options:

**Option 1: Run manually**

```bash
# Connect to Railway
railway login
railway link

# Run migrations
cd apps/api
railway run npm run migration:run
```

**Option 2: Add to build command**

In Railway settings, set Start Command:

```bash
npm run migration:run && npm run start:prod
```

## Docker / Self-Hosted

### Prerequisites

- Server with Docker and Docker Compose installed
- Domain name (optional)
- SSL certificate (optional, recommended)

### Steps

1. **Clone Repository on Server**

   ```bash
   git clone <your-repo> nextpay
   cd nextpay
   ```

2. **Create Environment File**

   ```bash
   cp .env.example .env
   # Edit .env with production values
   nano .env
   ```

3. **Build and Start Services**

   ```bash
   # Build images
   docker-compose build

   # Start services
   docker-compose up -d

   # View logs
   docker-compose logs -f
   ```

4. **Configure NGINX (Optional)**

   For SSL and custom domain:

   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;
       return 301 https://$server_name$request_uri;
   }

   server {
       listen 443 ssl http2;
       server_name yourdomain.com;

       ssl_certificate /etc/ssl/certs/yourdomain.crt;
       ssl_certificate_key /etc/ssl/private/yourdomain.key;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }

       location /api {
           proxy_pass http://localhost:3001;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

5. **Set Up SSL with Let's Encrypt**

   ```bash
   # Install Certbot
   sudo apt-get install certbot python3-certbot-nginx

   # Get certificate
   sudo certbot --nginx -d yourdomain.com

   # Auto-renewal
   sudo certbot renew --dry-run
   ```

## Environment Variables

### Required Variables

**Frontend:**

```env
NEXT_PUBLIC_API_URL=          # Backend API URL
NEXT_PUBLIC_APP_URL=          # Frontend URL
NEXT_PUBLIC_STRIPE_PUBLIC_KEY= # Stripe publishable key
```

**Backend:**

```env
NODE_ENV=production
PORT=3001
FRONTEND_URL=                 # Frontend URL

# Database
DB_HOST=
DB_PORT=5432
DB_USERNAME=
DB_PASSWORD=
DB_NAME=

# Auth
JWT_SECRET=                   # Strong random secret
JWT_EXPIRES_IN=7d

# Stripe
STRIPE_SECRET_KEY=           # Stripe secret key
STRIPE_WEBHOOK_SECRET=       # Webhook signing secret
STRIPE_PRICE_PRO=           # Pro plan price ID
STRIPE_PRICE_ENTERPRISE=    # Enterprise plan price ID
```

### Optional Variables

```env
# Google OAuth (optional)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=

# Monitoring (optional)
SENTRY_DSN=
LOG_LEVEL=info
```

## Post-Deployment

### 1. Configure Stripe Webhooks

1. Go to Stripe Dashboard → Developers → Webhooks
2. Click "Add endpoint"
3. URL: `https://your-api.railway.app/api/payments/webhook`
4. Select events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. Copy webhook signing secret
6. Add to environment variables as `STRIPE_WEBHOOK_SECRET`

### 2. Test Stripe Integration

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Forward webhooks to local
stripe listen --forward-to https://your-api.railway.app/api/payments/webhook
```

### 3. Configure Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create OAuth 2.0 credentials
3. Add authorized redirect URIs:
   - `https://your-api.railway.app/api/auth/google/callback`
4. Update environment variables

### 4. Set Up Monitoring

Consider adding:

- **Sentry** for error tracking
- **LogRocket** for session replay
- **Google Analytics** for usage tracking
- **Uptime monitoring** (UptimeRobot, Pingdom)

### 5. Database Backups

**Railway:**

- Automatic daily backups included
- Manual backups available in dashboard

**Self-hosted:**

```bash
# Create backup
docker exec nextpay-postgres pg_dump -U postgres nextpay > backup.sql

# Restore backup
docker exec -i nextpay-postgres psql -U postgres nextpay < backup.sql

# Automated backups with cron
0 2 * * * /path/to/backup-script.sh
```

### 6. Performance Optimization

1. **Enable caching:**
   - CloudFlare for CDN
   - Redis for API caching

2. **Database optimization:**
   - Add indexes
   - Enable connection pooling
   - Regular VACUUM and ANALYZE

3. **Frontend optimization:**
   - Enable image optimization
   - Use ISR for static content
   - Implement route prefetching

## Troubleshooting

### Build Failures

**Issue:** Next.js build fails

```bash
# Check logs
vercel logs

# Common fixes:
# - Clear .next cache
# - Verify environment variables
# - Check TypeScript errors
```

**Issue:** NestJS build fails

```bash
# Check Railway logs
railway logs

# Common fixes:
# - Verify all dependencies installed
# - Check TypeScript configuration
# - Ensure migrations are valid
```

### Database Connection Issues

```bash
# Test connection
psql -h <host> -U <user> -d <database>

# Check environment variables
echo $DATABASE_URL

# Verify network access
nc -zv <db-host> 5432
```

### CORS Errors

Update backend CORS configuration in `apps/api/src/main.ts`:

```typescript
app.enableCors({
  origin: ["https://your-app.vercel.app", "https://yourdomain.com"],
  credentials: true,
});
```

## Security Checklist

- [ ] Use strong JWT secrets
- [ ] Enable HTTPS everywhere
- [ ] Set secure cookie flags
- [ ] Configure CORS properly
- [ ] Use environment variables for secrets
- [ ] Enable rate limiting
- [ ] Set up Web Application Firewall (WAF)
- [ ] Regular security audits
- [ ] Keep dependencies updated
- [ ] Monitor for vulnerabilities

## Scaling Considerations

### Horizontal Scaling

**Frontend:**

- Vercel handles automatically
- No configuration needed

**Backend:**

- Railway: Increase replicas in settings
- Self-hosted: Use load balancer + multiple instances

### Vertical Scaling

**Database:**

- Railway: Upgrade plan for more resources
- Self-hosted: Increase CPU/RAM allocation

**Application:**

- Monitor performance with APM tools
- Identify bottlenecks
- Optimize slow queries
- Add caching layers

## Support

For deployment issues:

- Check logs first
- Review environment variables
- Consult platform documentation
- Open GitHub issue with details
