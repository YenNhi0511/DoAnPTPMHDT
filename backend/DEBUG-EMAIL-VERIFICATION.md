# 🔍 Debug Email Verification - Không Nhận Được Email

## ✅ Đã có form xác thực

Trang xác thực email đã được tạo tại: `/verify-email`

## ⏱️ Thời gian gửi email

### Trước đây (Async - Chậm):
- Email được gửi qua **Celery task** (async)
- **Thời gian**: 1-5 giây (nếu Celery worker đang chạy)
- **Vấn đề**: Nếu Celery worker chưa chạy → Email không được gửi

### Bây giờ (Đồng bộ - Nhanh):
- Email được gửi **đồng bộ** trước (nhanh hơn)
- **Thời gian**: < 1 giây
- **Fallback**: Nếu lỗi, mới dùng Celery async

## 🔍 Kiểm tra tại sao không nhận được email

### 1. Kiểm tra cấu hình email

Chạy lệnh này để kiểm tra:

```bash
cd backend
python -c "import os; from dotenv import load_dotenv; load_dotenv(); print('EMAIL_BACKEND:', os.environ.get('EMAIL_BACKEND', 'NOT SET')); print('EMAIL_HOST_USER:', os.environ.get('EMAIL_HOST_USER', 'NOT SET')); print('EMAIL_HOST_PASSWORD:', 'SET' if os.environ.get('EMAIL_HOST_PASSWORD') and os.environ.get('EMAIL_HOST_PASSWORD') != 'your-app-password-here' else 'NOT SET or PLACEHOLDER')"
```

**Kết quả mong đợi:**
- `EMAIL_BACKEND`: `django.core.mail.backends.smtp.EmailBackend`
- `EMAIL_HOST_USER`: `tdyennhi0511@gmail.com`
- `EMAIL_HOST_PASSWORD`: `SET`

**Nếu EMAIL_BACKEND = NOT SET:**
→ File `.env` thiếu dòng `EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend`

### 2. Kiểm tra terminal backend

Khi đăng ký tài khoản mới, kiểm tra terminal backend có hiển thị:

**Thành công:**
```
✅ Verification email sent to trucnguyen102004.dev+user1@gmail.com
   From: tdyennhi0511@gmail.com
   Backend: django.core.mail.backends.smtp.EmailBackend
```

**Lỗi:**
```
❌ Failed to send verification email to trucnguyen102004.dev+user1@gmail.com: ...
   Error type: ...
   Backend: django.core.mail.backends.console.EmailBackend
```

### 3. Kiểm tra email trong Gmail

1. Kiểm tra hộp thư: `trucnguyen102004@gmail.com`
2. Kiểm tra mục **Spam** (Thư rác)
3. Kiểm tra mục **Promotions** (Quảng cáo)
4. Kiểm tra mục **Updates** (Cập nhật)
5. Kiểm tra mục **All Mail** (Tất cả thư)

### 4. Test gửi email trực tiếp

Chạy script test:

```bash
cd backend
python test-email-send.py
```

Nhập email `trucnguyen102004@gmail.com` để test.

## 🔧 Giải pháp

### Vấn đề 1: EMAIL_BACKEND = NOT SET

**Giải pháp:**
1. Mở file `backend/.env`
2. Thêm dòng: `EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend`
3. Restart backend server

### Vấn đề 2: EMAIL_HOST_PASSWORD = NOT SET or PLACEHOLDER

**Giải pháp:**
1. Lấy App Password cho `tdyennhi0511@gmail.com` tại: https://myaccount.google.com/apppasswords
2. Mở file `backend/.env`
3. Thay `your-app-password-here` bằng App Password thật
4. Restart backend server

### Vấn đề 3: Celery worker chưa chạy

**Giải pháp:**
- Không cần thiết nữa (đã gửi đồng bộ)
- Nhưng nếu muốn, vẫn có thể chạy:
  ```bash
  cd backend
  venv\Scripts\activate
  celery -A recruitment_system worker --loglevel=info
  ```

### Vấn đề 4: Email vào Spam

**Giải pháp:**
- Kiểm tra mục **Spam** và **Promotions**
- Đánh dấu email là "Not Spam" để Gmail nhận diện

## ✅ Checklist

- [ ] File `.env` có `EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend`
- [ ] File `.env` có `EMAIL_HOST_PASSWORD` với App Password thật
- [ ] Backend server đã restart sau khi sửa `.env`
- [ ] Terminal backend hiển thị `✅ Verification email sent to ...`
- [ ] Đã kiểm tra mục **Spam** và **Promotions** trong Gmail
- [ ] Đã test bằng `python test-email-send.py`

## 🎯 Kết quả mong đợi

Sau khi sửa đúng:
- ✅ Email được gửi **ngay lập tức** (< 1 giây)
- ✅ Terminal hiển thị: `✅ Verification email sent to ...`
- ✅ Email đến hộp thư Gmail (có thể vào Spam/Promotions)
- ✅ User nhận được email trong vòng 1-2 phút

