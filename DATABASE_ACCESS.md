# 🗄️ Database Access Guide - NextPay

## Your Database Connection Details

### Connection Info:

- **Host**: localhost
- **Port**: 5432
- **Database**: nextpay
- **Username**: postgres
- **Password**: postgres

## Method 1: Command Line (Quick & Easy)

### Basic Queries:

#### View all users:

```bash
docker compose exec -T db psql -U postgres -d nextpay -c "SELECT * FROM users;"
```

#### View specific user (your account):

```bash
docker compose exec -T db psql -U postgres -d nextpay -c "SELECT id, name, email, plan, role, \"createdAt\" FROM users WHERE email = 'sachin7368kr@gmail.com';"
```

#### Count users by plan:

```bash
docker compose exec -T db psql -U postgres -d nextpay -c "SELECT plan, COUNT(*) as count FROM users GROUP BY plan;"
```

#### View table structure:

```bash
docker compose exec -T db psql -U postgres -d nextpay -c "\d users"
```

### Interactive PostgreSQL Shell:

```bash
# Enter the database container
docker compose exec db psql -U postgres -d nextpay
```

Once inside the shell:

```sql
-- List all tables
\dt

-- Describe users table
\d users

-- View all users
SELECT * FROM users;

-- View recent users
SELECT name, email, "createdAt"
FROM users
ORDER BY "createdAt" DESC
LIMIT 10;

-- Search for specific user
SELECT * FROM users WHERE email LIKE '%gmail%';

-- Count users
SELECT COUNT(*) FROM users;

-- Exit the shell
\q
```

## Method 2: Database GUI Tools

### Option A: DBeaver (Recommended - Free)

1. **Download**: https://dbeaver.io/download/
2. **Install** DBeaver Community Edition
3. **Connect**:
   - Click "New Database Connection"
   - Select "PostgreSQL"
   - Enter connection details:
     ```
     Host: localhost
     Port: 5432
     Database: nextpay
     Username: postgres
     Password: postgres
     ```
   - Click "Test Connection"
   - Click "Finish"

4. **Browse Data**:
   - Navigate to: nextpay → Schemas → public → Tables
   - Right-click "users" → View Data

### Option B: pgAdmin (Web-based)

Run pgAdmin in Docker:

```bash
docker run -d \
  --name pgadmin \
  -p 5050:80 \
  -e PGADMIN_DEFAULT_EMAIL=admin@admin.com \
  -e PGADMIN_DEFAULT_PASSWORD=admin \
  --network nextpay_nextpay-network \
  dpage/pgadmin4
```

Then:

1. Open: http://localhost:5050
2. Login with:
   - Email: admin@admin.com
   - Password: admin
3. Add Server:
   - Right-click "Servers" → Register → Server
   - General tab: Name = "NextPay"
   - Connection tab:
     - Host: nextpay-db (Docker container name)
     - Port: 5432
     - Database: nextpay
     - Username: postgres
     - Password: postgres
   - Save

### Option C: TablePlus (Mac - Paid but has free trial)

1. **Download**: https://tableplus.com/
2. **Create Connection**:
   - Click "Create a new connection"
   - Select PostgreSQL
   - Enter:
     ```
     Name: NextPay
     Host: localhost
     Port: 5432
     User: postgres
     Password: postgres
     Database: nextpay
     ```
   - Click "Test" then "Connect"

### Option D: VS Code Extension

Install "PostgreSQL" extension by Chris Kolkman:

1. Open VS Code Extensions (Cmd+Shift+X)
2. Search for "PostgreSQL"
3. Install the extension
4. Click the PostgreSQL icon in sidebar
5. Add connection:
   - Host: localhost
   - User: postgres
   - Password: postgres
   - Port: 5432
   - Database: nextpay

## Method 3: Direct Connection String

You can use this connection string in any PostgreSQL client:

```
postgresql://postgres:postgres@localhost:5432/nextpay
```

## Method 4: From Your Application (Backend)

Check database from your NestJS backend:

```typescript
// Add this temporary endpoint in any controller
@Get('debug/users')
async debugUsers() {
  return this.usersRepository.find();
}
```

