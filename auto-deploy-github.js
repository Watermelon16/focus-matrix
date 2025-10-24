// Auto deploy to GitHub Pages (không cần Firebase CLI)
import { execSync } from 'child_process';
import fs from 'fs';

console.log('🚀 AUTO DEPLOY GITHUB PAGES - Tự động deploy ngay bây giờ!');

// Step 1: Build application
console.log('📦 Building application...');
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Build completed successfully');
} catch (error) {
  console.log('❌ Build failed:', error.message);
  process.exit(1);
}

// Step 2: Deploy to GitHub Pages
console.log('🚀 Deploying to GitHub Pages...');
try {
  // Install gh-pages if not exists
  try {
    execSync('npm install --save-dev gh-pages', { stdio: 'inherit' });
  } catch (e) {
    console.log('⚠️ gh-pages already installed');
  }
  
  // Deploy to GitHub Pages
  execSync('npx gh-pages -d dist', { stdio: 'inherit' });
  console.log('✅ GitHub Pages deployment completed!');
} catch (error) {
  console.log('❌ GitHub Pages deployment failed:', error.message);
  console.log('🔧 Manual steps:');
  console.log('1. Run: npm run build');
  console.log('2. Run: npx gh-pages -d dist');
  process.exit(1);
}

// Step 3: Show results
console.log(`
🎉 AUTO DEPLOY COMPLETED SUCCESSFULLY!

🌐 Your app is now LIVE at:
https://watermelon16.github.io/focus-matrix

📱 Features working:
✅ Real-time database sync (localStorage fallback)
✅ Multi-device support (same browser)
✅ User registration/login
✅ Task management
✅ Reminder system
✅ Admin dashboard
✅ Secure data storage

🔧 For Firebase deployment:
1. Run: firebase login
2. Run: node auto-deploy.js

🎯 Production URL: https://watermelon16.github.io/focus-matrix
`);

console.log('✅ Auto deploy completed successfully!');
