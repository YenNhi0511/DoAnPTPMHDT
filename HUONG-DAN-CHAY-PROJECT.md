# 🚀 Hướng Dẫn Chạy Project - GoodCV

## 📋 Các File Script

### 1. `START-PROJECT-COMPLETE.bat` ⭐ (KHUYẾN NGHỊ)
**Chạy TẤT CẢ services (Backend + 3 Frontend roles)**

- ✅ Tự động kiểm tra và cài đặt dependencies
- ✅ Tự động chạy migrations
- ✅ Khởi động Backend (Port 8000)
- ✅ Khởi động Frontend Admin (Port 3003)
- ✅ Khởi động Frontend Recruiter (Port 3002)
- ✅ Khởi động Frontend Candidate (Port 3001)
- ✅ Khởi động Celery Worker (nếu Redis đang chạy)

**Cách dùng:**
```bash
Double-click: START-PROJECT-COMPLETE.bat
```

### 2. `START-PROJECT-SIMPLE.bat`
**Chạy Backend + 1 Frontend (Port 3000)**

- ✅ Tự động setup và khởi động
- ✅ Chỉ chạy 1 frontend (port 3000)

**Cách dùng:**
```bash
Double-click: START-PROJECT-SIMPLE.bat
```

### 3. `STOP-ALL-SERVICES.bat`
**Dừng TẤT CẢ services**

- ✅ Dừng Backend
- ✅ Dừng tất cả Frontend
- ✅ Dừng Celery

**Cách dùng:**
```bash
Double-click: STOP-ALL-SERVICES.bat
```

### 4. `CHECK-PROJECT-STATUS.bat`
**Kiểm tra trạng thái project**

- ✅ Kiểm tra Python, Node.js
- ✅ Kiểm tra dependencies
- ✅ Kiểm tra services đang chạy

**Cách dùng:**
```bash
Double-click: CHECK-PROJECT-STATUS.bat
```

---

## 🎯 Hướng Dẫn Sử Dụng

### Bước 1: Lần đầu setup (chỉ cần làm 1 lần)

1. **Cài đặt Python 3.10+**
   - Download: https://www.python.org/downloads/
   - ✅ Check "Add Python to PATH" khi cài đặt

2. **Cài đặt Node.js 18+**
   - Download: https://nodejs.org/
   - ✅ Cài đặt phiên bản LTS

3. **Cài đặt PostgreSQL** (hoặc dùng Neon/Supabase online)
   - Local: https://www.postgresql.org/download/
   - Online: https://neon.tech hoặc https://supabase.com

### Bước 2: Chạy project

**Cách 1: Chạy tất cả (KHUYẾN NGHỊ)**
```
Double-click: START-PROJECT-COMPLETE.bat
```

**Cách 2: Chạy đơn giản (1 frontend)**
```
Double-click: START-PROJECT-SIMPLE.bat
```

### Bước 3: Truy cập

Sau khi chạy script, mở trình duyệt:

- **Backend API**: http://localhost:8000
- **Admin Panel**: http://localhost:3003
- **Recruiter**: http://localhost:3002
- **Candidate**: http://localhost:3001

**Tài khoản Admin:**
- Email: `admin@goodcv.com`
- Password: `admin123`

---

## 🔧 Troubleshooting

### Lỗi: "Python không được tìm thấy"
**Giải pháp:**
1. Cài đặt Python 3.10+
2. ✅ Check "Add Python to PATH"
3. Restart terminal/command prompt

### Lỗi: "Node.js không được tìm thấy"
**Giải pháp:**
1. Cài đặt Node.js 18+ (LTS)
2. Restart terminal/command prompt

### Lỗi: "Port đã được sử dụng"
**Giải pháp:**
1. Chạy `STOP-ALL-SERVICES.bat` để dừng tất cả
2. Hoặc đổi port trong file `.env` và `package.json`

### Lỗi: "Database connection failed"
**Giải pháp:**
1. Kiểm tra PostgreSQL đang chạy
2. Kiểm tra file `backend/.env` có đúng thông tin database không
3. Chạy `python backend/fix-env-file.py` để sửa cấu hình

### Lỗi: "Email không gửi được"
**Giải pháp:**
1. Kiểm tra file `backend/.env` có cấu hình email đúng không
2. Chạy `python backend/fix-env-file.py` để sửa
3. Xem hướng dẫn: `backend/HUONG-DAN-CAU-HINH-EMAIL.md`

---

## 📝 Checklist Trước Khi Chạy

- [ ] Python 3.10+ đã cài đặt
- [ ] Node.js 18+ đã cài đặt
- [ ] PostgreSQL đã setup (hoặc dùng online)
- [ ] File `backend/.env` đã được tạo và cấu hình
- [ ] Database connection string đúng

---

## 🎯 Kết Quả Mong Đợi

Sau khi chạy `START-PROJECT-COMPLETE.bat`:

1. ✅ Backend chạy trên port 8000
2. ✅ Frontend Admin chạy trên port 3003
3. ✅ Frontend Recruiter chạy trên port 3002
4. ✅ Frontend Candidate chạy trên port 3001
5. ✅ Các cửa sổ terminal mở riêng cho mỗi service

**Lưu ý:**
- Backend cần vài giây để khởi động hoàn toàn
- Đợi backend khởi động xong trước khi test frontend
- Để dừng tất cả, chạy `STOP-ALL-SERVICES.bat` hoặc đóng các cửa sổ terminal

---

## 💡 Tips

1. **Lần đầu chạy**: Script sẽ tự động cài đặt dependencies (có thể mất vài phút)
2. **Lần sau**: Chỉ cần double-click script là chạy ngay
3. **Kiểm tra status**: Dùng `CHECK-PROJECT-STATUS.bat` để xem services nào đang chạy
4. **Dừng services**: Dùng `STOP-ALL-SERVICES.bat` để dừng tất cả

---

## 🆘 Cần Giúp Đỡ?

1. Chạy `CHECK-PROJECT-STATUS.bat` để kiểm tra
2. Xem log trong các cửa sổ terminal
3. Kiểm tra file `backend/.env` có đúng không
4. Xem các file hướng dẫn trong thư mục `backend/`
