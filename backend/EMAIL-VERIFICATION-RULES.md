# 📧 Quy Tắc Xác Thực Email

## ✅ Quy tắc mới

### **ADMIN** - Không cần xác thực email
- ✅ Tự động set `is_email_verified = True` khi đăng ký
- ✅ Không gửi email verification
- ✅ Có thể login ngay sau khi đăng ký

### **CANDIDATE** và **RECRUITER** - Bắt buộc xác thực email
- ❌ Phải verify email trước khi login
- ✅ Tự động gửi email verification khi đăng ký
- ✅ Phải click link xác thực trong email để login

## 🔄 Luồng hoạt động

### Đăng ký ADMIN:
1. User đăng ký với role = ADMIN
2. Hệ thống tự động set `is_email_verified = True`
3. **KHÔNG gửi email verification**
4. User có thể login ngay

### Đăng ký CANDIDATE/RECRUITER:
1. User đăng ký với role = CANDIDATE hoặc RECRUITER
2. Hệ thống set `is_email_verified = False`
3. **Gửi email verification** đến email đăng ký
4. User phải click link xác thực
5. Sau khi verify → `is_email_verified = True`
6. User có thể login

### Đăng nhập:
1. User nhập email và password
2. Hệ thống kiểm tra:
   - ✅ Email và password đúng?
   - ✅ **ADMIN**: Bỏ qua kiểm tra email verification
   - ✅ **CANDIDATE/RECRUITER**: Kiểm tra `is_email_verified = True`?
   - ✅ `is_active = True`?
3. Nếu CANDIDATE/RECRUITER chưa verify → **KHÔNG cho login**
4. Nếu đã verify hoặc là ADMIN → Đăng nhập thành công

## 📝 Các file đã cập nhật

1. ✅ `backend/accounts/views.py` - Logic login: ADMIN bỏ qua kiểm tra email verification
2. ✅ `backend/accounts/serializers.py` - Logic đăng ký: ADMIN tự động verify, không gửi email

## 🎯 Kết quả

- ✅ ADMIN: Đăng ký → Login ngay (không cần verify)
- ✅ CANDIDATE: Đăng ký → Nhận email → Verify → Login
- ✅ RECRUITER: Đăng ký → Nhận email → Verify → Login

