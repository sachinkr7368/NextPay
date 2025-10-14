# Architecture Overview

This document describes the architecture and design decisions of NextPay.

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client Browser                           │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              Next.js Frontend (Port 3000)                │   │
│  │  • Server-Side Rendering (SSR)                          │   │
│  │  • Client-Side Navigation                               │   │
│  │  • Shadcn UI Components                                 │   │
│  │  • SWR for Data Fetching                                │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP/HTTPS
                              │
┌─────────────────────────────────────────────────────────────────┐
│                        NGINX Reverse Proxy                       │
│  • SSL Termination                                              │
│  • Load Balancing                                               │
│  • Rate Limiting                                                │
└─────────────────────────────────────────────────────────────────┘
                              │
                 ┌────────────┴──────────┐
                 │                       │
                 ▼                       ▼
    ┌────────────────────┐  ┌───────────────────┐
    │  Next.js Frontend  │  │  NestJS Backend   │
    │     (Port 3000)    │  │   (Port 3001)     │
    └────────────────────┘  └───────────────────┘
                                      │
                        ┌─────────────┼──────────────┐
                        │             │              │
                        ▼             ▼              ▼
              ┌──────────────┐ ┌──────────┐ ┌──────────┐
              │  PostgreSQL  │ │  Stripe  │ │  Google  │
              │   Database   │ │    API   │ │   OAuth  │
              └──────────────┘ └──────────┘ └──────────┘
```

## Technology Stack

### Frontend

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Shadcn UI, Radix UI
- **State Management:** React Hooks, SWR
- **Forms:** React Hook Form + Zod
- **HTTP Client:** Axios

### Backend

- **Framework:** NestJS 11
- **Language:** TypeScript
- **ORM:** TypeORM
- **Database:** PostgreSQL 15
- **Authentication:** JWT, Passport.js
- **Validation:** class-validator, Zod
- **Documentation:** Swagger/OpenAPI

### Infrastructure

- **Containerization:** Docker
- **Orchestration:** Docker Compose
- **Reverse Proxy:** NGINX
- **CI/CD:** GitHub Actions
- **Hosting:** Vercel (Frontend), Railway (Backend)

### External Services

- **Payments:** Stripe
- **OAuth:** Google OAuth 2.0
- **Email:** (To be implemented)
- **Monitoring:** (To be implemented)

## Project Structure

```
nextpay/
├── apps/
│   ├── web/                    # Next.js Frontend
│   │   ├── app/               # App Router pages
│   │   │   ├── (auth)/       # Auth pages
│   │   │   ├── dashboard/    # Dashboard pages
│   │   │   ├── admin/        # Admin panel
│   │   │   └── layout.tsx    # Root layout
│   │   ├── components/        # React components
│   │   │   ├── ui/           # Shadcn components
│   │   │   ├── navbar.tsx    # Navigation
│   │   │   └── *.tsx         # Feature components
│   │   ├── lib/              # Utilities
│   │   │   ├── axios.ts      # HTTP client
│   │   │   └── utils.ts      # Helper functions
│   │   └── __tests__/        # Frontend tests
│   │
│   └── api/                   # NestJS Backend
│       ├── src/
│       │   ├── auth/         # Authentication module
│       │   │   ├── strategies/  # Passport strategies
│       │   │   ├── guards/      # Auth guards
│       │   │   └── dto/         # Data transfer objects
│       │   ├── users/        # User management
│       │   ├── payments/     # Stripe integration
│       │   ├── admin/        # Admin endpoints
│       │   └── main.ts       # Application entry
│       └── test/             # Backend tests
│
├── .github/
│   └── workflows/            # CI/CD pipelines
│       ├── ci.yml           # Continuous integration
│       ├── deploy-vercel.yml # Frontend deployment
│       └── deploy-railway.yml # Backend deployment
│
├── docker-compose.yml        # Multi-service setup
├── nginx.conf               # Reverse proxy config
└── turbo.json              # Monorepo config
```

## Data Flow

### Authentication Flow

```
1. User submits credentials
   ↓
2. Frontend → POST /api/auth/login
   ↓
3. Backend validates credentials
   ↓
4. Backend generates JWT token
   ↓
5. Frontend stores token in localStorage
   ↓
6. Subsequent requests include Authorization header
```

### Payment Flow

```
1. User selects subscription plan
   ↓
2. Frontend → POST /api/payments/create-checkout-session
   ↓
3. Backend creates Stripe checkout session
   ↓
4. Frontend redirects to Stripe checkout
   ↓
