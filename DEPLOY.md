# 🚀 Hướng dẫn Deploy Focus Matrix

## 📋 Các bước chuẩn bị

### 1. Tạo repository trên GitHub
```bash
# Khởi tạo git repository
git init
git add .
git commit -m "Initial commit: Focus Matrix app"

# Thêm remote repository (thay YOUR_USERNAME và YOUR_REPO)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main
```

## 🌐 Deploy Options

### Option 1: Vercel (Recommended) ⭐

**Cách 1: Vercel CLI**
```bash
# Cài đặt Vercel CLI
npm i -g vercel

# Login và deploy
vercel login
vercel --prod
```

**Cách 2: Vercel Dashboard**
1. Truy cập [vercel.com](https://vercel.com)
2. Import project từ GitHub
3. Vercel sẽ tự động detect Vite và deploy

### Option 2: Netlify

**Cách 1: Netlify CLI**
```bash
# Cài đặt Netlify CLI
npm i -g netlify-cli

# Login và deploy
netlify login
netlify deploy --prod --dir=dist
```

**Cách 2: Netlify Dashboard**
1. Truy cập [netlify.com](https://netlify.com)
2. Drag & drop thư mục `dist/` vào Netlify
3. Hoặc connect GitHub repository

### Option 3: GitHub Pages

```bash
# Deploy lên GitHub Pages
npm run deploy
```

Sau khi chạy lệnh này, ứng dụng sẽ được deploy tại:
`https://YOUR_USERNAME.github.io/YOUR_REPO`

### Option 4: Firebase Hosting

```bash
# Cài đặt Firebase CLI
npm i -g firebase-tools

# Login và init
firebase login
firebase init hosting

# Deploy
firebase deploy
```

## 🔧 Cấu hình Environment Variables

Nếu cần cấu hình environment variables:

### Vercel
1. Vào project settings
2. Environment Variables
3. Thêm các biến cần thiết

### Netlify
1. Site settings
2. Environment variables
3. Thêm các biến cần thiết

## 📱 Custom Domain (Optional)

### Vercel
1. Project settings → Domains
2. Add domain
3. Cấu hình DNS records

### Netlify
1. Site settings → Domain management
2. Add custom domain
3. Cấu hình DNS records

## 🚀 Auto Deploy

### GitHub Actions (Vercel/Netlify)
- Tự động deploy khi push code lên main branch
- Không cần cấu hình thêm

### Manual Deploy
```bash
# Build và deploy
npm run build
npm run deploy  # Cho GitHub Pages
```

## 📊 Monitoring

### Vercel Analytics
- Tự động có analytics
- Xem traffic, performance

### Netlify Analytics
- Cần upgrade plan
- Xem traffic, form submissions

## 🔍 Troubleshooting

### Build Errors
```bash
# Kiểm tra lỗi build
npm run build

# Fix lỗi TypeScript
npm run lint
```

### Deploy Errors
- Kiểm tra file `vercel.json` hoặc `netlify.toml`
- Đảm bảo build command đúng
- Kiểm tra output directory

### Performance
- Optimize images
- Enable gzip compression
- Sử dụng CDN

## 📈 Performance Tips

1. **Code Splitting**: Đã được Vite tự động optimize
2. **Tree Shaking**: Loại bỏ code không dùng
3. **Minification**: Tự động minify CSS/JS
4. **Caching**: Cấu hình cache headers

## 🎯 Final Checklist

- [ ] Repository đã được tạo trên GitHub
- [ ] Code đã được push lên GitHub
- [ ] Build thành công (`npm run build`)
- [ ] Chọn platform deploy (Vercel/Netlify/GitHub Pages)
- [ ] Cấu hình domain (nếu cần)
- [ ] Test ứng dụng sau khi deploy
- [ ] Cấu hình analytics (nếu cần)

## 🌟 Kết quả

Sau khi deploy thành công, bạn sẽ có:
- ✅ Ứng dụng chạy online
- ✅ URL công khai để chia sẻ
- ✅ Auto deploy khi update code
- ✅ HTTPS tự động
- ✅ CDN global

**Chúc mừng! Focus Matrix đã sẵn sàng để sử dụng! 🎉**
