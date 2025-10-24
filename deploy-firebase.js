// Firebase deployment script
import { execSync } from 'child_process';
import fs from 'fs';

console.log('🚀 Deploying Focus Matrix to Firebase Hosting...');

// Check if Firebase is initialized
try {
  const firebaseJson = JSON.parse(fs.readFileSync('firebase.json', 'utf8'));
  console.log('✅ Firebase config found');
} catch (error) {
  console.log('❌ Firebase not initialized. Please run: firebase init');
  process.exit(1);
}

// Build the application
console.log('📦 Building application...');
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Build completed');
} catch (error) {
  console.log('❌ Build failed');
  process.exit(1);
}

// Deploy to Firebase
console.log('🚀 Deploying to Firebase...');
try {
  execSync('firebase deploy --only hosting', { stdio: 'inherit' });
  console.log('✅ Deployment completed!');
} catch (error) {
  console.log('❌ Deployment failed');
  process.exit(1);
}

console.log(`
🎉 Deployment completed successfully!

📱 Your app is now live at:
https://focus-matrix-1761278678093.web.app

🔧 Features:
- Real-time database sync
- Multi-device support
- Secure user data
- Admin dashboard
- Task management
- Reminder system

📊 Next steps:
1. Test the live app
2. Share with users
3. Monitor usage in Firebase Console
4. Scale as needed

🎯 Firebase Console:
https://console.firebase.google.com/project/focus-matrix-1761278678093
`);

console.log('✅ Firebase deployment script completed!');
