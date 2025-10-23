#!/bin/bash

# Focus Matrix - Deploy to GitHub Pages
echo "🚀 Deploying Focus Matrix to GitHub Pages..."

# Build project
echo "📦 Building project..."
npm run build

# Deploy to GitHub Pages
echo "🚀 Deploying to GitHub Pages..."
npm run deploy

echo "✅ Deploy complete!"
echo "🌐 Your app is live at: https://YOUR_USERNAME.github.io/YOUR_REPO"
echo "📝 Don't forget to set VITE_GOOGLE_CLIENT_ID in GitHub Secrets"
