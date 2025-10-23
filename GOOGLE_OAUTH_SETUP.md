# 🔐 Hướng dẫn chi tiết thiết lập Google OAuth

## 📋 Bước 1: Truy cập Google Cloud Console

1. **Mở trình duyệt** → truy cập: [console.cloud.google.com](https://console.cloud.google.com)
2. **Đăng nhập** bằng tài khoản Google
3. **Chọn project** hoặc **tạo project mới**:
   - Click **"Select a project"** (góc trên bên trái)
   - Click **"New Project"**
   - **Project name**: `Focus Matrix`
   - **Organization**: Chọn organization (nếu có)
   - Click **"Create"**

## ⚙️ Bước 2: Enable Google Drive API

1. **Vào "APIs & Services"** → **"Library"**
2. **Tìm kiếm**: "Google Drive API"
3. **Click "Google Drive API"**
4. **Click "Enable"**

## 🔑 Bước 3: Tạo OAuth 2.0 Client ID

1. **Vào "APIs & Services"** → **"Credentials"**
2. **Click "Create Credentials"** → **"OAuth 2.0 Client IDs"**
3. **Application type**: Chọn **"Web application"**
4. **Name**: `Focus Matrix`
5. **Authorized JavaScript origins**:
   ```
   https://watermelon16.github.io
   http://localhost:3000
   http://localhost:5173
   ```
6. **Authorized redirect URIs**:
   ```
   https://watermelon16.github.io
   http://localhost:3000
   http://localhost:5173
   ```
7. **Click "Create"**

## 📋 Bước 4: Copy Client ID

1. **Sau khi tạo** → hiển thị popup với thông tin
2. **Copy "Client ID"** (dạng: `123456789-abcdefg.apps.googleusercontent.com`)
3. **Lưu lại** để dùng cho bước tiếp theo

## 🔐 Bước 5: Thêm Secret vào GitHub

1. **Truy cập**: https://github.com/Watermelon16/focus-matrix
2. **Click tab "Settings"** (gần cuối menu)
3. **Scroll xuống** → tìm **"Secrets and variables"** → **"Actions"**
4. **Click "New repository secret"**
5. **Name**: `VITE_GOOGLE_CLIENT_ID`
6. **Secret**: Dán **Client ID** đã copy ở bước 4
7. **Click "Add secret"**

## 🚀 Bước 6: Kích hoạt GitHub Pages

1. **Vào tab "Settings"** trên GitHub
2. **Scroll xuống** → tìm **"Pages"** (sidebar trái)
3. **Source**: Chọn **"GitHub Actions"**
4. **Save**

## ⏳ Bước 7: Chờ Deploy

1. **Vào tab "Actions"** trên GitHub
2. **Xem workflow** "Deploy to GitHub Pages" đang chạy
3. **Chờ 2-3 phút** → workflow hoàn thành
4. **Vào tab "Settings"** → **"Pages"**
5. **Xem URL**: `https://watermelon16.github.io/focus-matrix`

## ✅ Bước 8: Test Ứng dụng

1. **Mở URL**: `https://watermelon16.github.io/focus-matrix`
2. **Test Google Login**:
   - Click **"Đăng nhập để bắt đầu"**
   - Chọn tài khoản Google
   - Cho phép quyền truy cập
3. **Test tạo Team**:
   - Click **"Hồ sơ"** → **"Quản lý nhóm"**
   - Tạo team mới
   - Mời thành viên bằng email
4. **Test Drive sync**:
   - Tạo task mới
   - Kiểm tra dữ liệu được lưu trên Google Drive

## 🔧 Troubleshooting

### **Lỗi "This app isn't verified"**
- **Giải pháp**: Click **"Advanced"** → **"Go to Focus Matrix (unsafe)"**
- **Lý do**: App chưa được Google verify (bình thường với app cá nhân)

### **Lỗi "redirect_uri_mismatch"**
- **Kiểm tra**: Authorized redirect URIs trong Google Cloud Console
- **Đảm bảo**: URL chính xác `https://watermelon16.github.io/focus-matrix`

### **Lỗi Build Failed**
- **Kiểm tra**: GitHub Secret `VITE_GOOGLE_CLIENT_ID` đã được thêm
- **Xem log**: Tab "Actions" → click vào workflow failed

### **Lỗi "Drive API not enabled"**
- **Giải pháp**: Enable Google Drive API trong Google Cloud Console
- **Bước**: APIs & Services → Library → Google Drive API → Enable

## 🎉 Kết quả cuối cùng

Sau khi hoàn thành, bạn sẽ có:
- ✅ **Live URL**: `https://watermelon16.github.io/focus-matrix`
- ✅ **Google OAuth**: Đăng nhập bằng Gmail
- ✅ **Drive Sync**: Lưu trữ trên Google Drive
- ✅ **Team Management**: Quản lý nhóm
- ✅ **E2EE Security**: Mã hóa end-to-end
- ✅ **PWA**: Cài đặt như app mobile

**Tất cả 100% miễn phí! 🆓**
