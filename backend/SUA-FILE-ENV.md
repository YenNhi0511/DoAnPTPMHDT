# 🔧 Sửa File .env Để Gửi Email Thật

## ❌ Vấn đề hiện tại

File `.env` đã có nhưng **thiếu `EMAIL_BACKEND`**, nên hệ thống vẫn dùng console backend (chỉ in ra terminal).

## ✅ Giải pháp

### Mở file `backend/.env` và đảm bảo có dòng này:

```env
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
```

### Nội dung đầy đủ của file `.env`:

```env
# Email Configuration - Gửi email thật qua Gmail SMTP
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=tdyennhi0511@gmail.com
EMAIL_HOST_PASSWORD=your-app-password-here
DEFAULT_FROM_EMAIL=tdyennhi0511@gmail.com
```

**Lưu ý**: Thay `your-app-password-here` bằng App Password thật của `tdyennhi0511@gmail.com`

## 🔄 Sau khi sửa

1. **Restart Backend Server** (QUAN TRỌNG):
   ```bash
   # Dừng server (Ctrl+C)
   # Chạy lại:
   cd backend
   venv\Scripts\activate
   python manage.py runserver
   ```

2. **Đảm bảo Celery Worker đang chạy**:
   ```bash
   cd backend
   venv\Scripts\activate
   celery -A recruitment_system worker --loglevel=info
   ```

## ✅ Kiểm tra

Sau khi restart, kiểm tra terminal backend có hiển thị:
```
EMAIL_BACKEND: django.core.mail.backends.smtp.EmailBackend
```

Nếu vẫn thấy `console.EmailBackend` → File `.env` chưa được load, cần restart lại.

## 🧪 Test

Chạy script test:
```bash
cd backend
python test-email-send.py
```

Nhập email `trucnguyen102004@gmail.com` để test gửi email thật.

