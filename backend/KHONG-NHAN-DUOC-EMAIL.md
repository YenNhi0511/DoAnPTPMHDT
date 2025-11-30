# 🔍 Không Nhận Được Email Verification - Hướng Dẫn Sửa

## ❌ Vấn đề

Tạo tài khoản `trucnguyen102004.dev+user4@gmail.com` nhưng không nhận được email verification.

## 🔍 Kiểm tra

### 1. Kiểm tra email đã đúng chưa

Email có thể là:
- ✅ `trucnguyen102004.dev+user4@gmail.com` (đúng - plus addressing)
- ❌ `trucnguyen102004.dev user4@gmail.com` (sai - có dấu cách)

**Lưu ý**: Plus addressing không có dấu cách, dùng dấu `+` giữa phần tên và `user4`.

### 2. Kiểm tra terminal backend

Khi đăng ký, kiểm tra terminal backend có hiển thị:

**Thành công:**
```
✅ Verification email sent to trucnguyen102004.dev+user4@gmail.com
   From: tdyennhi0511@gmail.com
   Backend: django.core.mail.backends.smtp.EmailBackend
```

**Lỗi:**
```
❌ Failed to send verification email to trucnguyen102004.dev+user4@gmail.com: ...
   Error type: ...
```

### 3. Kiểm tra email trong Gmail

Email sẽ đến hộp thư: `trucnguyen102004@gmail.com` (email gốc)

Kiểm tra:
1. ✅ Hộp thư đến
2. ✅ Mục **Spam** (Thư rác)
3. ✅ Mục **Promotions** (Quảng cáo)
4. ✅ Mục **Updates** (Cập nhật)
5. ✅ Mục **All Mail** (Tất cả thư)

### 4. Kiểm tra cấu hình email

Chạy lệnh:
```bash
cd backend
python test-email-send.py
```

Nhập email `trucnguyen102004@gmail.com` để test.

## 🔧 Giải pháp

### Cách 1: Gửi lại email verification (Nhanh nhất)

**Dùng script:**
```bash
cd backend
python resend-verification-email.py
```

Nhập email: `trucnguyen102004.dev+user4@gmail.com`

**Hoặc dùng API:**
1. Mở trang: `/verify-email?email=trucnguyen102004.dev+user4@gmail.com`
2. Click nút "Gửi lại"

**Hoặc dùng API trực tiếp:**
```bash
curl -X POST http://localhost:8000/api/users/resend_verification/ \
  -H "Content-Type: application/json" \
  -d '{"email": "trucnguyen102004.dev+user4@gmail.com"}'
```

### Cách 2: Kiểm tra và sửa cấu hình email

1. **Kiểm tra file `.env`**:
   ```env
   EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USE_TLS=True
   EMAIL_HOST_USER=tdyennhi0511@gmail.com
   EMAIL_HOST_PASSWORD=your-app-password-here
   DEFAULT_FROM_EMAIL=tdyennhi0511@gmail.com
   ```

2. **Kiểm tra App Password**:
   - Phải là App Password thật (không phải placeholder)
   - Không có dấu cách
   - Đã tạo tại: https://myaccount.google.com/apppasswords

3. **Restart backend server** sau khi sửa `.env`

### Cách 3: Kiểm tra user trong database

```bash
cd backend
python manage.py shell
```

```python
from accounts.models import User
user = User.objects.filter(email__contains='trucnguyen102004').first()
if user:
    print(f"Email: {user.email}")
    print(f"Đã verify: {user.is_email_verified}")
    print(f"Token: {user.email_verification_token}")
    print(f"Gửi lúc: {user.email_verification_sent_at}")
```

## ✅ Checklist

- [ ] Email đã đúng format: `trucnguyen102004.dev+user4@gmail.com` (không có dấu cách)
- [ ] Đã kiểm tra terminal backend có lỗi không
- [ ] Đã kiểm tra mục Spam và Promotions trong Gmail
- [ ] Đã test gửi email bằng `python test-email-send.py`
- [ ] File `.env` có App Password thật (không phải placeholder)
- [ ] Backend server đã restart sau khi sửa `.env`
- [ ] Đã thử gửi lại email verification

## 🎯 Các bước tiếp theo

1. **Chạy script gửi lại email**:
   ```bash
   cd backend
   python resend-verification-email.py
   ```

2. **Kiểm tra email trong Gmail**:
   - Đăng nhập: `trucnguyen102004@gmail.com`
   - Kiểm tra tất cả mục (Inbox, Spam, Promotions, Updates)

3. **Nếu vẫn không nhận được**:
   - Kiểm tra terminal backend có lỗi không
   - Test gửi email bằng `python test-email-send.py`
   - Kiểm tra App Password đã đúng chưa

## 💡 Lưu ý

1. **Plus addressing**: Email `trucnguyen102004.dev+user4@gmail.com` sẽ nhận tại `trucnguyen102004@gmail.com`
2. **Email Spam**: Email có thể vào mục Spam hoặc Promotions
3. **Thời gian**: Email thường đến trong vòng 1-2 phút
4. **App Password**: Phải là App Password thật, không phải mật khẩu thường

