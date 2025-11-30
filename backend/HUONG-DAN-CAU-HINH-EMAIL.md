# 📧 Hướng Dẫn Cấu Hình Email Thật

## ✅ Cấu trúc email của bạn là ĐÚNG

`trucnguyen102004.dev+user1@gmail.com` là cấu trúc hợp lệ của Gmail (plus addressing).

Gmail sẽ tự động chuyển email đến: `trucnguyen102004.dev@gmail.com`

## ❌ Vấn đề hiện tại

Backend đang dùng **Console Email Backend** → Email chỉ in ra terminal, **KHÔNG gửi thật**.

## 🔧 Cách sửa để gửi email thật

### Bước 1: Tạo App Password cho Gmail

1. Vào: https://myaccount.google.com/apppasswords
2. Đăng nhập với tài khoản `trucnguyen102004.dev@gmail.com`
3. Chọn:
   - **App**: Mail
   - **Device**: Other (Custom name) → Nhập "GoodCV"
4. Click **Generate**
5. **Copy App Password** (16 ký tự, ví dụ: `abcd efgh ijkl mnop`)

### Bước 2: Tạo file `.env` trong thư mục `backend/`

Tạo file `backend/.env` với nội dung:

```env
# Email Configuration - Gmail SMTP
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=trucnguyen102004.dev@gmail.com
EMAIL_HOST_PASSWORD=abcd-efgh-ijkl-mnop
DEFAULT_FROM_EMAIL=trucnguyen102004.dev@gmail.com
```

**Lưu ý:**

- Thay `abcd-efgh-ijkl-mnop` bằng App Password thật của bạn
- Bỏ dấu cách trong App Password (Gmail tạo có dấu cách, nhưng dùng không cần dấu cách)

### Bước 3: Restart backend server

Sau khi tạo file `.env`, restart backend:

```bash
# Dừng server (Ctrl+C)
# Chạy lại:
cd backend
venv\Scripts\activate
python manage.py runserver
```

## ✅ Kiểm tra

1. Đăng ký tài khoản mới với email: `trucnguyen102004.dev+user1@gmail.com`
2. Kiểm tra hộp thư: `trucnguyen102004.dev@gmail.com`
3. Kiểm tra cả mục **Spam** và **Promotions**

## 📝 Lưu ý

- **Console Backend** (mặc định): Email chỉ in ra terminal
- **SMTP Backend**: Gửi email thật qua Gmail
- Gmail yêu cầu **App Password**, không dùng mật khẩu thường
- Email có thể vào mục **Spam** hoặc **Promotions**

## 🔍 Debug

Nếu vẫn không nhận được email:

1. Kiểm tra terminal backend có lỗi không
2. Kiểm tra App Password đã đúng chưa
3. Kiểm tra file `.env` đã đúng format chưa
4. Kiểm tra mục **Spam** và **Promotions** trong Gmail
5. Thử đăng ký với email khác để test
