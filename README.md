# NextPay - Production-Ready SaaS Starter

<div align="center">
  <img src="https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js" />
  <img src="https://img.shields.io/badge/NestJS-11-E0234E?style=for-the-badge&logo=nestjs" />
  <img src="https://img.shields.io/badge/PostgreSQL-15-336791?style=for-the-badge&logo=postgresql" />
  <img src="https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript" />
  <img src="https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker" />
</div>

<br />

A complete, production-ready SaaS starter built with modern technologies. Launch your SaaS product faster with authentication, payments, subscriptions, and everything you need out of the box.

## ✨ Features

### 🔐 Authentication

- **JWT-based authentication** with secure token management
- **Google OAuth integration** for social login
- Password hashing with bcrypt
- Protected routes and role-based access control

### 💳 Payment & Subscriptions

- **Stripe integration** for payment processing
- Three subscription tiers: Free, Pro ($29/mo), Enterprise ($99/mo)
- Stripe checkout sessions
- Customer portal for subscription management
- Invoice history and billing management
- Webhook handling for subscription events

### 🎨 Modern UI

- Beautiful, responsive design with **Tailwind CSS**
- Component library with **Shadcn UI** and **Radix UI**
- Dark mode support
- Mobile-first approach
- Smooth animations and transitions

### 📊 Dashboard & Admin

- User dashboard with statistics
- Profile management (edit bio, avatar, name)
- Subscription management interface
- Admin panel for:
  - User management
  - Payment tracking
  - Platform statistics
  - Plan management

### 🛠️ Developer Experience

- **TurboRepo** monorepo structure
- **TypeScript** everywhere for type safety
- **Zod** for schema validation
- Hot reload in development
- Comprehensive testing setup
- ESLint & Prettier configuration

### 🚀 Performance & SEO

- Server-side rendering (SSR) with Next.js
- Static site generation (SSG) where possible
- API data caching with SWR
- SEO meta tags, sitemap, robots.txt
- Social sharing images (Open Graph)
- Optimized images and fonts

### 🐳 DevOps & Deployment

- **Docker** containerization with multi-stage builds
- **Docker Compose** for local development
- **NGINX** reverse proxy configuration
- **GitHub Actions** CI/CD pipelines
- Ready for **Vercel** (frontend) and **Railway** (backend)
- Environment variable management

### 🧪 Testing

- Jest for unit testing
- React Testing Library for component tests
- Supertest for API integration tests
- Test coverage reporting

## 📁 Project Structure

```
nextpay/
├── apps/
│   ├── web/                 # Next.js frontend
│   │   ├── app/            # App router pages
│   │   ├── components/     # React components
│   │   ├── lib/           # Utilities
│   │   └── __tests__/     # Frontend tests
│   └── api/                # NestJS backend
│       ├── src/
│       │   ├── auth/      # Authentication module
│       │   ├── users/     # User management
│       │   ├── payments/  # Stripe integration
│       │   └── admin/     # Admin endpoints
│       └── test/          # Backend tests
├── packages/              # Shared packages (optional)
├── .github/
│   └── workflows/        # CI/CD pipelines
├── docker-compose.yml    # Multi-service Docker setup
├── nginx.conf           # Reverse proxy config
└── turbo.json          # Monorepo configuration
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL 15+
- Docker & Docker Compose (optional)
- Stripe account
- Google OAuth credentials (optional)

### 1. Clone and Install

```bash
git clone <your-repo-url> nextpay
cd nextpay
npm install
```

### 2. Environment Setup

**Frontend (.env):**

```bash
cp apps/web/.env.example apps/web/.env
```

Update `apps/web/.env`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_test_your_key
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
```

**Backend (.env):**

```bash
cp apps/api/.env.example apps/api/.env
```

Update `apps/api/.env`:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=nextpay

JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRES_IN=7d

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3001/api/auth/google/callback

STRIPE_SECRET_KEY=sk_test_your_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
STRIPE_PRICE_PRO=price_your_pro_price_id
STRIPE_PRICE_ENTERPRISE=price_your_enterprise_price_id

FRONTEND_URL=http://localhost:3000
```

### 3. Database Setup

Start PostgreSQL:

```bash
# Using Docker
docker run --name nextpay-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=nextpay -p 5432:5432 -d postgres:15-alpine

# Or use your local PostgreSQL installation
```

### 4. Run Development Servers

```bash
# Run all services (recommended)
npm run dev

# Or run individually:
cd apps/web && npm run dev    # Frontend: http://localhost:3000
cd apps/api && npm run start:dev  # Backend: http://localhost:3001
```

### 5. Access the Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:3001/api
- **API Documentation:** http://localhost:3001/api/docs

## 🐳 Docker Deployment

### Local Development with Docker

```bash
# Build and start all services
docker-compose up --build

