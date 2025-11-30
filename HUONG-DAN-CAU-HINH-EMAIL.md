# Hướng dẫn cấu hình Email

## ⚠️ Lưu ý quan trọng

**Neon Auth, Neon Database và Supabase KHÔNG phải là email service trực tiếp**. Chúng chỉ dùng cho:

- **Neon Auth**: Xác thực người dùng (authentication)
- **Neon Database**: Lưu trữ dữ liệu (PostgreSQL)
- **Supabase**: Database + Authentication + Storage (KHÔNG có email service)

### ✅ Có thể dùng Neon/Supabase + Resend để gửi email

**Neon và Supabase có thể tích hợp với Resend** (email service) để gửi email:

- **Neon**: Dùng Resend SMTP hoặc Resend API trực tiếp (không có Edge Functions như Supabase)
- **Supabase**: Supabase Edge Functions + Resend API hoặc Resend SMTP

Để gửi email, bạn cần một **Email Service** như:

- **Resend** (Khuyến nghị - tích hợp tốt với Supabase)
- SMTP (Gmail, Outlook, etc.)
- SendGrid
- AWS SES
- Mailgun

## 📧 Cấu hình SMTP

### 1. Sử dụng Gmail SMTP (Dễ nhất)

Thêm vào file `.env` của backend:

```env
# Email Configuration
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
DEFAULT_FROM_EMAIL=your-email@gmail.com
```

**Lưu ý**: Với Gmail, bạn cần tạo **App Password** (không phải mật khẩu thường):

1. Vào Google Account → Security
2. Bật 2-Step Verification
3. Tạo App Password cho "Mail"

### 2. Sử dụng Outlook/Office 365

```env
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.office365.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@outlook.com
EMAIL_HOST_PASSWORD=your-password
DEFAULT_FROM_EMAIL=your-email@outlook.com
```

### 3. Sử dụng SendGrid (Khuyến nghị cho production)

