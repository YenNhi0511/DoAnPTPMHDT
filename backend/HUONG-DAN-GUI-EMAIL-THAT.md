# 📧 Hướng Dẫn Gửi Email Thật Đến Gmail

## ✅ Đã tạo file `.env`

File `backend/.env` đã được tạo với cấu hình SMTP để gửi email thật.

## 🔧 Bước tiếp theo

### 1. **Lấy App Password cho `tdyennhi0511@gmail.com`**

1. Vào: https://myaccount.google.com/apppasswords
2. Đăng nhập với `tdyennhi0511@gmail.com`
3. Tạo App Password:
   - **App**: Mail
   - **Device**: Other (Custom name) → Nhập "GoodCV"
4. **Copy App Password** (16 ký tự, ví dụ: `abcd efgh ijkl mnop`)

### 2. **Cập nhật file `.env`**

Mở file `backend/.env` và thay `your-app-password-here` bằng App Password thật:

```env
EMAIL_HOST_PASSWORD=abcdefghijklmnop
```

**Lưu ý**: Bỏ hết dấu cách trong App Password (Gmail hiển thị có dấu cách, nhưng dùng không cần dấu cách)

### 3. **Restart Backend Server**

Sau khi cập nhật `.env`, **PHẢI restart backend server**:

```bash
# Dừng server (Ctrl+C)
# Chạy lại:
cd backend
venv\Scripts\activate
python manage.py runserver
```

### 4. **Đảm bảo Celery Worker đang chạy**

Email verification được gửi qua Celery task, nên cần Celery worker:

```bash
cd backend
venv\Scripts\activate
celery -A recruitment_system worker --loglevel=info
```

## ✅ Test gửi email thật

### Test 1: Dùng script test

```bash
cd backend
python test-email-send.py
```

Nhập email `trucnguyen102004@gmail.com` để test.

### Test 2: Đăng ký tài khoản mới

1. Đăng ký với email: `trucnguyen102004.dev+user1@gmail.com`
2. Kiểm tra terminal backend:
   - ✅ Thành công: `✅ Verification email sent to trucnguyen102004.dev+user1@gmail.com`
   - ❌ Lỗi: Sẽ hiển thị chi tiết lỗi
3. Kiểm tra hộp thư: `trucnguyen102004@gmail.com`
4. Kiểm tra cả mục **Spam** và **Promotions**

## 🔍 Kiểm tra cấu hình

Sau khi restart backend, kiểm tra terminal có hiển thị:

```
EMAIL_BACKEND: django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST_USER: tdyennhi0511@gmail.com
```

Nếu vẫn thấy `console.EmailBackend` → File `.env` chưa được load, cần restart lại.

## ⚠️ Lưu ý quan trọng

1. **App Password**: Phải dùng App Password, không dùng mật khẩu thường
2. **Restart**: Sau khi tạo/sửa `.env`, PHẢI restart backend
3. **Celery**: Phải chạy Celery worker để gửi email
4. **Email Spam**: Email có thể vào mục Spam hoặc Promotions

## 🎯 Kết quả mong đợi

Sau khi cấu hình đúng:

- ✅ Email được gửi từ `tdyennhi0511@gmail.com`
- ✅ Email đến hộp thư Gmail thật (không chỉ in ra terminal)
- ✅ Plus addressing hoạt động: `trucnguyen102004.dev+user1@gmail.com` → Nhận tại `trucnguyen102004@gmail.com`

## 🐛 Nếu vẫn không nhận được email

1. ✅ Kiểm tra App Password đã đúng chưa?
2. ✅ Kiểm tra file `.env` đã đúng format chưa?
3. ✅ Kiểm tra backend đã restart chưa?
4. ✅ Kiểm tra Celery worker đang chạy chưa?
5. ✅ Kiểm tra terminal backend có lỗi không?
6. ✅ Kiểm tra mục **Spam** và **Promotions** trong Gmail
7. ✅ Chạy `python test-email-send.py` để test trực tiếp
