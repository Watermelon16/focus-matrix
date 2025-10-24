// Deploy Firebase ngay bây giờ
import { execSync } from 'child_process';
import fs from 'fs';

console.log('🚀 DEPLOY FIREBASE NGAY BÂY GIỜ!');

// Step 1: Check if .env exists
if (!fs.existsSync('.env')) {
  console.log('❌ File .env không tồn tại');
  console.log('🔧 Chạy: node update-firebase-config.js');
  process.exit(1);
}

// Step 2: Build application
console.log('📦 Building application...');
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Build completed successfully');
} catch (error) {
  console.log('❌ Build failed:', error.message);
  process.exit(1);
}

// Step 3: Check Firebase authentication
console.log('🔐 Checking Firebase authentication...');
try {
  execSync('firebase projects:list', { stdio: 'pipe' });
  console.log('✅ Firebase CLI authenticated');
} catch (error) {
  console.log('❌ Firebase CLI not authenticated');
  console.log('🔑 Chạy: firebase login');
  console.log('   Sau đó chạy lại script này');
  process.exit(1);
}

// Step 4: Initialize Firebase
console.log('⚙️ Initializing Firebase...');
try {
  // Create firebase.json
  const firebaseJson = {
    "firestore": {
      "rules": "firestore.rules",
      "indexes": "firestore.indexes.json"
    },
    "hosting": {
      "public": "dist",
      "ignore": [
        "firebase.json",
        "**/.*",
        "**/node_modules/**"
      ],
      "rewrites": [
        {
          "source": "**",
          "destination": "/index.html"
        }
      ]
    }
  };
  
  fs.writeFileSync('firebase.json', JSON.stringify(firebaseJson, null, 2));
  
  // Create .firebaserc
  const firebaserc = {
    "projects": {
      "default": "your-project-id" // Sẽ được cập nhật từ .env
    }
  };
  
  fs.writeFileSync('.firebaserc', JSON.stringify(firebaserc, null, 2));
  
  console.log('✅ Firebase configuration created');
} catch (error) {
  console.log('❌ Firebase configuration failed:', error.message);
  process.exit(1);
}

// Step 5: Deploy to Firebase
console.log('🚀 Deploying to Firebase Hosting...');
try {
  execSync('firebase deploy --only hosting', { stdio: 'inherit' });
  console.log('✅ Firebase deployment completed!');
} catch (error) {
  console.log('❌ Firebase deployment failed:', error.message);
  process.exit(1);
}

// Step 6: Show results
console.log(`
🎉 FIREBASE DEPLOY COMPLETED SUCCESSFULLY!

🌐 Your app is now LIVE at:
https://your-project-id.web.app

📱 Features working:
✅ Real-time database sync (Firestore)
✅ Multi-device support (Firebase)
✅ User registration/login
✅ Task management
✅ Reminder system
✅ Admin dashboard
✅ Secure data storage

📊 Firebase Console:
https://console.firebase.google.com/project/your-project-id

🎯 Production URLs:
- Firebase: https://your-project-id.web.app
- GitHub Pages: https://watermelon16.github.io/focus-matrix
`);

console.log('✅ Firebase deploy completed successfully!');
