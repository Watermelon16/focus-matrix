#!/bin/bash

echo "🆓 Focus Matrix - Free Deploy Options"
echo "=================================="

echo "📋 Choose your free hosting:"
echo "1. GitHub Pages (100% Free)"
echo "2. Netlify (100% Free)" 
echo "3. Vercel (100% Free)"
echo "4. Firebase Hosting (100% Free)"

read -p "Enter choice (1-4): " choice

case $choice in
    1)
        echo "🚀 Deploying to GitHub Pages..."
        echo "1. Push code to GitHub"
        echo "2. Go to Settings → Pages"
        echo "3. Source: GitHub Actions"
        echo "4. Add secret: VITE_GOOGLE_CLIENT_ID"
        echo "✅ Auto deploy on every push"
        ;;
    2)
        echo "🚀 Deploying to Netlify..."
        echo "1. Go to netlify.com"
        echo "2. New site from Git"
        echo "3. Connect GitHub repository"
        echo "4. Build settings: Auto-detect"
        echo "5. Add environment variable: VITE_GOOGLE_CLIENT_ID"
        ;;
    3)
        echo "🚀 Deploying to Vercel..."
        echo "1. Go to vercel.com"
        echo "2. Import Project from GitHub"
        echo "3. Add environment variable: VITE_GOOGLE_CLIENT_ID"
        echo "4. Deploy"
        ;;
    4)
        echo "🚀 Deploying to Firebase..."
        echo "1. Install Firebase CLI: npm install -g firebase-tools"
        echo "2. Login: firebase login"
        echo "3. Init: firebase init hosting"
        echo "4. Build: npm run build"
        echo "5. Deploy: firebase deploy"
        ;;
    *)
        echo "❌ Invalid choice"
        exit 1
        ;;
esac

echo ""
echo "🎉 All options are 100% FREE!"
echo "📱 Your app will be live and accessible worldwide"
echo "🔒 With Google OAuth + Drive sync + E2EE encryption"
