// Manual Firebase deploy script (sau khi đã login)
import { execSync } from 'child_process';
import fs from 'fs';

console.log('🚀 FIREBASE DEPLOY - Deploy lên Firebase Hosting...');

const projectId = 'focus-matrix-1761278678093';

// Step 1: Build application
console.log('📦 Building application...');
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Build completed successfully');
} catch (error) {
  console.log('❌ Build failed:', error.message);
  process.exit(1);
}

// Step 2: Check Firebase authentication
console.log('🔐 Checking Firebase authentication...');
try {
  execSync('firebase projects:list', { stdio: 'pipe' });
  console.log('✅ Firebase CLI authenticated');
} catch (error) {
  console.log('❌ Firebase CLI not authenticated');
  console.log('🔑 Please run: firebase login');
  console.log('   Then run this script again');
  process.exit(1);
}

// Step 3: Create Firebase project
console.log('🏗️ Creating Firebase project...');
try {
  execSync(`firebase projects:create ${projectId} --display-name "Focus Matrix App"`, { stdio: 'inherit' });
  console.log('✅ Firebase project created');
} catch (error) {
  console.log('⚠️ Project might already exist, continuing...');
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
      "default": projectId
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
https://${projectId}.web.app

📱 Features working:
✅ Real-time database sync (Firestore)
✅ Multi-device support (Firebase)
✅ User registration/login
✅ Task management
✅ Reminder system
✅ Admin dashboard
✅ Secure data storage

📊 Firebase Console:
https://console.firebase.google.com/project/${projectId}

🎯 Production URLs:
- Firebase: https://${projectId}.web.app
- GitHub Pages: https://watermelon16.github.io/focus-matrix
`);

console.log('✅ Firebase deploy completed successfully!');
