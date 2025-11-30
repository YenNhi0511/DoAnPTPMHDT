# 📧 Hướng Dẫn Cấu Hình Email

## Vấn đề hiện tại

Backend đang sử dụng **Console Email Backend**, nghĩa là email chỉ được in ra console/terminal, **KHÔNG gửi email thật**.

## Cấu trúc email Gmail Plus Addressing

✅ **ĐÚNG**: `trucnguyen102004.dev+user1@gmail.com`

Gmail hỗ trợ "plus addressing" - bạn có thể thêm `+anything` sau tên email và email vẫn sẽ được gửi đến hộp thư chính.

Ví dụ:
- `trucnguyen102004.dev@gmail.com` → hộp thư chính
- `trucnguyen102004.dev+user1@gmail.com` → cũng đến hộp thư chính
- `trucnguyen102004.dev+test@gmail.com` → cũng đến hộp thư chính

## Cách cấu hình để gửi email thật

### Option 1: Sử dụng Gmail SMTP (Khuyến nghị cho development)

1. **Tạo App Password cho Gmail:**
   - Vào: https://myaccount.google.com/apppasswords
   - Chọn "Mail" và "Other (Custom name)"
   - Nhập tên: "GoodCV Development"
   - Copy App Password (16 ký tự)

2. **Tạo file `.env` trong thư mục `backend/`:**

```env
# Email Configuration
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=trucnguyen102004.dev@gmail.com
EMAIL_HOST_PASSWORD=your-16-char-app-password-here
DEFAULT_FROM_EMAIL=trucnguyen102004.dev@gmail.com
```

3. **Cập nhật `settings.py`:**

```python
# Email settings
EMAIL_BACKEND = os.environ.get('EMAIL_BACKEND', 'django.core.mail.backends.console.EmailBackend')
EMAIL_HOST = os.environ.get('EMAIL_HOST', 'smtp.gmail.com')
EMAIL_PORT = int(os.environ.get('EMAIL_PORT', 587))
EMAIL_USE_TLS = os.environ.get('EMAIL_USE_TLS', 'True').lower() in ('true', '1', 'yes')
EMAIL_HOST_USER = os.environ.get('EMAIL_HOST_USER', '')
EMAIL_HOST_PASSWORD = os.environ.get('EMAIL_HOST_PASSWORD', '')
DEFAULT_FROM_EMAIL = os.environ.get('DEFAULT_FROM_EMAIL', EMAIL_HOST_USER)
```

### Option 2: Sử dụng SendGrid (Production)

1. Đăng ký tài khoản SendGrid
2. Tạo API Key
3. Cấu hình trong `.env`:

```env
EMAIL_BACKEND=anymail.backends.sendgrid.EmailBackend
SENDGRID_API_KEY=your-sendgrid-api-key
DEFAULT_FROM_EMAIL=noreply@yourdomain.com
```

### Option 3: Sử dụng SMTP khác (Outlook, Yahoo, etc.)

```env
# Outlook
EMAIL_HOST=smtp-mail.outlook.com
EMAIL_PORT=587
EMAIL_USE_TLS=True

# Yahoo
EMAIL_HOST=smtp.mail.yahoo.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
```

## Kiểm tra email có hoạt động

Sau khi cấu hình, test bằng cách:

1. Đăng ký tài khoản mới với email `trucnguyen102004.dev+user1@gmail.com`
2. Kiểm tra hộp thư `trucnguyen102004.dev@gmail.com`
3. Kiểm tra cả mục **Spam** và **Promotions**

## Lưu ý

- **Console Backend** (hiện tại): Email chỉ in ra terminal, không gửi thật
- **SMTP Backend**: Gửi email thật qua SMTP server
- Gmail yêu cầu **App Password** (không dùng mật khẩu thường)
- Email có thể vào mục **Spam** hoặc **Promotions**

