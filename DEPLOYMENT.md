# OwnerPulse Deployment Guide

## 🚀 Deployment Architecture

**Frontend:** Vercel (React/Refine)  
**Backend:** Render (NestJS API) - Free tier!
**Database:** Supabase (PostgreSQL)
**Auth:** Auth0

## 📋 Step-by-Step Deployment

### Step 1: Setup Supabase Database

1. **Get your Supabase connection details:**
   - Go to your Supabase project dashboard
   - Navigate to Settings → Database
   - Copy the connection string or individual values:
     ```
     Host: db.your-project.supabase.co
     Port: 5432
     Database: postgres
     Username: postgres
     Password: [your-password]
     ```

2. **Test connection locally:**
   ```bash
   cd backend
   # Update your .env with Supabase details
   npm run start:dev
   ```

### Step 2: Deploy Backend to Render

1. **First, push your code to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/OwnerPulse.git
   git push -u origin main
   ```

2. **Deploy to Render:**
   - Go to [render.com](https://render.com) and sign up
   - Connect your GitHub repository
   - Create new "Web Service"
   - **Repository:** Your GitHub repo
   - **Root Directory:** `backend`
   - **Build Command:** `npm install && npm run build`  
   - **Start Command:** `npm run start:prod`

3. **Set environment variables in Render dashboard:**
   ```
   NODE_ENV=production
   PORT=10000
   DB_HOST=db.your-project.supabase.co
   DB_PORT=5432
   DB_USERNAME=postgres
   DB_PASSWORD=your-supabase-password
   DB_NAME=postgres
   JWT_SECRET=your-secure-jwt-secret
   AUTH0_DOMAIN=your-domain.auth0.com
   AUTH0_AUDIENCE=your-api-audience
   ```

4. **Get your Render backend URL:**
   - Example: `https://your-app.onrender.com`

### Step 3: Deploy Frontend to Vercel

1. **Update frontend environment variables:**
   ```bash
   cd frontend
   # Create .env.production (copy from .env.example)
   ```

2. **Set production API URL:**
   ```env
   VITE_API_URL=https://your-backend.railway.app/api
   VITE_API_BASE_URL=https://your-backend.railway.app/api
   
   # Auth0 production settings
   VITE_AUTH0_DOMAIN=your-domain.auth0.com
   VITE_AUTH0_CLIENT_ID=your-client-id
   VITE_AUTH0_AUDIENCE=https://your-backend.railway.app/api
   VITE_AUTH0_REDIRECT_URI=https://your-frontend.vercel.app
   ```

3. **Deploy to Vercel:**
   ```bash
   npm install -g vercel
   cd frontend
   vercel --prod
   ```

### Step 4: Configure Auth0 for Production

1. **Update Auth0 Application Settings:**
   - **Allowed Callback URLs:** `https://your-frontend.vercel.app`
   - **Allowed Logout URLs:** `https://your-frontend.vercel.app`
   - **Allowed Web Origins:** `https://your-frontend.vercel.app`

2. **Update Auth0 API Settings:**
   - **Identifier:** `https://your-backend.railway.app/api`

## 🔧 Alternative Deployment Options

### Backend Deployment Options

#### Option A: Render (FREE! ⭐ Recommended)
- ✅ 750 hours/month free tier
- ✅ Auto-deploy from GitHub
- ✅ Built-in monitoring
- ✅ Custom domains
```bash
# Just push to GitHub and deploy via Render dashboard
git push origin main
```

#### Option B: Render (Free tier available)
- ✅ Free tier for basic usage
- ✅ Auto-deploy from Git
```yaml
# render.yaml
services:
  - type: web
    name: ownerpulse-api
    env: node
    buildCommand: npm install && npm run build
    startCommand: npm run start:prod
```

#### Option C: Fly.io (Free tier)
- ✅ Free tier for small apps
- ✅ Great performance
```dockerfile
# Add to backend/Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
CMD ["npm", "run", "start:prod"]
```

### Frontend Deployment Options

#### Option A: Vercel (Recommended)
- ✅ Perfect for React/Vite
- ✅ Automatic deployments
- ✅ Built-in CDN
```bash
vercel --prod
```

#### Option B: Netlify
- ✅ Great alternative to Vercel
- ✅ Easy custom domains
```bash
npm run build
# Upload dist folder to Netlify
```

## 💾 Database Migration

Your current entities will automatically create tables in Supabase since you have `synchronize: true` in development.

**For production, run migrations:**
```bash
# Generate migration
npm run typeorm:generate -- -n InitialMigration

# Run migration
npm run typeorm:migrate
```

## 🔒 Security Checklist

- [ ] Update JWT_SECRET to a secure random string
- [ ] Set NODE_ENV=production
- [ ] Configure Auth0 production URLs
- [ ] Enable CORS for your frontend domain
- [ ] Set up SSL (automatic with Railway/Vercel)

## 🚀 Quick Deploy Commands

```bash
# Backend (Render) 
npm run deploy:backend

# Frontend (Vercel)

# Frontend (Vercel)  
cd frontend
vercel --prod
```

## 📊 Monitoring & Logs

**Railway:** Built-in logs and monitoring
**Vercel:** Function logs and analytics
**Supabase:** Database monitoring and logs

## 💰 Cost Breakdown (Monthly)

- **Render:** FREE! (backend)
- **Vercel:** FREE! (frontend)  
- **Supabase:** FREE! (database)
- **Auth0:** FREE! (auth)
- **Total:** $0/month! 🎉

## 🚨 Common Issues

1. **CORS errors:** Update backend CORS configuration
2. **Auth0 redirect errors:** Check callback URLs
3. **Database connection:** Verify Supabase credentials
4. **Build failures:** Check TypeScript errors
