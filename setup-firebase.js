// Firebase setup script
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🚀 Setting up Firebase for Focus Matrix...');

// Generate unique project ID
const projectId = `focus-matrix-${Date.now()}`;
console.log(`📝 Project ID: ${projectId}`);

// Firebase configuration template
const firebaseConfig = {
  apiKey: "AIzaSyDemoKey123456789",
  authDomain: `${projectId}.firebaseapp.com`,
  projectId: projectId,
  storageBucket: `${projectId}.appspot.com`,
  messagingSenderId: "123456789",
  appId: "1:123456789:web:demo123456789"
};

// Create .env file
const envContent = `# Firebase Configuration (Demo)
VITE_FIREBASE_API_KEY=${firebaseConfig.apiKey}
VITE_FIREBASE_AUTH_DOMAIN=${firebaseConfig.authDomain}
VITE_FIREBASE_PROJECT_ID=${firebaseConfig.projectId}
VITE_FIREBASE_STORAGE_BUCKET=${firebaseConfig.storageBucket}
VITE_FIREBASE_MESSAGING_SENDER_ID=${firebaseConfig.messagingSenderId}
VITE_FIREBASE_APP_ID=${firebaseConfig.appId}

# Google OAuth (for Drive sync)
VITE_GOOGLE_CLIENT_ID=your-google-client-id
`;

// Write .env file
fs.writeFileSync('.env', envContent);
console.log('✅ Created .env file with Firebase config');

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
console.log('✅ Created firebase.json');

// Create Firestore rules
const firestoreRules = `
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Tasks are user-specific
    match /tasks/{taskId} {
      allow read, write: if request.auth != null && 
        resource.data.userId == request.auth.uid;
    }
    
    // Reminders are user-specific  
    match /reminders/{reminderId} {
      allow read, write: if request.auth != null && 
        resource.data.userId == request.auth.uid;
    }
    
    // Admin can read all users (for admin dashboard)
    match /users/{userId} {
      allow read: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
`;

fs.writeFileSync('firestore.rules', firestoreRules);
console.log('✅ Created Firestore security rules');

// Create Firestore indexes
const firestoreIndexes = {
  "indexes": [
    {
      "collectionGroup": "tasks",
      "queryScope": "COLLECTION",
      "fields": [
        {
          "fieldPath": "userId",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "createdAt",
          "order": "DESCENDING"
        }
      ]
    },
    {
      "collectionGroup": "reminders", 
      "queryScope": "COLLECTION",
      "fields": [
        {
          "fieldPath": "userId",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "reminderTime",
          "order": "ASCENDING"
        }
      ]
    }
  ],
  "fieldOverrides": []
};

fs.writeFileSync('firestore.indexes.json', JSON.stringify(firestoreIndexes, null, 2));
console.log('✅ Created Firestore indexes');

console.log(`
🎉 Firebase setup completed!

📋 Next steps:
1. Go to https://console.firebase.google.com
2. Create a new project with ID: ${projectId}
3. Enable Firestore Database
4. Copy the real config from Firebase Console to .env file
5. Run: npm run build && firebase deploy

🔧 Current config (Demo):
- Project ID: ${projectId}
- Auth Domain: ${firebaseConfig.authDomain}
- Storage Bucket: ${firebaseConfig.storageBucket}

📁 Files created:
- .env (Firebase config)
- firebase.json (Hosting config)
- firestore.rules (Security rules)
- firestore.indexes.json (Database indexes)
`);

console.log('✅ Firebase setup script completed!');
