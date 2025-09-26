#!/bin/bash

# OwnerPulse Deployment Script

set -e  # Exit on any error

echo "🚀 Starting OwnerPulse deployment..."

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check required tools
echo "📋 Checking required tools..."

if ! command_exists railway; then
    echo "❌ Railway CLI not found. Installing..."
    npm install -g @railway/cli
fi

if ! command_exists vercel; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Build and test locally first
echo "🔨 Building backend..."
cd backend
npm run build

echo "🔨 Building frontend..."
cd ../frontend
npm run build

echo "✅ Local builds successful!"

# Deploy backend
echo "🚀 Deploying backend to Railway..."
cd ../backend

# Initialize Railway project if not exists
if [ ! -f railway.json ]; then
    echo "Initializing Railway project..."
    railway init
fi

# Deploy backend
railway up

echo "✅ Backend deployed!"

# Get Railway URL (you'll need to set this manually)
echo "📝 Please update your Railway URL in frontend/.env.production"
echo "   Example: VITE_API_URL=https://your-app.railway.app/api"

# Deploy frontend
echo "🚀 Deploying frontend to Vercel..."
cd ../frontend

# Deploy to Vercel
vercel --prod

echo "✅ Frontend deployed!"

echo "🎉 Deployment complete!"
echo ""
echo "📋 Next steps:"
echo "1. Update Auth0 callback URLs with your new frontend URL"
echo "2. Update Railway environment variables with Supabase credentials"
echo "3. Test your deployed application"
echo ""
echo "🔗 Check your deployments:"
echo "   Backend: https://railway.app/dashboard"
echo "   Frontend: https://vercel.com/dashboard"
