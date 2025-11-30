# 🔧 Hướng Dẫn Sửa Lỗi 404 - Verification Link

## ❌ Lỗi

Khi click vào link xác thực trong email → **404 - File not found**

## ✅ Giải pháp nhanh

### Bước 1: Đảm bảo backend server đang chạy

```bash
cd backend
python manage.py runserver
```

Kiểm tra terminal hiển thị:
```
Starting development server at http://127.0.0.1:8000/
```

### Bước 2: Kiểm tra URL trong email

URL trong email phải có format:
```
http://localhost:8000/api/users/verify-email/{token}/
```

**QUAN TRỌNG**: 
- Phải có `http://localhost:8000` (không phải `http://127.0.0.1:8000`)
- Phải có trailing slash `/` ở cuối
- Token không được chứa `/` hoặc `.`

### Bước 3: Test link trong trình duyệt

1. Copy link từ email
2. Paste vào trình duyệt
3. Kiểm tra có redirect về login không

### Bước 4: Kiểm tra terminal backend

Khi click link, terminal backend sẽ hiển thị:
```
🔍 Verification request received: token=...
   Request path: /api/users/verify-email/.../
   Request method: GET
```

Nếu không thấy log này → Backend server không nhận được request (có thể do URL sai hoặc server không chạy)

## 🔍 Debug chi tiết

### Test 1: Kiểm tra route có hoạt động không

```bash
cd backend
python check-verification-url.py
```

Script sẽ hiển thị verification URL đầy đủ.

### Test 2: Test với curl (nếu có)

```bash
curl -I http://localhost:8000/api/users/verify-email/test-token/
```

Nếu thấy `302 Found` → Route hoạt động (redirect)
Nếu thấy `404 Not Found` → Route không tồn tại

### Test 3: Kiểm tra user có token không

```bash
cd backend
python check-recent-users.py
```

Script sẽ hiển thị các user mới đăng ký và token của họ.

## ⚠️ Lưu ý

1. **Backend phải chạy**: Link trỏ đến `localhost:8000`, nếu server không chạy sẽ bị 404
2. **URL phải đúng format**: Có trailing slash `/` ở cuối
3. **Token phải hợp lệ**: Không được chứa `/` hoặc `.`
4. **CORS**: Backend phải cho phép redirect từ frontend

## ✅ Sau khi sửa

1. Restart backend server
2. Đăng ký user mới
3. Kiểm tra email có link verification
4. Click link → Phải redirect về login với `verified=success&token=...`

## 🎯 Kết quả mong đợi

Sau khi click link:
- ✅ Backend verify user
- ✅ Redirect về: `http://localhost:3000/login?verified=success&token={access_token}`
- ✅ Frontend auto login và redirect về dashboard

