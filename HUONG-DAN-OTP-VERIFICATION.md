# 📱 HƯỚNG DẪN XÁC THỰC BẰNG MÃ OTP

## 🎯 TỔNG QUAN

Hệ thống đã được tích hợp **xác thực bằng mã OTP (One-Time Password)** như một giải pháp thay thế khi email không hoạt động.

### ✅ Cách hoạt động:

1. **Khi đăng ký:**
   - Hệ thống cố gắng gửi email verification link
   - Nếu email **gửi thành công** → User nhận email và click link để verify
   - Nếu email **không gửi được** → Hệ thống tự động generate OTP và hiển thị trên màn hình

2. **Xác thực OTP:**
   - User nhập mã OTP 6 chữ số
   - Mã OTP có hiệu lực trong **10 phút**
   - Tối đa **5 lần** nhập sai
   - Sau khi verify thành công → Tự động đăng nhập

---

## 🔧 BACKEND CHANGES

### 1. **User Model** (`backend/accounts/models.py`)

Đã thêm các fields:
- `otp_code`: Mã OTP 6 chữ số
- `otp_sent_at`: Thời gian gửi OTP
- `otp_verified`: Trạng thái đã verify OTP chưa
- `otp_attempts`: Số lần nhập sai OTP

### 2. **API Endpoints** (`backend/accounts/views.py`)

#### **POST `/api/users/generate_otp/`**
- Generate mã OTP mới cho user
- Cố gắng gửi qua email
- Nếu email không gửi được → Trả về OTP code để hiển thị trên frontend

**Request:**
```json
{
  "email": "user@example.com"
}
```

**Response (Email không gửi được):**
```json
{
  "message": "OTP generated successfully",
  "otp_code": "123456",
  "email_sent": false,
  "expires_in": 600
}
```

**Response (Email gửi thành công):**
```json
{
  "message": "OTP generated successfully",
  "otp_code": null,
  "email_sent": true,
  "expires_in": 600
}
```

#### **POST `/api/users/verify_otp/`**
- Verify mã OTP
- Tự động đăng nhập sau khi verify thành công

**Request:**
```json
{
  "email": "user@example.com",
  "otp_code": "123456"
}
```

**Response (Success):**
```json
{
  "message": "OTP verified successfully",
  "refresh": "...",
  "access": "...",
  "user": {...}
}
```

**Response (Error):**
```json
{
  "error": "Invalid OTP code. 4 attempts remaining."
}
```

### 3. **Registration Flow** (`backend/accounts/serializers.py`)

- Khi email không gửi được → Tự động generate OTP
- Trả về `use_otp: true` và `otp_code` trong response

---

## 🎨 FRONTEND CHANGES

### 1. **VerifyOTP Page** (`frontend/src/pages/VerifyOTP.jsx`)

**Features:**
- ✅ 6 input boxes cho OTP (auto-focus next)
- ✅ Paste support (paste 6 digits)
- ✅ Auto-fill nếu OTP được truyền qua URL
- ✅ Hiển thị OTP trên màn hình nếu email không gửi được
- ✅ Resend OTP với countdown timer (60s)
- ✅ Error handling với số lần thử còn lại
- ✅ Auto login và redirect sau khi verify thành công

### 2. **Register Page** (`frontend/src/pages/Register.jsx`)

- Kiểm tra `result.use_otp` và `result.otp_code`
- Redirect đến `/verify-otp` nếu email không gửi được
- Redirect đến `/verify-email` nếu email gửi thành công

### 3. **API Service** (`frontend/src/services/api.js`)

Đã thêm:
- `generateOTP(email)`
- `verifyOTP(email, otp_code)`

---

## 📋 CÁCH SỬ DỤNG

### **Scenario 1: Email hoạt động bình thường**

1. User đăng ký → Nhận email verification
2. Click link trong email → Verify thành công → Đăng nhập

### **Scenario 2: Email không hoạt động**

1. User đăng ký → Email không gửi được
2. Hệ thống tự động generate OTP
3. User được redirect đến `/verify-otp?email=...&otp=123456`
4. OTP được hiển thị trên màn hình (vì email không gửi được)
5. User nhập OTP → Verify thành công → Đăng nhập

### **Scenario 3: User yêu cầu gửi lại OTP**

1. User vào `/verify-otp?email=...`
2. Click "Gửi lại mã OTP"
3. Hệ thống generate OTP mới
4. Cố gắng gửi email
5. Nếu email không gửi được → Hiển thị OTP trên màn hình

---

## 🔒 BẢO MẬT

- ✅ OTP có hiệu lực **10 phút**
- ✅ Tối đa **5 lần** nhập sai
- ✅ OTP được generate ngẫu nhiên (6 chữ số)
- ✅ OTP được xóa sau khi verify thành công
- ✅ Rate limiting: 60s giữa các lần resend

---

## 🧪 TEST

### Test với email không hoạt động:

1. Set `EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend` trong `.env`
2. Đăng ký tài khoản mới
3. Kiểm tra:
   - Redirect đến `/verify-otp`
   - OTP được hiển thị trên màn hình
   - Nhập OTP → Verify thành công

### Test với email hoạt động:

1. Set `EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend` trong `.env`
2. Đăng ký tài khoản mới
3. Kiểm tra:
   - Redirect đến `/verify-email`
   - Nhận email với verification link
   - Click link → Verify thành công

---

## 📝 MIGRATION

Chạy migration để thêm OTP fields:

```bash
cd backend
python manage.py makemigrations accounts --name add_otp_fields
python manage.py migrate
```

---

## ✅ KẾT QUẢ

- ✅ Hệ thống OTP đã được tích hợp hoàn chỉnh
- ✅ Fallback tự động khi email không hoạt động
- ✅ UI/UX tốt với auto-focus, paste support
- ✅ Bảo mật với expiry và attempt limits
- ✅ Tự động đăng nhập sau khi verify

**User giờ có thể đăng ký và xác thực ngay cả khi email không hoạt động!** 🎉

