# 🚀 Cấu hình GitHub Pages cho Focus Matrix

## ✅ Bước 1: Code đã được push thành công!
Repository: https://github.com/Watermelon16/focus-matrix.git

## ⚙️ Bước 2: Cấu hình GitHub Pages

1. **Truy cập**: https://github.com/Watermelon16/focus-matrix
2. **Click tab "Settings"** (gần cuối menu)
3. **Scroll xuống** → tìm **"Pages"** (sidebar trái)
4. **Source**: Chọn **"GitHub Actions"**
5. **Save** → GitHub sẽ tự động tạo workflow

## 🔐 Bước 3: Thêm Google OAuth Secret

1. **Vào Settings** → **"Secrets and variables"** → **"Actions"**
2. **Click "New repository secret"**
3. **Name**: `VITE_GOOGLE_CLIENT_ID`
4. **Secret**: `YOUR_GOOGLE_CLIENT_ID` (từ Google Cloud Console)
5. **Click "Add secret"**

## 🌐 Bước 4: Lấy Google OAuth Client ID

1. **Truy cập**: [console.cloud.google.com](https://console.cloud.google.com)
2. **Tạo project mới** (nếu chưa có)
3. **APIs & Services** → **"Credentials"**
4. **Click "Create Credentials"** → **"OAuth 2.0 Client IDs"**
5. **Application type**: **"Web application"**
6. **Name**: Focus Matrix
7. **Authorized origins**: 
   - `https://watermelon16.github.io`
   - `http://localhost:3000` (cho dev)
8. **Authorized redirect URIs**:
   - `https://watermelon16.github.io`
   - `http://localhost:3000` (cho dev)
9. **Click "Create"**
10. **Copy Client ID** → dán vào GitHub Secret

## 🚀 Bước 5: Deploy

1. **Vào tab "Actions"** trên GitHub
2. **Xem workflow** "Deploy to GitHub Pages" đang chạy
3. **Chờ 2-3 phút** → workflow hoàn thành
4. **Vào tab "Settings"** → **"Pages"**
5. **Xem URL**: `https://watermelon16.github.io/focus-matrix`

## ✅ Bước 6: Test Ứng dụng

1. **Mở URL**: `https://watermelon16.github.io/focus-matrix`
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
- ✅ **Live URL**: `https://watermelon16.github.io/focus-matrix`
- ✅ **Auto Deploy**: Mỗi lần push code
- ✅ **Google OAuth**: Đăng nhập bằng Gmail
- ✅ **Drive Sync**: Lưu trữ trên Google Drive
- ✅ **Team Management**: Quản lý nhóm
- ✅ **E2EE Security**: Mã hóa end-to-end
- ✅ **PWA**: Cài đặt như app mobile

**Tất cả 100% miễn phí! 🆓**
