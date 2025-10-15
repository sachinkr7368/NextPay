# 🔧 Environment Configuration Guide

## ✅ What's Fixed

### 1. Docker Compose Environment Variables

- ✅ Removed deprecated `version: '3.8'` from docker-compose.yml
- ✅ Created root `.env` file with all your API environment variables
- ✅ Added pgAdmin to docker-compose.yml with proper configuration
- ✅ No more environment variable warnings!

### 2. Database Access

- ✅ PostgreSQL running on localhost:5432
- ✅ pgAdmin running on http://localhost:5050
- ✅ Your data is preserved (2 users in database)

## 🗄️ How to Check Your Database

### Method 1: pgAdmin (Web Interface) - RECOMMENDED

1. **Open pgAdmin**: http://localhost:5050
2. **Login**:
   - Email: `admin@admin.com`
   - Password: `admin`

3. **Add Server**:
   - Right-click "Servers" → "Register" → "Server"
   - **General Tab**:
     - Name: `NextPay`
   - **Connection Tab**:
     - Host: `nextpay-db`
     - Port: `5432`
     - Database: `nextpay`
     - Username: `postgres`
     - Password: `postgres`
   - Click "Save"

4. **Browse Data**:
   - Expand: NextPay → Databases → nextpay → Schemas → public → Tables
   - Right-click "users" → "View/Edit Data" → "All Rows"

### Method 2: Command Line (Quick Queries)

```bash
# View all users
docker compose exec -T db psql -U postgres -d nextpay -c "SELECT * FROM users;"

# Interactive mode
docker compose exec db psql -U postgres -d nextpay

# Your specific user
docker compose exec -T db psql -U postgres -d nextpay -c "SELECT * FROM users WHERE email = 'sachin7368kr@gmail.com';"

# Make yourself admin
docker compose exec -T db psql -U postgres -d nextpay -c "UPDATE users SET role = 'admin' WHERE email = 'sachin7368kr@gmail.com';"
```

### Method 3: From Your App (Backend)

Add this temporary endpoint to any controller:

```typescript
@Get('debug/users')
async debugUsers() {
  return this.usersRepository.find();
}
```

Then visit: http://localhost:3001/api/debug/users

## 📁 Environment Files Structure

```
NextPay/
├── .env                           # ✅ Root env file (Docker Compose reads this)
├── apps/api/.env                  # ✅ API environment variables
├── apps/web/.env                  # ✅ Frontend environment variables
└── docker-compose.yml             # ✅ Updated with pgAdmin
```

## 🔐 Your Environment Variables

### Root `.env` (Docker Compose):

```bash
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

# JWT
JWT_SECRET=your-secret-key-change-this-in-production
JWT_EXPIRES_IN=7d

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:3001/api/auth/google/callback

# Stripe
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
STRIPE_PRICE_FREE=price_your_free_price_id
STRIPE_PRICE_PRO=price_your_pro_price_id
STRIPE_PRICE_ENTERPRISE=price_your_enterprise_price_id
```

### Frontend `.env`:

```bash
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001/api

# Google OAuth
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Stripe Public Key
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_test_your_stripe_public_key
```

## 🚀 Quick Commands

### Start Everything:

```bash
cd /Users/sachin/Desktop/NextPay
docker compose up -d db pgadmin
npm run dev
```

### Check Services:

```bash
# Check running containers
docker ps

# Check database
docker compose exec -T db psql -U postgres -d nextpay -c "SELECT COUNT(*) FROM users;"

# Check logs
docker compose logs db
docker compose logs pgadmin
```

### Stop Everything:

```bash
docker compose down
```

## 📊 Your Current Data

You have **2 users** in the database:

| ID           | Name             | Email                  | Plan | Role | Status |
| ------------ | ---------------- | ---------------------- | ---- | ---- | ------ |
| 94da9cc3-... | John Doe         | john@example.com       | free | user | Active |
| 94a469ef-... | **Sachin Kumar** | sachin7368kr@gmail.com | free | user | Active |

## 🎯 Test Your Setup

### 1. Database Access:

```bash
# Quick test
curl -s http://localhost:3000 > /dev/null && echo "✅ Frontend running"
curl -s http://localhost:3001/api/docs > /dev/null && echo "✅ Backend running"
curl -s http://localhost:5050 > /dev/null && echo "✅ pgAdmin running"
```

### 2. Authentication:

1. Visit: http://localhost:3000/auth/signin
2. Login with Google or email/password
3. Should stay logged in (no redirect to signin)

### 3. Database Queries:

```bash
# Make yourself admin
docker compose exec -T db psql -U postgres -d nextpay -c "UPDATE users SET role = 'admin' WHERE email = 'sachin7368kr@gmail.com';"

# Upgrade to Pro plan
docker compose exec -T db psql -U postgres -d nextpay -c "UPDATE users SET plan = 'pro' WHERE email = 'sachin7368kr@gmail.com';"

# Check your updated profile
docker compose exec -T db psql -U postgres -d nextpay -c "SELECT name, email, plan, role FROM users WHERE email = 'sachin7368kr@gmail.com';"
```

## 🔧 Troubleshooting

### Environment Variables Not Loading:

```bash
# Check if .env file exists
ls -la /Users/sachin/Desktop/NextPay/.env

# Restart Docker services
docker compose down
docker compose up -d
```

### Can't Access pgAdmin:

```bash
# Check if pgAdmin is running
docker ps | grep pgadmin

# Check pgAdmin logs
docker compose logs pgadmin

# Restart pgAdmin
docker compose restart pgadmin
```

### Database Connection Issues:

```bash
# Check if database is running
docker ps | grep nextpay-db

# Check database logs
docker compose logs db

# Test connection
docker compose exec -T db psql -U postgres -d nextpay -c "SELECT 1;"
```

## 🎉 You're All Set!

### Access Points:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **API Docs**: http://localhost:3001/api/docs
- **Database Admin**: http://localhost:5050
- **Database**: localhost:5432

### Next Steps:

1. ✅ Open pgAdmin: http://localhost:5050
2. ✅ Connect to your database
3. ✅ Browse your user data
4. ✅ Test authentication flow
5. ✅ Make yourself admin if needed

Everything is properly configured with your environment variables! 🚀
