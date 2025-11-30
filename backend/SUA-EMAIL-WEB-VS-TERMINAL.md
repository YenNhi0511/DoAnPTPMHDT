# 🔧 Sửa Lỗi: Email Chỉ Gửi Được Từ Terminal

## ❌ Vấn đề

- ✅ Email gửi được từ terminal (script)
- ❌ Email KHÔNG gửi được khi đăng ký trên web

## 🔍 Nguyên nhân

### 1. **Exception không được catch đúng**

Khi đăng ký trên web:
- Exception có thể bị "nuốt" (silent fail)
- Không có logging rõ ràng
- Email không được gửi nhưng không báo lỗi

### 2. **Celery worker chưa chạy**

Nếu gửi đồng bộ lỗi và fallback sang async:
- Celery worker chưa chạy → Email không được gửi
- Không có thông báo lỗi rõ ràng

## ✅ Đã sửa

### 1. **Logging tốt hơn trong serializers.py**

```python
try:
    send_verification_email_task(str(user.id))
    print(f'✅ Email verification sent to {user.email} (synchronous)')
except Exception as e:
    print(f'❌ Failed to send verification email synchronously: {e}')
    print(f'   Trying async (Celery)...')
    try:
        send_verification_email_task.delay(str(user.id))
        print(f'✅ Email verification queued for {user.email} (async)')
    except Exception as async_error:
        print(f'❌ Failed to queue email verification: {async_error}')
        import traceback
        traceback.print_exc()
```

### 2. **Endpoint GET để xác thực từ link email**

Tạo endpoint GET: `/api/users/verify-email/{token}/`
- Click link trong email → Tự động xác thực
- Tự động redirect về `/login?verified=success&token=...`
- Frontend tự động login với token

### 3. **Nút xác thực trong email**

Email template có nút "✅ Xác Nhận Email Ngay"
- Click vào → Gọi GET endpoint
- Tự động xác thực và redirect về login

## 🔧 Kiểm tra

### Bước 1: Kiểm tra terminal backend

Khi đăng ký trên web, kiểm tra terminal có hiển thị:

**Thành công:**
```
✅ Email verification sent to user@example.com (synchronous)
```

**Lỗi:**
```
❌ Failed to send verification email synchronously: ...
   Trying async (Celery)...
```

### Bước 2: Kiểm tra Celery worker

Nếu thấy "Trying async (Celery)..." → Cần chạy Celery worker:

```bash
cd backend
venv\Scripts\activate
celery -A recruitment_system worker --loglevel=info
```

### Bước 3: Test đăng ký trên web

1. Đăng ký tài khoản mới trên web
2. Kiểm tra terminal backend có log không
3. Kiểm tra email có đến không

## ✅ Checklist

- [ ] Terminal backend có log khi đăng ký trên web
- [ ] Celery worker đang chạy (nếu cần)
- [ ] Email được gửi khi đăng ký trên web
- [ ] Link xác thực trong email hoạt động
- [ ] Click nút xác thực → Tự động redirect về login

## 🎯 Kết quả mong đợi

1. **Đăng ký trên web** → Email được gửi ngay
2. **Click nút xác thực trong email** → Tự động xác thực và redirect về login
3. **Tự động login** với token từ email verification

