# 🔧 Sửa Lỗi: "address couldn't be found, or is unable to receive mail"

## ❌ Lỗi

Gmail báo lỗi:
```
Your message wasn't delivered to trucnguyen102004.dev+user4@gmail.com 
because the address couldn't be found, or is unable to receive mail.
```

## 🔍 Nguyên nhân

### 1. **Plus Addressing không hoạt động với `.dev`**

Email: `trucnguyen102004.dev+user4@gmail.com`

**Vấn đề:**
- Gmail có thể không nhận diện plus addressing khi có `.dev` trong tên email
- Hoặc email gốc `trucnguyen102004.dev@gmail.com` không tồn tại

**Giải pháp:**
- Dùng email gốc: `trucnguyen102004@gmail.com` (không có `.dev`)
- Hoặc dùng plus addressing với email gốc: `trucnguyen102004+user4@gmail.com`

### 2. **Email gốc không tồn tại**

Email gốc: `trucnguyen102004.dev@gmail.com` có thể không tồn tại.

**Kiểm tra:**
- Đăng nhập được `trucnguyen102004.dev@gmail.com` không?
- Nếu không → Email gốc không tồn tại

**Giải pháp:**
- Dùng email gốc thật: `trucnguyen102004@gmail.com`

### 3. **Format email sai**

Email có thể có:
- Dấu cách: `trucnguyen102004.dev user4@gmail.com` (sai)
- Ký tự không hợp lệ

**Giải pháp:**
- Email đúng: `trucnguyen102004.dev+user4@gmail.com` (không có dấu cách)

## ✅ Giải pháp

### Cách 1: Dùng email gốc (Khuyến nghị)

**Thay vì:** `trucnguyen102004.dev+user4@gmail.com`

**Dùng:** `trucnguyen102004+user4@gmail.com` (bỏ `.dev`)

Hoặc đơn giản: `trucnguyen102004@gmail.com`

### Cách 2: Kiểm tra email gốc có tồn tại không

1. Thử đăng nhập: `trucnguyen102004.dev@gmail.com`
2. Nếu không đăng nhập được → Email gốc không tồn tại
3. Dùng email gốc thật: `trucnguyen102004@gmail.com`

### Cách 3: Test format email

```bash
cd backend
python check-email-format.py
```

Nhập email để kiểm tra format và test gửi.

## 🔧 Cách sửa trong database

Nếu user đã được tạo với email sai, cần sửa:

### Option 1: Sửa email trong database

```bash
cd backend
python manage.py shell
```

```python
from accounts.models import User
user = User.objects.get(email='trucnguyen102004.dev+user4@gmail.com')
user.email = 'trucnguyen102004+user4@gmail.com'  # Bỏ .dev
user.save()
print(f"✅ Đã sửa email: {user.email}")
```

### Option 2: Xóa và tạo lại user

```python
from accounts.models import User
user = User.objects.get(email='trucnguyen102004.dev+user4@gmail.com')
user.delete()
print("✅ Đã xóa user. Vui lòng đăng ký lại với email đúng.")
```

## 📋 Email đúng format

### ✅ Email hợp lệ:
- `trucnguyen102004@gmail.com`
- `trucnguyen102004+user4@gmail.com`
- `trucnguyen102004+test@gmail.com`

### ❌ Email không hợp lệ:
- `trucnguyen102004.dev+user4@gmail.com` (nếu email gốc `trucnguyen102004.dev@gmail.com` không tồn tại)
- `trucnguyen102004.dev user4@gmail.com` (có dấu cách)
- `trucnguyen102004.dev+user4 @gmail.com` (có dấu cách)

## 🎯 Khuyến nghị

**Dùng email đơn giản:**
- `trucnguyen102004@gmail.com` (không có plus addressing)
- Hoặc `trucnguyen102004+user4@gmail.com` (plus addressing với email gốc thật)

**Tránh:**
- `trucnguyen102004.dev+user4@gmail.com` (nếu email gốc không tồn tại)

## ✅ Checklist

- [ ] Đã kiểm tra email gốc có tồn tại không
- [ ] Đã test format email bằng `check-email-format.py`
- [ ] Đã sửa email trong database nếu cần
- [ ] Đã thử đăng ký lại với email đúng format
- [ ] Đã test gửi email với email mới

