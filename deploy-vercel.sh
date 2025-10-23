#!/bin/bash

# Focus Matrix - Deploy to Vercel
echo "🚀 Deploying Focus Matrix to Vercel..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Check if user is logged in
if ! vercel whoami &> /dev/null; then
    echo "🔐 Please login to Vercel..."
    vercel login
fi

# Build project
echo "📦 Building project..."
npm run build

# Deploy to Vercel
echo "🚀 Deploying..."
vercel --prod

echo "✅ Deploy complete!"
echo "🌐 Your app is live at: https://your-app.vercel.app"
echo "📝 Don't forget to set VITE_GOOGLE_CLIENT_ID in Vercel dashboard"
