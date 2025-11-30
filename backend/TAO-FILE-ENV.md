# 📝 Hướng Dẫn Tạo File .env Để Gửi Email Thật

## 🎯 Mục tiêu

Tạo file `.env` để hệ thống **GỬI EMAIL THẬT** đến Gmail (không chỉ in ra terminal).

## 📋 Các bước

### Bước 1: Tạo file `.env` trong thư mục `backend/`

Tạo file mới tên `.env` (không có phần mở rộng) trong thư mục `backend/` với nội dung sau:

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

### Bước 2: Lấy App Password cho `tdyennhi0511@gmail.com`

1. Vào: https://myaccount.google.com/apppasswords
2. Đăng nhập với `tdyennhi0511@gmail.com`
3. Tạo App Password:
   - **App**: Mail
   - **Device**: Other (Custom name) → Nhập "GoodCV"
4. **Copy App Password** (16 ký tự, ví dụ: `abcd efgh ijkl mnop`)

### Bước 3: Cập nhật App Password trong file `.env`

Mở file `backend/.env` và thay `your-app-password-here` bằng App Password thật:

```env
EMAIL_HOST_PASSWORD=abcdefghijklmnop
```

**Lưu ý**: Bỏ hết dấu cách trong App Password (Gmail hiển thị có dấu cách, nhưng dùng không cần dấu cách)

### Bước 4: Restart Backend Server

**QUAN TRỌNG**: Sau khi tạo/sửa file `.env`, **PHẢI restart backend server**:

```bash
# Dừng server hiện tại (Ctrl+C)
# Chạy lại:
cd backend
venv\Scripts\activate
python manage.py runserver
```

### Bước 5: Đảm bảo Celery Worker đang chạy

Email verification được gửi qua Celery task, nên cần Celery worker:

```bash
# Mở terminal mới
cd backend
venv\Scripts\activate
celery -A recruitment_system worker --loglevel=info
```

## ✅ Test gửi email thật

### Cách 1: Dùng script test

```bash
cd backend
python test-email-send.py
```

Nhập email `trucnguyen102004@gmail.com` để test.

### Cách 2: Đăng ký tài khoản mới

1. Đăng ký với email: `trucnguyen102004.dev+user1@gmail.com`
2. Kiểm tra terminal backend:
   - ✅ Thành công: `✅ Verification email sent to trucnguyen102004.dev+user1@gmail.com`
   - ❌ Lỗi: Sẽ hiển thị chi tiết lỗi
3. Kiểm tra hộp thư: `trucnguyen102004@gmail.com`
4. Kiểm tra cả mục **Spam** và **Promotions**

## 🔍 Kiểm tra cấu hình đã đúng chưa

Sau khi restart backend, kiểm tra terminal có hiển thị:

```
EMAIL_BACKEND: django.core.mail.backends.smtp.EmailBackend
```

Nếu vẫn thấy `console.EmailBackend` → File `.env` chưa được load, cần:
1. Kiểm tra file `.env` đã đúng tên và vị trí chưa
2. Restart lại backend server

## ⚠️ Lưu ý quan trọng

1. **Tên file**: Phải là `.env` (có dấu chấm ở đầu), không phải `env.txt` hay `.env.txt`
2. **Vị trí**: File phải nằm trong thư mục `backend/` (cùng cấp với `manage.py`)
3. **App Password**: Phải dùng App Password, không dùng mật khẩu thường
4. **Restart**: Sau khi tạo/sửa `.env`, PHẢI restart backend
5. **Celery**: Phải chạy Celery worker để gửi email
6. **Email Spam**: Email có thể vào mục Spam hoặc Promotions

## 🎯 Kết quả mong đợi

Sau khi cấu hình đúng:
- ✅ Email được gửi từ `tdyennhi0511@gmail.com`
- ✅ Email đến hộp thư Gmail thật (không chỉ in ra terminal)
- ✅ Plus addressing hoạt động: `trucnguyen102004.dev+user1@gmail.com` → Nhận tại `trucnguyen102004@gmail.com`

## 🐛 Nếu vẫn không nhận được email

1. ✅ Kiểm tra App Password đã đúng chưa?
2. ✅ Kiểm tra file `.env` đã đúng tên và vị trí chưa?
3. ✅ Kiểm tra backend đã restart chưa?
4. ✅ Kiểm tra Celery worker đang chạy chưa?
5. ✅ Kiểm tra terminal backend có lỗi không?
6. ✅ Kiểm tra mục **Spam** và **Promotions** trong Gmail
7. ✅ Chạy `python test-email-send.py` để test trực tiếp

