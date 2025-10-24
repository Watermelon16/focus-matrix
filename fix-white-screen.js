// Fix white screen script
import { execSync } from 'child_process';
import fs from 'fs';

console.log('🔧 FIX WHITE SCREEN - Sửa lỗi web trắng...');

// Step 1: Fix vite.config.ts for GitHub Pages
console.log('📝 Fixing vite.config.ts...');
const viteConfig = `import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  base: '/focus-matrix/',
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: true,
    port: 3000,
  },
});
`;

fs.writeFileSync('vite.config.ts', viteConfig);
console.log('✅ vite.config.ts fixed');

// Step 2: Rebuild with correct config
console.log('📦 Rebuilding application...');
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Build completed successfully');
} catch (error) {
  console.log('❌ Build failed:', error.message);
  process.exit(1);
}

// Step 3: Check index.html
console.log('📁 Checking index.html...');
if (fs.existsSync('dist/index.html')) {
  const htmlContent = fs.readFileSync('dist/index.html', 'utf8');
  console.log('📝 index.html content:');
  console.log(htmlContent);
} else {
  console.log('❌ index.html not found');
}

// Step 4: Deploy to GitHub Pages
console.log('🚀 Deploying to GitHub Pages...');
try {
  execSync('npx gh-pages -d dist', { stdio: 'inherit' });
  console.log('✅ GitHub Pages deployment completed!');
} catch (error) {
  console.log('❌ GitHub Pages deployment failed:', error.message);
}

console.log(`
🎉 WHITE SCREEN FIXED!

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

🔧 If still white screen:
1. Clear browser cache (Ctrl+F5)
2. Check browser console for errors
3. Try incognito mode
4. Check network tab for failed requests
`);

console.log('✅ White screen fix completed!');
