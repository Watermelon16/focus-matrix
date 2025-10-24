// Update Firebase config script
import fs from 'fs';

console.log('🔧 Cập nhật Firebase config...');

console.log(`
📋 Hướng dẫn lấy Firebase config:

1. Vào https://console.firebase.google.com
2. Chọn project bạn vừa tạo
3. Vào Project Settings (⚙️) → General → Your apps
4. Click "Add app" → Web app (</>)
5. Copy config và paste vào đây

🔧 Sau khi có config, chạy:
node update-firebase-config.js

📝 Config cần thiết:
- apiKey
- authDomain  
- projectId
- storageBucket
- messagingSenderId
- appId
`);

// Template .env file
const envTemplate = `# Firebase Configuration (Thay thế bằng config thực từ Firebase Console)
VITE_FIREBASE_API_KEY=your-api-key-here
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123

# Google OAuth (for Drive sync)
VITE_GOOGLE_CLIENT_ID=your-google-client-id
`;

fs.writeFileSync('.env', envTemplate);
console.log('✅ Created .env template');
console.log('📝 Please update .env with your real Firebase config');
console.log('🚀 Then run: node deploy-firebase-now.js');
