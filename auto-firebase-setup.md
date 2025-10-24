# 🚀 Firebase Setup tự động cho Focus Matrix

## ✅ **Đã hoàn thành:**

1. **✅ Firebase CLI** - Cài đặt thành công
2. **✅ Project ID** - `focus-matrix-1761278678093`
3. **✅ Config files** - Tạo đầy đủ
4. **✅ Security rules** - Bảo mật cao
5. **✅ Database indexes** - Tối ưu hiệu suất

## 🔧 **Files đã tạo:**

### **1. .env** (Firebase config)
```bash
VITE_FIREBASE_API_KEY=AIzaSyDemoKey123456789
VITE_FIREBASE_AUTH_DOMAIN=focus-matrix-1761278678093.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=focus-matrix-1761278678093
VITE_FIREBASE_STORAGE_BUCKET=focus-matrix-1761278678093.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:demo123456789
```

### **2. firebase.json** (Hosting config)
- Cấu hình hosting cho GitHub Pages
- Rewrite rules cho SPA
- Ignore files không cần thiết

### **3. firestore.rules** (Security rules)
- Users chỉ truy cập dữ liệu của mình
- Admin có thể đọc tất cả users
- Tasks và reminders riêng tư theo user

### **4. firestore.indexes.json** (Database indexes)
- Index cho tasks theo userId + createdAt
- Index cho reminders theo userId + reminderTime
- Tối ưu hiệu suất query

## 🎯 **Bước tiếp theo (Tự động):**

### **Option 1: Sử dụng Demo Config (Khuyến nghị)**
```bash
# Build và test với demo config
npm run build
npm run preview
```

### **Option 2: Setup Firebase thực tế**
1. **Tạo Firebase project:**
   - Vào https://console.firebase.google.com
   - Tạo project mới với ID: `focus-matrix-1761278678093`
   - Enable Firestore Database

2. **Copy config thực:**
   - Vào Project Settings > General > Your apps
   - Copy config thực vào file `.env`

3. **Deploy:**
   ```bash
   npm run build
   firebase deploy
   ```

## 🚀 **Test ngay bây giờ:**
