// Firebase login script
import { execSync } from 'child_process';

console.log('🔐 FIREBASE LOGIN - Đăng nhập Firebase...');

console.log(`
🔑 Hướng dẫn đăng nhập Firebase:

1. Chạy lệnh: firebase login
2. Mở trình duyệt và đăng nhập Google
3. Quay lại terminal và nhấn Enter
4. Chạy: node deploy-firebase-real.js

🚀 Hoặc chạy trực tiếp:
firebase login && node deploy-firebase-real.js
`);

try {
  console.log('🔑 Đang mở Firebase login...');
  execSync('firebase login', { stdio: 'inherit' });
  console.log('✅ Firebase login completed successfully!');
  console.log('🚀 Now you can run: node deploy-firebase-real.js');
} catch (error) {
  console.log('❌ Firebase login failed:', error.message);
  console.log('🔧 Manual steps:');
  console.log('1. Run: firebase login');
  console.log('2. Complete login in browser');
  console.log('3. Run: node deploy-firebase-real.js');
}
