# 🔧 Sửa Lỗi: User Đã Lưu Nhưng Email Không Gửi

## ❌ Vấn đề

- User được tạo trong database (đăng ký thành công)
- Nhưng email verification không được gửi
- User không thể login vì chưa verify email

## 🔍 Nguyên nhân

### 1. **User được tạo trước khi gửi email**

Logic hiện tại:
1. Tạo user trong database (dòng 67)
2. Sau đó mới gửi email (dòng 84-131)
3. Nếu gửi email lỗi → User vẫn tồn tại trong database

### 2. **Exception bị "nuốt"**

- Exception khi gửi email không được raise
- User vẫn được tạo thành công
- Frontend nhận response success
- Nhưng email không được gửi

## ✅ Đã sửa

### 1. **Logging tốt hơn**

- Log rõ ràng khi gửi email thành công
- Log chi tiết khi gửi email lỗi
- Hiển thị error type và traceback

### 2. **Fallback sang Celery**

- Nếu gửi trực tiếp lỗi → Thử Celery async
- Đảm bảo email vẫn được gửi (dù có delay)

### 3. **User vẫn được tạo**

- User được tạo trước (để có user.id)
- Nếu email lỗi → User vẫn tồn tại
- User có thể dùng API resend verification

## 🔧 Kiểm tra

### Bước 1: Kiểm tra user mới đăng ký

```bash
cd backend
python check-recent-users.py
```

Script sẽ hiển thị:
- Các user đăng ký trong 30 phút gần đây
- Trạng thái email verification
- Link xác thực (nếu có token)

### Bước 2: Kiểm tra terminal backend

Khi đăng ký trên web, kiểm tra terminal có log:

**Thành công:**
```
✅ Email verification sent to user@example.com (direct)
   From: tdyennhi0511@gmail.com
   Backend: django.core.mail.backends.smtp.EmailBackend
   URL: http://localhost:8000/api/users/verify-email/{token}/
```

**Lỗi:**
```
❌ Failed to send verification email to user@example.com: ...
   Error type: ...
   Trying async (Celery)...
```

### Bước 3: Gửi lại email verification

Nếu user đã được tạo nhưng chưa nhận email:

```bash
cd backend
python resend-verification-email.py
```

Hoặc dùng API:
```bash
POST /api/users/resend_verification/
Body: {"email": "user@example.com"}
```

## ✅ Giải pháp

### Option 1: Gửi lại email (Khuyến nghị)

Nếu user đã được tạo:
1. Dùng script: `python resend-verification-email.py`
2. Hoặc dùng API resend verification
3. Hoặc dùng link xác thực trực tiếp từ `check-recent-users.py`

### Option 2: Xóa và đăng ký lại

Nếu muốn đăng ký lại:
```python
from accounts.models import User
user = User.objects.get(email='user@example.com')
user.delete()
```

## 💡 Lưu ý

1. **User được tạo trước**: Để có user.id để gửi email
2. **Email có thể lỗi**: Nhưng user vẫn tồn tại
3. **Có thể gửi lại**: Dùng API resend verification
4. **Celery không bắt buộc**: Email được gửi trực tiếp, Celery chỉ là fallback

## ✅ Checklist

- [ ] Đã kiểm tra terminal backend có log không
- [ ] Đã chạy `check-recent-users.py` để xem user mới
- [ ] Đã thử gửi lại email: `python resend-verification-email.py`
- [ ] Đã kiểm tra cấu hình email trong `.env`
- [ ] Đã test gửi email: `python test-email-send.py`

