# 📧 Cấu Hình Email - Tổng Kết

## ✅ Cấu hình đã hoàn tất

### 1. **Email Người Gửi (Sender)**
- **Email**: `tdyennhi0511@gmail.com`
- **Chức năng**: Dùng để gửi tất cả email từ hệ thống
- **Yêu cầu**: Phải có App Password

### 2. **Email Nhà Tuyển Dụng (Recruiters)**
- **Email gốc**: `mymymon109@gmail.com`
- **Các tài khoản**: 
  - `mymymon109.dev+tech@gmail.com` → Nhận tại `mymymon109@gmail.com`
  - `mymymon109.dev+finance@gmail.com` → Nhận tại `mymymon109@gmail.com`
  - `mymymon109.dev+education@gmail.com` → Nhận tại `mymymon109@gmail.com`
  - ... (và các email khác)

### 3. **Email Ứng Viên (Candidates)**
- **Email gốc**: `trucnguyen102004@gmail.com`
- **Các tài khoản**:
  - `trucnguyen102004.dev+user1@gmail.com` → Nhận tại `trucnguyen102004@gmail.com`
  - `trucnguyen102004.dev+user2@gmail.com` → Nhận tại `trucnguyen102004@gmail.com`
  - ... (và các email khác)

## 🔧 Cấu hình file `.env`

Tạo file `backend/.env` với nội dung:

```env
# Email Configuration - Người gửi
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=tdyennhi0511@gmail.com
EMAIL_HOST_PASSWORD=your-app-password-here
DEFAULT_FROM_EMAIL=tdyennhi0511@gmail.com
```

**Lưu ý**: Thay `your-app-password-here` bằng App Password thật của `tdyennhi0511@gmail.com`

## ✅ Tính năng Email Verification

### Đã được bật:
1. ✅ **Bắt buộc verify email trước khi login**
   - User đăng ký → Nhận email verification
   - User chưa verify → **KHÔNG thể login**
   - User đã verify → Có thể login bình thường

2. ✅ **Tự động gửi email verification khi đăng ký**
   - Email được gửi từ `tdyennhi0511@gmail.com`
   - Chứa link xác thực

3. ✅ **Tự động login sau khi verify**
   - User click link xác thực → Tự động đăng nhập

4. ✅ **Gửi lại email verification**
   - API: `POST /api/users/resend_verification/`
   - Body: `{"email": "user@example.com"}`

## 📬 Luồng hoạt động

### Đăng ký tài khoản mới:
1. User đăng ký với email: `trucnguyen102004.dev+user1@gmail.com`
2. Hệ thống tạo tài khoản với `is_email_verified = False`
3. Hệ thống gửi email verification đến `trucnguyen102004.dev+user1@gmail.com`
4. Gmail tự động chuyển email đến `trucnguyen102004@gmail.com`
5. User mở email và click link xác thực
6. Hệ thống set `is_email_verified = True`
7. User có thể login

### Đăng nhập:
1. User nhập email và password
2. Hệ thống kiểm tra:
   - ✅ Email và password đúng?
   - ✅ `is_email_verified = True`? (BẮT BUỘC)
   - ✅ `is_active = True`?
3. Nếu chưa verify → Trả về lỗi: "Email chưa được xác thực"
4. Nếu đã verify → Đăng nhập thành công

## 🔍 Kiểm tra

### Test với ứng viên:
1. Đăng ký với: `trucnguyen102004.dev+user1@gmail.com`
2. Kiểm tra hộp thư: `trucnguyen102004@gmail.com`
3. Click link xác thực
4. Thử login → Phải thành công

### Test với nhà tuyển dụng:
1. Đăng ký với: `mymymon109.dev+tech@gmail.com`
2. Kiểm tra hộp thư: `mymymon109@gmail.com`
3. Click link xác thực
4. Thử login → Phải thành công

## ⚠️ Lưu ý

1. **App Password**: Phải tạo App Password cho `tdyennhi0511@gmail.com`
2. **Email Spam**: Kiểm tra cả mục **Spam** và **Promotions**
3. **Plus Addressing**: Tất cả email plus addressing đều hoạt động bình thường
4. **Bắt buộc verify**: User **KHÔNG thể login** nếu chưa verify email

## 🐛 Debug

Nếu không nhận được email:
1. ✅ Kiểm tra `EMAIL_BACKEND` đã đổi từ `console` sang `smtp`?
2. ✅ Kiểm tra App Password đã đúng chưa?
3. ✅ Kiểm tra file `.env` đã đúng format chưa?
4. ✅ Kiểm tra terminal backend có lỗi không?
5. ✅ Kiểm tra mục **Spam** và **Promotions**

Nếu không login được:
1. ✅ Kiểm tra email đã verify chưa? (`is_email_verified = True`)
2. ✅ Kiểm tra tài khoản có bị vô hiệu hóa không? (`is_active = True`)
3. ✅ Kiểm tra email và password đã đúng chưa?

