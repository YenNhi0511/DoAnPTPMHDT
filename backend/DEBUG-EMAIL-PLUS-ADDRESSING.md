# 🔍 Debug: Email Plus Addressing Không Nhận Được

## ❌ Vấn đề

Email `trucnguyen102004+user5@gmail.com` đã được gửi nhưng không nhận được.

## 🔍 Kiểm tra

### Bước 1: Kiểm tra user trong database

```bash
cd backend
python check-user-email-status.py
```

Nhập email: `trucnguyen102004+user5@gmail.com`

Script sẽ:
- Kiểm tra user có tồn tại không
- Hiển thị trạng thái email verification
- Test gửi email đơn giản
- Test gửi email verification
- Hiển thị link xác thực trực tiếp

### Bước 2: Kiểm tra email trong Gmail

**Email sẽ đến**: `trucnguyen102004@gmail.com` (email gốc)

**Kiểm tra:**
1. Đăng nhập: `trucnguyen102004@gmail.com`
2. Kiểm tra tất cả mục:
   - ✅ Inbox (Hộp thư đến)
   - ✅ Spam (Thư rác) ← **QUAN TRỌNG**
   - ✅ Promotions (Quảng cáo) ← **QUAN TRỌNG**
   - ✅ Updates (Cập nhật)
   - ✅ All Mail (Tất cả thư) ← **QUAN TRỌNG**
3. Tìm email từ: `tdyennhi0511@gmail.com`
4. Subject: "Xác nhận email đăng ký tài khoản - GoodCV" hoặc "Test Email - GoodCV"

### Bước 3: Kiểm tra terminal backend

Khi đăng ký hoặc gửi email, kiểm tra terminal có hiển thị:

**Thành công:**
```
✅ Verification email sent to trucnguyen102004+user5@gmail.com
   From: tdyennhi0511@gmail.com
   Backend: django.core.mail.backends.smtp.EmailBackend
```

**Lỗi:**
```
❌ Failed to send verification email: ...
```

## 🔧 Giải pháp

### Cách 1: Dùng link xác thực trực tiếp (Nhanh nhất)

```bash
cd backend
python check-user-email-status.py
```

Copy link xác thực từ output và dán vào trình duyệt → Xác thực ngay (không cần email)

### Cách 2: Gửi lại email verification

```bash
cd backend
python resend-verification-email.py
```

Nhập email: `trucnguyen102004+user5@gmail.com`

### Cách 3: Test gửi email đơn giản

```bash
cd backend
python test-email-send.py
```

Nhập email: `trucnguyen102004+user5@gmail.com`

Nếu email test nhận được → Email verification cũng sẽ nhận được
Nếu email test không nhận được → Có vấn đề với cấu hình email

## 💡 Lưu ý quan trọng

### 1. Plus Addressing

Email: `trucnguyen102004+user5@gmail.com`
- Gmail tự động chuyển về: `trucnguyen102004@gmail.com`
- **Phải đăng nhập email gốc** để xem email

### 2. Email Spam

Gmail thường đưa email từ tài khoản mới vào:
- **Spam** (Thư rác) - Kiểm tra đầu tiên
- **Promotions** (Quảng cáo) - Kiểm tra thứ hai
- **Updates** (Cập nhật)

### 3. Thời gian

Email có thể delay 1-5 phút
- Đợi 5-10 phút rồi kiểm tra lại

### 4. All Mail

Nếu không thấy ở Inbox, Spam, Promotions:
- Kiểm tra mục **All Mail** (Tất cả thư)
- Tìm email từ: `tdyennhi0511@gmail.com`

## ✅ Checklist

- [ ] Đã đăng nhập email gốc: `trucnguyen102004@gmail.com`
- [ ] Đã kiểm tra mục Spam (Thư rác)
- [ ] Đã kiểm tra mục Promotions (Quảng cáo)
- [ ] Đã kiểm tra mục All Mail (Tất cả thư)
- [ ] Đã chạy `check-user-email-status.py` để lấy link xác thực
- [ ] Đã test gửi email đơn giản: `python test-email-send.py`
- [ ] Đã kiểm tra terminal backend có lỗi không

## 🎯 Giải pháp nhanh nhất

**Dùng link xác thực trực tiếp:**

1. Chạy script:
   ```bash
   cd backend
   python check-user-email-status.py
   ```

2. Copy link xác thực từ output

3. Dán vào trình duyệt → Xác thực ngay (không cần email)

## 🚨 Nếu vẫn không thấy email

1. Kiểm tra terminal backend có lỗi không
2. Test gửi email đơn giản: `python test-email-send.py`
3. Kiểm tra App Password trong file `.env` đã đúng chưa
4. Kiểm tra hộp thư người gửi (`tdyennhi0511@gmail.com`) có bị bounce không

