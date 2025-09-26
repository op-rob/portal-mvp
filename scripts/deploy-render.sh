#!/bin/bash

# Deploy OwnerPulse Backend to Render

set -e

echo "🚀 Deploying OwnerPulse backend to Render..."

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    echo "❌ Not in a git repository. Initializing..."
    git init
    git add .
    git commit -m "Initial commit for OwnerPulse"
fi

# Check if we have a remote
if ! git remote get-url origin > /dev/null 2>&1; then
    echo "📝 Please set up your GitHub repository first:"
    echo "   1. Create a new repository on GitHub"
    echo "   2. git remote add origin https://github.com/yourusername/OwnerPulse.git"
    echo "   3. git push -u origin main"
    echo ""
    echo "   Then run this script again."
    exit 1
fi

# Push latest changes
echo "📤 Pushing to GitHub..."
git add .
git commit -m "Deploy configuration for Render" || echo "No changes to commit"
git push

echo "✅ Code pushed to GitHub!"
echo ""
echo "🎯 Next steps:"
echo "1. Go to https://render.com and sign up"
echo "2. Connect your GitHub repository"
echo "3. Create a new Web Service"
echo "4. Use these settings:"
echo "   - Build Command: cd backend && npm install && npm run build"
echo "   - Start Command: cd backend && npm run start:prod"
echo "   - Root Directory: backend"
echo ""
echo "5. Add environment variables in Render dashboard:"
echo "   - NODE_ENV=production"
echo "   - PORT=10000"
echo "   - DB_HOST=your-supabase-host.supabase.co"
echo "   - DB_PORT=5432"
echo "   - DB_USERNAME=postgres"  
echo "   - DB_PASSWORD=your-supabase-password"
echo "   - DB_NAME=postgres"
echo "   - JWT_SECRET=your-secure-secret"
echo "   - AUTH0_DOMAIN=your-domain.auth0.com"
echo "   - AUTH0_AUDIENCE=your-audience"
echo ""
echo "📖 Full guide: https://render.com/docs/deploy-node-express-app"
