# Focus Matrix - Deploy Scripts (PowerShell)
# Chạy script này để deploy ứng dụng

Write-Host "🚀 Focus Matrix - Deploy Scripts" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green

# Kiểm tra Node.js
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js $nodeVersion đã sẵn sàng" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js chưa được cài đặt. Vui lòng cài đặt Node.js 18+" -ForegroundColor Red
    exit 1
}

# Kiểm tra npm
try {
    $npmVersion = npm --version
    Write-Host "✅ npm $npmVersion đã sẵn sàng" -ForegroundColor Green
} catch {
    Write-Host "❌ npm chưa được cài đặt" -ForegroundColor Red
    exit 1
}

# Cài đặt dependencies
Write-Host "📦 Đang cài đặt dependencies..." -ForegroundColor Yellow
npm install

# Build ứng dụng
Write-Host "🔨 Đang build ứng dụng..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Build thành công!" -ForegroundColor Green
} else {
    Write-Host "❌ Build thất bại!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🎯 Chọn phương thức deploy:" -ForegroundColor Cyan
Write-Host "1. Vercel (Recommended)" -ForegroundColor White
Write-Host "2. Netlify" -ForegroundColor White
Write-Host "3. GitHub Pages" -ForegroundColor White
Write-Host "4. Firebase Hosting" -ForegroundColor White
Write-Host "5. Chỉ build (không deploy)" -ForegroundColor White

$choice = Read-Host "Nhập lựa chọn (1-5)"

switch ($choice) {
    "1" {
        Write-Host "🚀 Deploy lên Vercel..." -ForegroundColor Yellow
        try {
            vercel --prod
        } catch {
            Write-Host "❌ Vercel CLI chưa được cài đặt" -ForegroundColor Red
            Write-Host "Cài đặt: npm i -g vercel" -ForegroundColor Yellow
            Write-Host "Hoặc deploy qua Vercel Dashboard: https://vercel.com" -ForegroundColor Yellow
        }
    }
    "2" {
        Write-Host "🚀 Deploy lên Netlify..." -ForegroundColor Yellow
        try {
            netlify deploy --prod --dir=dist
        } catch {
            Write-Host "❌ Netlify CLI chưa được cài đặt" -ForegroundColor Red
            Write-Host "Cài đặt: npm i -g netlify-cli" -ForegroundColor Yellow
            Write-Host "Hoặc deploy qua Netlify Dashboard: https://netlify.com" -ForegroundColor Yellow
        }
    }
    "3" {
        Write-Host "🚀 Deploy lên GitHub Pages..." -ForegroundColor Yellow
        npm run deploy
    }
    "4" {
        Write-Host "🚀 Deploy lên Firebase..." -ForegroundColor Yellow
        try {
            firebase deploy
        } catch {
            Write-Host "❌ Firebase CLI chưa được cài đặt" -ForegroundColor Red
            Write-Host "Cài đặt: npm i -g firebase-tools" -ForegroundColor Yellow
        }
    }
    "5" {
        Write-Host "✅ Build hoàn tất! Files trong thư mục dist/" -ForegroundColor Green
        Write-Host "Bạn có thể upload thư mục dist/ lên bất kỳ hosting nào" -ForegroundColor Yellow
    }
    default {
        Write-Host "❌ Lựa chọn không hợp lệ" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "🎉 Hoàn tất!" -ForegroundColor Green
Write-Host "📱 Ứng dụng đã sẵn sàng để sử dụng" -ForegroundColor Green
Write-Host "📖 Xem README.md để biết thêm chi tiết" -ForegroundColor Yellow
