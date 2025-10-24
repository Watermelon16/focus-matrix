// Quick deploy script for Firebase Hosting
import { execSync } from 'child_process';
import fs from 'fs';

console.log('🚀 Quick Deploy to Firebase Hosting...');

// Check if dist folder exists
if (!fs.existsSync('dist')) {
  console.log('📦 Building application...');
  try {
    execSync('npm run build', { stdio: 'inherit' });
    console.log('✅ Build completed');
  } catch (error) {
    console.log('❌ Build failed');
    process.exit(1);
  }
}

// Check if Firebase is configured
if (!fs.existsSync('firebase.json')) {
  console.log('❌ Firebase not configured. Please run: node create-firebase-project.js');
  process.exit(1);
}

console.log(`
🎯 Ready to deploy!

📋 Before deploying, make sure you have:
1. Created Firebase project: focus-matrix-1761278678093
2. Enabled Firestore Database
3. Enabled Hosting
4. Updated .env with real Firebase config

🚀 To deploy manually:
1. firebase login
2. firebase deploy --only hosting

🌐 Your app will be available at:
https://focus-matrix-1761278678093.web.app

📊 Firebase Console:
https://console.firebase.google.com/project/focus-matrix-1761278678093
`);

console.log('✅ Quick deploy script completed!');