1. Đăng ký tài khoản tại [SendGrid](https://sendgrid.com)
2. Tạo API Key
3. Cấu hình:

```env
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=apikey
EMAIL_HOST_PASSWORD=your-sendgrid-api-key
DEFAULT_FROM_EMAIL=noreply@yourdomain.com
```

### 4. Sử dụng Neon + Resend (Khuyến nghị - Đơn giản nhất)

**Neon không có email service riêng**, nhưng có thể dùng **Resend** trực tiếp:

#### Cách 1: Resend SMTP (Khuyến nghị cho Neon)

1. Đăng ký tài khoản tại [Resend](https://resend.com) (miễn phí 3,000 email/tháng)
2. Tạo API Key
3. Cấu hình SMTP:

Cài đặt package (nếu dùng Resend backend):

```bash
pip install django-resend
```

Hoặc dùng SMTP của Resend (không cần package - **Khuyến nghị**):

#### 📋 Hướng dẫn chi tiết từng bước:

**Bước 1: Đăng ký tài khoản Resend**

1. Truy cập [https://resend.com](https://resend.com)
2. Click "Sign Up" và đăng ký bằng email (miễn phí)
3. Xác nhận email và đăng nhập

**Bước 2: Tạo API Key**

1. Sau khi đăng nhập, vào **Dashboard**
2. Click vào **API Keys** ở menu bên trái
3. Click nút **"Create API Key"**
4. Đặt tên cho API key (ví dụ: "Django Production")
5. Chọn quyền: **"Sending access"** (đủ để gửi email)
6. Click **"Add"** và **copy API key ngay** (chỉ hiển thị 1 lần)
   - Format: `re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

**Bước 3: Verify Domain (Quan trọng cho production)**

**Option A: Dùng domain đã có (Production)**

1. Vào **Domains** trong Resend dashboard
2. Click **"Add Domain"**
3. Nhập domain của bạn (ví dụ: `yourdomain.com`)
4. Thêm DNS records mà Resend yêu cầu vào DNS của domain
5. Chờ verify (thường vài phút)

**Option B: Dùng email Resend (Development/Testing)**

- Resend cung cấp domain test: `onboarding@resend.dev`
- Hoặc dùng domain mặc định: `delivered@resend.dev`
- **Lưu ý**: Email từ domain này có thể vào spam, chỉ dùng để test

**Bước 4: Cấu hình Django Settings**

Mở file `backend/recruitment_system/settings.py` và tìm phần email settings (khoảng dòng 174-183):

```python
# Email settings
EMAIL_BACKEND = os.environ.get('EMAIL_BACKEND', 'django.core.mail.backends.console.EmailBackend')
EMAIL_HOST = os.environ.get('EMAIL_HOST', 'smtp.gmail.com')
EMAIL_PORT = int(os.environ.get('EMAIL_PORT', 587))
EMAIL_USE_TLS = os.environ.get('EMAIL_USE_TLS', 'True').lower() in ('true', '1', 'yes')
EMAIL_HOST_USER = os.environ.get('EMAIL_HOST_USER', '')
EMAIL_HOST_PASSWORD = os.environ.get('EMAIL_HOST_PASSWORD', '')
DEFAULT_FROM_EMAIL = os.environ.get('DEFAULT_FROM_EMAIL', EMAIL_HOST_USER or 'noreply@recruitment.com')
```

**Không cần sửa code**, chỉ cần cấu hình trong `.env` file!

**Bước 5: Tạo/Cập nhật file `.env`**

Tạo hoặc mở file `backend/.env` và thêm:

```env
# Email Configuration - Resend SMTP
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.resend.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=resend
EMAIL_HOST_PASSWORD=re_your_api_key_here
DEFAULT_FROM_EMAIL=noreply@yourdomain.com
```

**Giải thích từng dòng:**

- `EMAIL_BACKEND`: Dùng SMTP backend của Django (có sẵn, không cần cài thêm)
- `EMAIL_HOST`: Server SMTP của Resend
- `EMAIL_PORT`: Port 587 (TLS)
- `EMAIL_USE_TLS`: Bật TLS encryption
- `EMAIL_HOST_USER`: Luôn là `resend` (không đổi)
- `EMAIL_HOST_PASSWORD`: **API key của bạn** (bắt đầu bằng `re_`)
- `DEFAULT_FROM_EMAIL`:
  - **Chưa có domain**: Dùng `delivered@resend.dev` (không cần verify) ✅
  - **Đã có domain**: Dùng `noreply@yourdomain.com` (phải verify domain trước)

**Bước 6: Test gửi email**

Tạo file test `backend/test_email.py`:

```python
import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'recruitment_system.settings')
django.setup()

from django.core.mail import send_mail

try:
    send_mail(
        subject='Test Email từ Resend',
        message='Đây là email test từ Django + Resend SMTP',
        from_email='noreply@yourdomain.com',  # Thay bằng email đã verify
        recipient_list=['your-email@gmail.com'],  # Email của bạn để test
        fail_silently=False,
    )
    print('✅ Email đã được gửi thành công!')
except Exception as e:
    print(f'❌ Lỗi gửi email: {e}')
```

Chạy test:

```bash
cd backend
python test_email.py
```

**Bước 7: Kiểm tra email**

1. Kiểm tra inbox (có thể vào spam folder)
2. Nếu không thấy, kiểm tra Resend Dashboard → **Logs** để xem status

**Lưu ý quan trọng:**

1. **API Key bảo mật**:

   - Không commit `.env` vào Git
   - Thêm `.env` vào `.gitignore`

2. **Domain verification**:

   - Production: Phải verify domain để email không vào spam
   - Development: Có thể dùng `delivered@resend.dev` để test

3. **Rate limits**:

   - Free tier: 3,000 email/tháng
   - 100 email/ngày

4. **Troubleshooting**:
   - Nếu lỗi "Authentication failed": Kiểm tra lại API key
   - Nếu lỗi "Domain not verified": Verify domain hoặc dùng domain test
   - Nếu email vào spam: Verify domain và setup SPF/DKIM records

**Ví dụ file `.env` hoàn chỉnh:**

### Ví dụ 1: Dùng domain test của Resend (Không cần domain riêng - Khuyến nghị)

```env
# Database (Neon)
DATABASE_URL=postgresql://neondb_owner:npg_1DpbXAfiC9nk@ep-withered-river-a1e3hteu-pooler.ap-southeast-1.aws.neon.tech/recruitment_db?sslmode=require

# Email Configuration - Resend SMTP (Dùng domain test)
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.resend.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=resend
EMAIL_HOST_PASSWORD=re_abc123xyz789your_actual_api_key_here
DEFAULT_FROM_EMAIL=delivered@resend.dev

# Frontend URL
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:8000
```

### Ví dụ 2: Dùng domain riêng (Nếu bạn đã có domain)

```env
# Database (Neon)
DATABASE_URL=postgresql://neondb_owner:npg_1DpbXAfiC9nk@ep-withered-river-a1e3hteu-pooler.ap-southeast-1.aws.neon.tech/recruitment_db?sslmode=require

# Email Configuration - Resend SMTP (Dùng domain riêng)
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.resend.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=resend
EMAIL_HOST_PASSWORD=re_abc123xyz789your_actual_api_key_here
DEFAULT_FROM_EMAIL=noreply@yourdomain.com  # Thay bằng domain của bạn

# Frontend URL
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:8000
```

**💡 Lưu ý**:

- Nếu bạn **chưa có domain riêng**, dùng `delivered@resend.dev` (Ví dụ 1)
- Nếu bạn **đã có domain riêng**, verify domain và dùng email từ domain đó (Ví dụ 2)

**Lưu ý**: Với Neon, bạn chỉ cần dùng Resend SMTP trực tiếp (đơn giản hơn Supabase vì không có Edge Functions).

### 5. Sử dụng Supabase + Resend (Nếu dùng Supabase)

**Supabase không có email service riêng**, nhưng có thể tích hợp với **Resend**:

#### Cách 1: Resend SMTP (Dễ nhất - Khuyến nghị cho Supabase)

1. Đăng ký tài khoản tại [Resend](https://resend.com) (miễn phí 3,000 email/tháng)
2. Tạo API Key
3. Cấu hình SMTP:

Cài đặt package:

```bash
pip install django-resend
```

Cấu hình trong `settings.py`:

```python
EMAIL_BACKEND = 'django_resend.backend.ResendEmailBackend'
RESEND_API_KEY = os.environ.get('RESEND_API_KEY', '')
DEFAULT_FROM_EMAIL = 'noreply@yourdomain.com'  # Phải verify domain trước
```

Hoặc dùng SMTP của Resend:

```python
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.resend.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = 'resend'  # Không đổi
EMAIL_HOST_PASSWORD = os.environ.get('RESEND_API_KEY', '')  # Dùng API key
DEFAULT_FROM_EMAIL = 'noreply@yourdomain.com'
```

Thêm vào `.env`:

```env
RESEND_API_KEY=re_your_api_key_here
```

#### Cách 2: Supabase Edge Functions + Resend API (Nâng cao - Chỉ cho Supabase)

Nếu bạn muốn dùng Supabase Edge Functions để gửi email:

1. Tạo Supabase Edge Function:

```typescript
// supabase/functions/send-email/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve(async (req) => {
  const { to, subject, html, text } = await req.json();

  const resendApiKey = Deno.env.get("RESEND_API_KEY");

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "noreply@yourdomain.com",
      to: [to],
      subject: subject,
      html: html,
      text: text,
    }),
  });

  return new Response(JSON.stringify(await response.json()), {
    headers: { "Content-Type": "application/json" },
  });
});
```

2. Gọi từ Django:

```python
import requests

