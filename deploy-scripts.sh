#!/bin/bash

# Focus Matrix - Deploy Scripts
# Chạy script này để deploy ứng dụng

echo "🚀 Focus Matrix - Deploy Scripts"
echo "================================"

# Kiểm tra Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js chưa được cài đặt. Vui lòng cài đặt Node.js 18+"
    exit 1
fi

# Kiểm tra npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm chưa được cài đặt"
    exit 1
fi

echo "✅ Node.js và npm đã sẵn sàng"

# Cài đặt dependencies
echo "📦 Đang cài đặt dependencies..."
npm install

# Build ứng dụng
echo "🔨 Đang build ứng dụng..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build thành công!"
else
    echo "❌ Build thất bại!"
    exit 1
fi

echo ""
echo "🎯 Chọn phương thức deploy:"
echo "1. Vercel (Recommended)"
echo "2. Netlify"
echo "3. GitHub Pages"
echo "4. Firebase Hosting"
echo "5. Chỉ build (không deploy)"

read -p "Nhập lựa chọn (1-5): " choice

case $choice in
    1)
        echo "🚀 Deploy lên Vercel..."
        if command -v vercel &> /dev/null; then
            vercel --prod
        else
            echo "❌ Vercel CLI chưa được cài đặt"
            echo "Cài đặt: npm i -g vercel"
            echo "Hoặc deploy qua Vercel Dashboard: https://vercel.com"
        fi
        ;;
    2)
        echo "🚀 Deploy lên Netlify..."
        if command -v netlify &> /dev/null; then
            netlify deploy --prod --dir=dist
        else
            echo "❌ Netlify CLI chưa được cài đặt"
            echo "Cài đặt: npm i -g netlify-cli"
            echo "Hoặc deploy qua Netlify Dashboard: https://netlify.com"
        fi
        ;;
    3)
        echo "🚀 Deploy lên GitHub Pages..."
        npm run deploy
        ;;
    4)
        echo "🚀 Deploy lên Firebase..."
        if command -v firebase &> /dev/null; then
            firebase deploy
        else
            echo "❌ Firebase CLI chưa được cài đặt"
            echo "Cài đặt: npm i -g firebase-tools"
        fi
        ;;
    5)
        echo "✅ Build hoàn tất! Files trong thư mục dist/"
        echo "Bạn có thể upload thư mục dist/ lên bất kỳ hosting nào"
        ;;
    *)
        echo "❌ Lựa chọn không hợp lệ"
        exit 1
        ;;
esac

echo ""
echo "🎉 Hoàn tất!"
echo "📱 Ứng dụng đã sẵn sàng để sử dụng"
echo "📖 Xem README.md để biết thêm chi tiết"
