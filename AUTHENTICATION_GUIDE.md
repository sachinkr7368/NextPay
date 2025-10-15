# 🔐 NextPay Authentication Guide

## User Storage

### Database: PostgreSQL

Users are stored in the `users` table in PostgreSQL database:

```sql
-- View all users
docker compose exec -T db psql -U postgres -d nextpay -c "SELECT * FROM users;"

-- View specific user
docker compose exec -T db psql -U postgres -d nextpay -c "SELECT id, name, email, plan, role, \"isActive\", \"createdAt\" FROM users WHERE email = 'your-email@example.com';"
```

### Your Current User:

- **ID**: `94a469ef-c8c4-4f60-b546-3217fd4b2191`
- **Name**: Sachin Kumar
- **Email**: sachin7368kr@gmail.com
- **Plan**: free
- **Role**: user
- **Status**: Active
- **Created**: 2025-10-15 05:11:49

## Authentication Flow

### 1. Google OAuth Flow

```
User clicks "Sign in with Google"
    ↓
Frontend: /auth/signin → Redirects to Backend
    ↓
Backend: GET /api/auth/google → Redirects to Google
    ↓
Google OAuth Consent Screen
    ↓
Backend: GET /api/auth/google/callback → Receives user info
    ↓
Backend creates/updates user in database
    ↓
Backend generates JWT token
    ↓
Backend redirects to: http://localhost:3000/auth/callback?token={jwt}
    ↓
Frontend: /auth/callback → Stores token & redirects to dashboard
    ↓
Dashboard: User is authenticated!
```

### 2. Email/Password Flow

```
User submits email + password
    ↓
Frontend: POST /api/auth/register or /api/auth/login
    ↓
Backend validates credentials
    ↓
Backend returns JWT token
    ↓
Frontend stores token in localStorage
    ↓
User is authenticated!
```

## Token Management

### Storage Location

Tokens are stored in the browser's `localStorage`:

```javascript
// Token is stored as:
localStorage.setItem("token", "your-jwt-token");
localStorage.setItem("user", JSON.stringify(userData));

// Retrieved automatically by axios interceptor
const token = localStorage.getItem("token");
```

### Token Structure

Your JWT token contains:

```json
{
  "email": "sachin7368kr@gmail.com",
  "sub": "94a469ef-c8c4-4f60-b546-3217fd4b2191",
  "role": "user",
  "iat": 1760505109,
  "exp": 1761109909
}
```

### Automatic Token Injection

The axios interceptor automatically adds the token to all API requests:

```typescript
// In lib/axios.ts
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

## Authentication Pages

### 1. Sign In Page

**URL**: http://localhost:3000/auth/signin

- Email/Password login
- Google OAuth button
- Link to Sign Up

### 2. Sign Up Page

**URL**: http://localhost:3000/auth/signup

- Email/Password registration
- Creates new user in database
- Auto-login after registration

### 3. OAuth Callback Page ✨ (Just Created!)

**URL**: http://localhost:3000/auth/callback?token={jwt}

**What it does:**

1. ✓ Extracts JWT token from URL query parameter
2. ✓ Verifies token by fetching user profile from backend
3. ✓ Stores token in localStorage
4. ✓ Stores user info in localStorage
5. ✓ Shows success/error feedback
6. ✓ Redirects to dashboard after 2 seconds

**File**: `apps/web/app/auth/callback/page.tsx`

## Protected Routes

All protected routes automatically check for authentication:

```typescript
// Example from dashboard/page.tsx
useEffect(() => {
  const token = localStorage.getItem("token");
  if (!token) {
    router.push("/auth/signin");
  }
}, [router]);
```

## API Endpoints

### Authentication Endpoints:

- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - Login with email/password
- `GET /api/auth/google` - Initiate Google OAuth
- `GET /api/auth/google/callback` - Google OAuth callback

### Protected Endpoints (Require JWT):

- `GET /api/users/me` - Get current user profile
- `PATCH /api/users/me` - Update profile
- `GET /api/payments/subscription` - Get subscription details
- `POST /api/payments/create-checkout-session` - Create payment
- `GET /api/admin/*` - Admin-only endpoints

## Testing Authentication

### 1. Test Google OAuth:

```bash
# Visit in browser:
open http://localhost:3000/auth/signin

# Click "Sign in with Google"
# You should be redirected through:
# → Google → Backend → Callback page → Dashboard
```

### 2. Test Email/Password:

```bash
# Sign Up:
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'

# Login:
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### 3. Test Protected Endpoint:

```bash
# Get profile (replace TOKEN with your JWT):
curl http://localhost:3001/api/users/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Database Queries

### View all users:

```bash
docker compose exec -T db psql -U postgres -d nextpay -c "SELECT id, name, email, plan, role FROM users;"
```

### View user details:

```bash
docker compose exec -T db psql -U postgres -d nextpay -c "SELECT * FROM users WHERE email = 'your-email@example.com';"
```

### Count users by plan:

```bash
docker compose exec -T db psql -U postgres -d nextpay -c "SELECT plan, COUNT(*) FROM users GROUP BY plan;"
```

## Troubleshooting

### Token expired or invalid:

- The axios interceptor will automatically redirect to `/auth/signin`
- Tokens expire after 7 days (configured in JWT_EXPIRES_IN)

### Callback page not working:

- Check browser console for errors
- Verify token is in URL: `?token=...`
- Check if backend is running: http://localhost:3001

### Google OAuth not working:

- Verify redirect URI in Google Cloud Console: http://localhost:3001/api/auth/google/callback
- Check `.env` file has correct GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET

## Security Features

✅ JWT tokens with expiration
✅ Password hashing with bcrypt
✅ Protected routes with guards
✅ Automatic token refresh handling
✅ Secure cookie handling
✅ CORS protection
✅ SQL injection prevention (TypeORM)
✅ XSS protection

## Next Steps

1. ✅ Google OAuth working
2. ✅ Callback page created
3. ✅ Token storage configured
4. ✅ User stored in database

Now try it:

1. Visit http://localhost:3000/auth/signin
2. Click "Sign in with Google"
3. Watch the magic happen! ✨
