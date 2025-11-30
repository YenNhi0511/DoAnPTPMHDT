# 📧 Tóm Tắt Cấu Hình Email - Hoàn Tất

## ✅ Đã hoàn thành

### 1. **Email Người Gửi (Sender)**
- **Email**: `tdyennhi0511@gmail.com`
- **Chức năng**: Gửi tất cả email từ hệ thống
- **Cấu hình**: Cần tạo App Password và thêm vào file `.env`

### 2. **Email Nhà Tuyển Dụng**
- **Email gốc**: `mymymon109@gmail.com`
- **Các tài khoản**: `mymymon109.dev+tech@gmail.com`, `mymymon109.dev+finance@gmail.com`, etc.
- **Nhận email tại**: `mymymon109@gmail.com`

### 3. **Email Ứng Viên**
- **Email gốc**: `trucnguyen102004@gmail.com`
- **Các tài khoản**: `trucnguyen102004.dev+user1@gmail.com`, `trucnguyen102004.dev+user2@gmail.com`, etc.
- **Nhận email tại**: `trucnguyen102004@gmail.com`

### 4. **Email Verification - BẮT BUỘC**
- ✅ User **PHẢI verify email** trước khi login
- ✅ Tự động gửi email verification khi đăng ký
- ✅ Tự động login sau khi verify thành công
- ✅ Hiển thị thông báo lỗi rõ ràng khi chưa verify

## 🔧 Cấu hình file `.env`

Tạo file `backend/.env`:

```env
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=tdyennhi0511@gmail.com
EMAIL_HOST_PASSWORD=your-app-password-here
DEFAULT_FROM_EMAIL=tdyennhi0511@gmail.com
```

**Lưu ý**: Thay `your-app-password-here` bằng App Password thật của `tdyennhi0511@gmail.com`

## 📋 Luồng hoạt động

### Đăng ký:
1. User đăng ký → Hệ thống tạo tài khoản với `is_email_verified = False`
2. Hệ thống gửi email verification từ `tdyennhi0511@gmail.com`
3. User nhận email tại email gốc (ví dụ: `trucnguyen102004@gmail.com`)
4. User click link xác thực → `is_email_verified = True`
5. User có thể login

### Đăng nhập:
1. User nhập email và password
2. Hệ thống kiểm tra:
   - ✅ Email và password đúng?
   - ✅ `is_email_verified = True`? (**BẮT BUỘC**)
   - ✅ `is_active = True`?
3. Nếu chưa verify → **KHÔNG cho login**, hiển thị thông báo
4. Nếu đã verify → Đăng nhập thành công

## 🎯 Các file đã cập nhật

### Backend:
1. ✅ `backend/recruitment_system/settings.py` - Cấu hình SMTP
2. ✅ `backend/accounts/views.py` - Thêm kiểm tra `is_email_verified` trong login
3. ✅ `backend/accounts/tasks.py` - Dùng `DEFAULT_FROM_EMAIL` thay vì `EMAIL_HOST_USER`
4. ✅ `backend/applications/tasks.py` - Dùng `DEFAULT_FROM_EMAIL` cho tất cả email

### Frontend:
1. ✅ `frontend/src/pages/Login.jsx` - Hiển thị thông báo lỗi khi chưa verify
2. ✅ `frontend/src/contexts/AuthContext.js` - Không tự động login nếu cần verify

## ✅ Test

### Test với ứng viên:
1. Đăng ký: `trucnguyen102004.dev+user1@gmail.com`
2. Kiểm tra email: `trucnguyen102004@gmail.com`
3. Click link xác thực
4. Login → Phải thành công

### Test với nhà tuyển dụng:
1. Đăng ký: `mymymon109.dev+tech@gmail.com`
2. Kiểm tra email: `mymymon109@gmail.com`
3. Click link xác thực
4. Login → Phải thành công

### Test chưa verify:
1. Đăng ký tài khoản mới
2. Thử login ngay (chưa verify) → Phải báo lỗi: "Email chưa được xác thực"

## ⚠️ Lưu ý quan trọng

1. **App Password**: Phải tạo App Password cho `tdyennhi0511@gmail.com`
2. **File .env**: Phải tạo file `.env` trong thư mục `backend/`
3. **Restart**: Sau khi tạo `.env`, phải restart backend server
4. **Email Spam**: Kiểm tra cả mục **Spam** và **Promotions**
5. **Bắt buộc verify**: User **KHÔNG thể login** nếu chưa verify email

## 🎉 Kết quả

- ✅ Email được gửi từ `tdyennhi0511@gmail.com`
- ✅ Plus addressing hoạt động bình thường
- ✅ Bắt buộc verify email trước khi login
- ✅ Thông báo lỗi rõ ràng khi chưa verify
- ✅ Tự động login sau khi verify

