# 🚀 Hướng dẫn Deploy GitHub Pages - Focus Matrix

## 📋 Bước 1: Tạo Repository trên GitHub

1. **Truy cập**: [github.com](https://github.com)
2. **Đăng nhập** vào tài khoản GitHub
3. **Click "New repository"** (nút xanh lá)
4. **Repository name**: `focus-matrix` (hoặc tên bạn muốn)
5. **Description**: "Multi-user task management with Google Drive sync"
6. **Public** (để deploy miễn phí)
7. **Click "Create repository"**

## 📤 Bước 2: Push Code lên GitHub

```bash
# Thêm remote repository (thay YOUR_USERNAME và YOUR_REPO)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git

# Push code lên GitHub
git branch -M main
git push -u origin main
```

## ⚙️ Bước 3: Cấu hình GitHub Pages

1. **Vào repository** vừa tạo trên GitHub
2. **Click tab "Settings"** (gần cuối menu)
3. **Scroll xuống** → tìm **"Pages"** (sidebar trái)
4. **Source**: Chọn **"GitHub Actions"**
5. **Save** → GitHub sẽ tự động tạo workflow

## 🔐 Bước 4: Thêm Google OAuth Secret

1. **Vào Settings** → **"Secrets and variables"** → **"Actions"**
2. **Click "New repository secret"**
3. **Name**: `VITE_GOOGLE_CLIENT_ID`
4. **Secret**: `YOUR_GOOGLE_CLIENT_ID` (từ Google Cloud Console)
5. **Click "Add secret"**

## 🌐 Bước 5: Lấy Google OAuth Client ID

1. **Truy cập**: [console.cloud.google.com](https://console.cloud.google.com)
2. **Tạo project mới** (nếu chưa có)
3. **APIs & Services** → **"Credentials"**
4. **Click "Create Credentials"** → **"OAuth 2.0 Client IDs"**
5. **Application type**: **"Web application"**
6. **Name**: Focus Matrix
7. **Authorized origins**: 
   - `https://YOUR_USERNAME.github.io`
   - `http://localhost:3000` (cho dev)
8. **Authorized redirect URIs**:
   - `https://YOUR_USERNAME.github.io`
   - `http://localhost:3000` (cho dev)
9. **Click "Create"**
10. **Copy Client ID** → dán vào GitHub Secret

## 🚀 Bước 6: Deploy

1. **Push code** (nếu chưa push):
```bash
git add .
git commit -m "Add GitHub Pages deployment"
git push origin main
```

2. **Vào tab "Actions"** trên GitHub
3. **Xem workflow** "Deploy to GitHub Pages" đang chạy
4. **Chờ 2-3 phút** → workflow hoàn thành
5. **Vào tab "Settings"** → **"Pages"**
6. **Xem URL**: `https://YOUR_USERNAME.github.io/YOUR_REPO`

## ✅ Bước 7: Test Ứng dụng

1. **Mở URL** vừa nhận được
2. **Test Google Login** (cần Client ID đúng)
3. **Test tạo Team** và mời thành viên
4. **Test Drive sync** với dữ liệu mã hóa

## 🔧 Troubleshooting

### **Lỗi Build Failed**
- Kiểm tra `VITE_GOOGLE_CLIENT_ID` secret
- Xem log trong tab "Actions"

### **Google OAuth Error**
- Kiểm tra Authorized origins/redirect URIs
- Đảm bảo URL đúng với GitHub Pages

### **Drive API Error**
- Cần enable Google Drive API
- Kiểm tra OAuth scopes

## 🎉 Kết quả

Sau khi hoàn thành, bạn sẽ có:
- ✅ **Live URL**: `https://YOUR_USERNAME.github.io/YOUR_REPO`
- ✅ **Auto Deploy**: Mỗi lần push code
- ✅ **Google OAuth**: Đăng nhập bằng Gmail
- ✅ **Drive Sync**: Lưu trữ trên Google Drive
- ✅ **Team Management**: Quản lý nhóm
- ✅ **E2EE Security**: Mã hóa end-to-end
- ✅ **PWA**: Cài đặt như app mobile

**Tất cả 100% miễn phí! 🆓**