def send_email_via_supabase(to, subject, html, text):
    supabase_url = os.environ.get('SUPABASE_URL')
    supabase_anon_key = os.environ.get('SUPABASE_ANON_KEY')

    response = requests.post(
        f'{supabase_url}/functions/v1/send-email',
        headers={
            'Authorization': f'Bearer {supabase_anon_key}',
            'Content-Type': 'application/json',
        },
        json={
            'to': to,
            'subject': subject,
            'html': html,
            'text': text,
        }
    )
    return response.json()
```

**Lưu ý**: Cách 1 (Resend SMTP) đơn giản hơn và khuyến nghị cho Django project.

## ✅ Các chức năng email đã được khôi phục

1. **Gửi email mời phỏng vấn** (`invite_interview`)

   - Khi recruiter nhấn "Mời phỏng vấn"
   - Template: `email/interview_invitation.html`

2. **Gửi email thông báo lịch phỏng vấn** (`perform_create` trong InterviewViewSet)

   - Khi tạo interview mới
   - Template: `email/interview_notification.html`

3. **Gửi email kết quả tuyển dụng** (`send_email` trong RecruitmentResultViewSet)
   - Khi recruiter gửi kết quả
   - Template: `email/result_notification.html`

## 🧪 Kiểm tra email hoạt động

### Development (Console Backend)

Mặc định, email sẽ chỉ in ra console:

```env
EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend
```

### Production (SMTP Backend)

```env
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
```

## 📝 Ví dụ cấu hình đầy đủ

### Ví dụ 1: Neon Database + Resend Email

Tạo file `.env` trong thư mục `backend/`:

```env
# Database (Neon)
DATABASE_URL=postgresql://neondb_owner:npg_1DpbXAfiC9nk@ep-withered-river-a1e3hteu-pooler.ap-southeast-1.aws.neon.tech/recruitment_db?sslmode=require