5. User completes payment
   ↓
6. Stripe sends webhook to backend
   ↓
7. Backend updates user subscription
   ↓
8. User redirected back to app
```

## Database Schema

```sql
-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255),
    bio TEXT,
    avatar VARCHAR(500),
    google_id VARCHAR(255),
    role VARCHAR(50) DEFAULT 'user',
    plan VARCHAR(50) DEFAULT 'free',
    stripe_customer_id VARCHAR(255),
    stripe_subscription_id VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_google_id ON users(google_id);
CREATE INDEX idx_users_stripe_customer_id ON users(stripe_customer_id);
```

## Security Measures

### Authentication

- Passwords hashed with bcrypt (10 rounds)
- JWT tokens with expiration
- Refresh token rotation (to be implemented)
- OAuth 2.0 for social login

### Authorization

- Role-based access control (RBAC)
- Route guards on protected endpoints
- Admin-only endpoints

### Data Protection

- Input validation with class-validator
- SQL injection prevention via ORM
- XSS protection with React
- CSRF tokens (to be implemented)

### Network Security

- HTTPS everywhere
- CORS configuration
- Rate limiting with @nestjs/throttler
- Helmet.js for security headers

## API Design

### RESTful Principles

- Resource-based URLs
- Standard HTTP methods (GET, POST, PATCH, DELETE)
- Proper status codes
- Consistent error responses

### Response Format

```json
{
  "data": {},
  "message": "Success",
  "statusCode": 200
}
```

### Error Format

```json
{
  "error": "Bad Request",
  "message": "Validation failed",
  "statusCode": 400,
  "details": []
}
```

### Pagination

```json
{
  "data": [],
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 10
  }
}
```

## Performance Optimizations

### Frontend

- **SSR/SSG:** Pre-render pages for faster initial load
- **Code Splitting:** Automatic by Next.js
- **Image Optimization:** Next.js Image component
- **SWR Caching:** Client-side data caching
- **Lazy Loading:** Components loaded on demand

### Backend

- **Connection Pooling:** TypeORM connection pool
- **Query Optimization:** Indexed columns
- **Caching:** (To be implemented with Redis)
- **Rate Limiting:** Prevent abuse

### Database

- **Indexes:** On frequently queried columns
- **Query Optimization:** Efficient SQL queries
- **Connection Pooling:** Reuse connections

## Scalability Considerations

### Horizontal Scaling

- **Frontend:** Stateless, scales easily on Vercel
- **Backend:** Add more instances behind load balancer
- **Database:** Read replicas for read-heavy workloads

### Vertical Scaling

- **Increase resources:** More CPU/RAM
- **Database optimization:** Larger instance

### Caching Strategy

- **CDN:** Static assets cached globally
- **API Cache:** Redis for frequently accessed data
- **Database Cache:** Query result caching

## Monitoring & Observability

### Metrics (To be implemented)

- Request/response times
- Error rates
- CPU/Memory usage
- Database query performance

### Logging

- Structured logging with context
- Log levels (debug, info, warn, error)
- Centralized log aggregation

### Alerting

- Error rate thresholds
- Performance degradation
- Resource utilization

## Future Enhancements

### Phase 1 (Current)

- ✅ Authentication (JWT + OAuth)
- ✅ Stripe subscriptions
- ✅ User dashboard
- ✅ Admin panel

### Phase 2

- [ ] Email service integration
- [ ] Two-factor authentication
- [ ] Team/organization support
- [ ] Advanced analytics

### Phase 3

- [ ] Multi-language support
- [ ] Mobile app (React Native)
- [ ] Webhooks for third-party integrations
- [ ] Advanced reporting

### Phase 4

- [ ] AI-powered features
- [ ] Advanced security (SOC 2, GDPR)
- [ ] Enterprise features
- [ ] White-label solution

## Design Decisions

### Why Next.js?

- Server-side rendering for SEO
- Great developer experience
- Built-in routing and optimization
- Large ecosystem

### Why NestJS?

- TypeScript-first framework
- Modular architecture
- Built-in dependency injection
- Enterprise-ready

### Why PostgreSQL?

- Reliable and mature
- Great for relational data
- ACID compliance
- Rich feature set

### Why Stripe?

- Industry standard
- Excellent documentation
- Comprehensive features
- Developer-friendly

### Why TurboRepo?

- Efficient monorepo management
- Fast builds with caching
- Simple configuration
- Great for TypeScript projects

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines on contributing to this project.

## License

This project is licensed under the MIT License - see [LICENSE](./LICENSE) file for details.
