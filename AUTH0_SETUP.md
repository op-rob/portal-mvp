# Auth0 Integration Setup Guide

This guide walks you through setting up Auth0 authentication for OwnerPulse.

## 🔧 Prerequisites

- Auth0 account (free tier works fine)
- Node.js 18+
- OwnerPulse project cloned and dependencies installed

## 📋 Step-by-Step Setup

### 1. Create Auth0 Application

1. Log in to [Auth0 Dashboard](https://manage.auth0.com/)
2. Go to **Applications** → **Create Application**
3. Choose **Single Page Application**
4. Name it "OwnerPulse" and click **Create**

### 2. Configure Auth0 Application

In your new application settings:

**Allowed Callback URLs:**
```
http://localhost:3000
```

**Allowed Logout URLs:**
```
http://localhost:3000
```

**Allowed Web Origins:**
```
http://localhost:3000
```

**Allowed Origins (CORS):**
```
http://localhost:3000
```

### 3. Create Auth0 API

1. Go to **APIs** → **Create API**
2. Name: "OwnerPulse API"
3. Identifier: `https://api.ownerpulse.com` (this becomes your audience)
4. Signing Algorithm: **RS256**
5. Click **Create**

### 4. Configure Environment Variables

**Backend (.env):**
```bash
# Copy from .env.example
cp backend/.env.example backend/.env

# Edit backend/.env with your Auth0 details:
AUTH0_DOMAIN=your-domain.auth0.com
AUTH0_AUDIENCE=https://api.ownerpulse.com
AUTH0_CLIENT_ID=your-app-client-id
AUTH0_CLIENT_SECRET=your-app-client-secret

# Database (for local development)
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_NAME=ownerpulse
```

**Frontend (.env):**
```bash
# Copy from .env.example
cp frontend/.env.example frontend/.env

# Edit frontend/.env with your Auth0 details:
VITE_AUTH0_DOMAIN=your-domain.auth0.com
VITE_AUTH0_CLIENT_ID=your-app-client-id
VITE_AUTH0_AUDIENCE=https://api.ownerpulse.com
VITE_API_URL=http://localhost:3001/api
```

### 5. Find Your Auth0 Credentials

**Domain & Client ID:**
- Go to Applications → OwnerPulse → Settings
- Copy **Domain** (e.g., `dev-abc123.us.auth0.com`)
- Copy **Client ID**

**API Audience:**
- Go to APIs → OwnerPulse API → Settings  
- Copy **Identifier** (the audience you set)

## 🚀 Testing the Integration

### 1. Start the Development Environment

**Option A: Docker (Recommended)**
```bash
npm run docker:up
```

**Option B: Local Development**
```bash
# Start PostgreSQL (if not using Docker)
# Then start both services:
npm run dev
```

### 2. Test Authentication Flow

1. Navigate to http://localhost:3000
2. You should see the OwnerPulse login page
3. Click "Sign in with Auth0"
4. Complete Auth0 authentication
5. You should be redirected back to the properties dashboard

### 3. Test API Integration

After logging in, check the browser network tab:
- API calls to `/api/properties` should include `Authorization: Bearer <jwt-token>` headers
- The backend should validate JWT tokens and create/find users automatically

## 🔐 Advanced Configuration

### Custom User Claims (Optional)

To add custom roles and permissions to JWT tokens:

1. Go to **Auth0 Dashboard** → **Actions** → **Flows** → **Login**
2. Create a new action with this code:

```javascript
exports.onExecutePostLogin = async (event, api) => {
  const namespace = 'https://ownerpulse.com/';
  
  // Add custom claims to the token
  api.idToken.setCustomClaim(`${namespace}roles`, ['owner']);
  api.accessToken.setCustomClaim(`${namespace}roles`, ['owner']);
  api.accessToken.setCustomClaim(`${namespace}permissions`, ['read:properties', 'write:properties']);
};
```

3. Add the action to your Login flow

### User Management

The backend automatically creates user records when someone first logs in via Auth0. The user data comes from the JWT token and includes:
- Auth0 user ID
- Email
- Name
- Profile picture

## 🐛 Troubleshooting

### Common Issues:

**1. CORS Errors**
- Check that `http://localhost:3000` is in "Allowed Web Origins" in Auth0
- Verify FRONTEND_URL in backend .env

**2. JWT Validation Errors**  
- Ensure AUTH0_DOMAIN and AUTH0_AUDIENCE match exactly
- Check that your API is using RS256 signing

**3. Environment Variables Not Loading**
- File names must be exactly `.env` (not `.env.local` or similar)
- Restart the development servers after changing .env files

**4. Auth0 Redirect Loop**
- Check callback URLs in Auth0 settings
- Clear browser cache/localStorage

**5. API Authorization Errors**
- Check network tab for JWT tokens in request headers
- Verify token hasn't expired (default 24h)

### Debug Tips:

```bash
# Check if environment variables are loaded
echo $AUTH0_DOMAIN  # backend
echo $VITE_AUTH0_DOMAIN  # frontend

# View backend logs
docker-compose logs -f backend

# View JWT token contents (decode on jwt.io)
```

## 📊 Production Deployment

For production deployment:

1. **Update Auth0 URLs** to production domains
2. **Use environment-specific .env files**
3. **Enable Auth0 custom domains** (optional)
4. **Set up proper CORS policies**
5. **Configure Auth0 rules for user metadata**

## 🆘 Support

If you encounter issues:

1. Check the Auth0 logs in the dashboard
2. Review backend/frontend console logs  
3. Verify all environment variables are set correctly
4. Test JWT tokens at [jwt.io](https://jwt.io)

## 🔗 Resources

- [Auth0 React SDK Documentation](https://auth0.com/docs/libraries/auth0-react)
- [Auth0 Node.js API Documentation](https://auth0.com/docs/quickstart/backend/nodejs)
- [JWT.io Token Debugger](https://jwt.io)
- [Auth0 Dashboard](https://manage.auth0.com/)