Then visit: http://localhost:3001/api/debug/users

## Useful SQL Queries

### User Management:

```sql
-- View all users with full details
SELECT * FROM users;

-- Count total users
SELECT COUNT(*) FROM users;

-- Count by plan
SELECT plan, COUNT(*) as count
FROM users
GROUP BY plan;

-- Find users by role
SELECT name, email, role
FROM users
WHERE role = 'admin';

-- Recent signups
SELECT name, email, "createdAt"
FROM users
ORDER BY "createdAt" DESC
LIMIT 5;

-- Search by email
SELECT * FROM users
WHERE email LIKE '%@gmail.com';

-- Active users only
SELECT name, email, plan
FROM users
WHERE "isActive" = true;
```

### Update Operations:

```sql
-- Upgrade user plan
UPDATE users
SET plan = 'pro'
WHERE email = 'sachin7368kr@gmail.com';

-- Make user admin
UPDATE users
SET role = 'admin'
WHERE email = 'sachin7368kr@gmail.com';

-- Deactivate user
UPDATE users
SET "isActive" = false
WHERE email = 'user@example.com';
```

### Delete Operations:

```sql
-- Delete specific user
DELETE FROM users
WHERE email = 'test@example.com';

-- Clear all test users (BE CAREFUL!)
DELETE FROM users
WHERE email LIKE '%test%';
```

## Database Backup & Restore

### Backup:

```bash
# Backup entire database
docker compose exec -T db pg_dump -U postgres nextpay > backup.sql

# Backup only users table
docker compose exec -T db pg_dump -U postgres -t users nextpay > users_backup.sql
```

### Restore:

```bash
# Restore from backup
docker compose exec -T db psql -U postgres nextpay < backup.sql
```

## Database Statistics

```bash
# Check database size
docker compose exec -T db psql -U postgres -d nextpay -c "SELECT pg_size_pretty(pg_database_size('nextpay'));"

# Check table sizes
docker compose exec -T db psql -U postgres -d nextpay -c "SELECT
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables
WHERE schemaname = 'public';"
```

## Docker Container Management

### Check if database is running:

```bash
docker ps | grep nextpay-db
```

### View database logs:

```bash
docker compose logs db

# Follow logs in real-time
docker compose logs -f db
```

### Restart database:

```bash
docker compose restart db
```

### Stop database:

```bash
docker compose stop db
```

### Start database:

```bash
docker compose start db
```

### Access container shell:

```bash
docker compose exec db bash
```

## Troubleshooting

### Can't connect to database:

```bash
# Check if container is running
docker ps | grep nextpay-db

# Check if port 5432 is open
lsof -i:5432

# View database logs for errors
docker compose logs db
```

### Reset database (WARNING: Deletes all data):

```bash
# Stop and remove database
docker compose down -v

# Start fresh
docker compose up -d db

# Wait for database to initialize
sleep 10

# Restart backend to recreate tables
# The backend will auto-create tables using TypeORM
```

## Quick Reference

### Your Current User Data:

```
ID:     94a469ef-c8c4-4f60-b546-3217fd4b2191
Name:   Sachin Kumar
Email:  sachin7368kr@gmail.com
Plan:   free
Role:   user
Status: Active
```

### View Your User:

```bash
docker compose exec -T db psql -U postgres -d nextpay -c "SELECT * FROM users WHERE id = '94a469ef-c8c4-4f60-b546-3217fd4b2191';"
```

### Make Yourself Admin:

```bash
docker compose exec -T db psql -U postgres -d nextpay -c "UPDATE users SET role = 'admin' WHERE email = 'sachin7368kr@gmail.com';"
```

### Upgrade Your Plan:

```bash
docker compose exec -T db psql -U postgres -d nextpay -c "UPDATE users SET plan = 'pro' WHERE email = 'sachin7368kr@gmail.com';"
```

## Security Note

⚠️ **Production Warning**:

- Change default password: `postgres:postgres`
- Use environment variables for credentials
- Enable SSL connections
- Restrict database access
- Regular backups
- Use strong passwords

For production, update your `.env` files with secure credentials!
