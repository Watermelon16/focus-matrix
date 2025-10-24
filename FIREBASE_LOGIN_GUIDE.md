# 🔐 Hướng dẫn đăng nhập Firebase CLI

## 🎯 **Cách 1: Đăng nhập trực tiếp (Khuyến nghị)**

### **Bước 1: Mở Command Prompt hoặc PowerShell**
- Nhấn `Windows + R`
- Gõ `cmd` hoặc `powershell`
- Nhấn Enter

### **Bước 2: Chuyển đến thư mục project**
```bash
cd "G:\0. LINH TINH\VIBE CODING\To-do-list Focus"
```

### **Bước 3: Đăng nhập Firebase**
```bash
firebase login
```

### **Bước 4: Làm theo hướng dẫn**
1. **Mở trình duyệt** - Firebase sẽ tự động mở trình duyệt
2. **Đăng nhập Google** - Sử dụng tài khoản Google của bạn
3. **Cho phép truy cập** - Click "Allow" để cho phép Firebase CLI truy cập
4. **Quay lại terminal** - Nhấn Enter trong terminal
5. **Hoàn thành** - Sẽ thấy "Success! Logged in as [your-email]"

## 🎯 **Cách 2: Đăng nhập với token (Nếu cách 1 không được)**

### **Bước 1: Tạo token**
```bash
firebase login:ci
```

### **Bước 2: Làm theo hướng dẫn**
1. Mở trình duyệt
2. Đăng nhập Google
3. Copy token
4. Paste vào terminal

## 🎯 **Cách 3: Sử dụng script tự động**

### **Chạy script:**
```bash
node firebase-login-now.js
```

## 🔧 **Troubleshooting:**

### **Nếu lỗi "firebase not found":**
```bash
npm install -g firebase-tools
```

### **Nếu lỗi "permission denied":**
```bash
# Chạy PowerShell as Administrator
# Hoặc sử dụng:
npm install -g firebase-tools --force
```

### **Nếu lỗi "network":**
- Kiểm tra kết nối internet
- Thử lại sau vài phút

## ✅ **Kiểm tra đăng nhập:**

### **Sau khi đăng nhập thành công:**
```bash
firebase projects:list
```

### **Kết quả mong đợi:**
```
┌─────────────────────────────────────┬──────────────────────┬──────────────────────┐
│ Project Display Name                │ Project ID           │ Resource Location   │
├─────────────────────────────────────┼──────────────────────┼──────────────────────┤
│ Focus Matrix App                    │ focus-matrix-97161  │ us-central1         │
└─────────────────────────────────────┴──────────────────────┴──────────────────────┘
```

## 🚀 **Sau khi đăng nhập thành công:**

### **Deploy ngay:**
```bash
node deploy-firebase-real.js
```

### **Hoặc deploy thủ công:**
```bash
firebase deploy --only hosting
```

## 🎯 **Kết quả:**

### **✅ Sau khi deploy:**
- **URL:** https://focus-matrix-97161.web.app
- **Database:** Firestore (real-time)
- **Sync:** Multi-device

---

**🔐 Hãy thử đăng nhập Firebase CLI và cho tôi biết kết quả!**
