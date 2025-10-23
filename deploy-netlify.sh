#!/bin/bash

# Focus Matrix - Deploy to Netlify
echo "🚀 Deploying Focus Matrix to Netlify..."

# Check if Netlify CLI is installed
if ! command -v netlify &> /dev/null; then
    echo "❌ Netlify CLI not found. Installing..."
    npm install -g netlify-cli
fi

# Check if user is logged in
if ! netlify status &> /dev/null; then
    echo "🔐 Please login to Netlify..."
    netlify login
fi

# Build project
echo "📦 Building project..."
npm run build

# Deploy to Netlify
echo "🚀 Deploying..."
netlify deploy --prod --dir=dist

echo "✅ Deploy complete!"
echo "🌐 Your app is live at: https://your-app.netlify.app"
echo "📝 Don't forget to set VITE_GOOGLE_CLIENT_ID in Netlify dashboard"
