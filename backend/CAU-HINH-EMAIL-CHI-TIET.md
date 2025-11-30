# 📧 Hướng Dẫn Cấu Hình Email Chi Tiết

## 🔑 Hiểu về 2 loại email trong hệ thống

### 1. **EMAIL_HOST_USER** (Người GỬI - Sender)
- **Bắt buộc**: Phải là email **THẬT** có App Password
- **Chức năng**: Dùng để **GỬI** email đi
- **Ví dụ**: 
  - `tdyennhi0511@gmail.com` ✅
  - `trucnguyen102004@gmail.com` ✅
- **Yêu cầu**: Phải tạo App Password cho email này

### 2. **Recipients** (Người NHẬN - Recipients)
- **Không bắt buộc**: Có thể là bất kỳ email nào, kể cả plus addressing
- **Chức năng**: Là địa chỉ **NHẬN** email
- **Ví dụ**:
  - `mymymon109.dev+tech@gmail.com` ✅ (sẽ nhận tại `mymymon109.dev@gmail.com`)
  - `mymymon109.dev+finance@gmail.com` ✅
  - `trucnguyen102004.dev+user1@gmail.com` ✅ (sẽ nhận tại `trucnguyen102004@gmail.com`)
- **Không cần**: App Password cho các email này

## ✅ Cấu trúc email của bạn là ĐÚNG

### Tình huống 1: Dùng `tdyennhi0511@gmail.com` làm người gửi
```env
EMAIL_HOST_USER=tdyennhi0511@gmail.com
EMAIL_HOST_PASSWORD=app-password-cua-tdyennhi0511
```

**Người nhận có thể là:**
- `mymymon109.dev+tech@gmail.com` → Nhận tại `mymymon109.dev@gmail.com`
- `mymymon109.dev+finance@gmail.com` → Nhận tại `mymymon109.dev@gmail.com`
- `trucnguyen102004.dev+user1@gmail.com` → Nhận tại `trucnguyen102004@gmail.com`

### Tình huống 2: Dùng `trucnguyen102004@gmail.com` làm người gửi
```env
EMAIL_HOST_USER=trucnguyen102004@gmail.com
EMAIL_HOST_PASSWORD=app-password-cua-trucnguyen102004
```

**Người nhận có thể là:**
- `trucnguyen102004.dev+user1@gmail.com` → Nhận tại `trucnguyen102004@gmail.com`
- `mymymon109.dev+tech@gmail.com` → Nhận tại `mymymon109.dev@gmail.com`
- Bất kỳ email nào khác

## 🔧 Cách cấu hình

### Bước 1: Chọn email để làm người gửi

**Chọn 1 trong 2:**
- Option A: `tdyennhi0511@gmail.com` (nếu bạn đã có App Password)
- Option B: `trucnguyen102004@gmail.com` (nếu bạn muốn dùng email này)

### Bước 2: Tạo App Password cho email người gửi

1. Vào: https://myaccount.google.com/apppasswords
2. Đăng nhập với email bạn chọn (tdyennhi0511 HOẶC trucnguyen102004)
3. Tạo App Password:
   - **App**: Mail
   - **Device**: Other (Custom name) → Nhập "GoodCV"
4. Copy App Password (16 ký tự)

### Bước 3: Tạo file `backend/.env`

**Nếu dùng `tdyennhi0511@gmail.com`:**
```env
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=tdyennhi0511@gmail.com
EMAIL_HOST_PASSWORD=app-password-cua-tdyennhi0511
DEFAULT_FROM_EMAIL=tdyennhi0511@gmail.com
```

**Nếu dùng `trucnguyen102004@gmail.com`:**
```env
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=trucnguyen102004@gmail.com
EMAIL_HOST_PASSWORD=app-password-cua-trucnguyen102004
DEFAULT_FROM_EMAIL=trucnguyen102004@gmail.com
```

### Bước 4: Restart backend

```bash
# Dừng server (Ctrl+C)
cd backend
venv\Scripts\activate
python manage.py runserver
```

## 📬 Cách hoạt động

### Ví dụ: Gửi email cho `trucnguyen102004.dev+user1@gmail.com`

1. **Người gửi**: `tdyennhi0511@gmail.com` (hoặc `trucnguyen102004@gmail.com`)
2. **Người nhận**: `trucnguyen102004.dev+user1@gmail.com`
3. **Gmail tự động chuyển**: Email sẽ đến hộp thư `trucnguyen102004@gmail.com`
4. **Kết quả**: Người dùng đăng nhập `trucnguyen102004@gmail.com` sẽ thấy email

### Ví dụ: Gửi email cho `mymymon109.dev+tech@gmail.com`

1. **Người gửi**: `tdyennhi0511@gmail.com` (hoặc bất kỳ email nào có App Password)
2. **Người nhận**: `mymymon109.dev+tech@gmail.com`
3. **Gmail tự động chuyển**: Email sẽ đến hộp thư `mymymon109.dev@gmail.com`
4. **Kết quả**: Người dùng đăng nhập `mymymon109.dev@gmail.com` sẽ thấy email

## ⚠️ Lưu ý quan trọng

1. **EMAIL_HOST_USER** (người gửi):
   - Phải là email **THẬT** có App Password
   - Chỉ cần **1 email** để gửi tất cả email
   - Có thể dùng `tdyennhi0511@gmail.com` HOẶC `trucnguyen102004@gmail.com`

2. **Recipients** (người nhận):
   - Có thể là **bất kỳ email nào**, kể cả plus addressing
   - Không cần App Password
   - Gmail tự động chuyển về email gốc

3. **Plus Addressing**:
   - `trucnguyen102004.dev+user1@gmail.com` → Nhận tại `trucnguyen102004@gmail.com`
   - `mymymon109.dev+tech@gmail.com` → Nhận tại `mymymon109.dev@gmail.com`
   - Tất cả đều hoạt động bình thường

## 🔍 Kiểm tra

Sau khi cấu hình:

1. Đăng ký tài khoản với email: `trucnguyen102004.dev+user1@gmail.com`
2. Kiểm tra hộp thư: `trucnguyen102004@gmail.com`
3. Kiểm tra cả mục **Spam** và **Promotions**

## ❌ Vấn đề thường gặp

### Không nhận được email?

1. ✅ Kiểm tra `EMAIL_BACKEND` đã đổi từ `console` sang `smtp` chưa?
2. ✅ Kiểm tra App Password đã đúng chưa? (bỏ dấu cách)
3. ✅ Kiểm tra email người gửi đã có App Password chưa?
4. ✅ Kiểm tra file `.env` đã đúng format chưa?
5. ✅ Kiểm tra mục **Spam** và **Promotions** trong Gmail
6. ✅ Kiểm tra terminal backend có lỗi không?

