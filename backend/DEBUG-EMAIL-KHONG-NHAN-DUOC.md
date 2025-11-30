# 🔍 Debug: Email Đã Gửi Nhưng Không Nhận Được

## ✅ Tình trạng hiện tại

Theo terminal output:
- ✅ Email đã được gửi thành công
- ✅ Backend: `django.core.mail.backends.smtp.EmailBackend` (đúng)
- ✅ From: `tdyennhi0511@gmail.com`
- ✅ To: `trucnguyen102004.dev+user4@gmail.com`

**Nhưng không thấy email trong hộp thư!**

## 🔍 Nguyên nhân có thể

### 1. **Email vào Spam/Promotions** (Phổ biến nhất)

Gmail thường đưa email từ tài khoản mới vào:
- **Spam** (Thư rác)
- **Promotions** (Quảng cáo)
- **Updates** (Cập nhật)

**Cách kiểm tra:**
1. Đăng nhập: `trucnguyen102004@gmail.com`
2. Kiểm tra tất cả mục:
   - Inbox (Hộp thư đến)
   - Spam (Thư rác)
   - Promotions (Quảng cáo)
   - Updates (Cập nhật)
   - All Mail (Tất cả thư)
3. Tìm email từ: `tdyennhi0511@gmail.com`
4. Subject: "Xác nhận email đăng ký tài khoản - GoodCV"

### 2. **Email bị Gmail chặn hoặc delay**

Gmail có thể:
- Delay email (1-5 phút)
- Chặn email từ tài khoản mới
- Yêu cầu xác thực người gửi

**Cách kiểm tra:**
- Đợi 5-10 phút
- Kiểm tra lại tất cả mục

### 3. **Plus addressing không hoạt động**

Email: `trucnguyen102004.dev+user4@gmail.com`
- Plus addressing có thể không hoạt động nếu Gmail chưa kích hoạt
- Email sẽ đến: `trucnguyen102004@gmail.com` (email gốc)

**Cách kiểm tra:**
- Đăng nhập: `trucnguyen102004@gmail.com` (không có `.dev+user4`)
- Kiểm tra tất cả mục

### 4. **Email bị bounce hoặc reject**

Gmail có thể reject email nếu:
- Người gửi (`tdyennhi0511@gmail.com`) bị spam
- App Password không đúng
- Gmail chưa cho phép "Less secure app access"

**Cách kiểm tra:**
- Kiểm tra hộp thư của người gửi: `tdyennhi0511@gmail.com`
- Xem có email bounce/reject không

## 🔧 Giải pháp

### Bước 1: Kiểm tra kỹ trong Gmail

1. **Đăng nhập đúng email**:
   - Email gốc: `trucnguyen102004@gmail.com`
   - Không phải: `trucnguyen102004.dev+user4@gmail.com`

2. **Kiểm tra tất cả mục**:
   ```
   - Inbox (Hộp thư đến)
   - Spam (Thư rác) ← QUAN TRỌNG
   - Promotions (Quảng cáo) ← QUAN TRỌNG
   - Updates (Cập nhật)
   - All Mail (Tất cả thư) ← QUAN TRỌNG
   ```

3. **Tìm email**:
   - Từ: `tdyennhi0511@gmail.com`
   - Subject: "Xác nhận email đăng ký tài khoản - GoodCV"
   - Thời gian: Trong vòng 10 phút gần đây

### Bước 2: Dùng script kiểm tra

```bash
cd backend
python check-email-status.py
```

Nhập email: `trucnguyen102004.dev+user4@gmail.com`

Script sẽ hiển thị:
- Thông tin user
- Link xác thực trực tiếp
- Hướng dẫn kiểm tra chi tiết

### Bước 3: Test gửi email trực tiếp

```bash
cd backend
python test-email-send.py
```

Nhập email: `trucnguyen102004@gmail.com` (email gốc, không có plus addressing)

### Bước 4: Kiểm tra người gửi

1. Đăng nhập: `tdyennhi0511@gmail.com`
2. Kiểm tra hộp thư "Sent" (Đã gửi)
3. Xem có email nào bị bounce/reject không

## 💡 Lưu ý quan trọng

### 1. **Plus Addressing**

Email: `trucnguyen102004.dev+user4@gmail.com`
- Gmail sẽ tự động chuyển về: `trucnguyen102004@gmail.com`
- **Phải đăng nhập email gốc** để xem email

### 2. **Email Spam**

Gmail thường đưa email từ tài khoản mới vào Spam/Promotions
- **Kiểm tra Spam trước tiên**
- Đánh dấu "Not Spam" để Gmail nhận diện

### 3. **Thời gian**

Email có thể delay 1-5 phút
- Đợi 5-10 phút rồi kiểm tra lại

### 4. **Người gửi**

- **Người gửi**: `tdyennhi0511@gmail.com` (từ file `.env`)
- **Người nhận**: `trucnguyen102004.dev+user4@gmail.com` → Nhận tại `trucnguyen102004@gmail.com`

## ✅ Checklist

- [ ] Đã đăng nhập đúng email gốc: `trucnguyen102004@gmail.com`
- [ ] Đã kiểm tra mục **Spam** (Thư rác)
- [ ] Đã kiểm tra mục **Promotions** (Quảng cáo)
- [ ] Đã kiểm tra mục **Updates** (Cập nhật)
- [ ] Đã kiểm tra mục **All Mail** (Tất cả thư)
- [ ] Đã tìm email từ: `tdyennhi0511@gmail.com`
- [ ] Đã đợi 5-10 phút sau khi gửi
- [ ] Đã chạy script `check-email-status.py` để lấy link xác thực trực tiếp

## 🎯 Giải pháp nhanh nhất

**Dùng link xác thực trực tiếp:**

1. Chạy script:
   ```bash
   cd backend
   python check-email-status.py
   ```

2. Copy link xác thực từ output

3. Dán vào trình duyệt để xác thực ngay (không cần email)

## 📞 Nếu vẫn không thấy email

1. Kiểm tra người gửi (`tdyennhi0511@gmail.com`) có bị spam không
2. Test gửi email khác: `python test-email-send.py`
3. Kiểm tra App Password trong file `.env` đã đúng chưa
4. Thử đăng ký với email khác để test

