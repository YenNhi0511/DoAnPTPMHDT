# 🔍 Debug: Email Đột Nhiên Không Gửi Được

## ❌ Vấn đề

- ✅ Email test từ terminal **đã nhận được** (8:24 PM, 12 phút trước)
- ❌ Bây giờ dù test từ terminal hay từ login/đăng ký **đều không thấy email**

## 🔍 Nguyên nhân có thể

### 1. **Gmail đã chặn tài khoản gửi** (Phổ biến nhất)

Gmail có thể chặn tài khoản nếu:
- Gửi quá nhiều email trong thời gian ngắn
- Email bị báo spam
- App Password bị vô hiệu hóa

**Dấu hiệu:**
- Email test ban đầu nhận được
- Sau đó không nhận được email nào nữa
- Không có lỗi trong terminal (email vẫn báo "sent")

**Giải pháp:**
1. Kiểm tra hộp thư của người gửi: `tdyennhi0511@gmail.com`
2. Xem có email bounce/reject không
3. Tạo App Password mới
4. Đợi 10-15 phút rồi thử lại

### 2. **App Password đã hết hạn hoặc bị thay đổi**

**Dấu hiệu:**
- Terminal báo lỗi: `SMTPAuthenticationError`
- Hoặc không có lỗi nhưng email không đến

**Giải pháp:**
1. Tạo App Password mới tại: https://myaccount.google.com/apppasswords
2. Cập nhật file `.env`
3. Restart backend server

### 3. **Email bị delay hoặc vào Spam**

**Dấu hiệu:**
- Terminal báo "sent" nhưng không thấy email
- Email có thể delay 5-15 phút

**Giải pháp:**
1. Đợi 10-15 phút
2. Kiểm tra mục Spam/Promotions
3. Kiểm tra mục All Mail

### 4. **Rate limiting của Gmail**

Gmail có giới hạn:
- 500 email/ngày (tài khoản miễn phí)
- 2000 email/ngày (Gmail Workspace)

**Dấu hiệu:**
- Email test đầu tiên nhận được
- Sau đó không nhận được nữa

**Giải pháp:**
- Đợi 24 giờ
- Hoặc dùng tài khoản Gmail Workspace

## 🔧 Giải pháp

### Bước 1: Kiểm tra terminal backend

Khi đăng ký hoặc gửi email, kiểm tra terminal có lỗi không:

**Nếu có lỗi:**
```
❌ Failed to send verification email: ...
SMTPAuthenticationError: ...
```

→ App Password không đúng hoặc đã hết hạn

**Nếu không có lỗi:**
```
✅ Verification email sent to ...
```

→ Email đã được gửi, nhưng có thể bị Gmail chặn hoặc delay

### Bước 2: Test lại gửi email

**Test email đơn giản:**
```bash
cd backend
python test-email-send.py
```

**Test email verification:**
```bash
cd backend
python test-verification-email-direct.py
```

Nhập email: `trucnguyen102004.dev+user4@gmail.com`

### Bước 3: Kiểm tra App Password

1. Vào: https://myaccount.google.com/apppasswords
2. Đăng nhập: `tdyennhi0511@gmail.com`
3. Kiểm tra App Password "GoodCV" còn hoạt động không
4. Nếu không → Tạo mới và cập nhật file `.env`

### Bước 4: Kiểm tra hộp thư người gửi

1. Đăng nhập: `tdyennhi0511@gmail.com`
2. Kiểm tra hộp thư "Sent" (Đã gửi)
3. Xem có email nào bị bounce/reject không
4. Kiểm tra mục "Spam" của người gửi

### Bước 5: Đợi và thử lại

1. Đợi 10-15 phút
2. Thử gửi lại email
3. Kiểm tra lại tất cả mục trong Gmail

## ✅ Checklist

- [ ] Đã kiểm tra terminal backend có lỗi không
- [ ] Đã test lại bằng `python test-email-send.py`
- [ ] Đã test lại bằng `python test-verification-email-direct.py`
- [ ] Đã kiểm tra App Password còn hoạt động không
- [ ] Đã kiểm tra hộp thư người gửi (`tdyennhi0511@gmail.com`)
- [ ] Đã đợi 10-15 phút và thử lại
- [ ] Đã kiểm tra mục Spam/Promotions của người nhận

## 🎯 Giải pháp nhanh nhất

1. **Tạo App Password mới**:
   - Vào: https://myaccount.google.com/apppasswords
   - Xóa App Password cũ
   - Tạo mới
   - Cập nhật file `.env`
   - Restart backend server

2. **Đợi 10-15 phút** rồi thử lại

3. **Dùng link xác thực trực tiếp** (không cần email):
   ```bash
   cd backend
   python check-email-status.py
   ```
   Copy link xác thực và dán vào trình duyệt

## 💡 Lưu ý

1. **Gmail có thể chặn** nếu gửi quá nhiều email
2. **App Password có thể hết hạn** → Tạo mới
3. **Email có thể delay** → Đợi 10-15 phút
4. **Email có thể vào Spam** → Kiểm tra kỹ

## 🚨 Nếu vẫn không được

1. Kiểm tra xem có phải Gmail đã chặn tài khoản không
2. Thử dùng email người gửi khác
3. Thử đăng ký với email khác để test
4. Kiểm tra log của backend server có lỗi gì không

