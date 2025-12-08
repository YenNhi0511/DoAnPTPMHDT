# 📧 Hướng dẫn Cấu hình Email API

## 🎯 Tổng quan

Hệ thống đã chuyển từ **SMTP (Gmail)** sang **Email API** (Resend/SendGrid) để:

- ✅ **Độ tin cậy cao hơn**: API ổn định hơn SMTP
- ✅ **Không cần Celery**: Gửi email trực tiếp qua HTTP
- ✅ **Tự động fallback**: Nếu Resend lỗi → tự động dùng SendGrid
- ✅ **Miễn phí**: 100 emails/ngày cho cả 2 nhà cung cấp

## 📝 Cách đăng ký API Key

### Option 1: Resend (Khuyên dùng)

1. Truy cập: https://resend.com/signup
2. Đăng ký tài khoản (có thể dùng GitHub)
3. Vào **API Keys** → Click **Create API Key**
4. Đặt tên: `recruitment-system-dev`
5. Copy API key (bắt đầu bằng `re_`)

**Free tier**: 100 emails/day, 3,000 emails/month

### Option 2: SendGrid (Dự phòng)

1. Truy cập: https://signup.sendgrid.com/
2. Đăng ký tài khoản
3. Vào **Settings** → **API Keys** → **Create API Key**
4. Chọn **Full Access**, đặt tên: `recruitment-system`
5. Copy API key (bắt đầu bằng `SG.`)

**Free tier**: 100 emails/day

## ⚙️ Cấu hình

### 1. Thêm vào file `.env`

```env
# Email API (Recommended)
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxx  # Required
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxxxx  # Optional (fallback)
DEFAULT_FROM_EMAIL=noreply@yourdomain.com   # Email người gửi
```

### 2. Cài đặt dependencies

```bash
cd backend
pip install -r requirements.txt  # Đã có requests>=2.31.0
```

### 3. Kiểm tra cấu hình

File `backend/recruitment_system/settings.py` đã được cập nhật:

```python
# Email API Keys
RESEND_API_KEY = os.environ.get('RESEND_API_KEY', '')
SENDGRID_API_KEY = os.environ.get('SENDGRID_API_KEY', '')
DEFAULT_FROM_EMAIL = os.environ.get('DEFAULT_FROM_EMAIL', 'noreply@example.com')
```

## 🔧 Code đã được cập nhật

Tất cả email trong hệ thống đã chuyển sang dùng API:

### Các file đã cập nhật:

1. ✅ `backend/applications/views.py` (6 email functions)

   - Application submission confirmation
   - AI screening notification
   - Interview invitation
   - Interview notification
   - Interview result (pass/fail)
   - Recruitment result (offer/reject)

2. ✅ `backend/accounts/views.py` (1 email function)

   - OTP verification email

3. ✅ `backend/utils/email_sender.py` (New utility)
   - `send_email()` - Main function with auto-fallback
   - `send_email_resend()` - Resend API
   - `send_email_sendgrid()` - SendGrid API

### Cách sử dụng trong code:

```python
from utils.email_sender import send_email

# Gửi email
send_email(
    to_email='candidate@example.com',
    subject='Thông báo kết quả phỏng vấn',
    html_content='<h1>Chúc mừng!</h1><p>Bạn đã đậu.</p>',
    text_content='Chúc mừng! Bạn đã đậu.'
)
```

## 🧪 Test Email

### Test bằng Python shell:

```bash
cd backend
python manage.py shell
```

```python
from utils.email_sender import send_email

# Test gửi email
send_email(
    to_email='your-email@gmail.com',
    subject='Test Email từ Recruitment System',
    html_content='<h1>Hello!</h1><p>This is a test email.</p>',
    text_content='Hello! This is a test email.'
)
```

### Kiểm tra kết quả:

- ✅ Nếu thành công: Email sẽ đến inbox trong vài giây
- ❌ Nếu lỗi: Xem log console để debug

## 🚨 Xử lý lỗi thường gặp

### 1. `RESEND_API_KEY is not set`

**Nguyên nhân**: Chưa set API key trong `.env`  
**Giải pháp**: Thêm `RESEND_API_KEY=re_xxx` vào `.env`

### 2. `401 Unauthorized`

**Nguyên nhân**: API key sai hoặc đã expire  
**Giải pháp**: Tạo API key mới từ dashboard

### 3. `403 Forbidden - Domain not verified`

**Nguyên nhân**: Resend yêu cầu verify domain cho production  
**Giải pháp**:

- Development: Dùng email test `onboarding@resend.dev`
- Production: Verify domain trong Resend dashboard

### 4. `All email providers failed`

**Nguyên nhân**: Cả Resend và SendGrid đều lỗi  
**Giải pháp**:

- Kiểm tra internet connection
- Xem API status: https://status.resend.com/
- Kiểm tra quota (100 emails/day limit)

## 📊 So sánh SMTP vs API

| Tính năng  | SMTP (Gmail)    | API (Resend/SendGrid) |
| ---------- | --------------- | --------------------- |
| Độ tin cậy | ⭐⭐⭐ (75%)    | ⭐⭐⭐⭐⭐ (99.9%)    |
| Tốc độ     | ~2-5 giây       | ~0.5-1 giây           |
| Cần Celery | ✅ Có           | ❌ Không              |
| Cấu hình   | Phức tạp (SMTP) | Đơn giản (HTTP)       |
| Rate limit | 500 emails/day  | 100 emails/day (free) |
| Fallback   | ❌ Không        | ✅ Tự động            |
| Tracking   | ❌ Không        | ✅ Có (dashboard)     |

## 🎯 Next Steps

### Để sử dụng trong development:

1. Lấy Resend API key (xem phần "Cách đăng ký API Key")
2. Thêm vào `backend/.env`: `RESEND_API_KEY=re_xxx`
3. Chạy lại backend: `python manage.py runserver`
4. Test gửi email bằng các chức năng (đăng ký, nộp CV, v.v.)

### Để deploy lên production:

1. Verify domain trong Resend dashboard:
   - Add domain → Add DNS records → Verify
2. Thêm API keys vào environment variables của hosting
3. Update `DEFAULT_FROM_EMAIL=noreply@yourdomain.com`
4. Test toàn bộ email flow trước khi public

## 📚 Tài liệu tham khảo

- **Resend Docs**: https://resend.com/docs/introduction
- **SendGrid Docs**: https://docs.sendgrid.com/
- **Source Code**: `backend/utils/email_sender.py`

---

**Cập nhật**: 2024-01-XX  
**Người viết**: AI Assistant  
**Review**: Team Lead
