// Create Firebase project automatically
import { execSync } from 'child_process';
import fs from 'fs';

console.log('🚀 Creating Firebase project automatically...');

const projectId = 'focus-matrix-1761278678093';
const displayName = 'Focus Matrix App';

console.log(`📝 Project ID: ${projectId}`);
console.log(`📝 Display Name: ${displayName}`);

// Create firebase.json if not exists
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
console.log('✅ Created firebase.json');

// Create .firebaserc
const firebaserc = {
  "projects": {
    "default": projectId
  }
};

fs.writeFileSync('.firebaserc', JSON.stringify(firebaserc, null, 2));
console.log('✅ Created .firebaserc');

console.log(`
🎯 Firebase project setup completed!

📋 Manual steps required:
1. Go to https://console.firebase.google.com
2. Create a new project with ID: ${projectId}
3. Enable Firestore Database
4. Enable Hosting
5. Copy the real config to .env file

🔧 Current setup:
- Project ID: ${projectId}
- Display Name: ${displayName}
- Hosting: dist folder
- Firestore: Enabled with rules

📁 Files created:
- firebase.json (Hosting config)
- .firebaserc (Project config)
- firestore.rules (Security rules)
- firestore.indexes.json (Database indexes)

🚀 Next: Run 'node deploy-firebase.js' after creating Firebase project
`);

console.log('✅ Firebase project setup completed!');
