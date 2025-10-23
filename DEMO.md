# 🎮 Focus Matrix - Demo Guide

## 🚀 Quick Start

### 1. Chạy ứng dụng
```bash
npm install
npm run dev
```

Mở trình duyệt tại: `http://localhost:3000`

### 2. Test các tính năng

## 📋 Test Cases

### ✅ Test 1: Thêm công việc cơ bản
1. Click "Thêm công việc"
2. Điền thông tin:
   - Tên: "Hoàn thành báo cáo"
   - Ghi chú: "Báo cáo tháng 12"
   - Hạn: Chọn ngày mai
   - Ưu tiên: 🔴 Khẩn cấp & Quan trọng
3. Click "Thêm"
4. ✅ Kiểm tra: Công việc xuất hiện trong ô đỏ

### ✅ Test 2: QuickAddTask
1. Trong ô 🟡 "Quan trọng nhưng không khẩn cấp"
2. Click "Thêm nhanh"
3. Điền: "Lập kế hoạch năm 2024"
4. Click "Thêm"
5. ✅ Kiểm tra: Công việc xuất hiện trong ô vàng

### ✅ Test 3: Đặt lời nhắc
1. Click menu ⋯ trên một công việc
2. Click "Đặt lời nhắc"
3. Chọn thời gian: Ngày mai 9:00
4. Email: test@example.com
5. Click "Đặt lời nhắc"
6. ✅ Kiểm tra: Lời nhắc xuất hiện trong sidebar

### ✅ Test 4: Import ICS
1. Click "Import ICS"
2. Upload file .ics (nếu có)
3. Chọn các sự kiện muốn import
4. Click "Nhập X sự kiện"
5. ✅ Kiểm tra: Các sự kiện xuất hiện trong ma trận

### ✅ Test 5: Quản lý công việc
1. Click checkbox để đánh dấu hoàn thành
2. ✅ Kiểm tra: Công việc bị gạch ngang
3. Click menu ⋯ → "Xóa"
4. ✅ Kiểm tra: Công việc biến mất

### ✅ Test 6: Thống kê
1. Thêm vài công việc với các trạng thái khác nhau
2. ✅ Kiểm tra sidebar:
   - Thống kê hôm nay
   - Tổng quan
   - Danh sách lời nhắc

### ✅ Test 7: Reset toàn bộ
1. Click "Reset toàn bộ" trong sidebar
2. Xác nhận "OK"
3. ✅ Kiểm tra: Tất cả công việc biến mất

## 🎨 UI/UX Testing

### ✅ Responsive Design
1. Test trên desktop (1920x1080)
2. Test trên tablet (768px)
3. Test trên mobile (375px)
4. ✅ Kiểm tra: Layout responsive, không bị vỡ

### ✅ Dark/Light Mode
1. Thay đổi theme của hệ thống
2. ✅ Kiểm tra: Ứng dụng tự động thay đổi theme

### ✅ Accessibility
1. Navigate bằng Tab key
2. Test với screen reader
3. ✅ Kiểm tra: Tất cả elements có thể focus được

## 🐛 Bug Testing

### Test Edge Cases
1. **Empty input**: Thử submit form trống
2. **Long text**: Nhập text rất dài
3. **Special characters**: Nhập ký tự đặc biệt
4. **Date picker**: Chọn ngày quá khứ
5. **File upload**: Upload file không phải .ics

### Performance Testing
1. Thêm 100+ công việc
2. ✅ Kiểm tra: Ứng dụng vẫn mượt mà
3. Test với network slow
4. ✅ Kiểm tra: Loading states hiển thị đúng

## 📱 Browser Testing

Test trên các browser:
- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)

## 🔧 Developer Tools

### Console Testing
1. Mở DevTools → Console
2. Thực hiện các action
3. ✅ Kiểm tra: Không có lỗi JavaScript

### Network Testing
1. DevTools → Network
2. Thực hiện các action
3. ✅ Kiểm tra: Không có request lỗi

### Performance Testing
1. DevTools → Lighthouse
2. Chạy audit
3. ✅ Kiểm tra: Score > 90

## 📊 Expected Results

### ✅ Functional Requirements
- [x] Ma trận Eisenhower hiển thị đúng 4 ô
- [x] Thêm/sửa/xóa công việc hoạt động
- [x] QuickAddTask có đầy đủ tính năng
- [x] Đặt lời nhắc với custom email
- [x] Quản lý reminders trong sidebar
- [x] Import ICS file
- [x] Reset toàn bộ với confirm
- [x] Icon đồng bộ cho tất cả priority

### ✅ Non-Functional Requirements
- [x] Responsive design
- [x] Fast loading (< 3s)
- [x] Smooth animations
- [x] Accessible
- [x] Cross-browser compatible
- [x] Mobile-friendly

## 🎯 Success Criteria

Ứng dụng được coi là thành công khi:
1. ✅ Tất cả test cases pass
2. ✅ Không có lỗi JavaScript
3. ✅ UI/UX mượt mà
4. ✅ Performance tốt
5. ✅ Responsive trên mọi device
6. ✅ Accessible cho mọi người

## 🚀 Ready for Production!

Khi tất cả test cases pass, ứng dụng đã sẵn sàng để:
- Deploy lên production
- Chia sẻ với người dùng
- Sử dụng trong thực tế

**Focus Matrix - Quản lý công việc thông minh! 🎉**
