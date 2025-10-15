# Starting NextPay Development Servers

## Prerequisites

Your NextPay application requires:

1. **Node.js** ✅ (Already installed)
2. **PostgreSQL Database** ❌ (Not running)
3. **npm dependencies** ✅ (Already installed)

## Issue Found

The backend API cannot start because PostgreSQL database is not running on `localhost:5432`.

## Solutions

### Option 1: Using Docker (Recommended)

If you have Docker installed:

```bash
# Start the PostgreSQL database
cd /Users/sachin/Desktop/NextPay
docker compose up -d db

# Wait for database to be ready (about 5-10 seconds)
sleep 10

# Start both frontend and backend
npm run dev
```

### Option 2: Install PostgreSQL Locally

If Docker is not available, install PostgreSQL using Homebrew:

```bash
# Install PostgreSQL
brew install postgresql@15

# Start PostgreSQL service
brew services start postgresql@15

# Create the database
createdb nextpay

# Start the dev servers
cd /Users/sachin/Desktop/NextPay
npm run dev
```

### Option 3: Manual Terminal Sessions

Open **two separate terminal windows**:

**Terminal 1 - Backend API:**

```bash
cd /Users/sachin/Desktop/NextPay/apps/api
npm run dev
```

**Terminal 2 - Frontend:**

```bash
cd /Users/sachin/Desktop/NextPay/apps/web
npm run dev
```

## After Starting

Once running, you can access:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **API Documentation**: http://localhost:3001/api/docs

## Quick Start Script

I've created a helper script `/Users/sachin/Desktop/NextPay/dev.sh` that starts both servers once the database is running.

## Current Status

- ✅ API package.json updated with `dev` script
- ✅ Environment files configured
- ❌ Database needs to be started
- ⏳ Waiting to start frontend and backend
