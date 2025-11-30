# 🔍 Debug Email Verification

## Vấn đề hiện tại

`trucnguyen102004@gmail.com` không nhận được email xác thực.

## Nguyên nhân có thể

### 1. **EMAIL_BACKEND chưa được set**
- Hiện tại: `EMAIL_BACKEND: NOT SET`
- Mặc định: `django.core.mail.backends.console.EmailBackend` (chỉ in ra terminal)
- **Giải pháp**: Tạo file `.env` với `EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend`

### 2. **Celery worker chưa chạy**
- Email verification được gửi qua Celery task
- Nếu Celery worker không chạy → Email không được gửi
- **Giải pháp**: Chạy Celery worker

### 3. **Email vào Spam**
- Gmail có thể đưa email vào mục Spam hoặc Promotions
- **Giải pháp**: Kiểm tra cả mục Spam và Promotions

## Cách kiểm tra

### Bước 1: Kiểm tra file `.env`

Tạo file `backend/.env` với nội dung:

```env
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=tdyennhi0511@gmail.com
EMAIL_HOST_PASSWORD=your-app-password-here
DEFAULT_FROM_EMAIL=tdyennhi0511@gmail.com
```

### Bước 2: Kiểm tra Celery worker

Chạy Celery worker:

```bash
cd backend
venv\Scripts\activate
celery -A recruitment_system worker --loglevel=info
```

### Bước 3: Kiểm tra terminal backend

Khi đăng ký tài khoản mới, kiểm tra terminal backend có thông báo:
- `Verification email sent to trucnguyen102004.dev+user1@gmail.com`
- Hoặc lỗi: `Failed to send verification email: ...`

### Bước 4: Kiểm tra email

1. Kiểm tra hộp thư: `trucnguyen102004@gmail.com`
2. Kiểm tra mục **Spam**
3. Kiểm tra mục **Promotions**
4. Kiểm tra mục **All Mail**

## Test nhanh

### Test 1: Kiểm tra cấu hình

```bash
cd backend
python manage.py shell
```

```python
from django.conf import settings
print("EMAIL_BACKEND:", settings.EMAIL_BACKEND)
print("EMAIL_HOST_USER:", settings.EMAIL_HOST_USER)
print("EMAIL_HOST:", settings.EMAIL_HOST)
```

### Test 2: Gửi email thử

```python
from django.core.mail import send_mail
send_mail(
    'Test Email',
    'This is a test email.',
    settings.DEFAULT_FROM_EMAIL,
    ['trucnguyen102004@gmail.com'],
    fail_silently=False,
)
```

### Test 3: Kiểm tra Celery

```python
from accounts.tasks import send_verification_email_task
# Lấy user ID từ database
from accounts.models import User
user = User.objects.filter(email__contains='trucnguyen102004').first()
if user:
    send_verification_email_task.delay(str(user.id))
    print(f"Task sent for user: {user.email}")
```

## Giải pháp nhanh

1. **Tạo file `.env`** trong `backend/` với cấu hình SMTP
2. **Restart backend server**
3. **Chạy Celery worker** (nếu chưa chạy)
4. **Đăng ký lại tài khoản** hoặc dùng API resend verification

## API Resend Verification

Nếu đã đăng ký nhưng chưa nhận email, có thể gửi lại:

```bash
POST /api/users/resend_verification/
Body: {"email": "trucnguyen102004.dev+user1@gmail.com"}
```

