# 🔧 Sửa Lỗi 404 - Verification Link

## ❌ Vấn đề

Khi click vào link xác thực trong email, gặp lỗi **404 - File not found**.

## 🔍 Nguyên nhân có thể

1. **Backend server không chạy** - Link trỏ đến `http://localhost:8000` nhưng server không chạy
2. **URL pattern không match** - Regex pattern có thể không match với token
3. **Route chưa được đăng ký đúng** - ViewSet action chưa được register

## ✅ Giải pháp

### Bước 1: Kiểm tra backend server có chạy không

```bash
cd backend
python manage.py runserver
```

Đảm bảo server chạy trên port 8000:
```
Starting development server at http://127.0.0.1:8000/
```

### Bước 2: Test route verification

```bash
cd backend
python check-verification-url.py
```

Script sẽ hiển thị:
- User và token
- Verification URL đầy đủ
- Hướng dẫn test

### Bước 3: Test trong trình duyệt

1. Copy verification URL từ script
2. Mở trong trình duyệt
3. Kiểm tra có redirect về login không

### Bước 4: Kiểm tra URL pattern

Route hiện tại:
```python
@action(detail=False, methods=['get'], permission_classes=[AllowAny], url_path='verify-email/(?P<token>[^/.]+)')
```

URL sẽ là: `/api/users/verify-email/{token}/`

**Lưu ý**: Có trailing slash `/` ở cuối!

## 🔧 Nếu vẫn bị 404

### Kiểm tra 1: Backend server

```bash
# Terminal 1: Chạy backend
cd backend
python manage.py runserver

# Terminal 2: Test route
curl http://localhost:8000/api/users/verify-email/test-token/
```

### Kiểm tra 2: URL có đúng format không

URL đúng format:
```
http://localhost:8000/api/users/verify-email/{token}/
```

**QUAN TRỌNG**: Phải có trailing slash `/` ở cuối!

### Kiểm tra 3: Token có ký tự đặc biệt không

Token được tạo bằng `secrets.token_urlsafe(32)`, có thể chứa:
- Chữ cái (a-z, A-Z)
- Số (0-9)
- Dấu gạch dưới `_`
- Dấu gạch ngang `-`

URL pattern `[^/.]+` sẽ match tất cả ký tự trừ `/` và `.`

## ✅ Flow đúng

1. User click link: `http://localhost:8000/api/users/verify-email/{token}/`
2. Backend GET endpoint xử lý:
   - Tìm user với token
   - Verify user
   - Tạo JWT token
   - Redirect về: `http://localhost:3000/login?verified=success&token={access_token}`
3. Frontend Login.jsx xử lý token và auto login

## 🎯 Checklist

- [ ] Backend server đang chạy trên port 8000
- [ ] URL có trailing slash `/` ở cuối
- [ ] Token hợp lệ (không có `/` hoặc `.`)
- [ ] Route được đăng ký đúng trong ViewSet
- [ ] CORS cho phép redirect từ backend

## 💡 Debug

Nếu vẫn bị 404, thêm logging vào view:

```python
@action(detail=False, methods=['get'], permission_classes=[AllowAny], url_path='verify-email/(?P<token>[^/.]+)')
def verify_email_get(self, request, token=None):
    print(f'🔍 Received verification request: token={token}')
    # ... rest of code
```

Sau đó kiểm tra terminal backend khi click link.

