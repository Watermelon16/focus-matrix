// Debug white screen script
import { execSync } from 'child_process';
import fs from 'fs';

console.log('🔍 DEBUG WHITE SCREEN - Kiểm tra lỗi web trắng...');

// Step 1: Check if .env exists
console.log('📁 Checking .env file...');
if (fs.existsSync('.env')) {
  console.log('✅ .env file exists');
  const envContent = fs.readFileSync('.env', 'utf8');
  console.log('📝 .env content:');
  console.log(envContent);
} else {
  console.log('❌ .env file not found');
}

// Step 2: Check if dist folder exists
console.log('📁 Checking dist folder...');
if (fs.existsSync('dist')) {
  console.log('✅ dist folder exists');
  const files = fs.readdirSync('dist');
  console.log('📝 dist files:', files);
} else {
  console.log('❌ dist folder not found');
}

// Step 3: Check index.html
console.log('📁 Checking index.html...');
if (fs.existsSync('dist/index.html')) {
  console.log('✅ index.html exists');
  const htmlContent = fs.readFileSync('dist/index.html', 'utf8');
  console.log('📝 index.html content:');
  console.log(htmlContent);
} else {
  console.log('❌ index.html not found');
}

// Step 4: Check for JavaScript errors
console.log('📁 Checking JavaScript files...');
if (fs.existsSync('dist/assets')) {
  const assets = fs.readdirSync('dist/assets');
  console.log('📝 JavaScript files:', assets);
} else {
  console.log('❌ assets folder not found');
}

// Step 5: Test build
console.log('📦 Testing build...');
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Build successful');
} catch (error) {
  console.log('❌ Build failed:', error.message);
}

console.log(`
🔧 Possible fixes:

1. Check browser console for errors
2. Check if Firebase config is correct
3. Check if all dependencies are installed
4. Try clearing browser cache
5. Check if .env file has correct values

🌐 Test URLs:
- GitHub Pages: https://watermelon16.github.io/focus-matrix
- Local dev: http://localhost:5173
`);

console.log('✅ Debug completed!');
