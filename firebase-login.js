// Firebase login script
import { execSync } from 'child_process';

console.log('🔐 Firebase Login - Đăng nhập Firebase...');

try {
  console.log('🔑 Opening Firebase login...');
  console.log('📱 Please complete login in your browser');
  
  // Run firebase login
  execSync('firebase login', { stdio: 'inherit' });
  
  console.log('✅ Firebase login completed successfully!');
  console.log('🚀 Now you can run: node auto-deploy.js');
  
} catch (error) {
  console.log('❌ Firebase login failed:', error.message);
  console.log('🔧 Manual steps:');
  console.log('1. Run: firebase login');
  console.log('2. Complete login in browser');
  console.log('3. Run: node auto-deploy.js');
}
