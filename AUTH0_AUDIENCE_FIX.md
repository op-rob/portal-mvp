# Auth0 Audience Mismatch Fix

## Problem
Frontend and backend have different Auth0 audience URLs:
- Frontend: `https://portal-mvp-aops.onrender.com/api`
- Backend:  `https://ownerpulse-api.onrender.com/api`

## Solution Options

### Option 1: Update Backend Environment Variable (Recommended)
Update Render backend service environment:
```
AUTH0_AUDIENCE = https://portal-mvp-aops.onrender.com/api
```

### Option 2: Update Frontend Environment Variable  
Update Vercel frontend environment:
```
VITE_AUTH0_AUDIENCE = https://ownerpulse-api.onrender.com/api
```

### Option 3: Update Auth0 API Resource
In Auth0 Dashboard:
1. Go to Applications > APIs
2. Find your OwnerPulse API
3. Update the Identifier to match one of the URLs above

## Current Status
- ✅ CORS is working (getting 401 instead of CORS error)
- ❌ JWT audience validation failing
- ❌ Need to align audience URLs between frontend/backend

## Next Steps
1. Confirm actual backend URL
2. Update either frontend or backend environment variable
3. Ensure Auth0 API resource matches
4. Test authentication
