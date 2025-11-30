# 🔧 Sửa Lỗi Email Authentication

## ❌ Lỗi hiện tại

```
SMTPAuthenticationError: (535, b'5.7.8 Username and Password not accepted.
```

**Nguyên nhân**: App Password trong file `.env` không đúng hoặc đã hết hạn.

## ✅ Giải pháp

### Bước 1: Lấy App Password mới

1. Vào: https://myaccount.google.com/apppasswords
2. Đăng nhập với `tdyennhi0511@gmail.com`
3. Nếu đã có App Password cũ cho "GoodCV":
   - Xóa App Password cũ (click vào icon thùng rác)
4. Tạo App Password mới:
   - **App**: Mail
   - **Device**: Other (Custom name) → Nhập "GoodCV"
5. **Copy App Password** (16 ký tự, ví dụ: `abcd efgh ijkl mnop`)

### Bước 2: Cập nhật file `.env`

1. Mở file `backend/.env`
2. Tìm dòng: `EMAIL_HOST_PASSWORD=...`
3. Thay bằng App Password mới (bỏ hết dấu cách):

```env
EMAIL_HOST_PASSWORD=abcdefghijklmnop
```

**Lưu ý quan trọng:**
- Bỏ hết dấu cách trong App Password
- Gmail hiển thị: `abcd efgh ijkl mnop` (có dấu cách)
- Dùng trong `.env`: `abcdefghijklmnop` (không dấu cách)

### Bước 3: Restart Backend Server

Sau khi sửa file `.env`, **PHẢI restart backend server**:

```bash
# Dừng server (Ctrl+C)
# Chạy lại:
cd backend
venv\Scripts\activate
python manage.py runserver
```

### Bước 4: Test lại

```bash
cd backend
python test-email-send.py
```

Nhập email `trucnguyen102004@gmail.com` để test.

## 🔍 Kiểm tra file `.env`

Đảm bảo file `backend/.env` có đầy đủ:

```env
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=tdyennhi0511@gmail.com
EMAIL_HOST_PASSWORD=abcdefghijklmnop
DEFAULT_FROM_EMAIL=tdyennhi0511@gmail.com
```

**Lưu ý:**
- `EMAIL_HOST_PASSWORD` phải là App Password (16 ký tự, không dấu cách)
- Không phải mật khẩu thường của Gmail

## ⚠️ Lưu ý

1. **App Password vs Mật khẩu thường**:
   - ❌ Không dùng mật khẩu thường của Gmail
   - ✅ Phải dùng App Password (tạo tại https://myaccount.google.com/apppasswords)

2. **Dấu cách trong App Password**:
   - Gmail hiển thị: `abcd efgh ijkl mnop` (có dấu cách)
   - Dùng trong `.env`: `abcdefghijklmnop` (bỏ hết dấu cách)

3. **App Password hết hạn**:
   - Nếu App Password hết hạn → Tạo mới
   - Cập nhật lại trong file `.env`
   - Restart backend server

## ✅ Kết quả mong đợi

Sau khi sửa đúng:
- ✅ Test email thành công
- ✅ Email verification được gửi ngay khi đăng ký
- ✅ Email đến hộp thư Gmail (có thể vào Spam/Promotions)