# Email Configuration (Resend - Khuyến nghị cho Neon)
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.resend.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=resend
EMAIL_HOST_PASSWORD=re_your_resend_api_key_here
DEFAULT_FROM_EMAIL=noreply@yourdomain.com

# Frontend URL
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:8000
```

### Ví dụ 2: Neon Database + Gmail SMTP

```env
# Database (Neon)
DATABASE_URL=postgresql://neondb_owner:npg_1DpbXAfiC9nk@ep-withered-river-a1e3hteu-pooler.ap-southeast-1.aws.neon.tech/recruitment_db?sslmode=require

# Email Configuration (Gmail - Development)
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password-here
DEFAULT_FROM_EMAIL=your-email@gmail.com

# Frontend URL
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:8000
```

## 🔍 Debug email

Nếu email không gửi được, kiểm tra:

1. **Xem logs trong console**:

   ```python
   # Sẽ in ra: ✅ Email sent hoặc ❌ Failed to send
   ```

2. **Kiểm tra cấu hình**:

   ```python
   from django.conf import settings
   print(settings.EMAIL_BACKEND)
   print(settings.EMAIL_HOST)
   print(settings.EMAIL_HOST_USER)
   ```

3. **Test gửi email thủ công**:
   ```python
   from django.core.mail import send_mail
   send_mail(
       'Test Email',
       'This is a test',
       'from@example.com',
       ['to@example.com'],
       fail_silently=False,
   )
   ```

## 🎯 Kết luận

- ✅ **Có thể gửi email** với SMTP hoặc email service
- ❌ **Không thể dùng Neon Auth/Database/Supabase trực tiếp** để gửi email
- ✅ **Có thể dùng Supabase + Resend** để gửi email (khuyến nghị)
- ✅ **Templates đã sẵn sàng** và code đã được khôi phục
- ✅ **Chỉ cần cấu hình SMTP** trong `.env` là có thể gửi email ngay

### 📊 So sánh các phương án

| Phương án             | Độ khó          | Chi phí             | Khuyến nghị             |
| --------------------- | --------------- | ------------------- | ----------------------- |
| **Gmail SMTP**        | ⭐ Dễ           | Miễn phí            | ✅ Development          |
| **Neon + Resend**     | ⭐ Dễ           | Miễn phí (3k/tháng) | ✅✅✅ Khuyến nghị nhất |
| **Supabase + Resend** | ⭐⭐ Trung bình | Miễn phí (3k/tháng) | ✅✅ Production         |
| **SendGrid**          | ⭐⭐ Trung bình | Miễn phí (100/ngày) | ✅ Production           |
| **Resend SMTP**       | ⭐ Dễ           | Miễn phí (3k/tháng) | ✅✅✅ Khuyến nghị nhất |

### 🚀 Khuyến nghị

**Cho Development**: Dùng Gmail SMTP (dễ setup)

**Cho Production với Neon**: Dùng **Resend SMTP** (đơn giản nhất)

- Neon không có Edge Functions → Dùng Resend SMTP trực tiếp
- Miễn phí 3,000 email/tháng
- Setup đơn giản, chỉ cần API key
- Deliverability cao

**Cho Production với Supabase**: Dùng **Resend** (SMTP hoặc Edge Functions)

- Có thể dùng Resend SMTP (đơn giản)
- Hoặc Supabase Edge Functions + Resend API (nâng cao)
- Miễn phí 3,000 email/tháng
- Tích hợp tốt với Supabase ecosystem
