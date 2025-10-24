# Nơi lưu trữ dữ liệu trong Focus Matrix

## 📍 **Hiện tại (Demo)**

### 1. **Dữ liệu người dùng**
- **Vị trí**: Trong bộ nhớ trình duyệt (RAM)
- **Cách hoạt động**: 
  - `mockUsers[]` - Danh sách người dùng
  - `mockTasks[userId]` - Công việc theo từng user
  - `mockReminders[userId]` - Lời nhắc theo từng user
- **Đặc điểm**: 
  - ✅ Nhanh chóng
  - ❌ Mất dữ liệu khi tắt trình duyệt
  - ❌ Không đồng bộ giữa các thiết bị

### 2. **Thông tin đăng nhập**
- **Vị trí**: `localStorage` của trình duyệt
- **Cách hoạt động**: Lưu thông tin user đang đăng nhập
- **Đặc điểm**:
  - ✅ Lưu trữ lâu dài
  - ❌ Chỉ trên 1 thiết bị
  - ❌ Không đồng bộ

## 🚀 **Tương lai (Production)**

### 1. **Dữ liệu cá nhân - Google Drive**
- **Vị trí**: Google Drive của từng người dùng
- **Bảo mật**: Mã hóa E2EE (End-to-End Encryption)
- **Cách hoạt động**:
  - Mỗi user có thư mục riêng trên Google Drive
  - Dữ liệu được mã hóa trước khi upload
  - Chỉ user đó mới giải mã được

### 2. **Dữ liệu hệ thống - Admin Drive**
- **Vị trí**: Google Drive của admin (`phuonglh43@gmail.com`)
- **Nội dung**: Danh sách người dùng, thống kê hệ thống
- **Bảo mật**: Mã hóa E2EE

### 3. **Backup & Restore**
- **Sao lưu**: Tự động lên Google Drive của user
- **Khôi phục**: Tải từ Google Drive về
- **Đồng bộ**: Real-time giữa các thiết bị

## 🔒 **Bảo mật dữ liệu**

### **Mã hóa E2EE**
- **Thuật toán**: AES-GCM 256-bit
- **Key derivation**: PBKDF2 với 100,000 iterations
- **Salt**: Random 16 bytes
- **IV**: Random 12 bytes cho mỗi record

### **Quyền truy cập**
- **Admin**: Chỉ thấy danh sách users, không đọc được nội dung cá nhân
- **User**: Chỉ truy cập dữ liệu của mình
- **Google**: Không thể đọc nội dung (đã mã hóa)

## 📊 **So sánh các phương án**

| Phương án | Ưu điểm | Nhược điểm | Phù hợp |
|-----------|---------|------------|---------|
| **Hiện tại (RAM)** | Nhanh, đơn giản | Mất dữ liệu | Demo |
| **IndexedDB** | Lưu trữ local | Không đồng bộ | PWA |
| **Google Drive** | Đồng bộ, bảo mật | Cần OAuth | Production |
| **Database** | Hiệu suất cao | Cần server | Enterprise |

## 🛠 **Triển khai Production**

### **Bước 1: OAuth Setup**
```bash
# Cấu hình Google OAuth
VITE_GOOGLE_CLIENT_ID=your-client-id
VITE_GOOGLE_DRIVE_SCOPE=https://www.googleapis.com/auth/drive.file
```

### **Bước 2: Mã hóa dữ liệu**
```typescript
// Trước khi upload lên Drive
const encryptedData = await vault.encryptRecord(userData);

// Sau khi download từ Drive  
const decryptedData = await vault.decryptRecord(encryptedData);
```

### **Bước 3: Đồng bộ tự động**
- **Real-time sync**: WebSocket hoặc Server-Sent Events
- **Conflict resolution**: Last-write-wins hoặc merge
- **Offline support**: Queue changes khi mất mạng

## 📱 **Truy cập dữ liệu**

### **Admin Dashboard**
- Xem danh sách users
- Thống kê hệ thống
- Quản lý quyền truy cập

### **User Profile**
- Sao lưu dữ liệu lên Drive
- Khôi phục từ Drive
- Đồng bộ giữa các thiết bị

### **Ma trận Eisenhower**
- Dữ liệu riêng tư của từng user
- Mã hóa trước khi lưu
- Không ai khác đọc được

---

**Lưu ý**: Phiên bản hiện tại là demo, dữ liệu sẽ mất khi tắt trình duyệt. Để sử dụng thực tế, cần triển khai Google Drive sync với mã hóa E2EE.