# Or use make commands
make docker-up
```

Services will be available at:

- Frontend: http://localhost (via NGINX)
- Backend API: http://localhost/api
- Database: localhost:5432

### Production Build

```bash
# Build production images
docker-compose -f docker-compose.prod.yml build

# Deploy
docker-compose -f docker-compose.prod.yml up -d
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Frontend tests
cd apps/web && npm test

# Backend tests
cd apps/api && npm run test:e2e

# Test coverage
npm run test:coverage
```

## 📚 API Documentation

Interactive API documentation is available at:

```
http://localhost:3001/api/docs
```

### Key Endpoints

#### Authentication

```
POST /api/auth/register     # Register new user
POST /api/auth/login        # Login with credentials
GET  /api/auth/google       # Initiate Google OAuth
GET  /api/auth/google/callback  # OAuth callback
```

#### Users

```
GET   /api/users/me         # Get current user
PATCH /api/users/me         # Update user profile
GET   /api/users/me/stats   # Get user statistics
```

#### Payments

```
POST /api/payments/create-checkout-session  # Create Stripe checkout
POST /api/payments/create-portal-session    # Create billing portal
GET  /api/payments/subscription             # Get subscription details
GET  /api/payments/invoices                 # Get invoice history
POST /api/payments/webhook                  # Stripe webhook handler
```

#### Admin

```
GET /api/admin/users        # Get all users (admin)
GET /api/admin/payments     # Get all payments (admin)
GET /api/admin/stats        # Get platform stats (admin)
```

### Sample API Calls

**Register:**

```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Login:**

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Get Profile:**

```bash
curl -X GET http://localhost:3001/api/users/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🎨 Customization

### Branding

1. Update the app name in `apps/web/components/navbar.tsx`
2. Replace logo in `public/` folder
3. Update meta tags in `apps/web/app/layout.tsx`
4. Modify color scheme in `apps/web/app/globals.css`

### Subscription Plans

Update pricing in:

- `apps/web/app/pricing/page.tsx` - Frontend pricing cards
- Stripe Dashboard - Create products and prices
- `apps/api/.env` - Add Stripe price IDs

### Email Templates

Add email service integration in `apps/api/src/email/` for:

- Welcome emails
- Password reset
- Subscription confirmations
- Billing notifications

## 🚀 Deployment Guide

### Frontend (Vercel)

1. Push code to GitHub
2. Import project in Vercel
3. Set environment variables
4. Deploy

```bash
# Or use CLI
cd apps/web
vercel --prod
```

### Backend (Railway)

1. Create new project in Railway
2. Connect GitHub repository
3. Set environment variables
4. Add PostgreSQL database
5. Deploy

```bash
# Or use CLI
cd apps/api
railway up
```

### Environment Variables

Set these in your deployment platform:

**Vercel (Frontend):**

- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_STRIPE_PUBLIC_KEY`
- `NEXT_PUBLIC_GOOGLE_CLIENT_ID`

**Railway (Backend):**

- All variables from `apps/api/.env.example`
- Railway provides `DATABASE_URL` automatically

## 📊 Architecture Diagram

```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│             │         │              │         │             │
│  Next.js    │────────▶│   NestJS     │────────▶│ PostgreSQL  │
│  Frontend   │  HTTP   │   Backend    │   SQL   │  Database   │
│             │         │              │         │             │
└─────────────┘         └──────────────┘         └─────────────┘
      │                        │
      │                        │
      ▼                        ▼
┌─────────────┐         ┌──────────────┐
│             │         │              │
│   Vercel    │         │   Stripe     │
│  (Deploy)   │         │  (Payments)  │
│             │         │              │
└─────────────┘         └──────────────┘
```

## 🧪 Test Accounts

For development and testing:

**Test User:**

- Email: `test@example.com`
- Password: `password123`

**Stripe Test Cards:**

- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- 3D Secure: `4000 0025 0000 3155`

Use any future expiry date and any 3-digit CVC.

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

- 📧 Email: support@nextpay.com
- 💬 Discord: [Join our community]
- 📖 Documentation: [docs.nextpay.com]
- 🐛 Issues: [GitHub Issues]

## 🙏 Acknowledgments

Built with:

- [Next.js](https://nextjs.org/)
- [NestJS](https://nestjs.com/)
- [Stripe](https://stripe.com/)
- [Shadcn UI](https://ui.shadcn.com/)
- [TailwindCSS](https://tailwindcss.com/)
- [PostgreSQL](https://www.postgresql.org/)
- [Docker](https://www.docker.com/)

---

<div align="center">
  <strong>⭐ Star this repo if you find it helpful!</strong>
  <br />
  <sub>Built with ❤️ for developers</sub>
</div>
