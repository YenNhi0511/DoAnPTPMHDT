# 🔍 Debug: Email Không Gửi Khi Đăng Ký Trên Web

## ❌ Vấn đề

- ✅ Email gửi được từ terminal (script)
- ❌ Email KHÔNG gửi được khi đăng ký trên web

## ✅ Đã sửa

### Thay đổi logic gửi email

**Trước đây:**
- Gọi Celery task `send_verification_email_task(str(user.id))`
- Nếu lỗi → Fallback sang async

**Bây giờ:**
- Gửi email **trực tiếp** (không qua Celery task)
- Nếu lỗi → Mới fallback sang Celery async

### Lợi ích:
- ✅ Đảm bảo email được gửi ngay (không phụ thuộc Celery)
- ✅ Logging rõ ràng hơn
- ✅ Dễ debug hơn

## 🔍 Kiểm tra

### Bước 1: Kiểm tra terminal backend

Khi đăng ký trên web, kiểm tra terminal có hiển thị:

**Thành công:**
```
✅ Email verification sent to user@example.com (direct)
   From: tdyennhi0511@gmail.com
   Backend: django.core.mail.backends.smtp.EmailBackend
   URL: http://localhost:8000/api/users/verify-email/{token}/
```

**Lỗi:**
```
❌ Failed to send verification email directly: ...
   Error type: ...
   Trying async (Celery)...
```

### Bước 2: Kiểm tra cấu hình email

```bash
cd backend
python test-email-send.py
```

Nếu test email không gửi được → Vấn đề ở cấu hình email

### Bước 3: Kiểm tra file `.env`

Đảm bảo file `.env` có:
```env
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=tdyennhi0511@gmail.com
EMAIL_HOST_PASSWORD=your-app-password-here
DEFAULT_FROM_EMAIL=tdyennhi0511@gmail.com
```

## ✅ Checklist

- [ ] Terminal backend có log khi đăng ký trên web
- [ ] File `.env` có đầy đủ cấu hình email
- [ ] App Password đã đúng (không phải placeholder)
- [ ] Backend server đã restart sau khi sửa `.env`
- [ ] Test email đơn giản hoạt động: `python test-email-send.py`

## 🎯 Kết quả mong đợi

Sau khi sửa:
- ✅ Đăng ký trên web → Email được gửi ngay
- ✅ Terminal hiển thị: `✅ Email verification sent to ... (direct)`
- ✅ Email có link đúng: `http://localhost:8000/api/users/verify-email/{token}/`
- ✅ Click nút xác thực → Tự động redirect về login

