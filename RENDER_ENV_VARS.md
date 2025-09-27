# Render Environment Variables for OwnerPulse Backend

Copy and paste these environment variables into your Render service:

## Required Environment Variables

```bash
# Application
NODE_ENV=production
PORT=10000

# Database (Supabase)
# Replace with your actual Supabase values:
DB_HOST=db.your-project-id.supabase.co
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your-supabase-password
DB_NAME=postgres

# JWT Secret (generate a secure random string)
JWT_SECRET=your-super-secure-jwt-secret-at-least-32-characters

# Auth0 (replace with your actual Auth0 values)
AUTH0_DOMAIN=your-domain.auth0.com  
AUTH0_AUDIENCE=https://your-backend-url.onrender.com/api

# Optional: Supabase API (if needed for direct API calls)
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-role-key
```

## Supabase Connection Format

Your Supabase database connection details should look like:
- **Host:** `db.abcdefghijklmnop.supabase.co` (replace with your project ID)
- **Port:** `5432`
- **Database:** `postgres`  
- **Username:** `postgres`
- **Password:** (your database password from Supabase)

## Auth0 Audience Note

The AUTH0_AUDIENCE should be your backend API URL once deployed. You can:
1. Set it temporarily to: `https://ownerpulse-api.onrender.com/api`
2. Update it after Render gives you the actual URL

## JWT Secret Generation

Generate a secure JWT secret (32+ characters):
```bash
# Example secure JWT secret:
JWT_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6
```

Or use online generator: https://generate-secret.vercel.app/32
